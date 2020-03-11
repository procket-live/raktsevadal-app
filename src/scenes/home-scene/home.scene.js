import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Image, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import firebase from 'react-native-firebase';
import RBSheet from "react-native-raw-bottom-sheet";
import Slider from 'react-native-slider';
import ScrollTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import FAB from 'react-native-fab'
import Geocoder from 'react-native-geocoder';
import truncate from 'lodash.truncate';

import { TEXT_COLOR, GREY_1, GREY_2, ON_PRIMARY, PRIMARY_COLOR, GREY_3, GREY_BG } from '../../constants/color.constant';
import { AccessNestedObject } from '../../utils/common.util';
import { navigate, openDrawer } from '../../services/navigation.service';
import BloodDonationCard from '../../components/blood-donation-card-component/blood-donation-card.component';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { FunnelIcon, MenuIcon, MapMarkerIcon } from '../../config/image.config';
import { HeartEmptyFullLottie } from '../../config/lottie.config';
import { fetchNotifications } from '../../action/notification.action';
import { fetchMyRequest } from '../../action/myRequest.action';
import { fetchNearbyRequest } from '../../action/nearbyRequest.action';
import { fetchNearbyCamp } from '../../action/nearbyCamp.action';
import APP from '../../constants/app.constant';
import DONATION_MAP from '../../constants/donation.constant';
import CampScene from '../camp-scene/camp.scene';
import { setUserAction } from '../../action/user.action';
import Button from '../../components/button-component/button.component';
import PrivateApi from '../../api/api.private';

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

class HomeScene extends PureComponent {
    constructor(props) {
        super(props);

        const myBloodGroup = AccessNestedObject(props, 'user.blood_group');
        this.iCanDonate = AccessNestedObject(DONATION_MAP, `${myBloodGroup}.donate`, '');

        this.state = {
            range: 50,
            selectedBg: [...this.iCanDonate]
        }
    }

    componentDidMount = async () => {
        this.fetchData();
        this.handleRedirect();
        this.fetchCurrentAddress();
    }

    fetchCurrentAddress = () => {
        const [latitude, longitude] = AccessNestedObject(this.props.user, 'latest_location.coordinates', []);

        Geocoder.geocodePosition({ lat: latitude, lng: longitude }).then((addresses) => {
            if (!addresses.length) {
                NotifyService.notify({
                    title: 'Error !',
                    message: 'Unable to get address',
                    type: 'error',
                });
            }

            const locality = AccessNestedObject(addresses, '0', {});
            const address = `${locality.subLocality}, ${locality.locality}`;
            this.props.setUserAction({ address });
            PrivateApi.updateUser({ location_address: address });
        })
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

    filterClose = () => {
        this.props.fetchNearbyRequest(this.state.range, this.state.selectedBg);
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

    RenderEmptyList2 = () => {
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
                    You have no blood requirement
                </Text>
            </View>
        )
    }


    RenderListHeader = () => {
        const address = AccessNestedObject(this.props, 'user.address');

        return (
            <>
                <View
                    style={{ width: widthPercentageToDP(100), backgroundColor: ON_PRIMARY }}
                >
                    <View style={styles.topContainer} >
                        <View style={styles.profileImageContainer} >
                            {/* <TouchableOpacity
                                onPress={openDrawer}
                            >
                                <Image
                                    source={MenuIcon()}
                                    style={styles.profileImage}
                                    tintColor={TEXT_COLOR}
                                />
                            </TouchableOpacity> */}
                        </View>
                        <View style={{ flex: 2, alignItems: 'flex-end' }} >
                            {
                                address ?
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
                                        <Image
                                            source={MapMarkerIcon()}
                                            style={{ width: 15, height: 15, resizeMode: 'contain', marginRight: 5 }}
                                        />
                                        <Text style={[styles.h4, { color: PRIMARY_COLOR }]} >
                                            {truncate(address, { length: 40 })}
                                        </Text>
                                    </View>
                                    :
                                    <ActivityIndicator size="small" color={PRIMARY_COLOR} />
                            }
                        </View>
                    </View>
                </View >
                <this.RenderBloodRequirementTabs />
            </>
        )
    }

    RenderBloodRequirementTabs = () => {
        return (
            <ScrollTabView
                {...TAB_BAR_DEFAULT_STYLES}
            >
                <this.RenderNearbyRequirements tabLabel="Requests" />
                <this.RenderMyBloodRequirements tabLabel="My Requests" />
                <CampScene tabLabel="Camp" />
            </ScrollTabView>
        )
    }

    RenderNearbyRequirements = () => {
        return (
            <>
                <this.RenderFilterSlab />
                <FlatList
                    style={{ backgroundColor: GREY_BG }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.nearbyRequestLoading}
                            onRefresh={this.fetchData}
                        />
                    }
                    contentContainerStyle={{ alignItems: 'center' }}
                    renderItem={this.RenderItem}
                    data={this.props.nearbyRequests}
                    ListEmptyComponent={this.RenderEmptyList}
                />
                <FAB
                    buttonColor={PRIMARY_COLOR}
                    iconTextColor="#FFFFFF"
                    onClickAction={() => this.RangeFilter.open()}
                    visible
                    iconTextComponent={
                        <View style={{ width: 20, height: 20 }} >
                            <Image
                                tintColor={ON_PRIMARY}
                                style={{ width: 20, height: 20, resizeMode: 'contain' }} source={FunnelIcon()}
                            />
                        </View>
                    }
                />
            </>
        )
    }

