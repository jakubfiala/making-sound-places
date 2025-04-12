import fs from 'fs/promises';

const PATH = './sounds.json';

export const sounds = JSON.parse(await fs.readFile(PATH));
console.info('Loaded sounds JSON file');

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
