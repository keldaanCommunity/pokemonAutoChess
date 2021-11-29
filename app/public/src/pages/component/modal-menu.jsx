import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";

class ModalMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            textArea:''
        };
    }
  
    render() {
      let self = this;
      if(this.props.modalMode == 'EXPORT'){
        return <Modal show={this.props.modalBoolean} onHide={this.props.hideModal} size="lg">
        <Modal.Header>
          <Modal.Title>Export</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea className="nes-textarea" defaultValue={JSON.stringify(this.props.steps,null,2)}></textarea>
        </Modal.Body>
        <Modal.Footer>
          <button className='nes-btn is-error' onClick={this.props.hideModal}>Cancel</button>
          <button className='nes-btn is-success'>Submit your bot</button>
        </Modal.Footer>
        </Modal>;
      }
      else if(this.props.modalMode == 'IMPORT'){
        return <Modal show={this.props.modalBoolean} onHide={this.props.hideModal} size="lg">
        <Modal.Header>
          <Modal.Title>Import</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea onChange={(e)=>{this.setState({textArea:e.target.value})}} className="nes-textarea"></textarea>
        </Modal.Body>
        <Modal.Footer>
          <button className='nes-btn is-error' onClick={this.props.hideModal}>Cancel</button>
          <button className='nes-btn is-success' onClick={()=>{this.props.import(self.state.textArea)}}>Import</button>
        </Modal.Footer>
        </Modal>;
      }
      else{
          return null;
      }

  }
}
export default ModalMenu;
