const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");



ipcMain.on("ping", () => {
  console.log("Ping reçu depuis le renderer");
});

app.whenReady().then(createWindow);