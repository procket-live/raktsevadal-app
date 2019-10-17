import React, { Component } from 'react';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import firebase from 'react-native-firebase';

import {
    View,
} from 'react-native';
import Geocoder from 'react-native-geocoder';

import { resetToScreen } from '../../services/navigation.service';
import APP from '../../constants/app.constant';
import { AccessNestedObject } from '../../utils/common.util';

Geocoder.fallbackToGoogle('AIzaSyCF472Z-XkxbQTeTmbfnZkNIKp7mnA-2cA');

class ResolveAppScene extends Component {
    init = () => {
        const { user, isFirstTime } = this.props;

        if (isFirstTime) {
            resetToScreen('OnBoarding')
            SplashScreen.hide();
            return;
        }

        if (user == null) {
            resetToScreen('Login')
        } else {
            APP.TOKEN = user.token;
            if (user.name == null) {
                resetToScreen('UpdateUserDetail')
            } else {
                resetToScreen('ResolveLocation');
            }
        }

        SplashScreen.hide();
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

        this.init()
    }

    componentDidMount = () => {
        this.getInitialNotification();
    }

    render() {
        return (
            <View style={{ flex: 1 }} />
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    isFirstTime: state.isFirstTime
});

export default connect(mapStateToProps)(ResolveAppScene);
