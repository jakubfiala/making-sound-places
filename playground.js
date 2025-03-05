let initialised = false;

const ctx = new AudioContext();

const oscilloscope = new Oscilloscope(document.getElementById('oscilloscope'), ctx, { lineColor: '#0f0', lineWidth: 2 });
const spectrum = new AudioMotionAnalyzer(
  document.getElementById('spectrum'),
  { audioCtx: ctx, fftSize: 32768, connectSpeakers: false },
);

oscilloscope.start();

ctx.suspend();

let graph;
let createGraph = () => {};

const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');

const start = ({ target }) => {
  graph = createGraph(ctx);
  if (graph) {
    startButton.disabled = true;
    stopButton.disabled = false;
    ctx.resume();
    oscilloscope.connect(graph);
    spectrum.connectInput(graph);
  }
};

const stop = () => {
  if (graph) {
    startButton.disabled = false;
    stopButton.disabled = true;
    ctx.suspend();
    oscilloscope.disconnect(graph);
    spectrum.disconnectInput(graph);
    graph.disconnect();
  }
};


startButton.addEventListener('click', start);
stopButton.addEventListener('click', stop);

export const compose = (composition) => {
  startButton.disabled = false;
  createGraph = composition;
};
