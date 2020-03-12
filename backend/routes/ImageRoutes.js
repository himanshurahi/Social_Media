const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary");
const User = require("../models/user.model");
const auth = require("../middleware/auth");
const helper = require("./helper");
require('dotenv').config()
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

router.get("/", (req, res) => {
  res.send("imagee API");
});

router.post("/image-upload", auth, (req, res) => {
  cloudinary.uploader.upload(req.body.image, async result => {
    // console.log(result.error.errno)
    // if (error) {
    //   return res.status(400).send({ error_msg: "Failed To Upload" });
    // }
    if (result.error) {
      res.status(400).send(result.error);
    } else {
      await User.update(
        {
          _id: req.userData.id
        },
        {
          $push: {
            images: {
              imageId: result.public_id,
              imageVersion: result.version
            }
          }
        }
      );
      res.status(200).send({ msg: "Image Uploaded" });
    }
  });
});

router.post("/set-default", auth, async (req, res) => {
  const user = await User.update(
    {
      _id: req.userData.id
    },
    {
      $set: {
        picId: req.body.imageId,
        picVersion: req.body.imageVersion
      }
    }
  );
  res.status(200).send(user);
});

router.post("/search", async (req, res) => {
  const user = await User.find({
    username: req.body.username
  });
  res.status(200).send(user);
});

router.post("/delete", auth, async (req, res) => {
  const user = await User.findOne({
    _id: req.userData.id
  });
  if (user.picId == req.body.imageId) {
    cloudinary.uploader.destroy(req.body.imageId, async result => {
      const user = await helper.deleteImage(req.userData.id, req.body.imageId);

      const user1 = await User.update(
        {
          _id: req.userData.id
        },
        {
          $set: {
            picId: "default.png",
            picVersion: "1583066005"
          }
        }
      );
      res.status(200).send(user);
    });
  } else {
    cloudinary.uploader.destroy(req.body.imageId, async result => {
      const user = await helper.deleteImage(req.userData.id, req.body.imageId);
      res.status(200).send(user);
    });
  }

  //   cloudinary.uploader.destroy(req.body.imageId, async result => {
  //     const user = await User.update(
  //       {
  //         _id: req.userData.id
  //       },
  //       {
  //         $pull: {
  //           images: {
  //             imageId: req.body.imageId
  //           }
  //         }
  //       }
  //     );

  //     res.status(200).send(user);
  //   });
});

module.exports = router;
