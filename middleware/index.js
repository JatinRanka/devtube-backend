const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const isUserLoggedIn = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const { userId } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(userId);

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "User doesn't have the permission",
    });
  }
};

module.exports = { isUserLoggedIn };
