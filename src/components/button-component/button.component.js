import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { GREY_1, PRIMARY_COLOR, ON_PRIMARY } from '../../constants/color.constant';

function Button({ text, onPress = () => { }, disabled, loading }) {
    return (
        <TouchableOpacity
            disabled={disabled}
            style={[styles.container, disabled ? styles.disabled : styles.active]}
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

const styles = StyleSheet.create({
    container: {
        minWidth: 120,
        height: 40,
        paddingStart: 15,
        paddingEnd: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    disabled: {
        backgroundColor: GREY_1
    },
    active: {
        backgroundColor: PRIMARY_COLOR
    },
    text: {
        color: ON_PRIMARY,
        fontSize: 14,
    }
})

export default Button;