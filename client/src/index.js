import _ from 'lodash';
import * as Colyseus from "colyseus.js";

function component() {
    const element = document.createElement('div');
  
    element.innerHTML = _.join(['Hello', 'webpack tutorial complete'], ' ');
  
    return element;
  }
  
var client = new Colyseus.Client('ws://localhost:2567');

client.joinOrCreate("my_room", {/* options */}).then(room => {
    console.log("joined successfully", room);
  }).catch(e => {
    console.error("join error", e);
  });

  document.body.appendChild(component());