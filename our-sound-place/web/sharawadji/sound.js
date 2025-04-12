import { latLngDist } from './utils.js';

const PLAY_DISTANCE_THRESHOLD = 300;
const LOAD_DISTANCE_THRESHOLD = PLAY_DISTANCE_THRESHOLD + 20;

class Sound {
  constructor(context, data, map, destination, options) {
    const { debug } = options;

    this.debug = debug;
    this.data = data;
    this.map = map;
    this.state = Sound.state.IDLE;

    const {
      src,
      lat,
      lng,
      gain,
      rolloffFactor = 2,
      loop = true,
      filterFrequency = 22000,
      filterType = 'lowpass',
      positionZ = 0,
    } = data;
    this.position = new LatLng(lat, lng);
    this.src = src;
    this.loop = loop;
    this.gainValue = gain;
    this.rolloffFactor = rolloffFactor;
    this.filterFrequency = filterFrequency,
    this.filterType = filterType,
    this.positionZ = positionZ;

    if (debug) {
      this.marker = new Marker({
        title: this.data.name,
        position: this.position,
        map
      });
    }

    this.context = context;
    this.destination = destination;

    this.updateMix(1);
  }

  static get state() {
    return {
      IDLE: 0,
      LOADING: 1,
      PLAYING: 2,
      SUSPENDED: 3,
      REMOVED: 4,
    };
  }

  createFXGraph() {
    this.panner = new PannerNode(this.context);
    this.panner.panningModel = 'HRTF';
    this.panner.distanceModel = 'exponential';
    this.panner.refDistance = 0.0001;
    this.panner.maxDistance = 250;
    this.panner.positionX.value = this.position.lat();
    this.panner.positionY.value = this.position.lng();
    this.panner.positionZ.value = this.positionZ;
    this.panner.rolloffFactor = this.rolloffFactor;

    this.filter = new BiquadFilterNode(this.context);
    this.filter.type = this.filterType;
    this.filter.frequency.value = this.filterFrequency;

    this.gain = new GainNode(this.context);
    this.gain.gain.setValueAtTime(this.gainValue, this.context.currentTime);

    this.panner.connect(this.filter);
    this.filter.connect(this.gain);
    this.gain.connect(this.destination);

    this.processingChainStart = this.panner;
    this.processingChainEnd = this.gain;
  }

  start() {
    this.source = new AudioBufferSourceNode(this.context);
    this.source.loop = this.loop;
    this.source.buffer = this.buffer;
    this.source.connect(this.processingChainStart);
    this.source.start(this.context.currentTime);
    this.state = Sound.state.PLAYING;
  }

  suspend() {
    this.source.disconnect();
    this.state = Sound.state.SUSPENDED;
  }

  remove() {
    this.source?.stop();
    this.source?.disconnect();
    this.state = Sound.state.REMOVED;
  }

  async load() {
    if (this.buffer) {
      this.playIfNear();
      return;
    }

    this.state = Sound.state.LOADING;
    const response = await fetch(this.src);
    const soundData = await response.arrayBuffer();
    if (this.debug) console.info(`loading ${this.src}`);

    try {
      // iOS Safari still doesn't support dAD with promises ¯\_(ツ)_/¯
      const buffer = await this.context.decodeAudioData(
        soundData,
      );

      if (this.debug) console.info(`loaded`, this.src);
      this.buffer = buffer;
      this.createFXGraph();
      this.state = Sound.state.SUSPENDED;
      this.playIfNear();
    } catch(e) {
      console.warn(`Couldn't decode ${this.src}`, e);
    }
  }

  playIfNear() {
    const userPosition = this.map.getPosition();
    if (!userPosition) {
      return false;
    }

    // Calculate distance between user and sound
    const distance = latLngDist(this.position, userPosition);

    switch(this.state) {
      case Sound.state.REMOVED:
        return false;
      case Sound.state.LOADING:
        return false;
      case Sound.state.PLAYING:
        if (distance >= PLAY_DISTANCE_THRESHOLD) {
          console.info('[sharawadji]', 'suspending', this.data.name);
          this.suspend();
          return false;
        }
        break;
      case Sound.state.SUSPENDED:
        if (distance < PLAY_DISTANCE_THRESHOLD) {
          console.info('[sharawadji]', 'starting', this.data.name);
          this.start();
        } else {
          return false;
        }
        break;
      case Sound.state.IDLE:
      default:
        if (distance < LOAD_DISTANCE_THRESHOLD) {
          try {
            this.load();
          } catch(e) {
            console.warn(`Couldn't load ${this.src}`);
          }
          return false;
        } else {
          return false;
        }
        break;
    }

    return distance;
  }

  updateMix(gain) {
    const distance = this.playIfNear();
    if (distance === false) return;
  }
}

export { Sound };
