import React from 'react';
import { Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs'

import ResolveAppScene from '../scenes/resolve-app-scene/resolve-app.scene';
import ResolveLocationScene from '../scenes/resolve-location-scene/resolve-location.scene';
import LoginScene from '../scenes/login-scene/login.scene';
import OnBoardingScene from '../scenes/onboarding-scene/onboarding.scene';
import UpdateUserDetailScene from '../scenes/update-user-detail-scene/update-user-detail.scene';
import { PRIMARY_COLOR, GREY_1, ON_PRIMARY } from '../constants/color.constant';
import { HomeIcon, DropIcon, BloodDonationIcon, NotificationIcon, ManUserIcon } from '../config/image.config';
console.disableYellowBox = true;
const RootTabs = createBottomTabNavigator(
    {
        Feed: { screen: OnBoardingScene },
        'My donation': { screen: OnBoardingScene },
        Request: { screen: OnBoardingScene },
        Notification: { screen: OnBoardingScene },
        Profile: { screen: OnBoardingScene },
    },
    {
        initialRouteName: 'Feed',
        order: ['Feed', 'My donation', 'Request', 'Notification', 'Profile'],
        backBehavior: 'initialRoute',
        lazy: true,
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let icon;
                switch (routeName) {
                    case 'Feed':
                        icon = HomeIcon;
                        break;
                    case 'My donation':
                        icon = DropIcon;
                        break;
                    case 'Request':
                        icon = BloodDonationIcon;
                        break;
                    case 'Notification':
                        icon = NotificationIcon;
                    case 'Profile':
                        icon = ManUserIcon;
                        break;
                }

                return (
                    <Image
                        style={{ width: 25, height: 25, resizeMode: 'contain' }}
                        source={icon()}
                    />
                );
            },
        }),
        tabBarOptions: {
            activeTintColor: PRIMARY_COLOR,
            inactiveTintColor: GREY_1,
            allowFontScaling: false,
            showLabel: false,
            style: {
                paddingTop: 5,
                paddingBottom: 5,
                height: 60,
                backgroundColor: ON_PRIMARY,
                // borderTopWidth: 1,
                // borderTopColor: CLAY,r
                elevation: 0,
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
        initialRouteName: 'ResolveApp'
    }
)

export default createAppContainer(RootNavigator);