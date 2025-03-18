import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    StatusBar,
    Image,
    View,
    Platform,
    ImageBackground,
    TouchableOpacity,
    Alert,
    ToastAndroid,
    ScrollView
} from 'react-native';
import {
    Text,
    Container,
    Form,
    Item,
    Input,
    Button,
    Toast,
    Icon,
    Spinner
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ColorsScheme from '../../settings/ColorsScheme';
import Server from '../../settings/Server';
import { useNavigation, useRoute } from '@react-navigation/native';

const PrimeiroAcessoDois = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [senhaGerada] = useState(Math.random().toString(36).slice(-10));
    const [email, setEmail] = useState('');
    const [disable, setDisable] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [confirmMae, setConfirmMae] = useState('');

    const {
        matricula = '000',
        cpf = '000',
        data_nascimento = '000',
        nome = '000',
        codSeguranca: codigo = '000',
        value: opcao = '000',
        mae: nome_mae = '000'
    } = route.params || {};

    useEffect(() => {
        console.log("senhaGerada", senhaGerada);
    }, []);

    const onUpdateEmail = () => {
        if (opcao === 'not_found') {
            let mae = nome_mae.split(" ");
            if (confirmMae) {
                if (confirmMae.toUpperCase() === mae[0]) {
                    submitEmail();
                }
            } else {
                showToast('Preencha todos os campos.');
            }
        } else {
            submitEmail();
        }
    };

    const submitEmail = () => {
        if (email) {
            const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
            if (regex.test(email)) {
                setIsLoading(true);

                const url = `${Server.API}primeiroAcesso/testeUpdateEmail.asp?email=${email}&matricula=${matricula}`;
                console.log(url);

                fetch(url)
                    .then((response) => response.json())
                    .then(responseJson => {
                        if (responseJson.success) {
                            setIsLoading(false);
                            navigation.navigate(opcao === 'not_found' ? 'Confirma_notFound' : 'Confirma', {
                                matricula,
                                nome,
                                cpf,
                                data_nascimento,
                                codSeguranca: codigo,
                                email
                            });
                        }
                    })
                    .catch(err => console.log(err));
            } else {
                showToast('Email inválido.');
            }
        } else {
            showToast('Informe um e-mail para prosseguir.');
        }
    };

    const showToast = (message) => {
        Platform.OS === "ios" ?
            Toast.show({
                text: message,
                buttonText: 'Okay',
                type: "danger",
                duration: 3000
            }) :
            ToastAndroid.show(message, 3000);
    };

    return (
        <Container>
            <StatusBar backgroundColor={ColorsScheme.ASENT_COLOR} barStyle="light-content" />
            <ImageBackground source={require('../../assets/fundoNovo.png')} style={styles.background}>
                {isloading ? (
                    <View style={styles.loadingContainer}>
                        <Spinner size={85} color={ColorsScheme.MAIN_COLOR} />
                        <Text style={styles.loadingText}>Cadastrando E-mail...</Text>
                    </View>
                ) : (
                    <ScrollView>
                        <View style={styles.logoContainer}>
                            <Image
                                style={styles.logo}
                                source={require('../../assets/Logo_MEDGLO_POS.png')}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", padding: 10, color: ColorsScheme.ASENT_COLOR }}>
                            PRIMEIRO ACESSO
                        </Text>
                        <View style={styles.instructionsContainer}>
                            <Text style={styles.instructionsText}>
                                {opcao === 'First' ? "Beneficiário não possui e-mail cadastrado." : "Informe um novo email para receber o código de segurança."}
                            </Text>
                            <Text style={styles.instructionsText}>Digite um endereço de e-mail para prosseguir:</Text>
                        </View>
                        <Form style={styles.formContainer}>
                            <Item style={styles.formItem}>
                                <Text>E-mail:</Text>
                                <Input
                                    style={styles.input}
                                    autoCorrect={false}
                                    onChangeText={setEmail}
                                />
                            </Item>
                            {opcao === 'not_found' && email ? (
                                <Item style={styles.formItem}>
                                    <Text>Primeiro nome da mãe:</Text>
                                    <Input
                                        style={styles.input}
                                        onChangeText={setConfirmMae}
                                    />
                                </Item>
                            ) : null}
                            <View style={styles.buttonContainer}>
                                <Button
                                    disabled={disable}
                                    style={styles.button}
                                    onPress={onUpdateEmail}
                                >
                                    <Text>Prosseguir</Text>
                                </Button>
                            </View>
                        </Form>
                    </ScrollView>
                )}
            </ImageBackground>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-back" style={{ color: 'black' }} />
            </TouchableOpacity>
        </Container>
    );
};

const styles = StyleSheet.create({
    background: { flex: 1, width: '100%', height: '100%' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 105 },
    loadingText: { color: '#000', textAlign: 'center' },
    logoContainer: { padding: 20, marginTop: 50, justifyContent: 'center', alignItems: 'center' },
    logo: { width: 200.6, height: 124 },
    headerText: { padding: 10, textAlign: 'center', fontWeight: 'bold' },
    instructionsContainer: { margin: 20 },
    instructionsText: { fontSize: 15 },
    formContainer: { padding: 10 },
    formItem: { flexDirection: 'column', alignItems: 'flex-start', paddingTop: 10 },
    input: { width: '100%', marginTop: 10, fontSize: 14, color: "#000" },
    buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
    button: { margin: 10, backgroundColor: ColorsScheme.ASENT_COLOR },
    backButton: { position: 'absolute', top: Platform.OS === 'ios' ? 15 : 0 },
    borderRadius: 10
});

export default PrimeiroAcessoDois;