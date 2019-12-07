import React, { useState } from 'react';
import moment from 'moment';
import { View, StyleSheet, Text, Image } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { ON_PRIMARY, PRIMARY_COLOR, GREY_1, TEXT_COLOR, GREY_3 } from '../../constants/color.constant';
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

    const [sent, setSent] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);

    const id = AccessNestedObject(user, '_id');
    const name = AccessNestedObject(user, 'name');
    const mobile = AccessNestedObject(user, 'mobile');
    const bloodGroup = AccessNestedObject(user, 'blood_group');
    const lastBloodDonation = AccessNestedObject(user, 'last_blood_donation');

    if (sentDoners && sentDoners.includes(id)) {
        setSent(true);
    }

    return (
        <View
            style={styles.container}
        >
            <View style={{ flex: 1, flexDirection: 'row' }} >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <View style={styles.bloodGroupContainer} >
                        <Text style={styles.bloodGroupText} >
                            {DisplayBloodGroup(bloodGroup)}
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 3, paddingLeft: 10 }} >
                    <Text style={styles.patientNameText} >
                        Name: {name}
                    </Text>
                    {
                        lastBloodDonation ?
                            <Text style={styles.patientNameText} >
                                Last blood donation: {lastBloodDonation}
                            </Text> : null
                    }
                    {
                        !showRequestButton ?
                            <Text style={styles.hospitalNameText} >
                                Accepted On: {moment(acceptedAt).format(DISPLAY_DATE_TIME_FORMAT)}
                            </Text> : null
                    }
                </View>
            </View>

            <View style={{ flexDirection: 'row', padding: 2, paddingRight: 5, alignItems: 'center', justifyContent: 'flex-end' }} >
                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} >
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
                                text={sent ? "Sent" : "REQUEST DONATION"}
                                onPress={async () => {
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
                                }}
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
        padding: 10,
        margin: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: GREY_1,
        backgroundColor: ON_PRIMARY
    },
    bloodGroupContainer: {
        width: WIDTH,
        height: WIDTH,
        borderRadius: WIDTH / 2,
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
