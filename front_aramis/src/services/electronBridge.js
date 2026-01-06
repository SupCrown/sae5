export const electronBridge = {
    send(channel, data) {
      if (window.electron) {
        window.electron.send(channel, data);
      }
    },
  
    on(channel, callback) {
      if (window.electron) {
        window.electron.on(channel, callback);
      }
    }
  };