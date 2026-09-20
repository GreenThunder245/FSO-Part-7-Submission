import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Type wars',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  likes: 2,
  user: {
    username: 'Short Way',
    name: 'Edsger W. Dijkstra',
    id: '6a81ff73274464d2988855ff'
  },
  id: '6a82005d274464d298885606'
}
const user = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlJlYWN0IFBhdHRlcm5zIiwiaWQiOiI2YTgxZmYzMTI3NDQ2NGQyOTg4ODU1ZmUiLCJpYXQiOjE3ODc0MzI1NTIsImV4cCI6MTc4NzQzNjE1Mn0.ouLqIx7lbjUTdGTkqRspWy1lrK1zXqFpJ6r5CzWXXLo',
  username: 'React Patterns',
  name: 'Michael Chan',
  id: '6a81ff31274464d2988855fe'
}

test('a blog renders all of a blogs details', async () => {


  const likeBlogMock = vi.fn()

  const deleteBlogMock = vi.fn()

  render(
    <Blog
      key={blog.id}
      blog={blog}
      likeBlog={likeBlogMock}
      user={user}
      deleteBlog={deleteBlogMock}
    />
  )

  const titleElement = screen.getByText('Type wars', { exact: false })
  expect(titleElement).toBeDefined()
  const authorElement = screen.getByText('Robert C. Martin', { exact: false })
  expect(authorElement).toBeDefined()

  const URLelement = screen.queryByText('http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html')
  expect(URLelement).toBeDefined()
  const likesElement = screen.queryByText('likes 2')
  expect(likesElement).toBeDefined()
})

test(
  'if the like button is clicked twice, the event handler the component received as props is called twice.',
  async() => {
    const likeBlogMock = vi.fn()
    const deleteBlogMock = vi.fn()

    render(
      <Blog
        key={blog.id}
        blog={blog}
        likeBlog={likeBlogMock}
        user={user}
        deleteBlog={deleteBlogMock}
      />
    )

    const testUser = userEvent.setup()
    const likeButton = screen.getByText('like')
    await testUser.click(likeButton)
    await testUser.click(likeButton)
    expect(likeBlogMock.mock.calls).toHaveLength(2)
  })