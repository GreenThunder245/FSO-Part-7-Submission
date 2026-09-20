import { createContext, useReducer } from 'react';

export const NotificationContext = createContext(null);
export const NotificationDispatchContext = createContext(null);

function notificationReducer(notification, action){
  switch(action.type){
    case 'set': {
      return {text : action.text, severity : action.severity }
    }
    case 'clear': {
      return null
    }

  }
}

export const NotificationContextProvider = ( {children} ) => {
  
  const [notification, dispatch] = useReducer(notificationReducer,null)
  
  return (
    <NotificationContext value={notification}>
      <NotificationDispatchContext value={dispatch}>
        {children}
      </NotificationDispatchContext>
    </NotificationContext>
  )
}