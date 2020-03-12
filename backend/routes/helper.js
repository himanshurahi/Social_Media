const User = require("../models/user.model");
const updateChatList = async (req, newMessage) => {
  await User.update(
    {
      _id: req.userData.id
    },
    {
      $pull: {
        chatList: {
          ReceiverId: recieverId
        }
      }
    }
  );

  await User.update(
    {
      _id: recieverId
    },
    {
      $pull: {
        chatList: {
          ReceiverId: req.userData.id
        }
      }
    }
  );

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
};

const testFunc = (req, res) => {
  res.send({ msg: "yeahh boi" });
};

const deleteImage = async (userId, imageId) => {
  const user = await User.update(
    {
      _id: userId
    },
    {
      $pull: {
        images: {
          imageId: imageId
        }
      }
    }
  );
  return user
};

module.exports = {
  updateChatList: updateChatList,
  testFunc: testFunc,
  deleteImage: deleteImage
};
