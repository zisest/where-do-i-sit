import React from 'react'
//import bigInt from 'big-integer'
import { ReactComponent as DirectionLeft } from './images/DirectionLeft.svg'
import { ReactComponent as DirectionRight } from './images/DirectionRight.svg'
import trainPic from './images/train.png'
import { ReactComponent as Seat } from './images/Seat.svg'

class TrainDetails extends React.Component{  
  constructor(props){
    super(props)   
    this.state = {
      cars: {},
      errors: []
    }
  }

  componentDidMount(){
    fetch('/api/getDetails?t=' + this.props.train_id)
      .then(res => res.json())
      .then(res => {
        if (res.error !== undefined) this.setState({errors: res})
        else {
          this.setState({cars: res.free_seats_detailed})          
        }
      })
  }
 

  evaluateSeats = (seats) => {
    let word = ''
    switch(seats % 10){
      case 0: case 5: case 6: case 7: case 8: case 9: word = 'мест'; break;
      case 1: word = 'место'; break;
      case 2: case 3: case 4: word = 'места'; break;
      default: word = ''     
    }
    let color = (seats > 25) ? 'var(--color-grey-dark)' : 'var(--color-red-logo)'
    return {seatsWord: word, seatsColor: color}
  }

  render(){        
   
    let carsData = this.state.cars
    let cars = Object.keys(carsData).map((car, index) => {
      let { seatsWord, seatsColor } = this.evaluateSeats(carsData[car].free_seats)
      return <div id={car} key={index} style={{color: seatsColor}}>
        <Seat fill={seatsColor} />{carsData[car].free_seats + ' ' + seatsWord}
        </div>
    })

    return(
      <div className="train-details">
        <div className="train-details__header">
          <div className="train-details__direction1">
            <div><DirectionLeft /></div>
            {this.props.train_name.split('—')[0]}
          </div>
          <div className="train-details__train-name">
            <h3>Свободные места в поезде</h3><h2>"{this.props.train_name}"</h2>
          </div>
          <div className="train-details__direction2">
            {this.props.train_name.split('—')[1]}
            <div><DirectionRight /></div>
          </div>
        </div>
        <div className="train-details__cars-seats-data">
          <div className="train-details__free-seats">
            {cars}
          </div>
          <div className="train-details__train-picture">
            <img alt='A train' src={trainPic}></img>
          </div>
        </div>        
      </div>      
    )
  }
  
}

export default TrainDetails
