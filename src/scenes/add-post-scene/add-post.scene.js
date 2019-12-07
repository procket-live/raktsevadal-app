import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import Geocoder from 'react-native-geocoder';

import { widthPercentageToDP } from 'react-native-responsive-screen';
import { PRIMARY_COLOR } from '../../constants/color.constant';
import TextInputComponent from '../../components/text-input-component/text-input-component';
import { GetImage } from '../../utils/image.util';
import WideButton from '../../components/wide-button-component/wide-button.component';
import PrivateApi from '../../api/api.private';
import { AccessNestedObject, GenerateRandomString } from '../../utils/common.util';
import { navigatePop } from '../../services/navigation.service';


function AddPost(props) {
    let address = '';
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [imageLink, setImageLink] = useState('');
    const [loading, setLoading] = useState(false);

    function isDisabled() {
        return !(caption && isImageAdded());
    }

    function isImageAdded() {
        return image && typeof image == 'object';
    }

    function post() {
        setLoading(true);
        uploadImage();
    }

    async function uploadImage() {
        const result = await firebase.storage().ref(`/post_images/${GenerateRandomString(6)}`).putFile(image.path)
        setImageLink(result.downloadURL);
        getAddress();
    }

    async function getAddress() {
        const [latitude, longitude] = props.coordinates;
        const result = await Geocoder.geocodePosition({ lat: latitude, lng: longitude });
        const locality = AccessNestedObject(result, '0', {});
        address = `${locality.subLocality}, ${locality.locality}`;
        makeApiCall();
    }

    async function makeApiCall() {
        const [latitude, longitude] = props.coordinates;
        const params = {
            latitude,
            longitude,
            image: imageLink,
            caption: caption,
            location_address: address
        };

        const result = await PrivateApi.createPost(params);
        console.log('result',result)
        setLoading(false);
        if (result.success) {
            navigatePop();
        }
    }

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ alignItems: 'center' }}
            >
                <View style={{ paddingTop: 20, paddingBottom: 20 }} >
                    {
                        !isImageAdded() ?
                            <TouchableOpacity
                                style={styles.addImageContainer}
                                onPress={() => GetImage(setImage)}
                            >
                                <Text style={styles.addImageText} >ADD IMAGE</Text>
                            </TouchableOpacity>
                            :
                            <Image style={styles.image} source={{ uri: image.path }} />
                    }
                </View>
                <View style={{ paddingTop: 20, paddingBottom: 20 }} >
                    <TextInputComponent
                        label
                        multiline
                        value={caption}
                        placeholder="Add caption"
                        onChangeText={setCaption}
                    />
                </View>
            </ScrollView>
            <View style={{ position: 'absolute', bottom: 10, left: 10, right: 10 }}>
                <WideButton
                    loading={loading}
                    disabled={isDisabled()}
                    text="POST"
                    onPress={post}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    addImageContainer: {
        width: widthPercentageToDP(90),
        height: 100,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: PRIMARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: widthPercentageToDP(90),
        height: 200,
        resizeMode: 'contain'
    },
    addImageText: {
        fontSize: 18,
        color: PRIMARY_COLOR,
    }
});

const mapStateToProps = state => ({
    coordinates: AccessNestedObject(state, 'user.latest_location.coordinates', [])
})

export default connect(mapStateToProps)(AddPost);
