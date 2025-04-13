const START_POSITION = { lat: 52.533108743821984,lng: 13.401136755323181  };
const START_POV = { heading: 0, pitch: 0  };

export const initialPosition = JSON.parse(localStorage.getItem('position')) || START_POSITION;

export const persistPosition = (position) => localStorage.setItem('position', JSON.stringify(position))

export const initialPOV = JSON.parse(localStorage.getItem('POV')) || START_POV;

export const persistPOV = (pov) => localStorage.setItem('POV', JSON.stringify(pov))
