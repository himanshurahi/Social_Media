const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
  participants: [
    {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }
  ]
});

const Converstaion = mongoose.model("Conversation", ConversationSchema);

module.exports = Converstaion;
