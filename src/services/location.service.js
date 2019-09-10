/**
 * Geolocation/Location service handler class
 */

import { PermissionsAndroid } from 'react-native';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation'
// import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

const DEFAULT_OPTIONS = {
    timeout: 4000,
    maximumAge: 1000,
    enableHighAccuracy: true
};

class LocationService {
    constructor() {
        this.LocationServiceStatus = {
            LOCATION_PERMISSION_NOT_AVAILABLE: 0,
            LOCATION_PERMISSION_DENIED_FOR_ALWAYS: 1,
            LOCATION_SEVICE_NOT_ENABLED: 2,
            LOCATON_SERVICE_SETTINGS_UNABLE_TO_OPEN: 3,
            LOCATION_SERVICE_AVAILABLE_TO_USE: 4
        };

        this.PermissionRequestStates = {
            UNABLE_TO_ASK_PERMISSION: 0,
            GOT_PERMISSION: 1,
            SOME_PERMISSION_DENIED: 2,
            NEVER_ASK_AGAIN: 3,
        };

        this.GPSRequestStates = {
            GPS_ON: 0,
            GPS_REQUEST_DENIED: 1,
            SETTINGS_UNAVAILABLE: 2,
            UNABLE_TO_OPEN_POPUP: 3,
        };

        this.ActionMap = [
            {
                id: 0,
                status: this.LocationServiceStatus.LOCATION_PERMISSION_NOT_AVAILABLE,
                title: 'Location permission requred',
                actionName: 'ALLOW',
                action: 'resolveLocationServiceState'

            },
            {
                id: 1,
                status: this.LocationServiceStatus.LOCATION_PERMISSION_DENIED_FOR_ALWAYS,
                title: 'Location permission requred',
                description: 'To enable, go to Settings and turn on Location.',
                actionName: 'OPEN SETTINGS',
                action: 'showAppSettings'
            },
            {
                id: 2,
                status: this.LocationServiceStatus.LOCATION_SEVICE_NOT_ENABLED,
                title: 'GPS turned off',
                actionName: 'TURN ON GPS',
                action: 'askToEnableGPS'
            },
            {
                id: 3,
                status: this.LocationServiceStatus.LOCATON_SERVICE_SETTINGS_UNABLE_TO_OPEN,
                title: 'Unable to start GPS service.',
                description: 'To enable, go to Settings and turn on Location manually.',
                actionName: 'OPEN SETTINGS',
                action: 'showLocationSettings'
            }
        ];
    }

    getActionFromStatusCode = (statusCode) => {
        let myAction = null;
        this.ActionMap.forEach((action) => {
            if (action.status == statusCode) {
                myAction = action;
            }
        });

        return myAction;
    }

    showAppSettings = () => {
        try {
            BackgroundGeolocation.showAppSettings();
        } catch (err) { }
    }

    showLocationSettings = () => {
        try {
            BackgroundGeolocation.showLocationSettings();
        } catch (err) { }
    }

    readyToGetCurrentLocation = () => {
        return new Promise((resolve) => {
            BackgroundGeolocation.checkStatus((status) => {
                resolve(status);
            });
        });
    }

    handleHasGPSPermissionCase = (resolve, responseStatus) => {
        // GPS is on
        if (responseStatus.locationServicesEnabled) {
            resolve(this.LocationServiceStatus.LOCATION_SERVICE_AVAILABLE_TO_USE);
        }

        /**
         * Case when location service is not enabled
         */
        this.askToEnableGPS()
            .then(({ success, gpsStatus }) => {
                if (success) {
                    resolve(this.LocationServiceStatus.LOCATION_SERVICE_AVAILABLE_TO_USE);
                }

                //user denied to enable location service
                if (gpsStatus == this.GPSRequestStates.GPS_REQUEST_DENIED) {
                    resolve(this.LocationServiceStatus.LOCATION_SEVICE_NOT_ENABLED);
                }

                //unable to start/open popup/open settings
                if (gpsStatus == this.GPSRequestStates.UNABLE_TO_OPEN_POPUP) {
                    resolve(this.LocationServiceStatus.LOCATON_SERVICE_SETTINGS_UNABLE_TO_OPEN);
                }
            });
    }

