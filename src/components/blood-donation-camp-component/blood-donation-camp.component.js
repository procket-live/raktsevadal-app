import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { GREY_1, PRIMARY_COLOR, GREY_2, GREY_3, ON_PRIMARY, TEXT_COLOR } from '../../constants/color.constant';
import { AccessNestedObject } from '../../utils/common.util';
import { DISPLAY_DATE_FORMAT } from '../../constants/app.constant';
import moment from 'moment';
import getDirections from 'react-native-google-maps-directions';
import WideButton from '../wide-button-component/wide-button.component';
import { MapIcon } from '../../config/image.config';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { navigate } from '../../services/navigation.service';

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
        const city = AccessNestedObject(camp, 'city');
        const distance = AccessNestedObject(camp, 'distance');
        const address = AccessNestedObject(camp, 'address');
        const startDate = moment(AccessNestedObject(camp, 'start_date')).format(DISPLAY_DATE_FORMAT);
        const endTime = AccessNestedObject(camp, 'end_time')
        const startTime = AccessNestedObject(camp, 'start_time')
        const latitude = AccessNestedObject(camp, 'location.coordinates.0');
        const longitude = AccessNestedObject(camp, 'location.coordinates.1');

        return (
            <TouchableOpacity
                onPress={() => navigate('CampDescription', { camp })}
                style={styles.container} >
                <ImageBackground style={styles.image} source={{ uri: camp.image_url }} >
                    <View style={{ alignItems: 'flex-start', padding: 10 }} >
                        <Text style={{ fontSize: 17, color: ON_PRIMARY, marginTop: 5, textAlign: 'left' }}>{campName}</Text>
                        <Text style={{ fontSize: 14, color: ON_PRIMARY, marginTop: 5, textAlign: 'left' }}>{startDate}, from {startTime} to {endTime}</Text>
                    </View>
                </ImageBackground>
                <View style={{ padding: 10, paddingTop: 0, flexDirection: 'row' }} >
                    <View style={{ flex: 4, alignItems: 'flex-start', justifyContent: 'center' }} >
                        <Text style={{ fontSize: 15, color: TEXT_COLOR, marginTop: 5 }}>{city} - {distance}Kms away</Text>
                        <Text style={{ fontSize: 15, color: GREY_3 }}>{address}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                        <TouchableOpacity onPress={() => this.openMap(latitude, longitude)} >
                            <Image source={MapIcon()} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: widthPercentageToDP(95),
        marginTop: 10,
        backgroundColor: ON_PRIMARY
    },
    image: {
        height: 180,
        width: widthPercentageToDP(95),
        resizeMode: 'cover',
        alignItems: 'flex-start',
        justifyContent: 'flex-end'
    }
})

export default BloodDonationCampComponent;
