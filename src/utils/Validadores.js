import { dadoExiste } from ".";
import Store from "../redux/Store";
import { criarAlertaParaAtencao } from "../redux/acoes/alerta/acoesAlerta";

export const validarCampoTexto = (normas, valor) => {
  if (normas?.length <= 0) return null;

  if (typeof normas === "string") normas = normas?.split(",");
  let nomeCampo = "EMAIL";

  const verificarEmail = normas?.find((n) => n?.toUpperCase() === nomeCampo);
  if (verificarEmail) return emailValido(valor);

  nomeCampo = "SENHA";
  const verificarSenha = normas?.find((n) => n?.toUpperCase() === nomeCampo);
  if (verificarSenha) return senhaValida(valor);
};

export const emailValido = (texto) => {
  if (!dadoExiste(texto)) return null;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const valido = emailRegex.test(texto);

  if (!valido) return "Email não é válido";

  return "";
};

export const senhaValida = (texto) => {
  if (!dadoExiste(texto)) return null;
  const tamanhoMinimo = 6;
  const regex = new RegExp(`^.{${tamanhoMinimo},}$`);
  const valido = regex.test(texto);
  if (!valido) return `A senha precisa ter mais de ${tamanhoMinimo} caracteres`;
  return "";
};

export const verificarAlertasPorCampo = (listaCampos) => {
  let resposta = "";

  const quantidadeCampos = listaCampos?.length;
  for (let i = 0; i < quantidadeCampos; i++) {
    const campo = listaCampos?.[i];

    let valorInvalido = !dadoExiste(campo?.valor);

    const tipoEmail = campo?.tipo?.toUpperCase() === "EMAIL";
    if (tipoEmail) {
      const erroDeValidez = emailValido(campo?.valor);
      valorInvalido = valorInvalido || dadoExiste(erroDeValidez);

      if (valorInvalido) {
        const textoPadrao = campo?.mensagem || "Email não informado";
        resposta = dadoExiste(erroDeValidez) ? erroDeValidez : textoPadrao;
        break;
      }
    }

    const tipoSenha = campo?.tipo?.toUpperCase() === "SENHA";
    if (tipoSenha) {
      const erroDeValidez = senhaValida(campo?.valor);
      valorInvalido = valorInvalido || dadoExiste(erroDeValidez);

      if (valorInvalido) {
        const textoPadrao = campo?.mensagem || "Senha não informada";
        resposta = dadoExiste(erroDeValidez) ? erroDeValidez : textoPadrao;
        break;
      }
    }

    const tipoTextoGenerico =
      !dadoExiste(campo?.valor) &&
      (!dadoExiste(campo?.tipo) || (!tipoEmail && !tipoSenha));
    if (tipoTextoGenerico) {
      const textoPadrao = campo?.mensagem || "Preencha todos os campos";
      resposta = textoPadrao;
      break;
    }
  }

  if (dadoExiste(resposta)) {
    Store.dispatch({ type: "carregandoAcao/PARAR" });
    criarAlertaParaAtencao(resposta);
  }

  return dadoExiste(resposta);
};

export const verificarAlertasSenha = (senha, mensagem) => {
  const erroSenha = senhaValida(senha);
  const senhaInvalida = !dadoExiste(senha) || erroSenha;
  if (senhaInvalida) {
    const textoPadrao = mensagem || "Senha não informada";
    criarAlertaParaAtencao(dadoExiste(erroSenha) ? erroSenha : textoPadrao);
    return true;
  }
};

export const verificarAlertasCampoTexto = (senha, mensagem) => {
  const senhaInvalida = !dadoExiste(senha);
  if (senhaInvalida) {
    const textoPadrao = mensagem || "Senha não informada";
    criarAlertaParaAtencao(textoPadrao);
    return true;
  }
};
