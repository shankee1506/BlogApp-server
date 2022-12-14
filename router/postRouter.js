const Post = require("../model/Post");
const { verifyToken } = require("./verifyToken");

const postRouter = require("express").Router();

postRouter.post("/post/create", verifyToken, async (req, res) => {
  const { title, image, video } = req.body;

  try {
    const post = new Post({
      title: title,
      image: image,
      video: video,
      user: req.user.id,
    });

    const postData = await post.save();

    res
      .status(200)
      .json({ post: postData, message: "Successfully added post" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

//get user post
postRouter.get("/post/get", verifyToken, async (req, res) => {
  try {
    const myPost = await Post.findOne({ user: req.user.id });

    if (!myPost) {
      res.status(400).json("Not post in here");
    } else {
      res.status(200).json({ post: myPost });
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
});
module.exports = postRouter;
