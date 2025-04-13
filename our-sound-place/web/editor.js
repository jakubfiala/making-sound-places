import { EditorView, basicSetup } from "codemirror"
import { json } from "@codemirror/lang-json"
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorState } from "@codemirror/state";

const defaultCode = `[

]
`;

const exampleCode = `[
  // Copy the object below and customise it as you like!
  {
    // Make sure to start with your name(s) and make the sound name unique
    "name": "Jakub - car noises",
    // Get latitude and longitude by right-clicking on google maps
    "lat": 52.533359048809416,
    "lng": 13.401018226419366,
    // Can be any URL of a sound, ideally mp3
    "src": "https://sound-effects-media.bbcrewind.co.uk/mp3/07066049.mp3",
    "gain": 0.8,
    // the higher, the quicker the sound fades as you move away from it
    "rolloffFactor": 2,
    "filterFrequency": 22000, // in Hertz
    "filterType": "lowpass", // see notes from Week 2 re: filter types
    "startTime": 1, // start 1 second into the recording
    "endTime": 2, // end 2 seconds into the recording
  },
]`;

const exampleView = new EditorView({
  parent: document.getElementById('example'),
  doc: exampleCode,
  extensions: [EditorState.readOnly.of(true), basicSetup, json(), oneDark]
});

export default new EditorView({
  parent: document.getElementById('editor'),
  doc: localStorage.getItem('code') || defaultCode,
  extensions: [
    basicSetup,
    json(),
    oneDark,
    EditorView.updateListener.of((v) => {
      if (v.docChanged) {
        localStorage.setItem('code', v.state.doc.toString())
      }
    })
  ]
});
