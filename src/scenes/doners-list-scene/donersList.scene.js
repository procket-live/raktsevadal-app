import React, { PureComponent } from 'react';
import { FlatList, View, Text } from 'react-native';
import DonerCardComponent from '../../components/doner-card-component/doner-card.component';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { GREY_1 } from '../../constants/color.constant';

class DonersListScene extends PureComponent {
    renderCard = ({ item }) => {
        return (
            <DonerCardComponent
                user={(item.user || item)}
                acceptedAt={item.created_at}
                showCallButton={this.props.showCallButton}
                showRequestButton={this.props.showRequestButton}
                sentDoners={this.props.sentDoners}
                requestBloodDonation={this.props.request}
                loading={this.props.loading}
            />
        )
    }

    EmptyList = () => {
        return (
            <View
                style={{
                    width: widthPercentageToDP(100),
                    height: heightPercentageToDP(40),
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{ fontSize: 24, color: GREY_1 }} >Nothing to display</Text>
            </View>
        )
    }

    render() {
        return (
            <FlatList
                style={{ flex: 1 }}
                data={this.props.data}
                renderItem={this.renderCard}
                ListEmptyComponent={this.EmptyList}
            />
        )
    }
}

export default DonersListScene;
