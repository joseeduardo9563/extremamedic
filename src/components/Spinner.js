import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { Text, Spinner } from "native-base";

const SpinnerDrawer = ({ spinColor, size, textColor, text, style }) => {
  return (
    <View style={[styles.centerElement, style]}>
      <View style={styles.directionVertical}>
        <Spinner color={spinColor} size={size || Platform.select({ ios: 0, android: 80 })} />
        <Text style={{ color: textColor, textAlign: "center" }}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centerElement: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  directionVertical: {
    flexDirection: "column",
  },
});

export default SpinnerDrawer;
