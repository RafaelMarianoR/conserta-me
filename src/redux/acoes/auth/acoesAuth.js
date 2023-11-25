import { signInWithEmailAndPassword } from "firebase/auth";
import { verificarAlertasPorCampo } from "../../../utils/Validadores";
import Store from "../../Store";
import {
  authFirebase,
  verificarPorErrosRequisicao,
} from "../../../config/firebase/firebaseConfig";

export const acessarSistema = (dadosAcesso) => {
  Store.dispatch({ type: "carregandoAcao/INICIAR" });

  const { email, senha } = dadosAcesso;

  const listaCamps = [
    { tipo: "email", valor: email },
    { tipo: "senha", valor: senha },
  ];
  if (verificarAlertasPorCampo(listaCamps)) return null;

  signInWithEmailAndPassword(authFirebase, email, senha)
    .then(async (userCredential) => {
      const credenciaisUsuarioFirebase = userCredential.user;

      const { uid, displayName, photoURL, refreshToken } =
        credenciaisUsuarioFirebase;

      const usuarioETecnico = email === "rafael@gmail.com";
      let usuario = {
        ...dadosAcesso,
        token: refreshToken,
        id: uid,
        nome: displayName,
        urlFoto: photoURL,
        eTecnico: usuarioETecnico,
      };

      delete usuario.senha;
      Store.dispatch({ type: "auth/ACESSAR", payload: usuario });
      Store.dispatch({ type: "carregandoAcao/PARAR" });
    })
    .catch((error) => verificarPorErrosRequisicao(error));
};

export const desconectarSistema = async () => {
  Store.dispatch({ type: "carregandoAcao/INICIAR" });
  await authFirebase.signOut();
  Store.dispatch({ type: "auth/SAIR" });
  Store.dispatch({ type: "carregandoAcao/PARAR" });
};

export const acessoAutomatico = async () => {
  Store.dispatch({ type: "carregandoAcao/INICIAR" });
  authFirebase.onAuthStateChanged((credenciaisUsuario) => {
    if (credenciaisUsuario) {
      const { email, refreshToken, uid, displayName, photoURL } =
        credenciaisUsuario;

      const usuarioETecnico = email === "rafael@gmail.com";
      const usuario = {
        email,
        token: refreshToken,
        id: uid,
        nome: displayName,
        urlFoto: photoURL,
        eTecnico: usuarioETecnico,
      };

      Store.dispatch({ type: "auth/ACESSAR", payload: usuario });
      Store.dispatch({ type: "carregandoAcao/PARAR" });
    } else {
      desconectarSistema();
    }
  });
};
