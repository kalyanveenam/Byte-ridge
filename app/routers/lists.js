const apiConfig = require("../config/appConfig");
let auth = require("../Middlewares/authVerify");
let listController = require("../Controllers/listController")
let multer = require("multer");
let upload = multer();

const listRoutes = (app) => {



  app.post(
    apiConfig.config.apiVersion + "/create/list",
    auth.authValidation,
    listController.createList
  );
  app.get(
    apiConfig.config.apiVersion + "/get/list", auth.authValidation,
    listController.getAlllists
  )
  app.get(
    apiConfig.config.apiVersion + "/get/listbyid", auth.authValidation,
    listController.getListsById
  )
  app.post(
    apiConfig.config.apiVersion+"/send/request",
    auth.authValidation,
    listController.sendRequest
  )
  app.get(
    apiConfig.config.apiVersion+"/list/friends",
    auth.authValidation,
    listController.getFriendRequests
    
  )
app.put(
  apiConfig.config.apiVersion+"/update/list",
  auth.authValidation,
  listController.updateList

)
app.put(
  apiConfig.config.apiVersion+"/update/status",
  auth.authValidation,
  listController.updateFriendRequest
)
app.get(
  apiConfig.config.apiVersion+"/friends/accepted",
  auth.authValidation,
  listController.getAcceptedFriendRequests
  
)
app.get(
  apiConfig.config.apiVersion+"/get/users",
  auth.authValidation,
  listController.getAllUsers
  
)


};
module.exports = {
  listRoutes: listRoutes
};