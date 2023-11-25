import Styles from "../../styles/Styles";
import { useSelector } from "react-redux";
import CabecalhoVoltar from "../../components/visualizacao/CabecalhoVoltar";
import { View } from "react-native";
import TextoCustomizavel from "../../components/texto/TextoCustomizavel";
import CampoTextoCustomizavel from "../../components/campos/CampoTextoCustomizavel";
import Cores from "../../styles/Cores";
import { Button, ButtonGroup, Card, Icon } from "@rneui/themed";
import {
  listaProblemasSolicitacao,
  opcoesProblemaSelecionadasArray,
  salvarSolicitacao,
  situacoesSolicitacoes,
} from "../../redux/acoes/solicitacao/acoesSolicitacao";
import { ScrollView } from "react-native";
import { useState } from "react";
import { criarAlertaParaAtencao } from "../../redux/acoes/alerta/acoesAlerta";
import { dadoExiste } from "../../utils";

const DetalheSolicitacao = ({ navigation }) => {
  const usuarioLogado = useSelector((state) => state?.auth);
  const { eTecnico } = usuarioLogado;

  const solicitacao = useSelector((state) => state?.solicitacao?.detalhe);
  const carregandoAcao = useSelector(
    (state) => state?.carregandoAcao?.situacao
  );

  const [respostaChamado, setRespostaChamado] = useState("");

  const podeMostrarIniciarChamado =
    eTecnico && solicitacao?.situacao === "AGUARDANDO_ATENDIMENTO";

  const podeMostrarConcluirChamado =
    eTecnico && solicitacao?.situacao === "EM_ATENDIMENTO";

  const situacao = situacoesSolicitacoes?.filter(
    (situacao) => situacao?.valor === solicitacao?.situacao
  )?.[0];

  const propriedadesTextosSolicitacao = {
    corTexto: Cores.PRETO,
    alinhamento: "left",
    negrito: true,
  };

  const concluirChamado = () => {
    const temRespostaChamado = dadoExiste(respostaChamado);
    if (!temRespostaChamado) {
      criarAlertaParaAtencao("Informe uma resposta!");
      return null;
    }

    salvarSolicitacao({
      ...solicitacao,
      idResponsavelConclusao: usuarioLogado?.id,
      situacao: "CONCLUIDA",
      respostaChamado,
    });
  };

  return (
    <View style={Styles.padraoContainer}>
      <View style={Styles.containerCabecalho}>
        <View style={{ ...Styles.padraoItensEmLinha, width: "100%" }}>
          <CabecalhoVoltar />
        </View>
        <TextoCustomizavel estiloTexto={Styles.titulos} h4 negrito>
          DETALHE SOLICITAÇÃO
        </TextoCustomizavel>
      </View>
      <ScrollView
        style={Styles.containerScrollViewTelaInteira}
        contentContainerStyle={{ padding: 10 }}
      >
        <View style={{ margin: 15 }}>
          <TextoCustomizavel h4 negrito corTexto={Cores.PRETO}>
            Patrimônio
          </TextoCustomizavel>
          <TextoCustomizavel h5 negrito corTexto={Cores.PRETO}>
            {solicitacao?.patrimonio}
          </TextoCustomizavel>
        </View>
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
          disabled
          selectedIndexes={opcoesProblemaSelecionadasArray(solicitacao)}
          containerStyle={{ height: 60 }}
          selectedButtonStyle={{
            backgroundColor: Cores.CINZA_CLARO,
          }}
        />
        <View style={{ width: "95%" }}>
          <TextoCustomizavel {...propriedadesTextosSolicitacao} h4>
            Observações sobre:
          </TextoCustomizavel>
        </View>
        <ScrollView
          style={Styles.containerScrollViewCaixaTexto}
          contentContainerStyle={{ padding: 10 }}
        >
          <TextoCustomizavel {...propriedadesTextosSolicitacao}>
            {solicitacao?.observacoes}
          </TextoCustomizavel>
        </ScrollView>
        {dadoExiste(solicitacao?.respostaChamado) && (
          <>
            <View style={{ width: "95%", marginTop: 10 }}>
              <TextoCustomizavel {...propriedadesTextosSolicitacao} h4>
                Resposta sobre a solicitação:
              </TextoCustomizavel>
            </View>
            <ScrollView
              style={Styles.containerScrollViewCaixaTexto}
              contentContainerStyle={{ padding: 10 }}
            >
              <TextoCustomizavel {...propriedadesTextosSolicitacao}>
                {solicitacao?.respostaChamado}
              </TextoCustomizavel>
            </ScrollView>
          </>
        )}
        <Card
          containerStyle={{
            borderRadius: 25,
            alignSelf: "center",
            backgroundColor: situacao?.corFundo || Cores.BRANCO,
          }}
        >
          <TextoCustomizavel
            {...propriedadesTextosSolicitacao}
            corTexto={situacao?.corTexto || Cores.PRETO}
            h5
          >
            {situacao?.titulo}
          </TextoCustomizavel>
        </Card>
        {podeMostrarConcluirChamado && (
          <View style={{ marginBottom: 50 }}>
            <CampoTextoCustomizavel
              titulo="Resposta do chamado"
              descricao="Digite a resposta para o chamado"
              valor={respostaChamado}
              alterarTexto={(text) => setRespostaChamado(text?.toString())}
              iconeAcaoBotaoTeclado="go"
              acaoBotaoTeclado={() => concluirChamado()}
            />
          </View>
        )}
      </ScrollView>
      {podeMostrarIniciarChamado && (
        <Button
          title="Iniciar chamado"
          type="solid"
          raised
          color={Cores.AZUL_PRINCIPAL}
          containerStyle={[
            Styles.estiloBotao,
            { position: "absolute", bottom: 15 },
          ]}
          disabled={carregandoAcao}
          loading={carregandoAcao}
          onPress={() =>
            salvarSolicitacao({
              ...solicitacao,
              idResponsavelSolicitacao: usuarioLogado?.id,
              situacao: "EM_ATENDIMENTO",
            })
          }
        />
      )}
      {podeMostrarConcluirChamado && (
        <>
          <Button
            title="Concluir chamado"
            type="solid"
            raised
            color={Cores.AZUL_PRINCIPAL}
            containerStyle={[
              Styles.estiloBotao,
              { position: "absolute", bottom: 15 },
            ]}
            disabled={carregandoAcao}
            loading={carregandoAcao}
            onPress={() => concluirChamado()}
          />
        </>
      )}
    </View>
  );
};

export default DetalheSolicitacao;
