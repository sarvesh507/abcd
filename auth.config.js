module.exports = {
  secret: process.env.JWT_SECRET_KEY,
  jwtExpiration: 3600, // 1 hour
  jwtRefreshExpiration: 86400, // 24 hours
};
