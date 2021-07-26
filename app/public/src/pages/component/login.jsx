import React, { Component } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Link } from 'react-router-dom';
import 'firebaseui/dist/firebaseui.css'


class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            isSignedIn : false
        };
        this.firebaseConfig = {
            apiKey: "AIzaSyCjMpYJycJTjOsXPM1CJn8olntPQhpysOI",
            authDomain: "pokemonautochess-b18fb.firebaseapp.com",
            projectId: "pokemonautochess-b18fb",
            storageBucket: "pokemonautochess-b18fb.appspot.com",
            messagingSenderId: "448759785030",
            appId: "1:448759785030:web:bc2f21a25ab9e43a894c47"
          };        
          // Configure FirebaseUI.
        this.uiConfig = {
          // Popup signin flow rather than redirect flow.
          signInFlow: 'popup',
          // We will display Google and Facebook as auth providers.
          signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID
          ],
          callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => false,
          },
        };
          
        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(this.firebaseConfig);
        } 

        firebase.auth().onAuthStateChanged(user => {
          this.setState({isSignedIn: !!user});
      });
    }

  render() {
  
    if (!this.state.isSignedIn) {
        return (
        <div id="play-panel" className="nes-container with-title is-centered" style={{
            backgroundColor: 'rgba(255, 255, 255, .6)',
            width:'400px',
            height:'250px',
            position:'absolute',
            top:'50%',
            left:'50%',
            marginLeft:'-200px',
            marginTop:'-125px'
            }}>
            <p className="title">Authentification</p>
            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
        </div> 
        );
    }
    else{
        //console.log(firebase.auth().currentUser);
        return(
        <div id="play-panel" className="nes-container with-title is-centered" style={{
            backgroundColor: 'rgba(255, 255, 255, .6)',
            position:'absolute',
            top:'50%',
            left:'50%',
            width:'700px',
            height:'170px',
            marginTop:'-85px',
            marginLeft:'-350px'
            }}>
            <p className="title">Authentification</p>
            <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
            <div style={{
                display:'flex',
                justifyContent:'space-evenly'
            }}>
            <Link to={'./lobby'}>
                <button className="nes-btn is-success">
                    Join Lobby
                </button>
            </Link>
            <button className="nes-btn is-error" onClick={() => firebase.auth().signOut()}>Sign-out</button>
            </div>
        </div>
        )
    }
  }
}
export default Login;
