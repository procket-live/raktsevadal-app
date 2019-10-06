import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { ON_PRIMARY, PRIMARY_COLOR, GREY_1, TEXT_COLOR, GREEN, GREY_3 } from '../../constants/color.constant';
import Button from '../button-component/button.component';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade,
} from "rn-placeholder";
import { AccessNestedObject, DistanceBetweenLatLng, ShareOnWhatsapp, AmIDoner } from '../../utils/common.util';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MapMarkerIcon, WhatsAppIcon } from '../../config/image.config';
import { navigate } from '../../services/navigation.service';

const WIDTH_20 = widthPercentageToDP('17');

const BloodDonationCard = ({ bloodDonationRequest, loading, latitude, longitude, userId }) => {
    console.log('bloodDonationRequest', bloodDonationRequest);
    if (loading) {
        return (
            <View style={styles.container} >
                <Placeholder
                    Animation={Fade}
                    Left={PlaceholderMedia}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine />
                    <PlaceholderLine width={30} />
                    <PlaceholderLine />
                </Placeholder>
            </View>
        )
    }

    const doners = AccessNestedObject(bloodDonationRequest, 'doners', []);
    return (
        <TouchableOpacity
            onPress={() => {
                navigate('BloodRequest', { bloodRequest: bloodDonationRequest })
            }}
            style={styles.container}
        >
            <View style={{ flex: 1, flexDirection: 'row' }} >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <View style={styles.bloodGroupContainer} >
                        <Text style={styles.bloodGroupText} >
                            {AccessNestedObject(bloodDonationRequest, 'blood_group')}
                        </Text>
                    </View>

                    <Text style={styles.kmsText} >{AccessNestedObject(bloodDonationRequest, 'blood_unit')} Units</Text>
                </View>
                <View style={{ flex: 3, paddingLeft: 10 }} >
                    <Text style={styles.patientNameText} >
                        {`${AccessNestedObject(bloodDonationRequest, 'patient_name')} - ${AccessNestedObject(bloodDonationRequest, 'patient_age')} Age`}
                    </Text>
                    <Text style={styles.hospitalNameText} >
                        {AccessNestedObject(bloodDonationRequest, 'hospital_name')} - {DistanceBetweenLatLng(latitude, longitude, AccessNestedObject(bloodDonationRequest, 'hospital_location.coordinates.0'), AccessNestedObject(bloodDonationRequest, 'hospital_location.coordinates.1'))} kms away
                </Text>
                    <Text style={styles.locationText} >
                        {AccessNestedObject(bloodDonationRequest, 'hospital_address')}
                    </Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', padding: 2, paddingRight: 5, alignItems: 'center', justifyContent: 'flex-end' }} >
                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                    {
                        (AmIDoner(userId, doners)) ?
                            <View style={{ height: 20, padding: 5, backgroundColor: GREEN, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }} >
                                <Text style={{ fontSize: 16, color: ON_PRIMARY }} >Accepted</Text>
                            </View> : null
                    }
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} >
                    <TouchableOpacity
                        onPress={() => ShareOnWhatsapp(bloodDonationRequest)}
                    >
                        <Image source={WhatsAppIcon()} style={{ width: 25, height: 25, resizeMode: 'contain' }} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: widthPercentageToDP('95'),
        padding: 10,
        margin: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: GREY_1
    },
    bloodGroupContainer: {
        width: WIDTH_20,
        height: WIDTH_20,
        borderRadius: WIDTH_20 / 2,
        backgroundColor: PRIMARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bloodGroupText: {
        fontSize: 26,
        color: ON_PRIMARY
    },
    kmsText: {
        fontSize: 14,
        color: TEXT_COLOR
    },
    patientNameText: {
        fontSize: 16,
        color: TEXT_COLOR
    },
    locationText: {
        fontSize: 14,
        color: GREY_3,
        paddingTop: 5
    },
    hospitalNameText: {
        fontSize: 14,
        color: PRIMARY_COLOR
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        minHeight: WIDTH_20 / 2,
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 5
    }
});

export default BloodDonationCard;
