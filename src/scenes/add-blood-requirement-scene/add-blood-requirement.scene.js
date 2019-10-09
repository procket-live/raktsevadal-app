import React, { PureComponent } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import { connect } from 'react-redux';

import StepsIndicator from '../../components/steps-indicator-component/steps-indicator.component';
import { translate } from '../../services/translation.service';
import Button from '../../components/button-component/button.component';
import { TouchableOpacity } from 'react-native-gesture-handler';
import NotifyService from '../../services/notify.service';
import { navigate, navigatePop } from '../../services/navigation.service';
import DateTimePickerComponent from '../../components/date-time-picker-component/date-time-picker.component';
import TextInputComponent from '../../components/text-input-component/text-input-component';
import GenderPickerComponent from '../../components/gender-picker-component/gender-picker.component';
import BloodGroupSelectComponent from '../../components/blood-group-select-component/blood-group-select.component';
import PrivateApi from '../../api/api.private';
import { DISPLAY_DATE_FORMAT, BLOOD_DONATION_MINIMUM_AGE, BLOOD_DONATION_MAXIMUM_AGE } from '../../constants/app.constant';
import SelectAddressComponent from '../../components/select-address-component/select-address.component';
import { AccessNestedObject, IsCorrectMobileNumber } from '../../utils/common.util';

class AddBloodRequirementScene extends PureComponent {
    constructor(props) {
        super(props);

        const contactPersonName = AccessNestedObject(props, 'user.name');
        const contactPersonMobile = AccessNestedObject(props, 'user.mobile');

        this.state = {
            step: 1,
            patientName: '',
            patientAge: '',
            patientGender: '',
            bloodGroup: '',
            bloodUnit: '',
            requiredTill: '',
            hospitalName: '',
            hospitalAddress: '',
            hospitalLocation: { latitude: '', longitude: '' },
            contactPersonName,
            contactPersonMobile,
            contactPersonAltMobile: '',
            documents: [],
            showSuccessMessage: false,
            loading: false
        }
    }

    showSuccessMessage = () => {
        this.setState({ showSuccessMessage: true }, () => {
            this.animation.play();
        })
    }

    successAnimationEnd = () => {
        navigate('ResolveLocation');
    }

    isValidPatientDetail = () => {
        const { patientName, patientAge, patientGender } = this.state;
        return (patientName == '' || patientAge == '' || patientGender == '');
    }

    isValidBloodGroupDetail = () => {
        const { bloodGroup, bloodUnit, requiredTill } = this.state;
        return (bloodGroup == '' || bloodUnit == '' || requiredTill == '')
    }

    isValidContactPersonDetail = () => {
        const { contactPersonName, contactPersonMobile } = this.state;
        return (contactPersonName == '' || contactPersonMobile == '');
    }

    isValidHospitalDetail = () => {
        const { hospitalName, hospitalAddress, hospitalLocation } = this.state;
        const { latitude, longitude } = hospitalLocation;

        return (hospitalName == '' || hospitalAddress == '' || latitude == '' || longitude == '');
    }

    proceed1 = () => {
        this.setState({ step: 2 })
    }

    proceed2 = () => {
        const { bloodUnit } = this.state;

        if (isNaN(bloodUnit)) {
            NotifyService.notify({
                title: '',
                message: 'Please enter correct blood unit',
                type: 'warning'
            })
            return;
        }

        this.setState({ step: 3 })
    }

    proceed3 = () => {
        this.setState({ step: 4 })
    }

    proceed4 = async () => {
        const { contactPersonMobile } = this.state;

        // if (!IsCorrectMobileNumber(contactPersonMobile)) {
        //     NotifyService.notify({
        //         title: '',
        //         message: 'Please enter correct mobile number',
        //         type: 'warning'
        //     })
        //     return;
        // }

        this.final();
    }

