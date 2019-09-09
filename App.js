/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, PureComponent } from 'react';
import SplashScreen from 'react-native-splash-screen';
import NetworkState, { Settings } from 'react-native-network-state'
import {
  View,
  Text,
} from 'react-native';

class App extends PureComponent {
  componentDidMount = () => {
    SplashScreen.hide();
  }

  render() {
    return (
      <Fragment>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
          <Text>App</Text>
        </View>
        <NetworkState
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
        />
      </Fragment>

    )
  }
}

export default App;
