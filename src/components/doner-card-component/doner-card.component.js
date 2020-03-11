import React, { useState } from 'react';
import moment from 'moment';
import { View, StyleSheet, Text, Image } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { ON_PRIMARY, PRIMARY_COLOR, GREY_1, TEXT_COLOR, GREY_3, PRIMARY_LIGHT_COLOR } from '../../constants/color.constant';
import Button from '../button-component/button.component';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade,
} from "rn-placeholder";
import { AccessNestedObject, Call, DisplayBloodGroup } from '../../utils/common.util';
import { DISPLAY_DATE_TIME_FORMAT } from '../../constants/app.constant';
import PrivateApi from '../../api/api.private';
import NotifyService from '../../services/notify.service';
import { MapMarkerIcon, UserIcon } from '../../config/image.config';

const WIDTH = widthPercentageToDP('10');

const DonerCardComponent = ({ user, loading, showCallButton, showRequestButton, requestBloodDonation, acceptedAt, sentDoners }) => {
    if (loading) {
        return (
            <View style={styles.container} >
                <Placeholder
                    Animation={Fade}
                    Left={PlaceholderMedia}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine />
                    <PlaceholderLine />
                </Placeholder>
            </View>
        )
    }

    const [sent, setSent] = useState(sentDoners && sentDoners.includes(id));
    const [localLoading, setLocalLoading] = useState(false);

    const id = AccessNestedObject(user, '_id');
    const name = AccessNestedObject(user, 'name');
    const profileImage = AccessNestedObject(user, 'profile_image');
    const profileSource = profileImage ? { uri: profileImage } : UserIcon()
    const locationAddress = AccessNestedObject(user, 'location_address', 'Bengaluru');
    const mobile = AccessNestedObject(user, 'mobile');
    const bloodGroup = AccessNestedObject(user, 'blood_group');
    const lastBloodDonation = AccessNestedObject(user, 'last_blood_donation');

    async function request() {
        if (!sent) {
            setLocalLoading(true);
            await requestBloodDonation(id)
            setLocalLoading(false);
            setSent(true)
            NotifyService.notify({
                title: 'Blood donation request sent to doner.',
                message: `Request sent to ${name}. You will be notified once he/she accepts blood donation request.`,
                duration: 3000,
                type: 'success'
            })
        }
    }

    return (
        <View
            style={styles.container}
        >
            <View style={{ flex: 1, flexDirection: 'row' }} >
                <View style={{ flex: 0.8, alignItems: 'flex-start', justifyContent: 'center' }} >
                    <View style={{ width: 50, height: 50, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }} >
                        <Image source={profileSource} style={{ width: 50, height: 50, borderRadius: 50, resizeMode: 'cover', overflow: 'hidden' }} />
                    </View>
                </View>
                <View style={{ flex: 2, paddingLeft: 10, alignItems: 'flex-start' }} >
                    <Text style={styles.patientNameText} >
                        {name}
                    </Text>
                    <View style={{ alignItems: 'flex-start', flexDirection: 'row', paddingTop: 5, paddingBottom: 5, justifyContent: 'center', alignItems: 'center' }} >
                        <Image source={MapMarkerIcon()} style={{ width: 20, height: 20, marginRight: 5 }} />
                        <Text style={{ fontSize: 14, color: GREY_1 }} >
                            {locationAddress}
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} >
                    <View style={styles.bloodGroupContainer} >
                        <Text style={styles.bloodGroupText} >{DisplayBloodGroup(bloodGroup)}</Text>
                    </View>
                </View>
            </View>

            <View style={{ flexDirection: 'row', padding: 2, paddingRight: 5, alignItems: 'center', justifyContent: 'flex-end' }} >
                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                    {
                        lastBloodDonation ?
                            <Text style={{ fontSize: 14, color: PRIMARY_COLOR }} >
                                last donation on {lastBloodDonation}
                            </Text> : null
                    }
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingTop: 5, paddingBottom: 5 }} >
                    {
                        showCallButton ?
                            <Button
                                text="Call"
                                onPress={() => Call(mobile)}
                            />
                            : null
                    }
                    {
                        showRequestButton ?
                            <Button
                                loading={localLoading}
                                disabled={sent}
                                text={sent ? "Sent" : "Ask for help"}
                                onPress={request}
                            />
                            : null
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: widthPercentageToDP('95'),
        padding: 5,
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 10,
        margin: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: GREY_1,
        backgroundColor: ON_PRIMARY
    },
    bloodGroupContainer: {
        width: 40,
        height: 40,
        borderRadius: 40,
        borderColor: GREY_1,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bloodGroupText: {
        fontSize: 18,
        color: PRIMARY_COLOR
    },
    kmsText: {
        fontSize: 14,
        color: TEXT_COLOR
    },
    patientNameText: {
        fontSize: 18,
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
        minHeight: widthPercentageToDP(17) / 2,
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 5
    }
});

export default DonerCardComponent;
