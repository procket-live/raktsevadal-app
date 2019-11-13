import React, { PureComponent } from 'react';
import { Image, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { BellIcon } from '../../config/image.config';
import { PRIMARY_COLOR, GREY_2, ON_PRIMARY } from '../../constants/color.constant';

class NotificationIconComponent extends PureComponent {
    render() {
        const { notifications, seenSoFar, focused } = this.props;
        const count = notifications.length;
        const actualCount = (count - seenSoFar) >= 0 ? count - seenSoFar : 0;

        return (
            <>
                <View style={focused ? { borderBottomWidth: 2, paddingBottom: 2, borderBottomColor: PRIMARY_COLOR, marginBottom: -4 } : null} >
                    <Image
                        style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: actualCount ? 20 : 0 }}
                        source={BellIcon()}
                    />
                </View>
                {
                    actualCount ?
                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: PRIMARY_COLOR, position: 'relative', top: -30, right: -15, alignItems: 'center', justifyContent: 'center' }} >
                            <Text style={{ color: ON_PRIMARY, fontSize: 14 }} >{actualCount}</Text>
                        </View> : null
                }
            </>
        );
    }
}

const mapStateToProps = state => ({
    notifications: state.notification.notifications,
    seenSoFar: state.notification.seenSoFar,
})

export default connect(mapStateToProps)(NotificationIconComponent);