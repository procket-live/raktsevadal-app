/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, PureComponent } from 'react';
import SplashScreen from 'react-native-splash-screen';
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
        <Text>App</Text>
      </View>
    )
  }
}

export default App;
