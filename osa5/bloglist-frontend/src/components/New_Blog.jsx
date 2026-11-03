import { Button, Stack, TextField } from '@mui/material'

const New_Blog = ({ addBlog }) => {
  return (
    <div>
      <h2>Create new</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const title = e.target.title.value
          const author = e.target.author.value
          const url = e.target.url.value
          addBlog({ title, author, url, likes: 0 })
        }}
      >
        <Stack spacing={1.5} alignItems="flex-start" sx={{ maxWidth: 360 }}>
          <TextField
            name="title"
            placeholder="title"
            aria-label="title"
            required
            fullWidth
          />
          <TextField
            name="author"
            placeholder="author"
            aria-label="author"
            required
            fullWidth
          />
          <TextField
            name="url"
            placeholder="url"
            aria-label="url"
            required
            fullWidth
          />
          <Button type="submit" variant="contained">
            Create
          </Button>
        </Stack>
      </form>
    </div>
  )
}

export default New_Blog
