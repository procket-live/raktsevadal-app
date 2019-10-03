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
import { PRIMARY_COLOR, GREY_1, ON_PRIMARY, GREY_2 } from '../constants/color.constant';
import { HomeIcon, DropIcon, BloodDonationIcon, NotificationIcon, ManUserIcon, InfoIcon } from '../config/image.config';

import HomeScene from '../scenes/home-scene/home.scene';
import AddBloodRequirementScene from '../scenes/add-blood-requirement-scene/add-blood-requirement.scene';
import ChooseLocationScene from '../scenes/choose-location-scene/choose-location.scene';

console.disableYellowBox = true;
const RootTabs = createBottomTabNavigator(
    {
        Home: { screen: HomeScene },
        Notification: { screen: OnBoardingScene },
        Info: { screen: OnBoardingScene },
    },
    {
        initialRouteName: 'Home',
        order: ['Home', 'Notification', 'Info'],
        backBehavior: 'initialRoute',
        lazy: true,
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
                const { routeName } = navigation.state;
                let icon;
                switch (routeName) {
                    case 'Home':
                        icon = HomeIcon;
                        break;
                    case 'Notification':
                        icon = NotificationIcon;
                        break;
                    case 'Info':
                        icon = InfoIcon;
                        break;
                }

                return (
                    <Image
                        style={{ width: 25, height: 25, resizeMode: 'contain' }}
                        source={icon()}
                        tintColor={focused ? PRIMARY_COLOR : GREY_2}
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
        },
        AddBloodRequirement: {
            screen: AddBloodRequirementScene,
            navigationOptions: {
                headerStyle: {
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                title: "Add blood requirement"
            }
        },
        ChooseLocationScene: {
            screen: ChooseLocationScene,
            navigationOptions: {
                headerStyle: {
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                title: "Select location"
            }
        }
    },
    {
        initialRouteName: 'ResolveApp',
    }
)

export default createAppContainer(RootNavigator);