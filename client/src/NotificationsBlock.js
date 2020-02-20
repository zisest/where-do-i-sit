import React from 'react'
import './styles/NotificationsBlock.css'

import { CSSTransition } from 'react-transition-group'

class NotificationsBlock extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      shown: []
    }
  }

  handleClick = (e) => {
    if (document.querySelector('.notifications-block').lastChild.id === e.currentTarget.id){
      let notifID = parseInt(e.currentTarget.id.split('-')[1])
      this.setState(prevState => {
        let st = prevState
        st.shown[notifID] = false
        return st
      })   
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.children !== prevProps.children) {
      let len = this.props.children.length
      if (len > this.state.shown.length) this.setState(prevState => {
        let st = prevState
        let newNotifs = new Array(len - this.state.shown.length).fill(true)
        st.shown.push(...newNotifs)
        return st
      })
    }
  }

  render(){   
   
    return(
      <div className="notifications-block__absolute_container">
      <div className="notifications-block__relative_container">
      <div className="notifications-block">
          {this.props.children.map((notif, index) => {
            return <CSSTransition key={index} unmountOnExit timeout={{enter: 800, exit: 200}} classNames="notification__animation" in={this.state.shown[index]}>
                <div onClick={this.handleClick} onTouchEnd={this.handleClick} id={"notif-" + index}>{notif}</div>
              </CSSTransition>
          })}
      </div>
      </div>
      </div>
      
    )
  }
  
}


export default NotificationsBlock