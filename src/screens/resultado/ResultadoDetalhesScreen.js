import React, { useEffect, useState } from 'react';
import {
    View,
    ImageBackground,
    Image,
    Dimensions,
    ScrollView,
    Alert,
} from 'react-native';
import { Button, Text, Picker } from 'native-base';
import ColorsScheme from '../../settings/ColorsScheme';
import Base from '../../components/Base';
import HeaderGoBack from '../../components/HeaderGoBack';
import Server from '../../settings/Server';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Overlay } from 'react-native-elements';
import MapView, { Marker } from 'react-native-maps';
import { OpenMapDirections } from 'react-native-navigation-directions';
import call from 'react-native-phone-call';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FavoriteButton from '../../components/FavoriteButton';

const ResultadoDetalhesScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const {
        data = {},
        goBack = {},
        isolada = false
    } = route.params || {};

    const [detalhes, setDetalhes] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [latitude, setLatitude] = useState(-21.4294);
    const [longitude, setLongitude] = useState(-45.9471);
    const [selected, setSelected] = useState(0);
    const [icon, setIcon] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [informacao, setInformacao] = useState([]);

    useEffect(() => {
        if (data.tipo === 'P') {
            getDetalhesMedico().then(res => getLatLog(res[0]));
            getEspecialidade();
            getIconByProf();
        } else {
            setDetalhes([data]);
            getLatLog(data);
        }
    }, [data]);

    const getIconByProf = () => {
        fetch(`${Server.API}isolada/getIconByProf.asp?profissional=${data.profissional}`)
            .then(response => response.json())
            .then(setIcon)
            .catch(console.log);
    };

    const getEspecialidade = () => {
        fetch(`${Server.API}isolada/getEspecialidadeByProficional.asp?profissional=${data.profissional}`)
            .then(response => response.json())
            .then(setEspecialidades)
            .catch(console.log);
    };

    const getDetalhesMedico = async () => {
        const url = `${Server.API}isolada/getDetalhesMedico.asp?profissional=${data.profissional}`;
        return fetch(url)
            .then(response => response.json())
            .then(responseJson => {
                setDetalhes(responseJson);
                return responseJson;
            })
            .catch(console.log);
    };

    const getLatLog = (element) => {
        let endereco = `${element.LOGRADOURO}, ${element.ENDERECO_NUMERO}, ${element.ENDERECO}, ${element.BAIRRO}, ${element.CIDADE}, ${element.CEP}`.replace(/\s/g, '+');
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${endereco}&key=SUA_API_KEY`)
            .then(res => res.json())
            .then(({ results }) => {
                setLatitude(results[0].geometry.location.lat);
                setLongitude(results[0].geometry.location.lng);
            })
            .catch(console.log);
    };

    const callShowDirections = () => {
        OpenMapDirections(null, { latitude, longitude }, 'd').then(() => {});
    };

    return (
        <Base navigation={navigation}>
            <HeaderGoBack navigation={navigation} title={'Rede Credenciada'} />
            <ScrollView>
                <Overlay isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
                    <View style={{ padding: 20 }}>
                        {informacao.map((info, index) => (
                            <Text key={index} style={{ margin: 10 }}>{info}</Text>
                        ))}
                    </View>
                </Overlay>
                <ImageBackground source={require('../../assets/IMAGEMFUNDO.png')} style={{ width: '100%', height: 200, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ position: 'absolute', top: 10, right: 10 }}>
                        <FavoriteButton data={data} />
                    </View>
                    <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", padding: 10, color: ColorsScheme.ASENT_COLOR }}>
                        {isolada ? data.NOME : data.nome_empresa}
                    </Text>
                    <Text style={{ textAlign: 'center', marginTop: 10 }}>{isolada ? data.ESPECIALIDADE : data.nome_empresa}</Text>
                </ImageBackground>
                {detalhes.length > 1 && (
                    <Picker
                        mode="dropdown"
                        selectedValue={selected}
                        onValueChange={setSelected}
                        iosIcon={<FontAwesome5 name="angle-down" />}
                    >
                        {detalhes.map((item, index) => (
                            <Picker.Item key={index} label={item.NOME_FANTASIA} value={index} />
                        ))}
                    </Picker>
                )}
                <MapView style={{ height: 200, width: '100%', marginTop: 20 }} region={{ latitude, longitude, latitudeDelta: 0.0032, longitudeDelta: 0.0021 }}>
                    <Marker coordinate={{ latitude, longitude }} title={detalhes[selected]?.nome_empresa} />
                </MapView>
                <Button onPress={callShowDirections} block iconLeft style={{ marginTop: 10, backgroundColor: ColorsScheme.ASENT_COLOR }}>
                    <FontAwesome5 name="map-marker-alt" style={{ color: 'white', fontSize: 20 }} />
                    <Text>Navegar</Text>
                </Button>
            </ScrollView>
        </Base>
    );
};

export default ResultadoDetalhesScreen;