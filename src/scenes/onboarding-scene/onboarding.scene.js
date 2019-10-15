import React, { PureComponent } from 'react';
import { View } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import { navigate, resetToScreen } from '../../services/navigation.service';
import { connect } from 'react-redux';
import { setIsFirstTime } from '../../action/isFirstTime.action';
import { BloodBottleLottie, BloodDropLottie, AmazingTickLottie } from '../../config/lottie.config';

class OnBoardingScene extends PureComponent {
    steps = () => {
        return [
            {
                backgroundColor: '#fff',
                image: this.renderLottie(BloodBottleLottie()),
                title: 'Donate Blood',
            },
            {
                backgroundColor: '#fff',
                image: this.renderLottie(AmazingTickLottie()),
                title: 'Explore updates around you',
            },
            {
                backgroundColor: '#fff',
                image: this.renderLottie(BloodDropLottie()),
                title: 'Search blood doner',
            }
        ]
    }

    renderLottie = (asset) => {
        return (
            <View style={{ width: 150, height: 150 }} >
                <LottieView
                    autoPlay
                    source={asset}
                />
            </View>
        )
    }

    onEnd = () => {
        this.props.setIsFirstTime(false);
        resetToScreen('Login');
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

export default connect(null, { setIsFirstTime })(OnBoardingScene);
