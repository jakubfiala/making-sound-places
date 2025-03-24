// This line loads some helper code for our playground, and the `compose` function.
import { compose } from 'https://www.fiala.space/making-sound-places/playground.js';

// 1 -----------------------------------------------------------------------------------------
compose((context) => {
  // Create a new Oscillator and pass it some parameters.
  const oscillator = new OscillatorNode(context, { type: 'sine', frequency: 440 });
  // Start producing sound.
  oscillator.start();
  // This line returns the oscillator so it can be connected to the audio output,
  // i.e. speakers or headphones.
  return oscillator;
});

// // 2 -----------------------------------------------------------------------------------------
// compose((context) => {
//   // Create and start an oscillator, just like before.
//   const oscillator = new OscillatorNode(context, { type: 'sine', frequency: 440 });
//   oscillator.start();
  
//   // Create a GainNode - this allows us to control the gain, i.e. amplitude of sound.
//   const gainControl = new GainNode(context);
//   // Connect the oscillator to it.
//   oscillator.connect(gainControl);
  
//   // First, we set the initial value.
//   gainControl.gain.setValueAtTime(0, context.currentTime);
//   // Then we schedule a "linear ramp", which just means a gradual change to the given value.
//   // In this case, we go from previous value (0) to 1 in 0.01 seconds, i.e. 10 milliseconds.
//   // This is the Attack phase of our envelope.
//   gainControl.gain.linearRampToValueAtTime(1, context.currentTime + 0.01);
//   // Then we proceed to the Decay phase - getting slightly quieter till we reach the 100ms mark.
//   gainControl.gain.linearRampToValueAtTime(0.9, context.currentTime + 0.1);
//   // Sustain the value at 0.9 until 500ms into our timeline.
//   gainControl.gain.linearRampToValueAtTime(0.9, context.currentTime + 0.5);
//   // Then Release - fade out to 0 until we reach the 6-second mark.
//   gainControl.gain.linearRampToValueAtTime(0, context.currentTime + 6);
  
//   // We connect our Gain node to the output.
//   return gainControl;
// });

// // 3 -----------------------------------------------------------------------------------------
// compose((context) => {
//   // Create and start an oscillator, just like before.
//   const oscillator = new OscillatorNode(context, { type: 'sine', frequency: 440 });
//   oscillator.start();
//   // Our Gain envelope from before.
//   const gainControl = new GainNode(context);
//   oscillator.connect(gainControl);
//   gainControl.gain.setValueAtTime(0, context.currentTime);
//   gainControl.gain.linearRampToValueAtTime(1, context.currentTime + 0.01);
//   gainControl.gain.linearRampToValueAtTime(0.9, context.currentTime + 0.1);
//   gainControl.gain.linearRampToValueAtTime(0.9, context.currentTime + 0.5);
//   gainControl.gain.linearRampToValueAtTime(0, context.currentTime + 3);
  
//   // Now we create another envelope, but this time we'll change the Oscillator's frequency
//   oscillator.frequency.setValueAtTime(440, context.currentTime);
//   oscillator.frequency.linearRampToValueAtTime(460, context.currentTime + 0.01);
//   oscillator.frequency.linearRampToValueAtTime(440, context.currentTime + 0.1);
//   oscillator.frequency.linearRampToValueAtTime(440, context.currentTime + 0.5);
//   oscillator.frequency.linearRampToValueAtTime(110, context.currentTime + 3);
  
//   // We connect our Gain node to the output.
//   return gainControl;
// });


// // 4 -----------------------------------------------------------------------------------------
// compose((context) => {
//   // Create and start an oscillator, just like before.
//   const oscillator = new OscillatorNode(context, { type: 'sine', frequency: 440 });
//   oscillator.start();
//   // Now we create ANOTHER oscillator, which has a very low frequency (lower than our audible range, i.e. 16Hz)
//   const modulator = new OscillatorNode(context, { type: 'sine', frequency: 3 });
//   // We also need a GainNode to control how much the frequency will be modulated.
//   // Let's set it to modulate by 10 (because we're modulating frequency, it's 10Hz).
//   const modulatorControl = new GainNode(context, { gain: 10 });
//   modulator.start();
//   // Connect to the first Oscillator's `frequency` parameter.
//   modulator
//     .connect(modulatorControl)
//     .connect(oscillator.frequency);
  
//   return oscillator;
// });


// // 5 -----------------------------------------------------------------------------------------
// compose((context) => {
//   // Create and start an oscillator, just like before.
//   const oscillator = new OscillatorNode(context, { type: 'sine', frequency: 440 });
//   oscillator.start();
//   // We first make a gain control for our oscillator.
//   const gainControl = new GainNode(context, { gain: 0 });
//   oscillator.connect(gainControl);
//   // Now we create a modulator oscillator like before ...
//   const modulator = new OscillatorNode(context, { type: 'sine', frequency: 0.5 });
//   modulator.start();
//   // ... but we connect it to the gain control's `gain` parameter.
//   modulator.connect(gainControl.gain);
//   // we want to hear the output of `gainControl`, so return it.
//   return gainControl;
// });

// // 6 -----------------------------------------------------------------------------------------
// compose((context) => {
//   // Create and start an oscillator, but we set its type to different values
//   const oscillator = new OscillatorNode(context, { type: 'square', frequency: 440 });
//   oscillator.start();
//   return oscillator;
// });

