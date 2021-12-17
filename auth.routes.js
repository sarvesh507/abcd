const controller = require("./auth.controller");

module.exports = function(app) {
  
  app.post("/api/refreshtoken", controller.refreshToken);
  app.post("/api/signin", controller.signin)
};