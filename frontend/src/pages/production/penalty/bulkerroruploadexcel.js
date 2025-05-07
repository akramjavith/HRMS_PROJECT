import React, { useState, useRef, useEffect, useContext } from "react";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
  Box,
  Typography,
  OutlinedInput,
  Dialog,
  TableBody,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Table,
  TableHead,
  Button,
} from "@mui/material";
import MessageAlert from '../../../components/MessageAlert';
import AlertDialog from '../../../components/Alert';
import { userStyle, colourStyles } from "../../../pageStyle";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import moment from "moment";
import axios from "axios";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import { useNavigate } from "react-router-dom";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import Selects from "react-select";

const ExcelSheet = () => {
  const hotElementRef = useRef(null);
  const hotInstanceRef = useRef(null);
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  const backPage = useNavigate();
  const { auth } = useContext(AuthContext);

  const [excelsid, setExcelsid] = useState("");
  const [excels, setExcels] = useState([]);

  const [projects, setProjects] = useState([]);
  const [excelupdate, setExcelsupdate] = useState({
    name: "",
    project: "",
    vendor: "",
  });
  const [excelupdateall, setExcelsupdateall] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);

  let initialvalue = projects[0]?.name;
  let initialvaluevendor = filteredVendors[0]?.value;

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };

    const [openPopup, setOpenPopup] = useState(false);
      const [popupContent, setPopupContent] = useState('');
      const [popupSeverity, setPopupSeverity] = useState('');
      const handleClickOpenPopup = () => {
          setOpenPopup(true);
      };
      const handleClosePopup = () => {
          setOpenPopup(false);
      };
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  var hh = String(today.getHours()).padStart(2, "0");
  var min = String(today.getMinutes()).padStart(2, "0");
  var ss = String(today.getSeconds()).padStart(2, "0");

  let formattedTime = hh + ":" + min;

  const [penaltyErrorUpload, setPenaltyErrorUpload] = useState({
    projectvendor: "Please Select Project Vendor",
    process: "Please Select Process",
    loginid: "Please Select Login ID",
    date: formattedDate,
  });
  const [loginIdOpt, setClientLoginIDOpt] = useState([]);
  const [processOpt, setProcessQueueArray] = useState([]);
  const [projOpt, setProjOpt] = useState([]);

  const [project, setSelectedProject] = useState({
    label: initialvalue,
    value: initialvalue,
  });

  const [vendor, setSelectedVendors] = useState({
    label: initialvaluevendor,
    value: initialvaluevendor,
  });

  const { isUserRoleAccess } = useContext(UserRoleAccessContext);


  const [time, setTime] = useState(formattedTime);
  const [date, setDate] = useState(formattedDate);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // Error Popup model
  const [isErrorOpendupe, setIsErrorOpendupe] = useState(false);
  const [showAlertdupe, setShowAlertdupe] = useState();
  const handleClickOpenerrdupe = () => {
    setIsErrorOpendupe(true);
  };
  const handleCloseerrdupe = () => {
    setIsErrorOpendupe(false);
  };

  const getProject = async () => {
    try {
      let response = await axios.get(`${SERVICE.VENDORMASTER}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const projectOpt = [
        ...response.data.vendormaster.map((t) => ({
          ...t,
          label: t.projectname + "-" + t.name,
          value: t.projectname + "-" + t.name,
        })),
      ];
      console.log(projectOpt, "projectOpt");
      setProjOpt(projectOpt);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all client user id.
  const fetchProcessQueue = async (projname) => {
    try {
      let res_freq = await axios.get(SERVICE.PRODUCTIONPROCESSQUEUEGETALL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const processFilter = res_freq?.data?.productionprocessqueue.filter(
        (item) => item.projectvendor === projname
      );
      const Que = processFilter.map((t) => ({
        label: t.processqueue,
        value: t.processqueue,
      }));
      setProcessQueueArray(Que);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  //get all client user id.
  const fetchClientUserID = async (proj) => {
    try {
      // let res_freq = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      // });
      // const filterProjBased = res_freq?.data?.clientuserid.filter((item) => item.projectvendor === proj);
      // const loginIdOpt = [
      //   ...filterProjBased.map((d) => ({
      //     ...d,
      //     label: d.userid,
      //     value: d.userid,
      //   })),
      // ];

      let res_vendor = await axios.post(
        SERVICE.CLIENT_USER_ID_VALIDATION_ERROR_ENTRY,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          role: isUserRoleAccess.role,
          project: proj,
          companyname: isUserRoleAccess.companyname,
          date: new Date().toISOString().split("T")[0],
        }
      );

      // let alluseridNames = res_vendor?.data?.clientuserid;
      let alluseridNamesadmin = res_vendor?.data?.clientuserid.map((d) => ({
        ...d,
        label: d.userid,
        value: d.userid,
      }));

      setClientLoginIDOpt(alluseridNamesadmin);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    getProject();
  }, []);

  useEffect(() => {
    const hotElement = hotElementRef.current;
    const hotInstance = new Handsontable(hotElement, {
      data: [[]],
      minRows: 17,
      minCols: 17,
      colHeaders: [],
      rowHeaders: true,
      columnSorting: true,
      filters: true,
      formulas: true,
      dropdownMenu: true,
      contextMenu: true,
      copyPaste: true,
      sorting: true,
      multiColumnSorting: true,
    });
    hotInstanceRef.current = hotInstance;

    return () => {
      hotInstance.destroy();
    };
  }, []);

  const handleSubmit = async () => {
    const updatedData = hotInstanceRef.current.getData();
    const filteredRows = updatedData.filter((row) =>
      row.some((cell) => cell !== null && cell !== "")
    );
    const filteredCols = [];

    for (let col = 0; col < updatedData[0].length; col++) {
      const columnData = filteredRows.map((row) => row[col]);
      if (columnData.some((cell) => cell !== null && cell !== "")) {
        filteredCols.push(columnData);
      }
    }



    // Proceed with saving data

    const filteredData =
      filteredCols.length > 0
        ? filteredCols[0].map((_, i) => filteredCols.map((row) => row[i]))
        : [];
    const newArray = filteredData.map((item, index) => {
      return Object.entries(item).reduce((acc, [key, value]) => {
     if (key === "0") {
          acc.errorfilename = value;
        } else if (key === "1") {
          acc.documentnumber = value;
        } else if (key === "2") {
          acc.documenttype = value;
        } else if (key === "3") {
          acc.fieldname = value;
        } else if (key === "4") {
          acc.line = value;
        } else if (key === "5") {
          acc.errorvalue = value;
        } else if (key === "6") {
          acc.correctvalue = value;
        } else if (key === "7") {
          acc.link = value;
        } else if (key === "8") {
          acc.doclink = value;
        } else {
          acc.id = parseInt(value);
        }
        return acc;
      }, {});
    });



const SelfDupeRemovedData = newArray.map((item) => ({
    ...item,
 
    projectvendor: String(penaltyErrorUpload.projectvendor),
    process: String(penaltyErrorUpload.process),
    loginid: String(penaltyErrorUpload.loginid),
    dateformatted: String(penaltyErrorUpload.date),
    errorfilename: String(item.errorfilename),
    documentnumber: String(item.documentnumber),
    documenttype: String(item.documenttype),
    fieldname: String(item.fieldname),
    line: String(item.line),
    errorvalue: String(item.errorvalue),
    correctvalue: String(item.correctvalue),
    link: String(item.link),
    doclink: String(item.doclink),

    mode: "Bulkupload",
  })).filter((item, index, self) =>
            index ===
            self.findIndex(
                (tp) =>
                  
                    tp.projectvendor == item.projectvendor &&
                    tp.process == item.process &&
                    tp.loginid == item.loginid &&
                    tp.dateformatted == item.dateformatted &&
                    tp.errorfilename == item.errorfilename &&
                    tp.documentnumber == item.documentnumber &&
                    tp.documenttype == item.documenttype &&
                    tp.fieldname == item.fieldname &&
                    tp.line == item.line &&
                    tp.errorvalue == item.errorvalue &&
                    tp.correctvalue == item.correctvalue
                    //  &&
                    // tp.link == item.link &&
                    // tp.doclink == item.doclink
            )
    );
 
    console.log(SelfDupeRemovedData, "SelfDupeRemovedData");



        let Respenalty = await axios.post(SERVICE.PENALTYERRORUPLOADS_BY_DATE , {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            projectvendor: String(penaltyErrorUpload.projectvendor),
            process: String(penaltyErrorUpload.process),
            loginid: String(penaltyErrorUpload.loginid),
            date: String(penaltyErrorUpload.date),
        });

        // const isNameMatch = targetPoints?.some((item) =>
        const isNameMatchbulkDuplicate = Respenalty.data.penaltyerroruploadpoints 

        let DupeRemovedData = SelfDupeRemovedData.filter(item =>
            !isNameMatchbulkDuplicate.some(tp => {
              const isMatch =
                tp.projectvendor === item.projectvendor &&
                tp.process === item.process &&
                tp.loginid === item.loginid &&
                tp.date === item.dateformatted &&
                tp.errorfilename === item.errorfilename &&
                tp.documentnumber === item.documentnumber &&
                tp.documenttype === item.documenttype &&
                tp.fieldname === item.fieldname &&
                tp.line === item.line &&
                tp.errorvalue === item.errorvalue &&
                tp.correctvalue === item.correctvalue 
                // &&
                // tp.link === item.link &&
                // tp.doclink === item.doclink;
          
            //   console.log('Match:', isMatch, { tp, item });
              return isMatch;
            })
          );

        
  let Res = await axios.post(SERVICE.BULKRRORUPLOADS_FETCH_BY_DATE, {
    headers: {
        Authorization: `Bearer ${auth.APIToken}`,
    },
    projectvendor: String(penaltyErrorUpload.projectvendor),
    process: String(penaltyErrorUpload.process),
    loginid: String(penaltyErrorUpload.loginid),
    date: String(penaltyErrorUpload.date),
});
let olddata = Res?.data?.penaltyerroruploadpoints;
console.log(olddata,"olddata")

let newdata = DupeRemovedData.filter(item =>
    !olddata.some(tp => {
      const isMatch =
        tp.projectvendor === item.projectvendor &&
        tp.process === item.process &&
        tp.loginid === item.loginid &&
        tp.dateformatted === item.dateformatted &&
        tp.errorfilename === item.errorfilename &&
        tp.documentnumber === item.documentnumber &&
        tp.documenttype === item.documenttype &&
        tp.fieldname === item.fieldname &&
        tp.line === item.line &&
        tp.errorvalue === item.errorvalue &&
        tp.correctvalue === item.correctvalue 
        // &&
        // tp.link === item.link &&
        // tp.doclink === item.doclink;
  
    //   console.log('Match:', isMatch, { tp, item });
      return isMatch;
    })
  );
  
  


  console.log(newdata,SelfDupeRemovedData,"newdata")




    if (penaltyErrorUpload.projectvendor === "Please Select Project Vendor") {
      setPopupContentMalert("Please Select Project Vendor");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (penaltyErrorUpload.process === "Please Select Process") {
      setPopupContentMalert("Please Select Process");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (penaltyErrorUpload.loginid === "Please Select Login ID") {
      setPopupContentMalert("Please Select Login ID");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (penaltyErrorUpload.date === "") {
      setPopupContentMalert("Please Select Date");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
     // Set the flag to true
    } else if (newArray.length <= 0) {
      setPopupContentMalert("Please Fill Excel");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    
    }
    else if (SelfDupeRemovedData.length != newdata.length && newdata.length == 0) {
        setPopupContentMalert('Duplicate Datas Removed!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
    } 
    // else if (isNameMatchPeanltyDuplicate) {
    //     setPopupContentMalert('Data Already In Penalty Error Upload!');
    //     setPopupSeverityMalert('info');
    //     handleClickOpenPopupMalert();
    // } 
  
     else{
      console.log("abc")
      if (SelfDupeRemovedData.length != newdata.length ) {
   ;
        setPopupContent('Duplicate Datas Removed!');
        setPopupSeverity('success');
        handleClickOpenPopup();
    } 

    try {
        const responses = await Promise.all(
            newdata.map(item =>
              axios.post(`${SERVICE.BULK_ERROR_UPLOADS_CREATE}`, {
                ...item,
                addedby: [
                  {
                    name: String(isUserRoleAccess.companyname),
                    date: String(new Date()),
                  },
                ],
              })
            )
          );
      setPopupContent('Added Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
 
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
 }
  };

  const handleclear = (e) => {
    e.preventDefault();
    setPenaltyErrorUpload({
      ...penaltyErrorUpload,
      projectvendor: "Please Select Project Vendor",
      process: "Please Select Process",
      loginid: "Please Select Login ID",
      date: today,
      errorfilename: "",
      documentnumber: "",
      documenttype: "",
      fieldname: "",
      line: "",
      errorvalue: "",
      correctvalue: "",
      link: "",
      doclink: "",
    });
  };

  const handleclearexcel = (e) => {
    e.preventDefault();
    hotInstanceRef.current.clear();
    setPenaltyErrorUpload({
      ...penaltyErrorUpload,
      projectvendor: "Please Select Project Vendor",
      process: "Please Select Process",
      loginid: "Please Select Login ID",
      date: today,
      errorfilename: "",
      documentnumber: "",
      documenttype: "",
      fieldname: "",
      line: "",
      errorvalue: "",
      correctvalue: "",
      link: "",
      doclink: "",
    });
  };

  return (
    <>
      <br />
      <Box sx={userStyle.excelbox}>
      
          <Grid container spacing={2}>
            <Grid item md={3} xs={12} sm={6}>
              <Typography>
                Project <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl fullWidth size="small">
                <Selects
                  maxMenuHeight={300}
                  options={projOpt}
                  value={{
                    label: penaltyErrorUpload.projectvendor,
                    value: penaltyErrorUpload.projectvendor,
                  }}
                  onChange={(e) => {
                    setPenaltyErrorUpload({
                      ...penaltyErrorUpload,
                      projectvendor: e.value,
                      process: "Please Select Process",
                      loginid: "Please Select Login ID",
                    });
                    fetchClientUserID(e.value);
                    fetchProcessQueue(e.value);
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item md={3} xs={12} sm={6}>
              <Typography>
                Vendor <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl fullWidth size="small">
                <Selects
                  maxMenuHeight={300}
                  options={processOpt}
                  value={{
                    label: penaltyErrorUpload.process,
                    value: penaltyErrorUpload.process,
                  }}
                  onChange={(e) => {
                    setPenaltyErrorUpload({
                      ...penaltyErrorUpload,
                      process: e.value,
                      loginid: "Please Select Login ID",
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <Typography>
                Login Id <b style={{ color: "red" }}>*</b>
              </Typography>
              <FormControl fullWidth size="small">
                <Selects
                  maxMenuHeight={300}
                  options={loginIdOpt}
                  value={{
                    label: penaltyErrorUpload.loginid,
                    value: penaltyErrorUpload.loginid,
                  }}
                  onChange={(e) => {
                    setPenaltyErrorUpload({
                      ...penaltyErrorUpload,
                      loginid: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Date</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="date"
                  value={penaltyErrorUpload.date}
                  onChange={(e) => {
                    setPenaltyErrorUpload({
                      ...penaltyErrorUpload,
                      date: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={2} lg={2}>
              <Button
                variant="contained"
                color="success"
                type="button"
                onClick={handleSubmit}
              >
                Submit & Clear
              </Button>
            </Grid>

            <Grid item xs={12} sm={4} md={1} lg={1}>
              <Button sx={userStyle.btncancel} onClick={handleclear}>
                Clear
              </Button>
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={2}></Grid>
            <Grid item xs={12} sm={4} md={2} lg={2}>
              <Button sx={userStyle.btncancel} onClick={handleclearexcel}>
                Clear with Excel
              </Button>
            </Grid>
            <Grid item xs={12} sm={4} md={2} lg={2}>
              <Button
                variant="contained"
                color="success"
                type="button"
                onClick={handleSubmit}
              >
                Submit & Clear
              </Button>
            </Grid>
          </Grid>
       
          <br /> <br />

          <Grid container spacing={2}>
  <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
    <Typography>
      <strong>A: Error File Name</strong>
    </Typography>
  </Grid>
  <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
    <Typography>
      <strong>B: Document Number</strong>
    </Typography>
  </Grid>
  <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
    <Typography>
      <strong>C: Document Type</strong>
    </Typography>
  </Grid>
  <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
    <Typography>
      <strong>D: Field Name</strong>
    </Typography>
  </Grid>
  <Grid item xs={12} sm={2} md={2} lg={2}>
    <Typography>
      <strong>E: Line</strong>
    </Typography>
  </Grid>
  <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
    <Typography>
      <strong>F: Error Value</strong>
    </Typography>
  </Grid>
  <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
    <Typography>
      <strong>G: Correct Value</strong>
    </Typography>
  </Grid>
  <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
    <Typography>
      <strong>H: Link</strong>
    </Typography>
  </Grid>
  <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
    <Typography>
      <strong>I: Doc Link</strong>
    </Typography>
  </Grid>
</Grid>

          <br /> <br />
          <div style={{ zIndex: "0" }} ref={hotElementRef} />
          <br /> <br />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={2} lg={2}>
              <Button
                variant="contained"
                color="success"
                type="button"
                onClick={handleSubmit}
              >
                Submit & Clear
              </Button>
            </Grid>

            <Grid item xs={12} sm={4} md={1} lg={1}>
              <Button sx={userStyle.btncancel} onClick={handleclear}>
                Clear
              </Button>
            </Grid>
            <Grid item xs={12} sm={4} md={2} lg={2}>
              <Button sx={userStyle.btncancel} onClick={handleclearexcel}>
                Clear with Excel
              </Button>
            </Grid>
            <Grid item xs={12} sm={4} md={2} lg={2}>
              <Button
                variant="contained"
                color="success"
                type="button"
                onClick={handleSubmit}
              >
                Submit & Clear
              </Button>
            </Grid>
          </Grid>
          {/* ALERT DIALOG */}
          <Box>
            <Dialog
              open={isErrorOpen}
              onClose={handleCloseerr}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              maxWidth="sm"
            >
              <DialogContent
                sx={{
                  width: "350px",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                <Typography variant="h6">{showAlert}</Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCloseerr}
                >
                  ok
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
                      <MessageAlert openPopup={openPopupMalert}
                       handleClosePopup={handleClosePopupMalert}
                        popupContent={popupContentMalert} 
                        popupSeverity={popupSeverityMalert} />
                                    <AlertDialog openPopup={openPopup} 
                                    handleClosePopup={handleClosePopup}
                                     popupContent={popupContent}
                                      popupSeverity={popupSeverity} />
                        
          
      
      </Box>
    </>
  );
};

export default ExcelSheet;