    final = async () => {
        const {
            patientName,
            patientAge,
            patientGender,
            hospitalName,
            hospitalAddress,
            hospitalLocation,
            contactPersonName,
            contactPersonMobile,
            bloodGroup,
            bloodUnit,
            requiredTill
        } = this.state;

        const body = {
            blood_group: bloodGroup,
            blood_unit: bloodUnit,
            patient_name: patientName,
            patient_age: patientAge,
            patient_gender: patientGender,
            hospital_name: hospitalName,
            hospital_address: hospitalAddress,
            hospital_location_latitude: hospitalLocation.latitude,
            hospital_location_longitude: hospitalLocation.longitude,
            required_till: moment(requiredTill, DISPLAY_DATE_FORMAT).toDate(),
            documents: [],
            contact_person_name: contactPersonName,
            contact_person_mobile: contactPersonMobile
        };

        this.setState({ loading: true })
        const result = await PrivateApi.addBloodRequirement(body);
        if (result.success) {
            navigatePop();
            NotifyService.notify({
                title: 'Succeess',
                message: `Blood Rquirement of ${bloodGroup} of ${bloodUnit} Unit(s) added`,
                type: 'success',
                duration: 40000
            });

            const callback = this.props.navigation.getParam('callback');
            if (callback && typeof callback == 'function') {
                callback();
            }
        }
        this.setState({ loading: false })
    }

    gotHospitalAddress = (location) => {
        const latitude = AccessNestedObject(location, 'latitude');
        const longitude = AccessNestedObject(location, 'longitude');
        const address = AccessNestedObject(location, 'address');
        this.setState({
            hospitalAddress: address,
            hospitalLocation: {
                latitude,
                longitude
            }
        })
    }

