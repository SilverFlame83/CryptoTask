const crypto = require("../services/crypto");

module.exports = () => (req, res, next) => {
  req.storage = {
    ...crypto,
  };

  next();
};
