export const valoresIniciaisPadroes = {
  lista: [],
  quantidade: 0,
  pagina: 1,
  detalhe: {},
};

export const reducersPadroes = () => {
  return {
    LISTAR: (state, action) => ({ ...state, ...action.payload }),
    LIMPAR_LISTA: (state) => ({
      ...state,
      lista: [],
      quantidade: 0,
      pagina: 1,
    }),
    DETALHAR: (state, action) => ({ ...state, detalhe: action.payload }),
    LIMPAR_DETALHE: (state) => ({ ...state, detalhe: {} }),
  };
};
