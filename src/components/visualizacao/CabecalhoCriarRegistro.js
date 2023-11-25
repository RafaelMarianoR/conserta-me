import React from "react";
import { View } from "react-native";
import mudarParaTela, { voltarTela } from "../../utils/ServicoNavegacao";
import { dadoExiste } from "../../utils";
import Cores from "../../styles/Cores";
import { Button } from "@rneui/themed";

const CabecalhoCriarRegistro = (props) => {
  const { acaoCustomizada, tela } = props;

  return (
    <View style={{ display: "flex", alignSelf: "flex-end" }}>
      <Button
        title="Novo"
        type="clear"
        titleStyle={{ fontWeight: "bold", fontSize: 18, color: Cores.BRANCO }}
        iconRight
        icon={{
          name: "plus",
          type: "ant-design",
          size: 40,
          color: "white",
        }}
        onPress={() => {
          if (!dadoExiste(tela)) {
            voltarTela();
            return null;
          }

          if (acaoCustomizada) {
            acaoCustomizada();
          }

          mudarParaTela(tela);
        }}
      />
    </View>
  );
};

export default CabecalhoCriarRegistro;
