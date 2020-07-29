import React, { PureComponent } from 'react';
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
import { FloatingAction } from "react-native-floating-action";

import { GREY_3, GREY_2, PRIMARY_COLOR, ON_PRIMARY, GREY_1, GREEN, GREY_BG, TEXT_COLOR } from '../../constants/color.constant';
import { AccessNestedObject, AmIDoner, Call, ShareOnWhatsapp } from '../../utils/common.util';
import { DISPLAY_DATE_FORMAT } from '../../constants/app.constant';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import WideButton from '../../components/wide-button-component/wide-button.component';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import PrivateApi from '../../api/api.private';
import { navigatePop, navigate } from '../../services/navigation.service';
import { WhatsAppIcon, BottleIcon, PhoneIcon, MapIcon, ShareIcon, CheckIcon, CloseIcon } from '../../config/image.config';
import { fetchNearbyRequest } from '../../action/nearbyRequest.action';
import { fetchMyRequest } from '../../action/myRequest.action';
import BloodUnitComponent from './components/blood-units.component';
import BLOOD_GROUPS from '../../constants/donation.constant';

let AlertView = RNBottomActionSheet.AlertView;
class BloodRequestScene extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            bloodRequest: {},
            loading: true,
            processing: false
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

    acceptBloodDonationRequest = async () => {
        const { bloodRequest } = this.state;
        const id = AccessNestedObject(bloodRequest, '_id');

        const result = await PrivateApi.acceptBloodDonationRequest(id);
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
            return (
                <TouchableOpacity
                    onPress={() => this.openMap(AccessNestedObject(bloodRequest, 'latitude'), AccessNestedObject(bloodRequest, 'longitude'))}
                    style={{ backgroundColor: PRIMARY_COLOR, position: 'relative', left: 0, right: 0, bottom: widthPercentageToDP(2.5), height: 50, alignItems: 'center', justifyContent: 'center', width: widthPercentageToDP(95), borderRadius: 10 }}
                >
                    <Text style={{ color: ON_PRIMARY, fontSize: 20 }} >Navigate to hospital</Text>
                </TouchableOpacity>
            )
        }

        if (createdBy == userId) {
            return null;
        }

        return (
            <TouchableOpacity
                onPress={this.accept}
                style={{ backgroundColor: PRIMARY_COLOR, position: 'relative', left: 0, right: 0, bottom: widthPercentageToDP(2.5), height: 50, alignItems: 'center', justifyContent: 'center', width: widthPercentageToDP(95), borderRadius: 10 }}
            >
                <Text style={{ color: ON_PRIMARY, fontSize: 20 }} >Donate Now</Text>
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

    RenderImage = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => navigate('FullScreen', { image: item })}
            >
                <Image
                    style={styles.image}
                    source={{
                        uri: item,
                    }}
                />
            </TouchableOpacity>
        )
    }

    RenderDocuments = (documents) => {
        return (
            <View style={{ padding: 5 }} >
                <FlatList
                    renderItem={this.RenderImage}
                    data={documents}
                    horizontal
                />
            </View>
        )
    }

    RenderRequestDeleted = () => {
        const { bloodRequest } = this.state;

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
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', height: 50, padding: 10, borderTopWidth: 1, borderColor: GREY_1 }} >
                        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                            <Text style={{ fontSize: 18, color: PRIMARY_COLOR }} >Blood Requirement has been removed by lister.</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }

    RenderRequestFulfiled = () => {
        const { bloodRequest } = this.state;

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
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', height: 50, padding: 10, borderTopWidth: 1, borderColor: GREY_1 }} >
                        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                            <Text style={{ fontSize: 18, color: GREEN }} >Blood Requirement has been fulfiled.</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }

    onClickFab = (name) => {
        switch (name) {
            case 'got_blood':
                this.iGotBlood();
                break;
            case 'cancel_blood_request':
                this.removeRequest();
                break;
        }
    }


    render() {
        const { bloodRequest, loading } = this.state;
        const active = AccessNestedObject(bloodRequest, 'active', true);
        const fulfiled = AccessNestedObject(bloodRequest, 'fulfiled', false);

        const latitude = AccessNestedObject(bloodRequest, 'hospital_location.coordinates.0');
        const longitude = AccessNestedObject(bloodRequest, 'hospital_location.coordinates.1');
        const hospitalName = AccessNestedObject(bloodRequest, 'hospital_name');
        const contactPerson = AccessNestedObject(bloodRequest, 'contact_person_name');
        const contactNumber = AccessNestedObject(bloodRequest, 'contact_person_mobile');
        const doners = AccessNestedObject(bloodRequest, 'doners', []);
        const userId = AccessNestedObject(this.props, 'user._id')
        const documents = AccessNestedObject(bloodRequest, 'documents');
        const units = AccessNestedObject(bloodRequest, 'blood_unit');
        const fulfilled = AccessNestedObject(bloodRequest, 'fulfilled_units') || 0;
        const patientName = AccessNestedObject(bloodRequest, 'patient_name');
        const patientAge = AccessNestedObject(bloodRequest, 'patient_age');
        const patientGender = AccessNestedObject(bloodRequest, 'patient_gender');
        const validTime = moment(AccessNestedObject(bloodRequest, 'required_till')).format('ll');
        const bloodGroup = AccessNestedObject(bloodRequest, 'blood_group');
        const hospitalAddress = AccessNestedObject(bloodRequest, 'hospital_address');

        const actions = [
            {
                text: "Got Blood",
                name: "got_blood",
                position: 1,
                icon: CheckIcon()
            },
            {
                text: "Cancel Blood Request",
                name: "cancel_blood_request",
                position: 2,
                icon: CloseIcon()
            },
        ]

        const deleted = !active && !fulfiled;
        const completed = !active && fulfiled;
        const progress = !deleted && !completed;

        if (loading) {
            return <this.RenderLoadingPlaceholedr />
        }

        return (
            <View style={styles.container} >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyl={{ alignItems: 'center', }}
                >
                    <BloodUnitComponent units={units} completed={completed} fulfiled={fulfilled} amIDoner={AmIDoner(userId, doners)} />
                    <View style={{ width: widthPercentageToDP(95), borderWidth: 1, borderColor: GREY_BG, borderRadius: 10, margin: widthPercentageToDP(2.5) }} >
                        <View style={{ height: 70, flexDirection: 'row', padding: 15, borderBottomColor: GREY_BG, borderBottomWidth: 1 }} >
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                                <View style={styles.bloodGroupContainer} >
                                    <Text style={styles.bloodGroupText} >
                                        {bloodGroup}
                                    </Text>
                                </View>
                            </View>
                            <View style={{ flex: 4, alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 10 }} >
                                <Text style={{ fontSize: 20, color: TEXT_COLOR }} >Blood Request</Text>
                                {
                                    progress ? <Text style={{ fontSize: 16, color: GREEN }} >In Progress</Text> : null
                                }
                                {
                                    completed ? <Text style={{ fontSize: 16, color: GREEN }} >Fulfilled</Text> : null
                                }
                                {
                                    deleted ? <Text style={{ fontSize: 16, color: PRIMARY_COLOR }} >Deleted</Text> : null
                                }
                            </View>
                            <View style={{ flex: 2, alignItems: 'flex-end', justifyContent: 'center', paddingLeft: 10 }} >
                                {
                                    progress ?
                                        <TouchableOpacity
                                            onPress={() => ShareOnWhatsapp(bloodRequest)}
                                            style={{ padding: 5, flexDirection: 'row', borderWidth: 1, borderColor: TEXT_COLOR, borderRadius: 5 }}
                                        >
                                            <Image tintColor={TEXT_COLOR} source={ShareIcon()} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
                                            <Text style={{ color: TEXT_COLOR, marginLeft: 10, fontSize: 16 }} >
                                                Share
                                            </Text>
                                        </TouchableOpacity>
                                        : null
                                }
                            </View>
                        </View>
                        <View style={{ padding: 10 }} >
                            <View style={{ height: 30, flexDirection: 'row' }} >
                                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                                    <Text style={{ fontSize: 16, color: TEXT_COLOR }} >Patient Name</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} >
                                    <Text style={{ fontSize: 16, color: GREY_3 }} >{patientName}</Text>
                                </View>
                            </View>
                            <View style={{ height: 30, flexDirection: 'row' }} >
                                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                                    <Text style={{ fontSize: 16, color: TEXT_COLOR }} >Gender & Age</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} >
                                    <Text style={{ fontSize: 16, color: GREY_3 }} >{`${patientGender} | ${patientAge}`}</Text>
                                </View>
                            </View>
                            <View style={{ height: 30, flexDirection: 'row' }} >
                                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                                    <Text style={{ fontSize: 16, color: TEXT_COLOR }} >Valid Time</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} >
                                    <Text style={{ fontSize: 16, color: GREY_3 }} >{validTime}</Text>
                                </View>
                            </View>
                            {
                                Array.isArray(documents) && documents.length ?
                                    <>
                                        <View style={{ height: 30, flexDirection: 'row' }} >
                                            <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                                                <Text style={{ fontSize: 16, color: TEXT_COLOR }} >Documents</Text>
                                            </View>
                                        </View>
                                        {this.RenderDocuments(documents)}
                                    </>
                                    : null
                            }
                        </View>
                        <View style={{ height: 40, flexDirection: 'row', padding: 10, borderTopColor: GREY_BG, borderTopWidth: 1 }} >
                            <View style={{ flex: 1, alignItems: 'flex-start', flexDirection: 'row' }} >
                                <Text style={{ fontSize: 16, color: TEXT_COLOR }} >By</Text>
                                <Text style={{ fontSize: 16, color: GREY_3, marginLeft: 5 }} >{contactPerson}</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingLeft: 10 }} >
                                {
                                    progress ?
                                        <TouchableOpacity
                                            onPress={() => Call(contactNumber)}
                                            style={{ padding: 5, flexDirection: 'row', borderWidth: 1, borderColor: GREEN, borderRadius: 5 }}
                                        >
                                            <Image tintColor={GREEN} source={PhoneIcon()} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
                                            <Text style={{ color: GREEN, marginLeft: 10, fontSize: 16 }} >
                                                Call
                                            </Text>
                                        </TouchableOpacity> : null
                                }
                            </View>
                        </View>
                    </View>
                    <View style={{ width: widthPercentageToDP(95), borderWidth: 1, borderColor: GREY_BG, borderRadius: 10, margin: widthPercentageToDP(2.5) }} >
                        <View style={{ height: 40, flexDirection: 'row', padding: 10, borderBottomColor: GREY_BG, borderBottomWidth: 1 }} >
                            <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 10 }} >
                                <Text style={{ fontSize: 16, color: TEXT_COLOR }} >Blood Donor Type Required</Text>
                            </View>
                        </View>
                        <View style={{ padding: 10 }} >
                            <FlatList
                                horizontal
                                data={BLOOD_GROUPS[bloodGroup].receive}
                                renderItem={({ item }) => {
                                    return (
                                        <View style={{ padding: 10, height: 50, minWidth: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: PRIMARY_COLOR, borderRadius: 10, margin: 10 }} >
                                            <Text style={{ fontSize: 16, color: PRIMARY_COLOR }} >
                                                {item}
                                            </Text>
                                        </View>
                                    )
                                }}
                            />
                        </View>
                        {
                            this.amICreator() && completed ?
                                <View style={{ padding: 10, borderColor: GREY_BG, borderTopWidth: 1 }} >
                                    <TouchableOpacity
                                        onPress={this.viewAllDoners}
                                        style={{ height: 50, borderWidth: 1, borderRadius: 10, borderColor: PRIMARY_COLOR, alignItems: 'center', justifyContent: 'center' }} >
                                        <Text style={{ fontSize: 16, color: PRIMARY_COLOR }}>View all doners</Text>
                                    </TouchableOpacity>
                                </View> : null
                        }
                    </View>
                    <View style={{ width: widthPercentageToDP(95), borderWidth: 1, borderColor: GREY_BG, borderRadius: 10, margin: widthPercentageToDP(2.5) }} >
                        <View style={{ height: 40, flexDirection: 'row', padding: 10, borderBottomColor: GREY_BG, borderBottomWidth: 1 }} >
                            <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 10 }} >
                                <Text style={{ fontSize: 16, color: TEXT_COLOR }} >Hospital Information</Text>
                            </View>
                        </View>
                        <View style={{ padding: 10 }} >
                            <View style={{ height: 30, flexDirection: 'row' }} >
                                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                                    <Text style={{ fontSize: 16, color: TEXT_COLOR }} >Hospital</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} >
                                    <Text style={{ fontSize: 16, color: GREY_3 }} >{hospitalName}</Text>
                                </View>
                            </View>
                            <View style={{ height: 30, flexDirection: 'row' }} >
                                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                                    <Text style={{ fontSize: 16, color: TEXT_COLOR }} >Address</Text>
                                </View>
                            </View>
                            <View style={{ height: 30, flexDirection: 'row', marginTop: 5, marginBottom: 5 }} >
                                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                                    <Text style={{ fontSize: 16, color: GREY_3 }} >
                                        {hospitalAddress}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => this.openMap(latitude, longitude)}
                            style={{ padding: 5 }}
                        >
                            <View style={{ height: 40, flexDirection: 'row', padding: 10, borderTopColor: GREY_BG, borderTopWidth: 1 }} >
                                <View style={{ flex: 1, alignItems: 'flex-start', flexDirection: 'row' }} >
                                    <Text style={{ fontSize: 16, color: TEXT_COLOR }} >Navigate to hospital</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingLeft: 10 }} >

                                    <Image source={MapIcon()} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 100 }} />
                </ScrollView>
                <this.RenderBottomButton />
                <FloatingAction
                    visible={this.amICreator() && progress}
                    color={PRIMARY_COLOR}
                    actions={actions}
                    onPressItem={this.onClickFab}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    bloodGroupContainer: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        backgroundColor: PRIMARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bloodGroupText: {
        fontSize: 20,
        color: ON_PRIMARY
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    }
})

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps, { fetchMyRequest, fetchNearbyRequest })(BloodRequestScene);