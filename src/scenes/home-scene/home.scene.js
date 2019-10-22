import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Image, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import firebase from 'react-native-firebase';
import RBSheet from "react-native-raw-bottom-sheet";
import Slider from 'react-native-slider';
import debounce from 'lodash.debounce';

import { TEXT_COLOR, GREY_1, GREY_2, ON_PRIMARY, PRIMARY_COLOR } from '../../constants/color.constant';
import { AccessNestedObject } from '../../utils/common.util';
import { navigate } from '../../services/navigation.service';
import BloodDonationCard from '../../components/blood-donation-card-component/blood-donation-card.component';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { UserIcon, BloodDropIcon, EditIcon } from '../../config/image.config';
import { HeartEmptyFullLottie } from '../../config/lottie.config';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { fetchNotifications } from '../../action/notification.action';
import { fetchMyRequest } from '../../action/myRequest.action';
import { fetchNearbyRequest } from '../../action/nearbyRequest.action';
import { fetchNearbyCamp } from '../../action/nearbyCamp.action';
import APP from '../../constants/app.constant';
import DONATION_MAP from '../../constants/donation.constant';

class HomeScene extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            range: 50,
        }

        this.applyFilterDebounce = debounce(this.rangeFilterClose, 1000, {
            'leading': false,
            'trailing': true
        });
    }

    componentDidMount = async () => {
        this.fetchData();
        this.handleRedirect();
    }

    getICanDonateBloodGroup = () => {
        const { user } = this.props;
        const myBloodGroup = AccessNestedObject(user, 'blood_group');
        return AccessNestedObject(DONATION_MAP, `${myBloodGroup}.donate`);
    }

    handleRedirect = () => {
        const route = AccessNestedObject(APP, 'REDIRECT_TO.route');
        const payload = AccessNestedObject(APP, 'REDIRECT_TO.payload', {});

        if (route) {
            navigate(route, { ...payload });
        }
    }

    rangeFilterClose = () => {
        this.props.fetchNearbyRequest(this.state.range);
    }

    fetchData = () => {
        this.props.fetchNearbyRequest(this.state.range);
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
        const profileImage = AccessNestedObject(user, 'profile_image');
        const source = profileImage ? { uri: profileImage } : UserIcon();
        const tintColor = profileImage ? null : ON_PRIMARY;

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
                                source={source}
                                defaultSource={UserIcon()}
                                style={styles.profileImage}
                                tintColor={tintColor}
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
        const bloodGroups = this.getICanDonateBloodGroup();

        if (index + 1 == 1 && !hideHeader) {
            return (
                <>
                    <View style={styles.nearbyTextContainer}>
                        <Text style={styles.h2} >
                            Nearby Requestes
                        </Text>
                    </View>
                    <View style={styles.filterContainer} >

                        <TouchableOpacity
                            onPress={() => this.RangeFilter.open()}
                            style={{ flexDirection: 'row', padding: 5, height: 35, borderRadius: 20, backgroundColor: PRIMARY_COLOR, alignItems: 'center', justifyContent: 'center', marginRight: 5 }}
                        >
                            <Text style={{ fontSize: 14, color: ON_PRIMARY, paddingRight: 5, paddingLeft: 5 }} >Range: {this.state.range}Kms</Text>
                            <Image tintColor={ON_PRIMARY} source={EditIcon()} style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5, marginLeft: 5 }} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={1}
                            style={{ flexDirection: 'row', padding: 5, height: 35, borderRadius: 20, backgroundColor: PRIMARY_COLOR, alignItems: 'center', justifyContent: 'center', marginRight: 5 }}
                        >
                            <Text style={{ fontSize: 14, color: ON_PRIMARY, paddingRight: 5, paddingLeft: 5 }} >Blood Group: {(bloodGroups || []).join(', ')}</Text>
                            {/* <Image tintColor={ON_PRIMARY} source={EditIcon()} style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5, marginLeft: 5 }} /> */}
                        </TouchableOpacity>

                    </View>
                </>
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

    sliderOneValuesChange = values => {
        let newValues = [0];
        newValues[0] = values[0];
        this.setState({
            range: newValues,
        });
    };


    RangeFilterComponent = () => {
        return (
            <View style={{
                marginLeft: 5,
                marginRight: 5,
                alignItems: 'stretch',
                justifyContent: 'center',
            }} >
                <Text style={{ fontSize: 20, color: PRIMARY_COLOR, marginBottom: 15 }} >
                    Distance Range:
                </Text>
                <Slider
                    style={{ width: widthPercentageToDP(80) }}
                    thumbTintColor={PRIMARY_COLOR}
                    minimumTrackTintColor={PRIMARY_COLOR}
                    thumbTouchSize={{ width: 50, height: 50 }}
                    animateTransitions={true}
                    minimumValue={50}
                    maximumValue={5000}
                    step={50}
                    value={this.state.range}
                    onValueChange={(range) => this.setState({ range }, this.applyFilterDebounce)}
                />
                <View style={{ width: widthPercentageToDP(80), flexDirection: 'row' }} >
                    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                        <Text>50Kms</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} >
                        <Text>500Kms</Text>
                    </View>
                </View>
            </View>
        )
    }

    BloodGroupFilterComponent = () => {
        return (
            <View style={{ flex: 1, }} >

            </View>
        )
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
                <RBSheet
                    ref={ref => {
                        this.RangeFilter = ref;
                    }}
                    height={150}
                    duration={250}
                    customStyles={{
                        container: {
                            justifyContent: "center",
                            alignItems: "center"
                        }
                    }}
                >
                    <this.RangeFilterComponent />
                </RBSheet>
                <RBSheet
                    ref={ref => {
                        this.BloodGroupFilter = ref;
                    }}
                    height={300}
                    onClose={this.rangeFilterClose}
                    duration={250}
                    customStyles={{
                        container: {
                            justifyContent: "center",
                            alignItems: "center"
                        }
                    }}
                >
                    <this.BloodGroupFilterComponent />
                </RBSheet>
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
        width: 20,
        height: 20,
        resizeMode: 'contain',
        borderRadius: 100,
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
    },
    filterContainer: {
        width: widthPercentageToDP(100),
        height: 40,
        padding: 5,
        flexDirection: 'row'
    }
});

const mapStateToProps = state => ({
    user: state.user,
    myRequests: state.myRequest.myRequests,
    myRequestLoading: state.myRequest.loading,
    nearbyRequests: state.nearbyRequest.nearbyRequests,
    nearbyRequestLoading: state.nearbyRequest.loading
});

export default connect(mapStateToProps, { fetchNotifications, fetchMyRequest, fetchNearbyRequest, fetchNearbyCamp })(HomeScene);