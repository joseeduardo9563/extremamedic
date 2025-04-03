import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ColorsScheme from '../settings/ColorsScheme';
import { ArrowBackIcon, Icon } from 'native-base';

const MyFooter = ({ openModal, openDrawer }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.button} onPress={openModal}>
                <ArrowBackIcon  size="5" mt="0.5" color="white" />
                {/* <Icon as={FontAwesome5} name="android1" color="coolGray.800" _dark={{
                    color: "warmGray.50"
                }} /> */}
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                    const res = await AsyncStorage.getItem('Favoritos');
                    navigation.navigate('ResultadoBusca', {
                        data: JSON.parse(res),
                        title: 'Favorito',
                        subTitle: 'Abaixo todos os credenciados que você marcou como Favorito'
                    });
                }}
            >
                <ArrowBackIcon size="5" mt="0.5" color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Carteirinha')}>
                <ArrowBackIcon size="5" mt="0.5" color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Contato')}>
                <ArrowBackIcon size="5" mt="0.5" color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={openDrawer}>
                <ArrowBackIcon size="5" mt="0.5" color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: ColorsScheme.MAIN_COLOR,
        paddingVertical: 10,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
    button: {
        padding: 10
    },
    icon: {
        fontSize: 22,
        color: 'white'
    }
});

export default MyFooter;