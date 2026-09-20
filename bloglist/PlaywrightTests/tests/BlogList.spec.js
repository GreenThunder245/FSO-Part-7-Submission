const { test, describe, expect, beforeEach } = require('@playwright/test')
const { login, createBlog } = require('./helper')

describe('Blog List app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'John Doe',
        username: 'Full Stack Student',
        password: 'MERN'
      }
    })
    await page.goto('/')
  })
  describe('When Logging in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('link', { name: 'login' }).click()
    })    
    test('Login form is shown', async ({ page }) => {
      const usernameInput = await page.getByLabel('username')
      const passwordInput = await page.getByLabel('password')
      const loginButton = await page.getByRole('button', { name: 'login' })
      await expect(usernameInput).toBeVisible()
      await expect(passwordInput).toBeVisible()
      await expect(loginButton).toBeVisible()
    })
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, 'mluukkai', 'wrong')
      await expect(page.getByText('Wrong Username or Password')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(
        page,
        'How To Center a Div',
        'joshwcomeau',
        'https://www.joshwcomeau.com/css/center-a-div/'
      )
      await expect(page.getByText('How To Center a Div by joshwcomeau')).toBeVisible()
    })
  })
  describe('When There is one Blog', () => {
    beforeEach(async ({ page }) => {
      await login(page, 'mluukkai', 'salainen')
      await createBlog(
        page,
        'How To Center a Div',
        'joshwcomeau',
        'https://www.joshwcomeau.com/css/center-a-div/'
      )
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('link', { name: 'How To Center a Div by joshwcomeau' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('1 likes')).toBeVisible()
    })

    test('the user who added the blog can delete the blog', async ({ page }) => {
      await page.getByRole('link', { name: 'How To Center a Div by joshwcomeau' }).click()
      await page.getByRole('button', { name: 'Delete' }).click()
      await expect(page.getByText('How To Center a Div joshwcomeau')).not.toBeVisible()
    })

    test('only the user who added the blog sees the blog\'s delete button', async ({ page }) => {
      await page.getByRole('link', { name: 'How To Center a Div by joshwcomeau' }).click()
      await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible()
      await page.getByRole('button', {name : 'logout'}).click()
      await login(page, 'Full Stack Student', 'MERN')
      await expect(page.getByRole('button', { name: 'Delete' })).not.toBeVisible()
    })
  })
  describe('When There is multiple Blogs', () => {
    beforeEach(async ({ page }) => {
      await login(page, 'mluukkai', 'salainen')
      await createBlog(
        page,
        'How To Center a Div',
        'joshwcomeau',
        'https://www.joshwcomeau.com/css/center-a-div/'
      )
      await expect(page.getByRole('listitem')).toHaveCount(1)
      await createBlog(
        page,
        'React patterns',
        'Michael Chan',
        'https://reactpatterns.com/'
      )
      await expect(page.getByRole('listitem')).toHaveCount(2)
    })
    test('the blog with the most likes is first', async ({ page }) =>{
      await page.getByRole('link', { name: 'React patterns' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('link', { name: 'blogs' }).click()

      await expect(page.getByRole('listitem').first()).toContainText('React patterns')
      await expect(page.getByRole('listitem').last()).toContainText('How To Center a Div')

      await page.getByRole('link', { name: 'How To Center a Div' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByRole('link', { name: 'blogs' }).click()

      await expect(page.getByRole('listitem').first()).toContainText('How To Center a Div')
      await expect(page.getByRole('listitem').last()).toContainText('React patterns')
    })
  })
})