const {
  addOnlineUser,
  getOnlineUser,
  deleteOnlineUser,
  addUserToChannel,
  deleteUserFromChannel,
  deleteChannel,
} = require("./liveStreamRedis.js");

const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const socket = (httpServer) => {
  let io = new Server(httpServer);
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      jwt.verify(
        socket.handshake.auth.token,
        process.env.SECRET_KEY,
        (err, decoded) => {
          if (err) {
            socket.isAuth = false;
            next("Not authenticated token");
          } else {
            socket.isAuth = true;
            socket.decoded = decoded;
            next();
          }
        }
      );
    } else {
      socket.isAuth = false;
      next("Not authenticated token");
    }
  }).on("connection", async (socket) => {
    try {
      const { isAuth } = socket;
      if (isAuth) {
        const { userId } = socket.decoded;
        console.log("userId: ", userId);
        await addOnlineUser(userId);
        socket.join(userId);
        socket.broadcast.emit("connectStatus", "conncted");
      }
    } catch (error) {
      console.error(error);
    }

    socket.on("sendTokenToUserRequest", async (data) => {
      try {
        const { isAuth } = socket;
        if (isAuth) {
          const { userId } = socket.decoded;
          const { channel, rtcToken, tokenRole, receiverId } = data;
          io.to(receiverId).emit("sendTokenToUserResponse", {
            senderId: userId,
            channel,
            rtcToken,
            tokenRole,
            receiverId,
          });
        }
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("joinUserToChannelRequest", async (data) => {
      try {
        const { isAuth } = socket;
        if (isAuth) {
          const { userId } = socket.decoded;
          const { channel, rtcToken, tokenRole } = data;
          await addUserToChannel(channel, {
            userId,
            channel,
            rtcToken,
            tokenRole,
          });
          socket.join(channel);
          io.to(channel).emit("joinUserToChannelResponse");
        }
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("userLeftChannel", async ({ channel }) => {
      try {
        const { isAuth } = socket;
        if (isAuth) {
          const { userId } = socket.decoded;
          await deleteUserFromChannel(channel, userId);
          socket.leave(channel);
        }
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("deleteChannel", async ({ channel }) => {
      try {
        const { isAuth } = socket;
        if (isAuth) {
          const { userId } = socket.decoded;
          await deleteChannel(channel);
          socket.leave(channel);
        }
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("disconnect", async () => {
      try {
        const { isAuth } = socket;
        if (isAuth) {
          const { userId } = socket.decoded;
          await deleteOnlineUser(userId);
          socket.broadcast.to(userId).emit("disconnectUser", "disconnected");
        }
      } catch (error) {
        console.error(error);
      }
    });
  });
};
module.exports = {
  socket,
};
