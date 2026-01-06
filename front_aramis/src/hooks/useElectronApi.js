export function useElectronApi() {
  const pingElectron = () => {
    if (window.electron) {
      window.electron.ping();
    } else {
      console.warn("Electron API non disponible");
    }
  };

  return { pingElectron };
}