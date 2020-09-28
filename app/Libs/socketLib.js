let verifyClaim = require("./tokenLib");
let socketio = require("socket.io");
let tokenLibs = require('./tokenLib');

let setService = (server) => {
    let onlineUsers = [];
    let io = socketio.listen(server);

    let myio = io.of('')
    myio.on('connection', (socket) => {

        socket.emit("verifyUser", "");
        socket.on('set-user', (authToken) => {
            tokenLibs.verifyTokenWithoutSecret(authToken, (user, err, ) => {
                if (user) {

                    let currentUser = user;
                    socket.userId = currentUser._id;
                    socket.name = currentUser.name;
                    let fullName = `${currentUser.name}`

                    socket.emit(currentUser._id, `${fullName} is online`)
                    myio.emit('userOnline', `${fullName} is now online`)
                    let userObj = {
                        userId: currentUser._id,
                        name: fullName
                    }
                    onlineUsers.push(userObj);
                    myio.emit('userlist', onlineUsers)
                
                    // socket.on('friend-req',(data)=>{
                    //  
                    // })

                } else {
                    socket.emit('auth-error', {
                        status: 500,
                        error: 'Please provide valid token '
                    })
                }
              
            })
        })
          socket.on('create-list', (data) => {
                    
                       myio.emit('list-created', data)

                   })
        socket.on('disconnect', () => {

            let removeUserId = onlineUsers.map(function (user) {
                return user.userId
            }).indexOf(socket.userId)
            onlineUsers.splice(removeUserId, 1)

            myio.emit('userOffline', `${socket.name} has gone offline`)
            myio.emit('userlist', onlineUsers)

        })
    })
}
module.exports = {
    setService: setService
}