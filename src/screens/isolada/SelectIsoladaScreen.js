import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import {
  Button,
  Text,
} from "native-base";
import ColorsScheme from "../../settings/ColorsScheme";
import SpinnerDrawer from "../../components/Spinner";
import SemInformacao from "../../components/SemInformacao";
import Base from "../../components/Base";
import HeaderGoBack from "../../components/HeaderGoBack";
import Server from "../../settings/Server";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const SelectIsoladaScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFail, setIsFail] = useState(false);

  const fetchData = async (url, type, subTitle, screen = "EscolhaIsolada") => {
    setIsLoading(false);
    try {
      const response = await fetch(url);
      const result = await response.json();
      navigation.navigate(screen, { data: result, type, subTitle });
    } catch (error) {
      console.error(error);
      setIsFail(true);
    } finally {
      setIsLoading(true);
    }
  };

  return (
    <Base navigation={navigation}>
      <HeaderGoBack navigation={navigation} title={"Rede Credenciada"} />
      {isLoading ? (
        <ScrollView style={{ marginBottom: 55, marginRight: 20 }}>
          <View style={{ margin: 20 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", textAlign: "center", padding: 10, color: ColorsScheme.ASENT_COLOR }}>
              BUSCA ISOLADA
            </Text>
            <Text style={{ fontSize: 12 }}>
              Selecione abaixo o tipo de busca que deseja realizar
            </Text>
          </View>
          {[
            { label: "Por Plano", type: "Plano", url: "isolada/getPlano.asp" },
            { label: "Por Nome", type: "Nome", url: "isolada/GetNome.asp" },
            { label: "Por Especialidade", type: "Especialidade", url: "isolada/getAllEspecialidade.asp" },
            { label: "Por Região", type: "Regiao", url: "isolada/getRegiaoEstado.asp" },
            { label: "Por Qualificação", type: "Qualificacao", url: "isolada/getAllQualificacao.asp" },
            { label: "Por Urgência/Emergência", type: "Urgencia", url: "isolada/getAllUrgencia.asp", screen: "ResultadoBusca" },
          ].map((item, index) => (
            <Button
              key={index}
              onPress={() => fetchData(`${Server.API}${item.url}`, item.type, `Pesquisa por ${item.label.split(" ")[1]}`, item.screen)}
              primary
              iconRight
              style={{ margin: 10, width: "100%", marginLeft: 10, backgroundColor: ColorsScheme.ASENT_COLOR }}
            >
              <Text>{item.label}</Text>
              <FontAwesome5 name={"angle-right"} style={{ color: "#fff", fontSize: 20, paddingRight: 20 }} />
            </Button>
          ))}
        </ScrollView>
      ) : isFail ? (
        <SemInformacao error={true} />
      ) : (
        <SpinnerDrawer text="Carregando..." textColor="#000000" spinColor={ColorsScheme.MAIN_COLOR} />
      )}
    </Base>
  );
};

export default SelectIsoladaScreen;