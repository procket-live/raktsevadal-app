import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { LogoIcon } from '../../config/image.config';
import { GREY_2, GREY_3, PRIMARY_COLOR } from '../../constants/color.constant';

const AboutUsScene = ({ }) => {
    return (
        <View style={styles.container} >
            <View style={styles.imageContainer} >
                <Image source={LogoIcon()} style={styles.image} />
            </View>

            <View style={styles.textContainer} >
                <Text style={styles.textBold} >Rakt Sevadal is a platform to connect blood donors and recipients.</Text>
                <Text style={styles.text} >
                    Each year millions of people lose their life because they do not find donors when needed most.
                    It is unfortunate that there are donors and people willing to help everywhere but they are not sure when/where an actual need arise.
                    Rakt Sevadal is the solution as a platform where patients can instantly call out for help and donors can respond instantly.
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imageContainer: {
        height: heightPercentageToDP(15),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    image: {
        width: widthPercentageToDP(20),
        height: widthPercentageToDP(20),
        resizeMode: 'contain'
    },
    textContainer: {
        marginTop: 10,
        padding: 5
    },
    textBold: {
        fontSize: 22,
        color: PRIMARY_COLOR,
        textAlign: 'center',
        marginBottom: 20
    },
    text: {
        fontSize: 16,
        color: GREY_2,
        textAlign: 'center'
    }
});

export default AboutUsScene;
