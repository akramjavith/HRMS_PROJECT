const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");
const AdminOverAllSettings = require("../../model/modules/settings/AdminOverAllSettingsModel");

const axios = require("axios");
const dotenv = require("dotenv");
require("dotenv").config();

// api to fetch all the team names in mattermost
exports.getMattermostTeamNames = catchAsyncErrors(async (req, res, next) => {
  try {
    let hiConnectUrl = await AdminOverAllSettings.findOne()
      .sort({ createdAt: -1 })
      .select("hiconnecturl");

    if (hiConnectUrl?.hiconnecturl) {
      try {
        let HICONNECT_URL = hiConnectUrl.hiconnecturl;

        const response = await axios.get(`${HICONNECT_URL}/api/v4/teams`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MATTERMOST_TOKEN}`,
          },
        });

        return res.status(200).json({
          mattermostteams: response.data,
        });
      } catch (error) {
        if (error.response) {
          return next(
            new ErrorHandler(
              error.response.data.message || "An error occurred",
              error.response.status || 500
            )
          );
        } else if (error.request) {
          return next(
            new ErrorHandler("No response received from server", 500)
          );
        } else {
          return next(new ErrorHandler("Error Fetching Teams!", 500));
        }
      }
    } else {
      return next(new ErrorHandler("No URL Found!", 404));
    }
  } catch (error) {
    if (error.response) {
      return next(
        new ErrorHandler(
          error.response.data.message || "An error occurred",
          error.response.status
        )
      );
    } else {
      return next(new ErrorHandler("Error Fetching Teams!", 500));
    }
  }
});

// api to fetch all the channel (both public and private) names in a particular team  in mattermost
exports.getMattermostChannelNames = catchAsyncErrors(async (req, res, next) => {
  try {
    let hiConnectUrl = await AdminOverAllSettings.findOne()
      .sort({ createdAt: -1 })
      .select("hiconnecturl");

    let teamId = req.query.teamid;

    if (hiConnectUrl?.hiconnecturl) {
      try {
        let HICONNECT_URL = hiConnectUrl.hiconnecturl;
        let urlArray = [
          `${HICONNECT_URL}/api/v4/teams/${teamId}/channels/private`,
          `${HICONNECT_URL}/api/v4/teams/${teamId}/channels`,
        ];

        let allTeams = await Promise.all(
          urlArray?.map(async (url) => {
            try {
              const response = await axios.get(url, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.MATTERMOST_TOKEN}`,
                },
              });

              return response.data || [];
            } catch (error) {
              console.error(`Error fetching data from ${url}:`, error.message);
              return [];
            }
          })
        );

        return res.status(200).json({
          mattermostchannels: allTeams?.flat() || [],
        });
      } catch (error) {
        if (error.response) {
          return next(
            new ErrorHandler(
              error.response.data.message || "An error occurred",
              error.response.status || 500
            )
          );
        } else if (error.request) {
          return next(
            new ErrorHandler("No response received from server", 500)
          );
        } else {
          return next(new ErrorHandler("Error Fetching Channels", 500));
        }
      }
    } else {
      return next(new ErrorHandler("No URL Found!", 404));
    }
  } catch (error) {
    if (error.response) {
      return next(
        new ErrorHandler(
          error.response.data.message || "An error occurred",
          error.response.status
        )
      );
    } else {
      return next(new ErrorHandler("Error Fetching Channels", 500));
    }
  }
});

// Controller to deactivate a Mattermost user by user ID
exports.deactivateMattermostUser = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  try {
    let hiConnectUrl = await AdminOverAllSettings.findOne()
      .sort({ createdAt: -1 })
      .select("hiconnecturl");

    if (hiConnectUrl?.hiconnecturl) {
      try {
        let HICONNECT_URL = hiConnectUrl.hiconnecturl;
        const response = await axios.delete(
          `${HICONNECT_URL}/api/v4/users/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.MATTERMOST_TOKEN}`,
            },
          }
        );

        return res.status(200).json({
          success: true,
          message: `User ${userId} has been deactivated.`,
        });
      } catch (error) {
        if (error.response) {
          return next(
            new ErrorHandler(
              error.response.data.message || "An error occurred",
              error.response.status || 500
            )
          );
        } else if (error.request) {
          return next(
            new ErrorHandler("No response received from server", 500)
          );
        } else {
          return next(new ErrorHandler("An error occurred", 5000));
        }
      }
    } else {
      return next(new ErrorHandler("No URL Found!", 404));
    }
  } catch (error) {
    if (error.response) {
      return next(
        new ErrorHandler(
          error.response.data.message || "An error occurred",
          error.response.status
        )
      );
    } else {
      return next(new ErrorHandler("An error occurred", 500));
    }
  }
});

