const ClientDetails = require("../../../model/modules/clientSupport/manageclientdetails");
const TicketGrouping = require("../../../model/modules/clientSupport/manageTicketGrouping");
const Role = require("../../../model/modules/role/role");

const axios = require("axios");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

//get all clients raise problem datas
exports.getClientSupportDatas = catchAsyncErrors(async (req, res, next) => {
  try {
    let role = req?.query?.role?.split(",");
    let groupingresult, responses;

    if (!role?.includes("Manager")) {
      let simpleQuery = { employeedbid: { $in: [req?.query?.userid] } };

      let foundDocuments = await TicketGrouping.find(simpleQuery);

      if (foundDocuments.length === 0) {
        result = {
          modulename: [],
          submodulename: [],
          mainpage: [],
          subpage: [],
          subsubpage: [],
          clientname: [],
        };
      } else {
        const allotedmodules = await TicketGrouping.find({
          employeedbid: { $in: [req?.query?.userid] },
        });

        groupingresult = allotedmodules.length > 0 ? allotedmodules : [];
      }
    }
    let clientdetails = await ClientDetails.find({ status: "Active" });

    if (role?.includes("Manager")) {
      responses = await Promise.all(
        clientdetails.map(async (client) => {
          const url = `${client.clienturl.trim()}/api/getsupportdatawithkey`;
          const singledataurl = `${client.clienturl.trim()}/api/getsinglesupportdatawithkey`;
          try {
            const response = await axios.get(url, {
              headers: {
                "clientsupport-api-keys": client.apikey,
              },
            });

            return (response.data?.raises || []).map((raise) => ({
              ...raise,
              clientname: client?.clientname,
              clientid: client?.clientid,
              singledataurl,
              apikey: client?.apikey,
            }));
          } catch (error) {
            console.error(`Error fetching data from ${url}:`, error.message);
            return [];
          }
        })
      );
    } else if (!role?.includes("Manager") && groupingresult) {
      responses = await Promise.all(
        clientdetails?.map(async (client) => {
          // Find all grouping results for the current client
          const clientGroupingResults = groupingresult?.filter(
            (group) => group.clientname === client.clientname
          );

          // If no grouping results found for the client, skip it
          if (!clientGroupingResults || clientGroupingResults.length === 0) {
            return [];
          }

          const url = `${client.clienturl.trim()}/api/getsupportdatawithkey`;
          const singledataurl = `${client.clienturl.trim()}/api/getsinglesupportdatawithkey`;

          try {
            const response = await axios.get(url, {
              headers: {
                "clientsupport-api-keys": client.apikey,
              },
            });

            const filteredRaises = (response.data?.raises || []).filter(
              (raise) => {
                // Check if the raise matches any of the client grouping results
                return clientGroupingResults.some((clientGroupingResult) => {
                  const conditions = [
                    clientGroupingResult.modulename.includes(raise.modulename),
                  ];

                  if (
                    clientGroupingResult.submodulename.length > 0 &&
                    raise.submodulename
                  ) {
                    conditions.push(
                      clientGroupingResult.submodulename.includes(
                        raise.submodulename
                      )
                    );
                  }

                  if (
                    clientGroupingResult.mainpage.length > 0 &&
                    raise.mainpagename
                  ) {
                    conditions.push(
                      clientGroupingResult.mainpage.includes(raise.mainpagename)
                    );
                  }

                  if (
                    clientGroupingResult.subpage.length > 0 &&
                    raise.subpagename
                  ) {
                    conditions.push(
                      clientGroupingResult.subpage.includes(raise.subpagename)
                    );
                  }

                  if (
                    clientGroupingResult.subsubpage.length > 0 &&
                    raise.subsubpagename
                  ) {
                    conditions.push(
                      clientGroupingResult.subsubpage.includes(
                        raise.subsubpagename
                      )
                    );
                  }

                  return conditions.every(Boolean);
                });
              }
            );

            return filteredRaises.map((raise) => ({
              ...raise,
              clientname: client?.clientname,
              clientid: client?.clientid,
              singledataurl,
              apikey: client?.apikey,
            }));
          } catch (error) {
            console.error(`Error fetching data from ${url}:`, error.message);
            return [];
          }
        })
      );
    } else {
      responses = [];
    }

    let raises = responses?.flat();

    if (raises?.length === 0) {
      return next(new ErrorHandler("Raise issue not found!", 404));
    }

    // Sort raises by createdAt date
    raises?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Add unique ID to each raise
    raises = raises?.map((raise, index) => {
      return {
        ...raise,
        uniqueId: `HILIFE#${String(index + 1).padStart(2, "0")}`,
      };
    });

    // Pagination logic
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedRaises = raises.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      count: paginatedRaises.length,
      totalRaises: raises.length,
      page,
      totalPages: Math.ceil(raises.length / limit),
      raises: paginatedRaises,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return next(new ErrorHandler("Records not found!", 404));
  }
});

