import React from "react";
import { View } from "react-native";
import { voltarTela } from "../../utils/ServicoNavegacao";
import { Button } from "@rneui/themed";
import Cores from "../../styles/Cores";

function CabecalhoVoltar(props) {
  const { acaoCustomizada, acaoExtra } = props;

  return (
    <View style={{ display: "flex", alignSelf: "flex-start" }}>
      <Button
        title="Voltar"
        type="clear"
        titleStyle={{ fontWeight: "bold", fontSize: 18, color: Cores.BRANCO }}
        icon={{
          name: "caretleft",
          type: "ant-design",
          size: 40,
          color: "white",
        }}
        onPress={() => {
          if (acaoCustomizada) {
            acaoCustomizada();
            return null;
          }

          if (acaoExtra) {
            acaoExtra();
          }

          voltarTela();
        }}
      />
    </View>
  );
}

export default CabecalhoVoltar;
