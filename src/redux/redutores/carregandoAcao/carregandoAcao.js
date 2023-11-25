import { createSlice } from "@reduxjs/toolkit";

const valoresIniciais = { situacao: false, tipo: "PADRAO" };

export const carregandoAcao = createSlice({
  name: "carregandoAcao",
  initialState: valoresIniciais,
  reducers: {
    INICIAR: (state, action) => {
      let iniciandoCarregamento = { ...state, situacao: true };

      const temListaAnimacoes =
        action?.payload !== undefined && action?.payload !== null;

      if (temListaAnimacoes) {
        return {
          ...iniciandoCarregamento,
          tipo: action?.payload,
        };
      }

      return iniciandoCarregamento;
    },
    PARAR: (state) => ({ ...state, ...valoresIniciais }),
  },
});

export default carregandoAcao.reducer;