//get Manager role datas using api key
exports.getClientModuleNames = catchAsyncErrors(async (req, res, next) => {
  try {
    let clientRole = await Role.findOne({ name: "Manager" });

    if (!clientRole) {
      return next(new ErrorHandler("Module Names not found!", 404));
    }

    return res.status(200).json({
      success: true,
      clientRole,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return next(new ErrorHandler("Module Names not found", 404));
  }
});

//get all clients raise problem datas

exports.getClientSupportDatasOverAllExport = catchAsyncErrors(
  async (req, res, next) => {
    try {
      let role = req?.query?.role?.split(",");
      let groupingresult, responses;

      if (!role?.includes("Manager")) {
        let simpleQuery = { employeedbid: { $in: [req?.query?.userid] } };

        let foundDocuments = await TicketGrouping.find(simpleQuery);

        if (foundDocuments.length === 0) {
          result = {
            modulename: [],
            submodulename: [],
            mainpage: [],
            subpage: [],
            subsubpage: [],
            clientname: [],
          };
        } else {
          const allotedmodules = await TicketGrouping.find({
            employeedbid: { $in: [req?.query?.userid] },
          });

          groupingresult = allotedmodules.length > 0 ? allotedmodules : [];
        }
      }
      let clientdetails = await ClientDetails.find({ status: "Active" });

      if (role?.includes("Manager")) {
        responses = await Promise.all(
          clientdetails.map(async (client) => {
            const url = `${client.clienturl.trim()}/api/getsupportdatawithkey`;
            const singledataurl = `${client.clienturl.trim()}/api/getsinglesupportdatawithkey`;
            try {
              const response = await axios.get(url, {
                headers: {
                  "clientsupport-api-keys": client.apikey,
                },
              });

              return (response.data?.raises || []).map((raise) => ({
                ...raise,
                clientname: client?.clientname,
                clientid: client?.clientid,
                singledataurl,
                apikey: client?.apikey,
              }));
            } catch (error) {
              console.error(`Error fetching data from ${url}:`, error.message);
              return [];
            }
          })
        );
      } else if (!role?.includes("Manager") && groupingresult) {
        responses = await Promise.all(
          clientdetails?.map(async (client) => {
            // Find all grouping results for the current client
            const clientGroupingResults = groupingresult?.filter(
              (group) => group.clientname === client.clientname
            );

            // If no grouping results found for the client, skip it
            if (!clientGroupingResults || clientGroupingResults.length === 0) {
              return [];
            }

            const url = `${client.clienturl.trim()}/api/getsupportdatawithkey`;
            const singledataurl = `${client.clienturl.trim()}/api/getsinglesupportdatawithkey`;

            try {
              const response = await axios.get(url, {
                headers: {
                  "clientsupport-api-keys": client.apikey,
                },
              });

              const filteredRaises = (response.data?.raises || []).filter(
                (raise) => {
                  // Check if the raise matches any of the client grouping results
                  return clientGroupingResults.some((clientGroupingResult) => {
                    const conditions = [
                      clientGroupingResult.modulename.includes(
                        raise.modulename
                      ),
                    ];

                    if (
                      clientGroupingResult.submodulename.length > 0 &&
                      raise.submodulename
                    ) {
                      conditions.push(
                        clientGroupingResult.submodulename.includes(
                          raise.submodulename
                        )
                      );
                    }

                    if (
                      clientGroupingResult.mainpage.length > 0 &&
                      raise.mainpagenam
                    ) {
                      conditions.push(
                        clientGroupingResult.mainpage.includes(
                          raise.mainpagename
                        )
                      );
                    }

                    if (
                      clientGroupingResult.subpage.length > 0 &&
                      raise.subpagename
                    ) {
                      conditions.push(
                        clientGroupingResult.subpage.includes(raise.subpagename)
                      );
                    }

                    if (
                      clientGroupingResult.subsubpage.length > 0 &&
                      raise.subsubpagename
                    ) {
                      conditions.push(
                        clientGroupingResult.subsubpage.includes(
                          raise.subsubpagename
                        )
                      );
                    }

                    return conditions.every(Boolean);
                  });
                }
              );

              return filteredRaises.map((raise) => ({
                ...raise,
                clientname: client?.clientname,
                clientid: client?.clientid,
                singledataurl,
                apikey: client?.apikey,
              }));
            } catch (error) {
              console.error(`Error fetching data from ${url}:`, error.message);
              return [];
            }
          })
        );
      } else {
        responses = [];
      }

      let raises = responses?.flat();

      if (raises?.length === 0) {
        return next(new ErrorHandler("Raise issue not found!", 404));
      }

      // Sort raises by createdAt date
      raises?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.status(200).json({
        success: true,

        raises: raises,
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      return next(new ErrorHandler("Records not found!", 404));
    }
  }
);