import { useElectronApi } from "../hooks/useElectronApi";
import AuthScreen from "./Auth";


function Home() {
  const { pingElectron } = useElectronApi();

  return (
    <div className="p-4">
      <AuthScreen />

      <button
        onClick={pingElectron}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Ping Electron
      </button>
    </div>
  );
}

export default Home;
