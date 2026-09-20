import { TextField, Button } from '@mui/material'
import { useField } from '../hooks/useField'
import loginService from '../services/login';
import { saveUser } from '../services/persistentUser'
import { useNotificationDispatch } from '../hooks/useNotification';
import blogService from '../services/blogs'
import { useUser } from '../hooks/useUser';
import { useNavigate } from 'react-router-dom'
const LoginForm = () => {
  const { setUser } = useUser();
  const username = useField('text')
  const password = useField('text')
  const dispatch = useNotificationDispatch()
  const navigate = useNavigate();
  const login = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username: username.value, password: password.value })
      saveUser(user)
      blogService.setToken(user.token)
      setUser(user)
      navigate('/')
      dispatch({
        type: 'set',
        text: `${user.name} logged in`,
        severity: 'success',
      })
      setTimeout(() => {
        dispatch({
          type: 'clear',
        })
      }, 5000)
    } catch {
      dispatch({
        type: 'set',
        text: 'Wrong Username or Password',
        severity: 'error',
      })
      setTimeout(() => {
        dispatch({
          type: 'clear',
        })
      }, 5000)
    }
  }
  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={(event) => login(event)}>
        <div>
          <TextField
            label="username"
            type={username.type}
            value={username.value}
            onChange={username.onChange}
            variant="standard"
          />
        </div>
        <div>
          <TextField
            label="password"
            type={password.type}
            value={password.value}
            onChange={password.onChange}
            variant="standard"
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          login
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
