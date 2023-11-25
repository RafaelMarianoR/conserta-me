import { createSlice } from "@reduxjs/toolkit";

const valoresIniciais = { informacoes: {} };

export const alerta = createSlice({
  name: "alerta",
  initialState: valoresIniciais,
  reducers: {
    ADICIONAR: (state, action) => ({
      ...state,
      informacoes: action?.payload,
    }),
    LIMPAR: (state) => ({ ...state, informacoes: {} }),
  },
});

export default alerta.reducer;
