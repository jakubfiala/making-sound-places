import { createEditorSocket } from "./sockets.js";

export const connect = async () => {
  const socket = await createEditorSocket();

  return {
    createPlace: (sounds) => {
      socket.send(JSON.stringify({ type: 'update sounds', sounds }))
    },
  }
};

window.connect = connect;
