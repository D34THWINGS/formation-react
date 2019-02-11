import React, { Component } from 'react';
import './App.css';
import Menu from './components/Menu';
import HousesList from './components/HousesList';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Menu />
        <HousesList />
      </div>
    );
  }
}

export default App;
