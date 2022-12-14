const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

const JWT_TOKEN = "sdnwnvsln*ykwdsnofnw";

userRouter.post(
  "/user/create",
  body("username").isLength({ min: 4 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const { username, email, password, profile, phonenumber } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(`Should fill corrrect format field`);
    }

    const user = await User.findOne({ email });

    if (user) {
      res.status(200).json("User already exist");
    }

    const salt = await bcrypt.genSalt(10);
    const userPassword = await bcrypt.hash(password, salt);

    try {
      const newUser = await User.create({
        username: username,
        email: email,
        password: userPassword,
        profile: profile,
        phonenumber: phonenumber,
      });

      const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
        },
        JWT_TOKEN
      );

      const userData = await newUser.save();
      res.status(200).json({
        user: userData,
        token: token,
        message: "User added successfully",
      });
    } catch (error) {
      res.status(400).send({ error: error });
    }
  }
);

userRouter.post(
  "/user/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(`Should fill corrrect format field`);
    }

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(200).json("User not found");
      }

      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        res.status(404).json("Password not match");
      }

      const accessToken = jwt.sign(
        {
          id: user._id,
          username: user.username,
        },
        JWT_TOKEN
      );
      
      res.status(200).json({ user: user, token: accessToken });

    } catch (error) {
      res.status(404).json({ error: error });
    }
  }
);
module.exports = userRouter;
