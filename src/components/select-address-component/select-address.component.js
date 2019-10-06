import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DateTimePicker from "react-native-modal-datetime-picker";

import { GREY_1, PRIMARY_COLOR, ON_PRIMARY, TEXT_COLOR } from '../../constants/color.constant';
import { navigate } from '../../services/navigation.service';


class SelectAddressComponent extends PureComponent {
    showMap = () => {
        navigate('ChooseLocationScene', {
            callback: this.gotAddress,
            latitude: this.props.latitude,
            longitude: this.props.longitude
        })
    }

    gotAddress = (location) => {
        this.props.onChange(location);
    }

    render() {
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={this.showMap}
            >
                {
                    this.props.value ?
                        <Text style={styles.text} >
                            {this.props.value}
                        </Text> :
                        <Text style={styles.placeholder} >
                            Please enter address
                        </Text>
                }
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: wp('95%'),
        minHeight: 45,
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderBottomColor: PRIMARY_COLOR,
        borderBottomWidth: 1,
    },
    text: {
        color: TEXT_COLOR,
        fontSize: 23,
    },
    placeholder: {
        color: GREY_1,
        fontSize: 23
    }
})

export default SelectAddressComponent;


