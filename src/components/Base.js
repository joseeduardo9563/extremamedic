import "react-native-gesture-handler"; // 🔥 Import necessário para o Drawer
import React, { useState } from "react";
import { View, Linking } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { NativeBaseProvider, Text } from "native-base";
import { Button, Overlay } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import ColorsScheme from "../settings/ColorsScheme";
import Share from "react-native-share";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MyFooter from "./MyFooter";
import SideBar from "./SiderBar";

const Drawer = createDrawerNavigator();

const Base = ({ navigation, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleIR, setIsVisibleIR] = useState(false);

  const openModal = () => setIsVisible(true);
  const closeModal = () => setIsVisible(false);
  const openModalIR = () => setIsVisibleIR(true);
  const closeModalIR = () => setIsVisibleIR(false);

  const handleOpenIR = async () => {
    closeModalIR();
    const val = await AsyncStorage.getItem("@usuario");
    if (val) {
      const usuario = JSON.parse(val);
      const url = `http://serpram.com.br/app_json/Saude/IR/IRvisualizar.asp?matricula=${usuario.matricula}&autenticacao=${usuario.senha.substring(
        0,
        10
      )}&ano=${new Date().getFullYear() - 1}`;

      Linking.openURL(url);
    }
  };

  const handleShareIR = async () => {
    closeModalIR();
    const val = await AsyncStorage.getItem("@usuario");
    if (val) {
      const usuario = JSON.parse(val);
      const url = `http://serpram.com.br/app_json/Saude/IR/IRvisualizar.asp?matricula=${usuario.matricula}&autenticacao=${usuario.senha.substring(
        0,
        10
      )}&ano=${new Date().getFullYear() - 1}`;

      await Share.open({
        title: "IR Extremamedic",
        message: "IR Extremamedic",
        url,
        subject: "IR Extremamedic",
      });
    }
  };

  return (
    <NativeBaseProvider>
      <Drawer.Navigator
        drawerContent={(props) => (
          <SideBar {...props} openModal={openModal} openModalIR={openModalIR} />
        )}
      >
        <Drawer.Screen name="Main">
          {() => (
            <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
              {/* 🔹 Modal Imposto de Renda */}
              <Overlay isVisible={isVisibleIR} width="auto" height="auto" onBackdropPress={closeModalIR}>
                <View style={{ padding: 20 }}>
                  <Text style={{ fontWeight: "bold", color: "#444", textAlign: "center", fontSize: 19 }}>
                    Imposto de Renda
                  </Text>
                  <Button
                    buttonStyle={{ margin: 10, backgroundColor: ColorsScheme.MAIN_COLOR, marginTop: 30, width: 200 }}
                    titleStyle={{ color: "#fff" }}
                    onPress={handleOpenIR}
                    title="Abrir"
                  />
                  <Button
                    buttonStyle={{ margin: 10, backgroundColor: ColorsScheme.MAIN_COLOR }}
                    titleStyle={{ color: "#fff" }}
                    onPress={handleShareIR}
                    title="Compartilhar"
                  />
                </View>
              </Overlay>

              {/* 🔹 Modal Rede Credenciada */}
              <Overlay isVisible={isVisible} width="auto" height="auto" onBackdropPress={closeModal}>
                <View style={{ padding: 20 }}>
                  <Icon name="user-md" style={{ fontSize: 50, textAlign: "center", color: "#444" }} />
                  <Text style={{ fontWeight: "bold", color: "#444", textAlign: "center", fontSize: 19 }}>
                    REDE CREDENCIADA
                  </Text>
                  <Button
                    buttonStyle={{ margin: 10, backgroundColor: ColorsScheme.MAIN_COLOR, marginTop: 30, width: 200 }}
                    titleStyle={{ color: "#fff" }}
                    onPress={() => {
                      closeModal();
                      navigation.navigate("SelectCombinada");
                    }}
                    title="Busca Combinada"
                  />
                  <Button
                    buttonStyle={{ margin: 10, backgroundColor: ColorsScheme.MAIN_COLOR }}
                    titleStyle={{ color: "#fff" }}
                    onPress={() => {
                      closeModal();
                      navigation.navigate("SelectIsolada");
                    }}
                    title="Busca Isolada"
                  />
                </View>
              </Overlay>

              {/* 🔹 Conteúdo Principal */}
              {children}
              <MyFooter openModal={openModal} navigation={navigation} />
            </View>
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NativeBaseProvider>
  );
};

export default Base;
