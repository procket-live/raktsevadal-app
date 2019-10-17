import React, { PureComponent } from 'react';
import MapView, { Marker } from 'react-native-maps';
import getDirections from 'react-native-google-maps-directions'
import { View, StyleSheet, Image, Text, ScrollView } from 'react-native';
import RNBottomActionSheet from 'react-native-bottom-action-sheet';
import moment from 'moment';
import {
    Placeholder,
    PlaceholderLine,
    Fade,
} from "rn-placeholder";
import { connect } from 'react-redux';

import { GREY_3, GREY_2, PRIMARY_COLOR, ON_PRIMARY, GREY_1, GREEN } from '../../constants/color.constant';
import { AccessNestedObject, AmIDoner, Call, ShareOnWhatsapp } from '../../utils/common.util';
import { DISPLAY_DATE_FORMAT } from '../../constants/app.constant';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import WideButton from '../../components/wide-button-component/wide-button.component';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PrivateApi from '../../api/api.private';
import { navigatePop, navigate } from '../../services/navigation.service';
import { WhatsAppIcon } from '../../config/image.config';
import { fetchNearbyRequest } from '../../action/nearbyRequest.action';
import { fetchMyRequest } from '../../action/myRequest.action';

let AlertView = RNBottomActionSheet.AlertView;
class BloodRequestScene extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            bloodRequest: {},
            loading: true,
        }
    }

    componentDidMount = async () => {
        const id = this.props.navigation.getParam('id');
        const bloodRequest = this.props.navigation.getParam('bloodRequest')

        if (bloodRequest) {
            this.setState({ bloodRequest, loading: false });
        }

        if (id) {
            const result = await PrivateApi.getBloodRequirement(id);
            console.log('result', result)
            if (result.success) {
                this.setState({ bloodRequest: result.response, loading: false });
            }
        }
    }

    openMap = (latitude, longitude) => {
        getDirections({
            destination: {
                latitude,
                longitude
            }
        })
    }

    accept = () => {
        AlertView.Show({
            title: "Accept blood donation request?",
            message: "Once your accept your, contact details like name and mobile number will be shared with blood donation requester. Are you sure you want to proceed.",
            positiveText: "YES",
            positiveBackgroundColor: "#27ae60",
            positiveTextColor: "#ffffff",
            negativeText: "No, go back!",
            negativeBackgroundColor: "#e74c3c",
            negativeTextColor: "#f1c40f",
            theme: "dark",
            onPositive: this.acceptBloodDonationRequest,
            onNegative: () => {
            }
        })
    }

    acceptBloodDonationRequest = () => {
        const { bloodRequest } = this.state;
        const id = AccessNestedObject(bloodRequest, '_id');

        const result = PrivateApi.acceptBloodDonationRequest(id);
        if (result.success) {
            navigatePop();
            this.props.fetchNearbyRequest();
        }
    }

    RenderBottomButton = () => {
        const { bloodRequest } = this.state;
        const doners = AccessNestedObject(bloodRequest, 'doners', []);
        const userId = AccessNestedObject(this.props, 'user._id')
        const createdBy = AccessNestedObject(bloodRequest, 'created_by');

        if (AmIDoner(userId, doners)) {
            return null;
        }

        if (createdBy == userId) {
            return null;
        }

        return (
            <TouchableOpacity
                onPress={this.accept}
                style={{ backgroundColor: GREEN, position: 'relative', left: 0, right: 0, bottom: 0, height: 50, alignItems: 'center', justifyContent: 'center', width: widthPercentageToDP(100) }}
            >
                <Text style={{ color: ON_PRIMARY, fontSize: 20 }} >ACCEPT</Text>
            </TouchableOpacity>
        )
    }

    amICreator = () => {
        const { bloodRequest } = this.state;
        const userId = AccessNestedObject(this.props, 'user._id')
        const createdBy = AccessNestedObject(bloodRequest, 'created_by');

        return createdBy == userId;
    }

    viewAllDoners = () => {
        const { bloodRequest } = this.state;
        navigate('DonersTabs', { bloodRequest });
    }

    iGotBlood = () => {
        const { bloodRequest } = this.state;
        const id = AccessNestedObject(bloodRequest, '_id');

        AlertView.Show({
            title: "Got your blood requirement?",
            message: "After proceeding your blood donation request will be marked as fulfiled. Do you want to proceed?",
            positiveText: "YES",
            positiveBackgroundColor: "#27ae60",
            positiveTextColor: "#ffffff",
            negativeText: "No, go back!",
            negativeBackgroundColor: "#e74c3c",
            negativeTextColor: "#f1c40f",
            theme: "dark",
            onPositive: async () => {
                const result = await PrivateApi.gotBlood(id);
                if (result.success) {
                    navigatePop();
                    this.props.fetchMyRequest();
                }
            },
            onNegative: () => {
            }
        })
    }

    removeRequest = () => {
        const { bloodRequest } = this.state;
        const id = AccessNestedObject(bloodRequest, '_id');

        AlertView.Show({
            title: "Want to remove blood request?",
            message: "Are you sure you want to remove blood donation request?",
            positiveText: "YES",
            positiveBackgroundColor: "#27ae60",
            positiveTextColor: "#ffffff",
            negativeText: "No, go back!",
            negativeBackgroundColor: "#e74c3c",
            negativeTextColor: "#f1c40f",
            theme: "dark",
            onPositive: async () => {
                const result = await PrivateApi.removeBloodDonationReqest(id);
                if (result.success) {
                    navigatePop();
                    this.props.fetchMyRequest();
                }
            },
            onNegative: () => {
            }
        })
    }

    RenderLoadingPlaceholedr = () => {
        return (
            <View style={[styles.container, { padding: 10 }]} >
                <Placeholder
                    Animation={Fade}
                >
                    <PlaceholderLine style={{ height: 100, marginBottom: 20 }} width={100} />
                    <PlaceholderLine style={{ height: 50, marginBottom: 20 }} width={100} />
                    <PlaceholderLine style={{ height: 50, marginBottom: 20 }} width={100} />
                    <PlaceholderLine width={100} />
                    <PlaceholderLine width={100} />
                    <PlaceholderLine style={{ height: 100, marginBottom: 20 }} width={100} />
                    <PlaceholderLine style={{ height: 50, marginBottom: 20 }} width={100} />
                    <PlaceholderLine style={{ height: 50, marginBottom: 20 }} width={100} />
                    <PlaceholderLine width={100} />
                    <PlaceholderLine width={100} />
                </Placeholder>
            </View>
        )
    }

    render() {
        const { bloodRequest, loading } = this.state;
        const latitude = AccessNestedObject(bloodRequest, 'hospital_location.coordinates.0');
        const longitude = AccessNestedObject(bloodRequest, 'hospital_location.coordinates.1');
        const hospitalName = AccessNestedObject(bloodRequest, 'hospital_name');
        const contactPerson = AccessNestedObject(bloodRequest, 'contact_person_name');
        const contactNumber = AccessNestedObject(bloodRequest, 'contact_person_mobile');
        const doners = AccessNestedObject(bloodRequest, 'doners', []);
        const userId = AccessNestedObject(this.props, 'user._id')

        if (loading) {
            return <this.RenderLoadingPlaceholedr />
        }

        return (
            <View style={styles.container} >
                <ScrollView style={{ flex: 1 }} >
                    <View style={{ height: 120, padding: 10, flexDirection: 'row' }} >
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                            <View style={styles.bloodGroupContainer} >
                                <Text style={styles.bloodGroupText} >
                                    {AccessNestedObject(bloodRequest, 'blood_group')}
                                </Text>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }} >
                                <Text style={styles.kmsText} >{AccessNestedObject(bloodRequest, 'blood_unit')} Units</Text>
                            </View>
                        </View>
                        <View style={{ flex: 2.5, alignItems: 'flex-start', justifyContent: 'center' }} >
                            <Text style={{ fontSize: 20, color: GREY_2 }} >
                                Patient: {AccessNestedObject(bloodRequest, 'patient_name')}
                            </Text>
                            <Text style={{ fontSize: 18, color: GREY_3 }} >
                                Gender: {AccessNestedObject(bloodRequest, 'patient_gender')}
                            </Text>
                            <Text style={{ fontSize: 18, color: GREY_3 }} >
                                Age: {AccessNestedObject(bloodRequest, 'patient_age')}
                            </Text>
                            {
                                (AmIDoner(userId, doners)) ?
                                    <View style={{ margin: 5, height: 20, padding: 5, backgroundColor: GREEN, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }} >
                                        <Text style={{ fontSize: 16, color: ON_PRIMARY }} >Accepted</Text>
                                    </View> : null
                            }
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', height: 50, padding: 10, borderTopWidth: 1, borderColor: GREY_1 }} >
                        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                            <Text style={{ fontSize: 18, color: GREY_2 }} >Required Till</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} >
                            <Text style={{ fontSize: 18, color: GREY_3 }} >
                                {moment(AccessNestedObject(bloodRequest, 'required_till')).format(DISPLAY_DATE_FORMAT)}
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', height: 50, padding: 10, borderTopWidth: 1, borderColor: GREY_1 }} >
                        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                            <Text style={{ fontSize: 18, color: GREY_2 }} >Share Now</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} >
                            <TouchableOpacity
                                onPress={() => ShareOnWhatsapp(bloodRequest)}
                            >
                                <Image source={WhatsAppIcon()} style={{ width: 25, height: 25, resizeMode: 'contain' }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
                        this.amICreator() ?
                            <View style={{ padding: 10, borderTopWidth: 1, borderColor: GREY_1 }} >
                                <View style={{ height: 30, alignItems: 'flex-start', justifyContent: 'center', marginBottom: 10 }} >
                                    <Text style={{ fontSize: 18, color: GREY_2 }} >Accepted doners</Text>
                                </View>
                                <WideButton
                                    mode="outline"
                                    text={'View All Doners'}
                                    onPress={this.viewAllDoners}
                                />
                            </View> : null
                    }

                    {
                        this.amICreator() ?
                            <View style={{ padding: 10, borderTopWidth: 1, borderColor: GREY_1 }} >
                                <View style={{ height: 30, alignItems: 'flex-start', justifyContent: 'center', marginBottom: 10 }} >
                                    <Text style={{ fontSize: 18, color: GREY_2 }} >Operation</Text>
                                </View>
                                <WideButton
                                    text={'I GOT BLOOD'}
                                    onPress={this.iGotBlood}
                                />
                                <View style={{ margin: 5 }} />
                                <WideButton
                                    mode="outline"
                                    text={'REMOVE BLOOD DONATION REQUEST'}
                                    onPress={this.removeRequest}
                                />
                            </View> : null
                    }
                    <View style={{ padding: 10, borderTopWidth: 1, borderColor: GREY_1 }} >
                        <View style={{ height: 30, alignItems: 'flex-start', justifyContent: 'center' }} >
                            <Text style={{ fontSize: 18, color: PRIMARY_COLOR }} >Contact Person</Text>
                        </View>
                        <Text style={{ fontSize: 20, color: GREY_2 }} >
                            Name: {contactPerson}
                        </Text>
                        <Text style={{ fontSize: 20, color: GREY_2, marginBottom: 5 }} >
                            Mobile: {contactNumber}
                        </Text>
                        <WideButton
                            mode="outline"
                            text={'Call'}
                            onPress={() => Call(contactNumber)}
                        />
                    </View>
                    <View style={{ padding: 10, borderTopWidth: 1, borderColor: GREY_1 }} >
                        <View style={{ height: 30, alignItems: 'flex-start', justifyContent: 'center' }} >
                            <Text style={{ fontSize: 18, color: PRIMARY_COLOR }} >Hospital Detail</Text>
                        </View>
                        <Text style={{ fontSize: 20, color: GREY_2, marginBottom: 5 }} >
                            Hospital: {hospitalName}
                        </Text>
                        <Text style={{ fontSize: 20, color: GREY_2 }} >
                            Address: {AccessNestedObject(bloodRequest, 'hospital_address')}
                        </Text>
                        <View style={{ padding: 10, alignItems: 'center', justifyContent: 'center' }} >
                            <MapView
                                style={{ width: widthPercentageToDP(95), height: 100 }}
                                initialRegion={{
                                    latitude,
                                    longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                            >
                                <Marker
                                    coordinate={{
                                        latitude,
                                        longitude
                                    }}
                                    title={hospitalName}
                                />
                            </MapView>
                        </View>
                        <WideButton
                            text={'Open Map'}
                            onPress={() => this.openMap(latitude, longitude)}
                        />
                    </View>
                </ScrollView>
                <this.RenderBottomButton />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    bloodGroupContainer: {
        width: widthPercentageToDP(20),
        height: widthPercentageToDP(20),
        borderRadius: widthPercentageToDP(20) / 2,
        backgroundColor: PRIMARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bloodGroupText: {
        fontSize: 26,
        color: ON_PRIMARY
    },
})

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps, { fetchMyRequest, fetchNearbyRequest })(BloodRequestScene);