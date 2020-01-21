import React from 'react'

import { ReactComponent  as TrainType } from './svg/TrainType.svg'
import { ReactComponent as Seat } from './svg/Seat.svg'
//import bigInt from 'big-integer'

class TrainRow extends React.Component{  
  constructor(props){
    super(props)   
    this.state = {
      
    }
  }


  evaluateSeats = (seats) => {
    let word = ''
    switch(seats % 10){
      case 0: case 5: case 6: case 7: case 8: case 9: word = 'мест'; break;
      case 1: word = 'место'; break;
      case 2: case 3: case 4: word = 'места'; break;
      default: word = ''     
    }
    let color = (seats > 75) ? 'var(--color-grey-dark)' : 'var(--color-red-logo)'
    return {seatsWord: word, seatsColor: color}
  }

  render(){    
    let trainTypeColor = (this.props.train_type !== 'Пригородный поезд') ? 'var(--color-red-logo)' : 'var(--color-grey-lighter)'
    let { seatsWord, seatsColor } = this.evaluateSeats(this.props.free_seats)

    return(
      <div className="timetable-row" id={this.props.train_id}>
        <div className="timetable-row__train-info">
          <div className="timetable-row__train-type">
            <span>{(this.props.train_type !== 'Пригородный поезд') && this.props.train_type}</span>
            <div className="timetable-row__train-type-icon"><TrainType fill={trainTypeColor} /></div>
          </div>
          <div className="timetable-row__train-name">{this.props.train_number + '  ' + this.props.train_name}</div>
        </div>
        <div className="timetable-row__train-route-info">
          <div className="timetable-row__departure-time">{this.props.departure_time.split('T')[1].substring(0, 5)}</div>
          <div className="timetable-row__stops">{this.props.stops}</div>
        </div>         
        <div className="timetable-row__seats" style={{color: seatsColor}}>{this.props.free_seats + ' ' + seatsWord}<Seat fill={seatsColor} /> </div>
      </div>
    )
  }
  
}

export default TrainRow