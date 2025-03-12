import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  BackHandler,
  Platform,
} from "react-native";
import {
  Container,
  Header,
  Body,
  Title,
  Right,
  Spinner,
  Text,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebView } from "react-native-webview";
import FAIcon from "react-native-vector-icons/FontAwesome5";
import ColorsScheme from "../../settings/ColorsScheme";
import Base from "../../components/Base";

const HomeScreen = ({ navigation }) => {
  const [usuario, setUsuario] = useState({});
  const [isBannerActive, setIsBannerActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const backHandlerRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@usuario");
        if (storedUser) {
          setUsuario(JSON.parse(storedUser));
          setIsBannerActive(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();

    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };
    backHandlerRef.current = BackHandler.addEventListener("hardwareBackPress", backAction);

    setTimeout(() => {
      setIsLoading(true);
    }, 3000);

    return () => {
      if (backHandlerRef.current) {
        backHandlerRef.current.remove();
      }
    };
  }, []);

  return (
    <Base navigation={navigation}>
      <Header androidStatusBarColor={ColorsScheme.MAIN_COLOR} style={{ backgroundColor: ColorsScheme.MAIN_COLOR }}>
        <Body style={{ flex: 3 }}>
          <Title style={{ color: "white", right: 15 }}>MedicGLOBAL</Title>
        </Body>
        <Right />
      </Header>

      {isLoading ? (
        <View style={{ flex: 1 }}>
          <WebView source={{ uri: "https://serpram.com.br/noticiaAPP.asp" }} style={{ marginBottom: 55, flex: 1 }} />
        </View>
      ) : (
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
          <Spinner size={100} color={ColorsScheme.MAIN_COLOR} />
        </View>
      )}

      {isBannerActive && (
        <View style={{ position: "absolute", top: 20 }}>
          <View
            style={{
              margin: 20,
              borderRadius: 10,
              backgroundColor: "#fefefe",
              shadowColor: "#000",
              shadowOffset: { width: 20, height: 20 },
              shadowOpacity: 1.0,
              shadowRadius: 2,
              elevation: 10,
            }}
          >
            <TouchableOpacity
              style={{ position: "absolute", top: -10, right: 20 }}
              onPress={() => setIsBannerActive(false)}
            >
              <FAIcon style={{ backgroundColor: "#fefefe", borderRadius: 30 }} size={20} solid color={ColorsScheme.ASENT_COLOR} name="times-circle" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsBannerActive(false)}>
              <Text style={{ paddingTop: 15, paddingLeft: 15, paddingRight: 15, paddingBottom: 5, fontSize: 16 }}>Olá {usuario.nome}</Text>
              <Text style={{ paddingTop: 5, paddingLeft: 15, paddingRight: 15, paddingBottom: 15, fontSize: 12 }}>
                Agora que estamos conectados, podemos otimizar a utilização do aplicativo.
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Base>
  );
};

export default HomeScreen;