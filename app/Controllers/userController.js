let response = require("../Libs/responseLib");
const Mongoose = require("mongoose");
let checkLib = require("../Libs/checkLib");
let passwordLib = require("../Libs/PasswordLib");
let userModel = Mongoose.model("users");
let authModel = Mongoose.model("auth");
let auditModel= Mongoose.model("audit");
let token = require("../Libs/tokenLib");
let emailHelper = require("../Libs/EmailHelper");
let loginUser = (req, res) => {
  let verifyData = (req, res) => {
    return new Promise((resolve, reject) => {
      if (req.body.email) {
        userModel.findOne({ email: req.body.email }).exec((err, result) => {
          if (result) {
            resolve(result);
          } else if (checkLib.isEmpty(result)) {
            let apiResponse = response.generate(
              false,
              null,
              404,
              "User not found! please sign up! "
            );

            reject(apiResponse);
          }
        });
      } else {
        let apiResponse = response.generate(
          false,
          null,
          404,
          "Mandatory fields missing, Please provide your userId and password"
        );

        reject(apiResponse);
      }
    });
  };
  let validatePassword = (userDetails) => {
    return new Promise((resolve, reject) => {
      if (req.body.password) {
        passwordLib.verifyPassword(
          req.body.password,
          userDetails.password,
          (res, err) => {
            if (res) {
              resolve(userDetails);
            } else {
              let apiResponse = response.generate(
                true,
                null,
                404,
                "Invalid password! please try again"
              );
              reject(apiResponse);
            }
          }
        );
      } else {
        let apiResponse = response.generate(
          false,
          null,
          404,
          "Email or password is missing"
        );
        reject(apiResponse);
      }
    });
  };
  let tokengenerate = (data) => {
    return new Promise((resolve, reject) => {
      token.generateToken(data, (err, res) => {
        

        let userObj = data.toObject();
       
        delete userObj.password;
        delete userObj.phoneNo;
        delete userObj.__v;
        if (res) {
          let tokenResponse = { token: res, userDetails: userObj };

          resolve(tokenResponse);
        } else {
          reject(err);
        }
      });
    });
  };
  let saveToken = (tokendetails) => {
    return new Promise((resolve, reject) => {
      
      authModel.findOne(
        { userId: tokendetails.userDetails._id },
        (err, result) => {
          if (err) {
            let apiResponse = response.generate(false, null, 404, err);
            reject(apiResponse);
          } else if (checkLib.isEmpty(result)) {
            const createAuth = new authModel({
              userId: tokendetails.userDetails._id,
              authToken: tokendetails.token.token,
              tokenSecret: tokendetails.token.secret,
              generatedDate: Date.now(),
            }).save((err, result) => {
              if (err) {
                let apiResponse = response.generate(false, null, 404, err);
                reject(apiResponse);
              } else {
                
                delete tokendetails.token.secret;
                delete tokendetails.userDetails.password;

                let apiResponse = response.generate(
                  false,
                  null,
                  200,
                  tokendetails
                );
                resolve(apiResponse);
              }
            });

             } else {
            tokendetails.token.token = result.authToken;
            delete tokendetails.token.secret;
            let apiResponse = response.generate(false, null, 200, tokendetails);

            resolve(apiResponse);
          }
        }
      );
      //  resolve(tokendetails);
      // authModel.findOne({})
    });
  };
  verifyData(req, res)
    .then(validatePassword)
    .then(tokengenerate)
    .then(saveToken)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(404).send({ error: err });
    });
};
let createUser = (req, res) => {
  const createUser = new userModel({
    name: req.body.name,
    email: req.body.email,
    password: passwordLib.hashPassword(req.body.password),
    phoneNo: req.body.phoneNo,
    role:req.body.role
  }).save((err, result) => {
    if (err) {
      let apiResponse = response.generate(true, err, 404, null);
      res.send(apiResponse);
    } else {
      let apiResponse = response.generate(false, null, 200, result);
      res.send(apiResponse);
    }
  });
};
let createAuditLog = (req, res) => {
  const createUser = new auditModel({
    username: req.body.username,
    role: req.body.role
  }).save((err, result) => {
    if (err) {
      let apiResponse = response.generate(true, err, 404, null);
      res.send(apiResponse);
    } else {
      let apiResponse = response.generate(false, null, 200, result);
      res.send(apiResponse);
    }
  });
};
let updatesignin=(req,res)=>{
  auditModel.findOneAndUpdate({_id: req.body.auditId},{signintime:req.body.signintime},(error,result)=>{
    if(result){
      res.send(result)
    }
  }) 
  }
  let updatesignout=(req,res)=>{
    auditModel.findOneAndUpdate({_id: req.body.auditId},{signouttime:req.body.signouttime},(error,result)=>{
      if(result){
        res.send(result)
      }
    }) 
    }
let logout = (req, res) => {
  let deleteToken = (req, res) => {
    return new Promise((resolve, reject) => {
      if (req.headers.authorization) {
        authModel.findOneAndDelete(
          { authToken: req.headers.authorization },
          (error, result) => {
            if (result) {
              let apiResponse = response.generate(
                true,
                null,
                500,
                "Authorization token deleted successfully"
              );
              resolve(apiResponse);
            } else {
              let apiResponse = response.generate(
                true,
                null,
                500,
                "Unable to delete token"
              );
              reject(apiResponse);
            }
          }
        );
      } else {
        let apiResponse = response.generate(
          true,
          null,
          500,
          "Please provide Authorization token"
        );
        reject(apiResponse);
      }
    });
  };
  deleteToken(req, res)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
};
let getAllUsers = (req, res) => {
  userModel.find((error, result) => {
    res.send(result);
  });
};

module.exports = {
  loginUser: loginUser,
  createUser: createUser,
  logout: logout,
  getAllUsers: getAllUsers,
  createAuditLog:createAuditLog,
  updatesignin:updatesignin,
  updatesignout: updatesignout
};
