export const createSocket = (sharawadji) => {
  const ws = new WebSocket('https://subtle-lokum-527cd0.netlify.app:3333/');

  ws.addEventListener('error', console.error);

  ws.addEventListener('open', () => {
    console.log('[ws]', 'connected');
  });

  ws.addEventListener('message', ({ data: message }) => {
    console.log('[ws] received:', message);
    const data = JSON.parse(message);

    switch (data.type) {
      case 'all sounds':
        for (const sound of data.sounds) {
          sharawadji.addSound(sound);
        }
        break;
      default:
        console.warn('unknown message type', data.type);
        return;
    }
  });

  return ws;
}
