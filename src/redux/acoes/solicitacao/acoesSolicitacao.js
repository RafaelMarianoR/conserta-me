import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  firestoreFirebase,
  verificarPorErrosRequisicao,
} from "../../../config/firebase/firebaseConfig";
import Store from "../../Store";
import mudarParaTela from "../../../utils/ServicoNavegacao";
import {
  dadoExiste,
  gerarStringDataHoraComDate,
  gerarValorDateComDataHora,
} from "../../../utils";
import { verificarAlertasPorCampo } from "../../../utils/Validadores";
import {
  criarAlertaParaAtencao,
  criarAlertaParaSucesso,
} from "../alerta/acoesAlerta";
import Cores from "../../../styles/Cores";

const formularioSolicitacaoPadrao = (dadosSolicitacao = {}) => {
  const idCriadorRegistro = Store?.getState()?.auth?.id;
  const { dataCriacao } = dadosSolicitacao;

  let objetoDadoSolicitacao = {
    ativo: true,
    observacoes: "",
    idCriadorRegistro,
    situacao: "AGUARDANDO_ATENDIMENTO",
    ...dadosSolicitacao,
    dataCriacao: dadoExiste(dataCriacao)
      ? gerarValorDateComDataHora(dataCriacao)
      : serverTimestamp(),
    idUltimoEditor: idCriadorRegistro,
  };

  return objetoDadoSolicitacao;
};

const refSolicitacao = collection(firestoreFirebase, "solicitacao");

export const listarSolicitacoes = (paramentros = {}) => {
  Store.dispatch({ type: "carregandoAcao/INICIAR" });
  const consultaPadrao = query(refSolicitacao, where("ativo", "==", true));
  let sqlRequisicao = query(consultaPadrao);

  const { idCriadorRegistro } = paramentros;
  const temIdCriadorRegistro = dadoExiste(idCriadorRegistro);
  if (temIdCriadorRegistro) {
    sqlRequisicao = query(
      consultaPadrao,
      where("idCriadorRegistro", "==", idCriadorRegistro)
    );
  }

  getDocs(sqlRequisicao)
    .then((querySnapshot) => {
      const produtos = [];
      querySnapshot.forEach((doc) => {
        let registro = doc?.data();
        const id = doc?.id;
        const dataCriacao = gerarStringDataHoraComDate(
          registro?.dataCriacao?.toDate()
        );

        registro = { ...registro, id, dataCriacao };

        produtos.push(registro);
      });

      Store.dispatch({
        type: "solicitacao/LISTAR",
        payload: { lista: produtos, quantidade: produtos?.length },
      });

      Store.dispatch({ type: "carregandoAcao/PARAR" });
    })
    .catch((error) => verificarPorErrosRequisicao(error));
};

export const salvarSolicitacao = async (dadosSolicitacao) => {
  if (dadoExiste(dadosSolicitacao?.id)) {
    editarSolicitacao(dadosSolicitacao);
    return null;
  }

  criarRegistroSolicitacao(dadosSolicitacao);
};

const criarRegistroSolicitacao = async (dadosSolicitacao) => {
  Store.dispatch({ type: "carregandoAcao/INICIAR" });

  const opcoesSelecionadas = opcoesProblemaSelecionadasArray(dadosSolicitacao);
  const naoSelecionouOpcoes = opcoesSelecionadas?.length <= 0;
  if (naoSelecionouOpcoes) {
    criarAlertaParaAtencao("Selecione pelo menos um dos problemas citados!");
    Store.dispatch({ type: "carregandoAcao/PARAR" });
    return null;
  }

  const { observacoes } = dadosSolicitacao;
  const listaCampos = [{ tipo: "observacoes", valor: observacoes }];
  if (verificarAlertasPorCampo(listaCampos)) return null;

  const informacoesSolicitacao = formularioSolicitacaoPadrao(dadosSolicitacao);

  try {
    await addDoc(refSolicitacao, informacoesSolicitacao);

    mudarParaTela("Solicitacao");

    const usuarioLogado = Store.getState()?.auth;
    const idCriadorRegistro = usuarioLogado?.eTecnico
      ? {}
      : { idCriadorRegistro: usuarioLogado?.id };
    listarSolicitacoes(idCriadorRegistro);
    criarAlertaParaSucesso("Solicitação criada com sucesso!");
    Store.dispatch({ type: "carregandoAcao/PARAR" });
  } catch (error) {
    verificarPorErrosRequisicao(error);
  }
};

