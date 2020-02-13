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
      rowsShown: 0,
      expandedRow: -1,
      stationName: '',
      isLoading: true
    }
    this.time = ''
  }

  componentWillUnmount(){
    clearInterval(this.time)
  }

  componentDidMount(){
    console.log('Station timetable mounted')
    this.time = setInterval(() => {
      let time = new Date()
      let currentTime = ("0" + time.getHours()).slice(-2) + ":" + 
      ("0" + time.getMinutes()).slice(-2) + ":" + 
      ("0" + time.getSeconds()).slice(-2)
      this.setState({currentTime : currentTime})
    },1000)
    
    let query = this.props.query
    if (query === null) this.setState({shouldRedirect: true})
    else {
      fetch('/api/getTimetable?initial=true&from=0&to=4&s=' + query)
      .then(res => {
        if (!res.ok) {
          throw res.statusText
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
        else throw 'No results'     
      })
      .catch(err => {
        console.log(err)
        this.setState(prevState => {
          let st = prevState
          st.isLoading = false        
          st.errors.push(err.toString())
          return st
        })
      }) 
     
    }
  }


  handleRequestMore = () => {
    this.setState({isLoading: true})
    let fromIndex = this.state.rowsShown
    let toIndex = fromIndex + 4
    fetch(`/api/getTimetable?from=${fromIndex}&to=${toIndex}&s=${this.props.query}`)
    .then(res => {
      if (!res.ok) {
        throw res.status
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
      else throw 'No results'
    })
    .catch(err => {
      this.setState(prevState => {
        let st = prevState
        st.isLoading = false        
        st.errors.push(err.toString())
        return st
      })
    }) 
  }

  handleExpand = (id) => {
    this.setState({expandedRow: id})
  }

  

  render(){
    let invalidQuery = (this.state.shouldRedirect) ? <Redirect to="/" /> : ''
    let trains = this.state.trainsData.map((train, index) => 
      <TrainRow {...train} key={index} isExpanded={this.state.expandedRow === train.train_id} handleExpand={this.handleExpand} />)
    let loadingAnimation = <div className="loader"></div>
    let noResults = <h2>Мы ничего не нашли, </h2>

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
              <div className="station-timetable__current-time">Текущее время: {this.state.currentTime}</div>
            </div>
          </div>
          <div className="station-timetable__body">
            <div className="station-timetable__train-table">              
              {trains}
              {(this.state.isLoading === true) && loadingAnimation}
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