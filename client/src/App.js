import React from 'react'
import ChooseStationWindow from './ChooseStationWindow'

import './styles/App.css' 

import {ReactComponent as Logo} from './svg/Logo.svg'


function App() {
  return (
    <div className="app">
    <header className="header">
        <div className="logo">
          <Logo />          
        </div>
    </header>
    <div className="main-area">
      <ChooseStationWindow />    
    </div>

    </div>
  )
}

export default App
