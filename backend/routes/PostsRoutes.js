const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Post = require("../models/posts.model");
const User = require("../models/user.model");
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "dzw9hmcvg",
  api_key: "695943566692867",
  api_secret: "n8TDjF76UiH8lsC7_FltHU3fBPA"
});
router.get("/", (req, res) => {
  res.send("test");
});

router.post("/addpost", auth, async (req, res) => {
  if (!req.body.postBody) {
    return res.status(400).send({ error_msg: "All Field Required" });
  }

  const createPost = async post => {
    try {
      await post.save();
      res.status(200).send(post);
    } catch (error) {
      res.status(400).send(error);
    }
  };
  if (req.body.image) {
    cloudinary.uploader.upload(req.body.image, async result => {
      const post = new Post({
        user: req.userData.id,
        post: req.body.postBody,
        createdAt: new Date(),
        picId: result.public_id,
        picVersion: result.version
      });

      createPost(post);
    });
  } else {
    const post = new Post({
      user: req.userData.id,
      post: req.body.postBody,
      createdAt: new Date()
    });
    createPost(post);
  }
});

router.get("/posts", auth, async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("user", ["username", "email", "picVersion", "picId"])
      .sort({ createdAt: -1 });
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/addlike", auth, async (req, res) => {
  console.log(req.userData);
  const postID = req.body._id;
  try {
    const updatedPost = await Post.update(
      {
        _id: postID,
        "likes.userID": { $ne: req.userData.id }
      },
      {
        $push: {
          likes: {
            userID: req.userData.id
          }
        }
      }
    );
    res.status(200).send(updatedPost);
  } catch (error) {
    res.status(400).send({ error_msg: "error" });
  }
});

router.post("/addcomment", auth, async (req, res) => {
  try {
    const updatedPost = await Post.findOneAndUpdate(
      {
        _id: req.body.postID
      },
      {
        $push: {
          comments: {
            userID: req.userData.id,
            comment: req.body.comment.commentBody,
            createdAt: Date.now()
          }
        }
      },
      { new: true }
    );
    res.status(200).send(updatedPost);
  } catch (e) {
    res.status(400).send({ error_msg: "error" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id })
      .populate("comments.userID")
      .populate("user", ["username", "email"]);

    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/test", auth, async (req, res) => {
  //   const post = await Post.updateOne({ _id: '5e45a79a1b5339275c446de7' }, {
  //       $push : {
  //           likes : {
  //             userID : req.userData.id
  //           }
  //       }
  //   })
  //   const nPost = await Post.findOne({_id : '5e45a79a1b5339275c446de7'})
  //   res.send(nPost)
  // const post = await Post.find({user : {$ne : '5e45a79a1b5339275c446de7'}}).populate({path : 'user', match : {username : 'himanshurahi'}})
  // res.send(post)
});

module.exports = router;
