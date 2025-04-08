import { calculateListenerOrientation } from 'https://esm.run/panner-utils';

document.body.innerHTML = `
<div id="map"></div>

<div id="intro">
  <button id="start">Start</button>
</div>
`;

let map;

const ctx = new AudioContext();
ctx.suspend();

async function initMap() {
  const { StreetViewPanorama } = await google.maps.importLibrary('streetView');
  console.log(Map);

  map = new StreetViewPanorama(document.getElementById("map"), {
    position: { lat: 52.533108743821984,lng: 13.401136755323181  },
  });

  const update = () => {
    const userPosition = map.getPosition();
		const userPov = map.getPov();

    ctx.listener.setPosition(userPosition.lat(), userPosition.lng(), 0);

		const { forward, up } = calculateListenerOrientation(userPov.heading + 90, userPov.pitch, 0);
		ctx.listener.setOrientation(forward.x, forward.y, forward.z, up.x, up.y, up.z);
  };

  map.addListener('pov_changed', update);

  update();
};


initMap();

const startButton = document.getElementById('start');
const intro = document.getElementById('intro');

const loadFromURL = async (url) => {
  const response = await fetch(url);
  return response.arrayBuffer();
};

const loadSound = async (context, url) => {
  const audioData = await loadFromURL(url);
  const buffer = await context.decodeAudioData(audioData);
  return new AudioBufferSourceNode(context, { buffer });
};

export const loadSoundInSpace = async (context, url) => {
  const source = await loadSound(context, url);
  source.loop = true;
  source.start();

  const panner = new PannerNode(context);
  panner.panningModel = 'HRTF';
  panner.distanceModel = 'exponential';
  panner.refDistance = 0.0001;
  panner.maxDistance = 250;
  panner.rolloffFactor = 2;

  source.connect(panner);

  return { source, panner };
};


let createGraph = () => {};

const initAudio = async () => {
  intro.hidden = true;
  const graph = await createGraph(ctx);
  graph.connect(ctx.destination);
  await ctx.resume();
};

export const compose = (composition) => {
  startButton.disabled = false;
  createGraph = composition;
};

export const choose = list => list[Math.floor(Math.random() * list.length)];

startButton.addEventListener('click', initAudio);
