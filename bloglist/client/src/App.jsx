import { useEffect } from 'react'

import { ErrorBoundary, getErrorMessage } from 'react-error-boundary'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import { Button, AppBar, Toolbar, Typography } from '@mui/material'

import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import BlogList from './components/BlogList'
import UserList from './components/UserList'
import LoginForm from './components/LoginForm'
import User from './components/User'

import { useBlogs } from './hooks/useBlogs'
import { useUser } from './hooks/useUser'
import { getUser, removeUser } from './services/persistentUser'
import { useUsers } from './hooks/useUsers'

const App = () => {
  const { user, setUser } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    const user = getUser()
    if (user) {
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const { blogs, blogsPending, blogsError } = useBlogs()
  const { users, usersPending, usersError } = useUsers()

  const blogMatch = useMatch('/blogs/:id')
  const userMatch = useMatch('/users/:id')

  if (blogsPending || usersPending) {
    return <div>loading</div>
  }

  if (blogsError || usersError) {
    return <div>service not available due to problems in server</div>
  }

  console.log(users)

  const handleLogOut = async (event) => {
    event.preventDefault()
    removeUser()
    setUser(null)
    navigate('/')
  }

  const greyHover = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  const blog = blogMatch ? blogs.find((note) => note.id === blogMatch.params.id) : null
  const viewUser = userMatch ? users.find((user) => user.id === userMatch.params.id) : null

  return (
    <div>
      <div>
        <Notification />
      </div>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Blog App
            </Typography>
            <Button color="inherit" component={Link} to="/" sx={greyHover}>
              blogs
            </Button>
            <Button color="inherit" component={Link} to="/users" sx={greyHover}>
              users
            </Button>
            {user ? (
              <Button
                color="inherit"
                component={Link}
                to="/create"
                sx={greyHover}
              >
                new blog
              </Button>
            ) : null}
            {user ? (
              <Button color="inherit" onClick={handleLogOut}>
                logout
              </Button>
            ) : (
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={greyHover}
              >
                login
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </div>
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div>
            <h1>Something went wrong :(</h1>
            <p>Please Send Bug Report</p>
            <p>Error Message: "{getErrorMessage(error)}"</p>
            <button onClick={resetErrorBoundary}>Retry</button>
          </div>
        )}
      >
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/blogs/:id" element={<Blog blog={blog} />} />
          <Route path="/users/:id" element={<User user={viewUser} />} />
          <Route path="/create" element={<BlogForm />} />
          <Route path="*" element={<h1>404 - Page not found</h1>} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
