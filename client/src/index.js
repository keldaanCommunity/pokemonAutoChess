import _ from 'lodash';
import * as Colyseus from "colyseus.js";

var client = new Colyseus.Client('ws://localhost:2567');

client.joinOrCreate("my_room", {/* options */}).then(room => {
    console.log("joined successfully", room);

    room.onStateChange((state) => {
      document.getElementById("timer").textContent = state.world.time;
    });

    room.onMessage((message) => {
      console.log(client.id, "received on", room.name, message);
    });

    room.onError(() => {
      console.log(client.id, "couldn't join", room.name);
    });

    room.onLeave(() => {
      console.log(client.id, "left", room.name);
    });
  }).catch(e => {
    console.error("join error", e);
  });
