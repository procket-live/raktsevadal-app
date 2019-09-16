import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DateTimePicker from "react-native-modal-datetime-picker";

import { GREY_1, PRIMARY_COLOR, ON_PRIMARY, TEXT_COLOR } from '../../constants/color.constant';


class DateTimePickerComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isDateTimePickerVisible: false
        }
    }

    showDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: true });
    }

    hideDateTimePicker = () => {
        this.setState({ isDateTimePickerVisible: false });
    }

    handleDatePicked = date => {
        this.hideDateTimePicker();

        if (this.props && typeof this.props.onChange == 'function') {
            this.props.onChange(date);
        }
    }

    render() {
        return (
            <TouchableOpacity
                style={styles.container}
                onPress={this.showDateTimePicker}
            >
                {
                    this.props.value ?
                        <Text style={styles.text} >
                            {moment(this.props.value).format(this.props.format)}
                        </Text> :
                        <Text style={styles.placeholder} >
                            {this.props.placeholder}
                        </Text>
                }
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                    maximumDate={this.props.maximumDate}
                    minimumDate={this.props.minimumDate}
                />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: wp('95%'),
        height: 45,
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

export default DateTimePickerComponent;


