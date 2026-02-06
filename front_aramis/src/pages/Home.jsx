import { useElectronApi } from "../hooks/useElectronApi";
import PaletteViewer from "./palettes";


function Home() {
  const { pingElectron } = useElectronApi();

  return (
    <div className="p-4">
      <PaletteViewer />

    </div>
  );
}

export default Home;
