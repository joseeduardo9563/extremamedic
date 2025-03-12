import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    ImageBackground,
    Platform,
    Text,
} from "react-native";
import { Spinner, Button, Icon } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-swiper';
import ColorsScheme from "../../settings/ColorsScheme";
import HeaderGoBack from '../../components/HeaderGoBack';

const CarteirinhaScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [contratos, setContratos] = useState(route.params?.contratos || []);
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        carregarUsuario();
    }, []);

    const carregarUsuario = async () => {
        try {
            const usuario = await AsyncStorage.getItem('@usuario');
            if (usuario) {
                setUser(JSON.parse(usuario));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Spinner size={85} color={ColorsScheme.MAIN_COLOR} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <HeaderGoBack navigation={navigation} title={'Cartão Virtual'} />

            <Swiper>
                {/* Frente do cartão */}
                <View style={styles.cardContainer}>
                    <ImageBackground
                        source={
                            contratos.some(x => 
                                x.cod_plano === 45 || x.cod_plano === 46 ||
                                x.cod_plano === 47 || x.cod_plano === 48 ||
                                x.cod_plano === 49 || x.cod_plano === 50
                            )
                                ? require('../../assets/medicGlobal.png')
                                : require('../../assets/extremamedic_carteirinhafrente.png')
                        }
                        style={styles.cardImage}
                        imageStyle={styles.cardImageBorder}
                    >
                        <View style={styles.cardDetails}>
                            <Text style={styles.cardTextBold}>{contratos?.matricula}</Text>
                            <Text style={styles.cardTextBold}>{contratos?.nome_beneficiario}</Text>
                            <Text style={styles.cardText}>Empresa: {contratos?.nome_empresa}</Text>
                            <Text style={styles.cardText}>Plano: {contratos?.plano}</Text>
                            <Text style={styles.cardText}>Cobertura: {contratos?.cobertura}</Text>
                            <Text style={styles.cardText}>Nascimento: {contratos?.nascimento}</Text>
                        </View>
                    </ImageBackground>
                </View>

                {/* Verso do cartão */}
                <View style={styles.cardContainer}>
                    <ImageBackground
                        source={
                            contratos.some(x => x.cod_plano === 45 || x.cod_plano === 46)
                                ? require('../../assets/medicGlobalFundo.png')
                                : require('../../assets/extremamedic_carteirinhaverso.png')
                        }
                        style={styles.cardImage}
                        imageStyle={styles.cardImageBorder}
                    />
                </View>
            </Swiper>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    cardContainer: {
        width: '100%',
        height: '100%',
        justifyContent: "center",
        alignItems: "center",
    },
    cardImage: {
        width: '92%',
        height: '100%',
        maxHeight: 600,
        justifyContent: "center",
        alignItems: "center",
    },
    cardImageBorder: {
        borderRadius: 25,
    },
    cardDetails: {
        alignItems: "flex-end",
        marginRight: "5%",
    },
    cardText: {
        fontSize: 15,
        color: "#FFFFFF",
    },
    cardTextBold: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});

export default CarteirinhaScreen;
