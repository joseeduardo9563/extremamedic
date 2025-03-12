import React, { useState, useEffect } from "react";
import { View, AppState } from "react-native";
import {
  Content,
  Button,
  Text,
  H2,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Base from "../../components/Base";
import HeaderGoBack from "../../components/HeaderGoBack";

const PerfilScreen = ({ navigation }) => {
  const [usuario, setUsuario] = useState({ nome: "", email: "", nascimento: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@usuario");
        if (storedUser) {
          setUsuario(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();

    const handleAppStateChange = (nextAppState) => {
      console.log(nextAppState);
      navigation.navigate("Carteirinha");
    };

    AppState.addEventListener("change", handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
    };
  }, []);

  const sair = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Base navigation={navigation}>
      <HeaderGoBack title="Perfil" navigation={navigation} />
      <Content style={{ padding: 20 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesome5
            name="user"
            solid
            style={{ fontSize: 120, color: "#f2f2f2", marginTop: 50 }}
          />
        </View>

        <H2 style={{ textAlign: "center", marginTop: 20 }}>{usuario.nome}</H2>
        <Text style={{ textAlign: "center", marginTop: 20 }}>{usuario.email}</Text>
        <Text style={{ textAlign: "center", marginTop: 10 }}>{usuario.nascimento}</Text>

        <Button
          block
          style={{ marginTop: 30, marginHorizontal: 20 }}
          onPress={() => navigation.navigate("AlterarSenha")}
        >
          <Text style={{ fontSize: 12 }}>Alterar senha</Text>
        </Button>

        <Button
          block
          danger
          style={{ marginTop: 20, marginHorizontal: 20 }}
          onPress={sair}
        >
          <Text style={{ fontSize: 12 }}>Sair</Text>
        </Button>
      </Content>
    </Base>
  );
};

export default PerfilScreen;