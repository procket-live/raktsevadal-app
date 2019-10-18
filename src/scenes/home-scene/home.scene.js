import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Image, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import firebase from 'react-native-firebase';

import { TEXT_COLOR, GREY_1, GREY_2, ON_PRIMARY, PRIMARY_COLOR } from '../../constants/color.constant';
import { AccessNestedObject } from '../../utils/common.util';
import { navigate } from '../../services/navigation.service';
import BloodDonationCard from '../../components/blood-donation-card-component/blood-donation-card.component';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { UserIcon, BloodDropIcon } from '../../config/image.config';
import { HeartEmptyFullLottie } from '../../config/lottie.config';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { fetchNotifications } from '../../action/notification.action';
import { fetchMyRequest } from '../../action/myRequest.action';
import { fetchNearbyRequest } from '../../action/nearbyRequest.action';
import APP from '../../constants/app.constant';

class HomeScene extends PureComponent {
    componentDidMount = async () => {
        this.fetchData();
        this.handleRedirect();
    }

    handleRedirect = () => {
        const route = AccessNestedObject(APP, 'REDIRECT_TO.route');
        const payload = AccessNestedObject(APP, 'REDIRECT_TO.payload', {});

        if (route) {
            navigate(route, { ...payload });
        }
    }

    fetchData = () => {
        this.props.fetchNearbyRequest();
        this.props.fetchNotifications();
        this.props.fetchMyRequest();
    }

    RenderEmptyList = () => {
        return (
            <View style={styles.emptyListContainer} >
                <View style={{ width: widthPercentageToDP(90), height: widthPercentageToDP(50) }} >
                    <LottieView
                        autoPlay
                        loop={false}
                        source={HeartEmptyFullLottie()}
                    />
                </View>
                <Text style={styles.h2} >
                    No blood donation request in your area!
                </Text>
            </View>
        )
    }

    RenderListHeader = () => {
        const user = AccessNestedObject(this.props, 'user', {});

        return (
            <>
                <View
                    style={{ width: widthPercentageToDP(100), marginBottom: 30 }}
                >
                    <View
                        style={styles.arc}
                    />
                    <View style={styles.topContainer} >
                        <View style={styles.profileImageContainer} >
                            <Image
                                source={UserIcon()}
                                style={styles.profileImage}
                                tintColor={ON_PRIMARY}
                            />
                        </View>
                        <View style={{ flex: 2, alignItems: 'flex-end' }} >
                            <Text style={[styles.h2, { color: ON_PRIMARY }]} >
                                {AccessNestedObject(user, 'name')}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{ zIndex: 4 }}
                    >
                        <TouchableOpacity
                            onPress={this.openBloodRequirement}
                            style={styles.needBlood} >
                            <View style={{ flexDirection: 'row' }} >
                                <Image
                                    source={BloodDropIcon()}
                                    style={styles.icon}
                                />
                                <Text style={[styles.h3, { color: PRIMARY_COLOR, marginLeft: 7 }]} >
                                    Need Blood
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View >
                <this.RenderMyBloodRequirements />
            </>
        )
    }

    RenderMyBloodRequirements = () => {
        const { myRequests } = this.props;

        const length = myRequests.length;
        if (!length) {
            return <View style={{ marginBottom: 10 }} />;
        }

        return (
            <View style={styles.mybloodReqContainer}>
                <Text style={styles.h2} >
                    My Blood Requirements ({length})
                </Text>
                <FlatList
                    contentContainerStyle={{ alignItems: 'center' }}
                    renderItem={(props) => {
                        props.hideHeader = true;
                        return this.RenderItem(props);
                    }}
                    data={myRequests}
                    horizontal
                />
            </View>
        )
    }

    RenderItem = ({ item, index, hideHeader }) => {
        const { nearbyRequestLoading } = this.props;

        if (index + 1 == 1 && !hideHeader) {
            return (
                <View style={styles.nearbyTextContainer}>
                    <Text style={styles.h2} >
                        Nearby Requestes
                    </Text>
                </View>
            )
        }

        return (
            <BloodDonationCard
                bloodDonationRequest={item}
                loading={nearbyRequestLoading}
            />
        );
    }

    openBloodRequirement = () => {
        firebase.analytics().logEvent('NEED_BLOOD')
        navigate('AddBloodRequirement');
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.nearbyRequestLoading}
                            onRefresh={this.fetchData}
                        />
                    }
                    contentContainerStyle={{ alignItems: 'center' }}
                    ListHeaderComponent={this.RenderListHeader}
                    renderItem={this.RenderItem}
                    data={this.props.nearbyRequests}
                    ListEmptyComponent={this.RenderEmptyList}
                    stickyHeaderIndices={[1]}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topContainer: {
        flexDirection: 'row',
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        zIndex: 3,
    },
    profileImageContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    profileImage: {
        width: widthPercentageToDP('7'),
        height: widthPercentageToDP('7'),
        resizeMode: 'contain',
    },
    icon: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    h2: {
        fontSize: 22,
        color: TEXT_COLOR
    },
    h3: {
        fontSize: 18,
        color: GREY_2
    },
    nearbyTextContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: ON_PRIMARY,
        padding: 15,
        paddingTop: 0,
        width: widthPercentageToDP('100'),
        borderBottomWidth: 1,
        borderBottomColor: GREY_1,
    },
    mybloodReqContainer: {
        padding: 5,
        width: widthPercentageToDP('100'),

    },
    emptyListContainer: {
        width: widthPercentageToDP(100),
        height: heightPercentageToDP(50),
        alignItems: 'center',
        justifyContent: 'center'
    },
    arc: {
        position: 'absolute',
        backgroundColor: PRIMARY_COLOR,
        width: widthPercentageToDP(110),
        height: heightPercentageToDP(30),
        borderRadius: widthPercentageToDP(100) / 2,
        top: -heightPercentageToDP(30) / 2,
        left: -widthPercentageToDP(5),
        right: widthPercentageToDP(5),
        zIndex: 2
    },
    needBlood: {
        zIndex: 5,
        width: widthPercentageToDP(67),
        height: 50,
        borderRadius: 25,
        backgroundColor: ON_PRIMARY,
        elevation: 5,
        left: widthPercentageToDP(16),
        marginTop: heightPercentageToDP(4),
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const mapStateToProps = state => ({
    user: state.user,
    myRequests: state.myRequest.myRequests,
    myRequestLoading: state.myRequest.loading,
    nearbyRequests: state.nearbyRequest.nearbyRequests,
    nearbyRequestLoading: state.nearbyRequest.loading
});

export default connect(mapStateToProps, { fetchNotifications, fetchMyRequest, fetchNearbyRequest })(HomeScene);