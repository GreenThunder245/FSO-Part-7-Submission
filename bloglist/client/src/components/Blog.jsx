import {
  Card,
  CardContent,
  Link,
  Typography,
  Button,
  CardHeader,
  Box,
  TextField,
  List,
  ListItem,
} from '@mui/material'
import { useBlogs } from '../hooks/useBlogs'
import { useUser } from '../hooks/useUser'
import { useField } from '../hooks/useField'
const Blog = ({ blog }) => {
  const { likeBlog, removeBlog, commentBlog } = useBlogs()
  const { user } = useUser()
  const comment = useField('text')
  if (!blog) {
    return <h1>404 - Page not found</h1>
  }
  const match = user ? user.id === blog.user.id : false
  return (
    <Card>
      <CardHeader title={blog.title} />
      <CardContent>
        <Typography sx={{ color: 'text.secondary' }}>
          {`by ${blog.author}`}
        </Typography>
        <Link>{blog.url}</Link>
        <Typography sx={{ color: 'text.secondary' }}>
          {`Added by ${blog.user.username}`}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography style={{ display: 'inline-block' }}>
            {`${blog.likes} likes`}
          </Typography>
          <Button onClick={() => likeBlog(blog)} variant="outlined">
            like
          </Button>
          {match && (
            <Button
              onClick={() => removeBlog(blog.id)}
              variant="outlined"
              color="warning"
            >
              Delete
            </Button>
          )}
        </Box>
        <Typography>Comments</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'stretch' }}>
          <TextField
            id="outlined-basic"
            label="add a comment"
            variant="outlined"
            value={comment.value}
            onChange={comment.onChange}
            type={comment.type}
          />
          <Button variant="contained" onClick={
            () => commentBlog({ id: blog.id, comment: comment.value})
          }>
            ADD COMMENT
          </Button>
        </Box>
        <List>
          {blog.comments.map((comment) => (
            <ListItem>{comment}</ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default Blog
