import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    StatusBar,
    Image,
    View,
    Platform,
    ImageBackground,
    Alert,
    ToastAndroid,
    TextInput,
    Keyboard,
    ScrollView
} from 'react-native';
import {
    Text,
    Button,
    Icon,
    Spinner,
    NativeBaseProvider,
    Input,
    ChevronDownIcon,
    ChevronUpIcon
} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ColorsScheme from '../../settings/ColorsScheme';
import Server from '../../settings/Server';
import CryptoJS from "crypto-js";

import { useNavigation, useRoute } from '@react-navigation/native';

const SenhaScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const {
        matricula = '000',
        cpf = '000',
        datanascimento: dataNascimento = '000',
        nome = '000',
        email = '000'
    } = route.params || {};

    const [senha, setSenha] = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSecurity, setIsSecurity] = useState(true);
    const [isSecurityConfirm, setIsSecurityConfirm] = useState(true);

    useEffect(() => {
        console.log("SenhaScreen carregado");
    }, []);

    const onSubmit = () => {
        if (!senha || !confirmSenha) {
            showToast('Campos vazios, preencha todos os campos');
            return;
        }

        if (senha.length < 8) {
            showToast('Informe uma senha com no mínimo 8 caracteres');
            return;
        }

        const regex = /^(?=.*[@!#$%^&*()/\\])(?=.*[0-9])(?=.*[A-Z])[@!#$%^&*()/\\a-zA-Z0-9]{8,20}$/;
        if (!regex.test(senha)) {
            Alert.alert("Senha inválida", "A senha deve conter no mínimo 1 letra maiúscula, 1 caractere especial e números.");
            return;
        }

        if (senha !== confirmSenha) {
            showToast('Senhas não conferem');
            return;
        }

        setIsLoading(true);
        Keyboard.dismiss();



        const senhaHash = CryptoJS.SHA1(senha).toString();
        const url = `${Server.API}primeiroAcesso/testeInsert.asp?matricula=${matricula}&senha=${senhaHash.toUpperCase()}`;

        fetch(url)
            .then(response => response.json())
            .then(responseJson => {
                setIsLoading(false);
                if (responseJson.success) {
                    showToast('Cadastrado com sucesso', 'success');
                    navigation.navigate('Login');
                }
            })
            .catch(() => {
                setIsLoading(false);
                showToast('Erro ao cadastrar');
            });
    };

    const showToast = (message, type = 'danger') => {
        Platform.OS === "ios"
            ? Toast.show({ text: message, buttonText: 'Okay', type, duration: 3000 })
            : ToastAndroid.show(message, 3000);
    };

    return (
        <NativeBaseProvider>
            <StatusBar backgroundColor={ColorsScheme.ASENT_COLOR} barStyle="light-content" />
            <ImageBackground source={require('../../assets/fundoNovo.png')} style={styles.background}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Spinner size={85} color={ColorsScheme.MAIN_COLOR} />
                        <Text style={styles.loadingText}>Cadastrando...</Text>
                    </View>
                ) : (
                    <ScrollView>
                        <View style={styles.logoContainer}>
                            <Image style={styles.logo} source={require('../../assets/Logo_MEDGLO_POS.png')} resizeMode="contain" />
                        </View>
                        <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", padding: 10, color: "#000000" }}>
                            PRIMEIRO ACESSO
                        </Text>
                        <View style={styles.formContainer}>
                            <Text>Senha:</Text>
                            <Input
                                secureTextEntry={isSecurity}
                                style={{ width: "80%", color: "#000000", fontSize: 18 }}
                                onChangeText={setSenha} autoCapitalize="none"
                            />

                            {isSecurity ? (
                                <ChevronDownIcon
                                    size="5"
                                    mt="0.5"
                                    color={ColorsScheme.ASENT_COLOR}
                                    onPress={() => setIsSecurity(!isSecurity)}
                                    style={{ color: ColorsScheme.ASENT_COLOR, fontSize: 25 }}
                                />
                            ) : (
                                <ChevronUpIcon
                                    size="5"
                                    mt="0.5"
                                    color={ColorsScheme.ASENT_COLOR}
                                    onPress={() => setIsSecurity(!isSecurity)}
                                    style={{ color: ColorsScheme.ASENT_COLOR, fontSize: 25 }}
                                />
                            )}
                            <Text>Confirme a Senha:</Text>
                            <Input
                                secureTextEntry={isSecurityConfirm}
                                style={{ width: "80%", color: "#000000", fontSize: 18 }}
                                onChangeText={setConfirmSenha} autoCapitalize="none"
                            />
                            {isSecurityConfirm ? (
                                <ChevronDownIcon
                                    size="5"
                                    mt="0.5"
                                    color={ColorsScheme.ASENT_COLOR}
                                    onPress={() => setIsSecurityConfirm(!isSecurityConfirm)}
                                    style={{ color: ColorsScheme.ASENT_COLOR, fontSize: 25 }}
                                />
                            ) : (
                                <ChevronUpIcon
                                    size="5"
                                    mt="0.5"
                                    color={ColorsScheme.ASENT_COLOR}
                                    onPress={() => setIsSecurityConfirm(!isSecurityConfirm)}
                                    style={{ color: ColorsScheme.ASENT_COLOR, fontSize: 25 }}
                                />
                            )}
                            <View style={styles.buttonContainer}>
                                <Button style={styles.button} onPress={onSubmit}>
                                    <Text style={{ color: "#FFFFFF"}}>Cadastrar</Text>
                                </Button>
                            </View>
                        </View>
                    </ScrollView>
                )}
            </ImageBackground>
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({
    background: { flex: 1, width: '100%', height: '100%' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 105 },
    loadingText: { color: '#000', textAlign: 'center' },
    logoContainer: { padding: 20, marginTop: 50, justifyContent: 'center', alignItems: 'center' },
    logo: { width: 200.6, height: 124 },
    headerText: { padding: 10, textAlign: 'center', fontWeight: 'bold' },
    formContainer: { padding: 10 },
    formItem: { flexDirection: 'row', alignItems: 'center', paddingTop: 10 },
    input: { flex: 1, fontSize: 14, color: "#000", borderBottomWidth: 1, borderBottomColor: "#c4c4c4", },
    eyeIcon: { color: ColorsScheme.ASENT_COLOR, fontSize: 25, marginLeft: 10 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
    button: { margin: 10, backgroundColor: ColorsScheme.ASENT_COLOR, borderRadius: 10 },
    borderRadius: 10
});

export default SenhaScreen;
