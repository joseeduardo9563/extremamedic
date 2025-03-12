import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { Button, Picker, H3 } from 'native-base';
import { ButtonGroup } from 'react-native-elements';
import ColorsScheme from '../../settings/ColorsScheme';
import Base from '../../components/Base';
import HeaderGoBack from '../../components/HeaderGoBack';
import Server from '../../settings/Server';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const SelectCombinadaScreen = ({ navigation }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [empresa, setEmpresa] = useState(0);
    const [planos, setPlanos] = useState([]);
    const [selectPlanos, setSelectPlanos] = useState('key0');
    const [estabelecimentos, setEstabelecimentos] = useState([]);
    const [selectEstabelecimento, setSelectEstabelecimento] = useState('key0');
    const [estados, setEstados] = useState([]);
    const [selectEstado, setSelectEstado] = useState('key0');
    const [cidades, setCidades] = useState([]);
    const [selectCidades, setSelectCidades] = useState('key0');
    const [bairros, setBairros] = useState([]);
    const [selectBairro, setSelectBairro] = useState('key0');
    const [especialidades, setEspecialidades] = useState([]);
    const [selectEspecialidade, setSelectEspecialidade] = useState('key0');
    const [buttonDisable, setButtonDisable] = useState(true);

    useEffect(() => {
        getPlano();
    }, [selectedIndex]);

    const getModo = () => (selectedIndex === 0 ? 'medico' : 'servico');

    const getPlano = async () => {
        try {
            const response = await fetch(`${Server.JSON}json_buscaplano.asp?modo=${getModo()}`);
            const data = await response.json();
            setPlanos(data);
        } catch (error) {
            console.log(error);
        }
    };

    const pesquisar = async () => {
        const url = `${Server.JSON}json_guia_medico.asp?modo=${getModo()}&plano=${selectPlanos}&estado=${selectEstado}&cidade=${selectCidades}&bairro=${selectBairro}&especialidade=${selectEspecialidade}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            navigation.navigate('ResultadoBusca', {
                data,
                title: 'Resultados',
                subTitle: 'Abaixo os resultados da pesquisa'
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Base navigation={navigation}>
            <HeaderGoBack navigation={navigation} title={'Rede Credenciada'} />
            <ScrollView style={{ marginBottom: 55, backgroundColor: '#f8f8f8', padding: 20 }}>
                <H3 style={{ fontWeight: 'bold', color: ColorsScheme.ASENT_COLOR }}>BUSCA COMBINADA</H3>
                <Text style={{ fontSize: 12 }}>Selecione abaixo o tipo</Text>

                <ButtonGroup
                    onPress={setSelectedIndex}
                    selectedIndex={selectedIndex}
                    buttons={['Médico', 'Prestadores']}
                    selectedButtonStyle={{ backgroundColor: ColorsScheme.ASENT_COLOR }}
                />

                {planos.length > 0 && (
                    <View style={{ backgroundColor: '#fff', padding: 10, marginTop: 10 }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>INFORME PLANO</Text>
                        <Picker
                            selectedValue={selectPlanos}
                            onValueChange={setSelectPlanos}
                            iosIcon={<FontAwesome5 name="angle-down" />}
                        >
                            <Picker.Item label="Selecione..." value="key0" />
                            {planos.map((item) => (
                                <Picker.Item key={item.nplano} label={item.nomeplano} value={item.nplano} />
                            ))}
                        </Picker>
                    </View>
                )}

                <Button block disabled={buttonDisable} onPress={pesquisar} style={{ marginTop: 20, backgroundColor: buttonDisable ? '#ccc' : ColorsScheme.ASENT_COLOR }}>
                    <Text>Pesquisar</Text>
                </Button>
            </ScrollView>
        </Base>
    );
};

export default SelectCombinadaScreen