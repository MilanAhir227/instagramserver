const USER = require("../model/User");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const POST = require("../model/post");
const mongoose = require("mongoose");
const CONVERSTION = require("../model/Converstion");
const MESSAGE = require("../model/Message");

//auth
exports.userauth = async function (req, res, next) {
  try {
    const Token = req.headers.token;

    if (!Token) {
      throw new Error("first send token..!");
    }

    const checktoken = jwt.verify(Token, "SURAT");

    const checkuser = await USER.findById(checktoken.id);

    if (!checkuser) {
      throw new Error("user not found");
    }
    next();
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

//user

exports.usercreate = async function (req, res, next) {
  try {
    if (!req.body.fullname) {
      throw new Error("name is reqired..!");
    } else if (!req.body.contact && !req.body.email) {
      throw new Error("phonenumber or email is reqired..!");
    } else if (!req.body.uname) {
      throw new Error("username is reqired..!");
    } else if (!req.body.password) {
      throw new Error("password is reqired..!");
    }
    req.body.profileimg = "";
    req.body.password = await bcrypt.hash(req.body.password, 10);

    const User = await USER.findOne({ uname: req.body.uname });

    if (User) {
      throw new Error("username is already taken..! try another");
    }
    const data = await USER.create(req.body);

    res.status(201).json({
      status: "success",
      message: "user create successfully",
      data,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.userlogin = async function (req, res, next) {
  try {
    if (!req.body.uname) {
      throw new Error("username is reqired..!");
    } else if (!req.body.password) {
      throw new Error("password is reqired..!");
    }

    const data = await USER.findOne({ uname: req.body.uname });

    if (!data) {
      throw new Error("username is invalid..!");
    }
    const checkpaasword = await bcrypt.compare(
      req.body.password,
      data.password
    );
    if (!checkpaasword) {
      throw Error("invalid password");
    }
    const token = jwt.sign({ id: data._id }, "SURAT");

    const UserData = await {
      _id: data._id,
      fullname: data.fullname,
      contact: data.contact,
      uname: data.uname,
      email: data.email,
      profileimg: data.profileimg,
      followers: data.followers,
      following: data.following,
      post: data.post,
    };
    res.status(200).json({
      status: "success",
      message: "user login successfully..!",
      UserData,
      token,
    });
  } catch (error) {
     res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.useredit = async function (req, res, next) {
  try {
    if (!req.query.id) {
      throw new Error("send first user id..!");
    }

    const Usercheck = await USER.findById(req.query.id);

    if (!Usercheck) {
      throw new Error("user not found..!");
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);

    const data = await USER.findByIdAndUpdate(req.query.id, req.body);

    res.status(200).json({
      status: "success",
      message: "user updated successfully",
      data,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.userprofile = async function (req, res, next) {
  try {
    const Token = req.headers.token;
    const User = jwt.verify(Token, "SURAT");

    req.body.profileimg = req.file.filename;

    if (!req.body.profileimg) {
      throw new Error("first send img..!");
    }

    req.body.profileimg = req.file.filename;

    const data = await USER.findByIdAndUpdate(User.id, {
      profileimg: req.body.profileimg,
    });

    res.status(200).json({
      status: "success",
      message: "user profile updated successfully",
      data,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.userfind = async function (req, res, next) {
  try {
    const data = await USER.find();

    const Userdata = await Promise.all(
      data.map(async (data) => {
        return {
          user: {
            userid: data._id,
            fullname: data.fullname,
            uname: data.uname,
            proimg: data.profileimg,
          },
        };
      })
    );

    res.status(200).json({
      status: "success",
      message: "user login successfully..!",
      Userdata,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.userfindbyid = async function (req, res, next) {
  try {
    if (!req.query.id) {
      throw new Error("send user id first..!");
    }
    const data = await USER.findById(req.query.id);

    if (!data) {
      throw new Error("user is not exist..!");
    }
    const Userdata = {
      user: {
        _id: data._id,
        fullname: data.fullname,
        contact: data.contact,
        uname: data.uname,
        email: data.email,
        profileimg: data.profileimg,
        followers: data.followers,
        following: data.following,
        post: data.post,
        liked: data.liked,
        saved: data.saved,
      },
    };

    res.status(200).json({
      status: "success",
      message: "user find successfully..!",
      Userdata,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.userfindbyuname = async function (req, res, next) {
  try {
    if (!req.query.uname) {
      throw new Error("send user name first..!");
    }
    const data = await USER.find({ uname: req.query.uname });

    if (!data) {
      throw new Error("user is not exist..!");
    }

    const Post = await Promise.all(
      data[0].post.map(async (el) => {
        const Postdata = await POST.findById(el);
        return Postdata;
      })
    );

    const Saved = await Promise.all(
      data[0].saved.map(async (el) => {
        const Saveddata = await POST.findById(el);
        return Saveddata;
      })
    );

    const Userdata = {
      user: {
        _id: data[0]._id,
        fullname: data[0].fullname,
        contact: data[0].contact,
        uname: data[0].uname,
        email: data[0].email,
        profileimg: data[0].profileimg,
        followers: data[0].followers,
        following: data[0].following,
        post: Post,
        savedpost: Saved,
        bio: data[0].bio,
      },
    };
    console.log(Post);

    res.status(200).json({
      status: "success",
      message: "user find successfully..!",
      Userdata,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.userfollow = async function (req, res, next) {
  try {
    const Token = req.headers.token;
    const checktoken = jwt.verify(Token, "SURAT");

    const ownId = checktoken.id;
    const otherId = req.body.followId;

    if (!otherId) {
      throw new Error("followid not sent..!");
    }

    const usercheck = await USER.findById(otherId);

    if (!usercheck) {
      throw new Error("follow user not found ..!");
    }

    const isAlreadyFollowing = usercheck.following.includes(otherId);

    if (isAlreadyFollowing) {
      throw new Error("You are already following this user..!");
    }

    // Update the following list of the current user
    await USER.findByIdAndUpdate(ownId, { $push: { following: otherId } });

    // Update the followers list of the user being followed
    await USER.findByIdAndUpdate(otherId, { $push: { followers: ownId } });

    res.status(200).json({
      status: "success",
      message: "follow successfully..!",
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.userunfollow = async function (req, res, next) {
  try {
    const Token = req.headers.token;
    const checktoken = jwt.verify(Token, "SURAT");

    const ownId = checktoken.id;
    const otherId = req.body.unfollowId;

    if (!otherId) {
      throw new Error("unfollowId not sent..!");
    }

    const usercheck = await USER.findById(otherId);

    if (!usercheck) {
      throw new Error("unfollow user not found ..!");
    }

    const ownuser = await USER.findById(ownId);

    const isAlreadyunFollowing = ownuser.following.includes(otherId);

    if (!isAlreadyunFollowing) {
      throw new Error("You are not following this user..!");
    }

    // Update the following list of the current user
    await USER.findByIdAndUpdate(ownId, { $pull: { following: otherId } });

    // Update the followers list of the user being followed
    await USER.findByIdAndUpdate(otherId, { $pull: { followers: ownId } });

    res.status(200).json({
      status: "success",
      message: "unfollow successfully..!",
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.userfollowingfind = async function (req, res, next) {
  try {
    const Token = req.headers.token;
    const checktoken = jwt.verify(Token, "SURAT");

    const UserId = checktoken.id;

    const UserData = await USER.findById(UserId);

    const Followingdata = await Promise.all(
      UserData.following.map(async (el) => {
        const Fuserdata = await USER.findById(el);
        const fid = Fuserdata._id;
        const Postdata = await POST.find({ uid: fid });

        const posts = await Promise.all(
          Postdata.map(async (post) => {
            return {
              _id: post._id,
              uid: {
                _id: Fuserdata._id,
                fullname: Fuserdata.fullname,
                uname: Fuserdata.uname,
                profileimg: Fuserdata.profileimg,
              },
              img: post.img,
              likes: post.likes,
              comments: post.comments,
              caption: post.caption,
              date: post.date,
            };
          })
        );

        return {
          _id: Fuserdata._id,
          fullname: Fuserdata.fullname,
          contact: Fuserdata.contact,
          uname: Fuserdata.uname,
          email: Fuserdata.email,
          profileimg: Fuserdata.profileimg,
          posts: posts,
        };
      })
    );

    res.status(200).json({
      status: "success",
      message: "followers find successfully..!",
      Followingdata,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.usersuggestion = async function (req, res, next) {
  try {
    const Token = req.headers.token;
    const checktoken = jwt.verify(Token, "SURAT");

    const UserId = checktoken.id;

    const UserData = await USER.findById(UserId);
    const FindUser = await USER.find();

    const Followers = UserData.followers.map((el) => el.toString()); // Convert ObjectIds to strings
    const Following = UserData.following.map((el) => el.toString());

    // Get all user IDs except the current user
    const allUserIds = FindUser.map((el) => el._id.toString()).filter(
      (id) => id !== UserId
    );
    // Remove users who are already followers or followed
    const suggestionIds = allUserIds.filter(
      (id) => !Followers.includes(id) && !Following.includes(id)
    );

    // Get user details for the suggested users
    const suggestions = await Promise.all(
      suggestionIds.map(async (id) => {
        const user = await USER.findById(id);
        return {
          _id: user._id,
          fullname: user.fullname,
          contact: user.contact,
          uname: user.uname,
          email: user.email,
          profileimg: user.profileimg,
        };
      })
    );

    res.status(200).json({
      status: "success",
      message: "User suggestions retrieved successfully..!",
      suggestions,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.usersearch = async function (req, res, next) {
  try {
    const Token = req.headers.token;
    const checktoken = jwt.verify(Token, "SURAT");

    const UserId = checktoken.id;

    const keyword = req.query.search
      ? {
          $or: [
            { uname: { $regex: req.query.search, $options: "i" } },
            { fullname: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const data = await USER.find(keyword).find({ _id: { $ne: UserId } });

    res.status(200).json({
      status: "success",
      message: "User found successfully..!",
      data,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

//post

exports.postcreate = async function (req, res, next) {
  try {
    const Token = req.headers.token;
    const checktoken = jwt.verify(Token, "SURAT");
    const UserId = checktoken.id;
    const Imgname = req.file.filename;
    const caption = req.body.caption;

    if (!Imgname) {
      throw new Error("Img is required...!");
    }

    const Postcreate = await new POST({
      uid: UserId,
      img: Imgname,
      caption: caption,
    });
    Postcreate.save();

    await USER.findByIdAndUpdate(UserId, { $push: { post: Postcreate._id } });

    res.status(201).json({
      status: "success",
      message: "post created successfully..!",
      Postcreate,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.postlike = async function (req, res, next) {
  try {
    const Token = req.headers.token;
    const checktoken = jwt.verify(Token, "SURAT");

    const ownId = checktoken.id;
    const Postid = req.body.postId;

    if (!Postid) {
      throw new Error("post id not sent..!");
    }

    const postcheck = await POST.findById(Postid);

    if (!postcheck) {
      throw new Error("post not found ..!");
    }

    const isAlreadyLike = postcheck.likes.includes(ownId);

    if (isAlreadyLike) {
      throw new Error("You are already Liked this Post..!");
    }

    // Update the following list of the current user
    await USER.findByIdAndUpdate(ownId, { $push: { liked: Postid } });

    // Update the followers list of the user being followed
    await POST.findByIdAndUpdate(Postid, { $push: { likes: ownId } });

    res.status(200).json({
      status: "success",
      message: "liked successfully..!",
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.postunlike = async function (req, res, next) {
  try {
    const Token = req.headers.token;
    const checktoken = jwt.verify(Token, "SURAT");

    const ownId = checktoken.id;
    const Postid = req.body.postId;

    if (!Postid) {
      throw new Error("post id not sent..!");
    }

    const postcheck = await POST.findById(Postid);

    if (!postcheck) {
      throw new Error("post not found ..!");
    }

    const isAlreadyunLike = postcheck.likes.includes(ownId);

    if (!isAlreadyunLike) {
      throw new Error("You are already unLiked this Post..!");
    }

    // Update the following list of the current user
    await USER.findByIdAndUpdate(ownId, { $pull: { liked: Postid } });

    // Update the followers list of the user being followed
    await POST.findByIdAndUpdate(Postid, { $pull: { likes: ownId } });

    res.status(200).json({
      status: "success",
      message: "unliked successfully..!",
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.postsave = async function (req, res, next) {
  try {
    const Token = req.headers.token;
    const checktoken = jwt.verify(Token, "SURAT");

    const ownId = checktoken.id;
    const Postid = req.body.postId;

    if (!Postid) {
      throw new Error("post id not sent..!");
    }

    const postcheck = await POST.findById(Postid);

    if (!postcheck) {
      throw new Error("post not found ..!");
    }

    const isAlreadySave = postcheck.saved.includes(ownId);

    if (isAlreadySave) {
      throw new Error("You are already saved this Post..!");
    }

    // Update the following list of the current user
    await USER.findByIdAndUpdate(ownId, { $push: { saved: Postid } });

    // Update the followers list of the user being followed
    await POST.findByIdAndUpdate(Postid, { $push: { saved: ownId } });

    res.status(200).json({
      status: "success",
      message: "saved successfully..!",
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.postunsave = async function (req, res, next) {
  try {
    const Token = req.headers.token;
    const checktoken = jwt.verify(Token, "SURAT");

    const ownId = checktoken.id;
    const Postid = req.body.postId;

    if (!Postid) {
      throw new Error("post id not sent..!");
    }

    const postcheck = await POST.findById(Postid);

    if (!postcheck) {
      throw new Error("post not found ..!");
    }

    const isAlreadyunSave = postcheck.saved.includes(ownId);

    if (!isAlreadyunSave) {
      throw new Error("You are already unsaved this Post..!");
    }

    // Update the following list of the current user
    await USER.findByIdAndUpdate(ownId, { $pull: { saved: Postid } });

    // Update the followers list of the user being followed
    await POST.findByIdAndUpdate(Postid, { $pull: { saved: ownId } });

    res.status(200).json({
      status: "success",
      message: "unsaved successfully..!",
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.postcomment = async function (req, res, next) {
  try {
    const Token = req.headers.token;
    const checktoken = jwt.verify(Token, "SURAT");

    const ownId = checktoken.id;
    const Postid = req.body.postId;
    const Message = req.body.message;

    if (!Postid) {
      throw new Error("post id not sent..!");
    }

    const postcheck = await POST.findById(Postid);

    if (!postcheck) {
      throw new Error("post not found ..!");
    }

    await POST.findByIdAndUpdate(Postid, {
      $push: { comments: { _id: ownId, message: Message, date: Date.now() } },
    });

    res.status(200).json({
      status: "success",
      message: "comment successfully..!",
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.postfind = async function (req, res, next) {
  try {
    const data = await POST.find();

    res.status(200).json({
      status: "success",
      message: "post find successfully..!",
      data,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.postfollowing = async function (req, res, next) {
  try {
    const Token = req.headers.token;
    const checktoken = jwt.verify(Token, "SURAT");

    const UserId = checktoken.id;

    const UserData = await USER.findById(UserId);

    const Followingids = UserData.following.map(el => el);
    Followingids.push(UserId);

    const Post = await Promise.all(
      Followingids.map(async (el) => {
        const posts = await POST.find({ uid: el });
        const filteredPosts = posts.filter(post => post !== null && post.length > 0);
        return filteredPosts;
      })
    );

    // Flatten the array of arrays
    const flattenedPost = Post.flat();

    const data = await Promise.all(
      flattenedPost.map(async (user) => {
        const udata = await USER.findById(user.uid);

        return {
          _id: user._id,
          uid: {
            _id: udata._id,
            fullname: udata.fullname,
            uname: udata.uname,
            profileimg: udata.profileimg,
          },
          img: user.img,
          likes: user.likes,
          comments: user.comments,
          caption: user.caption,
          date: user.date,
        };
      })
    );

    res.status(200).json({
      status: "success",
      message: "following post find successfully..!",
      data,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};


//chat

exports.createconverstion = async function (req, res, next) {
  try {
    const Token = req.headers.token;
    const checktoken = jwt.verify(Token, "SURAT");
    const Myid = checktoken.id;
    const otheId = req.body.userid;

    await CONVERSTION.create({
      members: [Myid, otheId],
    });

    res.status(200).json({
      status: "success",
      message: "converstion created successfully..!",
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.getconverstion = async function (req, res, next) {
  try {
    const Token = req.headers.token;
    const checktoken = jwt.verify(Token, "SURAT");

    const ownId = checktoken.id;

    const findconverstion = await CONVERSTION.find({
      members: { $in: [ownId] },
    });

    const getUserconverstion = await Promise.all(
      findconverstion.map(async (el) => {
        const members = el.members;
        return members;
      })
    );

    const members = await Promise.all(
      getUserconverstion.map((el, index) => {
        const UserId = el.filter((memberId) => memberId !== ownId);

        return UserId;
      })
    );

    const UserData = await Promise.all(
      members.map(async (el, index) => {
        const User = await USER.findById(el);

        return {
          uname: User.uname,
          profileimg: User.profileimg,
          converstionId: findconverstion[index]._id,
        };
      })
    );

    res.status(200).json({
      status: "success",
      message: "converstion found successfully..!",
      UserData,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.messageadd = async function (req, res, next) {
  try {
    const Token = req.headers.token;
    const checktoken = jwt.verify(Token, "SURAT");

    const myId = checktoken.id;

    if (!req.body.message) {
      throw new Error("send a message first..!");
    }

    const newMessage = await MESSAGE.create({
      converstionId: req.body.converstionId,
      senderid: myId,
      message: req.body.message,
    });

    res.status(200).json({
      status: "success",
      message: "chat access successfully..!",
      newMessage,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};
exports.messageget = async function (req, res, next) {
  try {
    const message = await MESSAGE.find({
      converstionId: req.query.conid,
    });

    res.status(200).json({
      status: "success",
      message: "chat access successfully..!",
      message,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

//socket

exports.socket = async function (req, res, next) {
  try {
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

//socket

