import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Appearance,
} from "react-native";
import {
  Container,
  Content,
  Text,
  Button,
  Root,
  Grid,
  Col,
  Item,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DatePicker from "react-native-date-picker";
import moment from "moment/min/moment-with-locales";
import ColorsScheme from "../../settings/ColorsScheme";
import Base from "../../components/Base";
import HeaderGoBack from "../../components/HeaderGoBack";

const Utilizacoes2Screen = ({ navigation }) => {
  const dados = navigation.getParam("data", []);
  const [chosenDateBegin, setChosenDateBegin] = useState(new Date());
  const [chosenDateEnd, setChosenDateEnd] = useState(new Date());
  const [isDateInitial, setIsDateInitial] = useState(false);
  const [isDateFinal, setIsDateFinal] = useState(false);
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
  }, []);

  const doloading = () => {
    if (chosenDateBegin && chosenDateEnd) {
      let DI = moment(chosenDateBegin).format("DD/MM/YYYY");
      let DF = moment(chosenDateEnd).format("DD/MM/YYYY");
      navigation.navigate("Utilizacoes", { dataInicio: DI, dataFim: DF, dados });
    } else {
      alert("Preencha todos os campos");
    }
  };

  const darkmode = Appearance.getColorScheme();

  return (
    <Root>
      <Container>
        <Base navigation={navigation}>
          <DatePicker
            modal
            open={isDateInitial}
            date={chosenDateBegin}
            onConfirm={(date) => {
              setChosenDateBegin(date);
              setIsDateInitial(false);
            }}
            onCancel={() => setIsDateInitial(false)}
            mode="date"
            minimumDate={new Date("2001-01-01")}
            maximumDate={new Date()}
            textColor={darkmode === "dark" ? "#FFFFFF" : "#000000"}
            confirmText="Confirmar"
            cancelText="Cancelar"
            title="Selecione a data"
            locale="pt"
          />

          <DatePicker
            modal
            open={isDateFinal}
            date={chosenDateEnd}
            onConfirm={(date) => {
              setChosenDateEnd(date);
              setIsDateFinal(false);
            }}
            onCancel={() => setIsDateFinal(false)}
            mode="date"
            minimumDate={new Date("2001-01-01")}
            maximumDate={new Date()}
            confirmText="Confirmar"
            textColor={darkmode === "dark" ? "#FFFFFF" : "#000000"}
            cancelText="Cancelar"
            title="Selecione a data"
            locale="pt"
          />

          <HeaderGoBack navigation={navigation} title={"Utilizações"} />
          <Content style={{ marginBottom: 55 }}>
            <View style={{ margin: 15, padding: 10 }}>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>INFORME O PERÍODO</Text>
              <Grid>
                <Col style={{ width: "50%" }}>
                  <Item style={{ marginTop: 20, alignSelf: "center" }}>
                    <TouchableOpacity onPress={() => setIsDateInitial(true)}>
                      <View
                        style={{
                          paddingHorizontal: "5%",
                          paddingVertical: "2%",
                          borderColor: ColorsScheme.GENERAL_BLACK,
                          borderWidth: 1,
                        }}
                      >
                        <Text style={{ fontSize: 14 }}>{moment(chosenDateBegin).format("DD/MM/YYYY")}</Text>
                      </View>
                    </TouchableOpacity>
                  </Item>
                </Col>

                <Col style={{ width: "50%" }}>
                  <Item style={{ marginTop: 20, alignSelf: "center" }}>
                    <TouchableOpacity onPress={() => setIsDateFinal(true)}>
                      <View
                        style={{
                          paddingHorizontal: "5%",
                          paddingVertical: "2%",
                          borderColor: ColorsScheme.GENERAL_BLACK,
                          borderWidth: 1,
                        }}
                      >
                        <Text style={{ fontSize: 14 }}>{moment(chosenDateEnd).format("DD/MM/YYYY")}</Text>
                      </View>
                    </TouchableOpacity>
                  </Item>
                </Col>
              </Grid>

              <Button
                style={{
                  marginTop: 25,
                  marginLeft: 180,
                  width: 140,
                  backgroundColor: ColorsScheme.MAIN_COLOR,
                  justifyContent: "center",
                }}
                onPress={doloading}
              >
                <Text> Localizar </Text>
              </Button>
            </View>
          </Content>
        </Base>
      </Container>
    </Root>
  );
};

export default Utilizacoes2Screen;