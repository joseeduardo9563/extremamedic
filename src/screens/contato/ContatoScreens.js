import React, { useState } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import ColorsScheme from '../../settings/ColorsScheme';
import Base from '../../components/Base';
import HeaderGoBack from '../../components/HeaderGoBack';
import {
    Input,
    Item,
    Label,
    Form,
    Picker,
    Textarea,
    Text,
    Button,
    Toast,
} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TextInputMask } from 'react-native-masked-text';
import axios from 'axios';

const ContatoScreens = ({ navigation }) => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        cidade: '',
        UF: '',
        selectedSetor: '1',
        selectedPerfil: 'Visitante',
        selectedAssunto: 'Dúvida',
        mensagem: '',
        CPF: '',
        CNPJ: '',
        isDisable: false,
        isLoading: false,
    });

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const enviarContato = () => {
        if (formData.nome && formData.UF && formData.email && formData.mensagem && formData.cidade) {
            Alert.alert("Confirmar", "Deseja continuar com o envio?", [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "OK",
                    onPress: async () => {
                        setFormData(prevState => ({ ...prevState, isLoading: true }));
                        try {
                            const response = await axios.post(
                                'http://awapp.net.br/extremamedic/MailerApi/sendTeste.php',
                                {
                                    oauthtoken: "kYXbW>c&qt*wVd))/H9pa#oHc<E<",
                                    ...formData,
                                    nome_setor: formData.selectedSetor === '1' ? "Ouvidoria" : "Comercial"
                                }
                            );
                            console.log(response);
                            Alert.alert("Sucesso", "Enviado com sucesso", [
                                { text: "OK", onPress: () => navigation.navigate('Carteirinha') }
                            ]);
                        } catch (error) {
                            console.error(error);
                            Toast.show({
                                text: 'Algo deu errado',
                                buttonText: 'Okay',
                                type: 'danger',
                                duration: 3000
                            });
                        } finally {
                            setFormData(prevState => ({ ...prevState, isLoading: false }));
                        }
                    }
                }
            ]);
        } else {
            Toast.show({
                text: 'Tem campos obrigatórios não preenchidos',
                buttonText: 'Okay',
                type: 'danger',
                duration: 3000
            });
        }
    };

    return (
        <Base navigation={navigation}>
            <HeaderGoBack navigation={navigation} title={'Fale Conosco'} />
            <ScrollView style={{ backgroundColor: '#f8f8f8' }}>
                <View style={{ padding: 10 }}>
                    <View style={{ marginBottom: 10 }}>
                        <Text>Nome:*</Text>
                        <Input value={formData.nome} onChangeText={(val) => handleInputChange('nome', val)} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text>E-mail:*</Text>
                        <Input value={formData.email} onChangeText={(val) => handleInputChange('email', val)} autoCapitalize="none" />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text>Telefone:</Text>
                        <TextInputMask
                            type={'cel-phone'}
                            value={formData.telefone}
                            onChangeText={(val) => handleInputChange('telefone', val)}
                        />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text>Cidade:*</Text>
                        <Input value={formData.cidade} onChangeText={(val) => handleInputChange('cidade', val)} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text>UF:*</Text>
                        <Input value={formData.UF} onChangeText={(val) => handleInputChange('UF', val)} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text>Setor:</Text>
                        <Picker
                            selectedValue={formData.selectedSetor}
                            onValueChange={(val) => handleInputChange('selectedSetor', val)}
                        >
                            <Picker.Item label="Ouvidoria" value="1" />
                            <Picker.Item label="Comercial" value="2" />
                        </Picker>
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <Text>Mensagem:</Text>
                        <Textarea
                            rowSpan={4}
                            maxLength={2000}
                            bordered
                            value={formData.mensagem}
                            onChangeText={(val) => handleInputChange('mensagem', val)}
                        />
                    </View>
                    <Text style={{ marginLeft: "5%", fontSize: 12 }}>{`${formData.mensagem.length}/2000`}</Text>
                    <View style={{ flexDirection: 'column', paddingTop: 50 }}>
                        <Button onPress={enviarContato} disabled={formData.isDisable}>
                            <Text style={{ textAlign: 'center', width: '100%' }}>Enviar</Text>
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </Base>
    );
};

export default ContatoScreens;