// import { React, useState, useEffect, useContext } from "react";
// import { Typography, Grid, Box, Button, Dialog, DialogContent, DialogActions, FormControl, TextField, InputAdornment, IconButton } from "@mui/material";
// import Headtitle from "../components/Headtitle";
// import { Link } from "react-router-dom";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
// import axios from "axios";
// import { SERVICE } from "../services/Baseservice";
// import { handleApiError } from "../components/Errorhandling";
// import Logoimg from "../images/logo192.png";
// import Jobimg from "../images/joinus.jpg";
// import "../App.css";
// import { MultiSelect } from "react-multi-select-component";
// import Selects from "react-select";
// import Switch from "@mui/material/Switch";
// import SearchIcon from "@mui/icons-material/Search";
// import { styled } from "@mui/material/styles";
// import NoData from "../images/no-data-6.png";

// const JobRolesPage = () => {
//   const [jobOpening, setJobOpening] = useState([]);
//   const [jobTypeField, setJobTypeField] = useState({ jobtype: "Choose Work Type", location: "Choose Location" });
//   const [departments, setDepartments] = useState([]);
//   const [jobTypes, setJobTypes] = useState([]);
//   const [jobLocations, setLocations] = useState([]);
//   const [selectedOptionsDept, setSelectedOptionsDept] = useState([]);
//   let [valueDept, setValueDept] = useState("");
//   const [jobRemote, setJobRemote] = useState([]);
//   const [checked, setChecked] = useState(false);
//   const [hideClear, setHideClear] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isClearable, setIsClearable] = useState(false);
//   const [combinedJobOpening, setCombinedJobOpening] = useState([]);
//   const [combinedJobRemote, setCombinedJoRemote] = useState([]);
//   const [overallSettings, setOverAllsettingsCount] = useState({});
//   // alert popup
//   const [isErrorOpen, setIsErrorOpen] = useState(false);
//   const [showAlert, setShowAlert] = useState();
//   const handleClickOpenerr = () => {
//     setIsErrorOpen(true);
//   };
//   const handleCloseerr = () => {
//     setIsErrorOpen(false);
//   };

//   // const isMobile = window.innerWidth <= 960; // Set the breakpoint for mobile view
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 871);
//     };
//     handleResize(); // Call the handleResize function once to set the initial state
//     window.addEventListener("resize", handleResize); // Listen for window resize events
//     return () => {
//       window.removeEventListener("resize", handleResize); // Clean up the event listener on component unmount
//     };
//   }, []);

//   const StyledSwitch = styled(Switch)(({ theme }) => ({
//     width: 55,
//     "& .MuiSwitch-switchBase": {
//       transition: `transform 3s ${theme.transitions.easing.easeInOut} 2s`, // Adjust the transition delay (100ms in this example)
//       "&.Mui-checked": {
//         transform: "translateX(16px)",
//         color: "#fff",
//         "& + .MuiSwitch-track": {
//           backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
//           opacity: 1,
//           border: 0,
//         },
//         "&.Mui-disabled + .MuiSwitch-track": {
//           opacity: 0.5,
//         },
//       },
//       "&.Mui-focusVisible .MuiSwitch-thumb": {
//         color: "#33cf4d",
//         border: "6px solid #fff",
//       },
//     },
//     // other styles
//   }));

//   //get all project.
//   const fetchAllApproveds = async () => {
//     try {
//       let res_queue = await axios.get(SERVICE.ALLJOBOPENINGS);

//       let filterValue = res_queue?.data?.jobopenings?.filter((data, i) => {
//         return !(data.status == "closed");
//       });
//       let result = filterValue?.filter((d) => d.remotejob == false);
//       setJobOpening(result);

//       let result1 = filterValue?.filter((d) => d.remotejob == true);
//       setJobRemote(result1);

//       // Remove duplicates from departments
//       let uniqueDepartments = Array.from(new Set(filterValue.map((t) => t.department)));
//       setDepartments(
//         uniqueDepartments.map((t) => ({
//           label: t,
//           value: t,
//         }))
//       );

//       // Remove duplicates from jobtypes
//       const uniqueJobTypes = Array.from(new Set(filterValue.map((t) => t.jobtype)));
//       setJobTypes(
//         uniqueJobTypes.map((d) => ({
//           label: d,
//           value: d,
//         }))
//       );

//       // Remove duplicates from job locations and filter out entries with empty city or state
//       const uniqueJobLocation = Array.from(new Set(filterValue.map((t) => `${t.city}, ${t.state}`))).filter((location) => location.trim() !== ",");
//       const jobLocationAll = uniqueJobLocation.map((d) => ({
//         label: d,
//         value: d,
//       }));
//       setLocations(jobLocationAll);
//      } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
//   };
//   useEffect(() => {
//     fetchAllApproveds();
//   }, []);

//   // category multi select
//   const handleDepartmentChange = (options) => {
//     if (options.length > 0) {
//       setHideClear(true);
//       // setValueDept(options.map((a, index) => {
//       //   return a.department
//       // }))
//       setSelectedOptionsDept(options);
//     } else {
//       setSelectedOptionsDept([]);
//       setHideClear(false);
//     }
//   };

//   const customValueRendererDept = (valueDept, _departments) => {
//     return valueDept.length ? valueDept.map(({ label }) => label).join(", ") : <span style={{ color: "hsl(0, 0%, 20%)" }}>Choose Department</span>;
//   };

//   const handleChange = (event) => {
//     setChecked(event.target.checked);
//   };

//   const handleSearchChange = (event) => {
//     const searchTerm = event.target.value.toLowerCase();
//     setSearchQuery(searchTerm);
//   };

//   const filteredDatasJobOpening = jobOpening?.filter((item) => {
//     return searchQuery.trim() === "" || item.department.toLowerCase().includes(searchQuery) || item.recruitmentname.toLowerCase().includes(searchQuery);
//   });

//   const filteredDatasJobRemote = jobRemote?.filter((item) => {
//     return searchQuery.trim() === "" || item.department.toLowerCase().includes(searchQuery) || item.recruitmentname.toLowerCase().includes(searchQuery);
//   });

//   const handleClear = () => {
//     setHideClear(false);
//     setChecked(false);
//     setJobTypeField({ jobtype: "Choose Work Type", location: "Choose Location" });
//     setValueDept("");
//     setSelectedOptionsDept([]);
//   };

//   useEffect(() => {
//     const updatedCombinedJobOpening = Object.values(
//       filteredDatasJobOpening.reduce((acc, row) => {
//         if (!acc[row.department]) {
//           acc[row.department] = { department: row.department, data: [] };
//         }
//         acc[row.department].data.push(row);
//         return acc;
//       }, {})
//     ).map((departmentData) => {
//       if (selectedOptionsDept.length === 0 || selectedOptionsDept.some((selectedDept) => selectedDept.value === departmentData.department)) {
//         // Apply filtering for job type and location
//         departmentData.data = departmentData.data.filter((row) => {
//           const isJobTypeMatch = jobTypeField.jobtype === "Choose Work Type" || row.jobtype === jobTypeField.jobtype;
//           const isLocationMatch = jobTypeField.location === "Choose Location" || `${row.city}, ${row.state}` === jobTypeField.location;
//           return isJobTypeMatch && isLocationMatch;
//         });

//         return departmentData;
//       } else {
//         // If department doesn't match, return an empty data array
//         return { department: departmentData.department, data: [] };
//       }
//     });

//     // Filter out departments with empty data arrays
//     const filteredCombinedJobOpening = updatedCombinedJobOpening.filter((departmentData) => departmentData.data.length > 0);

//     setCombinedJobOpening(filteredCombinedJobOpening);

