import React from 'react'
import { useState } from 'react';
import {BrowserRouter as Router, Link, Route, Switch, useLocation, Redirect, } from 'react-router-dom';

import ChooseStationWindow from './ChooseStationWindow'
import StationTimetable from './StationTimetable'

import './styles/App.css' 

import {ReactComponent as Logo} from './images/Logo.svg'
import {ReactComponent as GithubLogo} from './images/GithubLogo.svg'

import NotificationsBlock from './NotificationsBlock';


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  const [errors, setErrors] = useState([])
  let query = useQuery()

  function handleErrors(error){
    let newError = (error === 'Bad Request') ? 'Некорректный запрос' : error
    setErrors(prev => [...prev, newError])
  }

  return (
      <div className="app">
      <header className="header">
          <div className="logo">
            <Link to="/"><Logo /></Link>       
          </div>
          <div className="github-link">
            <a href="https://github.com/zisest/where-do-i-sit">
            <GithubLogo /><div className="github-link__text">GitHub</div>
            </a>
          </div>
      </header>
      <NotificationsBlock notifications={errors} />
      <div className="main-area">
        <Switch>          
          <Route path="/timetable" render={() => <StationTimetable handleErrors={handleErrors} query={query.get("station")} />} />          
          <Route exact path="/" render={() => <ChooseStationWindow handleErrors={handleErrors} />} />
          <Route render={() => <Redirect to="/"/>} />
        </Switch>        
      </div>      
      </div>
  )
}

export default App
