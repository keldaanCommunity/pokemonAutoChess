import React, { Component } from 'react';


class Modal extends Component {
  render() {
    return (
        <div id="modal-popup" className="modal" tabindex="-1" role="dialog">
        <div className="modal-dialog" role="document"  style={{backgroundColor: 'rgba(255, 255, 255, .6)'}}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 id ="modal-title" className="modal-title">Modal title</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p id="modal-info">Modal body text goes here.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="nes-btn is-primary" data-dismiss="modal" style={{marginRight: '10px'}}>Stay</button>
              <button type="button" id="leave-button" className="nes-btn is-error">Leave</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Modal;
