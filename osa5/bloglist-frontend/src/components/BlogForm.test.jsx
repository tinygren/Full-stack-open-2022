import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

test('calls addBlog with correct details when a new blog is created', async () => {
  const addBlog = vi.fn()

  render(<BlogForm addBlog={addBlog} />)

  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')
  const createButton = screen.getByRole('button', { name: 'Create' })

  await userEvent.type(titleInput, 'New Blog Title')
  await userEvent.type(authorInput, 'Jane Author')
  await userEvent.type(urlInput, 'https://newblog.example')

  await userEvent.click(createButton)

  expect(addBlog).toHaveBeenCalledTimes(1)
  expect(addBlog).toHaveBeenCalledWith({
    title: 'New Blog Title',
    author: 'Jane Author',
    url: 'https://newblog.example',
  })
  // inputs should be cleared after submit
  expect(titleInput).toHaveValue('')
  expect(authorInput).toHaveValue('')
  expect(urlInput).toHaveValue('')
})
