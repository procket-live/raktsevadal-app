import React, { PureComponent } from 'react';
import { FlatList, View, StyleSheet, RefreshControl } from 'react-native';
import LottieView from 'lottie-react-native';

import PrivateApi from '../../api/api.private';
import { NoNotificationLottie } from '../../config/lottie.config';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import NotificatonCard from '../../components/notification-card-component/notification-card.component';

class NotificationScene extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            notifications: [1, 2, 3, 4],
            loading: true
        }
    }

    componentDidMount = () => {
        this.fetchNotification();
    }

    onRefresh = () => {
        this.setState({ loading: true })
        this.fetchNotification();
    }

    fetchNotification = async () => {
        const result = await PrivateApi.getNotifications();
        if (result.success) {
            this.setState({ notifications: result.response, loading: false })
        } else {
            this.setState({ notifications: [], loading: false })
        }
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
                loading={this.state.loading}
                notification={item}
            />
        )
    }

    render() {
        return (
            <FlatList
                style={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.loading}
                        onRefresh={this.onRefresh}
                    />
                }
                data={this.state.notifications}
                renderItem={this.RenderItem}
                ListEmptyComponent={this.RendeEmptyList}
            />
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

export default NotificationScene;