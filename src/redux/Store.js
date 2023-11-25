import { configureStore } from "@reduxjs/toolkit";
import auth from "./redutores/auth/auth";
import carregandoAcao from "./redutores/carregandoAcao/carregandoAcao";
import alerta from "./redutores/alerta/alerta";
import solicitacao from "./redutores/solicitacao/solicitacao";
import maquina from "./redutores/maquina/maquina";

const listaReducers = Object.entries({
  auth,
  carregandoAcao,
  alerta,
  solicitacao,
  maquina,
})?.sort((a, b) => a[0].localeCompare(b[0]));

const reducer = Object.fromEntries(listaReducers);

const Store = configureStore({ reducer });

export default Store;
