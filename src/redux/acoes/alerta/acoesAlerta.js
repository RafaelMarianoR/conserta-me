import Cores from "../../../styles/Cores";
import Store from "../../Store";

export const criarAlertaParaSucesso = (mensagem, titulo) => {
  Store.dispatch({
    type: "alerta/ADICIONAR",
    payload: {
      titulo: titulo || "Tudo certo!",
      mensagem,
      corFundo: Cores.AZUL_PRINCIPAL,
    },
  });
};

export const criarAlertaParaAtencao = (mensagem, titulo) => {
  Store.dispatch({
    type: "alerta/ADICIONAR",
    payload: {
      titulo: titulo || "Atenção!",
      mensagem,
      corFundo: Cores.AMARELO_ATENCAO,
      corTexto: Cores.PRETO,
    },
  });
};

export const criarAlertaParaErro = (mensagem, titulo) => {
  Store.dispatch({
    type: "alerta/ADICIONAR",
    payload: {
      titulo: titulo || "Falha na ação!",
      mensagem,
      corFundo: Cores.VERMELHO_FALHA,
    },
  });
};

export const removerAlerta = () => Store.dispatch({ type: "alerta/ADICIONAR" });
