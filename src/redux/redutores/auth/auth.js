import { createSlice } from "@reduxjs/toolkit";

const valoresIniciais = {
  id: null,
  token: null,
  nome: null,
  email: null,
  urlFoto: null,
  eTecnico: false,
};

export const auth = createSlice({
  name: "auth",
  initialState: valoresIniciais,
  reducers: {
    ACESSAR: (state, action) => ({ ...state, ...action.payload }),
    MODIFICAR_USUARIO: (state, action) => ({
      ...state,
      ...action.payload,
    }),
    SAIR: (state) => ({ ...state, ...valoresIniciais }),
  },
});

export default auth.reducer;
