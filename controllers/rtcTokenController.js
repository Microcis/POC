const rtcTokenService = require("../services/tokenService");

module.exports = {
  async getRTCToken(parent, args, context, info) {
    try {
      const { rtcToken } = args;
      const newRtcToken = rtcTokenService.getRTCToken(rtcToken);
      return newRtcToken;
    } catch (error) {
      throw error;
    }
  },
  async getAccessToken(parent, args, context, info) {
    try {
      const { userId } = args;
      const newToken = rtcTokenService.getAccessToken(userId);
      return newToken;
    } catch (error) {
      throw error;
    }
  },
};