    RenderFilterSlab = () => {
        return (
            <View style={{ flexDirection: 'row', width: widthPercentageToDP(100), height: 40, alignItems: 'center', justifyContent: 'flex-start', padding: 3, backgroundColor: PRIMARY_COLOR }} >
                <this.Tag keyName="Range" value={` ${this.state.range}Kms `} />
                <this.Tag keyName="Blood Group" value={` ${this.state.selectedBg} `} />
            </View>
        )
    }

    Tag = ({ keyName, value }) => {
        return (
            <View style={{ flexDirection: 'row', marginRight: 5 }} >
                <Text style={{ fontSize: 14, color: ON_PRIMARY }} >
                    {keyName}:
                    </Text>
                <View style={{ marginLeft: 5, borderRadius: 4, borderWidth: 1, borderColor: ON_PRIMARY }}>
                    <Text style={{ fontSize: 14, color: ON_PRIMARY }} >
                        {value}
                    </Text>
                </View>
            </View>
        )
    }

    RenderMyBloodRequirements = () => {
        return (
            <FlatList
                style={{ backgroundColor: GREY_BG }}
                refreshControl={
                    <RefreshControl
                        refreshing={this.props.nearbyRequestLoading}
                        onRefresh={this.fetchData}
                    />
                }
                contentContainerStyle={{ alignItems: 'center' }}
                renderItem={this.RenderItem}
                data={this.props.myRequests}
                ListEmptyComponent={this.RenderEmptyList2}
            />
        )
    }

    RenderItem = (props) => {
        const { nearbyRequestLoading } = this.props;

        return (
            <BloodDonationCard
                bloodDonationRequest={props.item}
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

    ButtonTag = ({ selected, onPress, value }) => {
        return (
            <TouchableOpacity
                onPress={onPress}
                style={{ marginRight: 5, height: 20, padding: 5, paddingLeft: 15, paddingRight: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: selected ? PRIMARY_COLOR : ON_PRIMARY, borderWidth: selected ? 0 : 1, borderColor: PRIMARY_COLOR }}
            >
                <Text style={{ fontSize: 16, color: selected ? ON_PRIMARY : PRIMARY_COLOR }} >{value}</Text>
            </TouchableOpacity>
        )
    }


    RenderFilter = () => {
        const allGroups = Object.keys(DONATION_MAP);

        return (
            <>
                <View style={{
                    marginLeft: 5,
                    marginRight: 5,
                    marginBottom: 20,
                    justifyContent: 'center',
                }} >
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                            <Text style={{ fontSize: 16, color: PRIMARY_COLOR, marginBottom: 15 }} >
                                Blood Groups
                            </Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} >
                            <TouchableOpacity style={{ borderWidth: 1, borderColor: PRIMARY_COLOR, padding: 5, borderRadius: 5 }} onPress={() => { this.setState({ selectedBg: [...this.iCanDonate] }); }} >
                                <Text style={{ fontSize: 14, color: PRIMARY_COLOR }} >RESET</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <FlatList
                        style={{ width: widthPercentageToDP(90), paddingTop: 10, paddingBottom: 10, flexDirection: 'row' }}
                        horizontal
                        data={allGroups}
                        renderItem={({ item }) => {
                            const selected = this.state.selectedBg.includes(item);
                            return (
                                <this.ButtonTag
                                    value={item}
                                    onPress={() => {
                                        if (selected) {
                                            const index = this.state.selectedBg.indexOf(item);
                                            if (this.state.selectedBg.length != 1) {
                                                this.state.selectedBg.splice(index, 1);
                                            }
                                        } else {
                                            this.state.selectedBg.push(item);
                                        }
                                        this.forceUpdate()
                                    }}
                                    selected={selected}
                                />
                            )
                        }}
                    />
                </View>
                <View style={{
                    marginLeft: 5,
                    marginRight: 5,
                    justifyContent: 'center',
                }} >
                    <Text style={{ fontSize: 16, color: PRIMARY_COLOR, marginBottom: 15 }} >
                        Distance Range: (Within {this.state.range} Kms)
                </Text>
                    <Slider
                        style={{ width: widthPercentageToDP(90) }}
                        thumbTintColor={PRIMARY_COLOR}
                        minimumTrackTintColor={PRIMARY_COLOR}
                        thumbTouchSize={{ width: 50, height: 50 }}
                        animateTransitions={true}
                        minimumValue={1}
                        maximumValue={3500}
                        step={50}
                        value={this.state.range}
                        onValueChange={(range) => this.setState({ range })}
                    />
                    <View style={{ width: widthPercentageToDP(90), flexDirection: 'row' }} >
                        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                            <Text>1 Kms</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} >
                            <Text>3500 Kms</Text>
                        </View>
                    </View>
                </View>
                <View style={{ alignItems: 'flex-end', justifyContent: 'center', marginTop: 20 }}>
                    <Button text="Apply Filter" onPress={() => this.RangeFilter.close && this.RangeFilter.close()} />
                </View>
            </>
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
                <this.RenderListHeader />
                <RBSheet

                    ref={ref => {
                        this.RangeFilter = ref;
                    }}
                    height={280}
                    duration={250}
                    customStyles={{
                        container: {
                            padding: 10,
                            justifyContent: "center",
                        }
                    }}
                    onClose={this.filterClose}
                >
                    <this.RenderFilter />
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
    h4: {
        fontSize: 16,
        color: PRIMARY_COLOR
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

export default connect(mapStateToProps, { fetchNotifications, fetchMyRequest, fetchNearbyRequest, fetchNearbyCamp, setUserAction })(HomeScene);