import React, { Component, Fragment } from 'react';
import logo from "./../logo.svg";
import "./Header.css";
import Login from "../Spotify/Login.js";

export default class IntroScreen extends Component {
  buttonClick() {
    Login.logInWithSpotify();
  }

  render() {
    return (
      <header className="App-header">
        <button onClick={this.buttonClick}>Login</button>
      </header>
    );
  }
}
