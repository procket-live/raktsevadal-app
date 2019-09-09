/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, PureComponent } from 'react';
import SplashScreen from 'react-native-splash-screen';
import NetworkState from 'react-native-network-state'
import LottieView from 'lottie-react-native';
import {
    View,
    Text,
} from 'react-native';
import NotifyService from '../../services/notify.service.js';

class ResolveApp extends PureComponent {
    componentDidMount = () => {
        SplashScreen.hide();

        setTimeout(() => {
            NotifyService.notify({ title: 'Yoooo', message: 'Yo BOOOOY!!!!', type: 'success' })
        }, 2000)
    }

    render() {
        return (
            <Fragment>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Text>Resolve App</Text>
                </View>
                <NetworkState
                    style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
                />
                <LottieView source={require('../../assets/lottie/offline.json')} autoPlay />
            </Fragment>

        )
    }
}

export default ResolveApp;