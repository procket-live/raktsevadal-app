import React from 'react';
import moment from 'moment';
import { View, StyleSheet, Text, Image } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { ON_PRIMARY, PRIMARY_COLOR, GREY_1, TEXT_COLOR, GREY_3, GREY_2 } from '../../constants/color.constant';
import Button from '../button-component/button.component';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade,
} from "rn-placeholder";
import { AccessNestedObject, Call } from '../../utils/common.util';
import { DISPLAY_DATE_TIME_FORMAT } from '../../constants/app.constant';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { navigatePop, navigate } from '../../services/navigation.service';

const NotificatonCard = ({ notification, loading }) => {
    if (loading) {
        return (
            <View style={styles.container} >
                <Placeholder
                    Animation={Fade}
                    Left={PlaceholderMedia}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine />
                </Placeholder>
            </View>
        )
    }

    const bloodDonationRequest = AccessNestedObject(notification, 'blood_requirement');
    const bloodGroup = AccessNestedObject(notification, 'blood_requirement.blood_group');
    const message = AccessNestedObject(notification, 'message');
    const createdAt = AccessNestedObject(notification, 'created_at');

    return (
        <TouchableOpacity
            onPress={() => {
                navigate('BloodRequest', { bloodRequest: bloodDonationRequest, callback: () => { navigatePop() } })
            }}
            style={styles.container}
        >
            <View style={{ flex: 1, flexDirection: 'row' }} >
                <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }} >
                    <View style={styles.bloodGroupContainer} >
                        <Text style={styles.bloodGroupText} >
                            {bloodGroup}
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 5, paddingLeft: 10 }} >
                    <Text style={styles.patientNameText} >
                        {message}
                    </Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', padding: 2, paddingRight: 5, alignItems: 'center', justifyContent: 'flex-end' }} >
                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} >
                    <Text style={{ fontSize: 14, color: GREY_2 }} >{moment(createdAt).fromNow()}</Text>
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
        borderColor: GREY_1,
        backgroundColor: ON_PRIMARY
    },
    bloodGroupContainer: {
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
        backgroundColor: PRIMARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bloodGroupText: {
        fontSize: 18,
        color: ON_PRIMARY
    },
    kmsText: {
        fontSize: 14,
        color: TEXT_COLOR
    },
    patientNameText: {
        fontSize: 14,
        color: TEXT_COLOR,
        textAlign: 'justify'
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
        minHeight: widthPercentageToDP(17) / 2,
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 5
    }
});

export default NotificatonCard;
