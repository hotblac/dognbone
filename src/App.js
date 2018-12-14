import React, { Component } from 'react';
import './App.css';
import {Dialler} from "./Dialler";
import 'bulma/css/bulma.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Dialler/>
        </header>
      </div>
    );
  }
}

export default App;
