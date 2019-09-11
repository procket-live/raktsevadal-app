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
import firebase from 'react-native-firebase';
import MapView from 'react-native-maps';
import {
    View,
    Text,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Geocoder from 'react-native-geocoder';

import NotifyService from '../../services/notify.service.js';
import { translate } from '../../services/translation.service.js';

var NY = {
    lat: 12.995466299999999,
    lng: 77.7009697
};

Geocoder.fallbackToGoogle('');

class ResolveApp extends PureComponent {
    componentDidMount = async () => {
        SplashScreen.hide();

        setTimeout(() => {
            NotifyService.notify({ title: 'Yoooo', message: 'Yo BOOOOY!!!!', type: 'success' })
        }, 2000)

        const fcmToken = await firebase.messaging().getToken();
        console.log('fcmToken', fcmToken)

        firebase.auth().signInWithPhoneNumber('+919731702355')
            .then(confirmResult => {
                console.log('confirmResult', confirmResult);

                confirmResult.confirm('123456')
                    .then(user => { console.log('user', user) })
                    .catch(error => { })
            })
            .catch(error => { });

        // ImagePicker.openPicker({
        //     width: 300,
        //     height: 400,
        //     includeBase64: true
        // }).then(image => {
        //     firebase.storage().ref('/uploadOk.png')
        //         .putFile(image.path)
        //         .then((res) => {
        //             console.log('res', res);
        //         })
        //         .catch((err) => {
        //             console.log('err', err);
        //         })
        // });


        Geocoder.geocodePosition(NY).then(res => {
            console.log('res', res);
        })
            .catch(err => console.log(err))


        // Address Geocoding
        Geocoder.geocodeAddress('jalore').then(res => {
            console.log('fdfdsf', res)
            // res is an Array of geocoding object (see below)
        })
            .catch(err => console.log(err))


    }

    render() {
        return (
            <Fragment>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Text>{translate('hello')}</Text>
                </View>
                <NetworkState
                    style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
                />
                <LottieView source={require('../../assets/lottie/offline.json')} autoPlay />

                <MapView
                    style={{ width: 200, height: 200 }}
                    initialRegion={{
                        latitude: NY.lat,
                        longitude: NY.lng,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            </Fragment>

        )
    }
}

export default ResolveApp;
