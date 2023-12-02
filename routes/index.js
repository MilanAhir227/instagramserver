var express = require("express");
var router = express.Router();
const usercontrollers = require("../controllers/user");

const multer = require("multer");

const storagepost = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/post");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

const uploadpost = multer({ storage: storagepost });

const storageuser = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/user");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

const uploaduser = multer({ storage: storageuser });

//user

router.post("/user/singup", usercontrollers.usercreate);
router.post("/user/login", usercontrollers.userlogin);
router.post(
  "/user/follow",
  usercontrollers.userauth,
  usercontrollers.userfollow
);
router.post(
  "/user/unfollow",
  usercontrollers.userauth,
  usercontrollers.userunfollow
);
router.patch("/user/update", usercontrollers.useredit);
router.patch(
  "/user/profile",
  usercontrollers.userauth,
  uploaduser.single("profileimg"),
  usercontrollers.userprofile
);
router.get("/user/find", usercontrollers.userauth, usercontrollers.userfind);
router.get(
  "/user/findbyid",
  usercontrollers.userauth,
  usercontrollers.userfindbyid
);
router.get(
  "/user/findbyuname",
  usercontrollers.userauth,
  usercontrollers.userfindbyuname
);
router.get(
  "/user/followingfind",
  usercontrollers.userauth,
  usercontrollers.userfollowingfind
);
router.get(
  "/user/suggestion",
  usercontrollers.userauth,
  usercontrollers.usersuggestion
);
router.get("/user", usercontrollers.userauth, usercontrollers.usersearch);

//user

//post

router.post(
  "/post/create",
  usercontrollers.userauth,
  uploadpost.single("img"),
  usercontrollers.postcreate
);
router.post("/post/like", usercontrollers.userauth, usercontrollers.postlike);
router.post("/post/save", usercontrollers.userauth, usercontrollers.postsave);
router.post(
  "/post/unlike",
  usercontrollers.userauth,
  usercontrollers.postunlike
);
router.post(
  "/post/unsave",
  usercontrollers.userauth,
  usercontrollers.postunsave
);
router.post(
  "/post/comment",
  usercontrollers.userauth,
  usercontrollers.postcomment
);
router.get("/post/find", usercontrollers.postfind);
router.get("/post/following", usercontrollers.postfollowing);

//post

//chat
router.post("/chat/createconverstiom", usercontrollers.createconverstion);
router.post("/messages/add", usercontrollers.messageadd);
router.get("/chat/getconverstiom", usercontrollers.getconverstion);
router.get("/messages/get", usercontrollers.messageget);

//chat


module.exports = router;
