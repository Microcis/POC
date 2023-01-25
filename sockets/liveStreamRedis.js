const { redisClient } = require("../utils/redis");

const addOnlineUser = async (userId) => {
  try {
    const newKey = `onlineUser-${userId}`;
    const onlineUser = await redisClient.set(newKey, userId);
    return onlineUser;
  } catch (error) {
    console.log(error);
  }
};

const getOnlineUser = async (key) => {
  try {
    const newKey = `onlineUser-${key}`;
    const findUser = await redisClient.get(newKey);
    return findUser;
  } catch (error) {
    console.log(error);
  }
};

const deleteOnlineUser = (key) => {
  const newKey = `onlineUser-${key}`;
  return redisClient.del(newKey);
};

const addUserToChannel = async (key, value) => {
  try {
    const usersInChannel = [];
    const newKey = `channel-${key}`;
    const foundChannel = await redisClient.get(newKey);
    console.log("foundChannel: ", foundChannel);
    if (!foundChannel) {
      usersInChannel.push(value);
      console.log("usersInChannel: ", usersInChannel);
      const newValue = JSON.stringify(usersInChannel);
      return await redisClient.set(newKey, newValue);
    }
    const parsedObject = JSON.parse(foundChannel);
    console.log("parsedObject: ", parsedObject);
    const foundUser = parsedObject?.some((e) => e?.userId === value.userId);
    if (!foundUser) {
      const addedUser = parsedObject.push(value);
      console.log("addedUser: ", addedUser);
      const newValue = JSON.stringify(addedUser);
      return await redisClient.set(newKey, newValue);
    } else {
      return { message: "User is exists already!" };
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteUserFromChannel = async (key, userId) => {
  const newKey = `channel-${key}`;
  const findChannel = await redisClient.get(newKey);
  const parsedObject = JSON.parse(findChannel);
};

const deleteChannel = (key) => {
  const newKey = `channel-${key}`;
  return redisClient.del(newKey);
};

module.exports = {
  addOnlineUser,
  getOnlineUser,
  deleteOnlineUser,
  addUserToChannel,
  deleteUserFromChannel,
  deleteChannel,
};
