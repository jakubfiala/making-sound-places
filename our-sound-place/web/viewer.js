import { Loader as MapsAPILoader } from "https://esm.run/@googlemaps/js-api-loader";

import { initialPosition, initialPOV, persistPosition, persistPOV } from "./position.js";
import { createViewerSocket } from "./sockets.js";
import { Sharawadji } from "./sharawadji/index.js";

const ctx = new AudioContext();
ctx.suspend();

const mapsLoader = new MapsAPILoader({
  apiKey: 'AIzaSyA1VOiLnJEwz3HzcDxEExa_tCTu5KKOoqQ',
  version: '3.exp',
  libraries: ['streetView'],
});

const { StreetViewPanorama } = await mapsLoader.importLibrary('streetView');
const { LatLng } = await mapsLoader.importLibrary('core');
const { Marker } = await mapsLoader.importLibrary('marker');

Object.assign(window, { LatLng, Marker });

const map = new StreetViewPanorama(document.getElementById("map"), {
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

const sharawadji = new Sharawadji([], map, { debug: true }, ctx);
await createViewerSocket(sharawadji);

const startButton = document.getElementById('start');
const intro = document.getElementById('intro');

const initAudio = async () => {
  intro.hidden = true;
  await ctx.resume();
};

startButton.addEventListener('click', initAudio);
