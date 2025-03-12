import React from "react";
import {
    StyleSheet,
    StatusBar,
    View,
    ImageBackground,
    Image,
    Platform
} from "react-native";
import { Button, Text, Icon } from "native-base";
import { useNavigation } from "@react-navigation/native";
import ColorsScheme from "../../settings/ColorsScheme";
import Version from "../../settings/Version";

const AboutScreen = () => {
    const navigation = useNavigation();
    const { ANDROID, IOS } = Version;

    return (
        <ImageBackground
            source={require('../../assets/fundoNovo.png')}
            style={styles.background}
        >
            <Image
                style={styles.logo}
                source={require('../../assets/Logo_MEDGLO_POS.png')}
                resizeMode="contain"
            />

            <Text style={styles.versionText}>
                <Text style={{ fontSize: 14 }}>Versão</Text>
                <Text style={{ fontSize: 14 }}> {Platform.OS === "ios" ? IOS : ANDROID}</Text>
            </Text>

            <Text style={styles.websiteText}>
                www.extremamedic.com
            </Text>

            <Text style={styles.footerText}>
                Desenvolvido por Adaptweb ©
            </Text>

            <Button
                transparent
                onPress={() => navigation.goBack()}
                style={[styles.backButton, Platform.OS === "ios" ? { top: 15 } : {}]}
            >
                <Icon name="arrow-back" style={{ color: "black" }} />
            </Button>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200.6,
        height: 124,
    },
    versionText: {
        textAlign: "center",
        color: ColorsScheme.ASENT_COLOR,
        fontSize: 12,
    },
    websiteText: {
        textAlign: "center",
        padding: 5,
        color: ColorsScheme.ASENT_COLOR,
        fontSize: 14,
    },
    footerText: {
        textAlign: "center",
        padding: 10,
        position: "absolute",
        bottom: 7,
        color: ColorsScheme.ASENT_COLOR,
        fontSize: 14,
    },
    backButton: {
        position: "absolute",
    },
});

export default AboutScreen;
