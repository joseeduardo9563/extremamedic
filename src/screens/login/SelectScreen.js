import React, { useEffect } from "react";
import {
  View,
  StatusBar,
  Image,
  BackHandler,
  ImageBackground,
  Platform,
} from "react-native";
import { Text, NativeBaseProvider, Button } from "native-base";
import ColorsScheme from "../../settings/ColorsScheme";
import Version from "../../settings/Version";

const SelectScreen = ({ navigation }) => {
  useEffect(() => {
    const onBackPress = () => {
      BackHandler.exitApp();
      return true;
    };
    
    const focusListener = navigation.addListener("focus", () => {
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
    });
    
    const blurListener = navigation.addListener("blur", () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    });
    
    return () => {
      focusListener();
      blurListener();
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, [navigation]);

  return (
    <NativeBaseProvider>
      <ImageBackground source={require("../../assets/fundoNovo.png")} style={{ width: "100%", height: "100%" }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <StatusBar backgroundColor={ColorsScheme.ASENT_COLOR} barStyle="light-content" />
          <Image style={{ width: 200.6, height: 124, alignSelf: "center" }} source={require("../../assets/Logo_MEDGLO_POS.png")} resizeMode="contain" />
          <View style={{ marginTop: 180, justifyContent: "center" }}>
            <Button
              style={{ margin: 10, backgroundColor: ColorsScheme.ASENT_COLOR,  borderRadius: 20 }}
              block
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={{ fontSize: 11, textAlign: "center", color: "#FFFFFF" }}>{"JÁ SOU BENEFICIÁRIO MedicGLOBAL".toUpperCase()}</Text>
            </Button>
            <Button
              style={{ 
                margin: 10, 
                borderColor: ColorsScheme.ASENT_COLOR, 
                backgroundColor: "transparent", 
                borderRadius: 20,
                borderWidth: 1 
              }}
              block
              onPress={() => navigation.navigate("SelectIsolada")}
            >
              <Text style={{ fontSize: 11 }}>AINDA NÃO SOU BENEFICIÁRIO</Text>
            </Button>
          </View>
          <Text style={{ fontSize: 12, alignSelf: "center" }}>Versão {Platform.OS === "ios" ? Version.IOS : Version.ANDROID}</Text>
        </View>
      </ImageBackground>
    </NativeBaseProvider>
  );
};

export default SelectScreen;