const express = require("express");
const authRoute = express.Router();
const UserModel = require("../models/userModel");
const registerValidation = require("../validation/registerValidation");
const bcrypt = require("bcrypt");
const axios = require("axios");
const loginValidation = require("../validation/loginValidation");
const validator = require('validator');

authRoute.post("/register", registerValidation, async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const newUser = await UserModel.create(req.body);
    res.send("User registered!");
  } catch (err) { 
    res.status(413).send("Error");
  }
});
authRoute.post("/register-google", async (req, res) => {
  try {
    const googleData = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${req.body.token}` },
      }
    );
    googleData.data.sub = bcrypt.hashSync(googleData.data.sub, 10);
    if (
      !googleData.data.given_name ||
      !googleData.data.family_name ||
      !googleData.data.sub ||
      !googleData.data.email ||
      !validator.isEmail(googleData.data.email)
    ) {
      return res.status(413).send("Error");
    } else {
      const emailExist = await UserModel.findOne({
        email: googleData.data.email,
      });
      if (emailExist) {
        res.status(412).send("Email exist");
      } else {
        const dataUser = {
          firstName: googleData.data.given_name,
          lastName: googleData.data.family_name,
          email: googleData.data.email,
          googleId: googleData.data.sub,
        };
        const newUser = await UserModel.create(dataUser);
        res.send("User registered!");
      }
    }
  } catch (err) {
    console.log(err)
    res.status(413).send("Error");
  }
});

authRoute.post("/login", loginValidation, (req, res) => {
  console.log(req.body)
  res.send("ok")
})

authRoute.post("/login-google", async (req, res) => {
  try {
    const googleData = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${req.body.token}` },
      }
    );
    if (
      !googleData.data.sub ||
      !googleData.data.email ||
      !validator.isEmail(googleData.data.email)
    ) {
      return res.status(413).send("Error");
    } 
    const userExist = await UserModel.findOne({
      email: googleData.data.email,
    });
    if(!userExist.email ||
       !userExist.googleId ||
       !bcrypt.compareSync(googleData.data.sub, userExist.googleId)
      ){
      return  res.status(413).send("Error");
  }
  if(!userExist.isActive){
    return res.status(422).send("Admin mast your account!");
}
    console.log("workkkkkkkkkkkkkkkk")
    res.send("User login!");
  } catch (err) { 
    console.log(err)
    res.status(414).send("Error");
  }
});

module.exports = authRoute;
