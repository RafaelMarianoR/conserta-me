import { View } from "react-native";
import Styles from "../../styles/Styles";
import { Button, Card, Image } from "@rneui/themed";
import Cores from "../../styles/Cores";
import CabecalhoVoltar from "../../components/visualizacao/CabecalhoVoltar";
import TextoCustomizavel from "../../components/texto/TextoCustomizavel";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { dadoExiste } from "../../utils/index";
import { validarMaquinaPorPatrimonio } from "../../redux/acoes/maquina/acoesMaquina";

const LerQrCode = ({ navigation }) => {
  const [temPermissao, setTemPermissao] = useState(null);
  const [patrimonio, setPatrimonio] = useState("");

  const jaFoiEncontradoInfo = dadoExiste(patrimonio);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setTemPermissao(status === "granted");
    })();
  }, []);

  const lerCodigoBarra = async ({ type, data }) => setPatrimonio(data);

  return (
    <View style={Styles.padraoContainer}>
      <View style={Styles.containerCabecalho}>
        <CabecalhoVoltar />
      </View>
      <View style={Styles.containerCentralFlex}>
        <Image
          source={require("../../assets/scanneandoQrCode.jpg")}
          style={{ width: 240, height: 240, borderRadius: 50 }}
        />
        {!temPermissao && (
          <Card
            containerStyle={{
              borderRadius: 25,
              alignSelf: "center",
              backgroundColor: Cores.CINZA_CLARO,
            }}
          >
            <TextoCustomizavel corTexto={Cores.VERDE_SECUNDARIO} h5>
              Reinicie o aplicativo e aprove a permissão
            </TextoCustomizavel>
          </Card>
        )}
        {temPermissao && !jaFoiEncontradoInfo && (
          <BarCodeScanner
            onBarCodeScanned={jaFoiEncontradoInfo ? undefined : lerCodigoBarra}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        {jaFoiEncontradoInfo && (
          <View style={{ ...Styles.centralizarCenterDuplo, margin: 15 }}>
            <TextoCustomizavel h5 negrito corTexto={Cores.PRETO}>
              O patrimônio é o: "{patrimonio}"?
            </TextoCustomizavel>
            <Button
              title="Ler QR Code novamente?"
              type="solid"
              raised
              color={Cores.VERDE_SECUNDARIO}
              containerStyle={Styles.estiloBotao}
              onPress={() => setPatrimonio("")}
            />
            <Button
              title="Continuar solicitação"
              type="solid"
              raised
              color={Cores.AZUL_PRINCIPAL}
              containerStyle={Styles.estiloBotao}
              onPress={() => validarMaquinaPorPatrimonio({ patrimonio })}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default LerQrCode;
