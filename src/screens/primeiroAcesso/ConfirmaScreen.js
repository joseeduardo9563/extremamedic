import React, { useState, useEffect } from 'react';
import {
    StatusBar,
    View,
    Image,
    ImageBackground,
    Alert,
    TouchableOpacity,
    Platform,
    ToastAndroid
} from 'react-native';
import {
    Text,
    Root,
    Content,
    H3,
    Form,
    Item,
    Input,
    Button,
    Spinner,
    Icon,
    Toast
} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import ColorsScheme from '../../settings/ColorsScheme';

const ConfirmaScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const {
        matricula = '000',
        cpf = '000',
        data_nascimento = '000',
        nome = '000',
        codSeguranca = '000',
        email = '000',
        mae = '000'
    } = route.params || {};

    const [codigo, setCodigo] = useState(codSeguranca);
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        sendCode();
    }, []);

    const sendCode = () => {
        setIsLoading(true);
        const cod = Math.floor(100000 + Math.random() * 900000); // Gera código de 6 dígitos

        let obj = {
            oauthtoken: "kYXbW>c&qt*wVd))/H9pa#oHc<E<",
            email,
            codigo: cod,
            matricula
        };

        fetch('http://awapp.net.br/extremamedic/MailerApi/sendSecureCodeExtrema.php', {
            method: 'POST',
            body: JSON.stringify(obj),
        })
        .then(response => response.json())
        .then(() => {
            setCodigo(cod);
            setIsLoading(false);
        })
        .catch(err => {
            console.error(err);
            setIsLoading(false);
            Alert.alert("Erro", "Falha ao enviar código. Tente novamente.");
        });
    };

    const onConfirm = () => {
        if (!value) {
            Platform.OS === "ios"
                ? Toast.show({ text: 'Informe o código para prosseguir.', buttonText: 'Okay', type: "danger", duration: 3000 })
                : ToastAndroid.show('Informe o código para prosseguir.', 3000);
            return;
        }

        if (value === codigo.toString()) {
            navigation.navigate('Senha', {
                matricula,
                nome,
                cpf,
                datanascimento: data_nascimento,
                email
            });
        } else {
            Platform.OS === "ios"
                ? Toast.show({ text: 'Código inválido', buttonText: 'Okay', type: "danger", duration: 3000 })
                : ToastAndroid.show('Código inválido.', 3000);
        }
    };

    return (
        <Root>
            <StatusBar backgroundColor={ColorsScheme.ASENT_COLOR} barStyle="light-content" />
            <ImageBackground source={require('../../assets/fundoNovo.png')} style={{ width: '100%', height: '100%', flex: 1 }}>
                {isLoading ? (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Spinner size={85} color={ColorsScheme.MAIN_COLOR} />
                        <Text style={{ color: '#000', textAlign: "center" }}>Enviando código de segurança...</Text>
                    </View>
                ) : (
                    <Content style={{ width: '100%' }}>
                        <View style={{ padding: 20, marginTop: 50, justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ width: 200.6, height: 124 }} source={require('../../assets/Logo_MEDGLO_POS.png')} resizeMode="contain" />
                        </View>
                        <H3 style={{ padding: 10, textAlign: 'center', fontWeight: 'bold' }}>PRIMEIRO ACESSO</H3>
                        <View style={{ margin: 20 }}>
                            <Text style={{ fontSize: 15 }}>Um código de segurança foi enviado para o e-mail {email}</Text>
                            <Text style={{ marginTop: 15, fontSize: 15 }}>Digite o código enviado para prosseguir:</Text>
                        </View>
                        <Form style={{ padding: 10 }}>
                            <Item style={{ flexDirection: 'column', alignItems: 'flex-start', paddingTop: 10 }}>
                                <Text style={{ marginBottom: -13 }}>Código de segurança:</Text>
                                <Input style={{ width: '100%', marginTop: 10, marginBottom: -10, fontSize: 14, color: "#000" }}
                                    keyboardType='number-pad'
                                    onChangeText={setValue}
                                />
                            </Item>
                            <TouchableOpacity onPress={() => {
                                Alert.alert(
                                    "Não recebi o código",
                                    "Escolha a opção desejada.",
                                    [
                                        {
                                            text: "Reenviar código",
                                            onPress: sendCode,
                                            style: "default"
                                        },
                                        {
                                            text: "Novo e-mail",
                                            onPress: () => {
                                                navigation.navigate('PrimeiroAcesso_dois', {
                                                    matricula,
                                                    nome,
                                                    cpf,
                                                    data_nascimento,
                                                    codSeguranca: Math.floor(100000 + Math.random() * 900000),
                                                    value: 'not_found',
                                                    mae
                                                });
                                            },
                                            style: "default"
                                        },
                                        {
                                            text: "Cancelar",
                                            style: "cancel"
                                        }
                                    ],
                                    { cancelable: false }
                                );
                            }}>
                                <Text style={{ color: ColorsScheme.ASENT_COLOR, fontSize: 15, marginTop: 20 }}>Não recebi o código</Text>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Button style={{ margin: 10, backgroundColor: ColorsScheme.ASENT_COLOR }} rounded dark onPress={onConfirm}>
                                    <Text>Prosseguir</Text>
                                </Button>
                            </View>
                        </Form>
                    </Content>
                )}
            </ImageBackground>
            <Button transparent onPress={() => navigation.goBack()} style={{ position: 'absolute', top: Platform.OS === 'ios' ? 15 : 0 }}>
                <Icon name="arrow-back" style={{ color: 'black' }} />
            </Button>
        </Root>
    );
};

export default ConfirmaScreen;
