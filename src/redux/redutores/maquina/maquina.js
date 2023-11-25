import { createSlice } from "@reduxjs/toolkit";
import { reducersPadroes, valoresIniciaisPadroes } from "../../base";

const valoresIniciais = { ...valoresIniciaisPadroes };

export const maquina = createSlice({
  name: "maquina",
  initialState: valoresIniciais,
  reducers: { ...reducersPadroes() },
});

export default maquina.reducer;
