let mongoose = require('mongoose')
let friendsSchema = mongoose.Schema;
let friends = new friendsSchema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"

    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"

    },
    status: {
        type: String,
        default: 'pending'
    },
    recieverName:{
        type: String
    },
    senderName:{
        type: String
    }

})

module.exports = mongoose.model('friends',friends)