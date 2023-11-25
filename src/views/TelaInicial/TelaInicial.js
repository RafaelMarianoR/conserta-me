import { View } from "react-native";
import Styles from "../../styles/Styles";
import { desconectarSistema } from "../../redux/acoes/auth/acoesAuth";
import { obterPrimeiroNome } from "../../utils";
import { Button, Image } from "@rneui/themed";
import TextoCustomizavel from "../../components/texto/TextoCustomizavel";
import Cores from "../../styles/Cores";
import { useSelector } from "react-redux";

const TelaInicial = ({ navigation }) => {
  const usuarioLogado = useSelector((state) => state?.auth);
  const { nome, eTecnico } = usuarioLogado;

  const nomeUsuario = obterPrimeiroNome(nome);
  const mensagemDescricao = eTecnico
    ? "Pronto para o dia?"
    : "Problemas na máquina";

  return (
    <View style={Styles.padraoContainer}>
      <View style={{ display: "flex", width: "95%" }}>
        <TextoCustomizavel h3 negrito corTexto={Cores.PRETO} alinhamento="left">
          {`Olá, ${nomeUsuario}.`}
        </TextoCustomizavel>
        <TextoCustomizavel h3 negrito corTexto={Cores.PRETO} alinhamento="left">
          {mensagemDescricao}
        </TextoCustomizavel>
      </View>
      <View style={Styles.containerCentralFlex}>
        <Image
          source={require("../../assets/qrNaMaquina.jpg")}
          style={{ width: 240, height: 240, borderRadius: 50 }}
        />
        {eTecnico && (
          <Button
            title="Listar máquinas"
            type="solid"
            raised
            color={Cores.AZUL_PRINCIPAL}
            containerStyle={Styles.estiloBotao}
            onPress={() => navigation.navigate("Maquina")}
          />
        )}
        <Button
          title="Listar solicitações"
          type="solid"
          raised
          color={Cores.VERDE_PRINCIPAL}
          containerStyle={Styles.estiloBotao}
          onPress={() => navigation.navigate("Solicitacao")}
        />
        <Button
          title="Sair do sistema"
          type="solid"
          raised
          color={Cores.VERMELHO_FALHA}
          containerStyle={Styles.estiloBotao}
          onPress={() => desconectarSistema()}
        />
      </View>
    </View>
  );
};

export default TelaInicial;
