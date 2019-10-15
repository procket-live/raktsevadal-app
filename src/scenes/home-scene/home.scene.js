import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Image, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import WideButton from '../../components/wide-button-component/wide-button.component';
import { TEXT_COLOR, GREY_1, GREY_2, ON_PRIMARY, PRIMARY_COLOR } from '../../constants/color.constant';
import moment from 'moment';
import { AccessNestedObject, JSONToQuery, replaceAll, DistanceBetweenLatLng } from '../../utils/common.util';
import { navigate } from '../../services/navigation.service';
import PrivateApi from '../../api/api.private';
import BloodDonationCard from '../../components/blood-donation-card-component/blood-donation-card.component';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import DONATION_MAP from '../../constants/donation.constant';
import { UserIcon, BloodDropIcon } from '../../config/image.config';
import { HeartEmptyFullLottie } from '../../config/lottie.config';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { fetchNotifications } from '../../action/notification.action';

class HomeScene extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            isRefreshing: false,
            requests: [1, 2, 3, 4, 5],
            myRequests: []
        };

        this.userLat = AccessNestedObject(props, 'user.latest_location.coordinates.0', 0.0);
        this.userLng = AccessNestedObject(props, 'user.latest_location.coordinates.1', 0.0);
    }

    componentDidMount = () => {
        this.fetchBloodDonationRequest();
        this.fetchMyRequests();
        this.props.fetchNotifications();
    }

    fetchBloodDonationRequest = async (callback) => {
        const userId = AccessNestedObject(this.props, 'user._id');
        const myBloodGroup = AccessNestedObject(this.props, 'user.blood_group');
        const iCanDonate = AccessNestedObject(DONATION_MAP, `${myBloodGroup}.donate`, '').map((bg) => bg.replace('+', 'p').replace('-', 'n')).join(',');
        const latitude = this.userLat;
        const longitude = this.userLng;

        const params = {
            blood_group: iCanDonate,
            latitude,
            longitude,
            not_created_by: userId
        }

        const query = JSONToQuery(params);
        const result = await PrivateApi.fetchBloodRequirements(query);
        this.setState({ loading: false });
        if (result.success) {
            let list = AccessNestedObject(result, 'response', []);

            list = list
                .map((item) => {
                    const reqLatitude = AccessNestedObject(item, 'hospital_location.coordinates.0');
                    const reqLongitude = AccessNestedObject(item, 'hospital_location.coordinates.1');

                    item.distance = DistanceBetweenLatLng(this.userLat, this.userLng, reqLatitude, reqLongitude);
                    return item;
                })
                .sort((a, b) => (a.distance > b.distance) ? 1 : -1)

            list = list.length ? [1, ...list] : [];
            this.setState({ requests: list });
        }

        if (callback && typeof callback == 'function') {
            callback();
        }
    }

    fetchMyRequests = async () => {
        const params = {
            created_by: AccessNestedObject(this.props, 'user._id'),
        }

        const query = JSONToQuery(params);
        const result = await PrivateApi.fetchBloodRequirements(query);
        this.setState({ loading: false });
        if (result.success) {
            let list = AccessNestedObject(result, 'response', [])
                .reverse()
                .map((item) => {
                    const reqLatitude = AccessNestedObject(item, 'hospital_location.coordinates.0');
                    const reqLongitude = AccessNestedObject(item, 'hospital_location.coordinates.1');

                    item.distance = DistanceBetweenLatLng(this.userLat, this.userLng, reqLatitude, reqLongitude);
                    return item;
                });

            this.setState({ myRequests: list });
        }
    }

    onRefresh = () => {
        this.setState({ isRefreshing: true });
        this.fetchBloodDonationRequest(() => {
            this.setState({ isRefreshing: false });
        })
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
            <View style={{ width: widthPercentageToDP(100) }}>
                <View style={styles.arc} />
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
                <View style={{ zIndex: 3, height: 100 }} >
                    <TouchableOpacity
                        onPress={this.openBloodRequirement}
                        style={{ zIndex: 10, width: widthPercentageToDP(67), height: 50, borderRadius: 25, backgroundColor: ON_PRIMARY, elevation: 5, left: widthPercentageToDP(16), top: heightPercentageToDP(4), position: 'relative', alignItems: 'center', justifyContent: 'center' }} >
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
                <this.RenderMyBloodRequirements />
            </View>
        )
    }

    RenderMyBloodRequirements = () => {
        const { myRequests } = this.state;

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
        const { loading } = this.state;

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
                userId={AccessNestedObject(this.props, 'user._id')}
                latitude={this.userLat}
                longitude={this.userLng}
                bloodDonationRequest={item}
                loading={loading}
                callback={this.componentDidMount}
            />
        );
    }

    openBloodRequirement = () => {
        navigate('AddBloodRequirement', { callback: this.fetchBloodDonationRequest });
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onRefresh}
                        />
                    }
                    contentContainerStyle={{ alignItems: 'center' }}
                    ListHeaderComponent={this.RenderListHeader}
                    renderItem={this.RenderItem}
                    data={this.state.requests}
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
    }
});

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps, { fetchNotifications })(HomeScene);