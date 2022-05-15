import { RoomAvailable } from 'colyseus.js'
import React from 'react'
import { IPreparationMetadata } from '../../../../../types'

export default function RoomItem(props: {room: RoomAvailable<IPreparationMetadata>, click: (id: string)=>Promise<void>}) {
  return <div className='nes-container' style={{display:'flex', padding:'10px', backgroundColor:'rgba(255,255,255,1)', alignItems:'center', justifyContent: 'space-between', marginTop:'10px'}}>
      <h5 style={{textAlign:'center'}}>{props.room.metadata?.name}</h5>
      <div style={{display:'flex', flexFlow: 'column', alignItems: 'center'}}>
        <h5>{props.room.clients}/{props.room.maxClients}</h5>
        <button className='nes-btn is-success'  onClick={()=>{props.click(props.room.roomId)}}>Join</button>
      </div>
  </div>
}