import React from 'react'
import bigInt from 'big-integer'



class CarScheme extends React.Component{
  
  constructor(props){
    super(props)   
    this.state = {
      carSizes: {
        "car1": 67,
        "car2": 103,
        "car3": 103,
        "car4": 103,
        "car5": 67
      }
    }          
  }

  decodeCarLayout = (decimal, totalSeats) => { 
    let bin = bigInt(decimal).toString(2)
    while (bin.length < totalSeats){
        bin = '0' + bin    
    }
    let binArray = Array.from(bin)
    return binArray
  }
  
  render(){  
    let layout = this.decodeCarLayout(this.props.carLayout, this.state.carSizes['car' + this.props.carNum]) 
    return(
      <div className="car-scheme">        
        {this.props.carSvg(layout)}
      </div>
    )
  }
  
}


export default CarScheme 