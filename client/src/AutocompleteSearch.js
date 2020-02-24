import React, { Fragment } from 'react'

import {BrowserRouter as Router, Redirect } from 'react-router-dom';

import './styles/AutocompleteSearch.css' 

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
        .then(res => {
          if (!res.ok) {
            throw res.statusText
          }
          return res.json()
        })
        .then(res => this.setState({suggestions: res}, () => this.checkValidity(res)))
        .catch(err => {
          this.props.handleErrors('Нет связи с сервером')
        })
      }, 500);
    } else {
      this.setState({suggestions: []});
    }
  }
  
  handleChange = (e) => {
    this.setState({value: e.target.value, isValid: false, keySelectedOption: -1}, () => this.restartFetchTimer());    
  }

  handleClick = (e) => {
    let id = parseInt(e.currentTarget.id.split('-')[1])
    this.setState(prevState => {     
      let option = prevState.suggestions[id]
      return {value: option, suggestions: [], keySelectedOption: -1, isValid: true}
    })
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
      let scrollTop = suggestionsBox.scrollTop
      let scrollHeight = suggestionsBox.scrollHeight
      let suggestionHeight = scrollHeight / length
      let selected = this.state.keySelectedOption

      if((e.key === 'ArrowUp') && (selected > 0)) 
        this.setState((prevState) => {
          let selected = prevState.keySelectedOption - 1
          if (selected*suggestionHeight < scrollTop) suggestionsBox.scrollTo(0, scrollTop - suggestionHeight)
          return {keySelectedOption: selected}
        })
      else if (e.key === 'ArrowUp')
        this.setState((prevState) => {
          let selected = length - 1
          suggestionsBox.scrollTo(0, scrollHeight)
          return {keySelectedOption: selected}
        })
      if((e.key === 'ArrowDown') && (selected < length - 1)) 
        this.setState((prevState) => {
          let selected = prevState.keySelectedOption + 1     
          if ((selected+1)*suggestionHeight > scrollTop + suggestionHeight*4) suggestionsBox.scrollTo(0, scrollTop + suggestionHeight)    //180 = 4*45
          return {keySelectedOption: selected}
        })
      if(e.key === 'Enter' && selected !== -1) this.keySelectOption()
      if(e.key === 'Enter' && length === 1 && selected === -1) this.setState({keySelectedOption: 0}, ()=>{this.keySelectOption()})
    } else {
      if(e.key === 'Enter') this.handleSubmit()
    }    
  }

  checkValidity = (suggestions = this.state.suggestions) => {
    //console.log('validity check')
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
      //console.log('Submitted' + this.state.value)
      this.setState({isSubmitted: true})
    }
    

    
  }


  render(){
    let value = this.state.value    

    let suggestions
    if (this.state.suggestions.length !== 0 ){
      let suggestionsList = this.state.suggestions.map((item, index) => {
        let start = item.toLowerCase().indexOf(value)
        let end = start + value.length
        let suggestion = (start !== -1) ? <div>{item.slice(0, start)}<em>{item.slice(start, end)}</em>{item.slice(end, item.length)}</div>
          : <div>{item}</div>
        return <li key={index} id={'sugg-' + index}  onClick={this.handleClick}
          className={(index === this.state.keySelectedOption) ? 'autocomplete-search__suggestion_selected' : undefined}>          
          {suggestion}
        </li>
      })
      suggestions = <ul className="autocomplete-search__suggestions">{suggestionsList}</ul>
    } else {
      suggestions = ''
    }    

    return(
      <Fragment>
      <div className="autocomplete-search">
        <label htmlFor="autocomplete-search">Укажите пункт отправления</label>
        <div className="autocomplete-search__input">
        <input type="text" id="autocomplete-search" placeholder="Ленинский проспект" autoComplete="off"
          onChange={this.handleChange} value={value} onKeyDown={this.handleKeyDown} />
        {suggestions}
        </div>
      </div>
      <div className="choose-station-window__button">
          <button onClick={this.handleSubmit}>Показать поезда</button>
      </div>
      {this.state.isSubmitted && <Redirect to={"/timetable?station=" + value} />}
      </Fragment>
    )
  }
}

export default AutocompleteSearch