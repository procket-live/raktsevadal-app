import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';

function Button({ text, onPress = () => { }, disabled, loading }) {
    return (
        <TouchableOpacity
            disabled={disabled}
            style={[styles.container, disabled ? styles.disabled : styles.active]}
            onPress={onPress}
        >
            {
                loading ?
                    <ActivityIndicator animating size="large" color="#fff" /> :
                    <Text style={styles.text} >
                        {text}
                    </Text>
            }
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 140,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: {
        backgroundColor: '#bdc3c7'
    },
    active: {
        backgroundColor: '#e74c3c'
    },
    text: {
        color: '#fff',
        fontSize: 18,
    }
})

export default Button;