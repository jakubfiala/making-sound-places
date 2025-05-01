/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

// do not edit .js files directly - edit src/index.jst



var fastDeepEqual = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }



    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};

var isEqual = /*@__PURE__*/getDefaultExportFromCjs(fastDeepEqual);

/**
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at.
 *
 *      Http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const DEFAULT_ID = "__googleMapsScriptId";
/**
 * The status of the [[Loader]].
 */
var LoaderStatus;
(function (LoaderStatus) {
    LoaderStatus[LoaderStatus["INITIALIZED"] = 0] = "INITIALIZED";
    LoaderStatus[LoaderStatus["LOADING"] = 1] = "LOADING";
    LoaderStatus[LoaderStatus["SUCCESS"] = 2] = "SUCCESS";
    LoaderStatus[LoaderStatus["FAILURE"] = 3] = "FAILURE";
})(LoaderStatus || (LoaderStatus = {}));
/**
 * [[Loader]] makes it easier to add Google Maps JavaScript API to your application
 * dynamically using
 * [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 * It works by dynamically creating and appending a script node to the the
 * document head and wrapping the callback function so as to return a promise.
 *
 * ```
 * const loader = new Loader({
 *   apiKey: "",
 *   version: "weekly",
 *   libraries: ["places"]
 * });
 *
 * loader.load().then((google) => {
 *   const map = new google.maps.Map(...)
 * })
 * ```
 */
