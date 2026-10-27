import { useState } from 'react'

const Blog = ({ blog, updateBlog, user, username, removeBlogId }) => {
  const [visible, setVisible] = useState(false)
  const isLoggedIn = Boolean(user)
  const isOwner = Boolean(username && username === blog.user?.username)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    updateBlog(blog.id, updatedBlog)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${user}?`)) {
      console.log(`Removing blog ${blog.title} by ${user}`)
      removeBlogId(blog.id)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 1,
  }
  const buttonStyle = {
    backgroundColor: '#a1a1aa',
    borderRadius: '4px',
    padding: '2px 2px',
    cursor: 'pointer',
  }
  const buttonRemoveStyle = {
    backgroundColor: '#9eadce',
    borderRadius: '4px',
    padding: '2px 2px',
    cursor: 'pointer',
  }
  // container for title and toggle button: button sits right after title
  const headerStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '10px',
  }

  return (
    <div style={blogStyle}>
      <div style={headerStyle}>
        <span>Title: {blog.title}</span>
        {isLoggedIn && (
          <button style={buttonStyle} onClick={toggleVisibility}>
            {visible ? 'Hide' : 'Show'}
          </button>
        )}
      </div>

      <div>Author: {blog.author}</div>

      {!isLoggedIn || visible ? (
        <>
          <div>Url: {blog.url}</div>
          <div>
            <span>Likes: {blog.likes}</span>
            {isLoggedIn && <button onClick={handleLike}>Like</button>}
          </div>
          {isOwner && (
            <div>
              <span> {user}</span>
              <button style={buttonRemoveStyle} onClick={handleRemove}>
                Remove
              </button>
            </div>
          )}
        </>
      ) : null}

      <p></p>
    </div>
  )
}

export default Blog
