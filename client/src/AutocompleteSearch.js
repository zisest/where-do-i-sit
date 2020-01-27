import React, { Fragment } from 'react'

import {BrowserRouter as Router, Redirect } from 'react-router-dom';

class AutocompleteSearch extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      value: '',
      suggestions: [],
      keySelectedOption: -1,
      isValid: false,
      isSubmitted: false
    }
    this.fetchTimer = ''
  }

  restartFetchTimer = () => {
    clearTimeout(this.fetchTimer)
    if (this.state.value.length > 2){
      this.fetchTimer = setTimeout(() => {      
        fetch('/api/getStations?s=' + this.state.value)
        .then(res => res.json())
        .then(res => this.setState({suggestions: res}, () => this.checkValidity(res)))
      }, 800);
    } else {
      this.setState({suggestions: []});
    }
  }
  
  handleChange = (e) => {
    this.setState({value: e.target.value, isValid: false, keySelectedOption: -1}, () => this.restartFetchTimer());    
  }

  handleClick = (e) => {
    this.setState({value: e.target.innerHTML, isValid: true, suggestions: [], keySelectedOption: -1})
  }

  keySelectOption = () => {
    this.setState(prevState => {
      let option = prevState.suggestions[prevState.keySelectedOption]
      return {value: option, suggestions: [], keySelectedOption: -1, isValid: true}
    })
  }

  handleKeyDown = (e) => {  
    let suggestionsBox = document.querySelector('.autocomplete-search__suggestions')
    let length = this.state.suggestions.length    
    if (length !== 0) {
      let selected = this.state.keySelectedOption
      if((e.key === 'ArrowUp') && (selected > 0)) 
        this.setState((prevState) => {
          let selected = prevState.keySelectedOption - 1
          if (selected*45 < suggestionsBox.scrollTop) suggestionsBox.scrollBy(0, -45)
          return {keySelectedOption: selected}
        })     
      if((e.key === 'ArrowDown') && (selected < length - 1)) 
        this.setState((prevState) => {
          let selected = prevState.keySelectedOption + 1     
          if ((selected+1)*45 > suggestionsBox.scrollTop + 225) suggestionsBox.scrollBy(0, 45)    
          return {keySelectedOption: selected}
        })
      if(e.key === 'Enter' && selected !== -1) this.keySelectOption()
      if(e.key === 'Enter' && length === 1 && selected === -1) this.setState({keySelectedOption: 0}, ()=>{this.keySelectOption()})
    } else {
      if(e.key === 'Enter') this.handleSubmit()
    }    
  }

  checkValidity = (suggestions = this.state.suggestions) => {
    console.log('validiry check')
    if (!this.state.isValid && suggestions.length !==  0){ 
      let isValid = false
      let validIndex = -1
      let input = this.state.value.toLowerCase()
      suggestions.forEach((item, i) => {
        if (item.toLowerCase() === input) {
          isValid = true
          validIndex = i
        }
      })
      if(isValid) this.setState({isValid: true, value: suggestions[validIndex], suggestions: [], keySelectedOption: -1})
      return isValid
    }
  }

  handleSubmit = () => {
    if (this.state.isValid || this.checkValidity()) {
      console.log('Submitted' + this.state.value)
      this.setState({isSubmitted: true})
    }
    

    
  }


  render(){
    let suggestions
    if (this.state.suggestions.length !== 0 ){
      suggestions = <ul className="autocomplete-search__suggestions" onClick={this.handleClick}>
        {this.state.suggestions.map((item, index) => <li key={index} id={'sugg-' + index} 
        className={(index === this.state.keySelectedOption) ? 'autocomplete-search__suggestion_selected' : undefined}>{item}</li>)}
        </ul>
    } else {
      suggestions = ''
    }    

    return(
      <Fragment>
      <div className="autocomplete-search">
        <label htmlFor="autocomplete-search">Укажите пункт отправления</label>
        <div>
        <input type="text" id="autocomplete-search" placeholder="Ленинский проспект" autoComplete="off"
          onChange={this.handleChange} value={this.state.value} onKeyDown={this.handleKeyDown} />
        {suggestions}
        </div>
      </div>
      <div className="choose-station-window__button">
          <button onClick={this.handleSubmit}>Показать поезда</button>
      </div>
      {this.state.isSubmitted && <Redirect to={"/timetable?station=" + this.state.value} />}
      </Fragment>
    )
  }
}

export default AutocompleteSearch