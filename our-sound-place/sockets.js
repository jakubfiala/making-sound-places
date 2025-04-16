export const SOCKET_URL = 'https://our-sound-places-yx7kf.ondigitalocean.app/';

export const createEditorSocket = () => new Promise((resolve, reject) => {
  const ws = new WebSocket('https://our-sound-places-yx7kf.ondigitalocean.app/');

  ws.addEventListener('open', () => {
    console.log('[ws]', 'connected');
    resolve(ws);
  });
});

export const createViewerSocket = (sharawadji) => new Promise((resolve, reject) => {
  const ws = new WebSocket(SOCKET_URL);

  ws.addEventListener('error', (err) => {
    console.error(err);
    reject(err);
  });

  ws.addEventListener('open', () => {
    console.log('[ws]', 'connected');
  });

  ws.addEventListener('message', ({ data: message }) => {
    console.log('[ws] received:', message);
    const data = JSON.parse(message);

    switch (data.type) {
      case 'all sounds':
        resolve(ws);

        localStorage.setItem('cache', JSON.stringify(data.sounds));

        for (const sound of data.sounds) {
          sharawadji.addSound(sound);
        }
        break;
      case 'still there':
        console.debug('server still there');
      default:
        console.warn('unknown message type', data.type);
        return;
    }
  });
});
