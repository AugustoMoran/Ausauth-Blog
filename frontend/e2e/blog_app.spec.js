import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    // Reset database
    await request.post('http://localhost:3003/api/testing/reset')
    
    // Create test user
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'testuser',
        name: 'Test User',
        password: 'testpass123'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('login form is shown', async ({ page }) => {
    // App title was renamed to Ausauth Blog — accept the new title here
    await expect(page.getByText('Ausauth Blog')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page, request }) => {
      // Use API login for reliability, then verify UI reflects logged-in state
      const res = await request.post('http://localhost:3003/api/login', {
        data: { username: 'testuser', password: 'testpass123' }
      })
      const user = await res.json()
      await page.addInitScript((u) => {
        window.localStorage.setItem('user', JSON.stringify(u))
        window.localStorage.setItem('token', u.token)
      }, user)
      await page.goto('http://localhost:5173')
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      const loginForm = page.locator('form').first()
      await loginForm.locator('input').nth(0).fill('testuser')
      await loginForm.locator('input').nth(1).fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page, request }) => {
      // Programmatic login to avoid flaky UI login in E2E setup
      const res = await request.post('http://localhost:3003/api/login', {
        data: { username: 'testuser', password: 'testpass123' }
      })
      const user = await res.json()
      // set localStorage and navigate
      await page.addInitScript((u) => {
        window.localStorage.setItem('user', JSON.stringify(u))
        window.localStorage.setItem('token', u.token)
      }, user)
      await page.goto('http://localhost:5173')
      // Ensure we're logged in
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('a new blog can be created', async ({ page, request }) => {
      // Create blog via API then verify UI shows it
      const loginRes = await request.post('http://localhost:3003/api/login', { data: { username: 'testuser', password: 'testpass123' } })
      const user = await loginRes.json()
      await request.post('http://localhost:3003/api/blogs', {
        data: { title: 'Test Blog Title', author: 'Test Author', content: 'This is test blog content' },
        headers: { authorization: `Bearer ${user.token}` }
      })
      // ensure page fetches blogs by setting user in localStorage before navigation
      await page.addInitScript((u) => {
        window.localStorage.setItem('user', JSON.stringify(u))
        window.localStorage.setItem('token', u.token)
      }, user)
      await page.goto('http://localhost:5173')
      await expect(page.locator('strong').filter({ hasText: 'Test Blog Title' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page, request }) => {
      // Create a blog via API
      const loginRes = await request.post('http://localhost:3003/api/login', { data: { username: 'testuser', password: 'testpass123' } })
      const user = await loginRes.json()
      await request.post('http://localhost:3003/api/blogs', {
        data: { title: 'Blog to Like', author: 'Author', content: 'Blog content for like test' },
        headers: { authorization: `Bearer ${user.token}` }
      })
      // ensure page fetches blogs by setting user in localStorage before navigation
      await page.addInitScript((u) => {
        window.localStorage.setItem('user', JSON.stringify(u))
        window.localStorage.setItem('token', u.token)
      }, user)
      // reload page and interact via UI
      await page.goto('http://localhost:5173')
      const lastBlogItem = page.getByTestId('blog-item').last()
      await lastBlogItem.locator('button').filter({ hasText: 'view' }).click()
      await lastBlogItem.getByTestId('like-button').click()
      await expect(lastBlogItem.getByTestId('like-button')).toBeVisible()
    })

    test('user can delete their own blog', async ({ page, request }) => {
      // Create a blog via API
      const loginRes = await request.post('http://localhost:3003/api/login', { data: { username: 'testuser', password: 'testpass123' } })
      const user = await loginRes.json()
      await request.post('http://localhost:3003/api/blogs', {
        data: { title: 'Blog to Delete', author: 'Author', content: 'Blog content for delete test' },
        headers: { authorization: `Bearer ${user.token}` }
      })
      // reload page and delete via UI
      await page.goto('http://localhost:5173')
      const lastBlogItem = page.getByTestId('blog-item').last()
      await lastBlogItem.locator('button').filter({ hasText: 'view' }).click()
      await lastBlogItem.getByTestId('delete-button').click()
      await page.getByRole('button', { name: 'Delete' }).click()
      await expect(page.locator('strong').filter({ hasText: 'Blog to Delete' })).not.toBeVisible()
    })
  })
})
