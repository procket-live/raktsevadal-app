import React from 'react';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { View, Image, Text } from 'react-native';
import { Bar } from 'react-native-progress';
import { BottleIcon } from '../../../config/image.config';
import { GREY_BG, TEXT_COLOR, GREY_3, PRIMARY_COLOR, GREEN, ON_PRIMARY } from '../../../constants/color.constant';

function BloodUnitComponent({ units, fulfiled, amIDoner, completed }) {
    let progress = (Number(fulfiled) / Number(units));
    if (completed) {
        progress = 1;
    }

    return (
        <View style={{ height: 110, width: widthPercentageToDP(95), padding: 10, borderWidth: 1, borderColor: GREY_BG, borderRadius: 10, margin: widthPercentageToDP(2.5) }} >
            <View style={{ flexDirection: 'row', flex: 4 }} >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <Image source={BottleIcon()} style={{ width: 50, height: 50 }} />
                </View>
                <View style={{ flex: 3, padding: 10 }} >
                    <View style={{ flex: 2, alignItems: 'flex-start', justifyContent: 'center' }} >
                        <Text style={{ fontSize: 25, color: TEXT_COLOR }} >{units}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }} >
                        <Text style={{ fontSize: 16, color: TEXT_COLOR }} >
                            Remaining Units
                    </Text>
                    </View>
                </View>
                <View style={{ flex: 2, padding: 10 }} >
                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }} >
                        {
                            amIDoner ?
                                <View style={{ padding: 5, borderWidth: 1, borderColor: GREEN, borderRadius: 5, backgroundColor: GREEN }} >
                                    <Text style={{ fontSize: 16, color: ON_PRIMARY }} >Accepted</Text>
                                </View>
                                : null
                        }

                    </View>
                </View>
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                <Bar
                    progress={progress}
                    width={widthPercentageToDP(90)}
                    color={PRIMARY_COLOR}
                    unfilledColor={GREY_BG}
                    borderWidth={0}
                />
            </View>
        </View>
    )
}

export default BloodUnitComponent;
