import React, { useState } from "react";
import {
  View,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
  Alert,
  ScrollView,
  Keyboard,
  Platform,
} from "react-native";
import {
  Text,
  NativeBaseProvider,
  Form,
  Item,
  Input,
  Button,
  Icon,
} from "native-base";
import axios from "axios";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ColorsScheme from "../../settings/ColorsScheme";
import Server from "../../settings/Server";
import CryptoJS from "crypto-js";


const LoginScreen = ({ navigation }) => {
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  const [isSecurity, setIsSecurity] = useState(true);

  const getAceite = async (matricula) => {
    try {
      const response = await axios.get(`${Server.GET}getTermoAceite/${matricula}`);
      if (response.data && response.data.flag_termo === 1) {
        navigation.navigate("Carteirinha");
      } else {
        navigation.navigate("Termos");
      }
    } catch (error) {
      console.error(error);
      navigation.navigate("Carteirinha");
    }
  };

  const onSubmit = async () => {
    if (matricula !== "" && senha !== "") {
      Keyboard.dismiss();
      try {
        const hash = await CryptoJS.SHA1(senha).toString();
        const url = `${Server.API}login/autenticate.asp?matricula=${matricula}&senha=${hash}`;
        const response = await fetch(url);
        const responseJson = await response.json();

        if (responseJson.didFind) {
          await AsyncStorage.setItem("@usuario", JSON.stringify(responseJson));
          navigation.navigate("Carteirinha");
        } else {
          Alert.alert("Matrícula ou senha inválidos.", "Verifique os dados e tente novamente.", [{ text: "Tentar novamente" }], { cancelable: false });
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Ops! Algo deu errado.", "Tente novamente mais tarde.", [{ text: "OK" }], { cancelable: false });
      }
    } else {
      Alert.alert("Campo vazio.", "Preencha todos os campos e tente novamente.", [{ text: "OK" }], { cancelable: false });
    }
  };

  return (
    <NativeBaseProvider>
      <StatusBar backgroundColor={ColorsScheme.ASENT_COLOR} barStyle="light-content" />
      <ImageBackground source={require("../../assets/fundoNovo.png")} style={{ width: "100%", height: "100%", flex: 1 }}>
        <ScrollView style={{ width: "100%" }}>
          <View style={{ padding: 20, marginTop: 50, justifyContent: "center", alignItems: "center" }}>
            <Image style={{ width: 200.6, height: 124 }} source={require("../../assets/Logo_MEDGLO_POS.png")} resizeMode="contain" />
          </View>
          <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", padding: 10, color: ColorsScheme.ASENT_COLOR }}>
            AUTENTICAÇÃO
          </Text>
          <ScrollView>
            <View style={{ padding: 10 }}>
              <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
                <Text style={{ marginBottom: -13 }}>Matrícula:</Text>
                <Input style={{ width: "100%", marginTop: 10, marginBottom: -10, color: "#000000" }} keyboardType="number-pad" onChangeText={setMatricula} />
              </View>
              <View style={{ flexDirection: "column", alignItems: "flex-start", paddingTop: 10 }}>
                <Text style={{ marginBottom: -13 }}>Senha:</Text>
                <Input secureTextEntry={isSecurity} style={{ width: "80%", marginTop: 10, marginBottom: -10, color: "#000000" }} onChangeText={setSenha} autoCapitalize="none" />
                <FontAwesome5
                  name={isSecurity ? "eye" : "eye-slash"}
                  style={{ color: ColorsScheme.ASENT_COLOR, fontSize: 25, marginTop: -20, position: "relative", left: "85%" }}
                  onPress={() => setIsSecurity(!isSecurity)}
                />
              </View>
              <Button style={{ margin: 10, backgroundColor: ColorsScheme.ASENT_COLOR,  borderRadius: 10 }} block onPress={onSubmit}>
                <Text>Entrar</Text>
              </Button>
              <Button style={{ margin: 10, backgroundColor: ColorsScheme.ASENT_COLOR, borderRadius: 10 }} block onPress={() => navigation.navigate("PrimeiroAcesso")}>
                <Text>Primeiro acesso</Text>
              </Button>
              <TouchableOpacity onPress={() => navigation.navigate("RecuperarSenha")}> 
                <Text style={{ color: ColorsScheme.ASENT_COLOR, fontSize: 15, marginTop: 20, alignSelf: "center" }}>Recuperar senha</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ScrollView>
      </ImageBackground>
      <Button transparent onPress={() => navigation.goBack()} style={{ position: "absolute", top: Platform.OS === "ios" ? 15 : 0 }}>
        <Icon name="arrow-back" style={{ color: "black" }} />
      </Button>
    </NativeBaseProvider>
  );
};

export default LoginScreen;