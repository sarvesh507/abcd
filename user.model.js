module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    firstName: { type: Sequelize.STRING },
    lastName: { type: Sequelize.STRING },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
  });
  return User;
};
