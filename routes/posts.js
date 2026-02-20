const express = require("express");
const { getPosts } = require("../notion");
const { renderPosts } = require("../views/posts");

const app = express();

app.get("/", async (req, res) => {
  let posts = [];
  let error = null;

  try {
    posts = await getPosts();
  } catch (e) {
    error = e.message;
  }

  res.send(renderPosts(posts, error));
});

module.exports = app;
