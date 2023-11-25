import { createSlice } from "@reduxjs/toolkit";
import { reducersPadroes, valoresIniciaisPadroes } from "../../base";

const valoresIniciais = { ...valoresIniciaisPadroes };

export const solicitacao = createSlice({
  name: "solicitacao",
  initialState: valoresIniciais,
  reducers: { ...reducersPadroes() },
});

export default solicitacao.reducer;
