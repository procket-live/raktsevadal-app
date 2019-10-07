import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import DonerCardComponent from '../../components/doner-card-component/doner-card.component';

class DonersListScene extends PureComponent {
    renderCard = ({ item }) => {
        return (
            <DonerCardComponent
                user={(item.user || item)}
                acceptedAt={item.created_at}
                showCallButton={this.props.showCallButton}
                showRequestButton={this.props.showRequestButton}
                requestBloodDonation={this.props.request}
                loading={this.props.loading}
            />
        )
    }

    render() {
        return (
            <FlatList
                style={{ flex: 1 }}
                data={this.props.data}
                renderItem={this.renderCard}
            />
        )
    }
}

export default DonersListScene;
