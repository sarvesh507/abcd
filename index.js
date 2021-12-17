const bodyParser = require("body-parser");
const express = require("express");
const { errorResponse } = require("./helpers/errorResponse");
require("dotenv").config();
require("./config/db.connection");
const passwordReset = require("./api/auth/passwordReset")


const app = express();

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const db = require("./models/index");
db.sequelize.sync();

require("./api/user/user.routes")(app);
require("./api/auth/auth.routes")(app);
app.use("/api/password-reset", passwordReset);


app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

const port = process.env.PORT;
app.listen(port || 3000, (error, next) => {
  if (error) next(errorResponse(res, "Server Not Responding", 500, false));
  console.log(`server running on ${port}`);
});
