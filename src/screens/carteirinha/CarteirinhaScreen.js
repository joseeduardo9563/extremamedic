import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  ImageBackground,
  Platform,
  Text,
  Keyboard,
  Alert
} from "react-native";
import { Spinner, Button, NativeBaseProvider } from "native-base";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Swiper from "react-native-swiper";
import ColorsScheme from "../../settings/ColorsScheme";
import Server from "../../settings/Server";
import Base from "../../components/Base";
import HeaderGoBack from "../../components/HeaderGoBack";
import MyFooter from "../../components/MyFooter";

const CarteirinhaScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [contratos, setContratos] = useState([]);
  const [istitular, setIstitular] = useState(false);
  const [dependentes, setDependentes] = useState([]);
  const [selectDependente, setSelectDependente] = useState("key0");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("@usuario");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchCarteirinha(parsedUser.matricula);
        fetchDependentes(parsedUser.matricula);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCarteirinha = async (matricula) => {
    setIsLoading(true);
    Keyboard.dismiss();
    try {
      const response = await fetch(`${Server.API}financeiro/getComponenteCadastral.asp?matricula=${matricula}`);
      const data = await response.json();
      setContratos(data);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const fetchDependentes = async (matricula) => {
    try {
      const response = await fetch(`${Server.API}financeiro/getComponenteCadastralTitular.asp?matricula=${matricula}`);
      const data = await response.json();
      setIstitular(true);
      setDependentes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderCarteirinha = () => (
    <>
      <View style={{ width: "100%", height: "100%" }}>
        <ImageBackground
          source={contratos.find(x => [45, 46, 47, 48, 49, 50].includes(x.cod_plano))
            ? require("../../assets/medicGlobal.png")
            : require("../../assets/extremamedic_carteirinhafrente.png")}
          style={{
            width: "92%",
            height: "100%",
            maxHeight: 600,
            flex: 1,
            justifyContent: "center",
            marginLeft: "5%",
            marginTop: 5,
            marginBottom: "2%",
          }}
          imageStyle={{ borderRadius: 25 }}
        >
          {contratos.map((item, index) => (
            <View key={index} style={{
              transform: [{ rotate: "270deg" }],
              width: "140%",
              height: "70%",
              position: "relative",
              right: "7%"
            }}>
              <Text style={{ fontWeight: "bold", fontSize: 22, marginTop: "8%", color: "#FFFFFF", textAlign: "right", marginRight: "5%" }}>
                {item.matricula}
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: 18, color: "#FFFFFF", marginTop: "5%", marginLeft: "2%" }}>
                {item.nome_beneficiario}
              </Text>
              <Text style={{ fontSize: 13, marginLeft: "2%" }}>Empresa:</Text>
              <Text style={{ fontWeight: "bold", fontSize: 15, color: "#FFFFFF", marginLeft: "2%" }}>
                {item.nome_empresa}
              </Text>
              <Text style={{ fontSize: 13, marginLeft: "2%" }}>Plano:</Text>
              <Text style={{ fontWeight: "bold", fontSize: 15, color: "#FFFFFF", marginLeft: "2%" }}>
                {item.plano}
              </Text>
            </View>
          ))}
        </ImageBackground>
      </View>
    </>
  );

  return (
    <NativeBaseProvider>
      <HeaderGoBack navigation={navigation} title={"Cartão Virtual"} ishome={true} />
      <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <ScrollView>
          {isLoading ? (
            <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 105 }}>
              <View style={{ flexDirection: "column" }}>
                <Spinner size={85} color={ColorsScheme.MAIN_COLOR} />
                <Text style={{ color: "#000000", textAlign: "center" }}>Buscando...</Text>
              </View>
            </View>
          ) : contratos.length > 1 ? (
            <View style={{ backgroundColor: "white", margin: 20, marginTop: 30 }}>
              <Text style={{ marginBottom: 25, color: "#000000" }}>
                Selecione abaixo o plano para acessar o cartão virtual.
              </Text>
              {contratos.map((item, index) => (
                <Button key={index} bordered onPress={() => navigation.navigate("Carteirinha_2", { contratos: item })}>
                  <Text style={{ fontSize: 16, marginBottom: 10, fontWeight: "bold", color: "#000000" }}>{item.plano}</Text>
                </Button>
              ))}
            </View>
          ) : (

            <>
              {istitular && (
                <>
                  <Text style={{ fontSize: 12, marginLeft: "4%"}}>Dependentes</Text>
                  <Picker
                    selectedValue={selectDependente}
                    onValueChange={(val) => {
                      setSelectDependente(val);
                      fetchCarteirinha(val);
                    }}
                    style={{ width: "100%", color: "black" }}
                  >
                    <Picker.Item label="Dependentes" value="key0" />
                    <Picker.Item label="Titular" value={user.matricula} />
                    {dependentes
                      .filter((item) => item !== user.matricula)
                      .map((item, index) => (
                        <Picker.Item key={index} label={item.nome_beneficiario} value={item.matricula} />
                      ))}
                  </Picker>
                </>
              )}
              <Swiper>
                {renderCarteirinha()}
              </Swiper>
            </>
          )}


        </ScrollView>
      </View>
      <MyFooter openModal={() => setIsVisible(true)} navigation={navigation} />
    </NativeBaseProvider>
  );
};

export default CarteirinhaScreen;
