import React, { useState } from "react";
import {
  View,
  StatusBar,
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  Alert,
  ScrollView
} from "react-native";
import {
  Text,
  NativeBaseProvider,
  ArrowBackIcon,
  Input,
  Button,
  Icon,
  Spinner,
} from "native-base";
import ColorsScheme from "../../settings/ColorsScheme";
import { TextInputMask } from "react-native-masked-text";
import Server from "../../settings/Server";
import CryptoJS from "crypto-js";


const RecuperarSenha = ({ navigation }) => {
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [matricula, setMatricula] = useState("");
  const [nomeMae, setNomeMae] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const novaSenha = Math.random().toString(36).slice(-10);
  
  const recuperar = async () => {
    if (!cpf || !dataNascimento || !matricula || !nomeMae) {
      Alert.alert("Campo vazio!", "Preencha todos os campos e tente novamente.", [{ text: "OK" }], { cancelable: false });
      return;
    }
    setIsLoading(true);
    Keyboard.dismiss();
    
    try {
      const response = await fetch(`${Server.API}login/testeRecuperar.asp?matricula=${matricula}&cpf=${cpf}&datanascimento=${dataNascimento}`);
      const responseJson = await response.json();
      const nomeMaeCadastrado = responseJson.nome_mae.split(" ")[0];
      
      if (nomeMae.toUpperCase() === nomeMaeCadastrado) {
        const hashedSenha = await CryptoJS.SHA1(novaSenha).toString();
        await fetch(`${Server.API}login/testeUpdateRecuperaSenha.asp?matricula=${matricula}&senha=${hashedSenha}`);
        
        Alert.alert("Verifique seu e-mail", `Sua senha foi encaminhada para o e-mail ${responseJson.email}.`, [{ text: "OK", onPress: () => navigation.navigate("Login") }]);
      } else {
        Alert.alert("Nome da mãe incorreto!", "Nome da mãe não confere com o cadastrado.", [{ text: "OK" }]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Aviso", "Erro ao recuperar senha. Tente novamente.", [{ text: "OK" }]);
    }
    setIsLoading(false);
  };

  return (
    <NativeBaseProvider>
      <StatusBar backgroundColor={ColorsScheme.ASENT_COLOR} barStyle="light-content" />
      <ImageBackground source={require("../../assets/fundoNovo.png")} style={{ width: "100%", height: "100%", flex: 1 }}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Spinner color={ColorsScheme.MAIN_COLOR} />
            <Text style={{ color: "#000", textAlign: "center" }}>Enviando senha por email...</Text>
          </View>
        ) : (
          <ScrollView>
            <View style={{ padding: 20, marginTop: 50, justifyContent: "center", alignItems: "center" }}>
              <Image style={{ width: 200.6, height: 124 }} source={require("../../assets/Logo_MEDGLO_POS.png")} resizeMode="contain" />
            </View>
            <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", padding: 10, color: "#000000" }}>
              RECUPERAR SENHA
            </Text>
            <View style={{ padding: 10 }}>
              <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
                <Text>CPF:</Text>
                <TextInputMask 
                  type="cpf" 
                  style={{ 
                    width: "100%", 
                    fontSize: 14, 
                    color: "#000", 
                    borderWidth: 1, 
                    borderRadius: 5,
                    borderColor: "#c2c2c2"
                  }} 
                    value={cpf} 
                    onChangeText={setCpf} 
                    keyboardType="number-pad" 
                  />
              </View>
              <View style={{ flexDirection: "column", alignItems: "flex-start", paddingTop: 10 }}>
                <Text>Data de nascimento:</Text>
                <TextInputMask 
                  type="datetime" 
                  options={{ format: "DD/MM/YYYY" }} 
                  style={{ 
                    width: "100%", 
                    fontSize: 14, 
                    color: "#000",
                    borderWidth: 1, 
                    borderRadius: 5,
                    borderColor: "#c2c2c2"
                  }} 
                  value={dataNascimento} 
                  onChangeText={setDataNascimento} 
                />
              </View>
              <View style={{ flexDirection: "column", alignItems: "flex-start", paddingTop: 10 }}>
                <Text>Matrícula:</Text>
                <Input style={{ width: "100%", fontSize: 14, color: "#000" }} keyboardType="number-pad" onChangeText={setMatricula} />
              </View>
              <View style={{ flexDirection: "column", alignItems: "flex-start", paddingTop: 10 }}>
                <Text>Primeiro nome da mãe:</Text>
                <Input style={{ width: "100%", fontSize: 14, color: "#000" }} onChangeText={setNomeMae} />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <Button style={{ margin: 10, backgroundColor: ColorsScheme.ASENT_COLOR, borderRadius: 20 }}  onPress={recuperar}>
                  <Text style={{
                    color: "#FFFFFF"
                  }}>
                    Enviar
                  </Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        )}
      </ImageBackground>
      <Button 
        onPress={() => navigation.goBack()} 
        style={{ position: "absolute", top: Platform.OS === "ios" ? 15 : 0, backgroundColor: "transparent"}}
      >
        <ArrowBackIcon size="5" mt="0.5" color="#000000" />
      </Button>
    </NativeBaseProvider>
  );
};

export default RecuperarSenha;