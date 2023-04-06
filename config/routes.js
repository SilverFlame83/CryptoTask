const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const cryptoController = require("../controllers/cryptoController");
const errorController = require("../controllers/errorController");

module.exports = (app) => {
  app.use("/", homeController);
  app.use("/auth", authController);
  app.use("/crypto", cryptoController);
  app.use("*", errorController);
};
