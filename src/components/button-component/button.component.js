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
        width: 120,
        height: 40,
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

export default Button;