    resolveLocationServiceState = () => (
        new Promise((resolve) => {
            BackgroundGeolocation.checkStatus(
                (responseStatus) => {
                    /**
                     * Case When location service permission is available
                     */
                    if (responseStatus.hasPermission) {
                        this.handleHasGPSPermissionCase(resolve, responseStatus);
                    }

                    /**
                     * Case When location service permission is not available
                     */
                    if (!responseStatus.hasPermission) {
                        this.askPermission().then(({ success, permissionStatus }) => {

                            /**
                             * Case when user has given both permissions
                             */
                            if (success) { //got location permission
                                this.handleHasGPSPermissionCase(resolve, responseStatus);
                            }

                            /**
                             * Case when some exception got cought while asking location permission
                             */
                            if (!success && permissionStatus == this.PermissionRequestStates.UNABLE_TO_ASK_PERMISSION) {
                                resolve(this.LocationServiceStatus.LOCATION_PERMISSION_NOT_AVAILABLE);
                            }

                            /**
                             * Case when some location permission got denied
                             */
                            if (!success && permissionStatus == this.PermissionRequestStates.SOME_PERMISSION_DENIED) {
                                resolve(this.LocationServiceStatus.LOCATION_PERMISSION_NOT_AVAILABLE);
                            }

                            /**
                             * Case when user selected 'never ask again'
                             */
                            if (!success && permissionStatus == this.PermissionRequestStates.NEVER_ASK_AGAIN) {
                                resolve(this.LocationServiceStatus.LOCATION_PERMISSION_DENIED_FOR_ALWAYS);
                            }
                        });
                    }
                }
            );
        })
    )

    askPermission = () => {
        const { PERMISSIONS, RESULTS } = PermissionsAndroid;
        const { ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION } = PERMISSIONS;
        const { GRANTED, DENIED, NEVER_ASK_AGAIN } = RESULTS;

        return new Promise((resolve) => {
            try {
                PermissionsAndroid.requestMultiple([ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION])
                    .then((granted) => {
                        const permissionCoarse = granted['android.permission.ACCESS_COARSE_LOCATION'];
                        const permissionFineLocation = granted['android.permission.ACCESS_FINE_LOCATION'];
                        /**
                         * Case when both permission granted
                         */
                        if (permissionCoarse == GRANTED && permissionFineLocation == GRANTED) {
                            resolve({ success: true, permissionStatus: this.PermissionRequestStates.GOT_PERMISSION });
                        }

                        /**
                         * Case: 'never ask again'
                         */
                        if (permissionCoarse == NEVER_ASK_AGAIN || permissionFineLocation == NEVER_ASK_AGAIN) {
                            resolve({ success: false, permissionStatus: this.PermissionRequestStates.NEVER_ASK_AGAIN });
                        }

                        /**
                         * Case when some permission denied
                         */
                        if (permissionCoarse == DENIED || permissionFineLocation == DENIED) {
                            resolve({ success: false, permissionStatus: this.PermissionRequestStates.SOME_PERMISSION_DENIED });
                        }
                    });
            } catch (e) {
                resolve({ success: false, permissionStatus: this.PermissionRequestStates.UNABLE_TO_ASK_PERMISSION });
            }
        });
    }

    askToEnableGPS = () => new Promise((resolve) => {
        // RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
        //     .then(() => {
        //         resolve({ success: true, gpsStatus: this.GPSRequestStates.GPS_ON });
        //     })
        //     .catch(err => {
        //         switch (err.code) {
        //             case 'ERR00':
        //                 resolve({ success: false, gpsStatus: this.GPSRequestStates.GPS_REQUEST_DENIED });
        //                 break;
        //             case 'ERR01':
        //                 resolve({ success: false, gpsStatus: this.GPSRequestStates.SETTINGS_UNAVAILABLE });
        //                 break;
        //             case 'ERR02':
        //                 resolve({ success: false, gpsStatus: this.GPSRequestStates.UNABLE_TO_OPEN_POPUP });
        //                 break;
        //             default:
        //         }
        //     });
    });

    /**
     * Get device's current location
     * @param  {Object} options=DEFAULT_OPTIONS
     * 
     * @returns {Promise}
     */
    getCurrentLocation = (options = DEFAULT_OPTIONS) => (
        new Promise(
            async (resolve) => {
                const result = await this.readyToGetCurrentLocation();
                if (!(result.hasPermissions && result.locationServicesEnabled)) {
                    resolve({ success: false, message: 'SERIVCE_UNAVAILABLE' });
                }

                BackgroundGeolocation.getCurrentLocation(
                    (location) => {
                        resolve({ success: true, location });
                    }, (error) => {
                        resolve({ success: false, error });
                    },
                    options
                );
            })
    )
}

export default LocationService;