class Loader {
    /**
     * Creates an instance of Loader using [[LoaderOptions]]. No defaults are set
     * using this library, instead the defaults are set by the Google Maps
     * JavaScript API server.
     *
     * ```
     * const loader = Loader({apiKey, version: 'weekly', libraries: ['places']});
     * ```
     */
    constructor({ apiKey, authReferrerPolicy, channel, client, id = DEFAULT_ID, language, libraries = [], mapIds, nonce, region, retries = 3, url = "https://maps.googleapis.com/maps/api/js", version, }) {
        this.callbacks = [];
        this.done = false;
        this.loading = false;
        this.errors = [];
        this.apiKey = apiKey;
        this.authReferrerPolicy = authReferrerPolicy;
        this.channel = channel;
        this.client = client;
        this.id = id || DEFAULT_ID; // Do not allow empty string
        this.language = language;
        this.libraries = libraries;
        this.mapIds = mapIds;
        this.nonce = nonce;
        this.region = region;
        this.retries = retries;
        this.url = url;
        this.version = version;
        if (Loader.instance) {
            if (!isEqual(this.options, Loader.instance.options)) {
                throw new Error(`Loader must not be called again with different options. ${JSON.stringify(this.options)} !== ${JSON.stringify(Loader.instance.options)}`);
            }
            return Loader.instance;
        }
        Loader.instance = this;
    }
    get options() {
        return {
            version: this.version,
            apiKey: this.apiKey,
            channel: this.channel,
            client: this.client,
            id: this.id,
            libraries: this.libraries,
            language: this.language,
            region: this.region,
            mapIds: this.mapIds,
            nonce: this.nonce,
            url: this.url,
            authReferrerPolicy: this.authReferrerPolicy,
        };
    }
    get status() {
        if (this.errors.length) {
            return LoaderStatus.FAILURE;
        }
        if (this.done) {
            return LoaderStatus.SUCCESS;
        }
        if (this.loading) {
            return LoaderStatus.LOADING;
        }
        return LoaderStatus.INITIALIZED;
    }
    get failed() {
        return this.done && !this.loading && this.errors.length >= this.retries + 1;
    }
    /**
     * CreateUrl returns the Google Maps JavaScript API script url given the [[LoaderOptions]].
     *
     * @ignore
     * @deprecated
     */
    createUrl() {
        let url = this.url;
        url += `?callback=__googleMapsCallback&loading=async`;
        if (this.apiKey) {
            url += `&key=${this.apiKey}`;
        }
        if (this.channel) {
            url += `&channel=${this.channel}`;
        }
        if (this.client) {
            url += `&client=${this.client}`;
        }
        if (this.libraries.length > 0) {
            url += `&libraries=${this.libraries.join(",")}`;
        }
        if (this.language) {
            url += `&language=${this.language}`;
        }
        if (this.region) {
            url += `&region=${this.region}`;
        }
        if (this.version) {
            url += `&v=${this.version}`;
        }
        if (this.mapIds) {
            url += `&map_ids=${this.mapIds.join(",")}`;
        }
        if (this.authReferrerPolicy) {
            url += `&auth_referrer_policy=${this.authReferrerPolicy}`;
        }
        return url;
    }
    deleteScript() {
        const script = document.getElementById(this.id);
        if (script) {
            script.remove();
        }
    }
    /**
     * Load the Google Maps JavaScript API script and return a Promise.
     * @deprecated, use importLibrary() instead.
     */
    load() {
        return this.loadPromise();
    }
    /**
     * Load the Google Maps JavaScript API script and return a Promise.
     *
     * @ignore
     * @deprecated, use importLibrary() instead.
     */
    loadPromise() {
        return new Promise((resolve, reject) => {
            this.loadCallback((err) => {
                if (!err) {
                    resolve(window.google);
                }
                else {
                    reject(err.error);
                }
            });
        });
    }
    importLibrary(name) {
        this.execute();
        return google.maps.importLibrary(name);
    }
    /**
     * Load the Google Maps JavaScript API script with a callback.
     * @deprecated, use importLibrary() instead.
     */
    loadCallback(fn) {
        this.callbacks.push(fn);
        this.execute();
    }
    /**
     * Set the script on document.
     */
    setScript() {
        var _a, _b;
        if (document.getElementById(this.id)) {
            // TODO wrap onerror callback for cases where the script was loaded elsewhere
            this.callback();
            return;
        }
        const params = {
            key: this.apiKey,
            channel: this.channel,
            client: this.client,
            libraries: this.libraries.length && this.libraries,
            v: this.version,
            mapIds: this.mapIds,
            language: this.language,
            region: this.region,
            authReferrerPolicy: this.authReferrerPolicy,
        };
        // keep the URL minimal:
        Object.keys(params).forEach(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (key) => !params[key] && delete params[key]);
        if (!((_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.maps) === null || _b === void 0 ? void 0 : _b.importLibrary)) {
            // tweaked copy of https://developers.google.com/maps/documentation/javascript/load-maps-js-api#dynamic-library-import
            // which also sets the base url, the id, and the nonce
            /* eslint-disable */
            ((g) => {
                // @ts-ignore
                let h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
                // @ts-ignore
                b = b[c] || (b[c] = {});
                // @ts-ignore
                const d = b.maps || (b.maps = {}), r = new Set(), e = new URLSearchParams(), u = () => 
                // @ts-ignore
                h || (h = new Promise((f, n) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    yield (a = m.createElement("script"));
                    a.id = this.id;
                    e.set("libraries", [...r] + "");
                    // @ts-ignore
                    for (k in g)
                        e.set(k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()), g[k]);
                    e.set("callback", c + ".maps." + q);
                    a.src = this.url + `?` + e;
                    d[q] = f;
                    a.onerror = () => (h = n(Error(p + " could not load.")));
                    // @ts-ignore
                    a.nonce = this.nonce || ((_a = m.querySelector("script[nonce]")) === null || _a === void 0 ? void 0 : _a.nonce) || "";
                    m.head.append(a);
                })));
                // @ts-ignore
                d[l] ? console.warn(p + " only loads once. Ignoring:", g) : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
            })(params);
            /* eslint-enable */
        }
        // While most libraries populate the global namespace when loaded via bootstrap params,
        // this is not the case for "marker" when used with the inline bootstrap loader
        // (and maybe others in the future). So ensure there is an importLibrary for each:
        const libraryPromises = this.libraries.map((library) => this.importLibrary(library));
        // ensure at least one library, to kick off loading...
        if (!libraryPromises.length) {
            libraryPromises.push(this.importLibrary("core"));
        }
        Promise.all(libraryPromises).then(() => this.callback(), (error) => {
            const event = new ErrorEvent("error", { error }); // for backwards compat
            this.loadErrorCallback(event);
        });
    }
    /**
     * Reset the loader state.
     */
    reset() {
        this.deleteScript();
        this.done = false;
        this.loading = false;
        this.errors = [];
        this.onerrorEvent = null;
    }
    resetIfRetryingFailed() {
        if (this.failed) {
            this.reset();
        }
    }
    loadErrorCallback(e) {
        this.errors.push(e);
        if (this.errors.length <= this.retries) {
            const delay = this.errors.length * Math.pow(2, this.errors.length);
            console.error(`Failed to load Google Maps script, retrying in ${delay} ms.`);
            setTimeout(() => {
                this.deleteScript();
                this.setScript();
            }, delay);
        }
        else {
            this.onerrorEvent = e;
            this.callback();
        }
    }
    callback() {
        this.done = true;
        this.loading = false;
        this.callbacks.forEach((cb) => {
            cb(this.onerrorEvent);
        });
        this.callbacks = [];
    }
    execute() {
        this.resetIfRetryingFailed();
        if (this.loading) {
            // do nothing but wait
            return;
        }
        if (this.done) {
            this.callback();
        }
        else {
            // short circuit and warn if google.maps is already loaded
            if (window.google && window.google.maps && window.google.maps.version) {
                console.warn("Google Maps already loaded outside @googlemaps/js-api-loader. " +
                    "This may result in undesirable behavior as options and script parameters may not match.");
                this.callback();
                return;
            }
            this.loading = true;
            this.setScript();
        }
    }
}

