import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  Platform,
} from "react-native";
import {
  Container,
  Content,
  Text,
  Button,
  Card,
  CardItem,
  Body,
  Spinner,
  Root,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ColorsScheme from "../../settings/ColorsScheme";
import Server from "../../settings/Server";
import Base from "../../components/Base";
import HeaderGoBack from "../../components/HeaderGoBack";
import SemInformacao from "../../components/SemInformacao";

const ContratoScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [contratos, setContratos] = useState([]);
  const [user, setUser] = useState({});
  const data = navigation.getParam("data", []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@usuario");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          fetchContratos(parsedUser);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  const fetchContratos = async (user) => {
    if (data.matricula) {
      setIsLoading(true);
      try {
        const response = await fetch(`${Server.API}financeiro/getComponenteCadastral.asp?matricula=${data.matricula}`);
        const result = await response.json();
        setContratos(result);
      } catch (error) {
        console.error(error);
        Alert.alert("Ops!", "Algo deu errado.", [{ text: "OK" }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Root>
      <Container>
        <Base navigation={navigation}>
          <HeaderGoBack navigation={navigation} title={"Contratos"} />
          <Content style={{ marginBottom: 55, backgroundColor: "#FFFFFF" }}>
            {isLoading ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 105 }}>
                <Spinner color={ColorsScheme.MAIN_COLOR} />
                <Text style={{ color: "#000000", textAlign: "center" }}>Buscando...</Text>
              </View>
            ) : contratos.length > 0 ? (
              <View style={{ backgroundColor: "white", margin: 20, marginTop: 30 }}>
                <Card>
                  {contratos.map((item, index) => (
                    <CardItem style={{ marginTop: 13 }} bordered key={index}>
                      <Body>
                        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>{item.plano}</Text>
                        <Text style={{ fontSize: 12, marginBottom: 10 }}>CNS: {item.cns}</Text>
                        <Text style={{ fontSize: 12, marginBottom: 10 }}>ACOMODAÇÃO: {item.acomodacao}</Text>
                        <Text style={{ fontSize: 12, marginBottom: 10 }}>Cobertura: {item.cobertura}</Text>
                        <Text style={{ fontSize: 12, marginBottom: 10 }}>Data do contrato: {item.data_contrato}</Text>
                      </Body>
                    </CardItem>
                  ))}
                </Card>
                <Button
                  block
                  style={{ marginTop: 25, backgroundColor: ColorsScheme.MAIN_COLOR, margin: 7 }}
                  onPress={() => navigation.navigate("Contato")}
                >
                  <Text style={{ fontWeight: "bold" }}>Dúvidas? Fale com a MedicGLOBAL</Text>
                </Button>
              </View>
            ) : (
              <SemInformacao />
            )}
          </Content>
        </Base>
      </Container>
    </Root>
  );
};

export default ContratoScreen;