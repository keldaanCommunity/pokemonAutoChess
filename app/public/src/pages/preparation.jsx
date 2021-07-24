import React, { Component } from 'react';
import Chat from './chat/chat';
import firebase from 'firebase/app';
import PreparationMenu from './preparation-menu';

class Preparation extends Component {

    constructor(props){
        super(props);
        this.room = window._room;
        this.uid = firebase.auth().currentUser.uid;
        this.id = this.props.match.params.id;

        this.state = {
            messages: [],
            users: {},
            user:{},
            currentText: ''
        };

        this.room.onMessage('messages', (message) => {
            this.setState({
                messages: this.state.messages.concat(message)
            });
        });

        this.room.state.users.onAdd = (u) => {
            if(u.id == this.uid){
                this.setState({user: u});
            }
            this.setState({users: this.room.state.users})
        };
    }

    handleSubmit (e) {
        e.preventDefault();
        this.sendMessage(this.state.currentText);
        this.setState({currentText: ""});
    }
    
    setCurrentText (e) {
        e.preventDefault();
        this.setState({ currentText: e.target.value });
    }

    sendMessage(payload){
        this.room.send('new-message', {'name': this.state.user.name, 'payload': payload, 'avatar':this.state.user.avatar });
    }

    addBot(){
        this.room.send('addBot');
    }

    removeBot(){
        this.room.send('removeBot');
    }
    toggleReady(){
        this.room.send('toggle-ready');
    }

  render() {
    return (
        <div className="App" style={{
            display:'flex',
            justifyContent:'space-between'
        }}>
            <PreparationMenu
                id={this.id}
                users={this.state.users}
                addBot={this.addBot.bind(this)}
                removeBot={this.removeBot.bind(this)}
                toggleReady={this.toggleReady.bind(this)}
            />
            <Chat 
                messages={this.state.messages}
                handleSubmit={this.handleSubmit.bind(this)} 
                setCurrentText={this.setCurrentText.bind(this)}
                currentText={this.state.currentText}
            />
        </div>
    );
  }
}
export default Preparation;
