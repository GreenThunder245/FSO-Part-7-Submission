const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });

  response.json(blogs);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  const body = request.body;

  const user = request.user;

  if (!user) {
    return response.status(400).json({ error: "userId missing or not valid" });
  }

  if (!body.title) {
    return response.status(400).json({ error: "title missing" });
  }
  if (!body.url) {
    return response.status(400).json({ error: "url missing" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  const returnedBlog = await savedBlog.populate("user", { username: 1, name: 1 })

  response.status(201).json(returnedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;

  if (!user) {
    return response.status(400).json({ error: "userId missing or not valid" });
  }

  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(400).json({ error: "Not Your Blog to Delete" });
  }

  await Blog.findByIdAndDelete(request.params.id);

  user.blogs = user.blogs.filter(userBlog => userBlog.toString() !== blog.id)
  await user.save();
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  console.log(request.params)
  const updatingBlog = await Blog.findById(request.params.id);

  if (!updatingBlog) {
    return response.status(404).end();
  }

  updatingBlog.user = body.user
  updatingBlog.title = body.title;
  updatingBlog.author = body.author;
  updatingBlog.url = body.url;
  updatingBlog.likes = body.likes;

  const updatedBlog = await updatingBlog.save();

  const returnedBlog = await updatedBlog.populate("user", { username: 1, name: 1 })

  response.json(returnedBlog);
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const commentedBlog = await Blog.findById(request.params.id);

  commentedBlog.comments = commentedBlog.comments.concat(request.body.comment)
  const savedBlog = await commentedBlog.save();
  const returnedBlog = await savedBlog.populate("user", { username: 1, name: 1 })
  response.json(returnedBlog);
});

module.exports = blogsRouter;
