import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest'

test('shows blog details and likes to a logged-out user without buttons', () => {
  const blog = {
    title: 'Test Blog',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5,
  }
  render(<Blog blog={blog} />)

  expect(screen.getByText('Test Blog')).toBeInTheDocument()
  expect(screen.getByText('by John Doe')).toBeInTheDocument()
  expect(
    screen.getByRole('link', { name: 'https://example.com' }),
  ).toHaveAttribute('href', 'https://example.com')
  expect(screen.getByText('5 likes')).toBeInTheDocument()

  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})

test('shows url, likes and user when show button is clicked', async () => {
  const blog = {
    id: '123',
    title: 'Test Blog',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5,
    user: { username: 'test-user' },
  }
  const user = 'test-user'

  render(
    <Blog
      blog={blog}
      updateBlog={() => {}}
      user={user}
      username={user}
      removeBlogId={() => {}}
    />,
  )

  expect(
    screen.queryByRole('link', { name: 'https://example.com' }),
  ).not.toBeInTheDocument()
  expect(screen.queryByText('5 likes')).not.toBeInTheDocument()
  expect(screen.queryByText('Added by test-user')).not.toBeInTheDocument()

  // click Show button
  const showButton = screen.getByRole('button', { name: 'Show' })
  await userEvent.click(showButton)

  // url, likes and user should be visible after clicking Show
  expect(
    screen.getByRole('link', { name: 'https://example.com' }),
  ).toBeInTheDocument()
  expect(screen.getByText('5 likes')).toBeInTheDocument()
  expect(screen.getByText('Added by test-user')).toBeInTheDocument()
})

test('calls updateBlog twice when like button clicked twice', async () => {
  const blog = {
    id: '123',
    title: 'Test Blog',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5,
    user: { username: 'test-user' },
  }

  const user = 'test-user'
  const updateBlog = vi.fn()

  render(
    <Blog
      blog={blog}
      updateBlog={updateBlog}
      user={user}
      username={user}
      removeBlogId={() => {}}
    />,
  )

  // reveal details to show Like button
  const showButton = screen.getByRole('button', { name: 'Show' })
  await userEvent.click(showButton)

  const likeButton = screen.getByRole('button', { name: 'Like' })
  await userEvent.click(likeButton)
  await userEvent.click(likeButton)

  expect(updateBlog).toHaveBeenCalledTimes(2)
})

test('shows only the Like action to a logged-in user who did not create the blog', async () => {
  const blog = {
    id: '123',
    title: 'Test Blog',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5,
    user: { username: 'blog-owner' },
  }
  const updateBlog = vi.fn()

  render(
    <Blog
      blog={blog}
      updateBlog={updateBlog}
      user="Logged-in User"
      username="another-user"
      removeBlogId={() => {}}
    />,
  )

  await userEvent.click(screen.getByRole('button', { name: 'Show' }))

  expect(screen.getByRole('button', { name: 'Like' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()
  expect(screen.getByText('5 likes')).toBeInTheDocument()

  await userEvent.click(screen.getByRole('button', { name: 'Like' }))
  expect(updateBlog).toHaveBeenCalledTimes(1)
})

test('shows the Remove button to the blog creator and removes the blog when confirmed', async () => {
  const blog = {
    id: '123',
    title: 'Test Blog',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5,
    user: { username: 'blog-owner' },
  }
  const removeBlogId = vi.fn()
  const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

  render(
    <Blog
      blog={blog}
      updateBlog={() => {}}
      user="Blog Owner"
      username="blog-owner"
      removeBlogId={removeBlogId}
    />,
  )

  await userEvent.click(screen.getByRole('button', { name: 'Show' }))

  const removeButton = screen.getByRole('button', { name: 'Remove' })
  expect(removeButton).toBeInTheDocument()

  await userEvent.click(removeButton)

  expect(confirmSpy).toHaveBeenCalledWith('Remove blog Test Blog by Blog Owner?')
  expect(removeBlogId).toHaveBeenCalledWith('123')

  confirmSpy.mockRestore()
})
