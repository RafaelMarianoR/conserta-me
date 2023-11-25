import { useSelector } from "react-redux";
import Cores from "./styles/Cores";
import { NavigationContainer } from "@react-navigation/native";
import { referenciaNavegacao } from "./utils/ServicoNavegacao";
import { dadoExiste } from "./utils/index";
import AcessoForm from "./views/AcessoForm/AcessoForm";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import UsuarioForm from "./views/UsuarioForm/UsuarioForm";
import TelaInicial from "./views/TelaInicial/TelaInicial";
import { acessoAutomatico } from "./redux/acoes/auth/acoesAuth";
import LerQrCode from "./views/Solicitacao/LerQrCode";
import MaquinaForm from "./views/Maquina/MaquinaForm";
import AlertaPadrao from "./components/visualizacao/AlertaPadrao";
import TelaCarregamento from "./components/visualizacao/TelaCarregamento";
import Maquina from "./views/Maquina/Maquina";
import Solicitacao from "./views/Solicitacao/Solicitacao";
import SolicitacaoForm from "./views/Solicitacao/SolicitacaoForm";
import DetalheSolicitacao from "./views/Solicitacao/DetalheSolicitacao";

const Stack = createNativeStackNavigator();
const Navigator = Stack.Navigator;
const Tela = Stack.Screen;

let executouAcessoAutomatico = false;

const Rotas = () => {
  const usuarioComAcesso = useSelector((state) => state.auth);

  if (!executouAcessoAutomatico) {
    acessoAutomatico();
    executouAcessoAutomatico = true;
  }

  let telas = dadoExiste(usuarioComAcesso?.id) ? (
    <>
      <Tela name="TelaInicial" component={TelaInicial} />
      <Tela name="LerQrCode" component={LerQrCode} />
      <Tela name="MaquinaForm" component={MaquinaForm} />
      <Tela name="Maquina" component={Maquina} />
      <Tela name="Solicitacao" component={Solicitacao} />
      <Tela name="SolicitacaoForm" component={SolicitacaoForm} />
      <Tela name="DetalheSolicitacao" component={DetalheSolicitacao} />
    </>
  ) : (
    <>
      <Tela name="AcessoForm" component={AcessoForm} />
      <Tela name="UsuarioForm" component={UsuarioForm} />
    </>
  );

  return (
    <>
      <StatusBar style="light" backgroundColor={Cores.AZUL_PRINCIPAL} />
      <TelaCarregamento />
      <AlertaPadrao />
      <NavigationContainer
        ref={referenciaNavegacao}
        documentTitle={{ formatter: () => `Me Lista` }}
      >
        <Navigator screenOptions={{ headerShown: false }}>{telas}</Navigator>
      </NavigationContainer>
    </>
  );
};

export default Rotas;
