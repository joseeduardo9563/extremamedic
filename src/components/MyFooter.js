import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ColorsScheme from '../settings/ColorsScheme';

const MyFooter = ({ openModal, openDrawer }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.button} onPress={openModal}>
                <FontAwesome5 name={'stethoscope'} solid style={styles.icon} />
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
                <FontAwesome5 name={'heart'} solid style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Carteirinha')}>
                <FontAwesome5 name={'home'} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Contato')}>
                <FontAwesome5 name={'comment'} solid style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={openDrawer}>
                <FontAwesome5 name={'bars'} solid style={styles.icon} />
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