const START_POSITION = { lat: 52.533108743821984,lng: 13.401136755323181  };
const START_POV = { heading: 0, pitch: 0  };

const initialPosition = JSON.parse(localStorage.getItem('position')) || START_POSITION;

const persistPosition = (position) => localStorage.setItem('position', JSON.stringify(position));

const initialPOV = JSON.parse(localStorage.getItem('POV')) || START_POV;

const persistPOV = (pov) => localStorage.setItem('POV', JSON.stringify(pov));

const EARTH_RADIUS = 6378137;
const KM_TO_MILES = 0.000621371192;

const rad = x => x * Math.PI / 180;

const latLngDist = function(p1, p2, metric) {
  const dLat = rad(p2.lat() - p1.lat());
  const dLong = rad(p2.lng() - p1.lng());

  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat()))
    * Math.sin(dLong / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = EARTH_RADIUS * c;

  if (metric == latLngDist.metrics.MILES) {
    return distanceKm * KM_TO_MILES;
  }

  return distanceKm;
};

latLngDist.metrics = {
  MILES: 0,
  KILOMETERS: 1
};

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
      startTime = 0,
      endTime = Infinity,
    } = data;
    this.position = new LatLng(lat, lng);
    this.src = src;
    this.loop = loop;
    this.gainValue = gain;
    this.rolloffFactor = rolloffFactor;
    this.filterFrequency = filterFrequency,
    this.filterType = filterType,
    this.positionZ = positionZ;
    this.startTime = startTime;
    this.endTime = endTime;

    if (debug) {
      this.marker = new Marker({
        title: this.data.name,
        position: this.position,
        map
      });
    }

    this.context = context;
    this.destination = destination;

    this.abortController = new AbortController();

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
    this.source.loopStart = this.startTime;
    this.source.loopEnd = Math.min(this.buffer.duration, this.endTime);
    this.source.buffer = this.buffer;
    this.source.connect(this.processingChainStart);
    this.source.start(this.context.currentTime, this.startTime);
    this.state = Sound.state.PLAYING;
  }

  suspend() {
    this.source.disconnect();
    this.state = Sound.state.SUSPENDED;
  }

  remove() {
    console.log('removing', this.data.name, this.source);
    if (this.state === Sound.state.LOADING) {
      this.abortController.abort();
    }

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
    const response = await fetch(this.src, { signal: this.abortController.signal });
    const soundData = await response.arrayBuffer();
    if (this.debug) console.info(`loading ${this.src}`);

    try {
      // iOS Safari still doesn't support dAD with promises ¯\_(ツ)_/¯
      const buffer = await this.context.decodeAudioData(
        soundData,
      );

      if (this.state === Sound.state.REMOVED) return;

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
    }

    return distance;
  }

  updateMix(gain) {
    const distance = this.playIfNear();
    if (distance === false) return;
  }
}

