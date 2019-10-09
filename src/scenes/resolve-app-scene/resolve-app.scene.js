/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import NetworkState from 'react-native-network-state'
import LottieView from 'lottie-react-native';
import MapView from 'react-native-maps';
import {
    View,
    Text,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Geocoder from 'react-native-geocoder';
import RNBottomActionSheet from 'react-native-bottom-action-sheet';

import NotifyService from '../../services/notify.service.js';
import { translate } from '../../services/translation.service.js';
import { resetToScreen } from '../../services/navigation.service.js';
import APP from '../../constants/app.constant';

var NY = {
    lat: 12.995466299999999,
    lng: 77.7009697
};

Geocoder.fallbackToGoogle('');

let AlertView = RNBottomActionSheet.AlertView

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

    componentDidMount = async () => {
        setTimeout(() => {
            this.init()
        }, 100);
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
