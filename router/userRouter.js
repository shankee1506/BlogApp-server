const userRouter = require("express").Router();
const { body, validationResult } = require("express-validator");
const User = require("../model/User");

userRouter.post(
  "/create/user",
  body("username").isLength({ min: 4 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const { username, email, password, profile,phonenumber } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(`Should fill corrrect format field`);
    }

    const user = await User.findOne({email});

    if (user) {
      res.status(200).json("User already exist");
      }
      
    try {
      const newUser =await User.create({
        username: username,
        email: email,
        password: password,
          profile: profile,
        phonenumber:phonenumber
      });
        
      const userData = await newUser.save();
      res
        .status(200)
          .send({ user: userData, message:'User added successfully' })
        
    } catch (error) {
      res.status(400).send({ error: error})
    }
  }
);

module.exports = userRouter;
