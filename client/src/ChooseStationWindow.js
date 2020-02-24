import React from 'react'

import AutocompleteSearch from './AutocompleteSearch'
import './styles/ChooseStationWindow.css' 

class ChooseStationWindow extends React.Component{
  /*
  constructor(props){
    super(props)   
    
  }*/

  

  
  render(){
    return(
      <div className="choose-station-window">
        <div className="choose-station-window__header">
          Выбор поезда
        </div>
        <AutocompleteSearch handleErrors={this.props.handleErrors} />        
      </div>
    )
  }
  
}


export default ChooseStationWindow