import fs from 'fs/promises';
import { existsSync } from 'path';

const PATH = './sounds.json';

let sounds = [
  {"name":"Jakub - bird chirping","lat":52.532889996389756,"lng":13.401282943281256,"src":"https://sound-effects-media.bbcrewind.co.uk/mp3/NHU05050147.mp3","gain":0.9,"loop":true},
];

try {
  sounds = JSON.parse(await fs.readFile(PATH));
} catch (err) {}

console.info('Loaded sounds JSON file', sounds);

const persist = () => {
  console.info('Persisting.');
  fs.writeFile(PATH, JSON.stringify(sounds, null, 2));
};

export const update = (newSounds) => {
  newSounds.forEach((sound) => {
    const index = sounds.findIndex(s => s.name === sound.name);

    if (index != -1) {
      console.log('replacing sound at', index);
      sounds.splice(index, 1);
    };

    console.log('adding sound:', sound.name);
    sounds.push(sound);
  });

  persist();
};
