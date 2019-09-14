import React, { PureComponent } from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard } from 'react-native';
import StepsIndicator from '../../components/steps-indicator-component/steps-indicator.component';
import { translate } from '../../services/translation.service';
import Button from '../../components/button-component/button.component';

class LoginScene extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            mobile: '+91 ',
            otp: '',
            otpSent: false,
            loading: false
        }
    }

    proceed = () => {
        this.setState({ loading: true });
    }

    render() {
        return (
            <View style={styles.container} >
                <StepsIndicator
                    steps={2}
                    currentStep={this.state.step}
                />
                <View style={{ marginTop: 10, marginBottom: 5 }} >
                    <Text style={styles.lightSmall} >{translate('hey-whats-your')}</Text>
                </View>
                <View style={{ marginTop: 5, marginBottom: 5 }} >
                    <Text style={styles.bigBold} >{translate('mobile-number')}</Text>
                </View>
                <View style={{ marginTop: 35, marginBottom: 5 }} >
                    <TextInput
                        value={this.state.mobile}
                        style={styles.input}
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
                        text={'Proceed'}
                        onPress={this.proceed}
                    />
                </View>
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
        color: '#34495e',
        fontWeight: '300'
    },
    bigBold: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#34495e'
    },
    input: {
        width: 385,
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#e74c3c',
        fontSize: 28
    }
})

export default LoginScene;