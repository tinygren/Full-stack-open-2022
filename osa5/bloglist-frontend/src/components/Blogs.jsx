import Blog from './Blog'
const Blogs = ({ blogs, user, updateBlog, removeBlogId }) => {
  return (
    <div>
      <h2>Blogs:</h2>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          user={user?.name}
          username={user?.username}
          removeBlogId={removeBlogId}
        />
      ))}
    </div>
  )
}

export default Blogs
