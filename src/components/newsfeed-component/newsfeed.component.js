import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import DoubleTap from 'react-native-double-tap';

import { PRIMARY_COLOR, GREY_3, GREY_2, GREY_1, TEXT_COLOR, ON_PRIMARY } from '../../constants/color.constant';
import { UserIcon, HeartFillIcon, HeartIcon, ShareIcon } from '../../config/image.config';


const NewsfeedComponent = props => {
    const [like, setLike] = useState(false);
    const [likeCount, setLikeCount] = useState(123);

    return (
        <View style={styles.container}>
            <View style={styles.topContainer} >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Image source={UserIcon()} style={styles.profileImage} />
                </View>
                <View style={{ flex: 3, alignItems: 'flex-start', justifyContent: 'center' }} >
                    <View style={{ flex: 1, justifyContent: 'flex-end' }} >
                        <Text style={{ fontSize: 16, color: GREY_3 }} >Himanshu Kushwah</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-start' }} >
                        <Text style={{ fontSize: 14, color: GREY_2 }} >Bengaluru</Text>
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                    <Text style={{ fontSize: 12, color: GREY_3 }} >12 mins ago</Text>
                </View>
            </View>
            <DoubleTap
                doubleTap={() => {
                    if (!like) {
                        setLike(true);
                        setLikeCount(likeCount + 1);
                    }
                }}
                delay={200}
            >
                <Image
                    source={{ uri: 'https://ichef.bbci.co.uk/news/660/cpsprodpb/182FF/production/_107317099_blooddonor976.jpg' }}
                    style={styles.wallPostImage}
                />
            </DoubleTap>
            <View style={styles.actionsContainer} >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <Image
                        source={like ? HeartFillIcon() : HeartIcon()}
                        style={styles.icon}
                    />
                    <Text style={{ marginLeft: 5, fontSize: 12, color: GREY_3 }} >{likeCount} Likes</Text>
                </View>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                    <Image
                        source={ShareIcon()}
                        style={styles.icon}
                    />
                </View>
            </View>
            <View style={styles.contentContainer} >
                <Text style={{ marginLeft: 5, fontSize: 14, color: TEXT_COLOR }} >
                    आपका रक्तदान (Blood donation) निश्चय ही किसी की जिन्दगी बचाएगा; सचमुच, आपका यही पुण्य आपके बेवक्त काम आएगा।
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: widthPercentageToDP(95),
        elevation: 1,
        marginTop: 5,
        marginBottom: 5,
        paddingTop: 10,
        paddingBottom: 5,
        backgroundColor: ON_PRIMARY
    },
    topContainer: {
        flexDirection: 'row',
        paddingBottom: 10
    },
    profileImage: {
        width: 35,
        height: 35,
        resizeMode: 'contain'
    },
    icon: {
        height: 20,
        width: 20,
        resizeMode: 'contain'
    },
    wallPostImage: {
        width: widthPercentageToDP(95),
        height: 180,
        resizeMode: 'cover'
    },
    actionsContainer: {
        height: 35,
        padding: 4,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row'
    },
    contentContainer: {
        padding: 4,
        paddingLeft: 10,
        paddingRight: 10,
    }
})

export default NewsfeedComponent;
