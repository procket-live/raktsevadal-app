import React from 'react';
import { Image, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs'
import AsyncStorage from '@react-native-community/async-storage';
import { createDrawerNavigator } from 'react-navigation-drawer';

import ResolveLocationScene from '../scenes/resolve-location-scene/resolve-location.scene';
import LoginScene from '../scenes/login-scene/login.scene';
import OnBoardingScene from '../scenes/onboarding-scene/onboarding.scene';
import UpdateUserDetailScene from '../scenes/update-user-detail-scene/update-user-detail.scene';
import { PRIMARY_COLOR, GREY_1, ON_PRIMARY, GREY_2 } from '../constants/color.constant';
import { HomeIcon, InfoIcon, HospitalIcon, SettingsIcon, UserIcon, NewsFeedIcon, BellIcon, AddIcon, GearIcon } from '../config/image.config';

import HomeScene from '../scenes/home-scene/home.scene';
import AddBloodRequirementScene from '../scenes/add-blood-requirement-scene/add-blood-requirement.scene';
import ChooseLocationScene from '../scenes/choose-location-scene/choose-location.scene';
import BloodRequestScene from '../scenes/blood-request-scene/blood-request.scene';
import DonersTabsScene from '../scenes/doners-tabs-scene/donersTabs.scene';
import TermsAndConditionScene from '../scenes/terms-and-condition-scene/terms-and-condition.scene';
import AboutUsScene from '../scenes/about-us-scene/about-us.scene';
import NotificationScene from '../scenes/notification-scene/notification.scene';
import NotificationIconComponent from '../components/notification-icon-component/notification-icon.component';
import FullScreen from '../scenes/full-screen-scene/full-screen.scene';
import ProfileScene from '../scenes/profile-scene/profile.scene';
import SideDrawerComponent from '../components/side-drawer-component/side-drawer.component';
import NewsFeed from '../scenes/newsfeed-scene/newsfeed.scene';
import CampDescriptionScene from '../scenes/camp-description-scene/camp-description.scene';
import AddPostScene from '../scenes/add-post-scene/add-post.scene';

console.disableYellowBox = true;
const RootTabs = createBottomTabNavigator(
    {
        Home: { screen: HomeScene },
        Newsfeed: { screen: NewsFeed },
        Add: { screen: AddBloodRequirementScene },
        Notification: { screen: NotificationScene },
        Profile: { screen: ProfileScene }
    },
    {
        initialRouteName: 'Home',
        order: ['Home', 'Newsfeed', 'Add', 'Notification', 'Profile'],
        backBehavior: 'initialRoute',
        lazy: true,
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused }) => {
                const { routeName } = navigation.state;
                let icon;
                switch (routeName) {
                    case 'Home':
                        icon = HomeIcon;
                        break;
                    case 'Notification':
                        return (
                            <NotificationIconComponent focused={focused} />
                        )
                    case 'Newsfeed':
                        icon = NewsFeedIcon;
                        break;
                    case 'Profile':
                        icon = UserIcon;
                        break;
                    case 'Add':
                        icon = AddIcon;
                        break;
                }

                return (
                    <View style={focused ? { borderBottomWidth: 2, paddingBottom: 2, borderBottomColor: PRIMARY_COLOR, marginBottom: -4 } : null} >
                        <Image
                            style={{ width: 25, height: 25, resizeMode: 'contain' }}
                            source={icon()}
                        />
                    </View>
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
                elevation: 0,
            }
        },
    }
);


const RootNavigator = createStackNavigator(
    {
        Empty: {
            screen: () => <></>,
            navigationOptions: {
                header: null
            }
        },
        Root: {
            screen: RootTabs,
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
        },
        BloodRequest: {
            screen: BloodRequestScene,
            navigationOptions: {
                headerStyle: {
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                title: "Blood Request"
            }
        },
        DonersTabs: {
            screen: DonersTabsScene,
            navigationOptions: {
                headerStyle: {
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                title: "Doners"
            }
        },
        TermsAndCondition: {
            screen: TermsAndConditionScene,
            navigationOptions: {
                headerStyle: {
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                title: "Terms and Conditions"
            }
        },
        AboutUs: {
            screen: AboutUsScene,
            navigationOptions: {
                headerStyle: {
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                title: "About us"
            }
        },
        FullScreen: {
            screen: FullScreen,
            navigationOptions: {
                headerStyle: {
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                title: "Medical document"
            }
        },
        CampDescription: {
            screen: CampDescriptionScene,
            navigationOptions: {
                headerStyle: {
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                title: "Blood Campaign"
            }
        },
        AddPost: {
            screen: AddPostScene,
            navigationOptions: {
                headerStyle: {
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                title: "Add post"
            }
        }
    },
    {
        initialRouteName: 'AddPost',
    }
)

const DrawerNavigator = createDrawerNavigator({
    'App Home': {
        screen: RootNavigator
    },
    // Volunteer: ProfileScene,
    // // Language: ProfileScene,
    // 'About us': AboutUsScene,
    // 'TNC': TermsAndConditionScene,
    // 'ShareApp': ,
    // 'Logout': ProfileScene
}, {
    initialRouteName: 'App Home',
    contentComponent: SideDrawerComponent,
    drawerType: 'slide',
});

export default createAppContainer(RootNavigator);

const persistenceKey = "roooddddddddddto"
const persistNavigationState = async (navState) => {
    try {
        await AsyncStorage.setItem(persistenceKey, JSON.stringify(navState))
    } catch (err) {
        // handle the error according to your needs
    }
}

const loadNavigationState = async () => {
    const jsonString = await AsyncStorage.getItem(persistenceKey)
    return JSON.parse(jsonString)
}

export function getPersistenceFunctions() {
    return __DEV__ ? {
        persistNavigationState,
        loadNavigationState,
    } : undefined;
}