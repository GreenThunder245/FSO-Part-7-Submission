import { TextField, Button } from '@mui/material'
import { useBlogs } from '../hooks/useBlogs'
import { useField } from '../hooks/useField'
const BlogForm = () => {
  const {addBlog} = useBlogs()
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const createBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title : title.value,
      author : author.value,
      url : url.value,
    };
    addBlog(blogObject)
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={createBlog}>
        <div>
          <TextField
            label="title"
            type={title.type}
            value={title.value}
            onChange={title.onChange}
            style={{ marginBottom: 10 }}
          />
        </div>
        <div>
          <TextField
            label="author"
            type={author.type}
            value={author.value}
            onChange={author.onChange}
            style={{ marginBottom: 10 }}
          />
        </div>
        <div>
          <TextField
            label="url"
            type={url.type}
            value={url.value}
            onChange={url.onChange}
            style={{ marginBottom: 10 }}
          />
        </div>
        <Button type="submit" variant="contained">
          create
        </Button>
      </form>
    </div>
  )
}
export default BlogForm
