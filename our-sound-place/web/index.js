import { Loader as MapsAPILoader } from "https://esm.run/@googlemaps/js-api-loader";

import { initialPosition, initialPOV, persistPosition, persistPOV } from "./position.js";
import { createSocket } from "./sockets.js";
import { Sharawadji } from "./sharawadji/index.js";

document.body.innerHTML = `
  <main>
    <div id="map"></div>
  </main>
  <div id="intro">
    <button id="start">Start</button>
  </div>
`;

let map, sharawadji, socket;

const ctx = new AudioContext();
ctx.suspend();

async function initMap() {
  const mapsLoader = new MapsAPILoader({
    apiKey: 'AIzaSyA1VOiLnJEwz3HzcDxEExa_tCTu5KKOoqQ',
    version: '3.exp',
    libraries: ['streetView'],
  });

  const { StreetViewPanorama } = await mapsLoader.importLibrary('streetView');
  const { LatLng } = await mapsLoader.importLibrary('core');
  const { Marker } = await mapsLoader.importLibrary('marker');

  Object.assign(window, { LatLng, Marker });

  map = new StreetViewPanorama(document.getElementById("map"), {
    position: initialPosition,
    pov: initialPOV,
  });

  // persist the user's position in local storage
  map.addListener('position_changed', () => {
    persistPosition({ lat: map.getPosition().lat(), lng: map.getPosition().lng() });
  });
  // persist the user's POV in local storage
  map.addListener('pov_changed', () => {
    persistPOV({ heading: map.getPov().heading, pitch: map.getPov().pitch });
  });

  sharawadji = new Sharawadji([], map, { debug: true }, ctx);
  socket = createSocket(sharawadji);
};

await initMap();

const startButton = document.getElementById('start');
const intro = document.getElementById('intro');

const initAudio = async () => {
  intro.hidden = true;
  await ctx.resume();
};

export const createPlace = (sounds) => {
  sounds.forEach(s => sharawadji.addSound(s));
  socket.send(JSON.stringify({ type: 'update sounds', sounds }))
};

window.createPlace = createPlace;

startButton.addEventListener('click', initAudio);
