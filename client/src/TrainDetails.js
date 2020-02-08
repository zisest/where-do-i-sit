import React from 'react'
import { ReactComponent as DirectionLeft } from './images/DirectionLeft.svg'
import { ReactComponent as DirectionRight } from './images/DirectionRight.svg'
import trainPic from './images/train.png'
import { ReactComponent as Seat } from './images/Seat.svg'

import Gallery from './Gallery'
import CarScheme from './CarScheme'

import { ReactComponent as SchemeLegendSeat } from './images/car_schemes/legend/SchemeLegendSeat.svg'
import { ReactComponent as SchemeLegendFoldingSeats } from './images/car_schemes/legend/SchemeLegendFoldingSeats.svg'

import Car1 from './images/car_schemes/car1.svg.js'
import Car2  from './images/car_schemes/car2.svg.js'
import Car3  from './images/car_schemes/car3.svg.js'
import Car4  from './images/car_schemes/car4.svg.js'
import Car5  from './images/car_schemes/car5.svg.js'
const Cars = [Car1, Car2, Car3, Car4, Car5]

class TrainDetails extends React.Component{  
  constructor(props){
    super(props)   
    this.state = {
      cars: {},
      errors: [],
      showSchemes: false
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
 
  handleClick = () => {
    this.setState({showSchemes: true})
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
    let carSchemes = []
    let cars = Object.keys(carsData).map((car, index) => {
      let { seatsWord, seatsColor } = this.evaluateSeats(carsData[car].free_seats)
      carSchemes.push(<CarScheme carSvg={Cars[index]} carNum={index + 1} carLayout={carsData[car].layout} key={index} />)
      return <div id={car} key={index} style={{color: seatsColor}} onClick={this.handleClick}>
        <Seat fill={seatsColor} />{carsData[car].free_seats + ' ' + seatsWord}
        </div>
    })

    let carsSeatsData = <div className="train-details__cars-seats-data">
        <div className="train-details__free-seats">
          {cars}
        </div>
        <div className="train-details__train-picture">
          <img alt='A train' src={trainPic}></img>
        </div>
      </div> 
    
    let carSchemesContainer = <div className="train-details__car-schemes">
        <div className="train-details__legend">
          <div><div><SchemeLegendSeat /></div><div>место<br/>свободно</div></div>
          <div><div><SchemeLegendSeat fill="#E41E13" /></div><div>место<br/>занято</div></div>
          <div><div><SchemeLegendFoldingSeats /></div><div>складные<br/>сидения</div></div>
        </div>
        <Gallery>
          {carSchemes}
        </Gallery>
      </div>

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
        {this.state.showSchemes ? carSchemesContainer : carsSeatsData} 
      </div>      
    )
  }
  
}

export default TrainDetails
