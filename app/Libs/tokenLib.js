let jwt = require("jsonwebtoken");
const { config } = require("../config/appConfig");
let secret = config.JWT_SECRET;
let generateToken = (data, callback) => {
  try {
    
    let tokenDetails = {
      token: jwt.sign(data.toJSON(), secret),
      secret: secret,
    };
    callback(null, tokenDetails);
  } catch (err) {
    callback(err, null);
  }
};
let verifyTokenWithoutSecret = (authToken, cb) => {
  jwt.verify(authToken, secret, (err, user) => {
    if (err) {
      cb(null, err);
    } else {
      cb(user, null);
    }
  });
};
module.exports = {
  generateToken: generateToken,
  verifyTokenWithoutSecret:verifyTokenWithoutSecret
};
