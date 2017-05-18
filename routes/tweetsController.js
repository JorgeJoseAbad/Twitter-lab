/*jshint esversion:6 */
const express          = require("express");
const tweetsController = express.Router();

tweetsController.get("/", (req, res, next) => {
  res.render(
    "tweets/index",
    { username: req.session.currentUser.username}
  );
});

module.exports = tweetsController;
