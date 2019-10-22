import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { GREY_1, PRIMARY_COLOR, GREY_2, GREY_3 } from '../../constants/color.constant';
import { AccessNestedObject } from '../../utils/common.util';
import { DISPLAY_DATE_FORMAT } from '../../constants/app.constant';
import moment from 'moment';
import getDirections from 'react-native-google-maps-directions';
import WideButton from '../wide-button-component/wide-button.component';

class BloodDonationCampComponent extends PureComponent {
    constructor(props) {
        super(props);
    }

    openMap = (latitude, longitude) => {
        getDirections({
            destination: {
                latitude,
                longitude
            }
        })
    }

    render() {
        const { camp } = this.props;
        const campName = AccessNestedObject(camp, 'name');
        const description = AccessNestedObject(camp, 'description');
        const city = AccessNestedObject(camp, 'city');
        const distance = AccessNestedObject(camp, 'distance');
        const address = AccessNestedObject(camp, 'address');
        const startDate = moment(AccessNestedObject(camp, 'start_date')).format(DISPLAY_DATE_FORMAT);
        const endDate = moment(AccessNestedObject(camp, 'end_date')).format(DISPLAY_DATE_FORMAT);
        const startTime = AccessNestedObject(camp, 'start_time')
        const endTime = AccessNestedObject(camp, 'end_time')
        const latitude = AccessNestedObject(camp, 'location.coordinates.0');
        const longitude = AccessNestedObject(camp, 'location.coordinates.1');

        return (
            <View style={styles.container} >
                <Image style={styles.image} source={{ uri: camp.image_url }} />
                <View style={{ alignItems: 'flex-start', padding: 10 }} >
                    <Text style={{ fontSize: 17, color: PRIMARY_COLOR, marginTop: 5, textAlign: 'left' }}>{campName}</Text>
                    <Text style={{ fontSize: 14, color: GREY_2, marginTop: 5, textAlign: 'left' }}>{description}</Text>
                    <Text style={{ fontSize: 15, color: GREY_3, marginTop: 5, textAlign: 'left' }}>{city} - {distance}Kms away</Text>
                    <Text style={{ fontSize: 15, color: GREY_3, textAlign: 'left' }}>{address}</Text>

                    <Text style={{ fontSize: 14, color: GREY_2, marginTop: 10, textAlign: 'left' }}>Camp Date: from {(startDate)} to {endDate}</Text>
                    <Text style={{ fontSize: 14, color: GREY_2, textAlign: 'left' }}>Camp Time: from {startTime} to {endTime}</Text>
                </View>
                <WideButton
                    text={'Open Map'}
                    onPress={() => this.openMap(latitude, longitude)}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: widthPercentageToDP(95),
        borderWidth: 1,
        borderColor: GREY_1,
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 5
    },
    image: {
        height: 100,
        width: widthPercentageToDP(94)
    }
})

export default BloodDonationCampComponent;
