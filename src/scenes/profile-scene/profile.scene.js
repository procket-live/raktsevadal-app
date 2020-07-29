import React from 'react';
import { View, StyleSheet, Image, Text, ActivityIndicator } from 'react-native';
import { Rating } from 'react-native-ratings';
import ScrollTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

import { GREY_1, GREY_2, GREY_3, GREEN, ON_PRIMARY, PRIMARY_COLOR, TEXT_COLOR, PRIMARY_LIGHT_COLOR, GREY_BG } from '../../constants/color.constant';
import { UserIcon, VerifyIcon, HeartIcon, MapMarkerIcon, ShareIcon, PencilIcon, HeartFillIcon } from '../../config/image.config';
import { connect } from 'react-redux';
import { AccessNestedObject, ShareUserProfile } from '../../utils/common.util';
import { logoutUserAction } from '../../action/user.action';
import Header from '../../components/header-component/header.component';
import NewsfeedCard from '../../components/newsfeed-component/newsfeed.component';
import { ScrollView, FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { navigate, navigatePop } from '../../services/navigation.service';
import WideButton from '../../components/wide-button-component/wide-button.component';
import PrivateApi from '../../api/api.private';
import InfoScene from '../info-scene/info.scene';

const TAB_BAR_DEFAULT_STYLES = {
    tabBarPosition: 'top',
    prerenderingSiblingsNumber: 0,
    tabBarUnderlineStyle: {
        backgroundColor: PRIMARY_COLOR
    },
    tabBarBackgroundColor: ON_PRIMARY,
    tabBarActiveTextColor: PRIMARY_COLOR,
    tabBarInactiveTextColor: '#fff',
    tabBarTextStyle: {
        color: GREY_3,
        fontSize: 16
    },
    style: {
        borderWidth: 0,
    },
    backgroundColor: ON_PRIMARY,
    renderTabBar: () => <ScrollableTabBar />,
};

const ProfileTopContent = ({ myUser, loggedInUser }) => {
    const profileImage = AccessNestedObject(myUser, 'profile_image');
    const source = profileImage ? { uri: profileImage } : UserIcon();
    const rating = AccessNestedObject(myUser, 'rating');
    const lastBloodDonation = AccessNestedObject(myUser, 'last_blood_donation');

    return (
        <>
            <View style={{ height: 80, flexDirection: 'row', padding: 10 }} >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <View style={styles.profileImageContainer} >
                        <Image
                            source={source}
                            style={styles.profileImage}
                        />
                    </View>
                    <Image
                        source={VerifyIcon()}
                        style={[styles.icon, { marginLeft: 5, position: 'absolute', left: 30 + 45, top: 35, zIndex: 2 }]}
                    />
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Text style={{ fontSize: 24, color: PRIMARY_COLOR }} >{AccessNestedObject(myUser, 'donate')}</Text>
                    <Text style={{ fontSize: 16, color: GREY_3 }} >Donated</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Text style={{ fontSize: 24, color: PRIMARY_COLOR }} >{AccessNestedObject(myUser, 'request')}</Text>
                    <Text style={{ fontSize: 16, color: GREY_3 }} >Requested</Text>
                </View>
                {
                    (myUser._id != AccessNestedObject(loggedInUser, '_id')) ?
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                            <Image source={HeartIcon()} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
                            <Text style={{ fontSize: 16, color: GREY_3 }} >Save</Text>
                        </View> : null
                }
            </View>
            <View style={{ marginLeft: 5, marginRight: 5, height: 35, flexDirection: 'row', paddingLeft: 10, paddingRight: 10, alignItems: 'center', justifyContent: 'flex-end' }} >
                <View style={{ marginLeft: 5, marginRight: 5, paddingLeft: 15, paddingRight: 15, height: 25, borderRadius: 35, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: GREEN }} >
                    <Text style={{ fontSize: 14, color: ON_PRIMARY }} >VERIFIED DONER</Text>
                </View>
                <View style={{ paddingLeft: 15, paddingRight: 15, height: 25, borderRadius: 35, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: PRIMARY_COLOR }} >
                    <Text style={{ fontSize: 14, color: ON_PRIMARY }} >{myUser.blood_group} BLOOD DONER</Text>
                </View>
                <View style={{ marginLeft: 5, marginRight: 5, paddingLeft: 15, paddingRight: 15, height: 25, borderRadius: 35, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: PRIMARY_COLOR }} >
                    <Text style={{ fontSize: 14, color: ON_PRIMARY }} >{AccessNestedObject(myUser, 'gender', '').toUpperCase()}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10 }} >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }} >
                    <Image
                        source={MapMarkerIcon()}
                        style={[styles.icon, { marginRight: 5 }]}
                    />
                    <Text style={{ fontSize: 14, color: TEXT_COLOR }} >{myUser.address || 'Loading ...'}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} >
                    <Rating
                        ratingColor={PRIMARY_COLOR}
                        startingValue={rating || 4.5}
                        ratingCount={5}
                        readonly
                        type='star'
                        imageSize={15}
                        style={{ paddingVertical: 10 }}
                    />
                </View>
            </View>
            <View style={{ flexDirection: 'row', paddingLeft: 10, paddingRight: 10 }} >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }} >
                    <Image
                        source={HeartFillIcon()}
                        style={[styles.icon, { marginRight: 5 }]}
                    />
                    <Text style={{ fontSize: 14, color: TEXT_COLOR }} >
                        Last blood donation
                    </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} >
                    <Text style={{ fontSize: 14, color: PRIMARY_COLOR, fontWeight: '500', fontFamily: 'Roboto' }} >{lastBloodDonation || 'NOT AVAILABLE'}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', padding: 10 }} >
                <WideButton
                    mode="outline"
                    text="Add Post"
                    onPress={() => navigate('AddPost')}
                />
            </View>
        </>
    )
}

