import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    StatusBar,
    Image,
    View,
    Platform,
    ImageBackground,
    Alert,
    ScrollView
} from 'react-native';
import {
    Text,
    Container,
    Input,
    Button,
    Spinner,
    NativeBaseProvider
} from 'native-base';
import { TextInputMask } from 'react-native-masked-text';
import { useNavigation, useRoute } from '@react-navigation/native';
import ColorsScheme from '../../settings/ColorsScheme';
import Server from '../../settings/Server';

const PrimeiroAcesso = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const {
        matricula: matriculaRec = '000',
        cpf: cpfRec = '000',
        data_nascimento: dataNascimentoRec = '000',
        option = '000'
    } = route.params || {};

    const [matricula, setMatricula] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [mae, setMae] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log(isLoading);
    }, []);

    const onSubmit = () => {
        if (cpf && dataNascimento && matricula && mae) {
            setIsLoading(true);
            const url = `${Server.API}primeiroAcesso/testeFirst.asp?matricula=${matricula}`;

            fetch(url)
                .then(response => response.json())
                .then(responseJson => {
                    setIsLoading(false);
                    if (responseJson.isBenefNet) {
                        Alert.alert("Matrícula já cadastrada", "Use a opção Recuperar Senha ou entre em contato com a operadora.");
                    } else if (!responseJson.isBenef) {
                        Alert.alert("Beneficiário não encontrado", "Verifique os dados informados ou procure a operadora.");
                    } else {
                        processBeneficiary(responseJson);
                    }
                })
                .catch(() => {
                    setIsLoading(false);
                    Alert.alert("Erro interno", "Verifique sua conexão com a internet e tente novamente.");
                });
        } else {
            Alert.alert("Campo vazio", "Preencha todos os campos e tente novamente.");
        }
    };

    const processBeneficiary = (data) => {
        let formattedCpf = cpf.replace(/\D/g, '');
        if (formattedCpf === data.cpf && dataNascimento === data.nascimento && matricula === data.matricula) {
            let nomeMae = mae.trim().toUpperCase();
            let primeiroNomeMae = data.nome_mae.split(" ")[0].toUpperCase();

            if (nomeMae === primeiroNomeMae) {
                let codigo = Math.random().toString().slice(-6);
                navigation.navigate(data.email ? 'Confirma' : 'PrimeiroAcesso_dois', {
                    matricula: data.matricula,
                    nome: data.nome,
                    cpf: data.cpf,
                    data_nascimento: data.nascimento,
                    codSeguranca: codigo,
                    email: data.email || '',
                    mae: data.nome_mae,
                    value: data.email ? undefined : 'First'
                });
            } else {
                Alert.alert("Nome da mãe incorreto!", "Nome da mãe não confere com o cadastrado.");
            }
        } else {
            Alert.alert("Dados inválidos!", "Verifique CPF, matrícula e data de nascimento e tente novamente.");
        }
    };

    return (
        <NativeBaseProvider>
            
                <StatusBar backgroundColor={ColorsScheme.ASENT_COLOR} barStyle="light-content" />
                <ImageBackground source={require('../../assets/fundoNovo.png')} style={styles.background}>
                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <Spinner size={85} color={ColorsScheme.MAIN_COLOR} />
                            <Text style={styles.loadingText}>Carregando...</Text>
                        </View>
                    ) : (
                        <ScrollView style={{ width: "100%" }}>
                            <View style={styles.logoContainer}>
                                <Image style={styles.logo} source={require('../../assets/Logo_MEDGLO_POS.png')} resizeMode="contain" />
                            </View>
                            <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", padding: 10, color: "#000000" }}>
                                PRIMEIRO ACESSO
                            </Text>
                            <View style={styles.formContainer}>
                                <View style={styles.formItem}>
                                    <Text>Matrícula:</Text>
                                    <Input keyboardType='number-pad' value={matricula} onChangeText={setMatricula} />
                                </View>
                                <View style={styles.formItem}>
                                    <Text>CPF:</Text>
                                    <TextInputMask 
                                        type="cpf" 
                                        value={cpf} 
                                        onChangeText={setCpf} 
                                        keyboardType='number-pad' 
                                        style={styles.input} 
                                    />
                                </View>
                                <View style={styles.formItem}>
                                    <Text>Data de nascimento:</Text>
                                    <TextInputMask type="datetime" options={{ format: "DD/MM/YYYY" }} value={dataNascimento} onChangeText={setDataNascimento} style={styles.input} />
                                </View>
                                <View style={styles.formItem}>
                                    <Text>Primeiro nome da mãe:</Text>
                                    <Input value={mae} onChangeText={setMae} />
                                </View>
                                <View style={styles.buttonContainer}>
                                    <Button style={styles.button} onPress={onSubmit}>
                                        <Text style={{
                                            color: "#FFFFFF"
                                        }}>
                                            Prosseguir
                                        </Text>
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
    formItem: { flexDirection: 'column', alignItems: 'flex-start', paddingTop: 10 },
    input: { width: '100%', fontSize: 14, color: "#000", borderWidth: 1, 
        borderRadius: 5,
        borderColor: "#c2c2c2" },
    buttonContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
    button: { margin: 10, backgroundColor: ColorsScheme.ASENT_COLOR, borderRadius: 20 },
    borderRadius: 10
});

export default PrimeiroAcesso;
