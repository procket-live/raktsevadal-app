import React, { PureComponent } from 'react';
import { FlatList, View, StyleSheet, RefreshControl } from 'react-native';
import LottieView from 'lottie-react-native';
import { connect } from 'react-redux';

import PrivateApi from '../../api/api.private';
import { NoNotificationLottie } from '../../config/lottie.config';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import NotificatonCard from '../../components/notification-card-component/notification-card.component';
import { fetchNotifications, setNotificationSeenCount } from '../../action/notification.action';
import { AccessNestedObject } from '../../utils/common.util';
import { ON_PRIMARY, GREY_BG } from '../../constants/color.constant';
import Header from '../../components/header-component/header.component';

class NotificationScene extends PureComponent {
    componentDidMount = () => {
        this.fetchNotification();
        this.props.setNotificationSeenCount(AccessNestedObject(this.props, 'notifications', []).length);
    }

    onRefresh = () => {
        this.fetchNotification();
    }

    fetchNotification = () => {
        this.props.fetchNotifications();
    }

    RendeEmptyList = () => {
        return (
            <View style={styles.emptyListContainer} >
                <View style={{ width: widthPercentageToDP(90), height: widthPercentageToDP(50) }} >
                    <LottieView
                        autoPlay
                        loop={false}
                        source={NoNotificationLottie()}
                    />
                </View>
            </View>
        )
    }

    RenderItem = ({ item }) => {
        return (
            <NotificatonCard
                loading={this.props.loading}
                notification={item}
            />
        )
    }

    render() {
        return (
            <>
                <Header title="Notifications" />
                <FlatList
                    style={{ flex: 1, backgroundColor: GREY_BG }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.loading}
                            onRefresh={this.onRefresh}
                        />
                    }
                    data={this.props.notifications}
                    renderItem={this.RenderItem}
                    ListEmptyComponent={this.RendeEmptyList}
                />
            </>
        )
    }
}

const styles = StyleSheet.create({
    emptyListContainer: {
        width: widthPercentageToDP(100),
        height: heightPercentageToDP(100),
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const mapStateToProps = (state) => ({
    loading: state.notification.loading,
    notifications: state.notification.notifications,
})

export default connect(mapStateToProps, { fetchNotifications, setNotificationSeenCount })(NotificationScene);