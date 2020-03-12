const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  post: {
    type: String
  },
  comments: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      comment: {
        type: String
      },
      createdAt: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  totolLikes: { type: Number, default: 0 },
  likes: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  picVersion: {
    type: String,
    default: "1583066005"
  },
  picId: {
    type: String,
    default: "default.png"
  },
});

const Posts = mongoose.model("Posts", PostsSchema);

module.exports = Posts;
