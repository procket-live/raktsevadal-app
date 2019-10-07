import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { GREY_1, GREY_2, GREY_3 } from '../../constants/color.constant';
import { ArrowRightIcon, UserIcon } from '../../config/image.config';
import { connect } from 'react-redux';
import { AccessNestedObject, ShareApp } from '../../utils/common.util';
import moment from 'moment';
import { API_DATE_FORMAT, DISPLAY_DATE_FORMAT } from '../../constants/app.constant';
import { logoutUserAction } from '../../action/user.action';
import { navigate, navigatePop } from '../../services/navigation.service';

const InfoScene = ({ user, logout }) => {
    return (
        <View style={styles.container} >
            <View style={{ height: 140, padding: 10, borderBottomWidth: 1, borderBottomColor: GREY_2, flexDirection: 'row' }} >
                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                    <Image source={UserIcon()} style={{ width: 80, height: 80 }} />
                </View>
                <View style={{ flex: 2, alignItems: 'flex-start' }} >
                    <Text style={{ fontSize: 20, color: GREY_2 }} >
                        {AccessNestedObject(user, 'name')}
                    </Text>
                    <Text style={{ fontSize: 18, color: GREY_3 }} >
                        Blood Group: {AccessNestedObject(user, 'blood_group')}
                    </Text>
                    <Text style={{ fontSize: 18, color: GREY_3 }} >
                        Gender: {AccessNestedObject(user, 'gender')}
                    </Text>
                    <Text style={{ fontSize: 18, color: GREY_3 }} >
                        Date of birth: {moment(AccessNestedObject(user, 'dob')).format(DISPLAY_DATE_FORMAT)}
                    </Text>
                    <Text style={{ fontSize: 18, color: GREY_3 }} >
                        Mobile: {AccessNestedObject(user, 'mobile')}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                onPress={() => {
                    navigate('UpdateUserDetail', {
                        callback: () => {
                            navigatePop();
                        }
                    })
                }}
                style={styles.menuItem}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Image source={ArrowRightIcon()} style={styles.icon} />
                </View>
                <View style={{ flex: 6, alignItems: 'flex-start', justifyContent: 'center' }} >
                    <Text style={styles.text} >
                        Edit Profile
                    </Text>
                </View>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.menuItem} >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Image source={ArrowRightIcon()} style={styles.icon} />
                </View>
                <View style={{ flex: 6, alignItems: 'flex-start', justifyContent: 'center' }} >
                    <Text style={styles.text} >
                        Language / भाषा
                    </Text>
                </View>
            </TouchableOpacity> */}
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                    navigate('AboutUs')
                }}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Image source={ArrowRightIcon()} style={styles.icon} />
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
                    <Image source={ArrowRightIcon()} style={styles.icon} />
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
                    <Image source={ArrowRightIcon()} style={styles.icon} />
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
                    <Image source={ArrowRightIcon()} style={styles.icon} />
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
        flex: 1
    },
    menuItem: {
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: GREY_1,
        padding: 5,
        flexDirection: 'row'
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    text: {
        fontSize: 20,
        color: GREY_2
    }
})

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps, { logout: logoutUserAction })(InfoScene);