//     const updatedCombinedJobRemote = Object.values(
//       filteredDatasJobRemote.reduce((acc, row) => {
//         if (!acc[row.department]) {
//           acc[row.department] = { department: row.department, data: [] }; 
//         }
//         acc[row.department].data.push(row);
//         return acc;
//       }, {})
//     ).map((departmentData) => {
//       if (selectedOptionsDept.length === 0 || selectedOptionsDept.some((selectedDept) => selectedDept.value === departmentData.department)) {
//         // Apply filtering for job type and location
//         departmentData.data = departmentData.data.filter((row) => {
//           const isJobTypeMatch = jobTypeField.jobtype === "Choose Work Type" || row.jobtype === jobTypeField.jobtype;
//           const isLocationMatch = jobTypeField.location === "Choose Location" || `${row.city}, ${row.state}` === jobTypeField.location;
//           return isJobTypeMatch && isLocationMatch;
//         });

//         return departmentData;
//       } else {
//         // If department doesn't match, return an empty data array
//         return { department: departmentData.department, data: [] };
//       }
//     });

//     // Filter out departments with empty data arrays
//     const filteredCombinedJobRemote = updatedCombinedJobRemote.filter((departmentData) => departmentData.data.length > 0);

//     setCombinedJoRemote(filteredCombinedJobRemote);
//   }, [selectedOptionsDept, jobTypeField, filteredDatasJobOpening, filteredDatasJobRemote, checked]);

//   const fetchOverAllSettings = async () => {
//     try {
//         let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`);
//       setOverAllsettingsCount(res?.data?.overallsettings[0]);
//     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
//   }

// useEffect(() => {

//     fetchOverAllSettings()

// }, []);

//   const NoJobsFound = () => (
//     <Box sx={{ dispaly: "flex", justifyContent: "center" }}>
//       <Grid container spacing={1}>
//         <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
//         <Grid item lg={9} md={9} sm={9} xs={12}>
//           <Grid container spacing={1} sx={{ textAlign: "center" }}>
//             <Grid item lg={12} md={12}>
//               <img src={NoData} width="150px" />
//             </Grid>
//             <Grid item lg={12} md={12}>
//               <Typography sx={{ fontFamily: "FiraSansRegular !important", fontSize: "22px", fontWeight: "bold" }}>No jobs found</Typography>
//             </Grid>
//             <Grid item lg={12} md={12}>
//               <Typography sx={{ fontFamily: "FiraSansRegular !important", fontSize: "18px" }}>Oops, you have no jobs that match the filter conditions.</Typography>
//             </Grid>
//             <Grid item lg={12} md={12}>
//               <Typography sx={{ fontFamily: "FiraSansRegular !important", fontSize: "18px" }}>Try refining your search.</Typography>
//             </Grid>
//           </Grid>
//         </Grid>
//         <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
//       </Grid>
//       <br />
//       <br />
//     </Box>
//   );

