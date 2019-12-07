import React, { useState } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import DoubleTap from 'react-native-double-tap';
import {
    Placeholder,
    PlaceholderLine,
    Fade,
} from "rn-placeholder";
import moment from 'moment';
import LottieView from 'lottie-react-native';

import { PRIMARY_COLOR, GREY_3, GREY_2, GREY_1, TEXT_COLOR, ON_PRIMARY } from '../../constants/color.constant';
import { UserIcon, HeartFillIcon, HeartIcon, ShareIcon } from '../../config/image.config';
import { AccessNestedObject } from '../../utils/common.util';
import PrivateApi from '../../api/api.private';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LikeLottie } from '../../config/lottie.config';


const NewsfeedComponent = props => {
    if (props.loading) {
        return (
            <View style={styles.container}>
                <Placeholder
                    Animation={Fade}
                >
                    <View style={styles.topContainer} >
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                            <PlaceholderLine style={{ width: 40, height: 40, borderRadius: 20 }} />
                        </View>
                        <View style={{ flex: 3, alignItems: 'flex-start', justifyContent: 'center' }} >
                            <View style={{ flex: 1, justifyContent: 'flex-end' }} >
                                <PlaceholderLine style={{ width: 150, height: 10 }} />
                            </View>
                            <View style={{ flex: 1, justifyContent: 'flex-start' }} >
                                <PlaceholderLine style={{ width: 100, height: 10 }} />
                            </View>
                        </View>
                    </View>
                    <PlaceholderLine style={styles.wallPostImage} />
                    <View style={styles.contentContainer} >
                        <PlaceholderLine style={{ width: widthPercentageToDP(90), height: 10 }} />
                        <PlaceholderLine style={{ width: widthPercentageToDP(80), height: 10 }} />
                    </View>
                </Placeholder>
            </View >
        )
    }

    const post = props.post || {};
    const loggedInUserId = props.loggedInUserId;
    const defaultLike = AccessNestedObject(post, 'liked_by', []).includes(loggedInUserId);
    const defaultCount = post.likes || 0;
    const lottieRef = React.useRef();

    const [like, setLike] = useState(defaultLike);
    const [likeCount, setLikeCount] = useState(defaultCount);
    const [lottieVisible, setLottieVisible] = useState(false);
    const fromNow = moment(AccessNestedObject(post, 'created_at')).fromNow();

    function likePost() {
        PrivateApi.likePost(AccessNestedObject(post, '_id'));
        setLike(true);
        setLikeCount(likeCount + 1);
    }

    function animate() {
        setLottieVisible(true);
        console.log('lottieRef', lottieRef)
        lottieRef && lottieRef.play && lottieRef.play();
    }

    function unlikePost() {
        PrivateApi.unlikePost(AccessNestedObject(post, '_id'));
        setLike(false);
        setLikeCount(likeCount - 1);
    }

    return (
        <View style={styles.container}>
            <View style={styles.topContainer} >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Image source={UserIcon()} style={styles.profileImage} />
                </View>
                <View style={{ flex: 3, alignItems: 'flex-start', justifyContent: 'center' }} >
                    <View style={{ flex: 1, justifyContent: 'flex-end' }} >
                        <Text style={{ fontSize: 16, color: GREY_3 }} >
                            {AccessNestedObject(post, 'created_by.name', '')}
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-start' }} >
                        <Text style={{ fontSize: 14, color: GREY_2 }} >
                            {AccessNestedObject(post, 'location_address', '')}
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1.5, alignItems: 'flex-end', justifyContent: 'center', paddingEnd: 10 }} >
                    <Text style={{ fontSize: 10, color: GREY_3 }} >{fromNow}</Text>
                </View>
            </View>
            <DoubleTap
                activeOpacity={0}
                doubleTap={() => {
                    animate();
                    if (!like) {
                        likePost();
                    }
                }}
                delay={100}
            >
                <ImageBackground
                    source={{ uri: AccessNestedObject(post, 'image') }}
                    style={styles.wallPostImage}
                >
                    {
                        lottieVisible ?
                            <LottieView
                                autoPlay
                                loop={false}
                                ref={lottieRef}
                                source={LikeLottie()}
                                onAnimationFinish={() => {
                                    setLottieVisible(false);
                                }}
                            /> : null
                    }
                </ImageBackground>
            </DoubleTap>
            <View style={styles.actionsContainer} >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <TouchableOpacity
                        onPress={() => {
                            like ? unlikePost() : likePost();
                        }}
                    >
                        <Image
                            source={like ? HeartFillIcon() : HeartIcon()}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
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
                    {AccessNestedObject(post, 'caption')}
                </Text>
            </View>
        </View >
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
