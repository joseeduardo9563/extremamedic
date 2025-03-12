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
  Card,
  CardItem,
  Body,
  Spinner,
  Root,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ColorsScheme from "../../settings/ColorsScheme";
import Server from "../../settings/Server";
import Base from "../../components/Base";
import HeaderGoBack from "../../components/HeaderGoBack";

const UtilizacoesScreen = ({ navigation }) => {
  const dados = navigation.getParam("dados", []);
  const dataI = navigation.getParam("dataInicio", "");
  const dataF = navigation.getParam("dataFim", "");
  
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@usuario");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
    fetchUtilizacoes();
  }, []);

  const fetchUtilizacoes = async () => {
    if (dados.matricula) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${Server.API}financeiro/getUtilizacaoServicos.asp?matricula=${dados.matricula}&datainicial=${dataI}&datafinal=${dataF}`
        );
        const result = await response.json();
        setData(result);
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
          <HeaderGoBack navigation={navigation} title={"Utilizações"} />
          <Content style={{ marginBottom: 55 }}>
            {isLoading ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 105 }}>
                <Spinner color={ColorsScheme.MAIN_COLOR} />
                <Text style={{ color: "#000000", textAlign: "center" }}>Buscando...</Text>
              </View>
            ) : data.length > 0 ? (
              <View style={{ margin: 20, marginTop: 5 }}>
                <Text style={{ fontSize: 14, marginTop: 25, marginBottom: 23 }}>
                  Relatório de utilização por período
                </Text>
                <Card>
                  {data.map((item, index) => (
                    <CardItem style={{ marginBottom: 0 }} bordered key={index}>
                      <Body>
                        <Text style={{ fontSize: 12 }}>{item.data_execucao}</Text>
                        <Text style={{ fontSize: 14, fontWeight: "bold" }}>{item.procedimento}</Text>
                        <Text style={{ fontSize: 12 }}>{item.nome_beneficiario}</Text>
                        <Text style={{ fontSize: 12 }}>Matrícula: {item.matricula}</Text>
                        <Text style={{ fontSize: 12 }}>{item.nome_fantasia}</Text>
                        <Text style={{ fontSize: 12 }}>Guia: {item.numero_guia}</Text>
                      </Body>
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
          </Content>
        </Base>
      </Container>
    </Root>
  );
};

export default UtilizacoesScreen;
