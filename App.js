import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import Rotas from "./src/routes";
import Store from "./src/redux/Store";

export default function App() {
  return (
    <Provider store={Store}>
      <SafeAreaProvider>
        <Rotas />
      </SafeAreaProvider>
    </Provider>
  );
}
