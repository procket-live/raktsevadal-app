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
import { AccessNestedObject, DisplayBloodGroup } from '../../utils/common.util';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { navigate } from '../../services/navigation.service';

const WIDTH_20 = widthPercentageToDP('12');

const BloodDonationCard = ({ bloodDonationRequest, loading, amIDoner }) => {
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
                            {DisplayBloodGroup(AccessNestedObject(bloodDonationRequest, 'blood_group'))}
                        </Text>
                    </View>

                    <Text style={styles.kmsText} >{AccessNestedObject(bloodDonationRequest, 'blood_unit')} Units</Text>
                    <View style={{ flexDirection: 'row', padding: 2, paddingRight: 5, alignItems: 'center', justifyContent: 'flex-end' }} >
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                            {
                                AccessNestedObject(bloodDonationRequest, 'amIDoner', false) ?
                                    <View style={{ height: 17, padding: 5, backgroundColor: GREEN, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }} >
                                        <Text style={{ fontSize: 14, color: ON_PRIMARY }} >Accepted</Text>
                                    </View> : null
                            }
                        </View>
                    </View>
                </View>
                <View style={{ flex: 3, paddingLeft: 10 }} >
                    <Text style={styles.patientNameText} >
                        {`${AccessNestedObject(bloodDonationRequest, 'patient_name')} - ${AccessNestedObject(bloodDonationRequest, 'patient_age')} Age`}
                    </Text>
                    <Text style={styles.hospitalNameText} >
                        {AccessNestedObject(bloodDonationRequest, 'hospital_name')} - {AccessNestedObject(bloodDonationRequest, 'distance')} kms away
                </Text>
                    <Text style={styles.locationText} >
                        {AccessNestedObject(bloodDonationRequest, 'hospital_address')}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: widthPercentageToDP('95'),
        padding: 5,
        margin: 5,
        backgroundColor: ON_PRIMARY
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
        fontSize: 18,
        color: ON_PRIMARY
    },
    kmsText: {
        fontSize: 12,
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
