import React, { PureComponent } from 'react';
import { FlatList, View, StyleSheet, RefreshControl, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { connect } from 'react-redux';

import { EmptyStateLottie } from '../../config/lottie.config';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { GREY_1, ON_PRIMARY, GREY_3, GREY_BG } from '../../constants/color.constant';
import { fetchNearbyCamp } from '../../action/nearbyCamp.action';
import NewsfeedCard from '../../components/newsfeed-component/newsfeed.component';
import Header from '../../components/header-component/header.component';

class Newsfeed extends PureComponent {
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
            <NewsfeedCard
                loading={this.props.loading}
                camp={item}
            />
        )
    }

    render() {
        return (
            <>
                <Header title="Newsfeed" />
                <FlatList
                    style={{ flex: 1, backgroundColor: GREY_BG }}
                    contentContainerStyle={{ alignItems: 'center' }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.loading}
                            onRefresh={this.onRefresh}
                        />
                    }
                    data={[1, 2]}
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
        height: heightPercentageToDP(60),
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const mapStateToProps = (state) => ({
    loading: state.nearbyCamp.loading,
    camps: state.nearbyCamp.camps
})

export default connect(mapStateToProps, { fetchNearbyCamp })(Newsfeed);