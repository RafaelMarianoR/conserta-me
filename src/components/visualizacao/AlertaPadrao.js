import React from "react";
import { Dialog } from "@rneui/themed";
import { useSelector } from "react-redux";
import { dadoExiste } from "../../utils";
import TextoCustomizavel from "../texto/TextoCustomizavel";
import Cores from "../../styles/Cores";
import { removerAlerta } from "../../redux/acoes/alerta/acoesAlerta";

const AlertaPadrao = () => {
  const alerta = useSelector((state) => state?.alerta?.informacoes);
  const mostrarAlerta = dadoExiste(alerta?.titulo);
  const mostrarMensagem = dadoExiste(alerta?.mensagem);

  return (
    <Dialog
      isVisible={mostrarAlerta}
      onBackdropPress={() => removerAlerta()}
      overlayStyle={{ backgroundColor: alerta?.corFundo || Cores.BRANCO }}
      animationType="fade"
      statusBarTranslucent
    >
      <Dialog.Title
        title={
          <TextoCustomizavel
            h4
            corTexto={alerta?.corTexto || Cores.BRANCO}
            alinhamento="left"
          >
            {alerta?.titulo || "ERRO"}
          </TextoCustomizavel>
        }
      />
      <TextoCustomizavel
        tamanhoFonte={20}
        corTexto={alerta?.corTexto || Cores.BRANCO}
        alinhamento="left"
        exibir={mostrarMensagem}
      >
        {alerta?.mensagem}
      </TextoCustomizavel>
      <Dialog.Actions>
        <Dialog.Button
          title={
            <TextoCustomizavel corTexto={alerta?.corTexto || Cores.BRANCO}>
              (X) FECHAR
            </TextoCustomizavel>
          }
          onPress={() => removerAlerta()}
        />
      </Dialog.Actions>
    </Dialog>
  );
};

export default AlertaPadrao;
