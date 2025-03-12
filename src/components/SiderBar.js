import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    ImageBackground,
    TouchableOpacity,
    SectionList,
    Text,
    StyleSheet,
    Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const iconSize = 20;
const iconColor = '#666666';

const SideBarDrawer = () => {
    const navigation = useNavigation();
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const val = await AsyncStorage.getItem('@usuario');
            if (val) {
                setUsuario(JSON.parse(val));
            }
        };
        fetchUser();
    }, []);

    const menuItems = [
        {
            title: 'Menu',
            data: [
                { name: 'Home', icon: 'home', action: () => navigation.navigate('Carteirinha') },
                { name: 'Atendimento em trânsito', icon: 'ambulance', action: () => Linking.openURL("https://atendimentoabramge.com.br/#/home/service-locations") },
                { name: 'Teleconsulta', icon: 'laptop-medical', action: () => Linking.openURL("http://telemedicina.medicglobal.com.br") },
                { name: 'Fale Conosco', icon: 'phone', action: () => navigation.navigate('Contato') },
            ]
        },
        {
            title: 'Rede Credenciada',
            data: [
                { name: 'Busca isolada', icon: 'glasses', action: () => navigation.navigate('SelectIsolada') },
                { name: 'Busca combinada', iconComponent: MaterialCommunityIcons, icon: 'account-search', action: () => navigation.navigate('SelectCombinada') },
                {
                    name: 'Favoritos', icon: 'heart', action: async () => {
                        const res = await AsyncStorage.getItem('Favoritos');
                        navigation.navigate('ResultadoBusca', {
                            data: JSON.parse(res),
                            title: 'Favorito',
                            subTitle: 'Abaixo todos os credenciados que você marcou como Favorito'
                        });
                    }
                }
            ]
        },
        {
            title: 'Meu Plano',
            data: [
                { name: 'Sobre', icon: 'info-circle', action: () => navigation.navigate('About') }
            ]
        }
    ];

    if (usuario) {
        menuItems[2].data.push(
            { name: 'Perfil', icon: 'user', action: () => navigation.navigate('Perfil') },
            { name: 'Cartão virtual', icon: 'id-card', action: () => navigation.navigate('Carteirinha', { data: usuario }) },
            { name: 'Sair', icon: 'sign-out-alt', action: async () => {
                await AsyncStorage.clear();
                navigation.reset({ index: 0, routes: [{ name: 'Select' }] });
            }}
        );
    } else {
        menuItems[2].data.push({ name: 'Entrar com matrícula', icon: 'sign-in-alt', action: () => navigation.navigate('Select') });
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/Logo_MEDGLO_POS.png')}
                resizeMode="contain"
                style={styles.logo}
            />
            <SectionList
                style={{ marginTop: 122 }}
                sections={menuItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={item.action}>
                        {item.iconComponent ? (
                            <item.iconComponent name={item.icon} size={iconSize} color={iconColor} />
                        ) : (
                            <Icon name={item.icon} size={iconSize} color={iconColor} />
                        )}
                        <Text style={styles.itemText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
        backgroundColor: 'white'
    },
    logo: {
        height: 145,
        width: '100%',
        alignSelf: 'stretch',
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    sectionHeader: {
        paddingTop: 8,
        paddingLeft: 10,
        paddingBottom: 8,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
        color: '#000000',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    itemText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#000000',
    }
});

export default SideBarDrawer;