import Styles from "../../styles/Styles";
import { useSelector } from "react-redux";
import CabecalhoVoltar from "../../components/visualizacao/CabecalhoVoltar";
import { FlatList, View, useWindowDimensions } from "react-native";
import { Button, ListItem } from "@rneui/themed";
import TextoCustomizavel from "../../components/texto/TextoCustomizavel";
import Cores from "../../styles/Cores";
import { useEffect } from "react";
import {
  listarMaquinas,
  removerMaquina,
} from "../../redux/acoes/maquina/acoesMaquina";
import Store from "../../redux/Store";
import CabecalhoCriarRegistro from "../../components/visualizacao/CabecalhoCriarRegistro";

const Maquina = ({ navigation }) => {
  const maquinas = useSelector((state) => state?.maquina);
  const { lista, quantidade } = maquinas;
  const temRegistros = lista?.length > 0 || quantidade > 0;

  useEffect(() => listarMaquinas(), []);

  const propriedadesTextosMaquina = {
    corTexto: Cores.PRETO,
    alinhamento: "left",
    negrito: true,
  };

  const { width } = useWindowDimensions();
  const larguraItemSumario = 0.95 * width;

  return (
    <View style={Styles.padraoContainer}>
      <View style={Styles.containerCabecalho}>
        <View style={{ ...Styles.padraoItensEmLinha, width: "100%" }}>
          <CabecalhoVoltar />
          <CabecalhoCriarRegistro
            corPrincipal={Cores.BRANCO}
            tela="MaquinaForm"
          />
        </View>
        <TextoCustomizavel estiloTexto={Styles.titulos} h4 negrito>
          LISTA MÁQUINAS
        </TextoCustomizavel>
      </View>
      {!temRegistros && (
        <View key={`sem_maquinas`} style={Styles.containerCentralFlex}>
          <TextoCustomizavel corTexto={Cores.PRETO} h4 negrito>
            Nenhuma máquina cadastrada
          </TextoCustomizavel>
        </View>
      )}
      {temRegistros && (
        <>
          <FlatList
            style={{ marginTop: 15, marginBottom: 15 }}
            data={lista}
            keyExtractor={(maquina, index) => `${index}_${maquina?.id}`}
            renderItem={({ item: maquina }) => {
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
                        removerMaquina(maquina?.id);
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
                          type: "maquina/DETALHAR",
                          payload: maquina,
                        });
                        navigation.navigate("MaquinaForm");
                      }}
                      icon={{ name: "edit", color: "white" }}
                      buttonStyle={{
                        minHeight: "100%",
                        backgroundColor: Cores.VERDE_PRINCIPAL,
                      }}
                    />
                  )}
                >
                  <ListItem.Content style={{ display: "flex", padding: 5 }}>
                    <TextoCustomizavel {...propriedadesTextosMaquina} h4>
                      {maquina?.patrimonio}
                    </TextoCustomizavel>
                    <TextoCustomizavel {...propriedadesTextosMaquina}>
                      {maquina?.modelo}
                    </TextoCustomizavel>
                    <TextoCustomizavel {...propriedadesTextosMaquina}>
                      {maquina?.local}
                    </TextoCustomizavel>
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

export default Maquina;
