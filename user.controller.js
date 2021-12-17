const cryptoJS = require("crypto-js");
const emailValidator = require("deep-email-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const db = require("../../models/index");
const User = db.user;
// const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      message: "Email or password missing.",
    });
  }

  async function isEmailValid(email) {
    return emailValidator.validate(email);
  }
  const { valid, reason, validators } = await isEmailValid(req.body.email);
  if (valid) {
    const users = {
      firstName: req.body.firstName,
      lastName:req.body.lastName,
      email: req.body.email,
      password: cryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SECRET_KEY
      ).toString(),
    };
    await User.create(users)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User.",
        });
      });
  } else {
    return res.status(400).send({
      message: "Please provide a valid email address.",
      reason: validators[reason].reason,
    });
  }
};

// exports.login = async (req, res, next) => {
//   try {
//     const email = req.body.email;
//     // await Project.findOne({ where: { title: "My Title" } });
//     const user = await User.findOne({
//       where: {
//         email: email,
//       },
//     });
//     const data = user.dataValues;
//     if (!data)
//       return res.status(500).json({
//         message: "Invalid email and password",
//       });
//     const hashpwd = cryptoJS.AES.decrypt(
//       data.password,
//       process.env.PASS_SECRET_KEY
//     );
//     const originalpassword = hashpwd.toString(cryptoJS.enc.Utf8);
//     if (originalpassword !== req.body.password)
//       return res.status(500).json("Invalid email and password");

//     const accessToken = jwt.sign(
//       {
//         id: data.id,
//         isActive: data.isActive,
//       },
//       process.env.JWT_SECRET_KEY,
//       {
//         expiresIn: "10m",
//       }
//     );

//     const refreshToken = jwt.sign({
//       id : data.id,
//       isActive: data.isActive,
//     },process.env.JWT_REFRESH_SECRET_KEY,{
//       expiresIn:"1d"
//     });
//     //await new Token({ token: refreshToken }).save();
//     const { password, ...others } = data;

//     res.status(200).json({ ...others, accessToken, refreshToken });
//   } catch (err) {
//     // res.status(500).json(err);
//     next(err);
//   }
// };

exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Update a user by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating user with id=" + id,
      });
    });
};

// Delete a user with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "user was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete user with id=${id}. Maybe user was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete user with id=" + id,
      });
    });
};

// Delete all user from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} user were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all users.",
      });
    });
};

// Find all published user
exports.findAllPublished = (req, res) => {
  User.findAll({ where: { isActive: true } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// exports.findAll = (req, res) => {
//   const username = req.query.username;
//   var condition = username
//     ? { username: { [Op.like]: `%${username}%` } }
//     : null;

//   User.findAll({ where: condition })
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "Some error occurred while retrieving user.",
//       });
//     });
// };

// // register controller
// exports.register = async (req, res, next) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[1].message);
//   const newUser = new User({
//     first_name: req.body.first_name,
//     last_name: req.body.last_name,
//     username: req.body.username,
//     email: req.body.email,
//     password: cryptoJS.AES.encrypt(
//       req.body.password,
//       process.env.PASS_SECRET_KEY
//     ).toString(),
//   });
//   try {
//     let addUser = await newUser.save();
//     res.status(200).json(addUser);
//   } catch (err) {
//     next(err);
//   }
// };

// async function addEmp(req, res) {
//   try {
//     if (
//       req.body.username != null &&
//       req.body.email != null &&
//       req.body.password != null
//     ) {
//       const pool = await sql.connect(sqlconfig);
//       const result = await pool
//         .request()
//         .input("username", sql.VarChar, req.body.username)
//         .input("email", sql.VarChar, req.body.email)
//         .input("password", sql.VarChar, req.body.password)
//         .query(
//           "insert into emp(id, email, password) values  (@id, @username, @esal, @email, @password)"
//         );
//       res.send(result);
//     } else {
//       res.send("fill all info");
//     }
//   } catch (err) {
//     res.send(err.message);
//   }
// }

//login controller
