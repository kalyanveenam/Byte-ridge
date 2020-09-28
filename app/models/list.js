const mongoose = require("mongoose");
const mySchema = mongoose.Schema;
let subtask = new mySchema({
  description: String,
  isCompleted:{type: Boolean, default: false}
})

let taskdata = new mySchema({
  title: String,
  description: String,
  isCompleted:{type: Boolean, default: false},
  subtask: [subtask]
  
});

let listSchema = new mySchema({
  title: {
    type: String,
    require: true,
  
  },

  tasks: [taskdata],

  owner: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "users",
  },
  isCompleted:{type: Boolean, default: false}
});
module.exports = mongoose.model("list", listSchema);