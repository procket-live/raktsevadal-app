import React, { PureComponent } from 'react';
import { Image, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { NotificationIcon } from '../../config/image.config';
import { PRIMARY_COLOR, GREY_2, ON_PRIMARY } from '../../constants/color.constant';

class NotificationIconComponent extends PureComponent {
    render() {
        const { notifications } = this.props;
        const count = notifications.length;

        return (
            <>
                <Image
                    style={{ width: 25, height: 25, resizeMode: 'contain', marginTop: count ? 20 : 0 }}
                    source={NotificationIcon()}
                    tintColor={this.props.focused ? PRIMARY_COLOR : GREY_2}
                />
                {
                    count ?
                        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: PRIMARY_COLOR, position: 'relative', top: -30, right: -15, alignItems: 'center', justifyContent: 'center' }} >
                            <Text style={{ color: ON_PRIMARY, fontSize: 14 }} >{count}</Text>
                        </View> : null
                }
            </>
        );
    }
}

const mapStateToProps = state => ({
    notifications: state.notification.notifications
})

export default connect(mapStateToProps)(NotificationIconComponent);