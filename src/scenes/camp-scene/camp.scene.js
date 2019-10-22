import React, { PureComponent } from 'react';
import { FlatList, View, StyleSheet, RefreshControl, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { connect } from 'react-redux';

import { EmptyStateLottie } from '../../config/lottie.config';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { GREY_1 } from '../../constants/color.constant';
import BloodDonationCampComponent from '../../components/blood-donation-camp-component/blood-donation-camp.component';
import { fetchNearbyCamp } from '../../action/nearbyCamp.action';

class CampScene extends PureComponent {
    componentDidMount = () => {
        this.fetchCamp();
    }

    onRefresh = () => {
        this.fetchCamp();
    }

    fetchCamp = async () => {
        this.props.fetchNearbyCamp();
    }

    RendeEmptyList = () => {
        return (
            <View style={styles.emptyListContainer} >
                <View style={{ width: widthPercentageToDP(90), height: widthPercentageToDP(50), alignItems: 'center' }} >
                    <LottieView
                        autoPlay
                        loop={false}
                        source={EmptyStateLottie()}
                    />

                </View>
                <Text style={{ fontSize: 20, color: GREY_1 }} >
                    No blood donation camp in your area
                </Text>
            </View>
        )
    }

    RenderItem = ({ item }) => {
        return (
            <BloodDonationCampComponent
                loading={this.props.loading}
                camp={item}
            />
        )
    }

    render() {
        return (
            <FlatList
                style={{ flex: 1 }}
                contentContainerStyle={{ alignItems: 'center' }}
                refreshControl={
                    <RefreshControl
                        refreshing={this.props.loading}
                        onRefresh={this.onRefresh}
                    />
                }
                data={this.props.camps}
                renderItem={this.RenderItem}
                ListEmptyComponent={this.RendeEmptyList}
            />
        )
    }
}

const styles = StyleSheet.create({
    emptyListContainer: {
        width: widthPercentageToDP(100),
        height: heightPercentageToDP(60),
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const mapStateToProps = (state) => ({
    loading: state.nearbyCamp.loading,
    camps: state.nearbyCamp.camps
})

export default connect(mapStateToProps, { fetchNearbyCamp })(CampScene);