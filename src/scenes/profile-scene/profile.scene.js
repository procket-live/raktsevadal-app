import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Rating } from 'react-native-ratings';
import ScrollTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

import { GREY_1, GREY_2, GREY_3, GREEN, ON_PRIMARY, PRIMARY_COLOR, TEXT_COLOR, PRIMARY_LIGHT_COLOR, GREY_BG } from '../../constants/color.constant';
import { UserIcon, VerifyIcon, HeartIcon, MapMarkerIcon } from '../../config/image.config';
import { connect } from 'react-redux';
import { AccessNestedObject } from '../../utils/common.util';
import { logoutUserAction } from '../../action/user.action';
import Header from '../../components/header-component/header.component';
import NewsfeedCard from '../../components/newsfeed-component/newsfeed.component';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { heightPercentageToDP } from 'react-native-responsive-screen';

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

const ProfileTopContent = ({ user }) => {
    const profileImage = AccessNestedObject(user, 'profile_image');
    const source = profileImage ? { uri: profileImage } : UserIcon();

    return (
        <>
            <View style={{ height: 80, flexDirection: 'row', padding: 10 }} >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Image
                        source={source}
                        style={styles.profileImage}
                    />
                    <Image
                        source={VerifyIcon()}
                        style={[styles.icon, { marginLeft: 5, position: 'absolute', left: 50, top: 35 }]}
                    />
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Text style={{ fontSize: 24, color: PRIMARY_COLOR }} >0</Text>
                    <Text style={{ fontSize: 16, color: GREY_3 }} >Donated</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Text style={{ fontSize: 24, color: PRIMARY_COLOR }} >0</Text>
                    <Text style={{ fontSize: 16, color: GREY_3 }} >Requested</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Image source={HeartIcon()} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
                    <Text style={{ fontSize: 16, color: GREY_3 }} >Save</Text>
                </View>
            </View>
            <View style={{ marginLeft: 5, marginRight: 5, height: 35, flexDirection: 'row', paddingLeft: 10, paddingRight: 10, alignItems: 'center', justifyContent: 'flex-end' }} >
                <View style={{ marginLeft: 5, marginRight: 5, paddingLeft: 15, paddingRight: 15, height: 25, borderRadius: 35, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: GREEN }} >
                    <Text style={{ fontSize: 14, color: ON_PRIMARY }} >VERIFIED DONER</Text>
                </View>
                <View style={{ paddingLeft: 15, paddingRight: 15, height: 25, borderRadius: 35, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: PRIMARY_COLOR }} >
                    <Text style={{ fontSize: 14, color: ON_PRIMARY }} >{user.blood_group} BLOOD DONER</Text>
                </View>
                <View style={{ marginLeft: 5, marginRight: 5, paddingLeft: 15, paddingRight: 15, height: 25, borderRadius: 35, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: PRIMARY_COLOR }} >
                    <Text style={{ fontSize: 14, color: ON_PRIMARY }} >{user.gender.toUpperCase()}</Text>
                </View>
            </View>
            <View style={{ height: 40, flexDirection: 'row', paddingLeft: 10, paddingRight: 10 }} >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }} >
                    <Image
                        source={MapMarkerIcon()}
                        style={[styles.icon, { marginRight: 5 }]}
                    />
                    <Text style={{ fontSize: 14, color: TEXT_COLOR }} >{user.address}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} >
                    <Rating
                        count={3.5}
                        isDisabled
                        type='star'
                        fractions={2}
                        ratingColor={PRIMARY_COLOR}
                        ratingBackgroundColor={GREY_3}
                        ratingCount={5}
                        imageSize={15}
                        style={{ paddingVertical: 10 }}
                    />
                </View>
            </View>
            <View style={{ height: 25, flexDirection: 'row', paddingLeft: 10, paddingRight: 10, backgroundColor: PRIMARY_LIGHT_COLOR, alignItems: 'center', justifyContent: 'flex-start' }} >
                <Text style={{ fontSize: 14, color: PRIMARY_COLOR }} >Last blood donation: {user.last_blood_donation || 'NOT AVAILABLE'}</Text>
            </View>
        </>
    )
}

const Timeline = list => {
    return (
        <>
            <FlatList
                style={{ flex: 1, backgroundColor: GREY_BG }}
                contentContainerStyle={{ alignItems: 'center', paddingBottom: 200 }}
                data={[1, 2]}
                renderItem={({ item }) => (
                    <NewsfeedCard
                        camp={item}
                    />
                )}
                scrollEnabled={false}
            />
        </>
    )
}

const ProfileScene = props => {
    const user = props.user;

    return (
        <>
            <Header title={user.name} />
            <ScrollView
                contentContainerStyle={{ height: heightPercentageToDP(200) }}
                style={styles.container}
            >
                <ProfileTopContent user={user} />
                <ScrollTabView
                    {...TAB_BAR_DEFAULT_STYLES}
                >
                    <Timeline
                        tabLabel="Timeline"
                    />
                    <Timeline
                        tabLabel="Details"
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
        resizeMode: 'contain',
        borderRadius: 45,
    }
})

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps, { logout: logoutUserAction })(ProfileScene);
