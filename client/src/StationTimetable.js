import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import TimetableRow from './TimetableRow'
import { ReactComponent as ShowMore } from './images/ShowMore.svg'
import CurrentTime from './CurrentTime'

import NotificationsBlock from './NotificationsBlock'
import Notification from  './Notification'

import './styles/StationTimetable.css' 

class StationTimetable extends React.Component{  
  constructor(props){
    super(props)   
    this.state = {
      trainsData: [],
      errors: [],
      rowsShown: 0,
      expandedRow: -1,
      stationName: '',
      isLoading: true
    }
  }



  componentDidMount(){
    //console.log('Station timetable mounted')
    
    
    let query = this.props.query
    if (query === null) {      
      this.setState({errors: ['Bad Request']}, () => this.props.handleErrors('Некорректный запрос'))
    }
    else {
      fetch('/api/getTimetable?initial=true&from=0&to=4&s=' + query)
      .then(res => {
        if (!res.ok) {
          throw ((res.status === 400) ? 'Bad Request' : 'Internal Server Error')
        }
        return res.json()
      })
      .then(res => {       
        let len = res.length
        let result = res
        let { stationName } = result.pop()
        this.setState({isLoading: false, stationName: stationName})
        if (len > 1) {
          this.setState({trainsData: result, rowsShown: len-1})
        }
        else throw 'Нет результатов'     
      })
      .catch(err => {
        //console.log(err)
        this.setState(prevState => {
          let st = prevState
          st.isLoading = false  
          console.log(err.toString())      
          st.errors.push(err.toString())
          return st
        }, () => this.props.handleErrors(err.toString()))
      }) 
     
    }

    // Checking for updates
    //setTimeout(this.checkUpdates, 30000)

  }

  checkUpdates = () => {
    console.log('checking for updates')
    fetch(`/api/getTimetable?from=0&to=${this.state.rowsShown - 1}&s=${this.props.query}`)
    .then(res => {
      if (!res.ok) {
        throw ('Internal Server Error')
      }
      return res.json()
    })
    .then(res => {          
      let len = res.length
      if (len > 0) this.setState(prevState => {
        let st = prevState
        st.rowsShown = len
        st.trainsData = res
        return st
      })
    })
    .catch(err => {
      this.setState(prevState => {
        let st = prevState
        st.errors.push(err.toString())
        return st
      }, () => this.props.handleErrors(err.toString()))
    })
    setTimeout(this.checkUpdates, 30000)
  }

  handleRequestMore = () => {
    this.setState({isLoading: true})
    let fromIndex = this.state.rowsShown
    let toIndex = fromIndex + 4
    fetch(`/api/getTimetable?from=${fromIndex}&to=${toIndex}&s=${this.props.query}`)
    .then(res => {
      if (!res.ok) {
        throw ((res.status === 400) ? 'Bad Request' : 'Internal Server Error')
      }
      return res.json()
    })
    .then(res => {          
      let len = res.length
      if (len > 0) this.setState(prevState => {
        let st = prevState
        st.isLoading = false
        st.rowsShown += len
        st.trainsData.push(...res)
        return st
      })
      else throw 'Показаны все поезда'
    })
    .catch(err => {
      this.setState(prevState => {
        let st = prevState
        st.isLoading = false     
         
        st.errors.push(err.toString())
        return st
      }, () => this.props.handleErrors(err.toString()))
    }) 
  }

  handleExpand = (id) => {
    this.setState(prevState => {
      return (prevState.expandedRow === id) ? {expandedRow: -1} : {expandedRow: id}
    })
  }

  

  render(){
    let badRequest = (this.state.errors.indexOf('Bad Request') > -1) ? <Redirect to="/" /> : ''
    let noResults = (this.state.errors.indexOf('Нет результатов') > -1) ? <div className="station-timetable__no-results">Все поезда ушли</div> : ''
    let loadingAnimation = <div className="loader"></div>

    let trains = this.state.trainsData.map((train, index) => 
      <TimetableRow {...train} key={index} isExpanded={this.state.expandedRow === train.train_id} handleErrors={this.props.handleErrors} handleExpand={this.handleExpand} />)
    
    

    return(
      <div className="station-timetable">
        <div className="station-timetable__grid">
          <div className="station-timetable__header">
            <Link to='/'>
            <div className="station-timetable__go-back">
              <div>Вернуться к выбору пункта отправления</div>
            </div>
            </Link>
            
            <div className="station-timetable__header-info">
              <div className="station-timetable__station-name">{this.state.stationName !== '' ? this.state.stationName : this.props.query}</div>
              <hr/>
              <CurrentTime />
            </div>
          </div>
          <div className="station-timetable__body">
            <div className="station-timetable__train-table">              
              {trains}
              {(this.state.isLoading === true) && loadingAnimation}
              {noResults}
            </div>
            <div className="station-timetable__errors"></div>
            <div className="station-timetable__show-more" onClick={this.handleRequestMore}>
              <ShowMore />
            </div>
          </div>
        </div>
        {badRequest}
      </div>
    )
  }
  
}

export default StationTimetable