import React, { useEffect } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { Link } from 'react-router-dom'
import 'firebaseui/dist/firebaseui.css'
import { useAppSelector, useAppDispatch } from '../../../hooks'
import {logIn, logOut} from '../../../stores/NetworkStore'
import { FIREBASE_CONFIG } from '../../utils/utils'

export default function Login(){
  const dispatch = useAppDispatch()
  const uid = useAppSelector(state=>state.network.uid)
  const displayName = useAppSelector(state=>state.network.displayName)

  const uiConfig = {
    // Popup signin flow rather than Navigate flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid Navigates after sign-in.
      signInSuccessWithAuthResult: () => false,
    },
  }

  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG)
  } 

  useEffect(()=>{
    firebase.auth().onAuthStateChanged(u => {
      if(u){
        dispatch(logIn(u))
      }
    })
  })

  if (!uid) {
    return (
    <div id="play-panel">
        <p>Login</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div> 
    )
  }
  else{
      return(
      <div id="play-panel">
          <p>Login</p>
          <p>Welcome {displayName}! You are now signed-in!</p>
          <div style={{
              display:'flex',
              justifyContent:'space-evenly'
          }}>
          <Link to={'/lobby'}>
              <button className="nes-btn is-success">
                  Join Lobby
              </button>
          </Link>
          <button className="nes-btn is-error" onClick={() => {firebase.auth().signOut(); dispatch(logOut())}}>Sign-out</button>
          </div>
      </div>
      )
  }
}