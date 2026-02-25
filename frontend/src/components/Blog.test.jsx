import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Testing React Components',
    author: 'Test Author',
    content: 'http://test.com',
    likes: 5,
    user: {
      username: 'tester',
      name: 'Test User'
    }
  }

  const user = {
    username: 'tester',
    name: 'Test User'
  }

  test('renders title and author but not content or likes by default', () => {
    render(
      <Blog
        blog={blog}
        user={user}
        onLike={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(screen.getByText('Testing React Components')).toBeVisible()
    expect(screen.getByText('Test Author')).toBeVisible()
    expect(screen.queryByText('http://test.com')).toBeNull()
    expect(screen.queryByText(/likes/i)).toBeNull()
  })

  test('shows content and likes after clicking the view button', async () => {
    const userEventInstance = userEvent.setup()

    render(
      <Blog
        blog={blog}
        user={user}
        onLike={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    await userEventInstance.click(screen.getByText('view'))

    expect(screen.getByText('http://test.com')).toBeVisible()
    expect(screen.getByText('likes')).toBeVisible()
    expect(screen.getByText('5')).toBeVisible()
  })

  test('calls onLike twice when like button is clicked twice', async () => {
    const likeHandler = vi.fn()
    const userEventInstance = userEvent.setup()

    render(
      <Blog
        blog={blog}
        user={user}
        onLike={likeHandler}
        onDelete={vi.fn()}
      />
    )

    await userEventInstance.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    await userEventInstance.click(likeButton)
    await userEventInstance.click(likeButton)

    expect(likeHandler).toHaveBeenCalledTimes(2)
  })
})
