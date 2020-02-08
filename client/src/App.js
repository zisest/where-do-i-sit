import React from 'react'
import {BrowserRouter as Router, Link, Route, Switch, useLocation, } from 'react-router-dom';

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
          <Route path="/gallery" render={()=> <Gallery>
              <CarScheme carSvg={Car1} carNum={1} carLayout={'63987143286502440931'} />
              <CarScheme carSvg={Car2} carNum={2} carLayout={'6439907560399127017384248387527'} />
              <CarScheme carSvg={Car3} carNum={3} carLayout={'8714169402425759520998946877919'} />
              <CarScheme carSvg={Car4} carNum={4} carLayout={'6971768577387774722139678932925'} />
              <CarScheme carSvg={Car5} carNum={5} carLayout={'147573671114632593279'} />
            </Gallery> } />
          <Route exact path="/" component={ChooseStationWindow} />
        </Switch>
        
      </div>
      </div>
  )
}

export default App
