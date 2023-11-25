import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
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
  criarAlertaParaErro,
} from "../alerta/acoesAlerta";

const formularioMaquinaPadrao = (dadosMaquina = {}) => {
  const idCriadorRegistro = Store?.getState()?.auth?.id;
  const { dataCriacao } = dadosMaquina;

  let objetoDadoMaquina = {
    ativo: true,
    patrimonio: "",
    modelo: "",
    local: "",
    idCriadorRegistro,
    ...dadosMaquina,
    dataCriacao: dadoExiste(dataCriacao)
      ? gerarValorDateComDataHora(dataCriacao)
      : serverTimestamp(),
    idUltimoEditor: idCriadorRegistro,
  };

  return objetoDadoMaquina;
};

const refMaquina = collection(firestoreFirebase, "maquina");

export const listarMaquinas = (parametros = {}) => {
  Store.dispatch({ type: "carregandoAcao/INICIAR" });

  const requisicaoPadrao = query(
    refMaquina,
    where("ativo", "==", true),
    orderBy("local")
  );

  let sqlRequisicao = query(requisicaoPadrao);

  const { patrimonio = "" } = parametros;
  const temPatrimonio = dadoExiste(patrimonio);
  if (temPatrimonio) {
    sqlRequisicao = query(requisicaoPadrao, where("nome", ">=", patrimonio));
  }

  getDocs(sqlRequisicao)
    .then((querySnapshot) => {
      const maquinas = [];
      querySnapshot.forEach((doc) => {
        let registro = doc?.data();
        const id = doc?.id;
        const dataCriacao = gerarStringDataHoraComDate(
          registro?.dataCriacao?.toDate()
        );

        registro = { ...registro, id, dataCriacao };

        maquinas.push(registro);
      });

      Store.dispatch({
        type: "maquina/LISTAR",
        payload: { lista: maquinas, quantidade: maquinas?.length },
      });

      Store.dispatch({ type: "carregandoAcao/PARAR" });
    })
    .catch((error) => verificarPorErrosRequisicao(error));
};

export const salvarMaquina = async (dadosMaquina) => {
  if (dadoExiste(dadosMaquina?.id)) {
    editarMaquina(dadosMaquina);
    return null;
  }

  criarRegistroMaquina(dadosMaquina);
};

const criarRegistroMaquina = async (dadosMaquina) => {
  Store.dispatch({ type: "carregandoAcao/INICIAR" });

  const { patrimonio, modelo, local } = dadosMaquina;
  const listaCampos = [
    { tipo: "patrimonio", valor: patrimonio },
    { tipo: "modelo", valor: modelo },
    { tipo: "local", valor: local },
  ];
  if (verificarAlertasPorCampo(listaCampos)) return null;

  const informacoesMaquina = formularioMaquinaPadrao(dadosMaquina);

  try {
    await addDoc(refMaquina, informacoesMaquina);

    mudarParaTela("Maquina");
    listarMaquinas();
    Store.dispatch({ type: "carregandoAcao/PARAR" });
  } catch (error) {
    verificarPorErrosRequisicao(error);
  }
};

const editarMaquina = async (dadosMaquina) => {
  Store.dispatch({ type: "carregandoAcao/INICIAR" });

  const { patrimonio, modelo, local } = dadosMaquina;
  const listaCampos = [
    { tipo: "patrimonio", valor: patrimonio },
    { tipo: "modelo", valor: modelo },
    { tipo: "local", valor: local },
  ];
  if (verificarAlertasPorCampo(listaCampos)) return null;

  const informacoesMaquina = formularioMaquinaPadrao(dadosMaquina);

  const maquinaEspecificaRef = doc(
    firestoreFirebase,
    "maquina",
    dadosMaquina?.id
  );

  try {
    await updateDoc(maquinaEspecificaRef, informacoesMaquina);

    mudarParaTela("Maquina");
    listarMaquinas();
    Store.dispatch({ type: "carregandoAcao/PARAR" });
  } catch (error) {
    verificarPorErrosRequisicao(error);
  }
};

export const removerMaquina = async (idMaquina) => {
  const removidoPorId = Store.getState()?.auth?.id;
  Store.dispatch({ type: "carregandoAcao/INICIAR" });

  const maquinaEspecificaRef = doc(firestoreFirebase, "maquina", idMaquina);

  try {
    await updateDoc(maquinaEspecificaRef, { ativo: false, removidoPorId });

    listarMaquinas();
    Store.dispatch({ type: "carregandoAcao/PARAR" });
  } catch (error) {
    verificarPorErrosRequisicao(error);
  }
};

export const validarMaquinaPorPatrimonio = (parametros = {}) => {
  Store.dispatch({ type: "carregandoAcao/INICIAR" });

  const { patrimonio = "" } = parametros;
  const temPatrimonio = dadoExiste(patrimonio);
  if (!temPatrimonio) {
    criarAlertaParaErro("Patrimônio não informado!");
    Store.dispatch({ type: "carregandoAcao/PARAR" });
    return null;
  }

  const sqlRequisicao = query(
    refMaquina,
    where("ativo", "==", true),
    where("patrimonio", "==", patrimonio)
  );

  getDocs(sqlRequisicao)
    .then((querySnapshot) => {
      if (querySnapshot?.empty) {
        criarAlertaParaErro("Patrimônio não encontrado!");
        Store.dispatch({ type: "carregandoAcao/PARAR" });
        return null;
      }

      let maquinas = [];
      querySnapshot.forEach((doc) => {
        let registro = doc?.data();
        const id = doc?.id;
        const dataCriacao = gerarStringDataHoraComDate(
          registro?.dataCriacao?.toDate()
        );

        maquinas.push({ ...registro, id, dataCriacao });
      });

      const variosResultados = maquinas?.length > 1;
      if (variosResultados) {
        criarAlertaParaAtencao(
          "Mais de 1 registro encontrado com esse patrimônio, foi escolhido o primeiro!"
        );
      }

      Store.dispatch({ type: "solicitacao/LIMPAR_DETALHE" });
      Store.dispatch({ type: "maquina/DETALHAR", payload: maquinas?.[0] });
      mudarParaTela("SolicitacaoForm");
      Store.dispatch({ type: "carregandoAcao/PARAR" });
    })
    .catch((error) => verificarPorErrosRequisicao(error));
};
