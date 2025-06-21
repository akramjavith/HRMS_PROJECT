import React, { useState, useEffect, useContext } from 'react';
import { Box, Chip, Grid, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { userStyle } from '../pageStyle';
import axios from '../axiosInstance';
import { SERVICE } from '../services/Baseservice';
import { handleApiError } from '../components/Errorhandling';
import { UserRoleAccessContext, AuthContext } from '../context/Appcontext';
import IconButton from '@mui/material/IconButton';
import { ThreeDots } from 'react-loader-spinner';

const HomeApprove = () => {
  const [loader, setLoader] = useState(false);
  const { auth } = useContext(AuthContext);
  const { isUserRoleAccess, listpageaccessmode,isUserRoleCompare, listPageAccessMode, isAssignBranch } = useContext(UserRoleAccessContext);
  let listpageaccessbyhire =
    listPageAccessMode?.find(
      (data) =>
        data.modulename === "Setup" &&
        data.submodulename === "Team Dashboard" &&
        data.mainpagename === "" &&
        data.subpagename === "" &&
        data.subsubpagename === ""
    )?.listpageaccessmode || "Overall";


  const accessbranch = isAssignBranch?.map((data) => ({
    branch: data.branch,
    company: data.company,
    unit: data.unit,
  }));

  let listpageaccessby = listPageAccessMode?.find((data) => data.modulename === 'Production' && data.submodulename === 'Manual Entry' && data.mainpagename === 'Production Manual Entry Filter' && data.subpagename === '' && data.subsubpagename === '')?.listpageaccessmode || 'Overall';

  // Error Popup model
  const [isErrorOpendialog, setIsErrorOpendialog] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpendialog(true);
  };

  const [prodHierarchy, setProdHierarchy] = useState(0);
  const [leaveHome, setLeaveHome] = useState(0);
  const [permission, setPermission] = useState(0);
  const [longabsent, setLongAbsent] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [loan, setLoan] = useState(0);
  const fetchEmployee = async () => {
    setLoader(true);
    try {
       let res = await axios.post(SERVICE.HIERARCHY_TEAM_ATTENDANCE_BASED_CLAIM, {
                headers: {
                  Authorization: `Bearer ${auth.APIToken}`,
                },
                hierachy: "myallhierarchy",
                sector: "all",
                username: isUserRoleAccess.companyname,
                pagename: "menuteamdashboard",
                listpageaccessmode: listpageaccessbyhire,
              });


      let [res_prodhierarchy, res_longabsent, res_advance, res_loan, res_per, res_apl] = await Promise.all([
        
        isUserRoleCompare?.includes('lapprovals') && isUserRoleCompare?.includes('lproductionapproved')
          ? await axios.post(SERVICE.PRODUCTION_INDIVIDUAL_HIERARCHYFILTER_HOME, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },

              username: isUserRoleAccess.companyname,
              hierachy: 'myallhierarchy',
              sector: 'all',
              listpageaccessmode: listpageaccessby,
            })
          : Promise.resolve([]),

        isUserRoleCompare?.includes('lapprovals') && isUserRoleCompare?.includes('llongabsent')
          ? await axios.post(SERVICE.LONG_ABSENT_HOME, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              filterin: 'Employee',
              username: isUserRoleAccess.companyname,
              hierachy: 'My + All Hierarchy List',
              sector: 'all',
              listpageaccessmode: listpageaccessby,
              team: isUserRoleAccess.team,
              module: 'Human Resources',
              submodule: 'HR',
              mainpage: 'Employee',
              subpage: 'Employee Status Details',
              subsubpage: 'Long Absent Restriction List',
              status: 'completed',
            })
          : Promise.resolve([]),

        isUserRoleCompare?.includes('lapprovals') && isUserRoleCompare?.includes('ladvance')
          ? axios.post(SERVICE.ADVANCE_TEAM, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              hierarchyempnames: res.data.resultAccessFilter,
            })
          : Promise.resolve([]),

        isUserRoleCompare?.includes('lapprovals') && isUserRoleCompare?.includes('lloan')
          ? axios.post(SERVICE.LOAN_TEAM, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
                hierarchyempnames: res.data.resultAccessFilter,
            })
          : Promise.resolve([]),

        isUserRoleCompare?.includes('lapprovals') && isUserRoleCompare?.includes('lteampermissionverification')
          ? axios.post(SERVICE.PERMISSION_HOME_TEAM, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
               hierarchyempnames: res.data.resultAccessFilter,
            })
          : Promise.resolve([]),

        isUserRoleCompare?.includes('lapprovals') && isUserRoleCompare?.includes('lteamleaveverification')
          ? axios.post(SERVICE.APPLYLEAVE_FILTERED_HOME_COUNT_TEAM, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              hierarchyempnames: res.data.resultAccessFilter,
            })
          : Promise.resolve([]),
      ]);
      setProdHierarchy(res_prodhierarchy?.data?.resultAccessFilter.length);
      setLongAbsent(res_longabsent?.data?.filterallDatauser);
      setAdvance(res_advance?.data?.advance);
      setLoan(res_loan?.data?.loan);
      setPermission(res_per?.data?.permissions ? res_per?.data?.permissions : 0);
      setLeaveHome(res_apl?.data?.applyleaves ? res_apl?.data?.applyleaves : 0);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      // handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  const links1 = [
    ...(isUserRoleCompare?.includes('lapprovals') && isUserRoleCompare?.includes('lproductionapproved')
      ? [
          {
            text: 'Production Approved',
            url: '/production/productionindividualfilter',
            count: prodHierarchy,
          },
        ]
      : []),

    ...(isUserRoleCompare?.includes('lapprovals') && isUserRoleCompare?.includes('lleavedashboard')
      ? [
          {
            text: 'Leave',
            url: '/leave/teamleaveverification',
            count: leaveHome,
          },
        ]
      : []),

    ...(isUserRoleCompare?.includes('lapprovals') && isUserRoleCompare?.includes('lpermissiondashboard')
      ? [
          {
            text: 'Permission',
            url: '/permission/teampermissionverification',
            count: permission,
          },
        ]
      : []),

    ...(isUserRoleCompare?.includes('lapprovals') && isUserRoleCompare?.includes('llongabsent')
      ? [
          {
            text: 'Long Absent',
            url: '/employee/longabsentrestrictionhierarchylist',
            count: longabsent,
          },
        ]
      : []),

    ...(isUserRoleCompare?.includes('lapprovals') && isUserRoleCompare?.includes('ladvancedashboard')
      ? [
          {
            text: 'Advance',
            url: '/advancehomelistteam',
            count: advance,
          },
        ]
      : []),

    ...(isUserRoleCompare?.includes('lapprovals') && isUserRoleCompare?.includes('lloandashboard')
      ? [
          {
            text: 'Loan',
            url: '/loanrequestteam',
            count: loan,
          },
        ]
      : []),
  ];

  return (
    <>
      {isUserRoleCompare?.includes('lapprovals') && (
        <Grid item xs={12} md={4} sm={4}>
          <Box sx={{ ...userStyle?.homepagecontainer, padding: '16px 5px' }}>
            <Typography sx={{ fontWeight: '700', paddingLeft: '16px', paddingTop: '16px' }}>Approvals</Typography>
            <br />

            <>
              {loader ? (
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                </Grid>
              ) : (
                <Grid container spacing={2} sx={{ padding: '0px 20px' }}>
                  {links1.map((link, index) => (
                    <React.Fragment key={index}>
                      <Grid item xs={6} md={6} lg={6} sm={6} marginTop={1}>
                        <Typography color="primary">{link.text}</Typography>
                      </Grid>
                      <Grid item xs={4} md={4} lg={4} sm={4} marginTop={1}>
                        <Chip sx={{ height: '25px', borderRadius: '0px' }} color={'warning'} variant="outlined" label={link.count} />
                      </Grid>
                      <Grid item xs={2} md={2} lg={2} sm={2}>
                        <IconButton edge="end" aria-label="open link" href={link.url} target="_blank">
                          <OpenInNewIcon size="small" style={{ color: '#9e9e9e' }} />
                        </IconButton>
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              )}
            </>
          </Box>
        </Grid>
      )}
    </>
  );
};

export default HomeApprove;
