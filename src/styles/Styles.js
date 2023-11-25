import { StyleSheet } from "react-native";
import Cores from "./Cores";

const sombreamentoCaixas = {
  shadowColor: Cores.PRETO,
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.5,
  shadowRadius: 4.65,
  elevation: 10,
};

const estiloRodape = { position: "absolute", width: "100%", bottom: 0 };

const centralizarCenterDuplo = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const Styles = StyleSheet.create({
  padraoContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    paddingTop: 30,
  },
  padraoItensEmLinha: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
  },
  padraoCaixaBotoesDuplosSeparados: { display: "flex", flexDirection: "row" },
  padraoCaixaBotoesDuplosJuntos: {
    ...centralizarCenterDuplo,
    flexDirection: "row",
  },
  padraoCaixaVerdeEspacosa: {
    backgroundColor: Cores.AZUL_PRINCIPAL,
    borderColor: "transparent",
    borderRadius: 15,
    marginBottom: 20,
    marginTop: 20,
    width: "90%",
    padding: 30,
    borderWidth: 0,
    ...sombreamentoCaixas,
  },
  padraoCaixaVerdePequena: {
    ...centralizarCenterDuplo,
    backgroundColor: Cores.AZUL_PRINCIPAL,
    borderColor: "transparent",
    borderRadius: 50,
    marginBottom: 20,
    width: "90%",
    padding: 5,
    borderWidth: 0,
    ...sombreamentoCaixas,
  },
  padraoCaixaRodape: {
    backgroundColor: Cores.AZUL_PRINCIPAL,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    height: 50,
    ...estiloRodape,
  },
  titulos: { textAlign: "center", marginBottom: 8 },
  campoTextoPadrao: { width: "90%", padding: 5, paddingBottom: 2 },
  bordaBaixoItensLista: {
    borderBottomColor: Cores.CINZA_CLARO,
    borderBottomWidth: 2,
    borderStyle: "dotted",
  },
  iconePequeno: {
    ...centralizarCenterDuplo,
    padding: 5,
    width: 100,
    borderRadius: 15,
    backgroundColor: Cores.AZUL_PRINCIPAL,
  },
  botoesCalculo: {
    ...centralizarCenterDuplo,
    padding: 5,
    margin: 5,
    width: 40,
    height: 40,
    borderRadius: 8,
    borderColor: Cores.PRETO,
    borderWidth: 1,
  },
  textoMedioEsquerda: {
    corTexto: Cores.PRETO,
    tamanhoFonte: 18,
    alinhamento: "left",
  },
  containerScrollViewCaixaTexto: {
    width: "95%",
    maxHeight: 100,
    borderColor: Cores.CINZA_CLARO,
    borderWidth: 1,
  },
  containerScrollViewTelaInteira: {
    flex: 1,
    display: "flex",
    width: "95%",
    maxHeight: "80%",
  },
  containerCabecalho: {
    ...centralizarCenterDuplo,
    width: "100%",
    marginTop: -10,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: Cores.AZUL_PRINCIPAL,
  },
  estiloBotao: { width: 200, borderRadius: 10, margin: 10 },
  containerCentralFlex: { flex: 1, ...centralizarCenterDuplo },
  centralizarCenterDuplo,
  sombreamentoCaixas,
  estiloRodape,
});

export default Styles;
