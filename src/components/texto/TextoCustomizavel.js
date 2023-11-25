import React from "react";
import { Text } from "@rneui/themed";
import Cores from "../../styles/Cores";
import { hexParaRgb } from "../../utils";

function TextoCustomizavel(props) {
  const {
    sombreamento,
    estiloTexto,
    negrito,
    cortadoAoMeio,
    sublinhado,
    opacidade,
    tamanhoFonte,
    corTexto,
    children,
    alinhamento,
    exibir,
  } = props;

  const fontSistema = { fontWeight: negrito ? "bold" : "400" };

  const propsText = {
    ...props,
    h1Style: fontSistema,
    h2Style: fontSistema,
    h3Style: fontSistema,
    h4Style: fontSistema,
  };

  const estiloSombreamento = sombreamento
    ? {
        textShadowColor: Cores.PRETO,
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
      }
    : {};

  const estilosComponenteText = {
    ...estiloSombreamento,
    ...estiloTexto,
    textAlign: alinhamento || "center",
    fontSize: tamanhoFonte ? tamanhoFonte : 14,
    color: `rgba(${hexParaRgb(corTexto || Cores.BRANCO)}, ${
      opacidade || cortadoAoMeio ? 0.3 : 1
    })`,
    textDecorationLine: cortadoAoMeio
      ? "line-through"
      : sublinhado
      ? "underline"
      : "none",
  };

  return (
    exibir !== false && (
      <Text {...propsText} style={estilosComponenteText}>
        {children}
      </Text>
    )
  );
}

export default TextoCustomizavel;
