import React, { PureComponent } from 'react';
import { Image } from 'react-native';
// import ZoomImage from 'react-native-image-zoom'

class FullScreen extends PureComponent {
    render() {
        const image = this.props.navigation.getParam('image');

        return (
            <Image
                style={{ flex: 1 }}
                source={{ uri: image, thumbnail: image }}
            />
        )
    }
}

export default FullScreen;
