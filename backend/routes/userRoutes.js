const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const helper = require('./helper')

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.find({}).populate("post");
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// router.get('/test', helper.testFunc)


router.post("/follow-user", auth, async (req, res) => {
  try {
    const followUser = await User.findOneAndUpdate(
      {
        _id: req.userData.id,
        "following.userFollowed": { $ne: req.body.id }
      },
      {
        $push: {
          following: {
            userFollowed: req.body.id
          }
        }
      },
      { new: true }
    );

    await User.findOneAndUpdate(
      {
        _id: req.body.id,
        "followers.follower": { $ne: req.userData.id }
      },
      {
        $push: {
          followers: {
            follower: req.userData.id
          },
          notifications: {
            userId: req.userData.id,
            message: `${req.userData.username} is now following you.`,
            viewProfile: false,
            createdAt: new Date(),
            read: false
          }
        }
      }
    );
    // const user = await User.findOne({_id : req.body.id})
    res.status(200).send(followUser);
  } catch (error) {
    res.status(400).send(error);
  }
});



router.post("/unfollow-user", auth, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.userData.id },

      {
        $pull: {
          following: {
            userFollowed: req.body.id
          }
        }
      },
      { new: true }
    );

    await User.findOneAndUpdate(
      {
        _id: req.body.id
      },
      {
        $pull: {
          followers: {
            follower: req.userData.id
          }
        }
      }
    );
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});



router.get("/:username", auth, async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username
    })
      .populate("chatList.messageId")
      .populate("post")
      .populate("following.userFollowed")
      .populate("followers.follower", ["username", "email"]);
    const newUser = user.toObject();
    delete newUser.password;
    res.status(200).send(newUser);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/id/:id", auth, async (req, res) => {
  console.log(req.params);
  try {
    const user = await User.findOne({
      _id: req.params.id
    })
      .populate("following.userFollowed")
      .populate("followers.follower", ["username", "email"])
      .populate("chatList.messageId")
      .populate("chatList.ReceiverId")
      .populate("notifications.userId");
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});


router.patch("/notification/mark", auth, async (req, res) => {
  const id = req.body.id;
  console.log(id);
  try {
    const user = await User.updateOne(
      {
        _id: req.userData.id,
        "notifications._id": id
      },
      {
        $set: {
          "notifications.$.read": true
        }
      }
    );
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/notification/delete", auth, async (req, res) => {
  const id = req.body.id;
  try {
    const user = await User.updateOne(
      {
        _id: req.userData.id,
        "notifications._id": id
      },
      {
        $pull: {
          notifications: {
            _id: id
          }
        }
      }
    );
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/notifications/markall", auth, async (req, res) => {
  try {
    const user = await User.updateMany(
      {
        _id: req.userData.id
      },
      {
        $set: {
          "notifications.$[elem].read": true
        }
      },
      {
        arrayFilters: [
          {
            "elem.read": false
          }
        ],
        multi: true
      }
    );
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});


router.patch(
  "/change-password",
  [
    check("password")
      .isLength({ min: 2 })
      .withMessage("Password Length must be greater then 2")
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const user = await User.findOne({ _id: req.userData.id });
    const isMatched = await bcrypt.compare(
      req.body.current_password,
      user.password
    );
    if (!isMatched) {
      return res.status(400).send({ error_msg: "Current Password Invalid." });
    }

    const newPassword = await bcrypt.hash(req.body.change_password, 10);

    console.log(req.body);

    try {
      await User.updateOne(
        {
          _id: req.userData.id
        },
        {
          password: newPassword
        }
      );
      res.status(200).send({ msg: "Password Changed Successfully." });
    } catch (error) {
      res.status(400).send(error);
    }
  }
);





module.exports = router;
