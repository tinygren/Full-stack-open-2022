import { useState } from 'react'
import { Box, Button, Card, CardContent, Link, Typography } from '@mui/material'

const Blog = ({ blog, updateBlog, user, username, removeBlogId }) => {
  const [visible, setVisible] = useState(false)
  const isLoggedIn = Boolean(user)
  const isOwner = Boolean(username && username === blog.user?.username)
  const creator = blog.user?.name ?? blog.user?.username

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
      removeBlogId(blog.id)
    }
  }

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        borderColor: 'grey.300',
        boxShadow: 1,
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Typography component="h3" variant="h5">
              {blog.title}
            </Typography>
            {isLoggedIn && (
              <Button size="small" onClick={toggleVisibility}>
                {visible ? 'Hide' : 'Show'}
              </Button>
            )}
          </Box>

          <Typography color="text.secondary">by {blog.author}</Typography>

          {(!isLoggedIn || visible) && (
            <>
              <Link
                href={blog.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ width: 'fit-content' }}
              >
                {blog.url}
              </Link>
              {creator && (
                <Typography color="text.secondary">Added by {creator}</Typography>
              )}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  flexWrap: 'wrap',
                }}
              >
                <Typography>{blog.likes} likes</Typography>
                {isLoggedIn && (
                  <Button variant="outlined" onClick={handleLike}>
                    Like
                  </Button>
                )}
                {isOwner && (
                  <Button color="error" variant="outlined" onClick={handleRemove}>
                    Remove
                  </Button>
                )}
              </Box>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default Blog
