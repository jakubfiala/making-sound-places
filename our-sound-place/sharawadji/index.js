import { Sound } from './sound.js';
import { calculateListenerOrientation } from './panner-utils.js';

const ATTENUATION_TARGET = 60;
const LISTENER_HEADING_OFFSET_DEG = 90;

class Sharawadji {
  constructor(sounds, panorama, options, audioContext = new AudioContext()) {
    const { debug, compressor } = options;

    this.panorama = panorama;

    this.audioContext = audioContext;
    this.masterGain = new GainNode(this.audioContext);

    this.createSound = s => new Sound(audioContext, s, panorama, this.masterGain, { debug });
  this.sounds = sounds.map(this.createSound);

  if (compressor) {
    this.compressor = new DynamicsCompressorNode(this.audioContext);
    this.compressor.threshold.setValueAtTime(-50, this.audioContext.currentTime);
    this.compressor.knee.setValueAtTime(40, this.audioContext.currentTime);
    this.compressor.ratio.setValueAtTime(20, this.audioContext.currentTime);
    this.compressor.attack.setValueAtTime(0.3, this.audioContext.currentTime);
    this.compressor.release.setValueAtTime(0.25, this.audioContext.currentTime);

    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.audioContext.destination);
  } else {
    this.masterGain.connect(this.audioContext.destination);
  }

  this.updateMix = this.updateMix.bind(this);

  panorama.addListener('pano_changed', this.updateMix);
    panorama.addListener('position_changed', this.updateMix);
    panorama.addListener('pov_changed', this.updateMix);
  }

  updateMix() {
    const userPosition = this.panorama.getPosition();
    const userPov = this.panorama.getPov();

    if (this.audioContext.listener.positionX) {
      this.audioContext.listener.positionX.value = userPosition.lat();
      this.audioContext.listener.positionY.value = userPosition.lng();
    } else {
  this.audioContext.listener.setPosition(userPosition.lat(), userPosition.lng(), 0);
  }

    const { forward, up } = calculateListenerOrientation(userPov.heading + LISTENER_HEADING_OFFSET_DEG, userPov.pitch, 0);

    if (this.audioContext.listener.forwardX) {
      this.audioContext.listener.forwardX.value = forward.x;
      this.audioContext.listener.forwardY.value = forward.y;
      this.audioContext.listener.forwardZ.value = forward.z;
      this.audioContext.listener.upX.value = up.x;
      this.audioContext.listener.upY.value = up.y;
      this.audioContext.listener.upZ.value = up.z;
    } else {
      this.audioContext.listener.setOrientation(forward.x, forward.y, forward.z, up.x, up.y, up.z);
    }

    const activeSoundsCount = this.sounds.filter(s => s.state === Sound.state.PLAYING).length;

    const attenuation = Math.max(Math.min(activeSoundsCount / ATTENUATION_TARGET, 0.7), 0);
    this.sounds.forEach(s => s.updateMix(1 - attenuation));
  }

  getSoundByName(name) {
    return this.sounds.find((sound) => sound.data.name === name);
  }

  addSound(sound) {
    const index = this.sounds.findIndex(s => s.data.name === sound.name);

    if (index != -1) {
      console.log('[sharawadji]', 'replacing sound at', index);
      this.sounds[index].remove();
      this.sounds.splice(index, 1);
    };

    console.log('[sharawadji]', 'adding sound:', sound.name);
    this.sounds.push(this.createSound(sound));
  }
};

window.Sharawadji = Sharawadji;

export { Sharawadji };
