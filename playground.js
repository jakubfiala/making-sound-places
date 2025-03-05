import { Oscilloscope } from 'https://esm.sh/@teropa/oscilloscope';
import AudioMotionAnalyzer from 'https://esm.sh/audiomotion-analyzer';

document.body.innerHTML = `
<nav id="controls">
  <button id="start" disabled>Start</button>
  <button id="play" disabled>Play</button>
  <button id="stop" disabled>Stop</button>
</nav>

<canvas id="oscilloscope" width="1000" height="200"></canvas>

<div id="spectrum"></div>
`;

const startButton = document.getElementById('start');
const playButton = document.getElementById('play');
const stopButton = document.getElementById('stop');

let initialised = false;

const ctx = new AudioContext();

const oscilloscope = new Oscilloscope(document.getElementById('oscilloscope'), ctx, { lineColor: '#0f0', lineWidth: 2 });
const spectrum = new AudioMotionAnalyzer(
  document.getElementById('spectrum'),
  { audioCtx: ctx, fftSize: 32768 },
);

oscilloscope.start();

ctx.suspend();

let graph;
let createGraph = () => {};

const start = () => {
  graph = createGraph(ctx);
  if (graph) {
    startButton.disabled = true;
    playButton.disabled = false;
    stopButton.disabled = false;
    playButton.innerText = 'Pause';
    
    ctx.resume();
    oscilloscope.connect(graph);
    spectrum.connectInput(graph);
  }
};

const togglePlay = () => {
  if (ctx.state === 'running') {
    playButton.innerText = 'Play';
    ctx.suspend();
  } else if (ctx.state === 'suspended') {
    playButton.innerText = 'Pause';
    ctx.resume();
  }
};

const stop = () => {
  if (graph) {
    startButton.disabled = false;
    playButton.disabled = true;
    stopButton.disabled = true;
    ctx.suspend();
    oscilloscope.disconnect(graph);
    spectrum.disconnectInput(graph);
    graph.disconnect();
  }
};

startButton.addEventListener('click', start);
playButton.addEventListener('click', togglePlay);
stopButton.addEventListener('click', stop);

export class NoiseNode extends AudioBufferSourceNode {
  constructor(context, options = {}) {
    const buffer = new AudioBuffer({ length: 44100, sampleRate: context.sampleRate });
    const data = Array
        .from({ length: buffer.length })
        .map(() => Math.random() * 2 - 1);

    buffer.copyToChannel(Float32Array.from(data), 0, 0);
    
    super(context, { ...options, loop: true, buffer });
  }
};

export const compose = (composition) => {
  startButton.disabled = false;
  createGraph = composition;
};
