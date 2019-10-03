import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Image, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import LottieView from 'lottie-react-native';
import WideButton from '../../components/wide-button-component/wide-button.component';
import { TEXT_COLOR, GREY_1, GREY_2, ON_PRIMARY } from '../../constants/color.constant';
import moment from 'moment';
import { AccessNestedObject, JSONToQuery } from '../../utils/common.util';
import { navigate } from '../../services/navigation.service';
import PrivateApi from '../../api/api.private';
import BloodDonationCard from '../../components/blood-donation-card-component/blood-donation-card.component';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import DONATION_MAP from '../../constants/donation.constant';
import { UserIcon } from '../../config/image.config';
import { HeartEmptyFullLottie } from '../../config/lottie.config';

class HomeScene extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            isRefreshing: false,
            requests: [1, 2, 3, 4, 5]
        }
    }

    componentDidMount = () => {
        this.fetchBloodDonationRequest();
    }

    fetchBloodDonationRequest = async (callback) => {
        const myBloodGroup = AccessNestedObject(this.props, 'user.blood_group');
        const iCanDonate = AccessNestedObject(DONATION_MAP, `${myBloodGroup}.donate`);
        const latitude = AccessNestedObject(this.props, 'user.latest_location.latitude');
        const longitude = AccessNestedObject(this.props, 'user.latest_location.longitude');

        const params = {
            blood_group: iCanDonate,
            latitude,
            longitude
        }

        const query = JSONToQuery(params);
        const result = await PrivateApi.fetchBloodRequirements(query);
        this.setState({ loading: false });
        if (result.success) {
            let list = AccessNestedObject(result, 'response', []);
            list = list.length ? [1, ...list] : [];
            this.setState({ requests: list });
        }

        if (callback && typeof callback == 'function') {
            callback();
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
            <React.Fragment>
                <View style={styles.topContainer} >
                    <View style={styles.profileImageContainer} >
                        <Image
                            source={UserIcon()}
                            style={styles.profileImage}
                        />
                    </View>
                    <View style={{ flex: 2, alignItems: 'flex-end' }} >
                        <Text style={styles.h2} >
                            {AccessNestedObject(user, 'name')}
                        </Text>
                    </View>
                </View>
                <View style={{ alignItems: 'center', padding: 10 }} >
                    <WideButton
                        onPress={this.openBloodRequirement}
                        text="Rquest Blood Donation"
                    />
                </View>
                <View style={{ alignItems: 'center', padding: 10 }} >
                    <WideButton
                        mode="outline"
                        text="My Blood Donation Requests"
                    />
                </View>
            </React.Fragment>
        )
    }

    RenderItem = ({ item, index }) => {
        const { loading } = this.state;

        if (index + 1 == 1) {
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
                loading={loading}
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
        backgroundColor: ON_PRIMARY,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20 
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
        width: widthPercentageToDP('100'),
        borderBottomWidth: 1,
        borderBottomColor: GREY_1
    },
    emptyListContainer: {
        width: widthPercentageToDP(100),
        height: heightPercentageToDP(50),
        alignItems: 'center',
        justifyContent: 'center'
    },
});

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(HomeScene);