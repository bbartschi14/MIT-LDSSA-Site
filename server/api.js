/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const SOTD = require("./models/sotd");
const Comment = require("./models/comment");
const Activity = require("./models/activity");
const User = require("./models/user");
const Message = require("./models/message");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

const socketManager = require("./server-socket");

router.get("/stories", (req, res) => {
  // empty selector means get all documents
  Story.find({}).then((stories) => res.send(stories));
});

router.post("/sotd", auth.ensureLoggedIn, (req, res) => {
  const newSOTD = new SOTD({
    creator_id: req.user._id,
    creator_name: req.user.name,
    verse: req.body.verse,
    reflection: req.body.reflection,
    date: req.body.date
  });

  newSOTD.save().then((sotd) => res.send(sotd));
});

router.get("/sotd", (req, res) => {
  SOTD.find({ date: req.query.date }).then((sotd) => {
    res.send(sotd);
  });
});

router.get("/sotds", (req, res) => {
  // empty selector means get all documents
  SOTD.find({}).then((sotds) => res.send(sotds));
});

router.get("/comment", (req, res) => {
  Comment.find({ date: req.query.date }).then((comments) => {
    res.send(comments);
  });
});

router.post("/comment", auth.ensureLoggedIn, (req, res) => {
  const newComment = new Comment({
    creator_id: req.user._id,
    creator_name: req.user.name,
    date: req.body.date,
    content: req.body.content,
  });

  newComment.save().then((comment) => res.send(comment));
});


router.get("/activities", (req, res) => {
  // empty selector means get all documents
  Activity.find({}).then((activities) => res.send(activities));
});


router.get("/activity/delete", (req, res) => {
  Activity.deleteOne({_id:req.query._id}).then((activities) => res.send(activities));
});


router.post("/activity", (req, res) => {
  console.log("Posting activity " + req);
  const newActivity = new Activity({
    title: req.body.title,
    description: req.body.description,
    time: req.body.time,
    dayOfWeek: req.body.dayOfWeek,
    style: req.body.style,
    days: req.body.days,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  });

  newActivity.save().then((activity) => res.send(activity));
});


router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.get("/user", (req, res) => {
  User.findById(req.query.userid).then((user) => {
    res.send(user);
  });
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

router.get("/chat", (req, res) => {
  let query;
  if (req.query.recipient_id === "ALL_CHAT") {
    // get any message sent by anybody to ALL_CHAT
    query = { "recipient._id": "ALL_CHAT" };
  } else {
    // get messages that are from me->you OR you->me
    query = {
      $or: [
        { "sender._id": req.user._id, "recipient._id": req.query.recipient_id },
        { "sender._id": req.query.recipient_id, "recipient._id": req.user._id },
      ],
    };
  }

  Message.find(query).then((messages) => res.send(messages));
});

router.post("/message", auth.ensureLoggedIn, (req, res) => {
  console.log(`Received a chat message from ${req.user.name}: ${req.body.content}`);

  // insert this message into the database
  const message = new Message({
    recipient: req.body.recipient,
    sender: {
      _id: req.user._id,
      name: req.user.name,
    },
    content: req.body.content,
  });
  message.save();

  if (req.body.recipient._id == "ALL_CHAT") {
    socketManager.getIo().emit("message", message);
  } else {
    socketManager.getSocketFromUserID(req.body.recipient._id).emit("message", message);
    if(req.user._id !== req.body.recipient._id) socketManager.getSocketFromUserID(req.user._id).emit("message", message);
  }
});

router.get("/activeUsers", (req, res) => {
  res.send({ activeUsers: socketManager.getAllConnectedUsers() });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
