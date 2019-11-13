import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { PRIMARY_COLOR, ON_PRIMARY } from '../../constants/color.constant';
import { MenuIcon } from '../../config/image.config';
import { openDrawer } from '../../services/navigation.service';

const Header = props => {
    return (
        <View style={styles.container} >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                <TouchableOpacity
                    onPress={openDrawer}
                >
                    <Image
                        source={MenuIcon()}
                        style={styles.icon}
                        tintColor={ON_PRIMARY}
                    />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 5, alignItems: 'flex-start', justifyContent: 'center' }} >
                <Text style={styles.text}>{props.title}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: widthPercentageToDP(100),
        height: 45,
        padding: 5,
        backgroundColor: PRIMARY_COLOR,
        flexDirection: 'row',
    },
    text: {
        color: ON_PRIMARY,
        fontSize: 20
    },
    icon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    }
})

export default Header;
