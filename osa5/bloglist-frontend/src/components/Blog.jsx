import { useState } from "react";

const Blog = ({ blog, updateBlog, user, removeBlogId }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    updateBlog(blog.id, updatedBlog);
  };

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${user}?`)) {
      // Call the remove function from blogService to delete the blog
      removeBlogId(blog.id);
    }
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 1,
  };
  const buttonStyle = {
    backgroundColor: "#a1a1aa",
    borderRadius: "4px",
    padding: "2px 2px",
    cursor: "pointer",
  };
  const buttonRemoveStyle = {
    backgroundColor: "#2563eb",
    borderRadius: "4px",
    padding: "2px 2px",
    cursor: "pointer",
  };
  // container for title and toggle button: button sits right after title
  const headerStyle = {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "10px",
  };

  return (
    <div style={blogStyle}>
      <div style={headerStyle}>
        <span>Title: {blog.title}</span>
        <button style={buttonStyle} onClick={toggleVisibility}>
          {visible ? "Hide" : "Show"}
        </button>
      </div>

      {visible ? (
        <>
          <div>Author: {blog.author}</div>
          <div>Url: {blog.url}</div>
          <div>
            <span>Likes: {blog.likes}</span>
            <button onClick={handleLike}>Like</button>
          </div>
          <div>
            <span> {user}</span>
            <button style={buttonRemoveStyle} onClick={handleRemove}>
              Remove
            </button>
          </div>
        </>
      ) : null}

      <p></p>
    </div>
  );
};

export default Blog;
