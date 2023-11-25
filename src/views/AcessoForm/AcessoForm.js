import { ScrollView, View } from "react-native";
import Styles from "../../styles/Styles";
import CampoTextoCustomizavel from "../../components/campos/CampoTextoCustomizavel";
import { useState } from "react";
import { acessarSistema } from "../../redux/acoes/auth/acoesAuth";
import { useRef } from "react";
import { descerScrollView } from "../../utils";
import { Button, Image } from "@rneui/themed";
import TextoCustomizavel from "../../components/texto/TextoCustomizavel";
import Cores from "../../styles/Cores";
import { useSelector } from "react-redux";

const AcessoForm = ({ navigation }) => {
  const carregandoAcao = useSelector(
    (state) => state?.carregandoAcao?.situacao
  );
  const [dados, setDados] = useState({ email: "", senha: "" });
  const scrollViewRef = useRef();
  const emailRef = useRef();
  const senhaRef = useRef();

  return (
    <View style={Styles.padraoContainer}>
      <Image
        source={require("../../assets/logo.jpg")}
        style={{ width: 240, height: 240, borderRadius: 50 }}
      />
      <TextoCustomizavel
        estiloTexto={Styles.titulos}
        h3
        negrito
        corTexto={Cores.PRETO}
      >
        ACESSO AO SISTEMA
      </TextoCustomizavel>
      <ScrollView
        ref={scrollViewRef}
        style={{ width: "95%", minHeight: 120 }}
        contentContainerStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CampoTextoCustomizavel
          titulo="Email"
          descricao="Digite seu email"
          valor={dados?.email}
          tipoCampo="email"
          alterarTexto={(text) => setDados({ ...dados, email: text?.trim() })}
          validadores={["email"]}
          iconeAcaoBotaoTeclado="next"
          referencia={emailRef}
          acaoBotaoTeclado={() => {
            senhaRef.current?.focus();
            descerScrollView(scrollViewRef);
          }}
          desfocarAposBotaoTeclado={false}
        />
        <CampoTextoCustomizavel
          titulo="Senha"
          descricao="Digite sua senha"
          valor={dados?.senha}
          alterarTexto={(text) => setDados({ ...dados, senha: text })}
          validadores={["senha"]}
          iconeAcaoBotaoTeclado="go"
          referencia={senhaRef}
          acaoBotaoTeclado={() => acessarSistema(dados)}
          seguro
        />
        <Button
          title="Acessar"
          type="solid"
          raised
          color={Cores.AZUL_PRINCIPAL}
          containerStyle={Styles.estiloBotao}
          loading={carregandoAcao}
          disabled={carregandoAcao}
          onPress={() => acessarSistema(dados)}
        />
        <Button
          title="Criar conta"
          type="solid"
          raised
          color={Cores.VERDE_PRINCIPAL}
          containerStyle={Styles.estiloBotao}
          disabled={carregandoAcao}
          loading={carregandoAcao}
          onPress={() => navigation.navigate('UsuarioForm')}
        />
      </ScrollView>
    </View>
  );
};

export default AcessoForm;
