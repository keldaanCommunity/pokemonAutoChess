import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { IBot } from '../../../../../models/mongo-models/bot-v2'
import { ModalMode } from '../../../../../types'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { requestBotData } from '../../../stores/NetworkStore'

const textAreaStyle={
  height:'400px'
}

const buttonStyle = {
  marginLeft:'10px',
  marginTop:'10px',
  marginRight:'10px'
}

export default function ModalMenu(  props:{
  showModal: (mode: ModalMode) => void,
  bot: IBot,
  hideModal: () => void,
  modalMode: ModalMode,
  importBot: (text: string) => void,
  pasteBinUrl: string,
  createBot: () => void,
  botData: IBot,
  modalBoolean: boolean
}) {
    useEffect(()=>{
      if(props.botData?.avatar){
        handleTextAreaChange(JSON.stringify(props.botData))
      }
    },[props.botData])
    const dispatch = useAppDispatch()
    const botList: {name: string, avatar: string}[] = useAppSelector(state=>state.lobby.botList)
    const url = props.pasteBinUrl.length == 0? null: <h5>URL created !:<a href={props.pasteBinUrl}>{props.pasteBinUrl}</a></h5>
    const [textArea, handleTextAreaChange] = useState<string>('')
    if(props.modalMode == ModalMode.EXPORT){
      return <Modal show={props.modalBoolean} onHide={props.hideModal} size="lg">
      <Modal.Header>
        <Modal.Title>Export</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>You can export your current work by copy pasting the following data. You can then import the bot data later.</p>
        <textarea style={textAreaStyle} className="nes-textarea" defaultValue={JSON.stringify(props.bot,null,2)}></textarea>
        <p>If you think that your bot is ready, you can submit your bot to the discord community. Your bot will be reviewed in the discord channel #bot-creation.</p>
        {url}
      </Modal.Body>
      <Modal.Footer>
        <button style={buttonStyle} className='bubbly-error' onClick={props.hideModal}>Cancel</button>
        <button style={buttonStyle} className='bubbly-success is-success' onClick={()=>{
            props.createBot()
          }}>Submit your bot
        </button>
      </Modal.Footer>
      </Modal>
    }
    else if(props.modalMode == ModalMode.IMPORT){
      return <Modal show={props.modalBoolean} onHide={props.hideModal} size="lg">
      <Modal.Header>
        <Modal.Title>Import</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <p>Get started with an existing BOT or paste your own BOT data</p>
      <div className="nes-field is-inline" style={{marginBottom:'10px'}}>
        <label htmlFor="default_select">Existing BOT</label>
        <div className="nes-select">
        <select defaultValue="" onChange={(e)=>{
          if(e.target.value.length !=0){
            dispatch(requestBotData(e.target.value))
          }
        }} id="default_select">
            <option value="" hidden>Select...</option>
            {botList.map((bot) => <option key={bot.avatar} value={bot.avatar}>{bot.name}</option>)}
        </select>
        </div>
      </div>
        
        <textarea style={textAreaStyle} value={textArea} onChange={(e)=>{handleTextAreaChange(e.target.value)}} className="nes-textarea"></textarea>
      
      </Modal.Body>
      <Modal.Footer>
        <button style={buttonStyle} className='bubbly-error' onClick={props.hideModal}>Cancel</button>
        <button style={buttonStyle} className='bubbly-success is-success' onClick={()=>{props.importBot(textArea)}}>Import</button>
      </Modal.Footer>
      </Modal>
    }
    else{
        return null
    }
}
/*
    constructor(props:{

    }){
        super(props);
        state = {
          textArea: ''
        };
    }

    handleScenariosChange(e){
      if(e.target.value.length !=0){
        props.requestBotData(e.target.value)
      }
    }

    handleTextAreaChange(e){
      setState({
        textArea: e.target.value
      })
    }

    convertBotDataToJSON(){
      return JSON.stringify(props.botData)
    }

    componentDidUpdate(prevProps, prevState){
      if(prevProps.botData.avatar != props.botData.avatar){

        setState({
          textArea: JSON.stringify(props.botData)
        })
      }
    }
*/