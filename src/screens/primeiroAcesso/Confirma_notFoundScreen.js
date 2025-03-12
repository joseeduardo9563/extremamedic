import React, { useState, useEffect } from 'react';
import {
    StatusBar,
    View,
    Image,
    ImageBackground,
    Platform,
    Alert,
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
} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import ColorsScheme from '../../settings/ColorsScheme';

const ConfirmaNotFoundScreen = () => {
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
    const [isloading, setIsLoading] = useState(false);
    
    useEffect(() => {
        sendCode();
    }, []);

    const sendCode = () => {
        setIsLoading(true);
        const cod = Math.floor(Math.random() * 999999);

        let obj = {
            oauthtoken: "kYXbW>c&qt*wVd))/H9pa#oHc<E<",
            email,
            codigo: cod,
            matricula
        };

        fetch('http://awapp.net.br/extremamedic/MailerApi/MailerApi/sendSecureCodeExtrema.php', {
            method: 'POST',
            body: JSON.stringify(obj),
        })
        .then((response) => response.json())
        .then(() => {
            setIsLoading(false);
            setCodigo(cod);
        })
        .catch((err) => {
            console.log(err);
            setIsLoading(false);
        });
    };

    const onConfirm = () => {
        if (value) {
            if (value == codigo) {
                navigation.navigate('Senha', {
                    matricula,
                    nome,
                    cpf,
                    datanascimento: data_nascimento,
                    email
                });
            } else {
                Platform.OS === "ios" ? 
                Toast.show({ text: 'Código inválido', buttonText: 'Okay', type: "danger", duration: 3000 }) : 
                ToastAndroid.show('Código inválido.', 3000);
            }
        } else {
            Platform.OS === "ios" ? 
            Toast.show({ text: 'Informe o código para prosseguir', buttonText: 'Okay', type: "danger", duration: 3000 }) : 
            ToastAndroid.show('Informe o código para prosseguir.', 3000);
        }
    };

    return (
        <Root>
            <StatusBar backgroundColor={ColorsScheme.ASENT_COLOR} barStyle="light-content" />
            <ImageBackground source={require('../../assets/fundoNovo.png')} style={{ width: '100%', height: '100%', flex: 1 }}>
                {isloading ? (
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

export default ConfirmaNotFoundScreen;
