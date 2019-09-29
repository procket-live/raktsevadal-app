import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { GREY_1, PRIMARY_COLOR, ON_PRIMARY } from '../../constants/color.constant';

function WideButton({ text, onPress = () => { }, disabled, loading, mode, buttonStyle = {} }) {
    const styles = mode == 'outline' ? stylesOutline : stylesSolid;

    return (
        <TouchableOpacity
            disabled={disabled}
            style={[styles.container, disabled ? styles.disabled : styles.active, buttonStyle]}
            onPress={onPress}
        >
            {
                loading ?
                    <ActivityIndicator
                        animating
                        size="small"
                        color={ON_PRIMARY}
                    /> :
                    <Text style={styles.text} >
                        {text}
                    </Text>
            }
        </TouchableOpacity>
    );
}

const stylesSolid = StyleSheet.create({
    container: {
        width: wp('95%'),
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: {
        backgroundColor: GREY_1
    },
    active: {
        backgroundColor: PRIMARY_COLOR
    },
    text: {
        color: ON_PRIMARY,
        fontSize: 16,
    }
})

const stylesOutline = StyleSheet.create({
    container: {
        width: wp('95%'),
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: {
        backgroundColor: ON_PRIMARY,
        borderWidth: 2,
        borderColor: GREY_1
    },
    active: {
        backgroundColor: ON_PRIMARY,
        borderWidth: 2,
        borderColor: PRIMARY_COLOR
    },
    text: {
        color: PRIMARY_COLOR,
        fontSize: 16,
    }
})

export default WideButton;