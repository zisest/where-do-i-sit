import React from 'react'

import {ReactComponent as CarArrow} from './images/CarArrowRight.svg'
import CarScheme from './CarScheme'

class Gallery extends React.Component{
  
  constructor(props){
    super(props)   
    this.state = {
        selectedFrame: 0,
        isSliding: false
    }    
  }

  componentDidMount(){
    if (this.props.startingFrame) {
      document.querySelector('.gallery__frames').scrollTo({
        left: this.props.startingFrame*1.12*document.querySelector('.gallery__frames').offsetWidth, 
        top: 0,
        behavior: 'auto'
      })
      this.setState({selectedFrame: this.props.startingFrame})
      console.log('passed from parent: ' + this.props.startingFrame)
    }
  }

  slideLeft = () => {
    this.setState(prevState => {
      if (prevState.selectedFrame > 0) {
        //taking into account 12% margin-right:
        document.querySelector('.gallery__frames').scrollBy({
          left: -1.12 * document.querySelector('.gallery__frames').offsetWidth,
          top: 0,
          behavior: 'smooth'
        }) 
        console.log('slideLeft: ' + (prevState.selectedFrame - 1))
        return {selectedFrame: prevState.selectedFrame - 1, isSliding: true}
      }
    }, () => {
      setTimeout(() => {this.setState({isSliding: false})}, 1500)
    })
  }
  slideRight = () => {
    this.setState(prevState => {
      if (prevState.selectedFrame < this.props.children.length - 1) {
        document.querySelector('.gallery__frames').scrollBy({
          left: 1.12 * document.querySelector('.gallery__frames').offsetWidth,
          top: 0,
          behavior: 'smooth'
        }) 
        console.log('slideRight: ' + (prevState.selectedFrame + 1))
        return {selectedFrame: prevState.selectedFrame + 1, isSliding: true}
      }
    }, () => {
      setTimeout(() => {this.setState({isSliding: false})}, 1000)
    })
  }

  throttle = (fn, wait) => {
    var time = Date.now();
    return function() {
      if ((time + wait - Date.now()) < 0) {
        fn();
        time = Date.now();
      }
    }
  }

  handleScroll = () => {
    if (!this.state.isSliding){
      let frames = document.querySelector('.gallery__frames')
      let frameCount = this.props.children.length
      let selectedFrame = Math.floor(frameCount * frames.scrollLeft / frames.scrollWidth)
      if (this.state.selectedFrame !== selectedFrame) {
        this.setState({selectedFrame: selectedFrame})
        console.log('handleScroll: ' + selectedFrame)
      }
    }
  }

  render(){
    let frames = this.props.labels ? 
      this.props.children.map((fr, index) => <div id={'frame-' + index} className="gallery__frame_labeled" key={index}><div><div className="gallery__frame-label">{this.props.labels[index]}</div>{fr}</div></div>) :
      this.props.children.map((fr, index) => <div id={'frame-' + index} key={index} className="gallery__frame_unlabeled">{fr}</div>)
   

    return(
      <div className="gallery">
        <div className="gallery__grid">
          <div className={this.state.selectedFrame !== 0 ? "gallery__left-arrow gallery__left-arrow_active" : "gallery__left-arrow"} onClick={this.slideLeft}>
            <CarArrow stroke={this.state.selectedFrame !== 0 ? '#7F8998':'#DBE1EA'} transform="rotate(-180)" />
          </div>
          <div className="gallery__frames-cell">          
            <div className="gallery__frames" onScroll={this.throttle(this.handleScroll, 100)}>
              {frames}
            </div>          
          </div>
          <div className={this.state.selectedFrame !== (this.props.children.length - 1) ? "gallery__right-arrow gallery__right-arrow_active" : "gallery__right-arrow"} onClick={this.slideRight}>
            <CarArrow stroke={this.state.selectedFrame !== (this.props.children.length - 1) ? '#7F8998':'#DBE1EA'} />
          </div>
        </div>

      </div>
    )
  }
  
}


export default Gallery