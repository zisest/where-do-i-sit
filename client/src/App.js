import React from 'react'
import {BrowserRouter as Router, Link, Route, Switch, useLocation, Redirect, } from 'react-router-dom';

import ChooseStationWindow from './ChooseStationWindow'
import StationTimetable from './StationTimetable'
import Gallery from './Gallery'
import CarScheme from './CarScheme'

import './styles/App.css' 

import {ReactComponent as Logo} from './images/Logo.svg'


//delete

import Car1 from './images/car_schemes/car1.svg.js'
import Car2  from './images/car_schemes/car2.svg.js'
import Car3  from './images/car_schemes/car3.svg.js'
import Car4  from './images/car_schemes/car4.svg.js'
import Car5  from './images/car_schemes/car5.svg.js'

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
          <Route render={() => <Redirect to="/"/>} />
        </Switch>
        
      </div>
      </div>
  )
}

export default App
