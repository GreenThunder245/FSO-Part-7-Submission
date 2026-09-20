import { NotificationContext, NotificationDispatchContext } from '../context/NotificationContext'
import { useContext } from 'react';

export function useNotification() {
  return useContext(NotificationContext);
}

export function useNotificationDispatch() {
  return useContext(NotificationDispatchContext);
}