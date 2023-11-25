import React from "react";
import { Input } from "@rneui/themed";
import Styles from "../../styles/Styles";
import TextoCustomizavel from "../texto/TextoCustomizavel";
import { validarCampoTexto } from "../../utils/Validadores";
import Cores from "../../styles/Cores";

function CampoTextoCustomizavel(props) {
  const {
    titulo,
    descricao,
    estiloCampo,
    estiloCaixaTexto,
    seguro,
    valor,
    referencia,
    alterarTexto,
    exibir,
    validadores,
    iconeAcaoBotaoTeclado,
    acaoBotaoTeclado,
    tipoCampo,
    desfocarAposBotaoTeclado,
    acaoDeFoco,
    acaoDeDesfoco,
    editavel,
  } = props;

  const estiloCampoTexto = estiloCampo ? estiloCampo : {};

  const estiloCaixaCampoTexto = estiloCaixaTexto ? estiloCaixaTexto : {};

  const customizarTextoCampo = (
    <TextoCustomizavel
      corTexto={Cores.PRETO}
      alinhamento="left"
      negrito
      tamanhoFonte={16}
    >
      {titulo || "Campo"}
    </TextoCustomizavel>
  );

  return (
    exibir !== false && (
      <Input
        {...props}
        inputMode={tipoCampo || "text"}
        returnKeyType={iconeAcaoBotaoTeclado || "default"}
        onSubmitEditing={() => acaoBotaoTeclado() || null}
        errorMessage={validarCampoTexto(validadores || [], valor)}
        ref={referencia}
        blurOnSubmit={desfocarAposBotaoTeclado !== false}
        onFocus={() => (acaoDeFoco ? acaoDeFoco() : null)}
        onBlur={() => (acaoDeDesfoco ? acaoDeDesfoco() : null)}
        editable={editavel !== false}
        value={valor || ""}
        onChangeText={(text) => alterarTexto(text)}
        secureTextEntry={seguro}
        label={customizarTextoCampo}
        placeholder={descricao || titulo || "Informe o valor"}
        containerStyle={{
          ...Styles.campoTextoPadrao,
          ...estiloCaixaCampoTexto,
        }}
        style={{ ...Styles.campoTextoPadrao, ...estiloCampoTexto }}
      />
    )
  );
}

export default CampoTextoCustomizavel;
