import React from 'react'

class CurrentTime extends React.Component{
  
  constructor(props){
    super(props)   
    this.state = { 
      currentTime: '',
      isLoading: true
    }         
    this.time = '' 
  }

  
  componentDidMount(){
    this.tick()
    this.time = setInterval(this.tick, 1000)
  }
  
  componentWillUnmount(){
    clearInterval(this.time)
  }

  tick = () => {
    let time = new Date()
    let currentTime = ("0" + time.getHours()).slice(-2) + ":" + 
    ("0" + time.getMinutes()).slice(-2) + ":" + 
    ("0" + time.getSeconds()).slice(-2)
    this.setState({currentTime : currentTime})
  }
 
  
  render(){      
    return(<div className="station-timetable__current-time">Текущее время: {this.state.currentTime}</div>)
  }
  
}


export default CurrentTime 