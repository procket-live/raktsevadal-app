import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import LottieView from 'lottie-react-native';
import { connect } from 'react-redux';
import RNSmsRetriever from 'react-native-sms-retriever-api';
import TRUECALLER, {
    TRUECALLER_EVENT,
    TRUECALLER_CONSENT_MODE,
    TRUECALLER_CONSENT_TITLE,
    TRUECALLER_FOOTER_TYPE
} from 'react-native-truecaller-sdk'

import StepsIndicator from '../../components/steps-indicator-component/steps-indicator.component';
import { translate } from '../../services/translation.service';
import Button from '../../components/button-component/button.component';
import { TouchableOpacity } from 'react-native-gesture-handler';
import NotifyService from '../../services/notify.service';
import { navigate } from '../../services/navigation.service';
import TextInputComponent from '../../components/text-input-component/text-input-component';
import { TEXT_COLOR } from '../../constants/color.constant';
import PublicApi from '../../api/api.public';
import APP from '../../constants/app.constant';
import { setAuthTokenAction, setUserAction } from '../../action/user.action';
import { IsCorrectMobileNumber, AccessNestedObject } from '../../utils/common.util';
import PrivateApi from '../../api/api.private';

class LoginScene extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            mobile: '+91 ',
            otp: '',
            otpSent: false,
            loading: false,
            showSuccessMessage: false
        }
    }

    componentDidMount = () => {
        this.detectOTP();
        TRUECALLER.initializeClient(
            TRUECALLER_CONSENT_MODE.Popup,
            TRUECALLER_CONSENT_TITLE.Register,
            TRUECALLER_FOOTER_TYPE.Skip
        )

        TRUECALLER.isUsable(result => {
            if (result === true)
                TRUECALLER.requestTrueProfile()
        });

        TRUECALLER.on(TRUECALLER_EVENT.TrueProfileResponse, profile => {
            this.gotTruecallerProfile(profile);
        });
    }

    gotTruecallerProfile = async (profile) => {
        const mobile = AccessNestedObject(profile, 'phoneNumber');
        this.setState({ mobile: `+91 ${mobile.substring(3)}`, loading: true });
        const result = await PublicApi.truecallerLogin(profile);
        if (result.success) {
            const token = result.token;
            this.props.setAuthTokenAction(token);
            APP.TOKEN = token;
            this.fetchUserObject();
        } else {
            this.setState({ loading: false });
        }
    }

    componentWillUnmout() {
        RNSmsRetriever.removeListener();
    }

    detectOTP = async () => {
        await RNSmsRetriever.getOtp();
        RNSmsRetriever.addListener(({ message }) => {
            const otp = message.match(/\d/g).join("").substring(0, 6);
            this.setState({ otp }, this.proceed);
        })
    }

    proceed = async () => {
        const { mobile, otp } = this.state;
        const apiMobileNumber = mobile.substr(4, 14);

        if (!this.state.otpSent) {
            if (!IsCorrectMobileNumber(mobile)) {
                NotifyService.notify({ title: 'Incorrect mobile number', message: 'Please check and re-enter mobile number', type: 'warn' })
                return;
            }

            this.setState({ loading: true });

            const result = await PublicApi.generateOTP(apiMobileNumber);
            this.setState({ loading: false });
            if (result.success) {
                this.setState({ otpSent: true, step: this.state.step + 1 })
            }
        } else {
            if (!this.isCorrectOTP()) {
                NotifyService.notify({ title: 'Incorrect OTP', message: 'Please enter correct OTP', type: 'warn' })
                return;
            }

            this.setState({ loading: true });
            const result2 = await PublicApi.verifyOTP(apiMobileNumber, otp);
            if (result2.success) {
                const token = result2.token;
                this.props.setAuthTokenAction(token);
                APP.TOKEN = token;
                this.fetchUserObject();
            }
        }
    }

    fetchUserObject = async () => {
        const result = await PrivateApi.getUser();
        if (result.success) {
            this.props.setUserAction(AccessNestedObject(result, 'response', {}))
        }

        this.setState({ loading: false });
        setTimeout(this.showSuccessMessage, 100);
    }

    edit = () => {
        this.setState({ otpSent: false, mobile: '+91 ', step: this.state.step - 1, otp: '' });
    }

    isCorrectOTP = () => {
        const { otp } = this.state;
        return /^\d{6}$/.test(otp);
    }

    showSuccessMessage = () => {
        this.setState({ showSuccessMessage: true }, () => {
            this.animation.play();
        })
    }

    successAnimationEnd = () => {
        navigate('UpdateUserDetail');
    }

    RenderMobileNumberForm = () => {
        return (
            <React.Fragment>
                <View style={{ marginTop: 10, marginBottom: 5 }} >
                    <Text style={styles.lightSmall} >{translate('hey-whats-your')}</Text>
                </View>
                <View style={{ marginTop: 2, marginBottom: 5 }} >
                    <Text style={styles.bigBold} >{translate('mobile-number')}</Text>
                </View>
                <View style={{ marginTop: 35, marginBottom: 5 }} >
                    <TextInputComponent
                        value={this.state.mobile}
                        maxLength={14}
                        keyboardType="phone-pad"
                        onChangeText={(mobile) => {
                            if (mobile.length <= 4) {
                                this.setState({ mobile: '+91 ' })
                                return;
                            }

                            this.setState({ mobile });

                            if (mobile.length == 14) {
                                Keyboard.dismiss();
                            }
                        }}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30, marginBottom: 10 }} >
                    <Button
                        loading={this.state.loading}
                        disabled={(!(this.state.mobile.length == 14) || this.state.loading)}
                        text={translate('proceed')}
                        onPress={this.proceed}
                    />
                </View>
            </React.Fragment>
        )
    }

    RenderOTPForm = () => {
        return (
            <React.Fragment>
                <View style={{ marginTop: 10, marginBottom: 5 }} >
                    <Text style={styles.lightSmall} >{translate('share-your')}</Text>
                </View>
                <View style={{ marginTop: 5, marginBottom: 5 }} >
                    <Text style={styles.bigBold} >{translate('verification-code')}</Text>
                </View>
                <View style={{ marginTop: 2, marginBottom: 5 }} >
                    <Text style={styles.lightSmaller} >{translate('code-sent-to-this-number')}</Text>
                </View>
                <View style={{ marginTop: 2, marginBottom: 5, flexDirection: 'row', alignItems: 'center' }} >
                    <Text style={styles.primarySmall} >{this.state.mobile}</Text>
                    <TouchableOpacity
                        onPress={this.edit}
                        style={{ padding: 2, marginLeft: 10 }}
                    >
                        <Text style={styles.actionText}>{translate('edit')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 35, marginBottom: 5 }} >
                    <TextInputComponent
                        value={this.state.otp}
                        maxLength={6}
                        keyboardType="phone-pad"
                        placeholder="Enter One Time Password"
                        onChangeText={(otp) => {
                            this.setState({ otp });

                            if (otp.length == 6) {
                                Keyboard.dismiss();
                            }
                        }}
                    />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30, marginBottom: 10 }} >
                    <Button
                        loading={this.state.loading}
                        disabled={(!(this.state.otp.length == 6) || this.state.loading)}
                        text={translate('proceed')}
                        onPress={this.proceed}
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
                    <Text style={styles.bigBold} >{translate('mobile-number-verified')}</Text>
                </View>
            </View>
        );
    }

    render() {
        if (this.state.showSuccessMessage) {
            return this.RenderSuccessMessage();
        }

        return (
            <View style={styles.container} >
                <StepsIndicator
                    steps={2}
                    currentStep={this.state.step}
                />
                {this.state.otpSent ? this.RenderOTPForm() : this.RenderMobileNumberForm()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        padding: 10
    },
    lightSmall: {
        fontSize: 20,
        color: TEXT_COLOR,
    },
    lightSmaller: {
        fontSize: 18,
        color: TEXT_COLOR,
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
        color: TEXT_COLOR
    }
})

export default connect(null, { setAuthTokenAction, setUserAction })(LoginScene);