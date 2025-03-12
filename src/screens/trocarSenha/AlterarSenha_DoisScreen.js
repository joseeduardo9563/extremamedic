import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    StatusBar,
    Image,
    View,
    Keyboard,
    ImageBackground,
    Alert
} from 'react-native';
import {
    Text,
    Container,
    Content,
    H3,
    Form,
    Item,
    Input,
    Button,
    Icon
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ColorsScheme from '../../settings/ColorsScheme';
import { sha1 } from 'react-native-sha1';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const AlterarSenhaDois = () => {
    const navigation = useNavigation();
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [disable, setDisable] = useState(false);
    const [usuario, setUsuario] = useState({});
    const [matricula, setMatricula] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [secureTextEntry1, setSecureTextEntry1] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('@usuario')
            .then(val => {
                const userData = JSON.parse(val);
                setMatricula(userData.matricula);
                setUsuario(userData);
            })
            .catch(console.log);
    }, []);

    const onSubmit = () => {
        if (!novaSenha || !confirmarSenha) {
            showAlert("Campo vazio", "Preencha todos os campos e tente novamente.");
            return;
        }
        if (novaSenha !== confirmarSenha) {
            showAlert("Atenção!", "As senhas informadas não conferem, verifique e tente novamente.");
            return;
        }

        setDisable(true);
        Keyboard.dismiss();

        sha1(novaSenha).then(hash => {
            const key = hash.toUpperCase();
            const url = `${Server.API}alterarSenha/UpdatePassword.asp?matricula=${matricula}&senha=${key}`;
            
            fetch(url)
                .then(response => response.json())
                .then(responseJson => {
                    responseJson.oauthtoken = "kYXbW>c&qt*wVd))/H9pa#oHc<E<";
                    responseJson.senha = novaSenha;
                    responseJson.email = usuario.email;
                    responseJson.matricula = matricula;
                    
                    return fetch('http://awapp.net.br/extremamedic/MailerApi/sendNewPassword_BeneficiarioExtrema.php', {
                        method: 'POST',
                        body: JSON.stringify(responseJson),
                    });
                })
                .then(response => response.json())
                .then(final => {
                    setDisable(false);
                    if (final.status) {
                        showAlert("Verifique seu e-mail", "Sua senha foi alterada e encaminhada para o e-mail informado.", () => navigation.navigate("Login"));
                    } else {
                        showAlert("Ops!", "Algo deu errado.");
                    }
                })
                .catch(() => {
                    setDisable(false);
                    showAlert("Ops!", "Algo deu errado.");
                });
        });
    };

    const showAlert = (title, message, onPress = () => {}) => {
        Alert.alert(title, message, [{ text: "OK", onPress }], { cancelable: false });
    };

    return (
        <Container>
            <StatusBar backgroundColor={ColorsScheme.ASENT_COLOR} barStyle="light-content" />
            <ImageBackground source={require('../../assets/fundoNovo.png')} style={styles.background}>
                <Content>
                    <View style={styles.logoContainer}>
                        <Image style={styles.logo} source={require('../../assets/Logo_MEDGLO_POS.png')} resizeMode="contain" />
                    </View>
                    <H3 style={styles.title}>ALTERAR SENHA</H3>
                    <Form style={styles.formContainer}>
                        <Item style={styles.formItem}>
                            <Text>Nova Senha:</Text>
                            <Input secureTextEntry={secureTextEntry} onChangeText={setNovaSenha} style={styles.input} />
                            <FontAwesome5 name={secureTextEntry ? 'eye' : 'eye-slash'} style={styles.eyeIcon} onPress={() => setSecureTextEntry(!secureTextEntry)} />
                        </Item>
                        <Item style={styles.formItem}>
                            <Text>Confirme sua senha:</Text>
                            <Input secureTextEntry={secureTextEntry1} onChangeText={setConfirmarSenha} style={styles.input} />
                            <FontAwesome5 name={secureTextEntry1 ? 'eye' : 'eye-slash'} style={styles.eyeIcon} onPress={() => setSecureTextEntry1(!secureTextEntry1)} />
                        </Item>
                        <View style={styles.buttonContainer}>
                            <Button disabled={disable} style={styles.button} rounded onPress={onSubmit}>
                                <Text>Enviar</Text>
                            </Button>
                        </View>
                    </Form>
                </Content>
            </ImageBackground>
            <Button disabled={disable} transparent onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-back" style={{ color: 'black' }} />
            </Button>
        </Container>
    );
};

const styles = StyleSheet.create({
    background: { width: '100%', height: '100%', flex: 1 },
    logoContainer: { padding: 20, marginTop: 50, justifyContent: 'center', alignItems: 'center' },
    logo: { width: 200.6, height: 124 },
    title: { padding: 10, textAlign: 'center', fontWeight: 'bold' },
    formContainer: { padding: 10 },
    formItem: { flexDirection: 'column', alignItems: 'flex-start', paddingTop: 10 },
    input: { width: '80%', fontSize: 14, color: "#000000" },
    eyeIcon: { color: ColorsScheme.ASENT_COLOR, fontSize: 25, position: "absolute", right: 15, top: 10 },
    buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
    button: { margin: 10, backgroundColor: ColorsScheme.ASENT_COLOR },
    backButton: { position: 'absolute', top: 15 }
});

export default AlterarSenhaDois;