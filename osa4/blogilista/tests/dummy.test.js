const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one, when empty list', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

test('dummy returns three, when list has three items', () => {
  const blogs = [1, 2, 3]

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 3)
})

