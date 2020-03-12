const lodash = require("lodash");
let OnlineUsers = [];
const userConnected = io => {
  io.on("connection", socket => {
    console.log("user Connected");
    socket.on("refresh", data => {
      io.emit("refreshPage", {});
    });
    socket.on("join_chat", data => {
      console.log(data);
      socket.join(data.room1);
      socket.join(data.room2);
    });

    socket.on("starts_typing", data => {
      console.log(data);
      io.to(data.sender).emit("is_typing", data);
    });

    socket.on("stop_typing", data => {
      io.to(data.sender).emit("stoped_typing", data);
    });

    socket.on("online", data => {
      socket.join(data.room);
      OnlineUsers.push({
        userid: data.userId,
        id: socket.id,
        room: data.room,
        user: data.user
      });

      //   OnlineUsers.filter((item, pos) => {
      //       console.log(item)
      //   })
      // let unArr = []
      // OnlineUsers.filter(item => {
      //     if(unArr.indexOf(item.user) == -1 ){
      //         console.log('no dup')
      //         unArr.push(item)
      //     }
      // })

      io.emit("users_online", OnlineUsers);
    });

    socket.on("disconnect", () => {
      let l = OnlineUsers.find(i => {
        if (i.id == socket.id) {
          console.log(i.user);

           OnlineUsers = OnlineUsers.filter(a => {
            return a.user != i.user
          })
          io.emit("users_online", OnlineUsers);
        }
      });
    });
  });
};

module.exports = {
  userConnected: userConnected
};
