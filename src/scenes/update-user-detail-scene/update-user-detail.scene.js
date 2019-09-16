import React, { PureComponent } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import LottieView from 'lottie-react-native';
import moment from 'moment';

import StepsIndicator from '../../components/steps-indicator-component/steps-indicator.component';
import { translate } from '../../services/translation.service';
import Button from '../../components/button-component/button.component';
import { TouchableOpacity } from 'react-native-gesture-handler';
import NotifyService from '../../services/notify.service';
import { navigate } from '../../services/navigation.service';
import DateTimePickerComponent from '../../components/date-time-picker-component/date-time-picker.component';
import TextInputComponent from '../../components/text-input-component/text-input-component';
import { DISPLAY_DATE_FORMAT, API_DATE_FORMAT, BLOOD_DONATION_MINIMUM_AGE, BLOOD_DONATION_MAXIMUM_AGE } from '../../constants/app.constant';
import GenderPickerComponent from '../../components/gender-picker-component/gender-picker.component';
import BloodGroupSelectComponent from '../../components/blood-group-select-component/blood-group-select.component';

class UpdateUserDetailScene extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            name: '',
            dob: '',
            gender: '',
            bloodGroup: '',
            location: 'Bengaluru, Karnataka, In',
            showSuccessMessage: false,
        }
    }

    componentDidMount = () => {
        SplashScreen.hide();
    }

    showSuccessMessage = () => {
        this.setState({ showSuccessMessage: true }, () => {
            this.animation.play();
        })
    }

    successAnimationEnd = () => {
        navigate('ResolveApp');
    }

    proceed1 = () => {
        this.setState({ step: 2 })
    }

    isValidBasicDetail = () => {
        const { name, dob, gender } = this.state;
        return (name == '' || dob == '' || gender == '');
    }

    proceed2 = () => {
        const { bloodGroup } = this.state;

        if (bloodGroup == '') {
            NotifyService.notify({ title: 'Blood group missing', message: 'Please select your blood group.', type: 'warn' })
            return false;
        }

        this.setState({ step: 3 })
    }

    proceed3 = () => {
        const { location } = this.state;

        if (location == '') {
            NotifyService.notify({ title: 'Location missing', message: '', type: 'warn' })
            return false;
        }

        this.setState({ showSuccessMessage: true }, () => {
            this.animation.play();
        })
    }

    RenderBasicDetail = () => {
        return (
            <React.Fragment>
                <View style={{ marginTop: 10, marginBottom: 5 }} >
                    <Text style={styles.lightSmall} >{translate('enter-your')}</Text>
                </View>
                <View style={{ marginTop: 2, marginBottom: 5 }} >
                    <Text style={styles.bigBold} >{translate('basic-details')}</Text>
                </View>
                <View style={{ marginTop: 35, marginBottom: 5 }} >
                    <TextInputComponent
                        value={this.state.name}
                        style={styles.input}
                        placeholder="Full name"
                        onChangeText={(name) => {
                            this.setState({ name });
                        }}
                    />
                </View>
                <View style={{ marginTop: 35, marginBottom: 5 }} >
                    <DateTimePickerComponent
                        value={this.state.dob}
                        placeholder="Date of birth"
                        format={DISPLAY_DATE_FORMAT}
                        onChange={(dob) => {
                            this.setState({ dob: String(dob) });
                        }}
                        minimumDate={moment().subtract(BLOOD_DONATION_MAXIMUM_AGE, 'years').toDate()}
                        maximumDate={moment().subtract(BLOOD_DONATION_MINIMUM_AGE, 'years').toDate()}
                    />
                </View>
                <View style={{ marginTop: 35, marginBottom: 5 }} >
                    <GenderPickerComponent
                        value={this.state.gender}
                        onChange={(gender) => {
                            this.setState({ gender });
                        }}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30, marginBottom: 10 }} >
                    <Button
                        loading={this.state.loading}
                        text={translate('proceed')}
                        onPress={this.proceed1}
                        disabled={this.isValidBasicDetail()}
                    />
                </View>
            </React.Fragment>
        )
    }

    RenderBloodGroupSelect = () => {
        return (
            <React.Fragment>
                <View style={{ marginTop: 10, marginBottom: 5 }} >
                    <Text style={styles.lightSmall} >{translate('select-your')}</Text>
                </View>
                <View style={{ marginTop: 2, marginBottom: 5 }} >
                    <Text style={styles.bigBold} >{translate('blood-group')}</Text>
                </View>
                <BloodGroupSelectComponent
                    value={this.state.bloodGroup}
                    onSelect={(bloodGroup) => this.setState({ bloodGroup })}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30, marginBottom: 10 }} >
                    <Button
                        loading={this.state.loading}
                        text={translate('proceed')}
                        onPress={this.proceed2}
                    />
                </View>
            </React.Fragment>
        )
    }

    RenderLocationSelect = () => {
        return (
            <React.Fragment>
                <View style={{ marginTop: 10, marginBottom: 5 }} >
                    <Text style={styles.lightSmall} >{translate('let-us-locate-your')}</Text>
                </View>
                <View style={{ marginTop: 2, marginBottom: 5 }} >
                    <Text style={styles.bigBold} >{translate('location')}</Text>
                </View>
                <View style={{ marginTop: 35, marginBottom: 5 }} >
                    <TextInputComponent
                        value={this.state.location}
                        placeholder="Current location"
                        editable={false}
                        actionName="Locate"
                        action={() => { }}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30, marginBottom: 10 }} >
                    <Button
                        loading={this.state.loading}
                        text={translate('proceed')}
                        onPress={this.proceed3}
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
                        steps={3}
                        currentStep={this.state.step}
                    />
                    {this.state.step == 1 ? this.RenderBasicDetail() : null}
                    {this.state.step == 2 ? this.RenderBloodGroupSelect() : null}
                    {this.state.step == 3 ? this.RenderLocationSelect() : null}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
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

export default UpdateUserDetailScene;