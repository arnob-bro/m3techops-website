const jwt = require("jsonwebtoken");

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const generateAccessToken = (id) => {
  console.log("accessToken is generated with id " + id);
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });
};

module.exports = { generateRefreshToken, generateAccessToken };
