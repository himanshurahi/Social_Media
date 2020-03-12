const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation"
  },

  sender: {
    type: String
  },

  reciever: {
    type: String
  },

  convoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation"
  },

  message: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      body: {
        type: String
      },
      isRead: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now()
      }
    }
  ]
});

const message = mongoose.model("Message", MessageSchema);

module.exports = message;
