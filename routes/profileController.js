/*jshint esversion:6 */
const express           = require("express");
const profileController = express.Router();

// User model
const User  = require("../models/user");
const Tweet = require("../models/tweet");

// Moment to format dates
const moment = require("moment");

profileController.get("/:username", (req, res, next) => {
  User
    .findOne({ username: req.params.username }, "_id username")
    .exec((err, user) => {
      if (!user) { return next(err); }

      Tweet.find({ "user_name": user.username }, "tweet created_at")
        .sort({ created_at: -1 })
        .exec((err, tweets) => {
          res.render("profile/show", {
            username: user.username,
            tweets,
            moment
          });
      });
  });
});

module.exports=profileController;