// this function converts rotation angles to forward and up vectors
// we use the aircraft terms – HEADING, PITCH, ROLL – to denote axes of rotation
// https://en.wikipedia.org/wiki/Aircraft_principal_axes
//
// we use trigonometric functions to establish relationships between the vectors
// and ensure they each circumscribe a sphere as they rotate
const principalAxesToOrientation = (y = 0, p = 0, r = 0) => {
  const { yaw = 0, pitch = 0, roll = 0 } = typeof y === 'object'
    ? y
    : { yaw: y, pitch: p, roll: r };
  // vector determining which way the listener is facing
  const forward = {};
  // vector determining the rotation of the listener's head
  // where no rotation means the head is pointing up
  const up = {};

  // Yaw (a.k.a. heading) is the rotation around the Y axis
  // convert to radians first
  const yawRad = yaw * (Math.PI / 180);
  // at 0 degrees, the X component should be 0
  //so we calculate it using sin(), which starts at 0
  forward.x = Math.sin(yawRad);
  // at 0 degrees, the Z component should be -1,
  // because the negative Z axis points *away from* the listener
  // so we calculate it using cos(), which starts at 1
  // with a phase shift of 90 degrees (or PI radians)
  forward.z = Math.cos(yawRad + Math.PI);

  // Pitch is the rotation around the X axis
  // we can use it to calculate both vectors' Y components
  const pitchRad = pitch * (Math.PI / 180);
  // Forward Y component should start at 0
  forward.y = Math.sin(pitchRad);
  // Up Y component should start at 1 (top of the head pointing up)
  up.y = Math.cos(pitchRad);

  // Roll is the rotation around the Z axis
  const rollRad = roll * (Math.PI / 180);
  // both X and Y components should start at 0
  // (top of the head pointing directly upwards)
  up.x = Math.sin(rollRad);
  up.z = Math.sin(rollRad);

  return { forward, up };
};

const calculateListenerOrientation = principalAxesToOrientation;

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
    }
    console.log('[sharawadji]', 'adding sound:', sound.name);
    this.sounds.push(this.createSound(sound));
  }
}
window.Sharawadji = Sharawadji;