    RenderPatientDetails = () => {
        return (
            <React.Fragment>
                <View style={{ marginTop: 10, marginBottom: 5 }} >
                    <Text style={styles.lightSmall} ></Text>
                </View>
                <View style={{ marginTop: 2, marginBottom: 5 }} >
                    <Text style={styles.bigBold} >Patient Detail</Text>
                </View>
                <View style={{ marginTop: 35, marginBottom: 5 }} >
                    <TextInputComponent
                        value={this.state.patientName}
                        placeholder="Patient name"
                        onChangeText={(patientName) => {
                            this.setState({ patientName });
                        }}
                    />
                </View>
                <View style={{ marginTop: 35, marginBottom: 5 }} >
                    <TextInputComponent
                        value={this.state.patientAge}
                        placeholder="Patient Age"
                        onChangeText={(patientAge) => {
                            this.setState({ patientAge: String(patientAge) });
                        }}
                    />
                </View>
                <View style={{ marginTop: 35, marginBottom: 5 }} >
                    <GenderPickerComponent
                        value={this.state.patientGender}
                        onChange={(patientGender) => {
                            this.setState({ patientGender });
                        }}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30, marginBottom: 10 }} >
                    <Button
                        loading={this.state.loading}
                        text={translate('proceed')}
                        onPress={this.proceed1}
                        disabled={this.isValidPatientDetail()}
                    />
                </View>
            </React.Fragment>
        )
    }

    RenderContactPersonName = () => {
        return (
            <React.Fragment>
                <View style={{ marginTop: 10, marginBottom: 5 }} >
                    <Text style={styles.lightSmall} ></Text>
                </View>
                <View style={{ marginTop: 2, marginBottom: 5 }} >
                    <Text style={styles.bigBold} >Contact person detail</Text>
                </View>
                <View style={{ marginTop: 35, marginBottom: 5 }} >
                    <TextInputComponent
                        value={this.state.contactPersonName}
                        placeholder="Contact person name"
                        onChangeText={(contactPersonName) => {
                            this.setState({ contactPersonName });
                        }}
                    />
                </View>
                <View style={{ marginTop: 35, marginBottom: 5 }} >
                    <TextInputComponent
                        value={this.state.contactPersonMobile}
                        placeholder="Contact person mobile number"
                        onChangeText={(contactPersonMobile) => {
                            this.setState({ contactPersonMobile });
                        }}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30, marginBottom: 10 }} >
                    <Button
                        loading={this.state.loading}
                        text={translate('proceed')}
                        onPress={this.proceed4}
                        disabled={this.isValidContactPersonDetail()}
                    />
                </View>
            </React.Fragment>
        )
    }

    RenderHospitalDetails = () => {
        const { user } = this.state;
        const latitude = AccessNestedObject(user, 'latest_location.coordinates.0', 0.0);
        const longitude = AccessNestedObject(user, 'latest_location.coordinates.1', 0.0);

        return (
            <React.Fragment>
                <View style={{ marginTop: 10, marginBottom: 5 }} >
                    <Text style={styles.lightSmall} ></Text>
                </View>
                <View style={{ marginTop: 2, marginBottom: 5 }} >
                    <Text style={styles.bigBold} >Hospital Detail</Text>
                </View>
                <View style={{ marginTop: 35, marginBottom: 5 }} >
                    <TextInputComponent
                        value={this.state.hospitalName}
                        placeholder="Hospital name"
                        onChangeText={(hospitalName) => {
                            this.setState({ hospitalName });
                        }}
                    />
                </View>
                <View style={{ marginTop: 35, marginBottom: 5 }} >
                    <SelectAddressComponent
                        latitude={latitude}
                        longitude={longitude}
                        value={this.state.hospitalAddress}
                        onChange={this.gotHospitalAddress}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30, marginBottom: 10 }} >
                    <Button
                        disabled={this.isValidHospitalDetail()}
                        loading={this.state.loading}
                        text={translate('proceed')}
                        onPress={this.proceed3}
                    />
                </View>
            </React.Fragment>
        )
    }

    RenderBloodGroupSelect = () => {
        return (
            <React.Fragment>
                <View style={{ marginTop: 10, marginBottom: 5 }} >
                    <Text style={styles.lightSmall} >Select patient's blood group</Text>
                </View>
                <BloodGroupSelectComponent
                    value={this.state.bloodGroup}
                    onSelect={(bloodGroup) => this.setState({ bloodGroup })}
                />
                <View style={{ marginTop: 35, marginBottom: 5 }} >
                    <TextInputComponent
                        value={this.state.bloodUnit}
                        placeholder="Blood unit required"
                        keyboardType="number-pad"
                        onChangeText={(bloodUnit) => {
                            this.setState({ bloodUnit });
                        }}
                    />
                </View>
                <View style={{ marginTop: 35, marginBottom: 5 }} >
                    <DateTimePickerComponent
                        value={this.state.requiredTill}
                        placeholder="Blood required till"
                        format={DISPLAY_DATE_FORMAT}
                        onChange={(requiredTill) => {
                            this.setState({ requiredTill: String(requiredTill) });
                        }}
                        minimumDate={moment().toDate()}
                    />
                </View>
                <View
                    style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30, marginBottom: 10 }}
                >
                    <Button
                        loading={this.state.loading}
                        text={translate('proceed')}
                        disabled={this.isValidBloodGroupDetail()}
                        onPress={this.proceed2}
                    />
                </View>
            </React.Fragment>
        )
    }

    RenderSuccessMessage = () => {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                <View style={{ width: 200, height: 200 }} >
                    <LottieView
                        ref={animation => {
                            this.animation = animation;
                        }}
                        onAnimationFinish={this.successAnimationEnd}
                        loop={false}
                        source={require('../../assets/lottie/success.json')}
                    />
                </View>
                <View style={{ marginTop: 5, marginBottom: 5 }} >
                    <Text style={styles.bigBold} >{translate('user-details-updated')}</Text>
                </View>
            </View>
        );
    }

    render() {
        if (this.state.showSuccessMessage) {
            return this.RenderSuccessMessage();
        }

        return (
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.container}
                >

                    <StepsIndicator
                        steps={4}
                        currentStep={this.state.step}
                    />
                    {this.state.step == 1 ? this.RenderPatientDetails() : null}
                    {this.state.step == 2 ? this.RenderBloodGroupSelect() : null}
                    {this.state.step == 3 ? this.RenderHospitalDetails() : null}
                    {this.state.step == 4 ? this.RenderContactPersonName() : null}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        padding: 10
    },
    lightSmall: {
        fontSize: 20,
        color: '#34495e'
    },
    lightSmaller: {
        fontSize: 18,
        color: '#34495e',
    },
    primarySmall: {
        color: '#2ecc71',
        fontSize: 18,
    },
    actionText: {
        color: '#e74c3c',
        fontSize: 20,
    },
    bigBold: {
        fontSize: 28,
        color: '#34495e'
    },
    input: {
        width: 320,
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: '#e74c3c',
        fontSize: 25,
        fontFamily: 'Noway'
    }
})

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps, {})(AddBloodRequirementScene);