//   return (
//     <Box sx={{ background: "white", position: "relative" }}>
//       <Headtitle title="JOB ROLES" />
//       <Box sx={{ position: "fixed", background: "white", borderBottom: "1px solid #8080801a", width: "100%", height: "65px", padding: "10px", top: "0px", left: "0px", zIndex: 1 }}>
//         <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
//           {/* <Grid item lg={1} md={1} sx={{ display: "flex", textAlign: "right", }}></Grid> */}
//           <Grid item lg={9} md={9} sm={12} xs={12} sx={{ display: "flex", textAlign: "right" }}>
//             {overallSettings?.companylogo &&
//             <img src={overallSettings?.companylogo} style={{ width: "55px", heigth: "50px" }} />
//             }
//             &ensp;
//             <Typography read sx={{ textAlign: "right", alignItems: "right", color: "black", fontFamily: "FiraSansRegular !important", fontSize: "27px", "@media only screen and (max-width: 600px) and (min-width: 200px)": { fontSize: "30px !important", justifyContent: "center", alignItems: "center" }, "@media only screen and (max-width: 150px)": { fontSize: "10px" } }}>
//               {overallSettings?.companyname}
//             </Typography>
//           </Grid>
//         </Grid>
//       </Box>
//       <br />
//       {isMobile ? (
//         <>
//           <Box>
//             <Grid container spacing={4}>
//               <Grid item sm={12} xs={12}>
//                 <Box>
//                   <Box sx={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
//                     <Typography
//                       variant="h4"
//                       sx={{
//                         margin: " auto 30px",
//                         color: "#000001 !important",
//                         fontFamily: "FiraSans !important",
//                         textAlign: "right",
//                         fontWeight: 900,
//                         fontSize: "40px",
//                         marginBottom: "10px",
//                         "@media only screen and (max-width: 600px) and (min-width: 340px)": { fontSize: "35px !important" },
//                         "@media only screen and (max-width: 150px)": { fontSize: "30px", fontWeight: 900, fontFamily: "FiraSans !important" },
//                       }}
//                     >
//                       Join Us
//                     </Typography>
//                   </Box>
//                   <Box sx={{ display: "flex", justifyContent: "center" }}>
//                     <Typography
//                       variant="subtitle2"
//                       sx={{
//                         textAlign: "center",
//                         margin: " auto 50px",
//                         color: "#000001 !important",
//                         lineHeight: "28px !important",
//                         fontFamily: "FiraSansRegular !important",
//                         fontSize: "18px !important",
//                         "@media only screen and (max-width: 1010px) and (min-width: 600px)": { fontSize: "17px !important" },
//                         "@media only screen and (max-width: 600px) and (min-width: 340px)": { fontSize: "16px !important", margin: " auto 20px" },
//                         "@media only screen and (max-width: 339px) and (min-width: 199px)": { fontSize: "15px !important", margin: " auto 20px" },
//                       }}
//                     >
//                       Accelerate your career with {overallSettings?.companyname}, that gives you the platform to do amazing things. It's more than just a job, it's an opportunity to grow.
//                     </Typography>
//                   </Box>
//                 </Box>
//               </Grid>
//               <Grid item sm={12} xs={12}>
//                 <Box sx={{ display: "flex", justifyContent: "center" }}>
//                   <img
//                     src={Jobimg}
//                     alt="leaf"
//                     style={{
//                       width: "80%",
//                       marginTop: "-30px !important",
//                       "@media only screen and (max-width: 600px) and (min-width: 340px)": { margin: "0px auto" },
//                     }}
//                   />
//                 </Box>
//               </Grid>
//             </Grid>
//           </Box>
//         </>
//       ) : (
//         <>
//           <Grid container sx={{ justifyContent: "center" }}>
//             <Grid item lg={4} md={4} sm={6} xs={6}>
//               <Box sx={{ marginLeft: "125px" }}>
//                 <Typography
//                   variant="h5"
//                   sx={{
//                     color: "#000001 !important",
//                     marginTop: "150px",
//                     fontSize: "58px",
//                     justifyContent: "center",
//                     textAlign: "left",
//                     fontWeight: 900,
//                     fontFamily: "FiraSans !important",
//                     "@media only screen and (max-width: 600px) and (min-width: 200px)": {
//                       fontSize: "28px !important",
//                       fontWeight: 900,
//                     },
//                   }}
//                 >
//                   Join Us
//                 </Typography>
//                 <br />
//                 <Box>
//                   <Typography
//                     variant="subtitle2"
//                     className="cardcntleft"
//                     sx={{
//                       color: "#000001 !important",
//                       lineHeight: "30px !important",
//                       fontFamily: "FiraSansRegular !important",
//                       fontSize: "22px !important",
//                       "@media only screen and (max-width: 1010px) and (min-width: 600px)": { fontSize: "17px !important" },
//                       "@media only screen and (max-width: 600px) and (min-width: 340px)": { fontSize: "16px !important" },
//                       "@media only screen and (max-width: 339px) and (min-width: 199px)": { fontSize: "15px !important" },
//                     }}
//                   >
//                     Accelerate your career with {overallSettings?.companyname}, that gives you the platform to do amazing things. It's more than just a job, it's an opportunity to grow.
//                   </Typography>
//                   <br />
//                 </Box>
//               </Box>
//             </Grid>
//             <Grid item lg={6} md={6} sm={6} xs={6}>
//               <Box sx={{ display: "flex", marginTop: "-50px" }}>
//                 <img src={Jobimg} width="80%" style={{ marginRight: "50px" }} alt="JOB OPENINGS" />
//               </Box>
//             </Grid>
//           </Grid>
//         </>
//       )}
//       <br />
//       <Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px", marginBottom: "10px", backgroundColor: "#8080801a" }}>
//         <Grid container spacing={2} sx={{ padding: "50px 0px" }}>
//           <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
//           <Grid item lg={9} md={9} sm={9} xs={12}>
//             <Typography variant="h4" sx={{ fontFamily: "FiraSansRegular !important", fontWeight: 600, textAlign: "center", "@media only screen and (max-width: 600px) and (min-width: 340px)": { fontSize: "22px !important" }, "@media only screen and (max-width: 340px) and (min-width: 150px)": { fontSize: "21px !important" } }}>
//               {" "}
//               Open Positions{" "}
//             </Typography>
//           </Grid>
//           <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
//           <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
//           {!checked ? (
//             <>
//               <Grid item lg={9} md={9} sm={9} xs={12}>
//                 <Grid container spacing={1}>
//                   <Grid item lg={3} md={3} sm={6} xs={12}>
//                     <FormControl fullWidth size="small">
//                       <MultiSelect size="small" options={departments} value={selectedOptionsDept} onChange={handleDepartmentChange} valueRenderer={customValueRendererDept} />
//                     </FormControl>
//                   </Grid>
//                   <Grid item lg={3} md={3} sm={6} xs={12}>
//                     <FormControl fullWidth size="small">
//                       <Selects
//                         isClearable={isClearable}
//                         options={jobTypes}
//                         value={{ label: jobTypeField.jobtype, value: jobTypeField.jobtype }}
//                         placeholder="Choose Work Type"
//                         onChange={(e) => {
//                           if (e && e.value !== undefined) {
//                             setIsClearable(true);
//                             setJobTypeField({ ...jobTypeField, jobtype: e.value });
//                             setHideClear(true);
//                           } else {
//                             setIsClearable(false);
//                             setJobTypeField({ ...jobTypeField, jobtype: "Choose Work Type" });
//                             setHideClear(false);
//                           }
//                         }}
//                       />
//                     </FormControl>
//                   </Grid>
//                   <Grid item lg={3} md={3} sm={6} xs={12}>
//                     <FormControl fullWidth size="small">
//                       <Selects
//                         isClearable={isClearable}
//                         options={jobLocations}
//                         value={{ label: jobTypeField.location, value: jobTypeField.location }}
//                         placeholder="Choose Location"
//                         onChange={(e) => {
//                           if (e && e.value !== undefined) {
//                             setIsClearable(true);
//                             setJobTypeField({ ...jobTypeField, location: e.value });
//                             setHideClear(true);
//                           } else {
//                             setIsClearable(false);
//                             setJobTypeField({ ...jobTypeField, location: "Choose Location" });
//                             setHideClear(false);
//                           }
//                         }}
//                       />
//                     </FormControl>
//                   </Grid>
//                   <Grid item lg={2} md={2} sm={6} xs={12}>
//                     <Box sx={{ display: "flex" }}>
//                       <Typography sx={{ fontFamily: "FiraSansRegular !important", fontSize: "18px", marginTop: "5px" }}>Remote Only</Typography>
//                       <Switch color="primary" label="Remote Only" checked={checked} onChange={handleChange} inputProps={{ "aria-label": "controlled" }} sx={{ transition: "width 2s" }} />
//                     </Box>
//                   </Grid>
//                   {hideClear ? (
//                     <>
//                       <Grid item lg={0.5} md={0.5} sm={6} xs={12}>
//                         <Typography
//                           sx={{
//                             marginTop: "5px",
//                             cursor: "pointer",
//                             fontSize: "18px",
//                             fontFamily: "FiraSansRegular !important",
//                             fontWeight: 600,
//                             color: "black",
//                           }}
//                           onClick={handleClear}
//                         >
//                           Clear
//                         </Typography>
//                       </Grid>
//                     </>
//                   ) : (
//                     <Grid item lg={0.5} md={0.5} sm={12} xs={12}></Grid>
//                   )}
//                 </Grid>
//               </Grid>
//             </>
//           ) : (
//             <>
//               <Grid item lg={9} md={9} sm={9} xs={12}>
//                 <Grid container spacing={1}>
//                   <Grid item lg={4.5} md={4.5} sm={6} xs={12} sx={{ transition: "width 2s" }}>
//                     <FormControl fullWidth size="small">
//                       <MultiSelect options={departments} value={selectedOptionsDept} onChange={handleDepartmentChange} valueRenderer={customValueRendererDept} />
//                     </FormControl>
//                   </Grid>
//                   <Grid item lg={4.5} md={4.5} sm={6} xs={12} sx={{ transition: "width 2s" }}>
//                     <FormControl fullWidth size="small">
//                       <Selects
//                         isClearable={isClearable}
//                         options={jobTypes}
//                         value={{ label: jobTypeField.jobtype, value: jobTypeField.jobtype }}
//                         placeholder="Choose Work Type"
//                         onChange={(e) => {
//                           if (e && e.value !== undefined) {
//                             setIsClearable(true);
//                             setJobTypeField({ ...jobTypeField, jobtype: e.value });
//                             setHideClear(true);
//                           } else {
//                             setIsClearable(false);
//                             setJobTypeField({ ...jobTypeField, jobtype: "Choose Work Type" });
//                             setHideClear(false);
//                           }
//                         }}
//                       />
//                     </FormControl>
//                   </Grid>
//                   <Grid item lg={2} md={2} sm={6} xs={12} sx={{ transition: "width 2s" }}>
//                     <Box sx={{ display: "flex" }}>
//                       <Typography sx={{ fontFamily: "FiraSansRegular !important", fontSize: "18px", marginTop: "5px" }}>Remote Only</Typography>
//                       <Switch color="primary" label="Remote Only" checked={checked} onChange={handleChange} inputProps={{ "aria-label": "controlled" }} />
//                     </Box>
//                   </Grid>
//                   <Grid item lg={1} md={1} sm={6} xs={12} sx={{ transition: "width 2s" }}>
//                     <Typography
//                       sx={{
//                         marginTop: "5px",
//                         cursor: "pointer",
//                         fontSize: "18px",
//                         fontFamily: "FiraSansRegular !important",
//                         fontWeight: 600,
//                         color: "black",
//                       }}
//                       onClick={handleClear}
//                     >
//                       Clear
//                     </Typography>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </>
//           )}
//           <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
//           <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
//           <Grid item lg={9} md={9} sm={10} xs={11.5}>
//             <TextField
//               size="small"
//               fullWidth
//               type="search"
//               sx={{ background: "white" }}
//               placeholder="Search Job Title"
//               value={searchQuery}
//               onChange={handleSearchChange}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <IconButton>
//                       <SearchIcon />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Grid>
//           <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
//         </Grid>
//         <br />
//         <br />
//         <br />
//         <br />
//         <br />
//         <br />
//       </Box>{" "}
//       <br />
//       {!checked ? (
//         <>
//           {combinedJobOpening.length > 0 ? (
//             combinedJobOpening.map((departmentData, index) => (
//               <Grid container key={index} sx={{ marginBottom: "20px" }}>
//                 <Grid item lg={1.5} md={1.5} sm={1.5} xs={12}></Grid>
//                 <Grid item lg={7.5} md={7.5} sm={7.5} xs={12} sx={{ display: "flex", textAlign: "left", marginBottom: "20px" }}>
//                   <Typography variant="h5" sx={{ color: "#00aaff", fontFamily: "FiraSansRegular !important", fontWeight: 600, fontSize: "22px !important", letterSpacing: "0.5px", "@media only screen and (max-width: 600px) and (min-width: 340px)": { fontSize: "20px !important" }, "@media only screen and (max-width: 340px) and (min-width: 150px)": { fontSize: "18px !important" } }}>
//                     <b>{departmentData.department}</b>{" "}
//                   </Typography>
//                 </Grid>
//                 <Grid item lg={1.5} md={1.5} sm={1.5} xs={12} sx={{ display: "flex", textAlign: "left", marginBottom: "20px" }}>
//                   <Box sx={{ fontFamily: "FiraSansRegular !important", textAlign: "right", float: "right", background: "#ecf0f3", padding: "7px 20px", borderRadius: "15px", fontSize: "13px", letterSpacing: "0.5px" }}>{departmentData.data.length + " " + "Open Roles"}</Box>
//                 </Grid>
//                 <Grid item lg={1.5} md={1.5} sm={1.5} xs={12}></Grid>
//                 <Grid item lg={1.5} md={1.5} sm={1.5} xs={12}></Grid>
//                 <Grid item lg={9} md={9} sm={9} xs={12}>
//                   {departmentData.data.map((row, innerIndex) => (
//                     <Grid container key={innerIndex}>
//                       <Grid item lg={12} md={12} sm={12} xs={12}>
//                         <Link to={`/career/jobdescriptions/${row.recruitmentname}/${row._id}`} style={{ color: "#000001 ", textDecoration: "none" }}>
//                           <Grid container sx={{ border: "2px solid #8080801f", borderRadius: "5px", padding: "20px", cursor: "pointer", "&:hover": { background: "#1976d20f" } }}>
//                             <Grid item lg={12} md={12} sm={12} xs={12}>
//                               <Typography variant="h5" sx={{ fontFamily: "FiraSansRegular !important", fontWeight: 900, fontSize: "22px !important", "@media only screen and (max-width: 600px) and (min-width: 340px)": { fontSize: "20px !important" }, "@media only screen and (max-width: 340px) and (min-width: 150px)": { fontSize: "18px !important" } }}>
//                                 {" "}
//                                 <b style={{ textTransform: "uppercase" }}> {row.recruitmentname} </b>{" "}
//                               </Typography>{" "}
//                               <br />
//                             </Grid>
//                             <Grid item lg={8} md={8} sm={6} xs={12}>
//                               <Typography sx={{ fontFamily: "FiraSansRegular !important", fontSize: "16px", letterSpacing: "0.5px",
//                               letterSpacing: "0.5px",
//                               overflow: 'hidden',
//                               // textOverflow: 'ellipsis',
//                               display: '-webkit-box',
//                               WebkitBoxOrient: 'vertical',
//                               wordWrap:"break-word",
//                               WebkitLineClamp: 3,  }}
//                                   dangerouslySetInnerHTML={{
//                                     __html: row.jobdescription,
//                                   }}>
//                                 {/* {overallSettings?.companydescription} */}
//                                 {/* {row?.jobdescription} */}
//                               </Typography>{" "} 
//                               <br />
//                             </Grid>
//                             <Grid item lg={1} md={1} sm={1} xs={12} sx={{ "@media only screen and (max-width: 600px) and (min-width: 200px)": { borderBottom: "2px solid #808080" } }}></Grid>
//                             <Grid item lg={3} md={3} sm={5} xs={12} sx={{ display: "flex" }}>
//                               <Typography sx={{ fontFamily: "FiraSansRegular !important", fontSize: "16px", letterSpacing: "0.5px" }}>
//                                 {row.city && row.state && <>{row.city + "," + " " + row.state}</>} <br /> Work Type: {row.jobtype}{" "}
//                               </Typography>{" "}
//                               &ensp;
//                               <ArrowForwardIosIcon sx={{ color: "#7b40a0", marginTop: "8px", marginLeft: "auto", "@media only screen and (max-width: 880px) and (min-width: 200px)": { marginRight: "0px", marginTop: "15px" } }} />
//                             </Grid>
//                           </Grid>{" "}
//                           <br />
//                         </Link>
//                       </Grid>
//                     </Grid>
//                   ))}
//                 </Grid>
//                 <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
//               </Grid>
//             ))
//           ) : (
//             <NoJobsFound />
//           )}
//         </>
//       ) : (
//         <>
//           {combinedJobRemote.length > 0 ? (
//             combinedJobRemote.map((departmentData, index) => (
//               <Grid container key={index} sx={{ marginBottom: "20px" }}>
//                 <Grid item lg={1.5} md={1.5} sm={1.5} xs={12}></Grid>
//                 <Grid item lg={7.5} md={7.5} sm={7.5} xs={12} sx={{ display: "flex", textAlign: "left", marginBottom: "20px" }}>
//                   <Typography variant="h5" sx={{ color: "#00aaff", fontFamily: "FiraSansRegular !important", fontWeight: 600, fontSize: "22px !important", letterSpacing: "0.5px", "@media only screen and (max-width: 600px) and (min-width: 340px)": { fontSize: "20px !important" }, "@media only screen and (max-width: 340px) and (min-width: 150px)": { fontSize: "18px !important" } }}>
//                     <b>{departmentData.department}</b>{" "}
//                   </Typography>
//                 </Grid>
//                 <Grid item lg={1.5} md={1.5} sm={1.5} xs={12} sx={{ display: "flex", textAlign: "left", marginBottom: "20px" }}>
//                   <Box sx={{ fontFamily: "FiraSansRegular !important", textAlign: "right", float: "right", background: "#ecf0f3", padding: "7px 20px", borderRadius: "15px", fontSize: "13px", letterSpacing: "0.5px" }}>{departmentData.data.length + " " + "Open Roles"}</Box>
//                 </Grid>
//                 <Grid item lg={1.5} md={1.5} sm={1.5} xs={12}></Grid>
//                 <Grid item lg={1.5} md={1.5} sm={1.5} xs={12}></Grid>
//                 <Grid item lg={9} md={9} sm={9} xs={12}>
//                   {departmentData.data.map((row, innerIndex) => (
//                     <Grid container key={innerIndex}>
//                       <Grid item lg={12} md={12} sm={12} xs={12}>
//                         <Link to={`/career/jobdescriptions/${row.recruitmentname}/${row._id}`} style={{ color: "#000001 ", textDecoration: "none" }}>
//                           <Grid container sx={{ border: "2px solid #8080801f", borderRadius: "5px", padding: "20px", cursor: "pointer", "&:hover": { background: "#1976d20f" } }}>
//                             <Grid item lg={12} md={12} sm={12} xs={12}>
//                               <Typography variant="h5" sx={{ fontFamily: "FiraSansRegular !important", fontWeight: 900, fontSize: "22px !important", "@media only screen and (max-width: 600px) and (min-width: 340px)": { fontSize: "20px !important" }, "@media only screen and (max-width: 340px) and (min-width: 150px)": { fontSize: "18px !important" } }}>
//                                 {" "}
//                                 <b style={{ textTransform: "uppercase" }}> {row.recruitmentname} </b>{" "}
//                               </Typography>{" "}
//                               <br />
//                             </Grid>
//                             <Grid item lg={8} md={8} sm={6} xs={12}>
//                               <Typography sx={{ fontFamily: "FiraSansRegular !important", fontSize: "16px", letterSpacing: "0.5px" }}>
//                                 {/* {overallSettings?.companydescription} */}
//                                 {row.jobdescription}
//                               </Typography>{" "}
//                               <br />
//                             </Grid>
//                             <Grid item lg={1} md={1} sm={1} xs={12} sx={{ "@media only screen and (max-width: 600px) and (min-width: 200px)": { borderBottom: "2px solid #808080" } }}></Grid>
//                             <Grid item lg={3} md={3} sm={5} xs={12} sx={{ display: "flex" }}>
//                               <Typography sx={{ fontFamily: "FiraSansRegular !important", fontSize: "16px", letterSpacing: "0.5px" }}>
//                                 {row.city && row.state && <>{row.city + "," + " " + row.state}</>}
//                                 <br /> Work Type: {row.jobtype}{" "}
//                               </Typography>{" "}
//                               &ensp;
//                               <ArrowForwardIosIcon sx={{ color: "#7b40a0", marginTop: "8px", marginLeft: "auto", "@media only screen and (max-width: 880px) and (min-width: 200px)": { marginRight: "0px", marginTop: "15px" } }} />
//                             </Grid>
//                           </Grid>{" "}
//                           <br />
//                         </Link>
//                       </Grid>
//                     </Grid>
//                   ))}
//                 </Grid>
//                 <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
//               </Grid>
//             ))
//           ) : (
//             <NoJobsFound />
//           )}
//         </>
//       )}

