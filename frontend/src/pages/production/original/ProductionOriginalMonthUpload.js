import { useState, useEffect, useContext } from "react";
import Selects from "react-select";
import { Typography, FormControl, Grid, Box, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle.js";
import LoadingButton from "@mui/lab/LoadingButton";
import { Link } from "react-router-dom";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";

const FileUpload = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + "-" + mm + "-" + dd;

  //yeardropdown
  const years = [];
  for (let year = yyyy; year >= 1977; year--) {
    years.push({ value: year, label: year.toString() });
  }
  //month dropdown options
  const months = [
    { value: "January", label: "January", numval: 1 },
    { value: "February", label: "February", numval: 2 },
    { value: "March", label: "March", numval: 3 },
    { value: "April", label: "April", numval: 4 },
    { value: "May", label: "May", numval: 5 },
    { value: "June", label: "June", numval: 6 },
    { value: "July", label: "July", numval: 7 },
    { value: "August", label: "August", numval: 8 },
    { value: "September", label: "September", numval: 9 },
    { value: "October", label: "October", numval: 10 },
    { value: "November", label: "November", numval: 11 },
    { value: "December", label: "December", numval: 12 },
  ];
  const [files, setFiles] = useState(null);
  const [productionoriginal, setProductionoriginal] = useState({
    vendor: "Please Select Vendor",
    fromdate: "",
    todate: "",
    month: "",
    year: "",
  });
  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [vendors, setVendors] = useState([]);

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState("");
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = async (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsErrorOpen(false);
  };

  //get all Sub vendormasters.
  const fetchVendors = async () => {
    try {
      const [res_vendor, RES_CATE, RES_PROD_CATE, RES_ORG_FLAGCALC] = await Promise.all([
        axios.get(SERVICE.VENDORMASTER, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);

      let vendorall = res_vendor?.data?.vendormaster.map((d) => ({
        ...d,
        label: d.projectname + "-" + d.name,
        value: d.projectname + "-" + d.name,
      }));
      setVendors(vendorall);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [status, setStatus] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    failed: 0,
  });
  const handleYearChange = (e) => {
    setProductionoriginal({
      ...productionoriginal,
      year: e.value,
    });
  };

  const handleMonthChange = (e) => {
    setProductionoriginal({
      ...productionoriginal,
      month: e.value,
    });
  };
  const [uploadLoading, setUploadLoading] = useState(false);
  // Upload Files
  const handleUpload = async () => {
    try {
      if (!files) return alert("Please select files");
      setUploadLoading(true);
      const lastindex = await axios.get(SERVICE.PRODUCTION_MONTH_ORGINAL_UNIQID, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let findlastId = lastindex.data.productionmonthoriginal;
      const uniqueid = findlastId ? Number(findlastId) + 1 : 1;

      const formData = new FormData();
      formData.append("addedby", JSON.stringify([{ name: isUserRoleAccess.companyname, date: new Date() }]));
      formData.append("vendor", productionoriginal.vendor); // Example extra field
      formData.append("month", productionoriginal.month); // Example extra field
      formData.append("year", productionoriginal.year); // Example extra field
      formData.append("uniqueid", uniqueid); // Example extra field
      // formData.append("customField2", 12345); // Example extra field
      Array.from(files).forEach((file) => formData.append("files", file));

      const res = await fetch(SERVICE.MONTH_UPLOAD_EXCEL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setUploadLoading(false);
      alert(data.message);
    } catch (Err) {
      console.log(Err, "err");
    }
  };

  // Poll Job Status
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(SERVICE.GET_JOBSTATUS);
      const data = await res.json();
      setStatus(data);
    }, 3000); // Fetch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <>
      <Headtitle title={"Production Month Upload"} />
      <PageHeading title=" Production Month Upload" modulename="Production" submodulename="Upload" mainpagename="Original" subpagename="Production Month Upload" subsubpagename="" />
      {/* ****** Header Content ****** */}
      {/* <Typography sx={userStyle.HeaderText}>Production Month Upload</Typography> */}
      {isUserRoleCompare?.includes("aproductionmonthupload") && (
        <>
          <Box sx={userStyle.dialogbox}>
            <Grid container>
              <Grid item md={8} xs={12} sm={6}>
                <Typography sx={userStyle.importheadtext}>Manage Production Month Upload</Typography>
              </Grid>
              <Grid item md={4} sm={12} xs={12} sx={{ display: "flex", justifyContent: "end" }}>
                <Link to="/production/productionmonthupload">
                  <Button variant="contained" style={{ padding: "7px 14px", borderRadius: "4px" }}>
                    Go to List
                  </Button>
                </Link>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Vendor<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    options={vendors}
                    value={{
                      label: productionoriginal.vendor,
                      value: productionoriginal.vendor,
                    }}
                    onChange={(e) => {
                      setProductionoriginal({
                        ...productionoriginal,
                        vendor: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Month <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects options={productionoriginal.year === "Select Year" ? [] : months} value={{ label: productionoriginal.month, value: productionoriginal.month }} onChange={handleMonthChange} />
                </FormControl>
              </Grid>
              <Grid item md={2} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Year<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects options={years} value={{ label: productionoriginal.year, value: productionoriginal.year }} onChange={handleYearChange} />
                </FormControl>
              </Grid>
            </Grid>
            <br />
            <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
            <LoadingButton variant="contained" size="small" loading={uploadLoading} onClick={handleUpload}>
              Upload
            </LoadingButton>
            <br />
            <h2>Processing Status</h2>
            <p>Pending: {status.pending}</p>
            <p>In Progress: {status.inProgress}</p>
            <p>Completed: {status.completed}</p>
            <p>Failed: {status.failed}</p>
          </Box>
        </>
      )}
    </>
  );
};

export default FileUpload;