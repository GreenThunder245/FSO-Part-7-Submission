import {
  Card,
  CardContent,
  Link,
  Typography,
  Button,
  CardHeader,
  Box,
  List,
  ListItem,
} from '@mui/material'
const User = ({ user }) => {
  if (!user) {
    return <h1>404 - Page not found</h1>
  }
  console.log(user)
  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6">{user.name}</Typography>
          {user.blogs.length > 0 ? (
            <>
              <Typography>added blogs</Typography>
              <List>
                {user.blogs.map((blog) => (
                  <ListItem>{blog.title}</ListItem>
                ))}
              </List>
            </>
          ) : (
            <Typography>no added blogs</Typography>
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default User
