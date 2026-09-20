const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const helper = require("./test_helper.js");
const Blog = require("../models/blog");
const User = require("../models/user.js");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  await User.insertMany(helper.initialUsers);
  await Blog.insertMany(helper.initialBlogs);
});

describe("Getting all blogs", () => {
  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("the unique identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs");
    response.body.forEach((blog) => assert.ok(Object.hasOwn(blog, "id")));
  });
});

describe("adding a blog", () => {
  test("a valid blog can be added", async () => {
    const loginDetails = {
      username: helper.initialUsers[2].username,
      password: helper.initialUsers[2].password,
    };

    const response = await api
      .post("/api/login")
      .send(loginDetails)
      .expect(200);

    const users = await helper.usersInDb();

    const newBlog = {
      title: "A Little About Patterns.",
      author: "Uncle Bob",
      url: "https://blog.cleancoder.com/uncle-bob/2014/06/30/ALittleAboutPatterns.html",
      likes: 1,
      userId: users[2].id,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${response.body.token}`)
      .expect(201);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
  });

  test("if the likes property is missing from the request, it will default to the value 0", async () => {
    const loginDetails = {
      username: helper.initialUsers[2].username,
      password: helper.initialUsers[2].password,
    };

    const response = await api
      .post("/api/login")
      .send(loginDetails)
      .expect(200);

    const users = await helper.usersInDb();

    const newBlog = {
      title: "A Little About Patterns.",
      author: "Uncle Bob",
      url: "https://blog.cleancoder.com/uncle-bob/2014/06/30/ALittleAboutPatterns.html",
      userId: users[2].id,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${response.body.token}`)
      .expect(201);

    const blogsAtEnd = await helper.blogsInDb();
    const addedBlog = blogsAtEnd.find((blog) => blog.title == newBlog.title);
    assert.strictEqual(addedBlog.likes, 0);
  });

  test("if the url properties are missing is missing 400 status", async () => {
    const loginDetails = {
      username: helper.initialUsers[2].username,
      password: helper.initialUsers[2].password,
    };

    const response = await api
      .post("/api/login")
      .send(loginDetails)
      .expect(200);

    const users = await helper.usersInDb();

    const noURLBlog = {
      title: "A Little About Patterns.",
      author: "Uncle Bob",
      likes: 1,
      userId: users[2].id,
    };

    await api
      .post("/api/blogs")
      .send(noURLBlog)
      .set("Authorization", `Bearer ${response.body.token}`)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });

  test("if the title property are missing is missing 400 status", async () => {
    const loginDetails = {
      username: helper.initialUsers[2].username,
      password: helper.initialUsers[2].password,
    };

    const response = await api
      .post("/api/login")
      .send(loginDetails)
      .expect(200);

    const users = await helper.usersInDb();

    const noTitleBlog = {
      author: "Uncle Bob",
      url: "https://blog.cleancoder.com/uncle-bob/2014/06/30/ALittleAboutPatterns.html",
      likes: 1,
      userId: users[2].id,
    };

    await api
      .post("/api/blogs")
      .send(noTitleBlog)
      .set("Authorization", `Bearer ${response.body.token}`)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });
});

describe("Deleting a blog", () => {
  test("Blog is Deleted", async () => {
    const loginDetails = {
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password,
    };

    const response = await api
      .post("/api/login")
      .send(loginDetails)
      .expect(200);

    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${response.body.token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    const ids = blogsAtEnd.map((n) => n.id);
    assert(!ids.includes(blogToDelete.id));

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
  });
});

describe("Updating a blog", () => {
  test("Blog is Updated by adding likes", async () => {
    const users = await helper.usersInDb();

    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const updatingBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
      userId: users[0].id,
    };

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatingBlog);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);

    assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1);
  });
});

after(async () => {
  await mongoose.connection.close();
});
