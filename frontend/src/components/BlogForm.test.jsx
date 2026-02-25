import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('calls createBlog with correct data when form is submitted', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    const { container } = render(<BlogForm createBlog={createBlog} />)

    const inputs = container.querySelectorAll('input[type="text"]')
    const titleInput = inputs[0]
    const authorInput = inputs[1]
    const contentInput = inputs[2]
    const submitButton = screen.getByText('create')

    await user.type(titleInput, 'Component Testing is Fun')
    await user.type(authorInput, 'Test Author')
    await user.type(contentInput, 'This is test content')
    await user.click(submitButton)

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
      title: 'Component Testing is Fun',
      author: 'Test Author',
      content: 'This is test content',
    })
  })
})
