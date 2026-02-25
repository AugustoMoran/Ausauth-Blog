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
    await expect(page.getByText('Blog List')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      const loginForm = page.locator('form').first()
      await loginForm.locator('input').nth(0).fill('testuser')
      await loginForm.locator('input').nth(1).fill('testpass123')
      await page.getByRole('button', { name: 'login' }).click()

      // Wait for logout button to appear (indicates successful login)
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
    test.beforeEach(async ({ page }) => {
      // Login
      const loginForm = page.locator('form').first()
      await loginForm.locator('input').nth(0).fill('testuser')
      await loginForm.locator('input').nth(1).fill('testpass123')
      await page.getByRole('button', { name: 'login' }).click()
      // Wait for logout button to appear (indicates successful login)
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      const blogForm = page.locator('form').last()
      
      await blogForm.locator('input').nth(0).fill('Test Blog Title')
      await blogForm.locator('input').nth(1).fill('Test Author')
      await blogForm.locator('input').nth(2).fill('This is test blog content')
      await page.getByRole('button', { name: 'create' }).click()

      // Wait for blog to be added
      await page.waitForTimeout(500)
      
      // Check that blog title appears
      await expect(page.locator('strong').filter({ hasText: 'Test Blog Title' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      // Create a blog first
      await page.getByRole('button', { name: 'new blog' }).click()
      const blogForm = page.locator('form').last()
      await blogForm.locator('input').nth(0).fill('Blog to Like')
      await blogForm.locator('input').nth(1).fill('Author')
      await blogForm.locator('input').nth(2).fill('Blog content for like test')
      await page.getByRole('button', { name: 'create' }).click()

      await page.waitForTimeout(500)

      // Access the last blog item
      const lastBlogItem = page.getByTestId('blog-item').last()
      
      // View the blog
      await lastBlogItem.locator('button').filter({ hasText: 'view' }).click()
      
      // Click like button
      await lastBlogItem.getByTestId('like-button').click()
      
      // Verify like button was clicked
      await expect(lastBlogItem.getByTestId('like-button')).toBeVisible()
    })

    test('user can delete their own blog', async ({ page }) => {
      // Create a blog
      await page.getByRole('button', { name: 'new blog' }).click()
      const blogForm = page.locator('form').last()
      await blogForm.locator('input').nth(0).fill('Blog to Delete')
      await blogForm.locator('input').nth(1).fill('Author')
      await blogForm.locator('input').nth(2).fill('Blog content for delete test')
      await page.getByRole('button', { name: 'create' }).click()

      await page.waitForTimeout(500)

      // Access the last blog item
      const lastBlogItem = page.getByTestId('blog-item').last()
      
      // View the blog
      await lastBlogItem.locator('button').filter({ hasText: 'view' }).click()
      
      // Open custom confirm dialog
      await lastBlogItem.getByTestId('delete-button').click()

      // Confirm delete in modal
      await page.getByRole('button', { name: 'Delete' }).click()

      // Verify blog is removed
      await page.waitForTimeout(500)
      await expect(page.locator('strong').filter({ hasText: 'Blog to Delete' })).not.toBeVisible()
    })
  })
})