//CREATE TEAM FUNCTIONS  START  ----------------------------

//create mattermost team
exports.createMattermostTeamName = catchAsyncErrors(async (req, res, next) => {
  try {
    let hiConnectUrl = await AdminOverAllSettings.findOne()
      .sort({ createdAt: -1 })
      .select("hiconnecturl");

    if (hiConnectUrl?.hiconnecturl) {
      try {
        const { name, displayname, type } = req.body;

        let HICONNECT_URL = hiConnectUrl.hiconnecturl;

        const response = await axios.post(
          `${HICONNECT_URL}/api/v4/teams`,
          {
            name: name,
            display_name: displayname,
            type: type,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.MATTERMOST_TOKEN}`,
            },
          }
        );

        return res.status(200).json({
          success: true,
          mattermostteams: response.data,
        });
      } catch (error) {
        if (error.response) {
          return next(
            new ErrorHandler(
              error.response.data.message || "An error occurred",
              error.response.status || 500
            )
          );
        } else if (error.request) {
          return next(
            new ErrorHandler("No response received from server", 500)
          );
        } else {
          return next(new ErrorHandler("Error Creating Teams!", 500));
        }
      }
    } else {
      return next(new ErrorHandler("No URL Found!", 404));
    }
  } catch (error) {
    if (error.response) {
      return next(
        new ErrorHandler(
          error.response.data.message || "An error occurred",
          error.response.status
        )
      );
    } else {
      return next(new ErrorHandler("Error Creating Teams!", 500));
    }
  }
});

//Delete mattermost team
exports.deleteMattermostTeamName = catchAsyncErrors(async (req, res, next) => {
  try {
    let hiConnectUrl = await AdminOverAllSettings.findOne()
      .sort({ createdAt: -1 })
      .select("hiconnecturl");

    if (hiConnectUrl?.hiconnecturl) {
      try {
        const { teamid } = req.query;

        let HICONNECT_URL = hiConnectUrl.hiconnecturl;

        const response = await axios.delete(
          `${HICONNECT_URL}/api/v4/teams/${teamid}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.MATTERMOST_TOKEN}`,
            },
          }
        );

        return res.status(200).json({
          success: true,
          mattermostteams: response.data,
        });
      } catch (error) {
        if (error.response) {
          return next(
            new ErrorHandler(
              error.response.data.message || "An error occurred",
              error.response.status || 500
            )
          );
        } else if (error.request) {
          return next(
            new ErrorHandler("No response received from server", 500)
          );
        } else {
          return next(new ErrorHandler("Error Creating Teams!", 500));
        }
      }
    } else {
      return next(new ErrorHandler("No URL Found!", 404));
    }
  } catch (error) {
    if (error.response) {
      return next(
        new ErrorHandler(
          error.response.data.message || "An error occurred",
          error.response.status
        )
      );
    } else {
      return next(new ErrorHandler("Error Creating Teams!", 500));
    }
  }
});

//Restore mattermost team
exports.restoreMattermostTeamName = catchAsyncErrors(async (req, res, next) => {
  try {
    let hiConnectUrl = await AdminOverAllSettings.findOne()
      .sort({ createdAt: -1 })
      .select("hiconnecturl");

    if (hiConnectUrl?.hiconnecturl) {
      try {
        const { teamid } = req.query;

        let HICONNECT_URL = hiConnectUrl.hiconnecturl;

        const response = await axios.post(
          `${HICONNECT_URL}/api/v4/teams/${teamid}/restore`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.MATTERMOST_TOKEN}`,
            },
          }
        );
        return res.status(200).json({
          success: true,
          mattermostteams: response.data,
        });
      } catch (error) {
        if (error.response) {
          return next(
            new ErrorHandler(
              error.response.data.message || "An error occurred",
              error.response.status || 500
            )
          );
        } else if (error.request) {
          return next(
            new ErrorHandler("No response received from server", 500)
          );
        } else {
          return next(new ErrorHandler("Error Creating Teams!", 500));
        }
      }
    } else {
      return next(new ErrorHandler("No URL Found!", 404));
    }
  } catch (error) {
    if (error.response) {
      return next(
        new ErrorHandler(
          error.response.data.message || "An error occurred",
          error.response.status
        )
      );
    } else {
      return next(new ErrorHandler("Error Creating Teams!", 500));
    }
  }
});

