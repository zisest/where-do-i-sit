import React from 'react'
import './styles/Notification.css'

import { ReactComponent as NotificationAlert } from './images/NotificationAlert.svg'
import { ReactComponent as NotificationError } from './images/NotificationError.svg'

const notificationImages = {
  "alert": <NotificationAlert />,
  "error": <NotificationError />
}

function Notification(props){
  return(
    <div className={"notification notification_" + props.type}>
      <div className="notification__type">{notificationImages[props.type]}</div>
      <div className="notification__message">{props.message}</div>
    </div>
  )
}

Notification.defaultProps = {
  type: "alert",
  message: "???"
}

export default Notification