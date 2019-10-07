import React from 'react';
import WebView  from 'react-native-webview';
import { PRIVACY_POLICY } from '../../constants/app.constant';

const TermsAndConditionScene = ({ }) => {
    return (
        <WebView
            source={{ uri: PRIVACY_POLICY }}
            style={{ flex: 1 }}
        />
    )
}

export default TermsAndConditionScene;