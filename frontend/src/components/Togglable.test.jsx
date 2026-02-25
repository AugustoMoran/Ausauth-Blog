import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, test, expect } from 'vitest'
import Togglable from './Togglable'

describe('Togglable', () => {
  test('shows children after clicking the button', async () => {
    const user = userEvent.setup()

    render(
      <Togglable buttonLabel="show">
        <div>test content</div>
      </Togglable>
    )

    expect(screen.queryByText('test content')).not.toBeVisible()

    await user.click(screen.getByText('show'))

    expect(screen.getByText('test content')).toBeVisible()
  })
})
