import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { criarAlertaParaErro } from "../../redux/acoes/alerta/acoesAlerta";
import { dadoExiste } from "../../utils";
import consts from "../config";
import { initializeApp } from "firebase/app";
import Store from "../../redux/Store";
import AsyncStorage from "@react-native-community/async-storage";

const {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
} = consts;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};

const appFirebase = initializeApp(firebaseConfig);
export const authFirebase = initializeAuth(appFirebase, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const firestoreFirebase = getFirestore(appFirebase);

export const verificarPorErrosRequisicao = (params = {}) => {
  const { code = "" } = params;
  let mensagemErro = "";

  const verificarCodigo = (texto) => code?.includes(texto);

  const apiComFalha = verificarCodigo("api-key-not-valid");
  if (apiComFalha) {
    mensagemErro = "As funções do aplicativo estão desconfiguradas :/";
  }

  const tipoRequisicaoAutentificacao = verificarCodigo("auth/");
  if (tipoRequisicaoAutentificacao) {
    const emailJaEmUso = verificarCodigo("email-already-in-use");
    if (emailJaEmUso) {
      mensagemErro = "Email já está em uso!";
    }

    const emailInvalido = verificarCodigo("invalid-email");
    if (emailInvalido) {
      mensagemErro = "Email é inválido, tente outro, por favor!";
    }

    const senhaFraca = verificarCodigo("weak-password");
    if (senhaFraca) {
      mensagemErro = "A senha precisa ser mais difícil!";
    }

    const usuarioDesabilitado = verificarCodigo("user-disabled");
    if (usuarioDesabilitado) {
      mensagemErro = "O usuário foi desabilitado, tente outro!";
    }

    const credenciaisInvalidas = verificarCodigo("invalid-login-credentials");
    if (credenciaisInvalidas) {
      mensagemErro = "Informação de acesso inválida!";
    }
  }

  const erroNaoIdentificado = !dadoExiste(mensagemErro);
  if (erroNaoIdentificado) {
    mensagemErro = "Falha ao realizar ação desejada!";
  }

  Store.dispatch({ type: "carregandoAcao/PARAR" });

  criarAlertaParaErro(mensagemErro);
  return mensagemErro;
};
