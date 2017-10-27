/*jshint esversion:6 */
const express           = require("express");
const profileController = express.Router();

// User model
const User  = require("../models/user");
const Tweet = require("../models/tweet");

// Moment to format dates
const moment = require("moment");

profileController.get("/:username/timeline", (req, res) => {
  const currentUser = req.session.currentUser;
  console.log("currentUser:  "+currentUser.username);
  currentUser.following.push(currentUser._id);

  Tweet.find({ user_id: { $in: currentUser.following } })
    .sort({ created_at: -1 })
    .exec((err, timeline) => {
      res.render("profile/timeline", {
        username: currentUser.username,
        timeline,
        moment
      });
  });
});


profileController.get("/:username", (req, res, next) => {
  console.log("estoy en get username");
  User
    .findOne({ username: req.params.username }, "_id username")
    .exec((err, user) => {
      if (!user) { return next(err); }

      //added to follow users under this
      if (req.session.currentUser) {
        isFollowing = req.session.currentUser.following.indexOf(user._id.toString()) > -1;
      }

      Tweet.find({ "user_name": user.username }, "tweet created_at")
        .sort({ created_at: -1 })
        .exec((err, tweets) => {
          if (req.session.currenUser){ //if there is a loged user
            console.log("req.session.currenUser.username: "+req.session.currentUser.username);
          }         
          console.log("req.params.username: "+req.params.username);
          res.render("profile/show", {
            username: user.username,
            session: req.session.currentUser, //added here this to follow users
              // it seemed OK, working with profile/show.ejs
            button_text: isFollowing ? "Unfollow" : "Follow",//added this
            tweets,
            moment
          });

      });
  });
});

profileController.use((req, res, next) => {
  if (req.session.currentUser) { next(); }
  else { res.redirect("/login"); }
});

profileController.post("/:username/follow", (req, res) => {
  User.findOne({ "username": req.params.username }, "_id").exec((err, follow) => {
    if (err) {
      res.redirect("/profile/" + req.params.username);
      return;
    }

    User
      .findOne({ "username": req.session.currentUser.username })
      .exec((err, currentUser) => {
        var followingIndex = currentUser.following.indexOf(follow._id);

        if (followingIndex > -1) {
          currentUser.following.splice(followingIndex, 1);
        } else {
          currentUser.following.push(follow._id);
        }

        currentUser.save((err) => {
          req.session.currentUser = currentUser;
          console.log("estoy en user findone en username/follow");
          res.redirect("/profile/" + req.params.username);
        });
      });
  });
});
// to this



module.exports=profileController;
