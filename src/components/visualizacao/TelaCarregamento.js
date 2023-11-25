import React from "react";
import { Dialog } from "@rneui/themed";
import { useSelector } from "react-redux";
import Styles from "../../styles/Styles";

const TelaCarregamento = () => {
  const infosCarregamentoTela = useSelector((state) => state?.carregandoAcao);
  const estaCarregando = infosCarregamentoTela?.situacao;

  return (
    <Dialog
      isVisible={estaCarregando}
      onBackdropPress={() => null}
      animationType="fade"
      statusBarTranslucent
      overlayStyle={{ borderRadius: 50, ...Styles.centralizarCenterDuplo }}
    >
      <Dialog.Loading />
    </Dialog>
  );
};

export default TelaCarregamento;
