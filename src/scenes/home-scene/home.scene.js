import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import WideButton from '../../components/wide-button-component/wide-button.component';
import { TEXT_COLOR, GREY_1, GREY_2, ON_PRIMARY } from '../../constants/color.constant';
import moment from 'moment';
import { AccessNestedObject } from '../../utils/common.util';
import { navigate } from '../../services/navigation.service';

class HomeScene extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    RenderListHeader = () => {
        const user = AccessNestedObject(this.props, 'user', {});
        return (
            <React.Fragment>
                <View style={styles.topContainer} >
                    <View style={styles.profileImageContainer} >
                        <View
                            source={{
                                uri: 'https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwiFj5e_pNjkAhWm8HMBHRSMAOoQjRx6BAgBEAQ&url=https%3A%2F%2Fwww.malindomiles.com%2Finspirenetz%2Fapp%2F&psig=AOvVaw0DXnpe8Bi3rzoAlP7TWi1A&ust=1568824407023827'
                            }}
                            style={styles.profileImage}
                        />
                    </View>
                    <View style={{ flex: 2, paddingTop: 20, paddingBottom: 15 }} >
                        <Text style={styles.h2} >
                            {AccessNestedObject(user, 'name')}
                        </Text>
                        <Text style={styles.h3} >
                            Blood Group: {AccessNestedObject(user, 'blood_group')}
                        </Text>
                        <Text style={styles.h3} >
                            Age: {Math.abs(moment(AccessNestedObject(user, 'dob')).diff(moment(), 'years'))}
                        </Text>
                        <Text style={styles.h3} >
                            +91 {AccessNestedObject(user, 'mobile')}
                        </Text>
                    </View>
                </View>
                <View style={{ alignItems: 'center', padding: 10 }} >
                    <WideButton
                        onPress={this.openBloodRequirement}
                        text="Rquest Blood Donation"
                    />
                </View>
                <View style={{ alignItems: 'center', padding: 10 }} >
                    <WideButton
                        mode="outline"
                        text="My Blood Donation Requests"
                    />
                </View>
            </React.Fragment>
        )
    }

    RenderItem = ({ item, index }) => {
        if (index + 1 == 1) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'flex-start', backgroundColor: ON_PRIMARY, padding: 10 }}>
                    <Text style={styles.h2} >
                        Nearby Requestes
                    </Text>
                </View>
            )
        }

        return (
            <View style={{ height: 100, width: 200, borderWidth: 1 }} >

            </View>
        )
    }

    openBloodRequirement = () => {
        navigate('AddBloodRequirement');
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    ListHeaderComponent={this.RenderListHeader}
                    renderItem={this.RenderItem}
                    data={[1, 2, 3, 4, 5, 6, 6, 7, 7, 77, 7, 2]}
                    stickyHeaderIndices={[1]}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topContainer: {
        height: 150,
        flexDirection: 'row',
        backgroundColor: ON_PRIMARY
    },
    profileImageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImage: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 60
    },
    h2: {
        fontSize: 22,
        color: TEXT_COLOR
    },
    h3: {
        fontSize: 18,
        color: GREY_2
    },
});

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps)(HomeScene);