import React from "react";
import { View, Text, StatusBar, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import ColorsScheme from "../settings/ColorsScheme";

const HeaderGoBack = ({ title, ishome }) => {
    const navigation = useNavigation();

    return (
        <View style={{
            backgroundColor: ColorsScheme.MAIN_COLOR,
            paddingVertical: 15,
            paddingHorizontal: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
        }}>
            <StatusBar backgroundColor={ColorsScheme.MAIN_COLOR} barStyle="light-content" />
            {!ishome && (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            )}
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", flex: 1, textAlign: "center" }}>
                {title}
            </Text>
            <View style={{ width: 24 }} />
        </View>
    );
};

export default HeaderGoBack;
