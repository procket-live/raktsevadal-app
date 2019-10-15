/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, PureComponent } from 'react';
import DropdownAlert from 'react-native-dropdownalert';
import { Provider as ReduxProvider } from 'react-redux';
import GlobalFont from 'react-native-global-font'
import { PersistGate } from 'redux-persist/integration/react';
import * as RNLocalize from "react-native-localize";

import RootNavigation from './src/navigation/index.navigation';
import { setTopLevelNavigator } from './src/services/navigation.service';
import NotifyService from './src/services/notify.service';
import store, { persistor } from './src/store/index.store';
import { setI18nConfig } from './src/services/translation.service';

class App extends PureComponent {
  constructor(props) {
    super(props);
    setI18nConfig(); // set initial config
  }

  componentDidMount() {
    console.log('global.HermesInternal', global.HermesInternal);
    RNLocalize.addEventListener('change', this.handleLocalizationChange);
    GlobalFont.applyGlobal('Noway')
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener('change', this.handleLocalizationChange);
  }

  handleLocalizationChange = () => {
    setI18nConfig();
    this.forceUpdate();
  }

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
