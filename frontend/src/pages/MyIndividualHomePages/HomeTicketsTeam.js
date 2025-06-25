import React, { useState, useEffect, useContext } from 'react';
import { Box, Chip, Grid, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { userStyle } from '../../pageStyle';

import axios from '../../axiosInstance';
import { SERVICE } from '../../services/Baseservice';
import { handleApiError } from '../../components/Errorhandling';
import { UserRoleAccessContext, AuthContext } from '../../context/Appcontext';
import IconButton from '@mui/material/IconButton';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

const HomeTickets = () => {
  const { auth } = useContext(AuthContext);
  const { isUserRoleAccess,listPageAccessMode, isUserRoleCompare, pageName, setPageName, isAssignBranch } = useContext(UserRoleAccessContext);


   let listpageaccessby =
      listPageAccessMode?.find(
        (data) =>
          data.modulename === "Setup" &&
          data.submodulename === "Team Dashboard" &&
          data.mainpagename === "" &&
          data.subpagename === "" &&
          data.subsubpagename === ""
      )?.listpageaccessmode || "Overall";



  // Error Popup model
  const [isErrorOpendialog, setIsErrorOpendialog] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpendialog(true);
  };

  const [individualTickets, setIndividualTickets] = useState(0);
  const [raiseTicketList, setRaiseTicketList] = useState([]);
  const [raiseTicketListDetails, setRaiseTicketListDetails] = useState([]);
  const [employees, setEmployees] = useState([]);
  const { v4: uuidv4 } = require('uuid');

  const fetchAll = async () => {
    try {
         
      let [res_Employee, res_queue, res_category, response] = await Promise.all([
        isUserRoleCompare?.includes('ltickets&checklist') && isUserRoleCompare?.includes('lindividualticketlist')
          ? axios.post(SERVICE.RAISE_TICKET_HOME_TEAM, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            //   username: isUserRoleAccess.companyname,
            hierarchyempnames: [isUserRoleAccess.companyname],
            })
          : Promise.resolve([]),
          
        isUserRoleCompare?.includes('ltickets&checklist') && isUserRoleCompare?.includes('lmyactionableticket')
          ? axios.post(SERVICE.PENDING_TICKETS_TEAM, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            //   username: isUserRoleAccess.companyname,
            hierarchyempnames: [isUserRoleAccess.companyname],
            })
          : Promise.resolve([]),

        axios.get(SERVICE.TEAMGROUPING, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        isUserRoleCompare?.includes('ltickets&checklist') && isUserRoleCompare?.includes('lmyactionableticket')
          ? axios.post(SERVICE.RAISE_TICKET_FORWARDED_TEAM, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            hierarchyempnames: [isUserRoleAccess.companyname],
            })
          : Promise.resolve([]),
      ]);

      const updatedAns1 = res_queue?.data.raisetickets.map((item) => {
        if (item.raiseTeamGroup === 'Manual' && item.forwardedemployee.length < 1) {
          return {
            ...item,
            resolverperson: [...item.employeenameRaise, item.teamgroupname],
          };
        } else if (item.forwardedemployee.length > 0) {
          return {
            ...item,
            resolverperson: item.forwardedemployee,
          };
        } else {
          const matchingItem = res_category?.data?.teamgroupings.find(
            (bItem) =>
              bItem.categoryfrom.includes(item.category) && bItem.subcategoryfrom.includes(item.subcategory) && bItem.typefrom.includes(item.type) && ['Open', 'Forwarded', 'Hold', 'Open Details Needed'].includes(item.raiseself) && bItem.employeenamefrom.some((emp) => item.employeename.includes(emp))
          );
          if (matchingItem) {
            return {
              ...item,
              resolverperson: matchingItem.employeenameto,
            };
          }
        }
      });

      const filteredArray = updatedAns1.filter((element) => element !== undefined);
      //General
      let allraiseres = res_queue?.data.raisetickets;
      let answerRaiseFilter = filteredArray?.filter((data, index) => data.raiseself !== 'Resolved' && data.raiseself !== 'Closed' && data.raiseself !== 'Reject' && data.resolverperson.includes(isUserRoleAccess.companyname));

      setIndividualTickets(res_Employee?.data?.result);

    //   setRaiseTicketList(isUserRoleAccess?.role?.includes('Manager') ? allraiseres : answerRaiseFilter);
      setRaiseTicketList(answerRaiseFilter);

      setRaiseTicketListDetails(response?.data?.raisetickets);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const getCode = async (e) => {
    const accessbranch = isAssignBranch
      ? isAssignBranch.map((data) => ({
          branch: data.branch,
          company: data.company,
          unit: data.unit,
        }))
      : [];
    setPageName(!pageName);
    try {
         let reshir = await axios.post(SERVICE.HIERARCHY_TEAM_ATTENDANCE_BASED_CLAIM, {
                          headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                          },
                          hierachy: "myallhierarchy",
                          sector: "all",
                          username: isUserRoleAccess.companyname,
                          pagename: "menuteamdashboard",
                          listpageaccessmode: listpageaccessby,
                        });
      let res_TemplateList = await axios.post(
        `${SERVICE.MY_VERIFICATION_HOME_TEAM}`,
        {
        //   assignbranch: accessbranch,
          hierarchyempnames: [isUserRoleAccess.companyname],
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      let res_Users = await axios.post(
        `${SERVICE.USER_ASSIGN_BRANCH_TEAM}`,
        {
        //   assignbranch: accessbranch,
           hierarchyempnames: [isUserRoleAccess.companyname],
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APITolen}`,
          },
        }
      );
      let users = res_Users?.data?.users;
      let templateList = res_TemplateList?.data?.templateList;
      let filterArray = [];
      templateList?.forEach((templateUser) => {
        templateUser?.employeename?.forEach((empName) => {
          users?.forEach((user) => {
            if (user.companyname === empName) {
              let extendedUser = {
                id: user?._id,
                templateId: templateUser?._id,
                verified: templateUser?.verifiedInfo,
                corrected: templateUser?.correctedInfo,
                company: user?.company,
                branch: user?.branch,
                unit: user?.unit,
                team: user?.team,
                employeename: user?.companyname,
                filename: templateUser?.filename,
                information: templateUser?.informationstring,
                verifyInfo: templateUser?.verifiedInfo,
              };
              filterArray.push(extendedUser);
            }
          });
        });
      });
      const generateNewIds = async (array) => {
        return array.map((item) => {
          return {
            ...item,
            commonid: uuidv4(), // Generate a new UUID for each object
          };
        });
      };
      let needToVerify = filterArray.filter((data) => reshir?.data?.resultAccessFilter.includes(data.employeename));
      const transformArray = (array) => {
        let result = [];
        array?.forEach((obj) => {
          obj.verifyInfo?.forEach((info) => {
            if (!info.edited && !info.corrected) {
              // Create a new object for each information value
              const newObject = {
                ...obj,
                information: info.name, // Assign a single value from the information array
              };
              result.push(newObject);
            }
          });
        });
        return result;
      };
      // Transform the array
      const transformedArray = transformArray(needToVerify);
      const arrayWithNewIds = await generateNewIds(transformedArray);
      let valid = arrayWithNewIds.filter((item) => {
        return item.information !== 'Boarding Information' && item.information !== 'Process Allot' && item.information !== 'Login Details';
      });
      const removeDuplicateNames = (array) => {
        const names = array.map((item) => item.information); // Extract names
        const uniqueNames = [...new Set(names)]; // Filter unique names

        return array.filter((item, index) => {
          return uniqueNames.includes(item.information) && uniqueNames.splice(uniqueNames.indexOf(item.information), 1);
        });
      };

      // Use the function
      const uniqueData = removeDuplicateNames(valid);
      setEmployees(uniqueData);
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{'something went wrong!14'}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };

  useEffect(() => {
    fetchAll();
    getCode();
  }, []);
  const links1 = [
    ...(isUserRoleCompare?.includes('ltickets&checklist') && isUserRoleCompare?.includes('lindividualticketlist')
      ? [
          {
            text: 'My Tickets',
            url: '/myraiseticketlistteam',
            count: individualTickets,
          },
        ]
      : []),

    ...(isUserRoleCompare?.includes('ltickets&checklist') && isUserRoleCompare?.includes('lmyactionableticket')
      ? [
          {
            text: 'My Pending Tickets',
            url: '/myraiseticketteamgroupteam',
            count: raiseTicketList.length,
          },
        ]
      : []),

    ...(isUserRoleCompare?.includes('ltickets&checklist') && isUserRoleCompare?.includes('lmyactionableticket')
      ? [
          {
            text: 'Details Needed Tickets',
            url: '/myraiseticketteamgroupteam',
            count: raiseTicketListDetails.length,
          },
        ]
      : []),

    ...(isUserRoleCompare?.includes('ltickets&checklist') && isUserRoleCompare?.includes('lmychecklist')
      ? [
          {
            text: 'My Checklist',
            url: '/interview/myinterviewchecklist',
            count: 0,
          },
        ]
      : []),

    ...(isUserRoleCompare?.includes('ltickets&checklist') && isUserRoleCompare?.includes('lmyverification')
      ? [
          {
            text: 'My Verification',
            url: '/dashboardmyverificationteam',
            count: employees.length,
          },
        ]
      : []),
  ];

  return (
    <>
      {isUserRoleCompare?.includes('ltickets&checklist') && (
        <Grid item xs={12} md={6} sm={6}>
          <Box sx={{ ...userStyle?.homepagecontainer, padding: '16px 5px' }}>
            <Typography sx={{ fontWeight: '700', paddingLeft: '16px', paddingTop: '16px' }}>Tickets & Checklist</Typography>
            <br />

            <Grid container spacing={2} sx={{ padding: '0px 20px' }}>
              {links1.map((link, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={6} md={6} lg={6} sm={6} marginTop={1}>
                    <Typography color="primary">{link.text}</Typography>
                  </Grid>

                  <Grid item xs={4} md={4} lg={4} sm={4} marginTop={1}>
                    {/* <Typography sx={{ fontWeight: 'bold', fontSize: "12px", color: '#ffffff', width: "20px", border: "1px solid #e75353", borderRadius: "50%", backgroundColor: "#fc5d5deb", display: "flex", justifyContent: "center", alignItems: "center" }}> */}

                    <Chip sx={{ height: '25px', borderRadius: '0px' }} color={'warning'} variant="outlined" label={link.count} />

                    {/* </Typography> */}
                  </Grid>
                  <Grid item xs={2} md={2} lg={2} sm={2}>
                    <IconButton edge="end" aria-label="open link" href={link.url} target="_blank" margin>
                      <OpenInNewIcon size="small" style={{ color: '#9e9e9e' }} />
                    </IconButton>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
            <br />
            <br />
            <Grid container sx={{ justifyContent: 'flex-end', marginTop: 'auto' }}></Grid>
          </Box>
        </Grid>
      )}
    </>
  );
};

export default HomeTickets;
