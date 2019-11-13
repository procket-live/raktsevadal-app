import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { UserIcon } from '../../config/image.config';
import { PRIMARY_COLOR, ON_PRIMARY, GREY_3, GREY_2, GREY_1, TEXT_COLOR } from '../../constants/color.constant';
import { AccessNestedObject } from '../../utils/common.util';
import { ScrollView } from 'react-native-gesture-handler';


const SideDrawerComponent = props => {
    const user = AccessNestedObject(props, 'user');
    const profileImage = AccessNestedObject(user, 'profile_image');
    const profileSource = profileImage ? { uri: profileImage } : UserIcon();
    const name = AccessNestedObject(user, 'name');
    const address = AccessNestedObject(user, 'address');
    const items = AccessNestedObject(props, 'items');
    const activeItem = AccessNestedObject(props, 'activeItemKey');
    console.log('props', props)

    const menu = [
        {

        }
    ]

    return (
        <ScrollView style={styles.container} >
            <View style={styles.uppperContainer} >
                <Image source={profileSource} style={styles.profileImage} />
                <Text style={styles.text} >{name}</Text>
                <Text style={styles.text2} >{address}</Text>
            </View>
            {
                items.map((item) => (
                    <TouchableOpacity
                        onPress={item.onItemPress}
                        style={item.key == activeItem ? styles.itemContainerSelected : styles.itemContainer}
                    >
                        <Text style={styles.text3} >{item.routeName}</Text>
                    </TouchableOpacity>
                ))
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    uppperContainer: {
        height: heightPercentageToDP(30),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: PRIMARY_COLOR
    },
    profileImage: {
        width: widthPercentageToDP(20),
        height: widthPercentageToDP(20),
        resizeMode: 'contain',
        borderRadius: widthPercentageToDP(20),
        marginBottom: 10
    },
    text: {
        fontSize: 18,
        color: ON_PRIMARY
    },
    text2: {
        fontSize: 14,
        color: ON_PRIMARY
    },
    text3: {
        fontSize: 16,
        color: GREY_2
    },
    itemContainer: {
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
    },
    itemContainerSelected: {
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        backgroundColor: GREY_1
    }
})

const mapStateToProps = state => ({
    user: state.user
})

export default connect(mapStateToProps)(SideDrawerComponent);
