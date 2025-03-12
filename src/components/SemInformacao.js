import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, RefreshControl, Image } from "react-native";
import RenderIf from "./RenderIf";

const SemInformacao = ({ style, refreshing, onRefresh, error }) => {
  const [refreshingState, setRefreshingState] = useState(refreshing);

  const handleRefresh = useCallback(() => {
    setRefreshingState(true);
    onRefresh();
    setTimeout(() => setRefreshingState(false), 1000);
  }, [onRefresh]);

  return (
    <View style={style}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Image source={require("../assets/atencao.png")} style={{ width: 80, height: 80 }} />

        <RenderIf condition={!error}>
          <ScrollView
            refreshControl={<RefreshControl refreshing={refreshingState} onRefresh={handleRefresh} />}
          >
            <Text style={{ textAlign: "center", color: "#a0a0a0" }}>
              Não há informação a ser exibida.
            </Text>
          </ScrollView>
        </RenderIf>

        <RenderIf condition={error}>
          <Text style={{ textAlign: "center", color: "#a0a0a0" }}>
            Ocorreu um problema durante o carregamento.
          </Text>
        </RenderIf>
      </View>
    </View>
  );
};

export default SemInformacao