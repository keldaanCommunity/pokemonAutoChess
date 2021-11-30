import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";

const textAreaStyle={
  height:'500px'
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
  
    render() {
      let self = this;
      let url = this.props.pasteBinUrl.length == 0? null: <h5>URL created !:<a href={this.props.pasteBinUrl}>{this.props.pasteBinUrl}</a></h5>;
      if(this.props.modalMode == 'EXPORT'){
        return <Modal show={this.props.modalBoolean} onHide={this.props.hideModal} size="lg">
        <Modal.Header>
          <Modal.Title>Export</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea style={textAreaStyle} className="nes-textarea" defaultValue={JSON.stringify(this.props.bot,null,2)}></textarea>
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
          <textarea style={textAreaStyle} onChange={(e)=>{this.setState({textArea:e.target.value})}} className="nes-textarea"></textarea>
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
