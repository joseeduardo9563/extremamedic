import React, { useEffect } from "react";
import {
  View,
  StatusBar,
  Image,
  ImageBackground,
  Alert,
} from "react-native";
import { Spinner } from "native-base";
import ColorsScheme from "../../settings/ColorsScheme";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Server from "../../settings/Server";

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkInternetConnection = setInterval(() => {
      NetInfo.fetch().then((state) => {
        if (!state.isConnected) {
          Alert.alert("Sem internet", "Verifique sua conexão e tente novamente.", [{ text: "OK" }], { cancelable: false });
        }
      });
    }, 10000);

    const checkUserSession = async () => {
      try {
        const user = await AsyncStorage.getItem("@usuario");
        if (user) {
          // getAceite(JSON.parse(user).matricula);
          navigation.navigate("Carteirinha");
        } else {
          navigation.navigate("Select");
        }
      } catch (error) {
        console.error(error);
        navigation.navigate("Select");
      }
    };

    checkUserSession();
    return () => clearInterval(checkInternetConnection);
  }, []);

  const getAceite = async (matricula) => {
    try {
      console.log(`Server teste: ${Server.GET}getTermoAceite/${matricula}`);
      const response = await axios.get(`${Server.GET}getTermoAceite/${matricula}`);
      
      if (response.data && response.data.flag_termo === 1) {
        navigation.navigate("Carteirinha");
      } else {
        navigation.navigate("Termos");
      }
    } catch (error) {
      console.error("error teste",error);
      navigation.navigate("Carteirinha");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/fundoNovo.png")}
      style={{ width: "100%", height: "100%", flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <StatusBar backgroundColor={ColorsScheme.ASENT_COLOR} barStyle="light-content" />
      <Image style={{ width: 200.6, height: 124 }} source={require("../../assets/Logo_MEDGLO_POS.png")} resizeMode="contain" />
      <Spinner color={ColorsScheme.ASENT_COLOR} />
    </ImageBackground>
  );
};

export default LoadingScreen;