const express = require("express");
const cors = require("cors");
const { createServer } = require("http");

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const app = express();
app.use((req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});

app.use(cors());

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
  //   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Autorization");
  next();
});

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const apolloServer = require("./apolloServer");
apolloServer
  .start()
  .then(() => {
    apolloServer.applyMiddleware({
      app,
      cors: corsOptions,
      path: "/graphql",
    });
  })
  .catch((error) => {
    Sentry.captureException(error);
    throw error;
  });
const server = createServer(app);
server.listen(PORT, async () => {
  require("./sockets/events").socket(server);
  console.log(`server is running on port ${PORT}`);
});
