import React, { PureComponent } from 'react';
import { View, Image, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import WideButton from '../wide-button-component/wide-button.component';

class UploadDocumentComponent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            files: []
        }
    }

    renderImage = ({ item }) => {
        return (
            <Image
                style={styles.image}
                source={{ uri: item.path }}
            />
        )
    }

    open = () => {
        Alert.alert(
            'Select one',
            '',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'Camera',
                    onPress: this.openCamera,
                    style: 'default'
                },
                {
                    text: 'Gallary',
                    onPress: this.openPicker,
                    style: 'default'
                }
            ],
            { cancelable: false },
        );
    }

    openCamera = async () => {
        const result = await ImagePicker.openCamera({
            width: 300,
            height: 400,
            compressImageQuality: 0.2,
            multiple: true
        });

        this.gotFiles(result);
    }

    openPicker = async () => {
        const result = await ImagePicker.openPicker({
            width: 300,
            height: 400,
            compressImageQuality: 0.2,
            multiple: true,
        });

        this.gotFiles(result);
    }

    gotFiles = (result) => {
        const files = Array.isArray(result) ? result : [result];

        this.setState({ files: [...this.state.files, ...files] }, () => {
            this.props.callback(this.state.files);
        })
    }

    render() {
        return (
            <>
                <FlatList
                    style={{ marginBottom: 15 }}
                    data={this.state.files}
                    renderItem={this.renderImage}
                    horizontal
                />
                <WideButton
                    mode="outline"
                    disabled={this.props.disabled}
                    text="Add Medical Document"
                    onPress={this.open}
                />
            </>
        )
    }
}

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    }
});

export default UploadDocumentComponent;
