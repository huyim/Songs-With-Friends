import React, { Component, Fragment } from 'react';
import Login from '../Spotify/Login.js';
import './Intro.css';

export default class IntroScreen extends Component {
  buttonClick() {
    Login.logInWithSpotify();
  };

//  links = {
//    announcement: "https://beta.developer.spotify.com/community/news/2017/11/20/announcing-the-new-spotify-web-playback-sdk-beta/",
//    create_react_app: "https://github.com/facebookincubator/create-react-app",
//    glitch: "https://glitch.com/edit/#!/spotify-web-playback-react"
//  };

  render() {
    return (

      <Fragment>

        <hr />
        <p class="Main"><strong>Welcome to Song with Friends</strong></p>
        <p class="Text"> Sit back, relax, and let your friends queue the music!</p>
        
        <button class="main-but" onClick={this.buttonClick}>Login with Spotify</button>

      </Fragment>
    );
  };
}