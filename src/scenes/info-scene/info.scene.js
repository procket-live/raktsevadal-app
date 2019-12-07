import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { GREY_1, GREY_2, GREY_3, ON_PRIMARY, TEXT_COLOR, GREY_BG } from '../../constants/color.constant';
import { ArrowRightIcon, UserIcon, NewIcon } from '../../config/image.config';
import { connect } from 'react-redux';
import { AccessNestedObject, ShareApp } from '../../utils/common.util';
import moment from 'moment';
import { API_DATE_FORMAT, DISPLAY_DATE_FORMAT } from '../../constants/app.constant';
import { logoutUserAction } from '../../action/user.action';
import { navigate, navigatePop } from '../../services/navigation.service';

const InfoScene = ({ user, logout }) => {
    const profileImage = AccessNestedObject(user, 'profile_image');
    const source = profileImage ? { uri: profileImage } : UserIcon();

    return (
        <View style={styles.container} >
            <TouchableOpacity style={styles.menuItem} >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Image source={ArrowRightIcon()} style={styles.icon} tintColor={TEXT_COLOR} />
                </View>
                <View style={{ flex: 6, alignItems: 'flex-start', justifyContent: 'center' }} >
                    <Text style={styles.text} >
                        Language / भाषा
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Image source={ArrowRightIcon()} style={styles.icon} tintColor={TEXT_COLOR} />
                </View>
                <View style={{ flex: 6, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }} >
                    <Text style={styles.text} >
                        Join as Volunteer
                    </Text>
                    <Image source={NewIcon()} style={{ width: 25, height: 25, resizeMode: 'contain', marginLeft: 10 }} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                    navigate('AboutUs')
                }}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Image source={ArrowRightIcon()} style={styles.icon} tintColor={TEXT_COLOR} />
                </View>
                <View style={{ flex: 6, alignItems: 'flex-start', justifyContent: 'center' }} >
                    <Text style={styles.text} >
                        About us
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    navigate('TermsAndCondition')
                }}
                style={styles.menuItem}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Image source={ArrowRightIcon()} style={styles.icon} tintColor={TEXT_COLOR} />
                </View>
                <View style={{ flex: 6, alignItems: 'flex-start', justifyContent: 'center' }} >
                    <Text style={styles.text} >
                        Terms and conditions
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={ShareApp}
                style={styles.menuItem}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Image source={ArrowRightIcon()} style={styles.icon} tintColor={TEXT_COLOR} />
                </View>
                <View style={{ flex: 6, alignItems: 'flex-start', justifyContent: 'center' }} >
                    <Text style={styles.text} >
                        Share App
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={logout}
                style={styles.menuItem}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Image source={ArrowRightIcon()} style={styles.icon} tintColor={TEXT_COLOR} />
                </View>
                <View style={{ flex: 6, alignItems: 'flex-start', justifyContent: 'center' }} >
                    <Text style={styles.text} >
                        Logout
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GREY_BG
    },
    menuItem: {
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: GREY_1,
        padding: 5,
        flexDirection: 'row',
        backgroundColor: ON_PRIMARY
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    text: {
        fontSize: 20,
        color: GREY_1
    }
})

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps, { logout: logoutUserAction })(InfoScene);
