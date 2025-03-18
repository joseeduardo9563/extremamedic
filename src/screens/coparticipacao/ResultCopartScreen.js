import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  Platform,
  ToastAndroid,
  ScrollView
} from "react-native";
import {
  Container,
  Content,
  Text,
  Button,
  Card,
  Body,
  NativeBaseProvider,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import numeral from "numeral";
import ColorsScheme from "../../settings/ColorsScheme";
import Server from "../../settings/Server";
import Base from "../../components/Base";
import HeaderGoBack from "../../components/HeaderGoBack";
import SemInformacao from "../../components/SemInformacao";
import SpinnerDrawer from "../../components/Spinner";

const ResultCopartScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFail, setIsFail] = useState(false);
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const params = navigation.state.params || {};

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@usuario");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          getNomeEmpresa(params.empresa);
          fetchData(parsedUser);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  const fetchData = async (user) => {
    setIsLoading(true);
    let url = `${Server.API}coparticipacao/getCoparticipacao.asp?matricula=${user.matricula}&empresa=${params.empresa}&mesinicio=${params.mesInicio}/${params.anoInicio}&mesfim=${params.mesFim}/${params.anoFim}&tipo=${params.tipo}`;
    
    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
      setIsFail(false);
    } catch (error) {
      console.error(error);
      setIsFail(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getNomeEmpresa = async (empresa) => {
    try {
      const response = await fetch(`${Server.API}coparticipacao/getEmpresaById.asp?empresa=${empresa}`);
      const result = await response.json();
      setNomeEmpresa(result.nome_empresa);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <NativeBaseProvider>
      <Container>
        <Base navigation={navigation}>
          <HeaderGoBack navigation={navigation} title={"Coparticipação"} />
          <ScrollView style={{ marginBottom: 55 }}>
            {isLoading ? (
              <SpinnerDrawer text="Carregando..." textColor="#000000" spinColor={ColorsScheme.MAIN_COLOR} />
            ) : isFail ? (
              <SemInformacao error={true} />
            ) : data.length > 0 ? (
              <View style={{ margin: "4%", marginTop: 5 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 25 }}>
                  RELATÓRIO DE GUIAS DE COPARTICIPAÇÃO COBRADAS EM NF
                </Text>
                <Text style={{ fontSize: 14, marginBottom: 23 }}>
                  Período de {params.mesInicio}/{params.anoInicio} a {params.mesFim}/{params.anoFim}
                </Text>
                <Text style={{ fontSize: 14, marginBottom: 20 }}>{nomeEmpresa}</Text>
                {data.map((d, index) => (
                  <Card key={index}>
                    <CardItem bordered>
                      <Body>
                        <Text style={{ fontWeight: "bold" }}>Número guia: {d.numero_guia}</Text>
                        {d.procedimentos.map((item, i) => (
                          <View key={i}>
                            <Text>{item.procedimento}</Text>
                            <Text>Matrícula: {item.matricula}</Text>
                            <Text>Total: {numeral(item.total_cobranca).format("$ 0,0.00")}</Text>
                          </View>
                        ))}
                      </Body>
                    </CardItem>
                  </Card>
                ))}
              </View>
            ) : (
              <SemInformacao />
            )}
          </ScrollView>
        </Base>
      </Container>
    </NativeBaseProvider>
  );
};

export default ResultCopartScreen;