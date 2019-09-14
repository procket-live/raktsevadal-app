import React from 'react';
import { View, StyleSheet } from 'react-native';

const StepsIndicator = ({ steps, currentStep }) => (
    < View style={styles.container} >
        {
            Array(steps).fill(0).map((item, index) => (
                <View key={index} style={[styles.step, (currentStep == (index + 1)) ? styles.activeStep : styles.inactiveStep]} ></View>
            ))
        }
    </View >
)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    step: {
        height: 10,
        paddingRight: 4,
        marginRight: 4,
        borderRadius: 5
    },
    activeStep: {
        backgroundColor: '#e74c3c',
        width: 40,
    },
    inactiveStep: {
        backgroundColor: '#bdc3c7',
        width: 20,
    }
})

export default StepsIndicator;
