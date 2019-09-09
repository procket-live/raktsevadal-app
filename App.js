/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, PureComponent } from 'react';
import SplashScreen from 'react-native-splash-screen';
import DropdownAlert from 'react-native-dropdownalert';

import RootNavigation from './src/navigation/index.navigation';
import { setTopLevelNavigator } from './src/services/navigation.service';
import NotifyService from './src/services/notify.service';

class App extends PureComponent {
  render() {
    return (
      <Fragment>
        <RootNavigation
          ref={navigatorRef => {
            setTopLevelNavigator(navigatorRef);
          }}
        />
        <DropdownAlert ref={ref => NotifyService.register(ref)} />
      </Fragment>

    )
  }
}

export default App;
