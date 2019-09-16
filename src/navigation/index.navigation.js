import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs'

import ResolveAppScene from '../scenes/resolve-app-scene/resolve-app.scene';
import ResolveLocationScene from '../scenes/resolve-location-scene/resolve-location.scene';
import LoginScene from '../scenes/login-scene/login.scene';
import OnBoardingScene from '../scenes/onboarding-scene/onboarding.scene';
import UpdateUserDetailScene from '../scenes/update-user-detail-scene/update-user-detail.scene';
import { PRIMARY_COLOR, GREY_1, ON_PRIMARY } from '../constants/color.constant';

const RootTabs = createBottomTabNavigator(
    {
        Feed: { screen: ResolveAppScene },
        Requests: { screen: ResolveAppScene },
        CreateNewRequest: { screen: ResolveAppScene },
        Profile: { screen: ResolveAppScene },
    },
    {
        initialRouteName: 'Feed',
        order: ['Feed', 'Requests', 'CreateNewRequest', 'Profile'],
        backBehavior: 'initialRoute',
        lazy: true,
        defaultNavigationOptions: ({ navigation }) => ({
            // tabBarIcon: ({ focused, horizontal, tintColor }) => {
            //     const { routeName } = navigation.state;
            //     let icon;
            //     switch (routeName) {
            //         case 'Play':
            //             icon = 'gamepad';
            //             break;
            //         case 'Tournaments':
            //             icon = 'whatshot';
            //             break;
            //         case 'Wallet':
            //             icon = 'blur-circular';
            //             break;
            //         case 'Account':
            //             icon = 'person'
            //             break;
            //     }

            //     return (
            //         <MaterialIcons
            //             name={icon}
            //             size={25}
            //             iconStyle='outline'
            //             color={tintColor}
            //         />
            //     );
            // },
        }),
        tabBarOptions: {
            activeTintColor: PRIMARY_COLOR,
            inactiveTintColor: GREY_1,
            allowFontScaling: false,
            showLabel: true,
            style: {
                paddingTop: 5,
                paddingBottom: 5,
                height: 60,
                backgroundColor: ON_PRIMARY,
                // borderTopWidth: 1,
                // borderTopColor: CLAY,r
                elevation: 2,
            }
        },
    }
);


const RootNavigator = createStackNavigator(
    {
        Root: {
            screen: RootTabs,
            navigationOptions: {
                header: null,
            }
        },
        ResolveApp: {
            screen: ResolveAppScene,
            navigationOptions: {
                header: null,
            }
        },
        Login: {
            screen: LoginScene,
            navigationOptions: {
                header: null,
            }
        },
        OnBoarding: {
            screen: OnBoardingScene,
            navigationOptions: {
                header: null,
            }
        },
        UpdateUserDetail: {
            screen: UpdateUserDetailScene,
            navigationOptions: {
                header: null,
            }
        },
        ResolveLocation: {
            screen: ResolveLocationScene,
            navigationOptions: {
                header: null,
            }
        }
    },
    {
        initialRouteName: 'Root'
    }
)

export default createAppContainer(RootNavigator);