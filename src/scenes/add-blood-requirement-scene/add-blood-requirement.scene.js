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
import { navigate } from '../../services/navigation.service';
import DateTimePickerComponent from '../../components/date-time-picker-component/date-time-picker.component';
import TextInputComponent from '../../components/text-input-component/text-input-component';
import GenderPickerComponent from '../../components/gender-picker-component/gender-picker.component';
import BloodGroupSelectComponent from '../../components/blood-group-select-component/blood-group-select.component';
import PrivateApi from '../../api/api.private';
import { DISPLAY_DATE_FORMAT, BLOOD_DONATION_MINIMUM_AGE, BLOOD_DONATION_MAXIMUM_AGE } from '../../constants/app.constant';
import SelectAddressComponent from '../../components/select-address-component/select-address.component';
import { AccessNestedObject } from '../../utils/common.util';

class AddBloodRequirementScene extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            patientName: 'Himanshu',
            patientAge: '24',
            patientGender: 'male',
            bloodGroup: 'O+',
            bloodUnit: '2',
            requiredTill: '29 Sep 2019',
            hospitalName: 'Govt Hospital Jalore',
            hospitalAddress: 'adddresss',
            hospitalLocation: {latitude: 'sda', longitude: 'sdas'},
            contactPersonName: 'Himanshu',
            contactPersonMobile: '9732123323',
            contactPersonAltMobile: '',
            documents: [],
            showSuccessMessage: false,
            loading: false
        }
    }

    componentDidMount = () => {
        console.log('fdsf')
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
        this.setState({ step: 3 })
    }

    proceed3 = () => {
        this.setState({ step: 4 })
    }

    proceed4 = async () => {
        // const { name, dob, location, bloodGroup, gender } = this.state;

        // if (location == '') {
        //     NotifyService.notify({ title: 'Location missing', message: '', type: 'warn' })
        //     return false;
        // }

        // const body = {
        //     name,
        //     blood_group: bloodGroup,
        //     dob,
        //     gender
        // };

        // this.setState({ loading: true })
        // const result = await PrivateApi.updateUser(body);
        // if (result.success) {
        //     const result1 = await PrivateApi.getUser();
        //     if (result1.success) {
        //         const user = result1.response;
        //         this.props.setUserAction(user);
        //         this.setState({ showSuccessMessage: true }, () => {
        //             this.animation.play();
        //         })
        //     }
        // }
        // this.setState({ loading: false })
    }

    gotHospitalAddress = (location) => {
        const latitude = AccessNestedObject(location, 'latitude');
        const longitude = AccessNestedObject(location, 'longitude');
        const address = AccessNestedObject(location, 'address');
        console.log('address', location);
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
                        onChange={(contactPersonMobile) => {
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

export default connect(null, {})(AddBloodRequirementScene);