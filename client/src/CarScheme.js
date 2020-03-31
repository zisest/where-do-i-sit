import React from 'react'
import bigInt from 'big-integer'

import './styles/CarScheme.css' 

class CarScheme extends React.Component{
  
  constructor(props){
    super(props)   
    this.state = {
      carSizes: {
        1: 67,
        2: 103,
        3: 103,
        4: 103,
        5: 67
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
    let layout = this.decodeCarLayout(this.props.carLayout, this.state.carSizes[this.props.carNum]) 
    //console.log(layout)
    return(
      <div className="car-scheme">        
        {this.props.carSvg(layout)}
      </div>
    )
  }
  
}


export default CarScheme 