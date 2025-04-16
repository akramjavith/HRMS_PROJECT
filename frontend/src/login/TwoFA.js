import React, { useContext, useState } from "react";
import { Grid, Button, FormControl, OutlinedInput, Box, Dialog, DialogContent, Typography, DialogActions } from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import axios from "axios";
import { AUTH } from "../services/Authservice";
import { AuthContext, UserRoleAccessContext } from "../context/Appcontext";
import {handleApiError} from "../components/Errorhandling";
import { useNavigate } from "react-router-dom";
import { SERVICE } from "../services/Baseservice";

const TwoFA = () => {
  var today = new Date();
  var todayDate = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;
  var todayDateFormat = `${dd}/${mm}/${yyyy}`;

  // Get yesterday's date
  var yesterday = new Date(todayDate);
  yesterday.setDate(todayDate.getDate() - 1);
  var ddp = String(yesterday.getDate()).padStart(2, "0");
  var mmp = String(yesterday.getMonth() + 1).padStart(2, "0"); // January is 0!
  var yyyyp = yesterday.getFullYear();

  var yesterdayDate = yyyyp + "-" + mmp + "-" + ddp;
  var yesterdayDateFormat = `${ddp}/${mmp}/${yyyyp}`;
 
  const backPage = useNavigate();
  const { auth, setAuth, setQrImage, qrImage } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);

  const { setIsUserRoleAccess,
    setIsUserRoleCompare,
    setalltaskLimit,
    setAllprojects,
    setallTasks,
    setIsAssignBranch,
    setallUsersLimit,
    setAllUsersData,
    setAllCompany,
    setAllBranch,
    setAllLocation,
    setAllArea,
    setAllFloor,
    setAllAreagrouping,
    setAllUnit,
    setAllTeam,setAllLocationgrouping,setAllDepartment,setAllDesignation,} = useContext(UserRoleAccessContext);
  const [otp, setOtp] = useState();
  const [islogin, setislogin] = useState();
  const [signin, setSignin] = useState({ username: "", password: "" });
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const handleSubmit = () => {
    if (!otp) {
      setShowAlert(
        <>
          {" "}
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}> {"Please Enter 2FA Otp"}</p>{" "}
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }

  };
  const fetchAllAssignBranch = async (name , code) => {
    try {

      let res = await axios.post(SERVICE.GETUSERASSIGNBRANCH, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        empcode: code,
        empname: name
      });

     
      const ansswer = res?.data?.assignbranch.map((data, index)=>{
        return {tocompany:data.company, tobranch:data.branch, tounit:data.unit,companycode:data.companycode,
          branchcode:data.branchcode, branchemail:data.branchemail,branchaddress:data.branchaddress, branchstate:data.branchstate,
          branchcity:data.branchcity,branchcountry:data.branchcountry, branchpincode:data.branchpincode, unitcode:data.unitcode,
          employee:data.employee, employeecode:data.employeecode,company:data.fromcompany,branch:data.frombranch,
          unit:data.fromunit, _id:data._id
        }
      });
      return ansswer?.length > 0 ? ansswer : [];
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const isCurrentTimeInShift = async (shifts) => {
    if (shifts) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentInMinutes = currentHour * 60 + currentMinute;

      for (let shift of shifts) {
        if (shift.shift === "Week Off") {
          continue;
        }
        const [startTime, endTime] = shift?.shift?.split("to");

        // Function to convert time string to hour and minute
        const parseTime = (time) => {
          let [hours, minutes] = time
            ?.match(/(\d+):(\d+)(AM|PM)/)
            ?.slice(1, 3)
            ?.map(Number);
          const period = time.slice(-2);
          if (period === "PM" && hours !== 12) hours += 12;
          if (period === "AM" && hours === 12) hours = 0;
          return { hours, minutes };
        };

        const start = parseTime(startTime);
        const end = parseTime(endTime);

        // Check if the shift starts in PM and ends in AM
        if (start.hours >= 12 && end.hours < 12) {
          // Calculate the end time in minutes
          const endInMinutes = end.hours * 60 + end.minutes;

          // Check if current time falls within 12:00 AM to end time
          if (currentInMinutes < endInMinutes) {
            return true;
          }
        }
      }
      return false;
    } else {
      return false;
    }
  };

  const sendRequest = async () => {
    try {
      const response = await axios.post(`${AUTH.VERIFYTWOFA}`, {
        id: String(qrImage?.result?._id),
        otp: String(otp),
      });
      if (response?.data?.success) {
        localStorage.setItem("APIToken", response?.data?.token);
        localStorage.setItem("LoginUserId", response?.data?.user?._id);
        localStorage.setItem("LoginUserrole", response?.data?.user?.role);
        localStorage.setItem("LoginUsercode", response?.data?.user?.empcode);

        const userId = response?.data?.user?._id;
        const userrole = response?.data?.user?.role;
        const userempcode = response?.data?.user?.empcode;
        let startMonthDate = new Date(yesterdayDate);
        let endMonthDate = new Date(today);
        const daysArray = [];
        while (startMonthDate <= endMonthDate) {
          const formattedDate = `${String(startMonthDate.getDate()).padStart(
            2,
            "0"
          )}/${String(startMonthDate.getMonth() + 1).padStart(
            2,
            "0"
          )}/${startMonthDate.getFullYear()}`;
          const dayName = startMonthDate.toLocaleDateString("en-US", {
            weekday: "long",
          });
          const dayCount = startMonthDate.getDate();
          const shiftMode = "Main Shift";

          daysArray.push({ formattedDate, dayName, dayCount, shiftMode });

          // Move to the next day
          startMonthDate.setDate(startMonthDate.getDate() + 1);
        }
        const [
          loginuserdata, 
          userroles,
          documents,
          loginusershift, 
          allcompany, 
          allbranch, 
          allunit, 
          ]= await Promise.all([
          axios.get(`${AUTH.GETUSER}/${userId}`),
          axios.post(AUTH.GETAUTHROLE, {
            userrole: userrole,
          }),
          axios.post(AUTH.GETDOCUMENTS, {
            commonid: userId,
          }),
          axios.post(SERVICE.USER_CLOCKIN_CLOCKOUT_STATUS_LOGIN, {
            userDates: daysArray,
            empcode: userempcode,
          }),
          axios.get(SERVICE.COMPANY),
          axios.get(SERVICE.BRANCH),
          axios.get(SERVICE.UNIT),
        ]);

        const yesrtedayShifts = loginusershift?.data?.finaluser?.filter(
          (data) => data?.formattedDate === yesterdayDateFormat
        );
        const todayShifts = loginusershift?.data?.finaluser?.filter(
          (data) => data?.formattedDate === todayDateFormat
        );

        const isInYesterdayShift = await isCurrentTimeInShift(
          yesrtedayShifts?.length > 0
            ? [yesrtedayShifts[yesrtedayShifts?.length - 1]]
            : []
        );

        const finalShift = isInYesterdayShift ? yesrtedayShifts : todayShifts;

        const mainshifttimespl =
          finalShift[0]?.shift != "Week Off"
            ? finalShift[0]?.shift?.split("to")
            : "";
        const secondshifttimespl =
          finalShift?.length > 1 ? finalShift[1]?.shift?.split("to") : "";
        const userassign = await fetchAllAssignBranch(
          loginuserdata?.data?.suser?.companyname,
          loginuserdata?.data?.suser?.empcode
        );
        let managerassign = [];
         await allcompany?.data?.companies.forEach(comp => {
          allbranch?.data?.branch
            .filter(br => br.company === comp.name)
            .forEach(br => {
              allunit?.data?.units
                .filter(un => un.branch === br.name)
                .forEach(un => {
                  managerassign.push({
                    company: comp.name,
                    companycode: comp.code,
                    branch: br.name,
                    branchcode: br.code,
                    branchemail: br.email,
                    branchaddress: br.address,
                    branchstate: br.state,
                    branchcity: br.city,
                    branchcountry: br.country,
                    branchpincode: br.pincode,
                    unit: un.name,
                    unitcode: un.code
                  });
                });
            });
        });
                
        
        const answer = loginuserdata?.data?.suser?.role?.includes("Manager") ? managerassign : userassign;
        if (documents && documents.data) {
          setIsUserRoleAccess({
            ...loginuserdata?.data?.suser,
            files: documents?.data?.semployeedocument?.files,
            profileimage: documents?.data?.semployeedocument?.profileimage,
            loginusershift:loginusershift?.data?.finaluser,
            userdayshift: finalShift,
            mainshiftname: "",
            mainshifttiming: mainshifttimespl[0] + "-" + mainshifttimespl[1],
            issecondshift: finalShift?.length > 1 ? true : false,
            secondshiftmode:
              finalShift?.length > 1
                ? mainshifttimespl[1] === secondshifttimespl[0]
                  ? "Continuous Shift"
                  : "Double Shift"
                : "",
            secondshiftname: "",
            secondshifttiming:
              finalShift?.length > 1
                ? secondshifttimespl[0] + "-" + secondshifttimespl[1]
                : "",
            accessbranch: answer,
          });
          setIsAssignBranch(answer);
        } else {
          setIsUserRoleAccess({
            ...loginuserdata?.data?.suser,
            files: [],
            profileimage: "",
            userdayshift: finalShift,
            loginusershift:loginusershift?.data?.finaluser,
            mainshiftname: "",
            mainshifttiming: mainshifttimespl[0] + "-" + mainshifttimespl[1],
            issecondshift: finalShift?.length > 1 ? true : false,
            secondshiftmode:
              finalShift?.length > 1
                ? mainshifttimespl[1] === secondshifttimespl[0]
                  ? "Continuous Shift"
                  : "Double Shift"
                : "",
            secondshiftname: "",
            secondshifttiming:
              finalShift?.length > 1
                ? secondshifttimespl[0] + "-" + secondshifttimespl[1]
                : "",
            accessbranch: answer,
          });
          setIsAssignBranch(answer);
        }
       
        setIsUserRoleCompare(userroles?.data?.result);

        // Change login state
        setAuth({
          ...auth,
          loginState: true,
          APIToken: response.data.token,
          loginuserid: userId,
          loginuserrole: userrole,
          loginusercode: userempcode,
        });

        setislogin(true);
        backPage("/dashboard");
        setSignin(response);
        const [
          allusersdata, 
          allteam,
          allfloor,
          allarea,
          allareagrouping,
          alllocation,
          alllocationgrouping,
          alldepartment,
          alldesignation]= await Promise.all([
          axios.get(SERVICE.ALLUSERSDATA),
          axios.get(SERVICE.TEAMS),
          axios.get(SERVICE.FLOOR),
          axios.get(SERVICE.AREAS),
          axios.get(SERVICE.AREAGROUPING),
          axios.get(SERVICE.LOCATION),
          axios.get(SERVICE.LOCATIONGROUPING),
          axios.get(SERVICE.DEPARTMENT),
          axios.get(SERVICE.DESIGNATION),
        ]);
        setAllUsersData(allusersdata?.data?.usersstatus);
        setAllCompany(allcompany?.data?.companies);
        setAllBranch(allbranch?.data?.branch);
        setAllUnit(allunit?.data?.units);
        setAllTeam(allteam?.data?.teamsdetails);
        setAllFloor(allfloor?.data?.floors);
        setAllArea(allarea?.data?.areas);
        setAllAreagrouping(allareagrouping?.data?.areagroupings);
        setAllLocation(alllocation?.data?.locationdetails);
        setAllLocationgrouping(alllocationgrouping?.data?.locationgroupings);
        setAllDepartment(alldepartment?.data?.departmentdetails);
        setAllDesignation(alldesignation?.data?.designation);


        // Perform remaining API requests asynchronously
        axios.get(AUTH.PROJECTLIMIT).then((response) => setAllprojects(response.data.projects));
        // .catch(err);

        axios.get(AUTH.ALLUSERLIMIT).then((response) => setallUsersLimit(response.data.users));
        // .catch(err);

        axios.get(AUTH.ALLTASKS).then((response) => setallTasks(response.data.task));
        // .catch(err);

        axios
          .post(AUTH.TASKSLIMIT, {
            userrole: String(userroles.data.result[0].accesss),
            userid: String(userId),
          })
          .then((response) => setalltaskLimit(response.data.taskfilter));
      }
    } catch (err) {
      const messages = err?.response?.data?.message;
      if (messages) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
          </>
        );
        handleClickOpenerr();
      } else {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}> {"something went wrong!"} </p>
          </>
        );
        handleClickOpenerr();
      }
    }
  };
  return (
    <>
      <Grid container justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
        <Grid item>
          <FormControl variant="outlined" fullWidth sx={{ maxWidth: "100%" }}>
            <img src={qrImage?.image} alt="Your Image" width="150" height="150" />
            <br />
            <OutlinedInput
              placeholder="Please Enter 2FA Otp"
              sx={{ paddingRight: "8px" }}
              id="outlined-adornment-weight"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
              }}
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
            />
            <br />
            <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
              Verify
            </Button>
          </FormControl>
        </Grid>
      </Grid>
      {/* alert dialog */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6" style={{ fontSize: "20px", fontWeight: 900 }}>
              {" "}
              {showAlert}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" style={{ padding: "7px 13px", color: "white", background: "rgb(25, 118, 210)" }} onClick={handleCloseerr}>
              {" "}
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default TwoFA;
