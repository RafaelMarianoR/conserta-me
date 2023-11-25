import { Platform } from "react-native";
import dayjs from "dayjs";

export const usandoAppAndroid = Platform.OS === "android";
export const eAplicativo = Platform.OS === "ios" || usandoAppAndroid;

export const descerScrollView = (scrollViewRef, y) => {
  if (!dadoExiste(y)) {
    scrollViewRef.current?.scrollToEnd({ animated: true });
    return null;
  }
  scrollViewRef.current.scrollTo({ y, animated: true });
};

export const dadoExiste = (dado) => {
  if (typeof dado === "string") {
    const dadoValido =
      dado !== "" &&
      dado?.toUpperCase() !== "NÃO INFORMADO" &&
      dado?.toUpperCase() !== "NAO INFORMADO" &&
      dado?.toUpperCase() !== "NI" &&
      dado?.toUpperCase() !== "R$ 0,00";

    if (dadoValido) return true;
    else return false;
  }
  if (dado !== undefined && dado != null) return true;
  return false;
};

export const ordenarListaArray = ({
  dados,
  campo = "nome",
  ordemCrescente = true,
  regexParaRetirar = "",
}) => {
  const limparNomeCampo = (objeto) => {
    return dadoExiste(regexParaRetirar)
      ? objeto?.[campo]?.replace(regexParaRetirar, "")
      : objeto?.[campo];
  };

  let listaArray = [...dados].sort(
    (a, b) =>
      (ordemCrescente ? 1 : -1) *
      limparNomeCampo(a).localeCompare(limparNomeCampo(b))
  );
  return listaArray;
};

export const obterPrimeiroNome = (nomeCompleto, limite) => {
  const limiteCaracteres = limite || 15;
  const nomeTrim = dadoExiste(nomeCompleto) ? nomeCompleto.trim() : "Usuário";
  const indiceEspaco = nomeTrim.indexOf(" ", 1);

  const nomeSimples = indiceEspaco === -1 || indiceEspaco <= limiteCaracteres;
  if (nomeSimples) return nomeTrim.slice(0, limiteCaracteres);

  const palavras = nomeTrim.split(" ");
  const primeiraPalavraEncontrada = palavras
    ?.find((palavra) => /[A-Z]/.test(palavra))
    ?.split(/(?=[A-Z])/)?.[0];

  if (primeiraPalavraEncontrada) {
    const indiceFinalPalavra =
      nomeTrim?.indexOf(primeiraPalavraEncontrada) +
      primeiraPalavraEncontrada.length;
    return nomeTrim?.slice(0, indiceFinalPalavra)?.slice(0, limiteCaracteres);
  }

  return nomeTrim?.slice(0, limiteCaracteres);
};

export const gerarStringDataHoraComDate = (data) => {
  if (!dadoExiste(data)) return dayjs().format("DD/MM/YYYY HH:mm");
  return dayjs(data).format("DD/MM/YYYY HH:mm");
};

export const gerarValorDateComDataHora = (dataEnviada) => {
  let dateRetornada = new Date();
  if (dataEnviada?.includes("/")) {
    const ano = Number(dataEnviada?.substring(6, 10));
    const mes = Number(dataEnviada?.substring(3, 5)) - 1;
    const dia = Number(dataEnviada?.substring(0, 2));
    const hora = Number(dataEnviada?.substring(11, 13));
    const minutos = Number(dataEnviada?.substring(14));

    dateRetornada = new Date(ano, mes, dia, hora, minutos);
  }

  return dateRetornada;
};

export const hexParaRgb = (hex) => {
  hex = hex?.replace("#", "");

  if (hex?.length === 3) {
    hex = hex
      ?.split("")
      ?.map((char) => char + char)
      ?.join("");
  }

  const r = parseInt(hex?.substring(0, 2), 16);
  const g = parseInt(hex?.substring(2, 4), 16);
  const b = parseInt(hex?.substring(4, 6), 16);

  return `${r}, ${g}, ${b}`;
};
