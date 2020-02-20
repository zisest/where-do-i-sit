import React from 'react'
import { ReactComponent as DirectionLeft } from './images/DirectionLeft.svg'
import { ReactComponent as DirectionRight } from './images/DirectionRight.svg'
import leftCar from './images/left-car.png'
import middleCar from './images/middle-car.png'
import rightCar from './images/right-car.png'
import { ReactComponent as Seat } from './images/Seat.svg'

import Gallery from './Gallery'
import CarScheme from './CarScheme'

import './styles/TrainDetails.css' 

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
      showSchemes: false,
      selectedCar: 0
    }
  }

  componentDidMount(){
    fetch('/api/getDetails?t=' + this.props.train_id)
      .then(res => {
        if (!res.ok) {
          throw res.status
        }
        return res.json()
      })
      .then(res => {
        if (res.error !== undefined) throw res.error        
        this.setState({cars: res.free_seats_detailed}) 
      })
      .catch(err => {
        this.setState(prevState => {
          let st = prevState      
          st.errors.push(err.toString())
          return st
        })
      }) 
  }
 
  handleClick = (e) => {
    this.setState({showSchemes: true, selectedCar: parseInt(e.currentTarget.id.split('-')[1])})
  }
  
  evaluateSeats = (seats) => {
    let word = ''
    switch(seats % 10){
      case 0: case 5: case 6: case 7: case 8: case 9: word = 'мест'; break;
      case 1: word = 'место'; break;
      case 2: case 3: case 4: word = 'места'; break;
      default: word = ''     
    }
    switch(seats){
      case 11: case 12: case 13: case 14: word = 'мест'; break;
    }
    let color = (seats > 25) ? 'var(--color-grey-dark)' : 'var(--color-red-logo)'
    return {seatsWord: word, seatsColor: color}
  }

  render(){        
    let wideCars = window.screen.width > 625
    let carsData = this.state.cars
    let carSchemes = []
    let cars = Object.keys(carsData).map((car, index) => {
      let { seatsWord, seatsColor } = this.evaluateSeats(carsData[car].free_seats)
      carSchemes.push(<CarScheme carSvg={Cars[index]} carNum={index + 1} carLayout={carsData[car].layout} key={index} />)
      return <div id={'car-' + index} key={index} style={{color: seatsColor}} onClick={this.handleClick}>
        <Seat fill={seatsColor} />{carsData[car].free_seats}<span>{seatsWord}</span>
        </div>
    })

    let carsSeatsData = <div className="train-details__cars-seats-data">
        <div className="train-details__free-seats">
          <div className="train-details__free-seats-numbers">{cars}</div>
          <div className="train-details__car-images">
            {cars.map((car, index) => <div id={'carimg-' + index} onClick={this.handleClick}>{index + 1}</div>)}            
          </div>
               
        </div>        
      </div> 
    
    let carSchemesContainer = <div className="train-details__car-schemes">
        <div className="train-details__legend">
          <div><div><SchemeLegendSeat /></div><div>место<br/>свободно</div></div>
          <div><div><SchemeLegendSeat fill="#E41E13" /></div><div>место<br/>занято</div></div>
          <div><div><SchemeLegendFoldingSeats /></div><div>складные<br/>сидения</div></div>
        </div>
        <Gallery startingFrame={this.state.selectedCar} labels={['1 вагон', '2 вагон', '3 вагон', '4 вагон', '5 вагон']} >
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
            <div><DirectionRight /></div>
            {this.props.train_name.split('—')[1]}            
          </div>
        </div>
        {this.state.showSchemes ? carSchemesContainer : carsSeatsData} 
      </div>      
    )
  }
  
}

export default TrainDetails
