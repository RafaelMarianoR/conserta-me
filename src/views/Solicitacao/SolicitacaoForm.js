import { View } from "react-native";
import Styles from "../../styles/Styles";
import CampoTextoCustomizavel from "../../components/campos/CampoTextoCustomizavel";
import { useEffect, useState } from "react";
import { dadoExiste } from "../../utils";
import { Button, ButtonGroup, Icon, Image } from "@rneui/themed";
import TextoCustomizavel from "../../components/texto/TextoCustomizavel";
import Cores from "../../styles/Cores";
import { useSelector } from "react-redux";
import {
  listaProblemasSolicitacao,
  opcoesProblemaSelecionadasArray,
  salvarSolicitacao,
  valorInicialSolicitacaoForm,
} from "../../redux/acoes/solicitacao/acoesSolicitacao";
import CabecalhoVoltar from "../../components/visualizacao/CabecalhoVoltar";
import Store from "../../redux/Store";
import { ScrollView } from "react-native";

const SolicitacaoForm = ({ navigation }) => {
  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState([]);
  const maquina = useSelector((state) => state?.maquina?.detalhe);
  const solicitacao = useSelector((state) => state?.solicitacao?.detalhe);
  const carregandoAcao = useSelector(
    (state) => state?.carregandoAcao?.situacao
  );

  const patrimonio = maquina?.patrimonio;
  const [dados, setDados] = useState({
    ...valorInicialSolicitacaoForm,
    patrimonio,
  });

  const editando = dadoExiste(solicitacao?.id);
  const tituloAcao = (editando ? "EDITAR" : "CRIAR") + " SOLICITAÇÃO";

  const resetarFormulario = () => {
    Store.dispatch({ type: "solicitacao/LIMPAR_DETALHE" });
    setDados(valorInicialSolicitacaoForm);
  };

  useEffect(() => {
    if (editando) {
      setDados({ ...dados, ...solicitacao });

      const valorInicialMultiBotao = opcoesProblemaSelecionadasArray(
        solicitacao || {}
      );
      setOpcoesSelecionadas(valorInicialMultiBotao);
    }
  }, [solicitacao?.id]);

  return (
    <View style={Styles.padraoContainer}>
      <View style={Styles.containerCabecalho}>
        <CabecalhoVoltar acaoExtra={() => resetarFormulario()} />
        <TextoCustomizavel estiloTexto={Styles.titulos} h4 negrito>
          {tituloAcao}
        </TextoCustomizavel>
      </View>
      <ScrollView
        style={{ width: "95%" }}
        contentContainerStyle={{ padding: 10, alignItems: "center" }}
      >
        <Image
          source={require("../../assets/modeloQRCode.jpg")}
          style={{ width: 120, height: 120, borderRadius: 50 }}
        />
        <TextoCustomizavel h4 negrito corTexto={Cores.PRETO}>
          Patrimônio
        </TextoCustomizavel>
        <TextoCustomizavel h5 negrito corTexto={Cores.PRETO}>
          {dados?.patrimonio}
        </TextoCustomizavel>
        <ButtonGroup
          buttons={listaProblemasSolicitacao?.map((opcao, index) => (
            <View index={`opcao-${index}`}>
              <Icon name={opcao?.nomeIcone} />
              <TextoCustomizavel h5 negrito corTexto={Cores.PRETO}>
                {opcao?.titulo}
              </TextoCustomizavel>
            </View>
          ))}
          selectMultiple
          selectedIndexes={opcoesSelecionadas}
          onPress={(opcoesSelecionadas) => {
            setOpcoesSelecionadas(opcoesSelecionadas);
            const novoObjetoDeOpcoes = listaProblemasSolicitacao?.reduce(
              (acc, opcao, index) => {
                acc[opcao?.valor] = opcoesSelecionadas?.includes(index);
                return acc;
              },
              {}
            );
            setDados({ ...dados, ...novoObjetoDeOpcoes });
          }}
          containerStyle={{ height: 60 }}
          selectedButtonStyle={{ backgroundColor: Cores.CINZA_CLARO }}
        />
        <CampoTextoCustomizavel
          titulo="Observações sobre"
          descricao="Digite as observações"
          valor={dados?.observacoes}
          alterarTexto={(text) => setDados({ ...dados, observacoes: text })}
          iconeAcaoBotaoTeclado="go"
          acaoBotaoTeclado={() => salvarSolicitacao(dados)}
        />
        <Button
          title="Salvar registro"
          type="solid"
          raised
          color={Cores.AZUL_PRINCIPAL}
          containerStyle={Styles.estiloBotao}
          disabled={carregandoAcao}
          loading={carregandoAcao}
          onPress={() => {
            salvarSolicitacao(dados);
            resetarFormulario();
          }}
        />
      </ScrollView>
    </View>
  );
};

export default SolicitacaoForm;
