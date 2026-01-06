const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  ping: () => {
    console.log("Ping envoyé depuis le renderer");
    ipcRenderer.send("ping");
  },
});