//Update mattermost team
exports.updateMattermostTeamName = catchAsyncErrors(async (req, res, next) => {
  try {
    let hiConnectUrl = await AdminOverAllSettings.findOne()
      .sort({ createdAt: -1 })
      .select("hiconnecturl");

    if (hiConnectUrl?.hiconnecturl) {
      try {
        const { teamid } = req.query;
        const { name, displayname, type } = req.body;
        console.log(teamid);
        console.log(req.body);

        let HICONNECT_URL = hiConnectUrl.hiconnecturl;

        const response = await axios.put(
          `${HICONNECT_URL}/api/v4/teams/${teamid}`,
          {
            id: teamid,
            display_name: displayname,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.MATTERMOST_TOKEN}`,
            },
          }
        );
        return res.status(200).json({
          success: true,
          mattermostteams: response.data,
        });
      } catch (error) {
        if (error.response) {
          return next(
            new ErrorHandler(
              error.response.data.message || "An error occurred",
              error.response.status || 500
            )
          );
        } else if (error.request) {
          return next(
            new ErrorHandler("No response received from server", 500)
          );
        } else {
          return next(new ErrorHandler("Error Creating Teams!", 500));
        }
      }
    } else {
      return next(new ErrorHandler("No URL Found!", 404));
    }
  } catch (error) {
    if (error.response) {
      return next(
        new ErrorHandler(
          error.response.data.message || "An error occurred",
          error.response.status
        )
      );
    } else {
      return next(new ErrorHandler("Error Creating Teams!", 500));
    }
  }
});

//CREATE TEAM FUNCTIONS  END --------------------------------

//CREATE CHANNEL FUNCTIONS  START ---------------------------

//get all teams  mattermost channel
exports.getAllTeamMattermostChannels = catchAsyncErrors(
  async (req, res, next) => {
    try {
      let hiConnectUrl = await AdminOverAllSettings.findOne()
        .sort({ createdAt: -1 })
        .select("hiconnecturl");

      if (hiConnectUrl?.hiconnecturl) {
        try {
          let HICONNECT_URL = hiConnectUrl.hiconnecturl;

          const response = await axios.get(`${HICONNECT_URL}/api/v4/channels`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.MATTERMOST_TOKEN}`,
            },
          });

          return res.status(200).json({
            success: true,
            mattermostchannels: response.data,
          });
        } catch (error) {
          if (error.response) {
            return next(
              new ErrorHandler(
                error.response.data.message || "An error occurred",
                error.response.status || 500
              )
            );
          } else if (error.request) {
            return next(
              new ErrorHandler("No response received from server", 500)
            );
          } else {
            return next(new ErrorHandler("Error Creating Teams!", 500));
          }
        }
      } else {
        return next(new ErrorHandler("No URL Found!", 404));
      }
    } catch (error) {
      if (error.response) {
        return next(
          new ErrorHandler(
            error.response.data.message || "An error occurred",
            error.response.status
          )
        );
      } else {
        return next(new ErrorHandler("Error Creating Teams!", 500));
      }
    }
  }
);

