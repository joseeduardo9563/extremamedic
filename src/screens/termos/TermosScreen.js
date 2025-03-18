import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  StatusBar,
  Image,
  View,
  ScrollView,
  ImageBackground,
  ToastAndroid
} from "react-native";
import {
  Text,
  Form,
  Item,
  Button,
  CheckBox,
  Body
} from "native-base";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import ColorsScheme from "../../settings/ColorsScheme";
import SpinnerDrawer from '../../components/Spinner';
import Server from "../../settings/Server";

const TermosScreen = () => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [checkTermo, setCheckTermo] = useState(false);
  const [usuario, setUsuario] = useState({});

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const val = await AsyncStorage.getItem('@usuario');
      if (val) setUsuario(JSON.parse(val));
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const aceiteTermos = () => {
    if (!checkTermo) return;
    setIsLoading(true);
    axios.post(`${Server.POST}setTermos`, { matricula: usuario.matricula })
      .then(() => {
        setIsLoading(false);
        navigation.navigate('Carteirinha');
      })
      .catch(() => {
        setIsLoading(false);
        showToast('Ocorreu um erro ao registrar os termos de compromisso.');
        navigation.navigate('Carteirinha');
      });
  };

  const showToast = (message) => {
    Platform.OS === "ios"
      ? Toast.show({ text: message, buttonText: 'Ok', type: "danger", duration: 3000 })
      : ToastAndroid.show(message, 3000);
  };

  return (
    <ImageBackground source={require('../../assets/fundoNovo.png')} style={styles.background}>
      <View style={styles.container}>
        <ScrollView nestedScrollEnabled>
          {isLoading ? (
            <SpinnerDrawer style={{ marginTop: 105 }} text="Carregando..." textColor="#000000" spinColor={ColorsScheme.MAIN_COLOR} />
          ) : (
            <>
              <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require('../../assets/Logo_MEDGLO_POS.png')} />
              </View>
              <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", padding: 10, color: ColorsScheme.ASENT_COLOR }}>
                TERMO DE COMPROMISSO
              </Text>
              <View style={styles.termsContainer}>
                <ScrollView nestedScrollEnabled>
                  <Text style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</Text>
                  <Form>
                    <Item style={styles.checkboxItem}>
                      <CheckBox
                        onPress={() => setCheckTermo(!checkTermo)}
                        checked={checkTermo}
                        color={ColorsScheme.MAIN_COLOR}
                      />
                      <Body>
                        <Text style={styles.checkboxText}>Li e aceito os termos de compromisso.</Text>
                      </Body>
                    </Item>
                  </Form>
                </ScrollView>
              </View>
              {checkTermo && (
                <View style={styles.buttonContainer}>
                  <Button small block style={styles.button} onPress={aceiteTermos}>
                    <Text style={styles.buttonText}>Prosseguir</Text>
                  </Button>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, width: '100%', height: '100%' },
  logoContainer: { padding: 20, marginTop: "10%", justifyContent: "center", alignItems: 'center' },
  logo: { marginBottom: 20 },
  title: { paddingTop: "10%", padding: 10, textAlign: 'center', fontWeight: 'bold', color: "#000000" },
  termsContainer: { backgroundColor: "#FFFFFF", margin: "5%", padding: "2%", maxHeight: 250 },
  text: { fontSize: 15 },
  checkboxItem: { borderColor: "#FFFFFF" },
  checkboxText: { fontSize: 13 },
  buttonContainer: { flex: 1, alignItems: "center", width: "100%" },
  button: { marginTop: 20, width: "40%", backgroundColor: ColorsScheme.MAIN_COLOR, alignSelf: "center", borderRadius: 20 },
  buttonText: { fontSize: 12, fontWeight: "bold" }
});

export default TermosScreen;