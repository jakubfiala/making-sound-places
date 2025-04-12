export const createSocket = (sharawadji) => new Promise((resolve, reject) => {
  const ws = new WebSocket('https://our-sound-places-yx7kf.ondigitalocean.app/');

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

        for (const sound of data.sounds) {
          sharawadji.addSound(sound);
        }
        break;
      default:
        console.warn('unknown message type', data.type);
        return;
    }
  });
});
