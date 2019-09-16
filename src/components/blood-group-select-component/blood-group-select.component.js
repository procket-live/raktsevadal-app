import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { PRIMARY_COLOR, ON_PRIMARY, TEXT_COLOR } from '../../constants/color.constant';

class BloodGroupSelectComponent extends PureComponent {
    RenderCircle = (text) => {
        return (
            <TouchableOpacity
                onPress={() => this.props.onSelect(text)}
                style={(this.props.value == text) ? styles.selectedCircle : styles.circle}
            >
                <Text
                    style={(this.props.value == text) ? styles.selectedCircleText : styles.circleText}
                >
                    {text}
                </Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container} >
                <View style={styles.subContainer} >
                    <View style={styles.grid} >
                        {this.RenderCircle('A+')}
                    </View>
                    <View style={styles.grid} >
                        {this.RenderCircle('A-')}
                    </View>
                    <View style={styles.grid} >
                        {this.RenderCircle('B+')}
                    </View>
                </View>
                <View style={styles.subContainer} >
                    <View style={styles.grid} >
                        {this.RenderCircle('B-')}
                    </View>
                    <View style={styles.grid} >
                        {this.RenderCircle('O+')}
                    </View>
                    <View style={styles.grid} >
                        {this.RenderCircle('O-')}
                    </View>
                </View>
                <View style={styles.subContainer} >
                    <View style={styles.grid} >
                        {this.RenderCircle('AB+')}
                    </View>
                    <View style={styles.grid} >
                        {this.RenderCircle('AB-')}
                    </View>
                    <View style={styles.grid} />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: wp('95%'),
        height: 240,
    },
    subContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    grid: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    circle: {
        borderWidth: 3,
        borderColor: PRIMARY_COLOR,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },
    circleText: {
        fontSize: 20,
        color: TEXT_COLOR
    },
    selectedCircle: {
        backgroundColor: PRIMARY_COLOR,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30
    },
    selectedCircleText: {
        fontSize: 20,
        color: ON_PRIMARY
    }
})

export default BloodGroupSelectComponent;