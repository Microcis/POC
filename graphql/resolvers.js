const {
  getRTCToken,
  getAccessToken,
} = require("../controllers/rtcTokenController");

const resolvers = {
  Mutation: {
    getRTCToken,
    getAccessToken,
  },
};

module.exports = { resolvers };
