import React, { PureComponent } from 'react';
import ZoomImage from 'react-native-image-zoom'

class FullScreen extends PureComponent {
    render() {
        const image = this.props.navigation.getParam('image');

        return (
            <ZoomImage
                style={{ flex: 1 }}
                source={{ uri: image, thumbnail: image }}
            />
        )
    }
}

export default FullScreen;
