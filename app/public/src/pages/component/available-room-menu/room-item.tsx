import { RoomAvailable } from 'colyseus.js';
import React from 'react';

export default function RoomItem(props: {room: RoomAvailable, click: (id: string)=>Promise<void>}) {
  return <div className='nes-container' style={{display:'flex', padding:'10px', backgroundColor:'rgba(255,255,255,1)', alignItems:'baseline', justifyContent: 'space-between', marginTop:'10px'}}>
      <h5>{props.room.roomId.slice(0,3)}</h5>
      <h5>{props.room.clients}/{props.room.maxClients}</h5>
      <button className='nes-btn is-warning'  onClick={()=>{props.click(props.room.roomId)}}>Join</button>
  </div>
}