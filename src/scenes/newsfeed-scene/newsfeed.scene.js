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
import PrivateApi from '../../api/api.private';
import { AccessNestedObject } from '../../utils/common.util';

class Newsfeed extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            loading: false
        }
    }

    componentDidMount = async () => {
        this.setState({ loading: true });
        const result = await PrivateApi.getAllPost(true);
        this.setState({ loading: false });
        if (result.success) {
            this.setState({ list: result.response });
        }
    }

    RenderItem = ({ item }) => {
        const loggedInUserId = AccessNestedObject(this.props, 'loggedInUser._id');

        return (
            <NewsfeedCard
                post={item}
                loading={this.props.loading}
                camp={item}
                loggedInUserId={loggedInUserId}
            />
        )
    }

    render() {
        const { list, loading } = this.state;

        return (
            <>
                <Header title="Newsfeed" />
                {
                    loading ?
                        <View style={{ flex: 1, alignItems: 'center', backgroundColor: GREY_BG }} >
                            <NewsfeedCard loading={loading} />
                            <NewsfeedCard loading={loading} />
                        </View > : null
                }
                <FlatList
                    style={{ flex: 1, backgroundColor: GREY_BG }}
                    contentContainerStyle={{ alignItems: 'center' }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.loading}
                            onRefresh={this.onRefresh}
                        />
                    }
                    data={list}
                    renderItem={this.RenderItem}
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
    camps: state.nearbyCamp.camps,
    loggedInUser: state.user
})

export default connect(mapStateToProps, { fetchNearbyCamp })(Newsfeed);