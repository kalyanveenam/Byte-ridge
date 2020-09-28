let express = require("express");
let path = require("path");
let mongoose = require("mongoose");
let cors = require("cors");
let multer = require("multer");
let fs = require("fs");
let logger = require("pino")();
let routeNotFound = require("./app/Middlewares/routeValidation");
let {
  config
} = require('./app/config/appConfig')
const {
  Router
} = require("express");
const bodyParser = require("body-parser");
let http = require('http');
const app = express();
logger.info("hello world");
let corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/files", express.static(__dirname + "/app/attachments"));
let modelPath = path.join(__dirname, "./app/models");
fs.readdirSync(modelPath).forEach(function (file) {
  if (~file.indexOf(".js")) {
    require(modelPath + "/" + file);
  }
});
let routerPath = path.join(__dirname, "./app/routers");
let files = "";
fs.readdirSync(routerPath).forEach(function (file) {
  files += file + ",";
});
files.slice(0, -1);
if (~files.split(",")[0].indexOf(".js") && files.split(",")[1].indexOf(".js")) {
  let userRoute = require(path.join(routerPath, files.split(",")[1]));
  let listRoute = require(routerPath + "/" + files.split(",")[0]);
  userRoute.userRoutes(app);
  listRoute.listRoutes(app);
}

files = files.substring(0, files.length - 1);
app.use(routeNotFound.routeNotFound);
const server = http.createServer(app);
let setSocket = require('./app/Libs/socketLib');
setSocket.setService(server);
server.listen(config.PORT, () => {
  if (config.env == "prod") {
    mongoose.connect(config.mongodb.produrl, {
      useNewUrlParser: true
    });
    mongoose.connection
      .once("open", function () {

      })
      .on("error", function (error) {

      });
  } else {
    console.log('coming here')
    mongoose.connect(config.mongodb.localurl, {
      useNewUrlParser: true,
        
    });
    mongoose.connection
      .once("open", function () {

      })
      .on("error", function (error) {

      });
  }


});