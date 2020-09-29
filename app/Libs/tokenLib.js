let jwt = require("jsonwebtoken");
let secret = process.env.JWT_SECRET || "smkccss";
let generateToken = (data, callback) => {
  try {
    
    var tokenDetails = {
      token: jwt.sign(data.toJSON(), secret),
      secret: secret,
    };
    callback(null, tokenDetails);
  } catch (err) {
    callback(err, null);
  }
};
module.exports = {
  generateToken: generateToken,
};
