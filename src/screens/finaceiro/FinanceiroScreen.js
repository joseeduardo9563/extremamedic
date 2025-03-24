import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  Platform,
  TouchableOpacity,
  ToastAndroid,
  Clipboard,
  ScrollView
} from "react-native";
import {
  Container,
  Text,
  Card,
  CardItem,
  Body,
  Spinner,
  NativeBaseProvider,
  Badge,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment/min/moment-with-locales";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ColorsScheme from "../../settings/ColorsScheme";
import Server from "../../settings/Server";
import Base from "../../components/Base";
import HeaderGoBack from "../../components/HeaderGoBack";

const FinanceiroScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [boletos, setBoletos] = useState([]);
  const [user, setUser] = useState({});
  const [dataHoje, setDataHoje] = useState("");
  const data = navigation.getParam("data", []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@usuario");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          fetchBoletos(parsedUser);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
    setDataHoje(moment().format("DD/MM/YYYY"));
  }, []);

  const fetchBoletos = async (user) => {
    if (data.matricula) {
      setIsLoading(true);
      try {
        const response = await fetch(`${Server.API}financeiro/getBoletoBancario.asp?matricula=${data.matricula}`);
        const result = await response.json();
        setBoletos(result);
      } catch (error) {
        console.error(error);
        Alert.alert("Ops!", "Algo deu errado.", [{ text: "OK" }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const copyToClipboard = (item) => {
    Clipboard.setString(item);
    Platform.OS === "ios"
      ? Toast.show({ text: "Copiado com sucesso", buttonText: "Ok", type: "success", duration: 3000 })
      : ToastAndroid.show("Copiado com sucesso", 3000);
  };

  return (
    <NativeBaseProvider>
      <Base navigation={navigation}>
        <HeaderGoBack navigation={navigation} title={"Segunda via"} />
        <ScrollView style={{ marginBottom: 55 }}>
          {isLoading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 105 }}>
              <Spinner color={ColorsScheme.MAIN_COLOR} />
              <Text style={{ color: "#000000", textAlign: "center" }}>Buscando...</Text>
            </View>
          ) : boletos.length > 0 ? (
            <View style={{ backgroundColor: "white", margin: 20, marginTop: 30 }}>
              <Card>
                {boletos.map((item, index) => (
                  <CardItem style={{ marginTop: 13 }} bordered key={index}>
                    <Body>
                      <Text style={{ marginBottom: 10, fontWeight: "bold" }}>
                        {moment(item.mes_referencia).format("MMMM/YYYY")}
                      </Text>
                      <Text style={{ fontSize: 16, marginBottom: 10 }}>R$ {item.valor_duplicata}</Text>
                      <Text style={{ fontSize: 12, marginBottom: 10 }}>Vencimento: {item.vencimento_duplicata}</Text>
                      <TouchableOpacity onPress={() => copyToClipboard(item.linha_digitavel)}>
                        <Text style={{ color: "#A9A9A9" }}>Copiar linha digitável</Text>
                      </TouchableOpacity>
                    </Body>
                    <Badge
                      style={{
                        backgroundColor: dataHoje < item.vencimento_duplicata ? "#f2d600" : "#ec1a07",
                        position: "relative",
                        marginRight: -25,
                      }}
                    >
                      <Text style={{ color: dataHoje < item.vencimento_duplicata ? "#000000" : "#FFFFFF" }}>
                        {dataHoje < item.vencimento_duplicata ? "A vencer" : "Vencido"}
                      </Text>
                    </Badge>
                    <TouchableOpacity onPress={() => copyToClipboard(item.linha_digitavel)}>
                      <FontAwesome5 name={"copy"} style={{ fontSize: 20 }} />
                    </TouchableOpacity>
                  </CardItem>
                ))}
              </Card>
            </View>
          ) : (
            <View style={{ marginTop: 30, alignItems: "center", justifyContent: "center" }}>
              <FontAwesome5 name="exclamation-circle" size={50} color="#a0a0a0" />
              <Text style={{ textAlign: "center", marginTop: 10, color: "#a0a0a0" }}>
                Não há informação a ser exibida.
              </Text>
            </View>
          )}
        </ScrollView>
      </Base>
    </NativeBaseProvider>
  );
};

export default FinanceiroScreen;