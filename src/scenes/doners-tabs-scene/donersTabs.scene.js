import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ScrollTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import DonersListScene from '../doners-list-scene/donersList.scene';
import PrivateApi from '../../api/api.private';
import { ON_PRIMARY, PRIMARY_COLOR, GREY_3 } from '../../constants/color.constant';
import DONATION_MAP from '../../constants/donation.constant';
import { JSONToQuery, AccessNestedObject } from '../../utils/common.util';

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

class DonersTabsScene extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            acceptedDoners: [1, 2, 3],
            nearbyDoners: [1, 2, 3],
            acceptedDonersLoading: true,
            nearbyDonersLoading: true,
            sentDoners: []
        }
    }

    componentDidMount = () => {
        const bloodRequest = this.props.navigation.getParam('bloodRequest');

        const id = AccessNestedObject(bloodRequest, '_id');
        const bloodGroup = AccessNestedObject(bloodRequest, 'blood_group');
        const latitude = AccessNestedObject(bloodRequest, 'hospital_location.coordinates.0');
        const longitude = AccessNestedObject(bloodRequest, 'hospital_location.coordinates.1');

        this.fetchAcceptedDoners(id);
        this.fetchNearbyDoners(bloodGroup, latitude, longitude);
    }

    fetchAcceptedDoners = async (id) => {
        const result = await PrivateApi.getBloodDonationRequestDoners(id);
        if (result.success) {
            const acceptedDoners = AccessNestedObject(result, 'response', []);
            const sentDoners = acceptedDoners.map(item => item._id);
            this.setState({ acceptedDoners, sentDoners });
        }

        this.setState({ acceptedDonersLoading: false });
    }

    fetchNearbyDoners = async (bloodGroup, latitude, longitude) => {
        const params = {
            latitude,
            longitude,
            blood_group: AccessNestedObject(DONATION_MAP, `${bloodGroup}.receive`, '').map((bg) => bg.replace('+', 'p').replace('-', 'n')).join(',')
        }

        const result = await PrivateApi.findUser(JSONToQuery(params));
        if (result.success) {
            this.setState({ nearbyDoners: result.response });
        }

        this.setState({ nearbyDonersLoading: false });
    }

    request = async (id) => {
        const { user } = this.props;
        const bloodRequest = this.props.navigation.getParam('bloodRequest');
        const bloodRequestId = AccessNestedObject(bloodRequest, '_id');

        const requesterName = AccessNestedObject(user, 'name');
        const bloodGroup = AccessNestedObject(bloodRequest, 'blood_group');
        const patientName = AccessNestedObject(bloodRequest, 'patient_name');

        const body = {
            blood_request_id: bloodRequestId,
            user_id: id,
            message: `${requesterName} has invited you to donate blood for patient ${patientName} (${bloodGroup}). Donate and help them to save his/her life.`
        }

        await PrivateApi.request(body);
    }

    render() {
        return (
            <ScrollTabView
                {...TAB_BAR_DEFAULT_STYLES}
            >
                <DonersListScene
                    showCallButton
                    request={this.request}
                    data={this.state.acceptedDoners}
                    loading={this.state.acceptedDonersLoading}
                    tabLabel="Doners List"
                />
                <DonersListScene
                    showRequestButton
                    request={this.request}
                    data={this.state.nearbyDoners}
                    sentDoners={this.state.sentDoners}
                    loading={this.state.nearbyDonersLoading}
                    tabLabel="Nearby Doners"
                />
            </ScrollTabView>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user
})

export default connect(mapStateToProps)(DonersTabsScene);