// // 7 -----------------------------------------------------------------------------------------
// compose((context) => {
//   // We now use a NoiseNode which I prepared, because Web Audio doesn't come with it.
//   // It's not too complex to program though - here's the code: 
//   // https://github.com/jakubfiala/making-sound-places/blob/main/playground.js#L77
//   const noise = new NoiseNode(context, {});
//   noise.start();
//   return noise;
// });

// // 8 -----------------------------------------------------------------------------------------
// compose((context) => {
//   const noise = new NoiseNode(context, {});
//   noise.start();
//   // This will be the node where we add up all our formants.
//   // Let's also use it to boost the signal a bit, 
//   // since we'll be filtering out a lot of the original noise.
//   const output = new GainNode(context, { gain: 3 });
//   // Create each filter node - the "Biquad" is a specific kind of filter implementation, we don't have to worry about it.
//   // We set the frequency and some other parameters - `Q` determines how "accurate" the filtering is.
//   const formant1 = new BiquadFilterNode(context, { frequency: 440, gain: 5, Q: 100, type: 'bandpass' });
//   // Connect the nodes together.
//   noise.connect(formant1).connect(output);
  
//   const formant2 = new BiquadFilterNode(context, { frequency: 440 * 3, gain: 5, Q: 100, type: 'bandpass' });
//   noise.connect(formant2).connect(output);
  
//   const formant3 = new BiquadFilterNode(context, { frequency: 440 * 5, gain: 5, Q: 100, type: 'bandpass' });
//   noise.connect(formant3).connect(output);
  
//   return output;
// });

// // 9 -----------------------------------------------------------------------------------------
// compose((context) => {
//   // Create and start an oscillator, but we set its type to different values
//   const oscillator = new OscillatorNode(context, { type: 'square', frequency: 220 });
//   oscillator.start();
  
//   const filter = new BiquadFilterNode(context, { frequency: 800, Q: 1, gain: 2, type: 'lowpass' });
//   // Connect the nodes together.
//   oscillator.connect(filter);
  
//   return filter;
// });

// // 10 -----------------------------------------------------------------------------------------
// compose((context) => {
//   const oscillator = new OscillatorNode(context, { type: 'sine', frequency: 440 });
//   oscillator.start();
 
//   const gainControl = new GainNode(context);
//   oscillator.connect(gainControl);
  
//   gainControl.gain.setValueAtTime(0, context.currentTime);
  
//   setInterval(() => {
//     gainControl.gain.setValueAtTime(0, context.currentTime);
//     gainControl.gain.linearRampToValueAtTime(1, context.currentTime + 0.005);
//     gainControl.gain.linearRampToValueAtTime(0, context.currentTime + 3);
//   }, 2000);
  
//   // We connect our Gain node to the output.
//   return gainControl;
// });


// // 11 -----------------------------------------------------------------------------------------
// compose((context) => {
//   // Create an oscillator and gain control, like before.
//   const oscillator = new OscillatorNode(context, { type: 'sine', frequency: 440 });
//   oscillator.start();
//   const gainControl = new GainNode(context);
//   gainControl.gain.setValueAtTime(0, context.currentTime);
//   oscillator.connect(gainControl);
  
//   // Prepare some frequency values to randomly choose from.
//   const notes = [440, 660, 220, 330, 550];
  
//   // Make a function that plays a note and schedules the next one.
//   const playNote = () => {
//     // Set the oscillator's frequency to a randomly chosen note.
//     oscillator.frequency.setValueAtTime(choose(notes), context.currentTime);
//     // Start our envelope (this time, a shorter, simpler one - just attack and release)
//     gainControl.gain.setValueAtTime(0, context.currentTime + 0.005);
//     gainControl.gain.linearRampToValueAtTime(1, context.currentTime + 0.01);
//     // Vary the release randomly (between 500ms and 5.5 seconds).
//     gainControl.gain.linearRampToValueAtTime(0, context.currentTime + Math.random() * 5 + 0.5);
//     // Schedule the next note at a randomly chosen time from now (between 500ms and 1 second).
//     setTimeout(playNote, Math.random() * 1000 + 500);
//   };
  
//   // Schedule the first note.
//   playNote();
  
//   // We connect our Gain node to the output.
//   return gainControl;
// });


// // 12 -----------------------------------------------------------------------------------------
// compose((context) => {
//   const oscillator = new OscillatorNode(context, { type: 'sine', frequency: 440 });
//   oscillator.start();
//   const gainControl = new GainNode(context);
//   gainControl.gain.setValueAtTime(0, context.currentTime);
//   oscillator.connect(gainControl);
  
//   const notes = [440, 660, 220, 330, 550];

//   const playNote = () => {
//     oscillator.frequency.setValueAtTime(choose(notes), context.currentTime);
//     gainControl.gain.setValueAtTime(0, context.currentTime + 0.005);
//     gainControl.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.01);
//     gainControl.gain.linearRampToValueAtTime(0, context.currentTime + Math.random() * 5 + 0.5);
//     setTimeout(playNote, Math.random() * 1000 + 500);
//   };
  
//   // Schedule the first note.
//   playNote();
  
//   const delay = new DelayNode(context, { delayTime: 0.5 });
//   const delayFeedback = new GainNode(context, { gain: 0.5 });
//   const delayFilter = new BiquadFilterNode(context, { frequency: 1000, type: 'lowpass' });
  
//   gainControl
//     .connect(delay)
//     .connect(delayFilter)
//     .connect(delayFeedback)
//     .connect(delay);
  
//   // We connect our Gain node to the output.
//   return delay;
// });
