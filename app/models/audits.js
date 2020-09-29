let mongoose = require("mongoose");
let appSchema = mongoose.Schema;
let auditSchema = new appSchema ({
  username: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    require: true,
  },
  signintime: {
    type: String,
    
  },
  signouttime: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("audit", auditSchema);