var archive = [
  {
    "name": "Jakub - bird chirping",
    "lat": 52.532889996389756,
    "lng": 13.401282943281256,
    "src": "https://sound-effects-media.bbcrewind.co.uk/mp3/NHU05050147.mp3",
    "gain": 0.9,
    "loop": true
  },
  {
    "name": "Jakub - kids playground",
    "lat": 52.53266853998643,
    "lng": 13.399975698744258,
    "src": "https://sound-effects-media.bbcrewind.co.uk/mp3/07066049.mp3",
    "gain": 0.3
  },
  {
    "name": "Sam - Spanish speaking",
    "lat": 52.5332595295378,
    "lng": 13.401010905707613,
    "src": "https://sound-effects-media.bbcrewind.co.uk/mp3/07003011.mp3",
    "gain": 0.8,
    "rolloffFactor": 2,
    "filterFrequency": 22000,
    "filterType": "lowpass",
    "startTime": 0,
    "endTime": 120
  },
  {
    "name": "Sam - Police Car",
    "lat": 52.53252294341004,
    "lng": 13.398768909399491,
    "src": "https://sound-effects-media.bbcrewind.co.uk/mp3/07015102.mp3",
    "gain": 0.8,
    "rolloffFactor": 2,
    "filterFrequency": 22000,
    "filterType": "lowpass",
    "startTime": 0,
    "endTime": 120
  },
  {
    "name": "Sam - Work",
    "lat": 52.53252294341004,
    "lng": 13.398768909399491,
    "src": "https://sound-effects-media.bbcrewind.co.uk/mp3/07051161.mp3",
    "gain": 0.8,
    "rolloffFactor": 3,
    "filterFrequency": 22000,
    "filterType": "lowpass",
    "startTime": 0,
    "endTime": 120
  },
  {
    "name": "Sam - Cattle",
    "lat": 52.532234741614,
    "lng": 13.401299345958435,
    "src": "https://sound-effects-media.bbcrewind.co.uk/mp3/NHU05097232.mp3",
    "gain": 0.8,
    "rolloffFactor": 2,
    "filterFrequency": 22000,
    "filterType": "lowpass",
    "startTime": 0,
    "endTime": 120
  },
  {
    "name": "Sam - Market",
    "lat": 52.52978559963359,
    "lng": 13.401666534222658,
    "src": "https://sound-effects-media.bbcrewind.co.uk/mp3/07051169.mp3",
    "gain": 0.8,
    "rolloffFactor": 2,
    "filterFrequency": 22000,
    "filterType": "lowpass",
    "startTime": 50,
    "endTime": 120
  },
  {
    "name": "Edyta - chees",
    "lat": 52.532701170806426,
    "lng": 13.400971583080521,
    "src": "https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/move-check.mp3",
    "gain": 1,
    "rolloffFactor": 2,
    "filterFrequency": 22000,
    "filterType": "lowpass",
    "startTime": 0,
    "endTime": 10
  },
  {
    "name": "Edyta - trees",
    "lat": 52.53246082507303,
    "lng": 13.39984017168954,
    "src": "https://sound-effects-media.bbcrewind.co.uk/mp3/NHU05012151.mp3",
    "gain": 1,
    "rolloffFactor": 2,
    "filterFrequency": 22000,
    "filterType": "lowpass",
    "startTime": 0,
    "endTime": 60
  },
  {
    "name": "Edyta & Thomas - trash",
    "lat": 52.531852,
    "lng": 13.401567,
    "src": "https://social-dynamics.net/soundplaces/trash-can.mp3",
    "gain": 1,
    "rolloffFactor": 2,
    "filterFrequency": 22000,
    "filterType": "lowpass",
    "startTime": 0,
    "endTime": 60
  },
  {
    "name": "Isles - bike bell",
    "lat": 52.533343553543226,
    "lng": 13.399264970431265,
    "src": "https://sound-effects-media.bbcrewind.co.uk/mp3/07037422.mp3",
    "gain": 0.8,
    "rolloffFactor": 2,
    "filterFrequency": 22000,
    "filterType": "lowpass",
    "startTime": 1,
    "endTime": 200
  },
  {
    "name": "Isles - people talking",
    "lat": 52.533324046520555,
    "lng": 13.399340084122096,
    "src": "https://sound-effects-media.bbcrewind.co.uk/mp3/NHU05016063.mp3",
    "gain": 2,
    "rolloffFactor": 2,
    "filterFrequency": 22000,
    "filterType": "lowpass",
    "startTime": 1,
    "endTime": 200
  },
  {
    "name": "Isles - person walking",
    "lat": 52.534272076875844,
    "lng": 13.398117746994187,
    "src": "https://sound-effects-media.bbcrewind.co.uk/mp3/07037005.mp3",
    "gain": 1.5,
    "rolloffFactor": 2,
    "filterFrequency": 1000,
    "filterType": "lowpass",
    "startTime": 5,
    "endTime": 11
  },
  {
    "name": "Isles - traffic sounds",
    "lat": 52.53492902970143,
    "lng": 13.397782524604022,
    "src": "https://sound-effects-media.bbcrewind.co.uk/mp3/07031007.mp3",
    "gain": 0.6,
    "rolloffFactor": 2,
    "filterFrequency": 1000,
    "filterType": "lowpass",
    "startTime": 5,
    "endTime": 200
  },
  {
    "name": "Rachel - free palestine",
    "lat": 52.5325203,
    "lng": 13.3988906,
    "src": "https://finding-gustavo.quest/assets/audio/berlinProtest2.wav",
    "gain": 1,
    "rolloffFactor": 2,
    "filterFrequency": 44000,
    "startTime": 1,
    "endTime": 200
  },
  {
    "name": "Anne - slate",
    "lat": 52.525684,
    "lng": 13.439349,
    "src": "https://finding-gustavo.quest/assets/audio/steppingonslate.mp3",
    "gain": 0.1,
    "rolloffFactor": 2,
    "filterFrequency": 12000,
    "filterType": "lowpass",
    "startTime": 0,
    "endTime": 15
  },
  {
    "name": "Anne - goats",
    "lat": 52.5340062,
    "lng": 13.4034353,
    "src": "https://finding-gustavo.quest/assets/audio/goats.mp3",
    "gain": 0.1,
    "rolloffFactor": 2,
    "filterFrequency": 22000,
    "filterType": "lowpass",
    "startTime": 0,
    "endTime": 15
  },
  {
    "name": "Anne - parmigiana",
    "lat": 52.533359048809416,
    "lng": 13.401018226419366,
    "src": "https://finding-gustavo.quest/assets/audio/parmigiana.mp3",
    "gain": 0.4,
    "rolloffFactor": 2,
    "filterFrequency": 22000,
    "filterType": "lowpass",
    "startTime": 1,
    "endTime": 15
  },
  {
    "name": "Jakub - car noises",
    "lat": 52.533359048809416,
    "lng": 13.401018226419366,
    "src": "https://sound-effects-media.bbcrewind.co.uk/mp3/07066049.mp3",
    "gain": 0.8,
    "rolloffFactor": 2,
    "filterFrequency": 22000,
    "filterType": "lowpass",
    "startTime": 1,
    "endTime": 100
  },
  [
    {
      "name": "Andres - kids laughts",
      "lat": 52.533359048809416,
      "lng": 13.401018226419366,
      "src": "https://soundcloud.com/perez-andres-18997873/svr002",
      "gain": 0.8,
      "rolloffFactor": 2,
      "filterFrequency": 22000,
      "filterType": "lowpass",
      "startTime": 1,
      "endTime": 2
    }
  ],
  {
    "name": "Emeline - cafe noise",
    "lat": 37.77596429178973,
    "lng": -122.49585353220243,
    "src": "https://sound-effects.bbcrewind.co.uk/search?q=07070216",
    "gain": 0.8,
    "rolloffFactor": 2,
    "filterFrequency": 22000,
    "filterType": "lowpass",
    "startTime": 1,
    "endTime": 2
  }
];