//create mattermost channel
exports.createMattermostChannel = catchAsyncErrors(async (req, res, next) => {
  try {
    let hiConnectUrl = await AdminOverAllSettings.findOne()
      .sort({ createdAt: -1 })
      .select("hiconnecturl");

    if (hiConnectUrl?.hiconnecturl) {
      try {
        const { teamid, name, displayname, type, purpose } = req.body;

        let HICONNECT_URL = hiConnectUrl.hiconnecturl;

        const response = await axios.post(
          `${HICONNECT_URL}/api/v4/channels`,
          {
            team_id: teamid,
            name: name,
            display_name: displayname,
            type: type,
            purpose: purpose,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.MATTERMOST_TOKEN}`,
            },
          }
        );

        return res.status(200).json({
          success: true,
          mattermostchannels: response.data,
        });
      } catch (error) {
        if (error.response) {
          return next(
            new ErrorHandler(
              error.response.data.message || "An error occurred",
              error.response.status || 500
            )
          );
        } else if (error.request) {
          return next(
            new ErrorHandler("No response received from server", 500)
          );
        } else {
          return next(new ErrorHandler("Error Creating Teams!", 500));
        }
      }
    } else {
      return next(new ErrorHandler("No URL Found!", 404));
    }
  } catch (error) {
    if (error.response) {
      return next(
        new ErrorHandler(
          error.response.data.message || "An error occurred",
          error.response.status
        )
      );
    } else {
      return next(new ErrorHandler("Error Creating Teams!", 500));
    }
  }
});

//Delete mattermost channel
exports.deleteMattermostChannel = catchAsyncErrors(async (req, res, next) => {
  try {
    let hiConnectUrl = await AdminOverAllSettings.findOne()
      .sort({ createdAt: -1 })
      .select("hiconnecturl");

    if (hiConnectUrl?.hiconnecturl) {
      try {
        const { channelid } = req.query;

        let HICONNECT_URL = hiConnectUrl.hiconnecturl;

        const response = await axios.delete(
          `${HICONNECT_URL}/api/v4/channels/${channelid}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.MATTERMOST_TOKEN}`,
            },
          }
        );

        return res.status(200).json({
          success: true,
          mattermostchannels: response.data,
        });
      } catch (error) {
        if (error.response) {
          return next(
            new ErrorHandler(
              error.response.data.message || "An error occurred",
              error.response.status || 500
            )
          );
        } else if (error.request) {
          return next(
            new ErrorHandler("No response received from server", 500)
          );
        } else {
          return next(new ErrorHandler("Error Creating Teams!", 500));
        }
      }
    } else {
      return next(new ErrorHandler("No URL Found!", 404));
    }
  } catch (error) {
    if (error.response) {
      return next(
        new ErrorHandler(
          error.response.data.message || "An error occurred",
          error.response.status
        )
      );
    } else {
      return next(new ErrorHandler("Error Creating Teams!", 500));
    }
  }
});

//Restore mattermost channel
exports.restoreMattermostChannel = catchAsyncErrors(async (req, res, next) => {
  try {
    let hiConnectUrl = await AdminOverAllSettings.findOne()
      .sort({ createdAt: -1 })
      .select("hiconnecturl");

    if (hiConnectUrl?.hiconnecturl) {
      try {
        const { channelid } = req.query;

        let HICONNECT_URL = hiConnectUrl.hiconnecturl;

        const response = await axios.post(
          `${HICONNECT_URL}/api/v4/channels/${channelid}/restore`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.MATTERMOST_TOKEN}`,
            },
          }
        );
        return res.status(200).json({
          success: true,
          mattermostchannels: response.data,
        });
      } catch (error) {
        if (error.response) {
          return next(
            new ErrorHandler(
              error.response.data.message || "An error occurred",
              error.response.status || 500
            )
          );
        } else if (error.request) {
          return next(
            new ErrorHandler("No response received from server", 500)
          );
        } else {
          return next(new ErrorHandler("Error Creating Teams!", 500));
        }
      }
    } else {
      return next(new ErrorHandler("No URL Found!", 404));
    }
  } catch (error) {
    if (error.response) {
      return next(
        new ErrorHandler(
          error.response.data.message || "An error occurred",
          error.response.status
        )
      );
    } else {
      return next(new ErrorHandler("Error Creating Teams!", 500));
    }
  }
});

//Update mattermost channel
exports.updateMattermostChannel = catchAsyncErrors(async (req, res, next) => {
  try {
    let hiConnectUrl = await AdminOverAllSettings.findOne()
      .sort({ createdAt: -1 })
      .select("hiconnecturl");

    if (hiConnectUrl?.hiconnecturl) {
      try {
        const { channelid } = req.query;
        const { name, displayname, purpose } = req.body;

        let HICONNECT_URL = hiConnectUrl.hiconnecturl;

        const response = await axios.put(
          `${HICONNECT_URL}/api/v4/channels/${channelid}`,
          {
            id: channelid,
            name: name,
            display_name: displayname,
            purpose: purpose,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.MATTERMOST_TOKEN}`,
            },
          }
        );
        return res.status(200).json({
          success: true,
          mattermostchannels: response.data,
        });
      } catch (error) {
        if (error.response) {
          return next(
            new ErrorHandler(
              error.response.data.message || "An error occurred",
              error.response.status || 500
            )
          );
        } else if (error.request) {
          return next(
            new ErrorHandler("No response received from server", 500)
          );
        } else {
          return next(new ErrorHandler("Error Creating Teams!", 500));
        }
      }
    } else {
      return next(new ErrorHandler("No URL Found!", 404));
    }
  } catch (error) {
    if (error.response) {
      return next(
        new ErrorHandler(
          error.response.data.message || "An error occurred",
          error.response.status
        )
      );
    } else {
      return next(new ErrorHandler("Error Creating Teams!", 500));
    }
  }
});

//CREATE CHANNEL FUNCTIONS  END ---------------------------