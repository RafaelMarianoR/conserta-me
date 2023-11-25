import Styles from "../../styles/Styles";
import { useSelector } from "react-redux";
import CabecalhoVoltar from "../../components/visualizacao/CabecalhoVoltar";
import { FlatList, View, useWindowDimensions } from "react-native";
import { Button, ButtonGroup, Card, Icon, ListItem } from "@rneui/themed";
import TextoCustomizavel from "../../components/texto/TextoCustomizavel";
import Cores from "../../styles/Cores";
import { useEffect } from "react";
import Store from "../../redux/Store";
import CabecalhoCriarRegistro from "../../components/visualizacao/CabecalhoCriarRegistro";
import {
  detalharSolicitacao,
  listaProblemasSolicitacao,
  listarSolicitacoes,
  opcoesProblemaSelecionadasArray,
  removerSolicitacao,
  situacoesSolicitacoes,
} from "../../redux/acoes/solicitacao/acoesSolicitacao";

const Solicitacao = ({ navigation }) => {
  const usuarioLogado = useSelector((state) => state?.auth);
  const { eTecnico, id } = usuarioLogado;

  const solicitacao = useSelector((state) => state?.solicitacao);
  const { lista, quantidade } = solicitacao;
  const temRegistros = lista?.length > 0 || quantidade > 0;

  const idCriadorRegistro = eTecnico ? {} : { idCriadorRegistro: id };

  useEffect(() => listarSolicitacoes(idCriadorRegistro), [id]);

  const propriedadesTextosSolicitacao = {
    corTexto: Cores.PRETO,
    alinhamento: "left",
    negrito: true,
  };

  const { width } = useWindowDimensions();
  const larguraItemSumario = 0.95 * width;

  const esconderEdicao = (solicitacao) =>
    eTecnico || solicitacao?.situacao === "CONCLUIDA";

  return (
    <View style={Styles.padraoContainer}>
      <View style={Styles.containerCabecalho}>
        <View style={{ ...Styles.padraoItensEmLinha, width: "100%" }}>
          <CabecalhoVoltar />
          {!eTecnico && (
            <CabecalhoCriarRegistro
              corPrincipal={Cores.BRANCO}
              tela="LerQrCode"
            />
          )}
        </View>
        <TextoCustomizavel estiloTexto={Styles.titulos} h4 negrito>
          LISTA SOLICITAÇÕES
        </TextoCustomizavel>
      </View>
      {!temRegistros && (
        <View key={`sem_solicitacaos`} style={Styles.containerCentralFlex}>
          <TextoCustomizavel corTexto={Cores.PRETO} h4 negrito>
            Nenhuma solicitação cadastrada
          </TextoCustomizavel>
        </View>
      )}
      {temRegistros && (
        <>
          <FlatList
            style={{ marginTop: 15, marginBottom: 15 }}
            data={lista}
            keyExtractor={(solicitacao, index) => `${index}_${solicitacao?.id}`}
            renderItem={({ item: solicitacao }) => {
              const situacao = situacoesSolicitacoes?.filter(
                (situacao) => situacao?.valor === solicitacao?.situacao
              )?.[0];

              return (
                <ListItem.Swipeable
                  containerStyle={{
                    display: "flex",
                    borderColor: Cores.CINZA_CLARO,
                    borderWidth: 2,
                    padding: 5,
                    width: larguraItemSumario,
                    ...Styles.bordaBaixoItensLista,
                  }}
                  leftContent={(reset) => (
                    <Button
                      title="Remover"
                      onPress={() => {
                        reset();
                        removerSolicitacao(solicitacao?.id);
                      }}
                      icon={{ name: "close", color: "white" }}
                      buttonStyle={{
                        minHeight: "100%",
                        backgroundColor: Cores.VERMELHO_FALHA,
                      }}
                    />
                  )}
                  rightContent={(reset) => (
                    <Button
                      title="Editar"
                      onPress={() => {
                        reset();
                        Store.dispatch({
                          type: "solicitacao/DETALHAR",
                          payload: solicitacao,
                        });
                        navigation.navigate("SolicitacaoForm");
                      }}
                      icon={{ name: "edit", color: "white" }}
                      buttonStyle={{
                        minHeight: "100%",
                        backgroundColor: Cores.VERDE_PRINCIPAL,
                      }}
                      disabled={esconderEdicao(solicitacao)}
                    />
                  )}
                >
                  <ListItem.Content style={{ display: "flex", padding: 5 }}>
                    <View style={{ ...Styles.padraoItensEmLinha }}>
                      <View style={{ display: "flex", flex: 10 }}>
                        <TextoCustomizavel
                          {...propriedadesTextosSolicitacao}
                          h4
                        >
                          {solicitacao?.patrimonio}
                        </TextoCustomizavel>
                        <TextoCustomizavel {...propriedadesTextosSolicitacao}>
                          {solicitacao?.dataCriacao}
                        </TextoCustomizavel>
                      </View>
                      <Button
                        type="clear"
                        onPress={() => detalharSolicitacao(solicitacao)}
                        onPressIn={() => detalharSolicitacao(solicitacao)}
                        icon={{ name: "search", color: Cores.PRETO, size: 40 }}
                      />
                    </View>
                    <ButtonGroup
                      buttons={listaProblemasSolicitacao?.map(
                        (opcao, index) => (
                          <View index={`opcao-${index}`}>
                            <Icon name={opcao?.nomeIcone} />
                            <TextoCustomizavel
                              h5
                              negrito
                              corTexto={Cores.PRETO}
                            >
                              {opcao?.titulo}
                            </TextoCustomizavel>
                          </View>
                        )
                      )}
                      selectMultiple
                      disabled
                      selectedIndexes={opcoesProblemaSelecionadasArray(
                        solicitacao
                      )}
                      containerStyle={{ height: 60 }}
                      selectedButtonStyle={{
                        backgroundColor: Cores.CINZA_CLARO,
                      }}
                    />
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
                  </ListItem.Content>
                </ListItem.Swipeable>
              );
            }}
          />
          <View
            style={{
              backgroundColor: Cores.AZUL_PRINCIPAL,
              marginBottom: 5,
              padding: 5,
              borderRadius: 25,
              ...Styles.sombreamentoCaixas,
            }}
          >
            <TextoCustomizavel
              estiloTexto={{ marginBottom: 10 }}
              corTexto={Cores.BRANCO}
              h4
              negrito
            >
              {quantidade}
              {"\n"}Registro{quantidade > 1 ? "s" : ""}
            </TextoCustomizavel>
          </View>
        </>
      )}
    </View>
  );
};

export default Solicitacao;
