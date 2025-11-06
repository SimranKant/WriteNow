const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const User = require("../models/users");

// 📥 Inbox route — show all users you've chatted with
router.get("/inbox", async (req, res) => {
  const userId = req.user._id;
  console.log(userId);
  // Find all messages involving this user
  const messages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .populate("sender receiver", "username profilePicture")
    .sort({ timestamp: -1 });

  // Create a map to store unique conversations
  const chats = new Map();

  messages.forEach((msg) => {
    const partner = msg.sender._id.equals(userId) ? msg.receiver : msg.sender;

    // Only keep the latest message per conversation
    if (!chats.has(partner._id.toString())) {
      chats.set(partner._id.toString(), {
        user: partner,
        lastMessage: msg.message,
        time: msg.timestamp,
      });
    }
  });
  res.render("chatList", { chats: Array.from(chats.values()) });
});

// 📤 Chat between 2 users
router.get("/:receiverId", async (req, res) => {
  const { receiverId } = req.params;
  const senderId = req.user._id;

  const messages = await Message.find({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId },
    ],
  }).sort({ timestamp: 1 });
  console.log("Sender from session:", senderId);
  console.log("Receiver:", receiverId);
  console.log("Message:", messages);

  const receiver = await User.findById(receiverId);
  res.render("chat", { receiver, messages, senderId });
});

module.exports = router;