const Timeline = ({ posts, loading, loggedInUserId }) => {
    return (
        <>
            <FlatList
                style={{ flex: 1, backgroundColor: GREY_BG }}
                contentContainerStyle={{ alignItems: 'center', paddingBottom: 200 }}
                data={posts}
                renderItem={({ item }) => (
                    <NewsfeedCard
                        loggedInUserId={loggedInUserId}
                        loading={loading}
                        post={item}
                    />
                )}
                scrollEnabled={false}
            />
        </>
    )
}

function ProfileScene(props) {
    const user = props.user || (props.loggedInUser) || {};
    const [posts, setPost] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const loggedInUserId = AccessNestedObject(props, 'loggedInUser._id');

    React.useEffect(() => {
        if (Array.isArray(posts) && posts.length) {
            return;
        }

        fetchPosts();
    })

    async function fetchPosts() {
        setLoading(true);
        const result = await PrivateApi.getAllPost();
        console.log('resultresultresult', result)
        setLoading(false);
        if (result.success) {
            setPost(result.response);
        }
    }

    return (
        <>
            <Header
                title={user.name}
                renderRight={() => {
                    if (user._id == AccessNestedObject(props, 'loggedInUser._id')) {
                        return (
                            <TouchableOpacity
                                onPress={() => { navigate('UpdateUserDetail', { callback: () => navigatePop() }); }}
                                style={{ padding: 5 }}
                            >
                                <Image
                                    source={PencilIcon()}
                                    style={{ width: 20, height: 20 }}
                                    tintColor={ON_PRIMARY}
                                />
                            </TouchableOpacity>
                        )
                    }

                    return (
                        <TouchableOpacity
                            onPress={() => ShareUserProfile(user)}
                            style={{ padding: 5 }}
                        >
                            <Image
                                source={ShareIcon()}
                                style={{ width: 20, height: 20 }}
                                tintColor={ON_PRIMARY}
                            />
                        </TouchableOpacity>
                    )
                }}
            />
            <ScrollView
                contentContainerStyle={{ height: heightPercentageToDP(200) }}
                style={styles.container}
            >
                <ProfileTopContent myUser={user} loggedInUser={props.loggedInUser} />
                <ScrollTabView
                    {...TAB_BAR_DEFAULT_STYLES}
                >
                    <Timeline
                        posts={posts || []}
                        loading={loading}
                        loggedInUserId={loggedInUserId}
                        tabLabel="Timeline"
                    />
                    <InfoScene
                        tabLabel="Settings"
                    />
                </ScrollTabView>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: heightPercentageToDP(100)
    },
    menuItem: {
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: GREY_1,
        padding: 5,
        flexDirection: 'row'
    },
    icon: {
        width: 15,
        height: 15,
        resizeMode: 'contain'
    },
    icon2: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    text: {
        fontSize: 20,
        color: GREY_2
    },
    text2: {
        fontSize: 18,
        color: GREEN
    },
    profileImage: {
        width: 45,
        height: 45,
        resizeMode: 'cover',
    },
    profileImageContainer: {
        width: 45,
        height: 45,
        borderRadius: 45,
        overflow: 'hidden'
    }
})

const mapStateToProps = state => ({
    loggedInUser: state.user
});

export default connect(mapStateToProps, { logout: logoutUserAction })(ProfileScene);
