const express = require("express");
const app = express();
const router = express.Router();
const auth = require("../middleware/auth");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const Conversation = require("../models/conversation.model");
const helper = require("./helper");
const mongoose = require("mongoose");

router.get("/", (req, res) => {
  res.send("test");
});

router.post("/sendmessage", auth, async (req, res) => {
  const recieverId = req.body.recieverId;
  const message = req.body.message.message;
  const senderId = req.userData.id;

  const checkConvo = await Conversation.findOne({
    $or: [
      {
        "participants.senderId": req.userData.id,
        "participants.receiverId": recieverId
      },
      {
        "participants.senderId": recieverId,
        "participants.receiverId": req.userData.id
      }
    ]
  });

  if (checkConvo) {
    //updating chatList
    const newMessage = await Message.findOne({
      convoId: checkConvo._id
    });
    helper.updateChatList(req, newMessage);

    //i have done this cuz i want to show recent first.....:P
    //end of updating chatList

    try {
      const updateMessage = await Message.update(
        {
          convoId: checkConvo._id
        },
        {
          $push: {
            message: {
              senderId: req.userData.id,
              recieverId: recieverId,
              body: message,
              isRead: false,
              createdAt: Date.now()
            }
          }
        }
      );

      res.send(updateMessage);
    } catch (error) {
      res.status(400).send(error);
    }
  } else {
    const convo = new Conversation({
      participants: [
        {
          senderId: req.userData.id,
          receiverId: recieverId
        }
      ]
    });

    try {
      const newconvo = await convo.save();

      const message1 = new Message({
        convoId: newconvo._id,
        message: [
          {
            senderId: req.userData.id,
            recieverId: recieverId,
            body: message,
            isRead: false,
            createdAt: Date.now()
          }
        ]
      });
      const newMessage = await message1.save();

      res.status(200).send(newMessage);

      await User.update(
        {
          _id: req.userData.id
        },
        {
          $push: {
            chatList: {
              $each: [
                {
                  SenderId: req.userData.id,
                  ReceiverId: recieverId,
                  messageId: newMessage._id
                }
              ],
              $position: 0
            }
          }
        }
      );

      await User.update(
        {
          _id: recieverId
        },
        {
          $push: {
            chatList: {
              $each: [
                {
                  SenderId: recieverId,
                  ReceiverId: req.userData.id,
                  messageId: newMessage._id
                }
              ],
              $position: 0
            }
          }
        }
      );
    } catch (error) {
      res.status(400).send(error);
    }
  }
});

router.get("/getmessages/:id", auth, async (req, res) => {
  const checkConvo = await Conversation.findOne({
    $or: [
      {
        "participants.senderId": req.userData.id,
        "participants.receiverId": req.params.id
      },
      {
        "participants.senderId": req.params.id,
        "participants.receiverId": req.userData.id
      }
    ]
  });

  if (checkConvo) {
    const messages = await Message.findOne({
      convoId: checkConvo._id
    }).populate('message.senderId');
    res.status(200).send(messages);
  } else {
    res.status(404).send({ error_msg: "No Message" });
  }
});

router.post("/mark-message", async (req, res) => {
  console.log(req.body);
  const message = await Message.aggregate([
    { $unwind: "$message" },
    {
      $match: {
        "message.senderId": new mongoose.Types.ObjectId(req.body.reciever),
        "message.recieverId": new mongoose.Types.ObjectId(req.body.sender)
      }
    }
  ]);

    if (message) {
      try {
        message.forEach(async msg => {
          const UpdatedMessage = await Message.update(
            {
              "message._id": msg.message._id
            },
            {
              $set: {
                "message.$.isRead": true
              }
            }
          );
          console.log(UpdatedMessage);
        });
        res.status(200).send({msg : "Message Marked As Read"});
      } catch (error) {
        console.log(error);
        res.status(400).send(error);
      }
    }
});

// router.get("/test", auth, async (req, res) => {
//   const me = await User.aggregate([
//     {
//       $unwind: {
//         path: "$chatList",
//         includeArrayIndex: "index"
//       }
//     },
//     {
//       $match: {
//         _id: mongoose.Types.ObjectId("5e4ae76bd4e24418a020b665")
//       }
//     },
//     {
//       $group: {
//         _id: "$_id",
//         updates: {
//           $push: "$chatList"
//         }
//       },
//     },
//     {
//         $project : {
//             'User.chatList' : '$updates'
//         }
//     }
//   ]);

//   res.status(200).send(me);
// });

module.exports = router;