//       {/* ALERT DIALOG */}
//       <Box>
//         <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
//           <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
//             <Typography variant="h6">{showAlert}</Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button variant="contained" color="error" onClick={handleCloseerr}>
//               ok
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </Box>
//   );
// };

// function JobRoles() {
//   return (
//     <Box>
//       <Box sx={{ width: "100%", overflowX: "hidden" }}>
//         <Box component="main" sx={{ maxWidth: "1600px", margin: "0 auto", padding: "0px" }}>
//           <JobRolesPage />
//         </Box>
//       </Box>
//     </Box>
//   );
// }
// export default JobRoles;
import { React, useState, useEffect, useContext } from "react";
import { Typography, Grid, Box, Button, Dialog, DialogContent, DialogActions, FormControl, TextField, InputAdornment, IconButton } from "@mui/material";
import Headtitle from "../components/Headtitle";
import { Link } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import axios from "axios";
import { SERVICE } from "../services/Baseservice";
import { handleApiError } from "../components/Errorhandling";
import Logoimg from "../images/logo192.png";
import Jobimg from "../images/joinus.jpg";
import "../App.css";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import Switch from "@mui/material/Switch";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import NoData from "../images/no-data-6.png";

<style>
  @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&display=swap');
</style>


const JobRolesPage = () => {
  const [jobOpening, setJobOpening] = useState([]);
  const [jobTypeField, setJobTypeField] = useState({ jobtype: "Choose Work Type", location: "Choose Location" });
  const [departments, setDepartments] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [jobLocations, setLocations] = useState([]);
  const [selectedOptionsDept, setSelectedOptionsDept] = useState([]);
  let [valueDept, setValueDept] = useState("");
  const [jobRemote, setJobRemote] = useState([]);
  const [checked, setChecked] = useState(false);
  const [hideClear, setHideClear] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClearable, setIsClearable] = useState(false);
  const [combinedJobOpening, setCombinedJobOpening] = useState([]);
  const [combinedJobRemote, setCombinedJoRemote] = useState([]);
  const [overallSettings, setOverAllsettingsCount] = useState({});
  // alert popup
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // const isMobile = window.innerWidth <= 960; // Set the breakpoint for mobile view
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 871);
    };
    handleResize(); // Call the handleResize function once to set the initial state
    window.addEventListener("resize", handleResize); // Listen for window resize events
    return () => {
      window.removeEventListener("resize", handleResize); // Clean up the event listener on component unmount
    };
  }, []);

  const StyledSwitch = styled(Switch)(({ theme }) => ({
    width: 55,
    "& .MuiSwitch-switchBase": {
      transition: `transform 3s ${theme.transitions.easing.easeInOut} 2s`, // Adjust the transition delay (100ms in this example)
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
    },
    // other styles
  }));

  //get all project.
  const fetchAllApproveds = async () => {
    try {
      let res_queue = await axios.get(SERVICE.ALLJOBOPENINGS);

      let filterValue = res_queue?.data?.jobopenings?.filter((data, i) => {
        return !(data.status == "closed");
      });
      let result = filterValue?.filter((d) => d.remotejob == false);
      setJobOpening(result);

      let result1 = filterValue?.filter((d) => d.remotejob == true);
      setJobRemote(result1);

      // Remove duplicates from departments
      let uniqueDepartments = Array.from(new Set(filterValue.map((t) => t.department)));
      setDepartments(
        uniqueDepartments.map((t) => ({
          label: t,
          value: t,
        }))
      );

      // Remove duplicates from jobtypes
      const uniqueJobTypes = Array.from(new Set(filterValue.map((t) => t.jobtype)));
      setJobTypes(
        uniqueJobTypes.map((d) => ({
          label: d,
          value: d,
        }))
      );

      // Remove duplicates from job locations and filter out entries with empty city or state
      const uniqueJobLocation = Array.from(new Set(filterValue.map((t) => `${t.city}, ${t.state}`))).filter((location) => location.trim() !== ",");
      const jobLocationAll = uniqueJobLocation.map((d) => ({
        label: d,
        value: d,
      }));
      setLocations(jobLocationAll);
    } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
  };
  useEffect(() => {
    fetchAllApproveds();
  }, []);

  // category multi select
  const handleDepartmentChange = (options) => {
    if (options.length > 0) {
      setHideClear(true);
      // setValueDept(options.map((a, index) => {
      //   return a.department
      // }))
      setSelectedOptionsDept(options);
    } else {
      setSelectedOptionsDept([]);
      setHideClear(false);
    }
  };

  const customValueRendererDept = (valueDept, _departments) => {
    return valueDept.length ? valueDept.map(({ label }) => label).join(", ") : <span style={{ color: "hsl(0, 0%, 20%)" }}>Choose Department</span>;
  };

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchQuery(searchTerm);
  };

  const filteredDatasJobOpening = jobOpening?.filter((item) => {
    return searchQuery.trim() === "" || item.department.toLowerCase().includes(searchQuery) || item.recruitmentname.toLowerCase().includes(searchQuery);
  });

  const filteredDatasJobRemote = jobRemote?.filter((item) => {
    return searchQuery.trim() === "" || item.department.toLowerCase().includes(searchQuery) || item.recruitmentname.toLowerCase().includes(searchQuery);
  });

  const handleClear = () => {
    setHideClear(false);
    setChecked(false);
    setJobTypeField({ jobtype: "Choose Work Type", location: "Choose Location" });
    setValueDept("");
    setSelectedOptionsDept([]);
  };

  useEffect(() => {
    const updatedCombinedJobOpening = Object.values(
      filteredDatasJobOpening.reduce((acc, row) => {
        if (!acc[row.department]) {
          acc[row.department] = { department: row.department, data: [] };
        }
        acc[row.department].data.push(row);
        return acc;
      }, {})
    ).map((departmentData) => {
      if (selectedOptionsDept.length === 0 || selectedOptionsDept.some((selectedDept) => selectedDept.value === departmentData.department)) {
        // Apply filtering for job type and location
        departmentData.data = departmentData.data.filter((row) => {
          const isJobTypeMatch = jobTypeField.jobtype === "Choose Work Type" || row.jobtype === jobTypeField.jobtype;
          const isLocationMatch = jobTypeField.location === "Choose Location" || `${row.city}, ${row.state}` === jobTypeField.location;
          return isJobTypeMatch && isLocationMatch;
        });

        return departmentData;
      } else {
        // If department doesn't match, return an empty data array
        return { department: departmentData.department, data: [] };
      }
    });

    // Filter out departments with empty data arrays
    const filteredCombinedJobOpening = updatedCombinedJobOpening.filter((departmentData) => departmentData.data.length > 0);

    setCombinedJobOpening(filteredCombinedJobOpening);

    const updatedCombinedJobRemote = Object.values(
      filteredDatasJobRemote.reduce((acc, row) => {
        if (!acc[row.department]) {
          acc[row.department] = { department: row.department, data: [] };
        }
        acc[row.department].data.push(row);
        return acc;
      }, {})
    ).map((departmentData) => {
      if (selectedOptionsDept.length === 0 || selectedOptionsDept.some((selectedDept) => selectedDept.value === departmentData.department)) {
        // Apply filtering for job type and location
        departmentData.data = departmentData.data.filter((row) => {
          const isJobTypeMatch = jobTypeField.jobtype === "Choose Work Type" || row.jobtype === jobTypeField.jobtype;
          const isLocationMatch = jobTypeField.location === "Choose Location" || `${row.city}, ${row.state}` === jobTypeField.location;
          return isJobTypeMatch && isLocationMatch;
        });

        return departmentData;
      } else {
        // If department doesn't match, return an empty data array
        return { department: departmentData.department, data: [] };
      }
    });

    // Filter out departments with empty data arrays
    const filteredCombinedJobRemote = updatedCombinedJobRemote.filter((departmentData) => departmentData.data.length > 0);

    setCombinedJoRemote(filteredCombinedJobRemote);
  }, [selectedOptionsDept, jobTypeField, filteredDatasJobOpening, filteredDatasJobRemote, checked]);

  const fetchOverAllSettings = async () => {
    try {
      let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`);
      setOverAllsettingsCount(res?.data?.overallsettings[0]);

    } catch (err) {
      const messages = err?.response?.data?.message
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
            <p style={{ fontSize: '20px', fontWeight: 900 }}>{"something went wrong!"}</p>
          </>
        );
        handleClickOpenerr();
      }
    }
  }

  useEffect(() => {

    fetchOverAllSettings()

  }, []);

  const NoJobsFound = () => (
    <Box sx={{ dispaly: "flex", justifyContent: "center" }}>
      <Grid container spacing={1}>
        <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
        <Grid item lg={9} md={9} sm={9} xs={12}>
          <Grid container spacing={1} sx={{ textAlign: "center" }}>
            <Grid item lg={12} md={12}>
              <img src={NoData} width="150px" />
            </Grid>
            <Grid item lg={12} md={12}>
              <Typography sx={{ fontFamily: "'League Spartan', sans-serif !important", fontSize: "22px", fontWeight: "bold" }}>No jobs found</Typography>
            </Grid>
            <Grid item lg={12} md={12}>
              <Typography sx={{ fontFamily: "'League Spartan', sans-serif !important", fontSize: "18px" }}>Oops, you have no jobs that match the filter conditions.</Typography>
            </Grid>
            <Grid item lg={12} md={12}>
              <Typography sx={{ fontFamily: "'League Spartan', sans-serif !important", fontSize: "18px" }}>Try refining your search.</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
      </Grid>
      <br />
      <br />
    </Box>
  );

  return (
    <Box sx={{ background: "white", position: "relative" }}>
      <Headtitle title="JOB ROLES" />
      <Box sx={{ position: "fixed", background: "white", borderBottom: "1px solid #8080801a", width: "100%", height: "65px", display: "flex", justifyContent: "center", alignItems: "center", top: "0px", left: "0px", zIndex: 1 }}>
        <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
          {/* <Grid item lg={1} md={1} sx={{ display: "flex", textAlign: "right", }}></Grid> */}
          <Grid item lg={9} md={9} sm={12} xs={12} sx={{
            display: "flex", textAlign: "right",

          }}>
            {overallSettings?.companylogo &&
              <img src={overallSettings?.companylogo} alt="" style={{
                width: "200px", height: "30px", objectFit: "contain",
                // width: "fit-content", heigth: "fit-content",
                // "@media only screen and (max-width: 600px)": { width: "245px", heigth: "250px" },
                // "@media only screen and (min-width: 340px)": { width: "195px", heigth: "200px" },
                // "@media only screen and (max-width: 150px)": { width: "145px", heigth: "150px" },
              }} />
            }
            &ensp;
            <Typography read sx={{ textAlign: "right", alignItems: "right", color: "black", fontFamily: "'League Spartan', sans-serif !important", fontSize: "27px", "@media only screen and (max-width: 600px) and (min-width: 200px)": { fontSize: "30px !important", justifyContent: "center", alignItems: "center" }, "@media only screen and (max-width: 150px)": { fontSize: "10px" } }}>
              {overallSettings?.companyname}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <br />
      {isMobile ? (
        <>
          <Box>
            <Grid container spacing={4}>
              <Grid item sm={12} xs={12}>
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "center", marginTop: "100px" }}>
                    <Typography
                      variant="h4"
                      sx={{
                        margin: " auto 30px",
                        color: "#000001 !important",
                        fontFamily: "'League Spartan', sans-serif",
                        textAlign: "right",
                        fontWeight: 900,
                        fontSize: "40px",
                        marginBottom: "10px",
                        "@media only screen and (max-width: 600px) and (min-width: 340px)": { fontSize: "35px !important" },
                        "@media only screen and (max-width: 150px)": { fontSize: "30px", fontWeight: 900, fontFamily: "'League Spartan', sans-serif" },
                      }}
                    >
                      Join Us
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        textAlign: "center",
                        margin: " auto 50px",
                        color: "#000001 !important",
                        lineHeight: "28px !important",
                        fontFamily: "'League Spartan', sans-serif !important",
                        fontSize: "18px !important",
                        "@media only screen and (max-width: 1010px) and (min-width: 600px)": { fontSize: "17px !important" },
                        "@media only screen and (max-width: 600px) and (min-width: 340px)": { fontSize: "16px !important", margin: " auto 20px" },
                        "@media only screen and (max-width: 339px) and (min-width: 199px)": { fontSize: "15px !important", margin: " auto 20px" },
                      }}
                    >
                      Accelerate your career with {overallSettings?.companyname}, that gives you the platform to do amazing things. It's more than just a job, it's an opportunity to grow.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item sm={12} xs={12}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <img
                    src={overallSettings?.careerimg}
                    alt="leaf"
                    style={{
                      width: "80%",
                      marginTop: "-30px !important",
                      "@media only screen and (max-width: 600px) and (min-width: 340px)": { margin: "0px auto" },
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </>
      ) : (
        <>
          <Grid container sx={{ justifyContent: "center" }}>
            <Grid item lg={4} md={4} sm={6} xs={6}>
              <Box sx={{ marginLeft: "125px" }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#000001 !important",
                    marginTop: "150px",
                    fontSize: "58px",
                    justifyContent: "center",
                    textAlign: "left",
                    fontWeight: 900,
                    fontFamily: "'League Spartan', sans-serif !important",
                    "@media only screen and (max-width: 600px) and (min-width: 200px)": {
                      fontSize: "28px !important",
                      fontWeight: 900,
                    },
                  }}
                >
                  Join Us
                </Typography>
                <br />
                <Box>
                  <Typography
                    variant="subtitle2"
                    className="cardcntleft"
                    sx={{
                      color: "#000001 !important",
                      lineHeight: "30px !important",
                      fontFamily: "'League Spartan', sans-serif !important",
                      fontSize: "22px !important",
                      "@media only screen and (max-width: 1010px) and (min-width: 600px)": { fontSize: "17px !important" },
                      "@media only screen and (max-width: 600px) and (min-width: 340px)": { fontSize: "16px !important" },
                      "@media only screen and (max-width: 339px) and (min-width: 199px)": { fontSize: "15px !important" },
                    }}
                  >
                    Accelerate your career with {overallSettings?.companyname}, that gives you the platform to do amazing things. It's more than just a job, it's an opportunity to grow.
                  </Typography>
                  <br />
                </Box>
              </Box>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <Box sx={{ display: "flex", marginTop: "90px", justifyContent: "center", alignItems: "center" }}>
                <img src={overallSettings?.careerimg} style={{ height: "350px", width: "80%" }} alt="JOB OPENINGS" />
              </Box>
            </Grid>
          </Grid>
        </>
      )}
      <br />
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px", marginBottom: "10px", backgroundColor: "#8080801a" }}>
        <Grid container spacing={2} sx={{ padding: "50px 0px" }}>
          <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
          <Grid item lg={9} md={9} sm={9} xs={12}>
            <Typography variant="h4" sx={{ fontFamily: "'League Spartan', sans-serif !important", fontWeight: 600, textAlign: "center", "@media only screen and (max-width: 600px) and (min-width: 340px)": { fontSize: "22px !important" }, "@media only screen and (max-width: 340px) and (min-width: 150px)": { fontSize: "21px !important" } }}>
              {" "}
              Open Positions{" "}
            </Typography>
          </Grid>
          <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
          <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
          {!checked ? (
            <>
              <Grid item lg={9} md={9} sm={9} xs={12}>
                <Grid container spacing={1}>
                  <Grid item lg={3} md={3} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <MultiSelect size="small" options={departments} value={selectedOptionsDept} onChange={handleDepartmentChange} valueRenderer={customValueRendererDept} />
                    </FormControl>
                  </Grid>
                  <Grid item lg={3} md={3} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Selects
                        isClearable={isClearable}
                        options={jobTypes}
                        value={{ label: jobTypeField.jobtype, value: jobTypeField.jobtype }}
                        placeholder="Choose Work Type"
                        onChange={(e) => {
                          if (e && e.value !== undefined) {
                            setIsClearable(true);
                            setJobTypeField({ ...jobTypeField, jobtype: e.value });
                            setHideClear(true);
                          } else {
                            setIsClearable(false);
                            setJobTypeField({ ...jobTypeField, jobtype: "Choose Work Type" });
                            setHideClear(false);
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item lg={3} md={3} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Selects
                        isClearable={isClearable}
                        options={jobLocations}
                        value={{ label: jobTypeField.location, value: jobTypeField.location }}
                        placeholder="Choose Location"
                        onChange={(e) => {
                          if (e && e.value !== undefined) {
                            setIsClearable(true);
                            setJobTypeField({ ...jobTypeField, location: e.value });
                            setHideClear(true);
                          } else {
                            setIsClearable(false);
                            setJobTypeField({ ...jobTypeField, location: "Choose Location" });
                            setHideClear(false);
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item lg={2} md={2} sm={6} xs={12}>
                    <Box sx={{ display: "flex" }}>
                      <Typography sx={{ fontFamily: "'League Spartan', sans-serif !important", fontSize: "18px", marginTop: "5px" }}>Remote Only</Typography>
                      <Switch color="primary" label="Remote Only" checked={checked} onChange={handleChange} inputProps={{ "aria-label": "controlled" }} sx={{ transition: "width 2s" }} />
                    </Box>
                  </Grid>
                  {hideClear ? (
                    <>
                      <Grid item lg={0.5} md={0.5} sm={6} xs={12}>
                        <Typography
                          sx={{
                            marginTop: "5px",
                            cursor: "pointer",
                            fontSize: "18px",
                            fontFamily: "'League Spartan', sans-serif !important",
                            fontWeight: 600,
                            color: "black",
                          }}
                          onClick={handleClear}
                        >
                          Clear
                        </Typography>
                      </Grid>
                    </>
                  ) : (
                    <Grid item lg={0.5} md={0.5} sm={12} xs={12}></Grid>
                  )}
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid item lg={9} md={9} sm={9} xs={12}>
                <Grid container spacing={1}>
                  <Grid item lg={4.5} md={4.5} sm={6} xs={12} sx={{ transition: "width 2s" }}>
                    <FormControl fullWidth size="small">
                      <MultiSelect options={departments} value={selectedOptionsDept} onChange={handleDepartmentChange} valueRenderer={customValueRendererDept} />
                    </FormControl>
                  </Grid>
                  <Grid item lg={4.5} md={4.5} sm={6} xs={12} sx={{ transition: "width 2s" }}>
                    <FormControl fullWidth size="small">
                      <Selects
                        isClearable={isClearable}
                        options={jobTypes}
                        value={{ label: jobTypeField.jobtype, value: jobTypeField.jobtype }}
                        placeholder="Choose Work Type"
                        onChange={(e) => {
                          if (e && e.value !== undefined) {
                            setIsClearable(true);
                            setJobTypeField({ ...jobTypeField, jobtype: e.value });
                            setHideClear(true);
                          } else {
                            setIsClearable(false);
                            setJobTypeField({ ...jobTypeField, jobtype: "Choose Work Type" });
                            setHideClear(false);
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item lg={2} md={2} sm={6} xs={12} sx={{ transition: "width 2s" }}>
                    <Box sx={{ display: "flex" }}>
                      <Typography sx={{ fontFamily: "'League Spartan', sans-serif !important", fontSize: "18px", marginTop: "5px" }}>Remote Only</Typography>
                      <Switch color="primary" label="Remote Only" checked={checked} onChange={handleChange} inputProps={{ "aria-label": "controlled" }} />
                    </Box>
                  </Grid>
                  <Grid item lg={1} md={1} sm={6} xs={12} sx={{ transition: "width 2s" }}>
                    <Typography
                      sx={{
                        marginTop: "5px",
                        cursor: "pointer",
                        fontSize: "18px",
                        fontFamily: "'League Spartan', sans-serif !important",
                        fontWeight: 600,
                        color: "black",
                      }}
                      onClick={handleClear}
                    >
                      Clear
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
          <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
          <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
          <Grid item lg={9} md={9} sm={10} xs={11.5}>
            <TextField
              size="small"
              fullWidth
              type="search"
              sx={{ background: "white" }}
              placeholder="Search Job Title"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
        </Grid>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </Box>{" "}
      <br />
      {!checked ? (
        <>
          {combinedJobOpening.length > 0 ? (
            combinedJobOpening.map((departmentData, index) => (
              <Grid container key={index} sx={{ marginBottom: "20px" }}>
                <Grid item lg={1.5} md={1.5} sm={1.5} xs={12}></Grid>
                <Grid item lg={7.5} md={7.5} sm={7.5} xs={12} sx={{ display: "flex", textAlign: "left", marginBottom: "20px" }}>
                  <Typography variant="h5" sx={{ color: "#00aaff", fontFamily: "'League Spartan', sans-serif !important", fontWeight: 600, fontSize: "22px !important", letterSpacing: "0.5px", "@media only screen and (max-width: 600px) and (min-width: 340px)": { fontSize: "20px !important" }, "@media only screen and (max-width: 340px) and (min-width: 150px)": { fontSize: "18px !important" } }}>
                    <b>{departmentData.department}</b>{" "}
                  </Typography>
                </Grid>
                <Grid item lg={1.5} md={1.5} sm={1.5} xs={12} sx={{ display: "flex", textAlign: "left", marginBottom: "20px" }}>
                  <Box sx={{ fontFamily: "'League Spartan', sans-serif !important", textAlign: "right", float: "right", background: "#ecf0f3", padding: "7px 20px", borderRadius: "15px", fontSize: "13px", letterSpacing: "0.5px" }}>{departmentData.data.length + " " + "Open Roles"}</Box>
                </Grid>
                <Grid item lg={1.5} md={1.5} sm={1.5} xs={12}></Grid>
                <Grid item lg={1.5} md={1.5} sm={1.5} xs={12}></Grid>
                <Grid item lg={9} md={9} sm={9} xs={12}>
                  {departmentData.data.map((row, innerIndex) => (
                    <Grid container key={innerIndex}>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Link to={`/career/jobdescriptions/${row.recruitmentname}/${row._id}`} style={{ color: "#000001 ", textDecoration: "none" }}>
                          <Grid container sx={{ border: "2px solid #8080801f", borderRadius: "5px", padding: "20px", cursor: "pointer", "&:hover": { background: "#1976d20f" } }}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                              <Typography variant="h5" sx={{ fontFamily: "'League Spartan', sans-serif !important", fontWeight: 900, fontSize: "22px !important", "@media only screen and (max-width: 600px) and (min-width: 340px)": { fontSize: "20px !important" }, "@media only screen and (max-width: 340px) and (min-width: 150px)": { fontSize: "18px !important" } }}>
                                {" "}
                                <b style={{ textTransform: "uppercase" }}> {row.recruitmentname} </b>{" "}
                              </Typography>{" "}
                              <br />
                            </Grid>
                            <Grid item lg={8} md={8} sm={6} xs={12}>
                              <Typography sx={{
                                fontFamily: "'League Spartan', sans-serif !important", fontSize: "16px", letterSpacing: "0.5px",
                                letterSpacing: "0.5px",
                                overflow: 'hidden',
                                // textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                wordWrap: "break-word",
                                WebkitLineClamp: 3,
                              }}
                                dangerouslySetInnerHTML={{
                                  __html: row.jobdescription,
                                }}>
                                {/* {overallSettings?.companydescription} */}
                                {/* {row?.jobdescription} */}
                              </Typography>{" "}
                              <br />
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={12} sx={{ "@media only screen and (max-width: 600px) and (min-width: 200px)": { borderBottom: "2px solid #808080" } }}></Grid>
                            <Grid item lg={3} md={3} sm={5} xs={12} sx={{ display: "flex" }}>
                              <Typography sx={{ fontFamily: "'League Spartan', sans-serif !important", fontSize: "16px", letterSpacing: "0.5px" }}>
                                {row.city && row.state && <>{row.city + "," + " " + row.state}</>} <br /> Work Type: {row.jobtype}{" "}
                              </Typography>{" "}
                              &ensp;
                              <ArrowForwardIosIcon sx={{ color: "#7b40a0", marginTop: "8px", marginLeft: "auto", "@media only screen and (max-width: 880px) and (min-width: 200px)": { marginRight: "0px", marginTop: "15px" } }} />
                            </Grid>
                          </Grid>{" "}
                          <br />
                        </Link>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
                <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
              </Grid>
            ))
          ) : (
            <NoJobsFound />
          )}
        </>
      ) : (
        <>
          {combinedJobRemote.length > 0 ? (
            combinedJobRemote.map((departmentData, index) => (
              <Grid container key={index} sx={{ marginBottom: "20px" }}>
                <Grid item lg={1.5} md={1.5} sm={1.5} xs={12}></Grid>
                <Grid item lg={7.5} md={7.5} sm={7.5} xs={12} sx={{ display: "flex", textAlign: "left", marginBottom: "20px" }}>
                  <Typography variant="h5" sx={{ color: "#00aaff", fontFamily: "'League Spartan', sans-serif !important", fontWeight: 600, fontSize: "22px !important", letterSpacing: "0.5px", "@media only screen and (max-width: 600px) and (min-width: 340px)": { fontSize: "20px !important" }, "@media only screen and (max-width: 340px) and (min-width: 150px)": { fontSize: "18px !important" } }}>
                    <b>{departmentData.department}</b>{" "}
                  </Typography>
                </Grid>
                <Grid item lg={1.5} md={1.5} sm={1.5} xs={12} sx={{ display: "flex", textAlign: "left", marginBottom: "20px" }}>
                  <Box sx={{ fontFamily: "'League Spartan', sans-serif !important", textAlign: "right", float: "right", background: "#ecf0f3", padding: "7px 20px", borderRadius: "15px", fontSize: "13px", letterSpacing: "0.5px" }}>{departmentData.data.length + " " + "Open Roles"}</Box>
                </Grid>
                <Grid item lg={1.5} md={1.5} sm={1.5} xs={12}></Grid>
                <Grid item lg={1.5} md={1.5} sm={1.5} xs={12}></Grid>
                <Grid item lg={9} md={9} sm={9} xs={12}>
                  {departmentData.data.map((row, innerIndex) => (
                    <Grid container key={innerIndex}>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Link to={`/career/jobdescriptions/${row.recruitmentname}/${row._id}`} style={{ color: "#000001 ", textDecoration: "none" }}>
                          <Grid container sx={{ border: "2px solid #8080801f", borderRadius: "5px", padding: "20px", cursor: "pointer", "&:hover": { background: "#1976d20f" } }}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                              <Typography variant="h5" sx={{ fontFamily: "'League Spartan', sans-serif !important", fontWeight: 900, fontSize: "22px !important", "@media only screen and (max-width: 600px) and (min-width: 340px)": { fontSize: "20px !important" }, "@media only screen and (max-width: 340px) and (min-width: 150px)": { fontSize: "18px !important" } }}>
                                {" "}
                                <b style={{ textTransform: "uppercase" }}> {row.recruitmentname} </b>{" "}
                              </Typography>{" "}
                              <br />
                            </Grid>
                            <Grid item lg={8} md={8} sm={6} xs={12}>
                              <Typography sx={{ fontFamily: "'League Spartan', sans-serif !important", fontSize: "16px", letterSpacing: "0.5px" }}>
                                {/* {overallSettings?.companydescription} */}
                                {row.jobdescription}
                              </Typography>{" "}
                              <br />
                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={12} sx={{ "@media only screen and (max-width: 600px) and (min-width: 200px)": { borderBottom: "2px solid #808080" } }}></Grid>
                            <Grid item lg={3} md={3} sm={5} xs={12} sx={{ display: "flex" }}>
                              <Typography sx={{ fontFamily: "'League Spartan', sans-serif !important", fontSize: "16px", letterSpacing: "0.5px" }}>
                                {row.city && row.state && <>{row.city + "," + " " + row.state}</>}
                                <br /> Work Type: {row.jobtype}{" "}
                              </Typography>{" "}
                              &ensp;
                              <ArrowForwardIosIcon sx={{ color: "#7b40a0", marginTop: "8px", marginLeft: "auto", "@media only screen and (max-width: 880px) and (min-width: 200px)": { marginRight: "0px", marginTop: "15px" } }} />
                            </Grid>
                          </Grid>{" "}
                          <br />
                        </Link>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
                <Grid item lg={1.5} md={1.5} sm={1.5}></Grid>
              </Grid>
            ))
          ) : (
            <NoJobsFound />
          )}
        </>
      )}

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

function JobRoles() {
  return (
    <Box>
      <Box sx={{ width: "100%", overflowX: "hidden" }}>
        <Box component="main" sx={{ maxWidth: "1600px", margin: "0 auto", padding: "0px" }}>
          <JobRolesPage />
        </Box>
      </Box>
    </Box>
  );
}
export default JobRoles;