const express = require("express");
const bodyParser = require("body-parser");
const webrtc = require("wrtc");
const cors = require("cors");

const PORT = 5000;
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

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

let senderStream;

app.post("/consumer", async ({ body }, res) => {
  const peer = webrtc.RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.stunprotocol.org" }],
  });
  const desc = new webrtc.RTCSessionDescription(body.sdp);
  await peer.setRemoteDescription(desc);
  senderStream
    .getTracks()
    .forEach((track) => peer.addTrack(track, senderStream));
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  const payload = {
    sdp: peer.localDescription,
  };
  res.json(payload);
});

app.post("/broadcast", async ({ body }, res) => {
  try {
    const peer = webrtc.RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.stunprotocol.org" }],
    });
    peer.ontrack = (e) => {
      console.log("e: ", e);
      return handleTrackEvent(e, peer);
    };
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
      sdp: peer.localDescription,
    };
    res.json(payload);
  } catch (error) {
    throw error;
  }
});

const handleTrackEvent = (e, peer) => (senderStream = e.streams[0]);

app.listen(PORT, async () => {
  console.log(`server is running on port ${PORT}`);
});
