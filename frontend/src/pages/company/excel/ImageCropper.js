import React, { useState, useRef, useEffect, useContext } from 'react';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Box, Typography, OutlinedInput, Dialog, TableBody, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, Button } from "@mui/material";
import { userStyle, colourStyles } from "../../../pageStyle";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import moment from 'moment';
import axios from 'axios';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { useNavigate } from 'react-router-dom';
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext';
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
  const [excelupdate, setExcelsupdate] = useState({ name: "", project: "", vendor: "" });
  const [excelupdateall, setExcelsupdateall] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);

  let initialvalue = projects[0]?.name;
  let initialvaluevendor = filteredVendors[0]?.value;

  const [project, setSelectedProject] = useState({ label: initialvalue, value: initialvalue });

  const [vendor, setSelectedVendors] = useState({ label: initialvaluevendor, value: initialvaluevendor });

  const { isUserRoleAccess } = useContext(UserRoleAccessContext);
  let today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  let formattedDate = yyyy + "-" + mm + "-" + dd;

  var hh = String(today.getHours()).padStart(2, "0");
  var min = String(today.getMinutes()).padStart(2, "0");
  var ss = String(today.getSeconds()).padStart(2, "0");

  let formattedTime = hh + ":" + min;

  const [time, setTime] = useState(formattedTime);
  const [date, setDate] = useState(formattedDate);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // Error Popup model
  const [isErrorOpendupe, setIsErrorOpendupe] = useState(false);
  const [showAlertdupe, setShowAlertdupe] = useState()
  const handleClickOpenerrdupe = () => {
    setIsErrorOpendupe(true);
  };
  const handleCloseerrdupe = () => {
    setIsErrorOpendupe(false);
  };

  useEffect(() => {
    fetchExcel();
  }, [])


  const fetchExcel = async () => {
    try {
      let res = await axios.get(SERVICE.EXCELFILTERED, {

      });
      setExcelsid(res?.data?.excelsid)
      setExcels(res?.data?.excels)
      setExcelsupdate(res?.data?.excelsupdateby)
      setExcelsupdateall(res?.data?.excelsupdatebyall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }

  const fetchProjectDropdowns = async () => {
    try {
      let res_project = await axios.get(SERVICE.PROJECTMASTER, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        }
      });
      setSelectedProject({ label: res_project?.data?.projmaster[0]?.name, value: res_project?.data?.projmaster[0]?.name })

      const projall = res_project?.data?.projmaster.map((d) => (
        {
          ...d,
          label: d.name,
          value: d.name
        }
      ));
      setProjects(projall);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };


  //get all Sub vendormasters.
  const fetchVendor = async () => {
    try {
      let res = await axios.post(SERVICE.FILTEREDVENDOREXCELUPLOAD, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        project: String(project ? project.value : initialvalue),
      });

      if (projects[0]?.name === project.value) {
        setSelectedVendors({ label: res?.data?.filteredvendors[0]?.name, value: res?.data?.filteredvendors[0]?.name });

      } else {
        setSelectedVendors("");
      }

      const projall = res?.data?.filteredvendors.map((d) => (
        {
          ...d,
          label: d.name,
          value: d.name
        }
      ));
      setFilteredVendors(projall)
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }


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
    }
  }, []);


  const handleSubmit = async () => {
    const updatedData = hotInstanceRef.current.getData();
    const filteredRows = updatedData.filter(row => row.some(cell => cell !== null && cell !== ''));
    const filteredCols = [];

    for (let col = 0; col < updatedData[0].length; col++) {
      const columnData = filteredRows.map(row => row[col]);
      if (columnData.some(cell => cell !== null && cell !== '')) {
        filteredCols.push(columnData);
      }
    }

    let showAlert = false; // Flag to check if any required field is empty

    // Proceed with saving data

    const filteredData = filteredCols.length > 0 ? filteredCols[0].map((_, i) => filteredCols.map(row => row[i])) : [];
    const newArray = filteredData.map((item, index) => {
      return Object.entries(item).reduce((acc, [key, value]) => {
        if (key === "1") {
          acc.customer = value;
        } else if (key === "2") {
          acc.process = value;
        } else if (key === "0") {
          acc.priority = value;
        } else if (key === "3") {
          acc.count = value;
        } else if (key === "4") {
          acc.tat = value;
        } else if (key === "5") {
          acc.created = value;
        } else if (key === "6") {
          acc.hyperlink = value;
        }
        else {
          acc.id = parseInt(value);
        }
        return acc;
      }, {});
    });


    if (project.value === "" || project.value === undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Project Name"}
          </p>
        </>
      );
      handleClickOpenerr();
      showAlert = true; // Set the flag to true
    }

    else if (vendor === "" || vendor === "Please Select Vendor" || vendor.value === undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Vendor Name"}
          </p>
        </>
      );
      handleClickOpenerr();
      showAlert = true; // Set the flag to true
    }

    else if (date === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Date"}
          </p>
        </>
      );
      handleClickOpenerr();
      showAlert = true; // Set the flag to true
    }

    else if (time === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Time"}
          </p>
        </>
      );
      handleClickOpenerr();
      showAlert = true; // Set the flag to true
    }
    else if (newArray.length <= 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Fill Excel"}
          </p>
        </>
      );
      handleClickOpenerr();
      showAlert = true; // Set the flag to true
    }
    if (showAlert) {
      return; // Exit early if any required field is empty
    }
    let projectvalue = project.value;
    let vendorvalue = vendor.value;

    const newdata = newArray.map(item => ({
      ...item,
      project: projectvalue,
      vendor: vendorvalue,
      date,
      time
    }));

    try {
      let branches = await axios.post(`${SERVICE.EXCEL_CREATE}`, {
        exceldata: newdata, // Removed unnecessary parentheses
        updatedby: [
          {
            name: String(isUserRoleAccess.companyname),
            project: String(project.value),
            vendor: String(vendor.value),
            date: String(new Date()),
          },
        ],
      });
      backPage('/todo');
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const handleSubmitUpdate = async () => {

    const updatedData = hotInstanceRef.current.getData();
    const filteredRows = updatedData.filter(row => row.some(cell => cell !== null && cell !== ''));
    const filteredCols = [];

    for (let col = 0; col < updatedData[0].length; col++) {
      const columnData = filteredRows.map(row => row[col]);
      if (columnData.some(cell => cell !== null && cell !== '')) {
        filteredCols.push(columnData);
      }
    }

    // Proceed with saving data

    const filteredData = filteredCols.length > 0 ? filteredCols[0].map((_, i) => filteredCols.map(row => row[i])) : [];

    const newArray = filteredData.map((item, index) => {
      return Object.entries(item).reduce((acc, [key, value]) => {
        if (key === "1") {
          acc.customer = value;
        } else if (key === "2") {
          acc.process = value;
        } else if (key === "0") {
          acc.priority = value;
        } else if (key === "3") {
          acc.count = value;
        } else if (key === "4") {
          acc.tat = value;
        } else if (key === "5") {
          acc.created = value;
        } else if (key === "6") {
          acc.hyperlink = value;
        }

        else {
          acc.id = parseInt(value);
        }
        return acc;
      }, {});
    });

    const dupe = newArray.filter((item1) =>
      excels.some((item2) =>
        item1.customer === item2.customer && item1.process === item2.process
      )
    );

    const nondupe = newArray.filter((item1) =>
      !excels.some((item2) =>
        item1.customer === item2.customer && item1.process === item2.process
      )
    );


    let showAlert = false;

    if (project.value === "" || project.value === undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Project Name"}
          </p>
        </>
      );
      handleClickOpenerr();
      showAlert = true;
    }

    else if (vendor.value === "" || vendor.value === "Please Select Vendor" || vendor.value === undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Vendor Name"}
          </p>
        </>
      );
      handleClickOpenerr();
      showAlert = true;
    }

    else if (date === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Date"}
          </p>
        </>
      );
      handleClickOpenerr();
      showAlert = true;
    }

    else if (time === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Time"}
          </p>
        </>
      );
      handleClickOpenerr();
      showAlert = true;
    }
    else if (newArray.length <= 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Fill Excel"}
          </p>
        </>
      );
      handleClickOpenerr();
      showAlert = true;
    }
    else if (dupe.length > 0) {
      setShowAlertdupe(
        <>
          <p style={{ fontSize: "20px", fontWeight: 900 }}> Duplicate Entry</p>

          <Table>
            <TableHead>
              <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
              <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Customer"}</StyledTableCell>
              <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Process"}</StyledTableCell>
            </TableHead>
            <TableBody>
              {dupe?.map((item, i) => (
                <StyledTableRow>
                  <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                  <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.customer}</StyledTableCell>
                  <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.process}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          Already Added
        </>
      );
      handleClickOpenerrdupe();
      showAlert = true;
    }

    if (showAlert) {
      return; // Exit early if any required field is empty
    }

    let projectvalueupdate = project.value
    let vendorvalueupdate = vendor.value

    const newdata = newArray.map(item => ({
      ...item,
      project: projectvalueupdate,
      vendor: vendorvalueupdate,
      date,
      time,
    }));


    let all = [...excels, ...newdata]

    if (newdata.length > 0) {
      try {
        let branches = await axios.put(`${SERVICE.EXCEL_SINGLE}/${excelsid}`, {
          exceldata: [...all], // Removed unnecessary parentheses
          updatedby: [
            ...excelupdateall,
            {
              name: String(isUserRoleAccess.companyname),
              project: String(project.value),
              vendor: String(vendor.value),
              date: String(new Date()),
            },
          ],
        });
        backPage('/todo');
      } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    } else {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"No data to Upload"}
          </p>
        </>
      );
      handleClickOpenerr();
    }

  };


  const handleSubmitUpdatedupe = async () => {

    const updatedData = hotInstanceRef.current.getData();
    const filteredRows = updatedData.filter(row => row.some(cell => cell !== null && cell !== ''));
    const filteredCols = [];

    for (let col = 0; col < updatedData[0].length; col++) {
      const columnData = filteredRows.map(row => row[col]);
      if (columnData.some(cell => cell !== null && cell !== '')) {
        filteredCols.push(columnData);
      }
    }

    let showAlert = false; // Flag to check if any required field is empty

    // Proceed with saving data

    const filteredData = filteredCols.length > 0 ? filteredCols[0].map((_, i) => filteredCols.map(row => row[i])) : [];
    const newArray = filteredData.map((item, index) => {
      return Object.entries(item).reduce((acc, [key, value]) => {
        if (key === "1") {
          acc.customer = value;
        } else if (key === "2") {
          acc.process = value;
        } else if (key === "0") {
          acc.priority = value;
        } else if (key === "3") {
          acc.count = value;
        } else if (key === "4") {
          acc.tat = value;
        } else if (key === "5") {
          acc.created = value;
        } else if (key === "6") {
          acc.hyperlink = value;
        }

        else {
          acc.id = parseInt(value);
        }
        return acc;
      }, {});
    });

    const dupe = newArray.filter((item1) =>
      excels.some((item2) =>
        item1.customer === item2.customer && item1.process === item2.process
      )
    );


    const nondupe = newArray.filter((item1) =>
      !excels.some((item2) =>
        item1.customer === item2.customer && item1.process === item2.process
      )
    );

    if (project.value === "" || project.value === undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Project Name"}
          </p>
        </>
      );
      handleClickOpenerr();
      showAlert = true; // Set the flag to true
    }

    else if (vendor.value === "" || vendor.value == "Please Select Vendor" || vendor.value === undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Vendor Name"}
          </p>
        </>
      );
      handleClickOpenerr();
      showAlert = true; // Set the flag to true
    }

    else if (date === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Date"}
          </p>
        </>
      );
      handleClickOpenerr();
      showAlert = true; // Set the flag to true
    }

    else if (time === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Choose Time"}
          </p>
        </>
      );
      handleClickOpenerr();
      showAlert = true; // Set the flag to true
    }
    else if (newArray.length <= 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Fill Excel"}
          </p>
        </>
      );
      handleClickOpenerr();
      showAlert = true; // Set the flag to true
    }

    if (showAlert) {
      return; // Exit early if any required field is empty
    }

    let projectdupe = project.value
    let vendordupe = vendor.value

    const newdata = nondupe.map(item => ({
      ...item,
      project: projectdupe,
      vendor: vendordupe,
      date,
      time
    }));


    let all = [...excels, ...newdata]

    if (newdata.length > 0) {
      try {
        let branches = await axios.put(`${SERVICE.EXCEL_SINGLE}/${excelsid}`, {
          exceldata: all, // Removed unnecessary parentheses
          updatedby: [
            ...excelupdateall,
            {
              name: String(isUserRoleAccess.companyname),
              project: String(project.value),
              vendor: String(vendor.value),
              date: String(new Date()),
            },
          ],
        });
        backPage('/todo');
      } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    } else {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"No data to Upload"}
          </p>
        </>
      );
      handleClickOpenerr();
    }
  };


  const handleclear = (e) => {
    e.preventDefault();
    setSelectedVendors(" ");
    setSelectedProject("");
    setFilteredVendors([]);
    setDate(formattedDate);
    setTime(formattedTime);
  }

  const handleclearexcel = (e) => {
    e.preventDefault();
    hotInstanceRef.current.clear();
    setSelectedProject("");
    setSelectedVendors(" ");
    setFilteredVendors([]);
    setDate(formattedDate);
    setTime(formattedTime);
  }

  // Handle project change
  const handleProjectChange = (newProject) => {
    setSelectedProject({ label: newProject, value: newProject });
    setSelectedVendors("Please Select Vendor");
  };

  const handleVendorChange = (newVendor) => {
    setSelectedVendors({ label: newVendor, value: newVendor });
  };


  useEffect(() => {
    fetchVendor();
  }, [project])

  useEffect(() => {
    fetchProjectDropdowns();
  }, [initialvalue]);


  return (
    <>
    {isUserRoleCompare?.includes("lqueueprioritiesdataupload")
                && (
                  <>
                  <Typography style={{ textAlign: 'right', justifyContent: 'right', marginTop: '-34px' }}>
        <span style={{ fontWeight: 'bold' }}>
          Last Updated: Project:{excelupdate?.project},Vendor:{excelupdate?.vendor},Name:{excelupdate?.name},Date:{moment(excelupdate?.date).format('DD/MM/YYYY hh.mma')}
        </span>
      </Typography>
      <br />
      <Box sx={userStyle.excelbox}>
        <div>
          <Grid container spacing={2}>
            <Grid item md={3} xs={12} sm={6}>
              <Typography>Project <b style={{ color: "red" }}>*</b></Typography>
              <FormControl size="small" fullWidth sx={{ zIndex: '1' }}>
                <Selects
                  options={projects}
                  styles={colourStyles}
                  // value={{ label: project, value: project }}
                  value={project}
                  onChange={(e) => handleProjectChange(e.value)}
                />
              </FormControl>
            </Grid>

            <Grid item md={3} xs={12} sm={6}>
              <Typography>Vendor <b style={{ color: "red" }}>*</b></Typography>
              <FormControl size="small" fullWidth sx={{ zIndex: '1' }}>
                <Selects
                  options={filteredVendors}
                  styles={colourStyles}
                  value={vendor}
                  onChange={(e) => handleVendorChange(e.value)}
                // value={{ label: vendor, value: vendor }}
                // onChange={(e) => setSelectedVendors(e.value)}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Date</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="date"
                  // placeholder=""
                  // value={date}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Typography>Time</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="time"
                  // placeholder=""
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <br />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={2} lg={2}>
              <Button variant="contained" color="success" type="button"
                onClick={handleSubmit}>Submit & Clear</Button>
            </Grid>
            <Grid item xs={12} sm={4} md={2} lg={2}>
              <Button variant="contained" color="primary" type="button"
                onClick={handleSubmitUpdate}
              >Add to Existing</Button>
            </Grid>
            <Grid item xs={12} sm={4} md={1} lg={1}>
              <Button sx={userStyle.btncancel}
                onClick={handleclear}>Clear</Button>
            </Grid>
            <Grid item xs={12} sm={4} md={2} lg={2}>
              <Button sx={userStyle.btncancel}
                onClick={handleclearexcel}
              >
                Clear with Excel</Button>
            </Grid>
            <Grid item xs={12} sm={4} md={2} lg={2}>
              <Button variant="contained" color="success" type="button"
                onClick={handleSubmit}>Submit & Clear</Button>
            </Grid>
            <Grid item xs={12} sm={4} md={2} lg={2}>
              <Button variant="contained" color="primary" type="button"
                onClick={handleSubmitUpdate}
              >Add to Existing</Button>
            </Grid>
          </Grid>

          <br />   <br />
          <div style={{ zIndex: '0' }} ref={hotElementRef} />
          <br />   <br />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={2} lg={2}>
              <Button variant="contained" color="success" type="button"
                onClick={handleSubmit}>Submit & Clear</Button>
            </Grid>
            <Grid item xs={12} sm={4} md={2} lg={2}>
              <Button variant="contained" color="primary" type="button"
                onClick={handleSubmitUpdate}
              >Add to Existing</Button>
            </Grid>
            <Grid item xs={12} sm={4} md={1} lg={1}>
              <Button sx={userStyle.btncancel}
                onClick={handleclear}>Clear</Button>
            </Grid>
            <Grid item xs={12} sm={4} md={2} lg={2}>
              <Button sx={userStyle.btncancel}
                onClick={handleclearexcel}
              >
                Clear with Excel</Button>
            </Grid>
            <Grid item xs={12} sm={4} md={2} lg={2}>
              <Button variant="contained" color="success" type="button"
                onClick={handleSubmit}>Submit & Clear</Button>
            </Grid>
            <Grid item xs={12} sm={4} md={2} lg={2}>
              <Button variant="contained" color="primary" type="button"
                onClick={handleSubmitUpdate}
              >Add to Existing</Button>
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
              <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                <Typography variant="h6" >{showAlert}</Typography>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
              </DialogActions>
            </Dialog>
          </Box>

          {/* ALERT DIALOG */}
          <Box>
            <Dialog
              open={isErrorOpendupe}
              onClose={handleCloseerrdupe}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              maxWidth="sm"
              fullWidth={true}
            >
              <DialogContent sx={{ textAlign: 'center', alignItems: 'center' }}>
                <Typography variant="h6" >{showAlertdupe}</Typography>
              </DialogContent>
              <DialogActions>
                <Button variant="contained" color="primary" onClick={handleSubmitUpdatedupe}>Upload Without Duplicate</Button>
                <Button sx={userStyle.btncancel} onClick={handleCloseerrdupe}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </Box>

        </div>
      </Box>
      </>
                )}
    </>
  );
};

export default ExcelSheet;