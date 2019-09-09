import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import ResolveApp from '../scenes/resolve-app-scene/resolve-app.scene';
import LoginScene from '../scenes/login-scene/login.scene';

const RootNavigator = createStackNavigator(
    {
        ResolveApp: {
            screen: ResolveApp,
            navigationOptions: {
                header: null,
            }
        },
        Login: {
            screen: LoginScene,
            navigationOptions: {
                header: null,
            }
        }
    },
    {
        initialRouteName: 'ResolveApp'
    }
)

export default createAppContainer(RootNavigator);