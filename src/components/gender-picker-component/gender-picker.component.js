import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { PRIMARY_COLOR, ON_PRIMARY, TEXT_COLOR } from '../../constants/color.constant';

class GenderPickerComponent extends PureComponent {
    selectMale = () => {
        this.props.onChange('male')
    }

    selectFemale = () => {
        this.props.onChange('female')
    }

    render() {
        const isMale = this.props.value == 'male';
        const isFemale = this.props.value == 'female';
        const showBorder = !isMale && !isFemale;

        return (
            <View style={styles.container} >
                <TouchableOpacity
                    onPress={this.selectMale}
                    style={[styles.subContainer, showBorder ? styles.rightBorder : null, isMale ? styles.slected : styles.unselected]}
                >
                    <Text style={[styles.text, isMale ? styles.selectedText : styles.unselectedText]} >Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={this.selectFemale}
                    style={[styles.subContainer, isFemale ? styles.slected : styles.unselected]}
                >
                    <Text style={[styles.text, isFemale ? styles.selectedText : styles.unselectedText]} >Famale</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: wp('95%'),
        height: 45,
        flexDirection: 'row',
        borderWidth: 2,
        borderColor: PRIMARY_COLOR
    },
    subContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 16,
    },
    slected: {
        backgroundColor: PRIMARY_COLOR
    },
    selectedText: {
        color: ON_PRIMARY
    },
    unselected: {
        backgroundColor: ON_PRIMARY,
    },
    rightBorder: {
        borderRightWidth: 2,
        borderRightColor: PRIMARY_COLOR
    },
    unselectedText: {
        color: TEXT_COLOR
    }
})

export default GenderPickerComponent;