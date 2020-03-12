const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },

  following: [
    {
      userFollowed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }
  ],

  followers: [
    {
      follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }
  ],

  notifications: [
    {
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      message: {
        type: String
      },
      viewProfile: {
        type: Boolean
      },
      createdAt: {
        type: Date,
        default: Date.now()
      },
      read: {
        type: Boolean
      },
      date: {
        type: String
      }
    }
  ],
  chatList: [
    {
      SenderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      ReceiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
      }
    }
  ],
  picVersion: {
    type: String,
    default: "1583066005"
  },
  picId: {
    type: String,
    default: "default.png"
  },
  images: [
    {
      imageId: {
        type: String,
        default: ""
      },
      imageVersion: {
        type: String,
        default: ""
      }
    }
  ]
});

UserSchema.virtual("post", {
  ref: "Posts",
  localField: "_id",
  foreignField: "user",
  justOne: false
});

UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

const User = mongoose.model("User", UserSchema);

module.exports = User;
