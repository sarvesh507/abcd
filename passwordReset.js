const db = require("../../models/index");
const { user: User } = db;
const Token = db.token;
const sendEmail = require("../../helpers/sendEmail");
const crypto = require("crypto");
const cryptoJS = require("crypto-js");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user)
      return res.status(400).send("user with given email doesn't exist");
    userdata = user.dataValues;
    console.log(userdata.id);
    let token = {
      userid: userdata.id,
      token: crypto.randomBytes(32).toString("hex"),
    };
    // console.log(token);
    await Token.create(token).then((data) => {
      console.log("123456789 : ", data);
      const link = `${process.env.BASE_URL}/password-reset/${token.userid}/${token.token}`;
      console.log(link);
      sendEmail(userdata.email, "Password reset", link);

      res.send("password reset link sent to your email account");
      //res.send(data);
      console.log(userdata.email);
    });
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
});

router.post("/:id/:token", async (req, res) => {
  try {
    const schema = Joi.object({ password: Joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ where: { id: req.params.id } });
    if (!user) return res.status(400).send("invalid link or expired");
    console.log(user);
    const token = await Token.findOne({ where: { token: req.params.token } });

    if (!token) return res.status(400).send("Invalid link or expired");

    let password = cryptoJS.AES.encrypt(
      req.body.password,
      process.env.JWT_SECRET_KEY
    ).toString();

    User.update(
      { password: password },
      {
        where: { id: req.params.id },
      }
    ).then((num) => {
      console.log("password reset sucessfully.");
    });
    Token.destroy({
      where: {},
      truncate: false,
    });
    res.send("password reset sucessfully.");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
});

module.exports = router;
