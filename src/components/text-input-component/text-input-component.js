import React, { PureComponent } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { PRIMARY_COLOR, FONT_FAMILY, GREY_1, TEXT_COLOR } from '../../constants/color.constant';

class TextInputComponent extends PureComponent {
    render() {
        return (
            <TextInput
                style={[styles.common]}
                placeholderTextColor={GREY_1}
                {...this.props}
            />
        )
    }
}

const styles = StyleSheet.create({
    common: {
        width: wp('95%'),
        height: 45,
        borderBottomWidth: 1,
        borderBottomColor: PRIMARY_COLOR,
        fontSize: 23,
        fontFamily: FONT_FAMILY,
        color: TEXT_COLOR
    },
})

export default TextInputComponent;