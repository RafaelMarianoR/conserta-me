import * as React from "react";

export const referenciaNavegacao = React.createRef();

function mudarParaTela(name, params) {
  referenciaNavegacao.current?.navigate(name, params);
}

export function voltarTela() {
  referenciaNavegacao.current?.goBack();
}

export default mudarParaTela;
