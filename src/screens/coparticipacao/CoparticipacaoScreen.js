import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
  Platform,
  ToastAndroid,
} from "react-native";
import {
  Container,
  Content,
  Text,
  Button,
  Picker,
  Toast,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ColorsScheme from "../../settings/ColorsScheme";
import Server from "../../settings/Server";
import moment from "moment/min/moment-with-locales";
import Base from "../../components/Base";
import HeaderGoBack from "../../components/HeaderGoBack";

const CoparticipacaoScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [anos, setAnos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [selectEmpresa, setSelectEmpresa] = useState("key0");
  const [selectAnoInicio, setSelectAnoInicio] = useState("key0");
  const [selectAnoFim, setSelectAnoFim] = useState("key0");
  const [selectTipo, setSelectTipo] = useState("key0");
  const [buttonDisable, setButtonDisable] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@usuario");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          getEmpresas(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, []);

  const getEmpresas = (user) => {
    setIsLoading(true);
    fetch(`${Server.API}coparticipacao/getEmpresaCopart.asp?matricula=${user.matricula}`)
      .then((response) => response.json())
      .then((res) => {
        setEmpresas(res);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const getAnos = () => {
    if (selectEmpresa !== "key0") {
      fetch(`${Server.API}coparticipacao/getAnosCopart.asp?matricula=${user.matricula}&empresa=${selectEmpresa}`)
        .then((response) => response.json())
        .then((res) => {
          setAnos(res);
        })
        .catch((error) => console.error(error));
    }
  };

  const onSubmit = () => {
    if (selectEmpresa === "key0") {
      showToast("Informe a empresa para continuar a busca.");
      return;
    }
    if (selectAnoInicio === "key0" || selectAnoFim === "key0") {
      showToast("Informe o período inicial e final para a busca.");
      return;
    }
    if (selectTipo === "key0") {
      showToast("Informe o tipo da guia.");
      return;
    }
    navigation.navigate("ResultCopart", {
      empresa: selectEmpresa,
      anoInicio: selectAnoInicio,
      anoFim: selectAnoFim,
      tipo: selectTipo,
    });
  };

  const showToast = (message) => {
    Platform.OS === "ios"
      ? Toast.show({ text: message, buttonText: "Ok", type: "danger", duration: 3000 })
      : ToastAndroid.show(message, 3000);
  };

  return (
    <Container>
      <Base navigation={navigation}>
        <HeaderGoBack navigation={navigation} title={"Coparticipação"} />
        <Content style={{ marginBottom: 55 }}>
          <View style={{ flex: 1, margin: "4%", padding: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Informe os dados abaixo para prosseguir
            </Text>
            <Picker
              selectedValue={selectEmpresa}
              onValueChange={(val) => {
                setSelectEmpresa(val);
                setButtonDisable(true);
                getAnos();
              }}
            >
              <Picker.Item label="Selecione a empresa..." value="key0" />
              {empresas.map((item, index) => (
                <Picker.Item key={index} label={item.nome_empresa} value={item.cod_empresa} />
              ))}
            </Picker>

            <Picker
              selectedValue={selectAnoInicio}
              onValueChange={(val) => setSelectAnoInicio(val)}
            >
              <Picker.Item label="Selecione o ano inicial..." value="key0" />
              {anos.map((item, index) => (
                <Picker.Item key={index} label={item.ano} value={item.value} />
              ))}
            </Picker>

            <Picker
              selectedValue={selectAnoFim}
              onValueChange={(val) => setSelectAnoFim(val)}
            >
              <Picker.Item label="Selecione o ano final..." value="key0" />
              {anos.map((item, index) => (
                <Picker.Item key={index} label={item.ano} value={item.value} />
              ))}
            </Picker>

            <Picker
              selectedValue={selectTipo}
              onValueChange={(val) => {
                setSelectTipo(val);
                setButtonDisable(false);
              }}
            >
              <Picker.Item label="Selecione o tipo de guia..." value="key0" />
              <Picker.Item label="Todos" value="Todos" />
              {tipos.map((item, index) => (
                <Picker.Item key={index} label={item.tipo_guia} value={item.value} />
              ))}
            </Picker>

            <Button
              style={{ backgroundColor: buttonDisable ? "#a3a3a3" : ColorsScheme.MAIN_COLOR }}
              disabled={buttonDisable}
              onPress={onSubmit}
            >
              <Text>Buscar</Text>
            </Button>
          </View>
        </Content>
      </Base>
    </Container>
  );
};

export default CoparticipacaoScreen;
