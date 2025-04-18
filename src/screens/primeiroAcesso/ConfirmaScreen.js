import React, { useState, useEffect } from 'react';
import {
    StatusBar,
    View,
    Image,
    ImageBackground,
    Alert,
    TouchableOpacity,
    Platform,
    ToastAndroid,
    ScrollView
} from 'react-native';
import {
    Text,
    NativeBaseProvider,
    ArrowBackIcon,
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
    const [maskedEmail, setMaskedEmail] = useState(email);

    useEffect(() => {
        sendCode();
        setMaskedEmail(maskEmail(email))
    }, []);

    const sendCode = () => {
        setIsLoading(true);
        const cod = Math.floor(100000 + Math.random() * 900000); // Gera código de 6 dígitos

        let obj = {
            oauthtoken: "kYXbW>c&qt*wVd))/H9pa#oHc<E<",
            // email,
            email: "joseeduardoa627@gmail.com",
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
        console.log(codigo)
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

    const maskEmail = (email) => {
        const [name, domain] = email.split("@");
        const maskedName = name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
        return `${maskedName}@${domain}`;
    };

    return (
        <NativeBaseProvider>
            <StatusBar backgroundColor={ColorsScheme.ASENT_COLOR} barStyle="light-content" />
            <ImageBackground source={require('../../assets/fundoNovo.png')} style={{ width: '100%', height: '100%', flex: 1 }}>
                {isLoading ? (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Spinner size={85} color={ColorsScheme.MAIN_COLOR} />
                        <Text style={{ color: '#000', textAlign: "center" }}>Enviando código de segurança...</Text>
                    </View>
                ) : (
                    <ScrollView style={{ width: '100%' }}>
                        <View style={{ padding: 20, marginTop: 50, justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ width: 200.6, height: 124 }} source={require('../../assets/Logo_MEDGLO_POS.png')} resizeMode="contain" />
                        </View>
                        <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", padding: 10, color: "#000000" }}>
                            PRIMEIRO ACESSO
                        </Text>
                        <View style={{ margin: 20 }}>
                            <Text style={{ fontSize: 15 }}>Um código de segurança foi enviado para o e-mail {maskedEmail}</Text>
                            <Text style={{ marginTop: 15, fontSize: 15 }}>Digite o código enviado para prosseguir:</Text>
                        </View>
                        <View style={{ padding: 10 }}>
                            <View style={{ flexDirection: 'column', alignItems: 'flex-start', paddingTop: 10 }}>
                                <Text style={{ marginBottom: 13 }}>Código de segurança:</Text>
                                <Input style={{ width: '100%', fontSize: 18,color: "#000" }}
                                    keyboardType='number-pad'
                                    onChangeText={setValue}
                                />
                            </View>
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
                                <Button style={{ margin: 10, backgroundColor: ColorsScheme.ASENT_COLOR, borderRadius: 20 }} dark onPress={onConfirm}>
                                    <Text style={{ color: "#FFFFFF"}}>Prosseguir</Text>
                                </Button>
                            </View>
                        </View>
                    </ScrollView>
                )}
            </ImageBackground>
            <Button onPress={() => navigation.goBack()} style={{ position: "absolute", top: Platform.OS === "ios" ? 15 : 0, backgroundColor: "transparent" }}>
                <ArrowBackIcon size="5" mt="0.5" color="black" />
            </Button>
        </NativeBaseProvider>
    );
};

export default ConfirmaScreen;
