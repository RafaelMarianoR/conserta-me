import { ScrollView, View } from "react-native";
import Styles from "../../styles/Styles";
import CampoTextoCustomizavel from "../../components/campos/CampoTextoCustomizavel";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { dadoExiste, descerScrollView } from "../../utils";
import { Button } from "@rneui/themed";
import TextoCustomizavel from "../../components/texto/TextoCustomizavel";
import Cores from "../../styles/Cores";
import { useSelector } from "react-redux";
import { salvarDadosUsuario } from "../../redux/acoes/usuario/acoesUsuario";

const UsuarioForm = ({ navigation }) => {
  const usuarioComAcesso = useSelector((state) => state?.auth);
  const carregandoAcao = useSelector(
    (state) => state?.carregandoAcao?.situacao
  );

  const [dados, setDados] = useState({
    id: null,
    nome: "",
    email: "",
    senha: "",
  });

  const scrollViewRef = useRef();
  const nomeRef = useRef();
  const emailRef = useRef();
  const senhaRef = useRef();

  const editando = dadoExiste(usuarioComAcesso?.id);

  useEffect(() => {
    if (editando) {
      setDados({ ...dados, ...usuarioComAcesso });
    }
  }, []);

  return (
    <View style={Styles.padraoContainer}>
      <ScrollView
        ref={scrollViewRef}
        style={{ width: "95%", minHeight: 120 }}
        contentContainerStyle={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <TextoCustomizavel
          estiloTexto={Styles.titulos}
          h3
          negrito
          corTexto={Cores.PRETO}
        >
          CRIAR CONTA
        </TextoCustomizavel>
        <CampoTextoCustomizavel
          titulo="Nome"
          descricao="Digite seu nome"
          valor={dados?.nome}
          alterarTexto={(text) => setDados({ ...dados, nome: text })}
          iconeAcaoBotaoTeclado="next"
          referencia={nomeRef}
          acaoBotaoTeclado={() => {
            if (editando) {
              salvarDadosUsuario(dados);
              return null;
            }

            emailRef.current?.focus();
            descerScrollView(scrollViewRef, 80);
          }}
          desfocarAposBotaoTeclado={false}
        />
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
          exibir={!editando}
        />
        <CampoTextoCustomizavel
          titulo="Senha"
          descricao="Digite sua senha"
          valor={dados?.senha}
          alterarTexto={(text) => setDados({ ...dados, senha: text })}
          validadores={["senha"]}
          iconeAcaoBotaoTeclado="go"
          referencia={senhaRef}
          acaoBotaoTeclado={() => salvarDadosUsuario(dados)}
          seguro
          exibir={!editando}
        />
        <Button
          title="Criar conta"
          type="solid"
          raised
          color={Cores.AZUL_PRINCIPAL}
          containerStyle={Styles.estiloBotao}
          disabled={carregandoAcao}
          loading={carregandoAcao}
          onPress={() => salvarDadosUsuario(dados)}
        />
        <Button
          title="Acessar"
          type="solid"
          raised
          color={Cores.VERDE_PRINCIPAL}
          containerStyle={Styles.estiloBotao}
          loading={carregandoAcao}
          disabled={carregandoAcao}
          onPress={() => navigation.navigate("AcessoForm")}
        />
      </ScrollView>
    </View>
  );
};

export default UsuarioForm;
