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
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import RootNavigation from './src/navigation/index.navigation';
import { setTopLevelNavigator } from './src/services/navigation.service';
import NotifyService from './src/services/notify.service';
import store, { persistor } from './src/store/index.store';

class App extends PureComponent {
  render() {
    return (
      <Fragment>
        <ReduxProvider
          store={store}
        >
          <PersistGate
            loading={null}
            persistor={persistor}
          >
            <RootNavigation
              ref={navigatorRef => {
                setTopLevelNavigator(navigatorRef);
              }}
            />
          </PersistGate>
        </ReduxProvider>
        <DropdownAlert ref={ref => NotifyService.register(ref)} />
      </Fragment>

    )
  }
}

export default App;
