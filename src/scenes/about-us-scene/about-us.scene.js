import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { LogoIcon } from '../../config/image.config';
import { GREY_2 } from '../../constants/color.constant';

const AboutUsScene = ({ }) => {
    return (
        <View style={styles.container} >
            <View style={styles.imageContainer} >
                <Image source={LogoIcon()} style={styles.image} />
            </View>

            <View style={styles.textContainer} >
                <Text style={styles.text} >
                    
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
        height: heightPercentageToDP(30),
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
        marginTop: 10
    },
    text: {
        fontSize: 16,
        color: GREY_2,
        textAlignVertical: "center"
    }
});

export default AboutUsScene;
