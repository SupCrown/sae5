import { useElectronApi } from "../hooks/useElectronApi";

function Home() {
  const { pingElectron } = useElectronApi();

  return (
    <div className="p-4">
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
