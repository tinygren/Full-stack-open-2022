const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const Blog = require("../models/blog");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
  });
  response.json(users);
});

usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return response.status(400).json({ error: "username must be unique" });
    }
    if (!password || password.length < 3) {
      return response
        .status(400)
        .json({ error: "password must be at least 3 characters long" });
    }
    if (!username || username.length < 3) {
      return response
        .status(400)
        .json({ error: "username must be at least 3 characters long" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return response.status(400).json({ error: "username must be unique" });
    }
    return next(error);
  }
});

usersRouter.delete("/:id", async (request, response, next) => {
  try {
    const userId = request.params.id;

    await Blog.deleteMany({ user: userId });

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return response.status(404).json({ error: "user not found" });
    }

    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
