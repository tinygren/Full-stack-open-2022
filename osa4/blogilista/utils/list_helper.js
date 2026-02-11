const dummy = (blogs) => {
  return blogs.length === 0 
  ? 1 
  : blogs.length
}

// calculates the total likes of all blogs in the list

// const totalLikes = (listoneBlog) => {
//   const [{ likes }] = listoneBlog;
//   return likes;
// }

const totalLikes = (blogs) => {
  //If you later want total likes from many blogs:
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  let favorite = blogs[0];

  for (let blog of blogs) {
    if (blog.likes > favorite.likes) {
      favorite = blog;
    }
  }

  return favorite;
}

const mostBlogs = (blogs) => {
  const authorBlogCount = {};

  for (let blog of blogs) {
    if (authorBlogCount[blog.author]) {
      authorBlogCount[blog.author] += 1;
    } else {
      authorBlogCount[blog.author] = 1;
    }
  }

  let maxBlogs = 0;
  let prolificAuthor = null;

  for (let author in authorBlogCount) {
    if (authorBlogCount[author] > maxBlogs) {
      maxBlogs = authorBlogCount[author];
      prolificAuthor = author;
    }
  }

  return { author: prolificAuthor, blogs: maxBlogs };
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
