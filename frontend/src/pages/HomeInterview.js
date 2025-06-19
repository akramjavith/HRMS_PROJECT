import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { ThreeDots } from 'react-loader-spinner';
import { userStyle } from '../pageStyle';

import axios from '../axiosInstance';
import { SERVICE } from '../services/Baseservice';
import { Link } from 'react-router-dom';
import { handleApiError } from '../components/Errorhandling';
import { UserRoleAccessContext, AuthContext } from '../context/Appcontext';

const HomeInterview = () => {
  const [loader, setLoader] = useState(false);
  const { auth } = useContext(AuthContext);
  const { isUserRoleCompare, pageName, setPageName, isAssignBranch } = useContext(UserRoleAccessContext);

  // Error Popup model
  const [isErrorOpendialog, setIsErrorOpendialog] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpendialog(true);
  };

  const [candidate, setCandidate] = useState([]);
  const fetchAllCandidate = async () => {
    setPageName(!pageName);
    setLoader(true);
    try {
      if (isUserRoleCompare?.includes('linterviewstatus')) {
        let resans = [];
        const [res, res1] = await Promise.all([
          axios.get(SERVICE.INTERVIEWCANDIDATES, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }),
          axios.get(SERVICE.ALLJOBOPENINGS, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
          }),
        ]);

        let jobopeningDatas = res1?.data?.jobopenings;

        let getAssignedCandidates = res?.data?.candidates
          .filter((data) => {
            return data.role && data.role != 'All';
          })
          .map((item) => {
            let foundData = jobopeningDatas.find((newItem) => newItem._id == item.jobopeningsid);
            if (foundData) {
              return {
                ...item,
                company: foundData.company,
                branch: foundData.branch,
                floor: foundData.floor,
                recruitmentname: foundData.recruitmentname,
                uniquename: `${foundData.company}_${foundData.branch}_${foundData.floor}_${foundData.recruitmentname}`,
              };
            } else {
              return {
                ...item,
                company: '',
                branch: '',
                floor: '',
                recruitmentname: '',
                uniquename: '',
              };
            }
          })
          .filter((data) => {
            return data.company !== '';
          });

        function countUniqueCombinations(data) {
          const counts = {};
          let uniqueArray = [];
          data.forEach((item) => {
            const key = `${item.company}_${item.branch}_${item.floor}_${item.recruitmentname}`;
            if (!uniqueArray.includes(key)) {
              uniqueArray.push(key);
            }
            counts[key] = (counts[key] || 0) + 1;
          });
          const result = Object.keys(counts).map((key) => {
            const [company, branch, floor, recruitmentname] = key.split('_');
            return {
              company,
              branch,
              floor,
              recruitmentname,
              uniquename: `${company}_${branch}_${floor}_${recruitmentname}`,
              count: counts[key],
            };
          });

          let updatedArray = result.map((data, index) => {
            let foundDatas = getAssignedCandidates.filter((item) => {
              return item.uniquename == data.uniquename;
            });

            if (foundDatas) {
              return {
                ...data,
                relatedDatas: foundDatas,
                _id: index,
              };
            }
          });

          return { result, uniqueArray, updatedArray };
        }

        let showValues = countUniqueCombinations(getAssignedCandidates);

        let finalValues = showValues?.updatedArray?.map((data) => {
          // Initialize counts object
          let counts = {};

          // Iterate through relatedDatas and assign considerValue
          let considerValue = data.relatedDatas.map((item) => {
            if (item.candidatestatus !== undefined && item.candidatestatus !== '') {
              return { ...item, considerValue: item.candidatestatus };
            } else if (item.interviewrounds && item.interviewrounds.length === 0) {
              return { ...item, considerValue: 'Ignore' };
            } else if (item.interviewrounds && item.interviewrounds.length == 1) {
              let status = item.interviewrounds[0].rounduserstatus !== undefined && item.interviewrounds[0].rounduserstatus !== '';
              if (status) {
                const fieldToCheck = 'rounduserstatus';
                const foundObject = item.interviewrounds.find((obj) => obj[fieldToCheck] !== undefined && obj[fieldToCheck] !== '');
                return { ...item, considerValue: foundObject.rounduserstatus };
              } else {
                let status = item.interviewrounds[0].roundanswerstatus !== undefined && item.interviewrounds[0].roundanswerstatus !== '';
                if (status) {
                  const fieldToCheck = 'roundanswerstatus';
                  const foundObject = item.interviewrounds.find((obj) => obj[fieldToCheck] !== undefined && obj[fieldToCheck] !== '');
                  return {
                    ...item,
                    considerValue: foundObject.roundanswerstatus,
                  };
                } else {
                  return { ...item, considerValue: 'Ignore' };
                }
              }
            } else {
              let status = item.interviewrounds.some((item1) => item1.rounduserstatus !== undefined && item1.rounduserstatus !== '');
              if (status) {
                const fieldToCheck = 'rounduserstatus';
                const foundObject = item.interviewrounds.find((obj) => obj[fieldToCheck] !== undefined && obj[fieldToCheck] !== '');
                return { ...item, considerValue: foundObject.rounduserstatus };
              } else {
                let status = item.interviewrounds.some((item1) => item1.roundanswerstatus !== undefined && item1.roundanswerstatus !== '');
                if (status) {
                  const fieldToCheck = 'roundanswerstatus';
                  const reversedInterviewRounds = item.interviewrounds.slice().reverse();
                  const foundObject = reversedInterviewRounds.find((obj) => obj[fieldToCheck] !== undefined && obj[fieldToCheck] !== '');
                  return {
                    ...item,
                    considerValue: foundObject.roundanswerstatus,
                  };
                } else {
                  return { ...item, considerValue: 'Ignore' };
                }
              }
            }
          });

          considerValue.forEach((obj) => {
            const value = obj.considerValue;
            counts[value] = (counts[value] || 0) + 1;
          });

          return { ...data, relatedDatas: considerValue, dataCount: counts };
        });
        const accessbranch = isAssignBranch
          ?.map((data) => ({
            branch: data.branch,
            company: data.company,
          }))
          .filter((item, index, self) => {
            return index === self.findIndex((i) => i.branch === item.branch && i.company === item.company);
          });

        // const finaldata = finalValues.filter((data, index) => {
        //     accessbranch.forEach((d, i) => {
        //         if (d.company === data.company && d.branch === data.branch) {
        //             resans.push(data);
        //         }
        //     });
        // });
        const finaldata = finalValues.filter((data) => {
          return accessbranch.some((d) => d.company === data.company && d.branch === data.branch);
        });

        setCandidate(finaldata);
        setLoader(false);
      }
    } catch (err) {
      setLoader(false);
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchAllCandidate();
  }, []);

  const links1 = [
    { text: 'First No Response', count: 0 },
    { text: 'Second No Response', count: 0 },
    { text: 'No Response', count: 0 },
    { text: 'Not Interested', count: 0 },
    { text: 'Got Other Job', count: 0 },
    { text: 'Already Joined', count: 0 },
    { text: 'Duplicate Candidate', count: 0 },
    { text: 'Profile Not Eligible', count: 0 },
    { text: 'Selected', count: 0 },
    { text: 'Rejected', count: 0 },
    { text: 'On Hold', count: 0 },
  ];

  links1.forEach((link) => {
    link.count = candidate
      .map((item) => item.dataCount)
      .flat()
      .reduce((sum, candidate) => {
        return sum + (candidate[link.text] || 0);
      }, 0);
  });

  return (
    <>
      {isUserRoleCompare?.includes('linterviewstatus') && (
        <Grid item xs={12} md={7} sm={7}>
          <Box sx={{ ...userStyle?.homepagecontainer, padding: '16px 5px' }}>
            <Typography sx={{ fontWeight: '700', paddingLeft: '16px', paddingTop: '16px' }}>Interview Status</Typography>
            <br />
            <br />

            <Grid container spacing={2}>
              {loader ? (
                <>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                  </Grid>
                </>
              ) : (
                <>
                  {candidate?.length === 0 ? (
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '14px' }}>No Data</Typography>
                    </Grid>
                  ) : (
                    <Grid container spacing={2} sx={{ padding: '0px 20px', marginLeft: '0px' }}>
                      {links1.map((link, index) => (
                        <Grid item xs={6} md={6} lg={6} sm={6} key={index}>
                          <Grid container spacing={2}>
                            <Grid item xs={9} md={9} lg={9} sm={9}>
                              <Typography color="primary">{link.text}</Typography>
                            </Grid>

                            <Grid item xs={3} md={3} lg={3} sm={3}>
                              <Chip sx={{ height: '25px', borderRadius: '0px' }} color={'warning'} variant="outlined" label={link.count} />
                            </Grid>
                            <Grid item xs={2} md={2} lg={2} sm={2}></Grid>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </>
              )}
            </Grid>
            <Grid container sx={{ justifyContent: 'flex-end', marginTop: 'auto' }}>
              <Link to="/recruitment/interviewstatuscountreportpage" target="_blank">
                <Button variant="contained" sx={{ backgroundColor: '#ff5e65', borderRadius: '13px', textTransform: 'capitalize', fontWeight: 'bold' }} size="small">
                  View More
                </Button>
              </Link>
            </Grid>
          </Box>
        </Grid>
      )}
    </>
  );
};

export default HomeInterview;
