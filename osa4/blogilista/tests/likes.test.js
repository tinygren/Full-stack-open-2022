const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test.only('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})

describe('Blog which has most of likes', () => {
  const listWithBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'React patterns',  
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 3,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fa',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'https://reactpatterns.com/',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fb',
      title: 'First class tests', 
      author: 'Robert C. Martin',
      url: 'https://reactpatterns.com/',
      likes: 10,
      __v: 0
    }
  ]

  test('Favorite blog which has most likes', () => {
    const result = listHelper.favoriteBlog(listWithBlogs)
    assert.deepStrictEqual(result, listWithBlogs[2])
  })
})

describe('Author who has most of the blogs', () => {
  const listWithBlogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'React patterns',  
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 3,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fa',
      title: 'Canonical string reduction',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17fb',
      title: 'First class tests', 
      author: 'Robert C. Martin',
      url: 'https://reactpatterns.com/',
      likes: 10,
      __v: 0
    }
  ]

  test('Author which have the most blogs', () => {
    const result = listHelper.mostBlogs(listWithBlogs)
    assert.deepStrictEqual(result, { author: "Michael Chan",  blogs: 2 })
  })
})

