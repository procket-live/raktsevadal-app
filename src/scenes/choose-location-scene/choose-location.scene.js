import React, { PureComponent } from 'react';
import { View, StyleSheet, TextInput, Image } from 'react-native';
import Map from 'react-native-maps';
import Geocoder from 'react-native-geocoder';

import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { ON_PRIMARY } from '../../constants/color.constant';
import WideButton from '../../components/wide-button-component/wide-button.component';
import { ProgressBarLottie } from '../../config/lottie.config';
import LocationService from '../../services/location.service';
import { AccessNestedObject } from '../../utils/common.util';
import NotifyService from '../../services/notify.service';
import { DropIcon, MapMarkerIcon } from '../../config/image.config';
import { navigatePop } from '../../services/navigation.service';

class ChooseLocationScene extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            gotLocation: false,
            loading: true,
            location: {

            },
            address: '',
            suggestions: []
        }
    }

    componentDidMount = () => {
        const locationService = new LocationService();
        locationService.readyToGetCurrentLocation().then((readyToFetchCurrentLocation) => {
            if (!(readyToFetchCurrentLocation.hasPermissions && readyToFetchCurrentLocation.locationServicesEnabled)) {
                NotifyService.notify({
                    title: 'GPS TURNED OFF!',
                    message: 'Please start GPS to proceed',
                    type: 'warn',
                });
                return;
            }

            locationService.getCurrentLocation().then((location) => {
                if (location.success) {
                    this.setState({
                        location: {
                            latitude: AccessNestedObject(location, 'location.latitude', 0.0),
                            longitude: AccessNestedObject(location, 'location.longitude', 0.0),
                        }
                    }, this.fetchAddressFromLocation)
                    this.animateToLocation();
                    this.setState({ gotLocation: true })
                }
            })
        })
    }

    fetchAddressFromLocation = () => {
        const { location } = this.state;
        const { latitude, longitude } = location;
        console.log('latuuuuu', location)
        Geocoder.geocodePosition({ lat: latitude, lng: longitude }).then((addresses) => {
            if (!addresses.length) {
                NotifyService.notify({
                    title: 'Error !',
                    message: 'Unable to get address',
                    type: 'error',
                });
            }

            const address = AccessNestedObject(addresses, '0.formattedAddress');
            this.setState({ address })
        })
    }

    RenderSearchInput = () => {
        return (
            <View style={styles.inputContainer} >

            </View>
        )
    }

    changeAddressText = (address) => {
        this.setState({ address }, this.fetchSuggestions)
    }

    fetchSuggestions = () => {
        const { address } = this.state;

        Geocoder.geocodeAddress(String(address)).then((results) => {
            console.log('addressssss', results);
        })
            .catch(err => console.log(err))
    }

    getInitialRegion = () => {
        return {
            region: {
                latitude: 25.3445,
                longitude: 72.6254,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
        }
    }

    getRegion = () => {
        return {
            ...this.state.location,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        }
    }

    onRegionChange = (region) => {
        this.setState({
            location: {
                latitude: AccessNestedObject(region, 'latitude', 0.0),
                longitude: AccessNestedObject(region, 'longitude', 0.0)
            },
        }, this.fetchAddressFromLocation);
    }

    animateToLocation = () => {
        const { location } = this.state;
        const { latitude, longitude } = location;

        this.map && this.map.animateToCoordinate({
            latitude,
            longitude
        });
    }

    renderMap = () => {
        this.setState({ showMap: true })
    }

    proceed = () => {
        const callback = this.props.navigation.getParam('callback');
        if (callback && typeof callback == 'function') {
            callback({
                ...this.state.location,
                address: this.state.address
            })
        }
        navigatePop();
    }

    render() {
        return (
            <View style={styles.container}>
                <Map
                    ref={(ref) => this.map = ref}
                    style={styles.map}
                    initialRegion={{
                        latitude: this.props.latitude || 37.78825,
                        longitude: this.props.longitude || -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    onRegionChangeComplete={this.onRegionChange}
                    onMapReady={this.renderMap}
                />
                <Image
                    source={MapMarkerIcon()}
                    style={styles.marker}
                />
                <TextInput
                    style={styles.inputContainer}
                    value={this.state.address}
                    onChange={this.changeAddressText}
                />
                <WideButton
                    buttonStyle={styles.wideButton}
                    text="Select location"
                    disabled={!this.state.gotLocation}
                    onPress={this.proceed}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        width: widthPercentageToDP('100'),
        height: heightPercentageToDP('100') - 50
    },
    inputContainer: {
        width: widthPercentageToDP('90'),
        height: 50,
        elevation: 3,
        backgroundColor: ON_PRIMARY,
        top: 30,
        left: widthPercentageToDP('5'),
        right: widthPercentageToDP('5'),
        position: 'absolute'
    },
    wideButton: {
        position: 'absolute',
        bottom: 0,
        width: widthPercentageToDP('100'),
        height: 50
    },
    marker: {
        position: 'absolute',
        width: 30,
        height: 30,
        left: widthPercentageToDP('50') - 15,
        top: heightPercentageToDP('50') - 15
    }
})

export default ChooseLocationScene;