const editarSolicitacao = async (dadosSolicitacao) => {
  Store.dispatch({ type: "carregandoAcao/INICIAR" });

  const opcoesSelecionadas = opcoesProblemaSelecionadasArray(dadosSolicitacao);
  const naoSelecionouOpcoes = opcoesSelecionadas?.length <= 0;
  if (naoSelecionouOpcoes) {
    criarAlertaParaAtencao("Selecione pelo menos um dos problemas citados!");
    Store.dispatch({ type: "carregandoAcao/PARAR" });
    return null;
  }

  const { observacoes } = dadosSolicitacao;
  const listaCampos = [{ tipo: "observacoes", valor: observacoes }];
  if (verificarAlertasPorCampo(listaCampos)) return null;

  const informacoesSolicitacao = formularioSolicitacaoPadrao(dadosSolicitacao);

  const solicitacaoEspecificaRef = doc(
    firestoreFirebase,
    "solicitacao",
    dadosSolicitacao?.id
  );

  try {
    await updateDoc(solicitacaoEspecificaRef, informacoesSolicitacao);

    mudarParaTela("Solicitacao");

    const usuarioLogado = Store.getState()?.auth;
    const idCriadorRegistro = usuarioLogado?.eTecnico
      ? {}
      : { idCriadorRegistro: usuarioLogado?.id };
    listarSolicitacoes(idCriadorRegistro);
    Store.dispatch({ type: "carregandoAcao/PARAR" });
  } catch (error) {
    verificarPorErrosRequisicao(error);
  }
};

export const removerSolicitacao = async (idSolicitacao) => {
  const removidoPorId = Store.getState()?.auth?.id;
  Store.dispatch({ type: "carregandoAcao/INICIAR" });

  const solicitacaoEspecificaRef = doc(
    firestoreFirebase,
    "solicitacao",
    idSolicitacao
  );

  try {
    await updateDoc(solicitacaoEspecificaRef, { ativo: false, removidoPorId });

    const usuarioLogado = Store.getState()?.auth;
    const idCriadorRegistro = usuarioLogado?.eTecnico
      ? {}
      : { idCriadorRegistro: usuarioLogado?.id };
    listarSolicitacoes(idCriadorRegistro);
    Store.dispatch({ type: "carregandoAcao/PARAR" });
  } catch (error) {
    verificarPorErrosRequisicao(error);
  }
};

export const detalharSolicitacao = (solicitacao) => {
  Store.dispatch({
    type: "solicitacao/DETALHAR",
    payload: solicitacao,
  });
  mudarParaTela("DetalheSolicitacao");
};

export const opcoesProblemaSelecionadasArray = (opcoesSelecionadasObjeto) => {
  const arraySelecionados = listaProblemasSolicitacao.reduce(
    (acc, opcao, index) => {
      if (opcoesSelecionadasObjeto[opcao.valor] === true) acc.push(index);
      return acc;
    },
    []
  );

  return arraySelecionados;
};

const opcoesProblemas = listaProblemasSolicitacao?.reduce((acc, opcao) => {
  return { ...acc, [opcao.valor]: false };
}, {});

const patrimonio = Store.getState()?.maquina?.detalhe?.patrimonio || "";

export const valorInicialSolicitacaoForm = {
  ...opcoesProblemas,
  observacoes: "",
  patrimonio,
};

export const listaProblemasSolicitacao = [
  { titulo: "Tela", valor: "PROBLEMA_TELA", nomeIcone: "monitor" },
  { titulo: "Teclado", valor: "PROBLEMA_TECLADO", nomeIcone: "keyboard" },
  { titulo: "Áudio", valor: "PROBLEMA_AUDIO", nomeIcone: "speaker" },
  { titulo: "Lento", valor: "PROBLEMA_LENTO", nomeIcone: "speed" },
  { titulo: "Internet", valor: "PROBLEMA_INTERNET", nomeIcone: "wifi" },
  {
    titulo: "Outros",
    valor: "PROBLEMA_OUTROS",
    nomeIcone: "not-listed-location",
  },
];

export const situacoesSolicitacoes = [
  { titulo: "Aguardando atendimento", valor: "AGUARDANDO_ATENDIMENTO" },
  {
    titulo: "Em atendimento",
    valor: "EM_ATENDIMENTO",
    corFundo: Cores.CINZA_CLARO,
  },
  {
    titulo: "Concluída",
    valor: "CONCLUIDA",
    corFundo: Cores.VERDE_PRINCIPAL,
    corTexto: Cores.BRANCO,
  },
];
