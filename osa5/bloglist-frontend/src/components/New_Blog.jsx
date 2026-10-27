const New_Blog = ({ addBlog }) => {
  const blogStyle = {
    border: '1px solid #ccc',
    padding: '10px',
    margin: '10px 0',
  }
  return (
    <div style={blogStyle}>
      <h2>Create new</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const title = e.target.title.value
          console.log('title:', title)
          const author = e.target.author.value
          console.log('author:', author)
          const url = e.target.url.value
          console.log('url:', url)
          const likes = parseInt(e.target.likes.value)
          console.log('likes:', likes)
          addBlog({ title, author, url, likes })
        }}
      >
        <div>
          Title: <input type="text" name="title" />
        </div>
        <div>
          Author: <input type="text" name="author" />
        </div>
        <div>
          URL: <input type="text" name="url" />
        </div>
        <div>
          Likes: <input type="number" name="likes" />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default New_Blog
