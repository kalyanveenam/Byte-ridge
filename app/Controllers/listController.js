const Mongoose = require("mongoose");
let response = require("../Libs/responseLib");
const listModel = Mongoose.model("list");
const userModel = Mongoose.model("users");
const friendModel=Mongoose.model('friends')
const multer = require("multer");
const path = require("path");
const check= require('../Libs/checkLib')
let createList = (req, res) => {

  new listModel(req.body).save((error, data) => {
    if (data) {
      let apiResponse = response.generate(false, null, 201, data);
      res.status(201).send(apiResponse);
    } else {
      let apiResponse = response.generate(true, error, 404, null);
      res.status(404).send(apiResponse);
    }
  });

};
let getAlllists = async (req, res) => {
  let user = await userModel.findById(req.user._id);


  await user.populate("userLists").execPopulate();
  let apiResponse = response.generate(false, null, 200, user.userLists);
  res.status(200).send(apiResponse);
};
let sendRequest = async(req, res) => {
  let friendlist = await friendModel.find({ $and:[{fromUser: req.user._id}, {toUser: req.body._id}]},(error,result)=>{
    
    if(check.isEmpty(result)){
      new friendModel({
        fromUser: req.user._id,
        toUser:req.body.to,
        status: req.body.status,
        recieverName:req.body.recieverName,
        senderName:req.user.name
      }).save((error, data) => {
        if (data) {
          let apiResponse = response.generate(false, null, 201, data);
          res.status(201).send(apiResponse);
        } else {
          let apiResponse = response.generate(true, error, 404, null);
          res.status(404).send(apiResponse);
        }
      });
    
    
    }
    
    
   else{
   //  let apiResponse = response.generate(true, null, 201, "Request already sent");
      res.status(404).send("Friend request already sent");

    }

  } ) 
 
};
let getListsById = async (req, res) => {
  let user = await userModel.findById(req.query.id);


  await user.populate("userLists").execPopulate();
  let apiResponse = response.generate(false, null, 200, user.userLists);
  res.status(200).send(apiResponse);
};
let updateList = async (req, res) => {
  let user = await userModel.findById(req.query.id);
  await user.populate("userLists").execPopulate();
  let lists = user.userLists;
  for(let i in req.body){
    let listId=req.body[i].list_id;
    let list=lists[listId];
    let listObjectId = list['_id'];
let listMongoose = await listModel.findById(listObjectId);
if(req.body[i].type=='list'){
  if(req.body[i].field && req.body[i].field =='completed')
  listMongoose['isCompleted']=req.body[i].value;
  else if(req.body[i].field && req.body[i].field =='delete')
  listMongoose.delete();
  else
  listMongoose['title']=req.body[i].value;
}
else if(req.body[i].type=='task'){
  if(req.body[i].field && req.body[i].field =='completed')
  listMongoose['tasks'][req.body[i]['task_id']]['isCompleted']=req.body[i].value;
  else if(req.body[i].field && req.body[i].field =='delete')
  listMongoose['tasks'].splice([req.body[i]['task_id']],1);
  else
  listMongoose['tasks'][req.body[i]['task_id']]['title']=req.body[i].value;
}
else if(req.body[i].type=='subtask'){
  if(req.body[i].field && req.body[i].field =='completed')
  listMongoose['tasks'][req.body[i]['task_id']]['subtask'][req.body[i]['subtask_id']]['isCompleted']=req.body[i].value;
  else 
  listMongoose['tasks'][req.body[i]['task_id']]['subtask'][req.body[i]['subtask_id']]['description']=req.body[i].value;
}
listMongoose.save();
  }
  let apiResponse = response.generate(false, null, 200, "List is updated sucessfully"); 
  res.status(200).send(apiResponse);
}
let getFriendRequests = async (req, res) => {
  let friendlist = await friendModel.find( {toUser: req.user._id,status: req.query.status} )
   let apiResponse = response.generate(false, null, 200, friendlist);
  res.status(200).send(apiResponse);
};
let updateFriendRequest= async (req,res)=>{
  let friendlist = await friendModel.findOne({toUser: req.user._id, fromUser: req.body.userId} )
friendlist.status=req.query.status;

friendlist.save();
 res.send(friendlist);

}
let getAcceptedFriendRequests = async (req, res) => {
  let friendlist = await friendModel.find({status:'accept'} );
   let apiResponse = response.generate(false, null, 200, friendlist);
  res.status(200).send(apiResponse);
};
let getAllUsers = async (req, res) => {
  let user = await userModel.find();
   let apiResponse = response.generate(false, null, 200, user);
  res.status(200).send(apiResponse);
};

module.exports = {
  createList: createList,
  getAlllists: getAlllists,
  sendRequest:sendRequest,
  getFriendRequests:getFriendRequests,
  updateList:updateList,
  updateFriendRequest:updateFriendRequest,
  getListsById:getListsById,
  getAcceptedFriendRequests:getAcceptedFriendRequests,
  getAllUsers:getAllUsers
};