import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test(
  'the form calls the event handler it received as props with the right details when a new blog is created',
  async () => {
    const createBlogMock = vi.fn()
    render(
      <BlogForm
        createBlog={createBlogMock}
      />
    )
    const titleInput = screen.getByLabelText('title')
    const authorInput = screen.getByLabelText('author')
    const urlInput = screen.getByLabelText('url')
    const createButton = screen.getByText('create')
    const testUser = userEvent.setup()
    await testUser.type(titleInput, 'tests do the testing for you')
    await testUser.type(authorInput, 'Whoever last touched this test')
    await testUser.type(urlInput, 'localhost:5173')
    await testUser.click(createButton)

    expect(createBlogMock.mock.calls).toHaveLength(1)
    expect(createBlogMock.mock.calls[0][0]).toBe('tests do the testing for you')
    expect(createBlogMock.mock.calls[0][1]).toBe('Whoever last touched this test')
    expect(createBlogMock.mock.calls[0][2]).toBe('localhost:5173')
  })