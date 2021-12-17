const db = require("../../models");
const config = require("../../config/auth.config");
const { user: User, refreshToken: RefreshToken } = db;
require("dotenv").config();

const jwt = require("jsonwebtoken");
const cryptoJS = require("crypto-js");

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      const userdata = user.dataValues;
      const hashpwd = cryptoJS.AES.decrypt(
        userdata.password,
        process.env.PASS_SECRET_KEY
      );

      const originalpassword = hashpwd.toString(cryptoJS.enc.Utf8);
      if (originalpassword !== req.body.password)
        return res.status(500).json("Invalid email and password");

      const token = jwt.sign(
        { userid: userdata.id },
        process.env.JWT_REFRESH_SECRET_KEY,
        {
          expiresIn: config.jwtExpiration,
        }
      );
      // console.log(userdata);
      let refreshToken = await RefreshToken.createToken(userdata);

      res.status(200).send({
        id: userdata.id,
        username: userdata.username,
        email: userdata.email,
        accessToken: token,
        refreshToken: refreshToken,
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({
      where: { token: requestToken },
    });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET_KEY,
      {
        expiresIn: config.jwtExpiration,
      }
    );

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

// const auth = (req, res, next) => {
//   const authHeader = req.headers.refreshtoken;
//   if (authHeader) {
//     jwt.verify(authHeader, process.env.JWT_REFRESH_SECRET_KEY, (err, data) => {
//       if (err) return res.status(401).json("Token is not valid ");
//       req.user = data;
//       next();
//     });
//   } else {
//     res.status(400).json("don't have a permission to access");
//   }
// };
