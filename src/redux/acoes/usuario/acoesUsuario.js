import {
  createUserWithEmailAndPassword,
  deleteUser,
  updateProfile,
} from "firebase/auth";
import { verificarAlertasPorCampo } from "../../../utils/Validadores";
import Store from "../../Store";
import { acessarSistema } from "../auth/acoesAuth";
import { criarAlertaParaSucesso } from "../alerta/acoesAlerta";
import { authFirebase, verificarPorErrosRequisicao } from "../../../config/firebase/firebaseConfig";
import { dadoExiste } from "../../../utils";

export const salvarDadosUsuario = (dados) => {
  if (dadoExiste(dados?.id)) {
    // editarUsuario(dados);
    return null;
  }

  criarUsuario(dados);
};

const criarUsuario = async (dados) => {
  Store.dispatch({ type: "carregandoAcao/INICIAR" });

  const { nome, email, senha } = dados;
  const listaCampos = [
    { tipo: "nome", valor: nome },
    { tipo: "email", valor: email },
    { tipo: "senha", valor: senha },
  ];
  if (verificarAlertasPorCampo(listaCampos)) return null;

  let usuarioCriado = {};
  await createUserWithEmailAndPassword(authFirebase, email, senha)
    .then(async (userCredential) => {
      usuarioCriado = userCredential.user;
      await updateProfile(usuarioCriado, { displayName: nome })
        .then(async () => {
          criarAlertaParaSucesso("Conta criada com sucesso!");
          acessarSistema(dados);
          Store.dispatch({ type: "carregandoAcao/PARAR" });
        })
        .catch(async (error) => {
          await deleteUser(usuarioCriado);
          verificarPorErrosRequisicao(error);
        });
    })
    .catch((error) => verificarPorErrosRequisicao(error));
};
