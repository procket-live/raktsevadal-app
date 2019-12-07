import React, { Component } from 'react';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import firebase from 'react-native-firebase';
import Geocoder from 'react-native-geocoder';

import { resetToScreen } from '../../services/navigation.service';
import APP from '../../constants/app.constant';
import { AccessNestedObject } from '../../utils/common.util';
import PrivateApi from '../../api/api.private';
import { setUserAction } from '../../action/user.action';

Geocoder.fallbackToGoogle(APP.GOOGLE_KEY);

class ResolveAppScene extends Component {
    init = () => {
        const { user, isFirstTime } = this.props;
        const userId = AccessNestedObject(user, '_id');

        if (isFirstTime) {
            resetToScreen('OnBoarding')
            SplashScreen.hide();
            return;
        }

        if (user == null) {
            resetToScreen('Login')
        } else {
            user.name == null ? resetToScreen('UpdateUserDetail') : resetToScreen('ResolveLocation');
            this.syncUser(user.token);
        }

        if (userId) {
            const analytics = firebase.analytics();
            analytics.logEvent('APP_OPEN');
            analytics.setUserId(userId);
            analytics.setUserProperty('name', AccessNestedObject(user, 'name'));
        }

        SplashScreen.hide();
    }

    syncUser = async (token) => {
        const result = await PrivateApi.getUser();
        if (result.success) {
            const user = AccessNestedObject(result, 'response', {});
            this.props.setUserAction(Object.assign(user, { token }));
        }
    }

    getInitialNotification = async () => {
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const data = notificationOpen.notification.data;

            if (AccessNestedObject(data, 'blood_donation_request_id')) {
                APP.REDIRECT_TO = {
                    route: 'BloodRequest',
                    payload: {
                        id: AccessNestedObject(data, 'blood_donation_request_id')
                    }
                }
            }

            if (AccessNestedObject(data, 'show_notification_scene')) {
                APP.REDIRECT_TO = {
                    tab: 'Notification'
                }
            }
        }

        this.getInitialLink();
    }

    getInitialLink = async () => {
        const link = await firebase.links().getInitialLink();
        if (link) {
            if (link.includes('bloodRequest')) {
                const parts = link.split('/');
                const id = parts[4];

                APP.REDIRECT_TO = {
                    route: 'BloodRequest',
                    payload: {
                        id
                    }
                }
            }

            // if (link.includes('user')) {
            //     const parts = link.split('/');
            //     const id = parts[4];

            //     APP.REDIRECT_TO = {
            //         route: 'User',
            //         payload: {
            //             id
            //         }
            //     }
            // }
        }

        this.init()
    }

    componentDidMount = () => {
        this.getInitialNotification();
    }

    render() {
        return (
            <>
            </>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    isFirstTime: state.isFirstTime
});

export default connect(mapStateToProps, { setUserAction })(ResolveAppScene);
