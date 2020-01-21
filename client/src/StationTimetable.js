import React from 'react'
import { Redirect, Link } from 'react-router-dom'
import TrainRow from './TrainRow'
import { ReactComponent as ShowMore } from './images/ShowMore.svg'

class StationTimetable extends React.Component{  
  constructor(props){
    super(props)   
    this.state = {
      shouldRedirect: false,
      currentTime: '',
      trainsData: [],
      errors: [],
      rowsShown: 0

    }
  }

  componentDidMount(){
    setInterval(() => {
      let time = new Date()
      let currentTime = ("0" + time.getHours()).slice(-2) + ":" + 
      ("0" + time.getMinutes()).slice(-2) + ":" + 
      ("0" + time.getSeconds()).slice(-2)
      this.setState({currentTime : currentTime})
    },1000)
    
    let query = this.props.query
    if (query === null) this.setState({shouldRedirect: true})
    else {
      fetch('/api/getTimetable?from=0&to=4&s=' + query)
      .then(res => res.json())
      .then(res => {
        if (res.error !== undefined) this.setState({errors: res, shouldRedirect: true})
        else {
          let len = res.length
          if (len > 0) this.setState({trainsData: res, rowsShown: len})
          else this.setState(prevState => {
            let st = prevState
            st.errors.push({'error': 'No results'})
            return st
          })
        }
      })
    }
  }
/*
  decodeCarLayout(decimal, car){ 
    const carSizes = { "car1": 67, "car2": 103, "car3": 101, "car4": 101, "car5": 67 }
    let totalSeats = carSizes[car]
    let bin = bigInt(decimal).toString(2)
    while (bin.length < totalSeats){
      bin = '0' + bin    
    }
    let binArray = Array.from(bin)
    return binArray
  }*/

  handleRequestMore = () => {
    let fromIndex = this.state.rowsShown
    let toIndex = fromIndex + 4
    fetch(`/api/getTimetable?from=${fromIndex}&to=${toIndex}&s=${this.props.query}`)
    .then(res => res.json())
    .then(res => {
      if (res.error !== undefined) this.setState({errors: res, shouldRedirect: true})
      else {
        let len = res.length
        if (len > 0) this.setState(prevState => {
          let st = prevState
          st.rowsShown += len
          st.trainsData.push(...res)
        })
        else this.setState(prevState => {
          let st = prevState
          st.errors.push({'error': 'No results'})
          return st
        })
      }
    })
  }

  

  render(){
    let invalidQuery = (this.state.shouldRedirect) ? <Redirect to="/" /> : ''
    let trains = this.state.trainsData.map((train, index) => <TrainRow {...train} key={index} />)

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
              <div className="station-timetable__station-name">{this.props.query}</div>
              <hr/>
              <div className="station-timetable__current-time">Текущее время: {this.state.currentTime}</div>
            </div>
          </div>
          <div className="station-timetable__body">
            <div className="station-timetable__train-table">
              {trains}
            </div>
            <div className="station-timetable__errors"></div>
            <div className="station-timetable__show-more" onClick={this.handleRequestMore}>
              <ShowMore />
            </div>
          </div>
        </div>             

        {invalidQuery}
      </div>
    )
  }
  
}

export default StationTimetable