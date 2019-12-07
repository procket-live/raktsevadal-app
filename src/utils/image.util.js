import ImagePicker from 'react-native-image-crop-picker';
import { Alert } from 'react-native';

function GetImage(callback = () => { }) {
    Alert.alert(
        'Upload Image from',
        '',
        [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Camera',
                onPress: () => GetCameraImage(callback),
                style: 'default'
            },
            {
                text: 'Gallary',
                onPress: () => GetPickerImage(callback),
                style: 'default'
            }
        ],
        { cancelable: false },
    );
}

async function GetCameraImage(callback = () => { }) {
    const result = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        compressImageQuality: 0.2,
        multiple: true
    });

    callback(result);
}

async function GetPickerImage(callback = () => { }) {
    const result = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        compressImageQuality: 0.2,
    });

    callback(result);
}

export {
    GetImage,
    GetCameraImage,
    GetPickerImage
}
