import React, { useState, useEffect } from "react";
import {
  View,
} from "react-native";
import {
  Container,
  Content,
  Text,
  Card,
  CardItem,
  Body,
  Spinner,
  Form,
  Picker,
  Button,
  H3,
  Input,
} from "native-base";
import axios from "axios";
import ColorsScheme from "../../settings/ColorsScheme";
import SemInformacao from "../../components/SemInformacao";
import Base from "../../components/Base";
import HeaderGoBack from "../../components/HeaderGoBack";
import Server from "../../settings/Server";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const EscolhaIsoladaScreen = ({ navigation }) => {
  const data = navigation.getParam("data", []);
  const type = navigation.getParam("type", "nenhum");
  const subTitle = navigation.getParam("subTitle", "nenhum");

  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [selectedEstado, setSelectedEstado] = useState("key0");
  const [selectedCidade, setSelectedCidade] = useState("key0");
  const [selectedBairro, setSelectedBairro] = useState("key0");
  const [cidades, setCidades] = useState([]);
  const [bairros, setBairros] = useState([]);
  const [isButtonEnable, setIsButtonEnable] = useState(false);

  const doFilter = (txt) => {
    const filtered = data.filter((item) =>
      item.nome.toUpperCase().includes(txt.toUpperCase())
    );
    setFilteredData(filtered);
  };

  const doSearchByType = (id) => {
    setIsLoading(true);
    let url = "";

    switch (type) {
      case "Plano":
        url = `${Server.API}isolada/getAllFromPlano.asp?plano=${id}`;
        break;
      case "Nome":
        url = `${Server.API}isolada/getProfByidNome.asp?codigo_profissional=${id}`;
        break;
      case "Especialidade":
        url = `${Server.API}isolada/getProficionalByEspecialidade.asp?especialidade=${id}`;
        break;
      case "Qualificacao":
        url = `${Server.API}isolada/getQualificacaoByQualicacao.asp?qualificacao=${id}`;
        break;
      default:
        setIsLoading(false);
        return;
    }

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        setIsLoading(false);
        navigation.navigate("ResultadoBusca", {
          data: responseJson,
          title: "Resultados",
          subTitle: "Abaixo os resultados da pesquisa",
          isolada: true,
        });
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  return (
    <Base navigation={navigation}>
      <HeaderGoBack navigation={navigation} title={"Rede Credenciada"} />
      {isLoading ? (
        <Spinner />
      ) : (
        <View style={{ margin: 20 }}>
          <H3 style={{ fontWeight: "bold", color: ColorsScheme.ASENT_COLOR }}>
            BUSCA ISOLADA
          </H3>
          <Text style={{ fontSize: 12 }}>{subTitle}</Text>
          <Content style={{ padding: 20 }}>
            <Card style={{ marginBottom: 20 }}>
              <Input
                placeholder="Filtro"
                style={{ fontSize: 12, color: "#000000" }}
                onChangeText={(txt) => doFilter(txt)}
              />
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <CardItem
                    key={index}
                    bordered
                    button
                    onPress={() => doSearchByType(item.id)}
                  >
                    <Body>
                      <Text style={{ fontSize: 12 }}>{item.nome}</Text>
                    </Body>
                  </CardItem>
                ))
              ) : (
                <SemInformacao />
              )}
            </Card>
          </Content>
        </View>
      )}
    </Base>
  );
};

export default EscolhaIsoladaScreen;