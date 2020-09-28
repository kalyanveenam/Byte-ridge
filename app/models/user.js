const Mongoose = require("mongoose");
const mySchema = Mongoose.Schema;
let userSchema = new mySchema({
  name: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: Number,
    required: true,
  },
});
userSchema.virtual("userLists", {
  ref: "list",
  localField: "_id",
  foreignField: "owner",
});
userSchema.virtual("friendRequests",{
ref:'friends',
localField:'_id',
foreignField:'toUser'
})

module.exports = Mongoose.model("users", userSchema);