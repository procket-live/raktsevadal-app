import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import getDirections from 'react-native-google-maps-directions';
import moment from 'moment';
import RNBottomActionSheet from 'react-native-bottom-action-sheet';
import { connect } from 'react-redux';

import { ON_PRIMARY, TEXT_COLOR, GREY_3, GREY_2, PRIMARY_COLOR } from '../../constants/color.constant';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { AccessNestedObject } from '../../utils/common.util';
import { DISPLAY_DATE_FORMAT } from '../../constants/app.constant';
import { MapIcon } from '../../config/image.config';
import Button from '../../components/button-component/button.component';
import PrivateApi from '../../api/api.private';
import NotifyService from '../../services/notify.service';

const AlertView = RNBottomActionSheet.AlertView;

const CampDescriptionScene = props => {
    const camp = props.navigation.getParam('camp');
    const userId = AccessNestedObject(props, 'user._id');
    const joinedUsers = AccessNestedObject(camp, 'users_going', []).map((user) => user._id);
    const hasJoined = joinedUsers.includes(userId);
    const [campJoined, setCampJoined] = useState(hasJoined)

    const id = AccessNestedObject(camp, '_id');
    const campName = AccessNestedObject(camp, 'name');
    const city = AccessNestedObject(camp, 'city');
    const distance = AccessNestedObject(camp, 'distance');
    const address = AccessNestedObject(camp, 'address');
    const startDate = moment(AccessNestedObject(camp, 'start_date')).format(DISPLAY_DATE_FORMAT);
    const startTime = AccessNestedObject(camp, 'start_time');
    const endTime = AccessNestedObject(camp, 'end_time');
    const latitude = AccessNestedObject(camp, 'location.coordinates.0');
    const longitude = AccessNestedObject(camp, 'location.coordinates.1');

    return (
        <View style={styles.container} >
            <Image source={{ uri: camp.image_url }} style={styles.image} />
            <View style={{ padding: 10, alignItems: 'flex-start' }} >
                <Text style={styles.h1} >{campName}</Text>
                <View style={{ flexDirection: 'row' }} >
                    <View style={{ flex: 3, alignItems: 'flex-start', justifyContent: 'center' }} >
                        <Text style={styles.h2} >{city} - {distance}Kms away</Text>
                        <Text style={styles.h2Light}>{address}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            getDirections({
                                destination: {
                                    latitude,
                                    longitude
                                }
                            })
                        }} >
                            <Image source={MapIcon()} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{ padding: 10, alignItems: 'flex-start', paddingTop: 0 }} >
                <Text style={styles.h2} >Camp Date: {startDate}</Text>
                <Text style={styles.h2} >Timing: {startTime} to {endTime}</Text>
            </View>
            <View style={{ padding: 10, alignItems: 'flex-start', paddingTop: 0 }} >
                <Text style={styles.h3} >{camp.description}</Text>
            </View>

            <View style={{ padding: 20, alignItems: 'center' }} >
                <Text style={styles.h2} >Are you going to campaign?</Text>
                <View style={{ margin: 10 }} />
                <Button
                    disabled={campJoined}
                    onPress={() => ShowJoinCampAlert(id, setCampJoined)}
                    text={campJoined ? "JOINED" : "JOIN CAMP"}
                />
            </View>
        </View>
    )
}

function ShowJoinCampAlert(id, setCampJoined) {
    AlertView.Show({
        title: "Join Blood Donation Campaign?",
        message: "Once your accept, your contact details like name and mobile number will be shared with blood donation organizer. Are you sure you want to proceed.",
        positiveText: "YES",
        positiveBackgroundColor: "#27ae60",
        positiveTextColor: "#ffffff",
        negativeText: "No, go back!",
        negativeBackgroundColor: "#e74c3c",
        negativeTextColor: "#f1c40f",
        theme: "dark",
        onPositive: async () => {
            setCampJoined(true)
            const result = await PrivateApi.joinCamp(id);
            console.log('result', result)
            NotifyService.notify({
                title: "Camp Joined",
                message: "Thanks for joining blood donation camp. Your details are shared with camp organizers",
                type: 'info'
            })
        },
        onNegative: () => {
        }
    });

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ON_PRIMARY
    },
    image: {
        width: widthPercentageToDP(100),
        height: 200,
        resizeMode: 'contain'
    },
    h1: {
        fontSize: 20,
        color: PRIMARY_COLOR
    },
    h2: {
        fontSize: 16,
        color: TEXT_COLOR
    },
    h2Light: {
        fontSize: 16,
        color: GREY_3
    },
    h3: {
        fontSize: 14,
        color: GREY_2
    }
})

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps)(CampDescriptionScene);
