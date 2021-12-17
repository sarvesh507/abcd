module.exports = (app) => {
  const UserController = require("./user.controller");

  const router = require("express").Router();

  router.post("/signup", UserController.create);

  // router.post("/login", UserController.login);

  app.use("/api", router);
};
