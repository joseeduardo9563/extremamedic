import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    ImageBackground,
    ScrollView,
    Text,
    Platform,
    Keyboard,
    Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-swiper';
import ColorsScheme from "../../settings/ColorsScheme";
import Server from "../../settings/Server";
import Base from '../../components/Base';
import HeaderGoBack from '../../components/HeaderGoBack';
import { Picker } from "native-base";

const CarteirinhaScreen = ({ navigation }) => {
    const [user, setUser] = useState({});
    const [contratos, setContratos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [istitular, setIstitular] = useState(false);
    const [dependentes, setDependentes] = useState([]);
    const [selectDependente, setSelectDependente] = useState("key0");

    useEffect(() => {
        _doloading();
    }, []);

    const _doloading = async () => {
        try {
            const val = await AsyncStorage.getItem('@usuario');
            if (val) {
                setUser(JSON.parse(val));
                doloading(JSON.parse(val).matricula);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const doloading = (matricula) => {
        if (matricula) {
            getCarteirinha(matricula);
            getDependentes(matricula);
        }
    };

    const getCarteirinha = async (matricula) => {
        setIsLoading(true);
        Keyboard.dismiss();

        try {
            const response = await fetch(`${Server.API}financeiro/getComponenteCadastral.asp?matricula=${matricula}`);
            const responseJson = await response.json();
            setContratos(responseJson);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getDependentes = async (matricula) => {
        try {
            const response = await fetch(`${Server.API}financeiro/getComponenteCadastralTitular.asp?matricula=${matricula}`);
            const responseJson = await response.json();
            setIstitular(true);
            setDependentes(responseJson);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Base navigation={navigation}>
            <HeaderGoBack navigation={navigation} title={'Cartão Virtual'} ishome={true} />
            <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
                <ScrollView>
                    {istitular && (
                        <Picker
                            selectedValue={selectDependente}
                            onValueChange={(val) => {
                                setSelectDependente(val);
                                getCarteirinha(val);
                            }}
                        >
                            <Picker.Item label="Dependentes" value="key0" />
                            <Picker.Item label="Titular" value={user.matricula} />
                            {dependentes.filter(dep => dep !== user.matricula).map((dep, index) => (
                                <Picker.Item key={index} label={dep.nome_beneficiario} value={dep.matricula} />
                            ))}
                        </Picker>
                    )}
                    <Swiper>
                        {contratos.map((item, index) => (
                            <View key={index} style={{ width: '100%', height: '100%' }}>
                                <ImageBackground
                                    source={require('../../assets/extremamedic_carteirinhafrente.png')}
                                    style={{ width: '92%', height: '100%', maxHeight: 600, flex: 1, justifyContent: "center", marginLeft: "5%", marginTop: 5, marginBottom: "2%" }}
                                    imageStyle={{ borderRadius: 25 }}
                                >
                                    <Text style={{ fontWeight: "bold", fontSize: 22, color: "#FFFFFF", textAlign: "right", marginRight: "5%" }}>{item.matricula}</Text>
                                    <Text style={{ fontWeight: "bold", fontSize: 18, color: "#FFFFFF", marginLeft: "2%" }}>{item.nome_beneficiario}</Text>
                                </ImageBackground>
                            </View>
                        ))}
                    </Swiper>
                </ScrollView>
            </View>
        </Base>
    );
};

export default CarteirinhaScreen;