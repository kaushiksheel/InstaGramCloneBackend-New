const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Validate = require("../validtation/loginValidation");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const newUser = new User({
    email,
    password,
  });
  const error = Validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await User.findOne({ email });

    if (user) {
      const validPassword = await bcrypt.compare(
        newUser.password,
        user.password
      );

      if (validPassword) {
        const token = jwt.sign(
          {
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            pic: user.pic,
            followers: user.followers,
            following: user.following,
          },
          process.env.PRIVATE_KEY
        );
        res.status(200).json(token);
      } else {
        res.status(400).json("Invalid credentials");
      }
    } else if (!user) {
      res.status(400).json("Invalid credentials");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
