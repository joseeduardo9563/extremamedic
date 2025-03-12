import { TextInputMask } from 'react-native-masked-text';
import Server from '../../settings/Server';
import { sha1 } from 'react-native-sha1';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const AlterarSenha = () => {
    const navigation = useNavigation();
    const [cpf, setCpf] = useState('');
    const [senhaAtual, setSenhaAtual] = useState('');
    const [disable, setDisable] = useState(false);
    const [matricula, setMatricula] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem('@usuario')
            .then(val => {
                const userData = JSON.parse(val);
                setMatricula(userData.matricula);
            })
            .catch(console.log);
    }, []);

    const onSubmit = () => {
        if (!cpf || !senhaAtual) {
            showAlert("Campo vazio", "Preencha todos os campos e tente novamente.");
            return;
        }
        
        setDisable(true);
        Keyboard.dismiss();
        
        sha1(senhaAtual).then(hash => {
            const url = `${Server.API}alterarSenha/getDados.asp?cpf=${cpf}&senha=${hash}&matricula=${matricula}`;
            fetch(url)
                .then(response => response.json())
                .then(responseJson => {
                    if (responseJson.senha && responseJson.cpf) {
                        navigation.navigate('AlterarSenhaDois');
                    } else {
                        showAlert("Dados inválidos", "Verifique os dados informados e tente novamente.");
                    }
                    setDisable(false);
                })
                .catch(() => {
                    showAlert("Erro", "Não foi possível validar os dados. Tente novamente.");
                    setDisable(false);
                });
        });
    };

    const showAlert = (title, message) => {
        Alert.alert(title, message, [{ text: "OK" }], { cancelable: false });
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
                            <Text>CPF:</Text>
                            <TextInputMask type="cpf" keyboardType='number-pad' value={cpf} onChangeText={setCpf} style={styles.input} />
                        </Item>
                        <Item style={styles.formItem}>
                            <Text>Senha atual:</Text>
                            <Input secureTextEntry={secureTextEntry} onChangeText={setSenhaAtual} style={styles.input} />
                            <FontAwesome5 name={secureTextEntry ? 'eye' : 'eye-slash'} style={styles.eyeIcon} onPress={() => setSecureTextEntry(!secureTextEntry)} />
                        </Item>
                        <View style={styles.buttonContainer}>
                            <Button disabled={disable} style={styles.button} rounded onPress={onSubmit}>
                                <Text>Próximo</Text>
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

export default AlterarSenha;