const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { Server } = require("socket.io");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
const port = 8080;

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS",
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
  );
  next();
});

app.get("/", (req, res) => res.send("hello webrtc"));

const server = app.listen(port, () => {
  console.log("webRTC app is listening on port 8080");
});

let io = new Server(server);
const webRTCNamespace = io.of("/webRTCPeers");

webRTCNamespace.on("connection", (socket) => {
  console.log(socket.id);

  socket.emit("connection-success", {
    status: "connection-status",
    socketId: socket.id,
  });
  socket.on("disconnect", () => {
    console.log(`${socket?.id} has disconnected`);
  });

  socket.on("sdp", (data) => {
    console.log(data);
    socket.broadcast.emit("sdp", data);
  });

  socket.on("candidate", (data) => {
    console.log(data);
    socket.broadcast.emit("candidate", data);
  });
});
