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
import { salvarMaquina } from "../../redux/acoes/maquina/acoesMaquina";
import CabecalhoVoltar from "../../components/visualizacao/CabecalhoVoltar";
import Store from "../../redux/Store";

const MaquinaForm = ({ navigation }) => {
  const maquina = useSelector((state) => state?.maquina?.detalhe);
  const carregandoAcao = useSelector(
    (state) => state?.carregandoAcao?.situacao
  );

  const valorInicialForm = { patrimonio: "", modelo: "", local: "" };
  const [dados, setDados] = useState(valorInicialForm);

  const scrollViewRef = useRef();
  const patrimonioRef = useRef();
  const modeloRef = useRef();
  const localRef = useRef();

  const editando = dadoExiste(maquina?.id);
  const tituloAcao = (editando ? "EDITAR" : "CRIAR") + " MÁQUINA";

  const resetarFormulario = () => {
    Store.dispatch({ type: "maquina/LIMPAR_DETALHE" });
    setDados(valorInicialForm);
  };

  useEffect(() => {
    resetarFormulario();
    if (editando) {
      setDados({ ...dados, ...maquina });
    }
  }, []);

  return (
    <View style={Styles.padraoContainer}>
      <View style={Styles.containerCabecalho}>
        <CabecalhoVoltar acaoExtra={() => resetarFormulario()} />
        <TextoCustomizavel estiloTexto={Styles.titulos} h4 negrito>
          {tituloAcao}
        </TextoCustomizavel>
      </View>
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
        <CampoTextoCustomizavel
          titulo="Patrimônio"
          descricao="Digite o patrimônio"
          valor={dados?.patrimonio}
          alterarTexto={(text) =>
            setDados({ ...dados, patrimonio: text?.trim()?.toUpperCase() })
          }
          iconeAcaoBotaoTeclado="next"
          referencia={patrimonioRef}
          acaoBotaoTeclado={() => {
            if (editando) {
              salvarMaquina(dados);
              return null;
            }

            modeloRef.current?.focus();
            descerScrollView(scrollViewRef, 80);
          }}
          desfocarAposBotaoTeclado={false}
        />
        <CampoTextoCustomizavel
          titulo="Modelo"
          descricao="Digite o modelo"
          valor={dados?.modelo}
          alterarTexto={(text) => setDados({ ...dados, modelo: text })}
          iconeAcaoBotaoTeclado="next"
          referencia={modeloRef}
          acaoBotaoTeclado={() => {
            localRef.current?.focus();
            descerScrollView(scrollViewRef);
          }}
          desfocarAposBotaoTeclado={false}
        />
        <CampoTextoCustomizavel
          titulo="Local"
          descricao="Digite o local da máquina"
          valor={dados?.local}
          alterarTexto={(text) => setDados({ ...dados, local: text })}
          iconeAcaoBotaoTeclado="go"
          referencia={localRef}
          acaoBotaoTeclado={() => salvarMaquina(dados)}
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
            salvarMaquina(dados);
            resetarFormulario();
          }}
        />
      </ScrollView>
    </View>
  );
};

export default MaquinaForm;
