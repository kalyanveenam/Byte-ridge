let { config } = require("../config/appConfig");
let userCon = require("../Controllers/userController");
let isAuth = require("../Middlewares/authVerify");
const userRoutes = (app) => {
  app.post(config.apiVersion + "/user/login",userCon.loginUser);
  app.post(config.apiVersion + "/user/signup", userCon.createUser);
  app.get(config.apiVersion + "/users/all", isAuth.authValidation,userCon.getAllUsers);
  app.post(config.apiVersion + "/user/logout", userCon.logout);
  app.post(config.apiVersion + "/users/audits", isAuth.authValidation,userCon.createAuditLog);
  app.post(config.apiVersion + "/update/signin", isAuth.authValidation,userCon.updatesignin);
  app.post(config.apiVersion + "/update/signout", isAuth.authValidation,userCon.updatesignout);
};

module.exports = {
  userRoutes: userRoutes,
};
