const jwt = require('jsonwebtoken');
const config = require('../config/config');


async function generateAccessToken(user) {
  const payload = {
    id: user._id,
    role: user.role
  };

  const accessToken = await jwt.sign(
    payload,
    config.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = await jwt.sign(
    payload,
    config.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}

module.exports = generateAccessToken