const ctx = new AudioContext();
ctx.suspend();

const mapsLoader = new Loader({
  apiKey: 'AIzaSyA1VOiLnJEwz3HzcDxEExa_tCTu5KKOoqQ',
  version: '3.exp',
  libraries: ['streetView'],
});

const { StreetViewPanorama } = await mapsLoader.importLibrary('streetView');
const { LatLng: LatLng$1 } = await mapsLoader.importLibrary('core');
const { Marker: Marker$1 } = await mapsLoader.importLibrary('marker');

Object.assign(window, { LatLng: LatLng$1, Marker: Marker$1 });

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

new Sharawadji(archive, map, { debug: true }, ctx);
// const socket = await createViewerSocket(sharawadji);

const startButton = document.getElementById('start');
const intro = document.getElementById('intro');

const initAudio = async () => {
  intro.hidden = true;
  await ctx.resume();
};

startButton.addEventListener('click', initAudio);

// const update = () => {
//   const sounds = editor.state.doc.toString();

//   try {
//     const parsed = JSON5.parse(sounds);
//     console.log(parsed);
//     socket.send(JSON.stringify({ type: 'update sounds', sounds: parsed }))
//   } catch (err) {
//     console.error(err);
//     alert('This code is not valid JSON, sorry :(');
//   }
// };

// const updateButton = document.getElementById('update');

// updateButton.addEventListener('click', update);

// document.addEventListener('keydown', (event) => {
//   console.log(event);
//   if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
//     event.preventDefault();
//     update();
//   }
// })
