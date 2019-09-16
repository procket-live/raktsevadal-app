import React, { PureComponent } from 'react';
import { View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import { navigate } from '../../services/navigation.service.js';

class OnBoardingScene extends PureComponent {
    steps = () => {
        return [
            {
                backgroundColor: '#fff',
                image: this.renderLottie(),
                title: 'Onboarding',
                subtitle: 'Done with React Native Onboarding Swiper',
            },
            {
                backgroundColor: '#fff',
                image: this.renderLottie(),
                title: 'Onboarding',
                subtitle: 'Done with React Native Onboarding Swiper',
            },
            {
                backgroundColor: '#fff',
                image: this.renderLottie(),
                title: 'Onboarding',
                subtitle: 'Done with React Native Onboarding Swiper',
            }
        ]
    }

    renderLottie = () => {
        return (
            <View style={{ width: 150, height: 150 }} >
                <LottieView
                    autoPlay
                    source={require('../../assets/lottie/blood-bottle.json')}
                />
            </View>
        )
    }

    onEnd = () => {
        navigate('Login')
    }

    render() {
        return (
            <Onboarding
                pages={this.steps()}
                onSkip={this.onEnd}
                onDone={this.onEnd}
            />
        )
    }
}

export default OnBoardingScene;
