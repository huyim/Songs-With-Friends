import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const clientId = "7f53c173de7049b6bc107e545a49e8fe";
const redirectUri = "https://ecs162-spotify.glitch.me/auth/spotify/callback";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Welcome to Song with Friends
          </p>
          <p>
            Sit back, relax, and let your friends queue the music!
          </p>
          <a id="justConnect" href="/auth/spotify">Login with Spotify</a>
        </header>      
      </div>
    );
  }
}

export default App;
