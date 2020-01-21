import React from 'react'
import {BrowserRouter as Router, Link, Route, Switch, useLocation, } from 'react-router-dom';

import ChooseStationWindow from './ChooseStationWindow'
import StationTimetable from './StationTimetable'

import './styles/App.css' 

import {ReactComponent as Logo} from './svg/Logo.svg'

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  let query = useQuery()

  return (
      <div className="app">
      <header className="header">
          <div className="logo">
            <Link to="/"><Logo /></Link>       
          </div>
      </header>
      <div className="main-area">
        <Switch>          
          <Route path="/timetable" render={() => <StationTimetable query={query.get("station")} />} />
          <Route exact path="/" component={ChooseStationWindow} />
        </Switch>
        
      </div>
      </div>
  )
}

export default App
