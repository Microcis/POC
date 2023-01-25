const jwt = require("jsonwebtoken");

const getRTCToken = (rtcToken) => {
  const { channel, tokenType, tokenRole, expireTimeMs } = rtcToken;
  const token = jwt.sign(
    {
      channel,
      tokenType,
      tokenRole,
    },
    process.env.RTC_SECRET_KEY,
    { expiresIn: expireTimeMs }
  );

  return { token, channel };
};

const getAccessToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, {});
  return { token, userId };
};

module.exports = {
  getRTCToken,
  getAccessToken,
};
