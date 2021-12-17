const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const Token = sequelize.define("token", {
    userid: {
      type: Sequelize.INTEGER,
    },
    token: {
      type: Sequelize.STRING,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: DataTypes.NOW,
    },
  });
  return Token;
};
