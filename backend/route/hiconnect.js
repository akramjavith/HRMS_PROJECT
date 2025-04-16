const express = require("express");
const hiConnect = express.Router();
require("dotenv").config();

const {
  getMattermostChannelNames,
  getMattermostTeamNames,
  deactivateMattermostUser,

  createMattermostTeamName,
  deleteMattermostTeamName,
  restoreMattermostTeamName,
  updateMattermostTeamName,

  getAllTeamMattermostChannels,
  createMattermostChannel,
  deleteMattermostChannel,
  restoreMattermostChannel,
  updateMattermostChannel,
} = require("../controller/login/hiconnect");

hiConnect.route("/getmattermostteamnames").get(getMattermostTeamNames);
hiConnect.route("/getmattermostchannelnames").get(getMattermostChannelNames);

hiConnect
  .route("/deactivatemattermostuser/:userId")
  .delete(deactivateMattermostUser);

//create team

hiConnect.route("/createmattermostteam").post(createMattermostTeamName);
hiConnect.route("/deletemattermostteam").delete(deleteMattermostTeamName);
hiConnect.route("/restoremattermostteam").post(restoreMattermostTeamName);
hiConnect.route("/updatemattermostteam").put(updateMattermostTeamName);

//create channel

hiConnect
  .route("/getmattermostallteamchannels")
  .get(getAllTeamMattermostChannels);
hiConnect.route("/createmattermostchannel").post(createMattermostChannel);
hiConnect.route("/deletemattermostchannel").delete(deleteMattermostChannel);
hiConnect.route("/restoremattermostchannel").post(restoreMattermostChannel);
hiConnect.route("/updatemattermostchannel").put(updateMattermostChannel);

module.exports = hiConnect;