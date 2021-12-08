import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";

const textAreaStyle={
  height:'400px'
};

const buttonStyle = {
  marginLeft:'10px',
  marginTop:'10px',
  marginRight:'10px'
}

class ModalMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            textArea:''
        };
    }

    handleScenariosChange(e){
      //console.log(e.target.value);
      if(e.target.value.length !=0){
        this.setState({
          textArea:JSON.stringify(this.props.botData[e.target.value])
        });
      }
    }
  
    render() {
      let self = this;
      let url = this.props.pasteBinUrl.length == 0? null: <h5>URL created !:<a href={this.props.pasteBinUrl}>{this.props.pasteBinUrl}</a></h5>;
      if(this.props.modalMode == 'EXPORT'){
        return <Modal show={this.props.modalBoolean} onHide={this.props.hideModal} size="lg">
        <Modal.Header>
          <Modal.Title>Export</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You can export your current work by copy pasting the following data. You can then import the bot data later.</p>
          <textarea style={textAreaStyle} className="nes-textarea" defaultValue={JSON.stringify(this.props.bot,null,2)}></textarea>
          <p>If you think that your bot is ready, you can submit your bot to the discord community. Your bot will be reviewed in the discord channel #bot-creation.</p>
          {url}
        </Modal.Body>
        <Modal.Footer>
          <button style={buttonStyle} className='nes-btn is-error' onClick={this.props.hideModal}>Cancel</button>
          <button style={buttonStyle} className='nes-btn is-success' onClick={()=>{
              this.props.createBot(this.props.bot);
            }}>Submit your bot
          </button>
        </Modal.Footer>
        </Modal>;
      }
      else if(this.props.modalMode == 'IMPORT'){
        return <Modal show={this.props.modalBoolean} onHide={this.props.hideModal} size="lg">
        <Modal.Header>
          <Modal.Title>Import</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>Get started with an existing BOT or paste your own BOT data</p>
        <div className="nes-field is-inline" style={{marginBottom:'10px'}}>
          <label htmlFor="default_select">Existing BOT</label>
          <div className="nes-select">
          <select defaultValue="" onChange={this.handleScenariosChange.bind(this)} id="default_select">
              <option value="" hidden>Select...</option>
              {Object.keys(this.props.botData).sort((a,b)=>{return this.props.botData[a].avatar.localeCompare(this.props.botData[b].avatar)}).map(key=>{
                  return <option key={key} value={key}>{this.props.botData[key].avatar}</option>;
              })};
          </select>
          </div>
        </div>
          <textarea style={textAreaStyle} value={this.state.textArea} onChange={(e)=>{this.setState({textArea:e.target.value})}} className="nes-textarea"></textarea>
        </Modal.Body>
        <Modal.Footer>
          <button style={buttonStyle} className='nes-btn is-error' onClick={this.props.hideModal}>Cancel</button>
          <button style={buttonStyle} className='nes-btn is-success' onClick={()=>{this.props.import(self.state.textArea)}}>Import</button>
        </Modal.Footer>
        </Modal>;
      }
      else{
          return null;
      }

  }
}
export default ModalMenu;
