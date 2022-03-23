import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";

const buttonStyle = {
  marginLeft:'10px',
  marginTop:'10px',
  marginRight:'10px'
}

class GameModal extends Component {
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
      return <Modal show={this.props.modalBoolean} onHide={this.props.hideModal}>
      <Modal.Header>
        <Modal.Title>{this.props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{this.props.info}</p>
      </Modal.Body>
      <Modal.Footer>
        <button style={buttonStyle} className='nes-btn is-primary' onClick={this.props.hideModal}>Cancel</button>
        <button style={buttonStyle} className='nes-btn is-error' onClick={this.props.leave}>Leave</button>
      </Modal.Footer>
      </Modal>;
  }
}
export default GameModal;
