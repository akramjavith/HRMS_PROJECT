import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Dialog, TableCell, Select, MenuItem, TableRow, DialogContent, TableBody, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { ExportXL, ExportCSV } from "../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import { SERVICE } from "../../services/Baseservice";
import StyledDataGrid from "../../components/TableStyle";
import { handleApiError } from "../../components/Errorhandling";
import Selects from "react-select";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Country, State, City } from "country-state-city";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import momentTimeZone from "moment-timezone";
import moment from "moment";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';
import Resizable from 'react-resizable';
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';

function BankDetailsVerification() {
  //const [company, setCompany] = useState({ code: "", name: "" });
  const { isUserRoleAccess,allCompany,allBranch,allUnit,allTeam } = useContext(UserRoleAccessContext);
  const username = isUserRoleAccess.username;
  const [bankUsers, setBankusers] = useState([]);
  //const [allCompanyedit, setAllCompanyedit] = useState([]);
  const [areatid, setAreatid] = useState({});
  const [areaviewid, setAreaviewid] = useState({});
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [roles,setRoles] = useState([]);

  //for button color

  const [color,setColor] = useState();

  // Country city state datas for original user
  const [selectedCountryp, setSelectedCountryp] = useState();
  const [selectedStatep, setSelectedStatep] = useState();
  const [selectedCityp, setSelectedCityp] = useState();

  // Country city state datas for single user
  const [selectedCountryp1, setSelectedCountryp1] = useState();
  const [selectedStatep1, setSelectedStatep1] = useState();
  const [selectedCityp1, setSelectedCityp1] = useState();

  // for getting user id with respect to pick add address button
  const [singleUser,setSingleUser]=useState({});
  /*let dateUpdatedlength = singleUser.updatedby.length;
  let dateUpdated = singleUser.updatedby[dateUpdatedlength-1].date;*/

const setReminderFalse = async () => {
    try {
      let res = await axios.put(`${SERVICE.BANKDETAILS_SINGLE}/${userId}`,{reminder:false}, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },})
      } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
}

  const [employeeDetails,setEmployeeDetails]=useState({
    empName:isUserRoleAccess.username,
    empCode:isUserRoleAccess.empcode,
    empPhone:isUserRoleAccess.emergencyno,
    empDoj:isUserRoleAccess.doj,
    empAge:"",
    empAgeSuffix:"",
    empDot:"",
    empDoor:isUserRoleAccess.cdoorno,
    empStreet:isUserRoleAccess.cstreet,
    empArea:isUserRoleAccess.carea,
    empLandmark:isUserRoleAccess.clandmark,
    empTaluk:isUserRoleAccess.ctaluk,
    empPost:isUserRoleAccess.cpost,
    empPincode:isUserRoleAccess.cpincode,
    empCountry:selectedCountryp,
    empState:selectedStatep,
    empCity:selectedCityp
  })


  //isaddressupdated status
  const [isaddressupdated,setIsAddressUpdated] = useState();


  // for adding address with exists

  /*const [addressDetails,setAddressDetails] =useState({
    employeeName:employeeDetails.empName,
    employeeCode:employeeDetails.empCode,
    employeePhone:employeeDetails.empPhone,
    employeeDoor:isUserRoleAccess.pdoorno,
    employeeStreet:isUserRoleAccess.pstreet,
    employeeArea:isUserRoleAccess.parea,
    employeeLandmark:isUserRoleAccess.plandmark,
    employeeTaluk:isUserRoleAccess.ptaluk,
    employeePost:isUserRoleAccess.ppost,
    employeePincode:isUserRoleAccess.ppincode,
    employeeCountry:selectedCountryp,
    employeeState:selectedStatep,
    employeeCity:selectedCityp
  })*/

  //adding date with dot
  const handleAddingDate = (e) =>{
    setEmployeeDetails({ ...employeeDetails, empAgeSuffix: e.target.value });
  }

  //for dot change on primary entry page
  useEffect(()=>{
    if(employeeDetails.empAge !== "" && employeeDetails.empAgeSuffix === "Days"){
      const date = moment(employeeDetails.empDoj);
      const finalDate=date.add(employeeDetails.empAge,"days")
      const formattedDate = finalDate.format("YYYY-MM-DD");
      setEmployeeDetails({...employeeDetails,empDot:formattedDate})
    } else if (employeeDetails.empAge !== "" && employeeDetails.empAgeSuffix === "Month"){
      const date = moment(employeeDetails.empDoj);
      const finalDate=date.add(employeeDetails.empAge,"months")
      const formattedDate = finalDate.format("YYYY-MM-DD");
      setEmployeeDetails({...employeeDetails,empDot:formattedDate})
    }else if (employeeDetails.empAge !== "" && employeeDetails.empAgeSuffix === "Year"){
      const date = moment(employeeDetails.empDoj);
      const finalDate=date.add(employeeDetails.empAge,"years")
      const formattedDate = finalDate.format("YYYY-MM-DD");
      setEmployeeDetails({...employeeDetails,empDot:formattedDate})
    } else {
      setEmployeeDetails({...employeeDetails})
    }
  },[employeeDetails.empAgeSuffix,employeeDetails.empAge])

  //for dot change on edit page on the table
  useEffect(()=>{
    if(areatid.noofdays !== "" && areatid.time === "Days"){
      const date = moment(areatid.doj);
      const finalDate=date.add(areatid.noofdays,"days")
      const formattedDate = finalDate.format("YYYY-MM-DD");
      setAreatid({...areatid,dot:formattedDate})
    } else if (areatid.noofdays !== "" && areatid.time === "Month"){
      const date = moment(areatid.doj);
      const finalDate=date.add(areatid.noofdays,"months")
      const formattedDate = finalDate.format("YYYY-MM-DD");
      setAreatid({...areatid,dot:formattedDate})
    }else if (areatid.noofdays !== "" && areatid.time === "Year"){
      const date = moment(areatid.doj);
      const finalDate=date.add(areatid.noofdays,"years")
      const formattedDate = finalDate.format("YYYY-MM-DD");
      setAreatid({...areatid,dot:formattedDate})
    } else {
      setAreatid({...areatid})
    }
  },[areatid.time,areatid.noofdays])

  // for main form
  const handlechangereferencecontactno = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value?.slice(0, 10);
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setEmployeeDetails({ ...employeeDetails, empPhone: inputValue });
    }
  };

   // for edit form
   const handlechangeeditreferencecontactno = (e) => {
    // Regular expression to match only positive numeric values
    const regex = /^[0-9]+$/; // Only allows positive integers
    // const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value?.slice(0, 10);
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setAreatid({...areatid,phone:inputValue})
    }
  };

  //handle date of joining

  const handleDateChange = (e)=>{
    const doj=e.target.value;
    setEmployeeDetails({...employeeDetails,empDoj:doj})
  }

  //handle aging of employee

  const handleAgeOfEmployee = (e) => {
    // const regex = /^[0-9]+$/;  // Only allows positive integers
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    // Check if the input value matches the regex or if it's empty (allowing backspace)
    if (regex.test(inputValue) || inputValue === "") {
      // Update the state with the valid numeric value
      setEmployeeDetails({...employeeDetails,empAge:inputValue});
    }
  };

  // SELECT DROPDOWN STYLES
  const colourStyles = {
    menuList: (styles) => ({
      ...styles,
      background: "white",
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      // color:'black',
      color: isFocused ? "rgb(255 255 255, 0.5)" : isSelected ? "white" : "black",
      background: isFocused ? "rgb(25 118 210, 0.7)" : isSelected ? "rgb(25 118 210, 0.5)" : null,
      zIndex: 1,
    }),
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'Bankdetails.png');
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { auth } = useContext(AuthContext);
  const [ovProj, setOvProj] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  const [isCompany, setIsCompany] = useState(false);

  // Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };

  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };
  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };
  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //update address details
  const [isUpdateAddressOpen,setIsUpdateAddressOpen]=useState(false);
  const handleClickUpdateAddressOpenEdit = () => {
    setIsUpdateAddressOpen(true)
  }
  const handleClickUpdateAddressCloseEdit = () =>{
    setIsUpdateAddressOpen(false)
    getSingleUserCredentials()
  }

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  const[overallDeletelength, setOveralldeletelength] =useState([]);

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = async() => {

    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      let res = await axios.post(`${SERVICE.COMPANY_OVERALLDELETE}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                id:selectedRows
            });

            setOveralldeletelength(res.data?.final);
            if(res.data?.filteredArray.length > 0){
              setColor("error")
              setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "100px", color: "orange" }}
                  />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"These datas is linked in branch page, the remaining datas will be deleted with confirmation "}
                  </p>
                </>
              );
              handleClickOpenerr();
            }
            if(res.data?.final.length > 0){
              setIsDeleteOpencheckbox(true);
            }
            else{
              
            }

     
    }

  };
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("")
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // Styles for the resizable column
  const ResizableColumn = styled(Resizable)`
    .react-resizable-handle {
    width: 10px;
    height: 100%;
    position: absolute;
    right: 0;
    bottom: 0;
    cursor: col-resize;
    }
    `;

  const getRowClassName = (params) => {
    if ((selectedRows).includes(params.row.id)) {
      return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns 
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    empname: true,
    empcode: true,
    phone: true,
    doj: true,
    noofdays:true,
    time:true,
    dot:true,
    actions: true,
    //isaddressupdated:true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  //get single row and to edit address....
  const addAdress = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.BANKDETAILS_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let res2 = await axios.get(`${SERVICE.USER_SINGLE}/${isUserRoleAccess._id}`);
      fetchBranch();
      setAreatid(res.data.suser);
      setIsAddressUpdated(res.data.suser.isaddressupdated)
      setEmployeeDetails({...employeeDetails,empPhone:res.data.suser.phone})
      setSingleUser(res.data.suser);
      const selectedCountry = Country.getAllCountries().find((country) => country.name === res2.data.suser.ccountry);
      setSelectedCountryp(selectedCountry);

      const selectedState = State.getStatesOfCountry(selectedCountry?.isoCode).find((state) => state.name === res2.data.suser.cstate);
      setSelectedStatep(selectedState);

      const selectedCity = City.getCitiesOfState(selectedState?.countryCode, selectedState?.isoCode).find((city) => city.name === res2.data.suser.ccity);
      setSelectedCityp(selectedCity);
      setOvProj(res?.data?.suser?.name);
      getOverallEditSection(res?.data?.suser?.empname);
      handleClickUpdateAddressOpenEdit();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };




  //get single row to edit....
  const getCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.BANKDETAILS_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      fetchBranch();
      setAreatid(res.data.suser);
      setOvProj(res?.data?.suser?.name);
      getOverallEditSection(res?.data?.suser?.name);
      handleClickOpenEdit();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // get single row to edit....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.BANKDETAILS_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAreaviewid(res?.data?.suser);
      handleClickOpenview();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.BANKDETAILS_SINGLE}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAreatid(res?.data?.suser);
      handleClickOpeninfo();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // get all branches
  const fetchBranch = async () => {
    try {
      if(isUserRoleAccess.role.includes("Manager") || isUserRoleAccess.role.includes("Manager")) {
        let res_branch = await axios.get(SERVICE.GETALLBANKVERIFICATIONUSERS, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setIsCompany(true);
        setBankusers(res_branch?.data?.allBankVerificationUsers);
      }else {
        let res_branch = await axios.get(`${SERVICE.GETSINGLEUSERDETAILSUSINGEMPIDARR}/${isUserRoleAccess.empcode}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
        setIsCompany(true);
        setBankusers(res_branch?.data?.suser);
      }
    } catch (err) {setIsCompany(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  };


  const [deletebranch, setDeletebranch] = useState({});

  //  PDF
  const columns = [
    { title: "Sno", field: "serialNumber" },
    { title: "Emp Name", field: "empname" },
    { title: "Emp Code", field: "empcode" },
    { title: "Phone", field: "phone" },
    { title: "Date of join", field: "doj" },
    { title: "Duration", field: "noofdays" },
    { title: "Period", field: "time" },
    { title: "DOT", field: "dot" },

  ];
  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      theme: "grid",
      columns: columns.map((col) => ({ ...col, dataKey: col.field })),
      body:rowDataTable,
    });
    doc.save("Personal Details.pdf");
  };

  // Excel
  const fileName = "Personal Details";
  const [branchData, setBranchData] = useState([]);


  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //set function to get particular row on delete
  const [checkBranch, setCheckBranch] = useState();
  const [checkUser, setCheckUser] = useState();

  //set function to get particular row
  const rowData = async (id, name) => {
    try {
      let res = await axios.get(`${SERVICE.BANKDETAILS_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDeletebranch(res?.data?.suser);
      let resdev = await axios.post(SERVICE.BRANCHNAMECHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkbranch: String(name),
      });
      setCheckBranch(resdev?.data?.branch);
      let resuser = await axios.post(SERVICE.USERCHECK, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        checkuser: String(name),
      });
      setCheckUser(resuser?.data?.users);

      if ((resdev?.data?.branch).length > 0 || (resuser?.data?.users).length > 0) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // Alert delete popup
  let branchid = deletebranch._id;
  const delBankDetails = async () => {
    try {
      await axios.delete(`${SERVICE.BANKDETAILS_SINGLE}/${branchid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchBranch();
      setSelectedRows([]);
      setPage(1);
      handleCloseMod();
      setColor("success")
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };


  const delBankDetailsCheckbox = async () => {
    try {
      

      const deletePromises = overallDeletelength?.map((item) => {
        return axios.delete(`${SERVICE.BANKDETAILS_SINGLE}/${item}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);
      await fetchBranch();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };


  //print...
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Bankusers details",
    pageStyle: "print",
  });

  //submit primary data into db

  const handleSubmit = (e) => {
    e.preventDefault();
    if (employeeDetails.empName === "" || employeeDetails.empName === undefined ) {
      setColor("error")
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Employee Name"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (employeeDetails.empCode === "" || employeeDetails.empCode === undefined) {
      setColor("error")
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Employee Code"}</p>
        </>
      );
      handleClickOpenerr();
    } /*else if (isNameMatch) {
      // setShowAlert("Name already exits!");
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Name already exits!"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (isCodeMatch) {
      // setShowAlert("Name already exits!");
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Name already exits!"}</p>
        </>
      );
      handleClickOpenerr();
    }*/ 
    else if (employeeDetails.empPhone === "" || employeeDetails.empPhone === undefined) {
      setColor("error")
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Phone number"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (employeeDetails.empPhone.length!==10) {
      setColor("error")
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Phone number with 10 digit"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (employeeDetails.empAge === "" || employeeDetails.empAge === undefined) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Duration"}</p>
        </>
      );
      handleClickOpenerr();
    }else if (employeeDetails.empAgeSuffix === "" || employeeDetails.empAgeSuffix === undefined) {
      setColor("error")
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Period"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      sendRequest();
    }
  };

  const sendRequest = async () => {
    try {
      let bankUsers = await axios.post(SERVICE.POSTSINGLEBANKVERIFICATIONUSER, {
        empname: String(employeeDetails.empName),
        empcode: String(employeeDetails.empCode),
        phone:String(employeeDetails.empPhone),
        doj:String(employeeDetails.empDoj),
        dot:String(employeeDetails.empDot),
        noofdays:String(employeeDetails.empAge),
        time:String(employeeDetails.empAgeSuffix),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setReminderFalse();
      await fetchBranch();
      //setCompany(bankUsers.data);
      setEmployeeDetails({ ...employeeDetails,empPhone: "",empAge:"",empAgeSuffix:"",empDot:"" });
      setColor("success")
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //Add address popup update button
  const addressEditSubmit = (e) => {
    e.preventDefault();
    if (employeeDetails.empDoor === "") {
      setColor("error")
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Door number"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (employeeDetails.empArea === "") {
      setColor("error")
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Area details"}</p>
        </>
      );
      handleClickOpenerr();
    }else if (employeeDetails.empStreet=== "") {
      setColor("error")
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Street name"}</p>
        </>
      );
      handleClickOpenerr();
    }else if (employeeDetails.empLandmark=== "") {
      setColor("error")
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Land mark details"}</p>
        </>
      );
      handleClickOpenerr();
    }else if (employeeDetails.empTaluk=== "") {
      setColor("error")
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Taluk details"}</p>
        </>
      );
      handleClickOpenerr();
    }else if (employeeDetails.empPost=== "") {
      setColor("error")
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Post name"}</p>
        </>
      );
      handleClickOpenerr();
    }else if (employeeDetails.empPincode=== "") {
      setColor("error")
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter pincode details"}</p>
        </>
      );
      handleClickOpenerr();
    }
     else {
      sendAddressEditRequest();
    }
  };

  //for update address to the db function when clicking the update button on the address edit popup
  let addressupdateby = singleUser.updatedby;
  let addressaddedby = singleUser.addedby;

  let userId = singleUser._id;
  const sendAddressEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.BANKDETAILS_SINGLE}/${userId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        doorno: String(employeeDetails.empDoor),
        street: String(employeeDetails.empStreet),
        area:String(employeeDetails.empArea),
        landmark:String(employeeDetails.empLandmark),
        taluk:String(employeeDetails.empTaluk),
        post:String(employeeDetails.empPost),
        pincode:String(employeeDetails.empPincode),
        country:String(singleUser.isaddressupdated?selectedCountryp1.name:selectedCountryp.name),
        state:String(singleUser.isaddressupdated?selectedStatep1.name:selectedStatep.name),
        city:String(singleUser.isaddressupdated?selectedCityp1.name:selectedCityp.name),
        isaddressupdated:true,
        updatedby: [
          ...addressupdateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      getSingleUserCredentials();
      await fetchBranch();
      setAreatid(res.data);
      await getOverallEditSectionUpdate();
      handleCloseModEdit();
      setIsUpdateAddressOpen(false)
      setColor("success")
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //clear function for primary inputs

  const handleClear = (e) => {
    e.preventDefault();
    setEmployeeDetails({...employeeDetails, empPhone: "", empAge: "",empAgeSuffix:"",empDot:"" });
    setColor("success")
    setShowAlert(
      <>
        <CheckCircleOutlineIcon
          sx={{ fontSize: "100px", color: "green" }}
        />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();

  }

  //floor updateby edit page...
  let updateby = areatid.updatedby;
  let addedby = areatid.addedby;

  let userid = areatid._id;

  //editing the single data...
  const sendEditRequest = async () => {
    try {
      let res = await axios.put(`${SERVICE.BANKDETAILS_SINGLE}/${userid}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        phone: String(areatid.phone),
        noofdays: String(areatid.noofdays),
        time:String(areatid.time),
        dot:String(areatid.dot),
        updatedby: [
          ...updateby,
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setReminderFalse();
      await fetchBranch();
      setAreatid(res.data);
      await getOverallEditSectionUpdate();
      handleCloseModEdit();
      setColor("success")
      setShowAlert(
        <>
          <CheckCircleOutlineIcon
            sx={{ fontSize: "100px", color: "green" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //edited data summission into the database
  const editSubmit = (e) => {
    e.preventDefault();
   
    if (areatid.phone === "") {
      setColor("error")
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Phone number"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (areatid.noofdays === "") {
      setColor("error")
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Duration"}</p>
        </>
      );
      handleClickOpenerr();
    }else if (areatid.phone.length < 10) {
      setColor("error")
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Phone number with 10 digits"}</p>
        </>
      );
      handleClickOpenerr();
    } /*else if (isCodeMatch) {
      // setShowAlert("Name already exits!");
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Code already exits!"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      // setShowAlert("Name already exits!");
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Name already exits!"}</p>
        </>
      );
      handleClickOpenerr();
    } else if (areatid.name != ovProj && ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    }*/ else {
      sendEditRequest();
    }
  };

  //overall edit section for all pages
  const getOverallEditSection = async (e) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
      });
      setOvProjCount(res?.data?.count);
      setGetOverallCount(`The ${e} is linked in ${res?.data?.users?.length > 0 ? "Add Employee ," : ""}
         ${res?.data?.branch?.length > 0 ? "Branch ," : ""}
         ${res?.data?.hierarchy?.length > 0 ? "Hierarchy ," : ""}
          whether you want to do changes ..??`);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.OVERALL_COMPANY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
      });
      sendEditRequestOverall(res?.data?.users, res?.data?.branch, res?.data?.hierarchy);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const sendEditRequestOverall = async (user, branch, hierarchy) => {
    try {
      if (user.length > 0) {
        let answ = user.map((d, i) => {
          let res = axios.put(`${SERVICE.USER_SINGLE_PWD}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            company: String(areatid.name),
          });
        });
      }
      if (branch.length > 0) {
        let answ = branch.map((d, i) => {
          let res = axios.put(`${SERVICE.BRANCH_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            company: String(areatid.name),
          });
        });
      }
      if (hierarchy.length > 0) {
        let answ = hierarchy.map((d, i) => {
          let res = axios.put(`${SERVICE.HIRERARCHI_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            company: String(areatid.name),
          });
        });
      }
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const getSingleUserCredentials = async () =>{
    let res = await axios.get(`${SERVICE.GETSINGLEUSERDETAILSUSINGEMPID}/${isUserRoleAccess.empcode}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      }
  })
  setSingleUser((prevuser)=>({...prevuser,...res.data.suser}));
  const selectedCountry = Country.getAllCountries().find((country) => country.name === res.data.suser.country);
  setSelectedCountryp1(selectedCountry);

  const selectedState = State.getStatesOfCountry(selectedCountry?.isoCode).find((state) => state.name === res?.data?.suser?.state);
  setSelectedStatep1(selectedState);

  const selectedCity = City.getCitiesOfState(selectedState?.countryCode, selectedState?.isoCode).find((city) => city.name === res?.data?.suser?.city);
  setSelectedCityp1(selectedCity);
  }

  useEffect(() => {
    fetchBranch();
    try {
      getSingleUserCredentials();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    setRoles(isUserRoleAccess.role)

  }, []);

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = bankUsers?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber();
  }, [bankUsers]);


  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
    setSelectAllChecked(false)
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false)
    setPage(1);
  };


  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox
        checked={selectAllChecked}
        onChange={onSelectAll}
      />
    </div>
  );

  const columnDataTable = [

    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllChecked) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTable.map((row) => row.id);
              setSelectedRows(allRowIds);
            }
            setSelectAllChecked(!selectAllChecked);

          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.id);
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(updatedSelectedRows.length === filteredData.length);

          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header"
    },
    {
      field: "serialNumber", headerName: "SNo",
      flex: 0, width: 100, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
    },
    { field: "empname", headerName: "Emp Name", flex: 0, width: 250, hide: !columnVisibility.empname, headerClassName: "bold-header" },
    { field: "empcode", headerName: "Emp Code", flex: 0, width: 250, hide: !columnVisibility.empcode, headerClassName: "bold-header" },
    { field: "phone", headerName: "Phone", flex: 0, width: 150, hide: !columnVisibility.phone, headerClassName: "bold-header" },
    { field: "doj", headerName: "Date of join", flex: 0, width: 150, hide: !columnVisibility.doj, headerClassName: "bold-header" },
    { field: "noofdays", headerName: "Duration", flex: 0, width: 150, hide: !columnVisibility.noofdays, headerClassName: "bold-header" },
    { field: "time", headerName: "Period", flex: 0, width: 150, hide: !columnVisibility.noofdays, headerClassName: "bold-header" },
    { field: "dot", headerName: "DOT", flex: 0, width: 150, hide: !columnVisibility.dot, headerClassName: "bold-header" },
    //{ field: "isaddressupdated", headerName: "Address", flex: 0, width: 150, hide: !columnVisibility.isaddressupdated, headerClassName: "bold-header" },
    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 350,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: 'flex' }}>
          {isUserRoleCompare?.includes("eupdatepersonaldetails") && (
            <Button sx={userStyle.buttonedit} onClick={() => {
              getCode(params.row.id);
            }}><EditOutlinedIcon style={{ fontsize: 'large' }} /></Button>
          )}
          {isUserRoleCompare?.includes("dupdatepersonaldetails") && (
            <Button sx={userStyle.buttondelete} onClick={(e) => { rowData(params.row.id, params.row.name) }}><DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }} /></Button>
          )}
          {isUserRoleCompare?.includes("vupdatepersonaldetails") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iupdatepersonaldetails") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iupdatepersonaldetails") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                addAdress(params.row.id);
              }}
            > {params.row.isaddressupdated?<DoneOutlineIcon style={{ fontsize: "large" }} />:<AddCircleOutlineIcon style={{ fontsize: "large" }} />}
            </Button>
          )}
        </Grid>
      ),
    },
  ]

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      empname: item.empname,
      empcode: item.empcode,
      phone:item.phone,
      doj:moment(item.doj).format("DD-MM-YYYY"),
      noofdays:item.noofdays,
      time:item.time,
      dot:moment(item.dot).format("DD-MM-YYYY"),
      isaddressupdated:item.isaddressupdated
    }
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  // // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {

    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box style={{ padding: "10px", minWidth: "325px", '& .MuiDialogContent-root': { padding: '10px 0' } }} >
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumns}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ position: 'relative', margin: '10px' }}>
        <TextField
          label="Find column"
          variant="standard"
          fullWidth
          value={searchQueryManage}
          onChange={(e) => setSearchQueryManage(e.target.value)}
          sx={{ marginBottom: 5, position: 'absolute', }}
        />
      </Box><br /><br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
        <List sx={{ overflow: 'auto', height: '100%', }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: 'flex' }}
                primary={
                  <Switch sx={{ marginTop: "-5px" }} size="small"
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={(column.field === "checkbox") ? "Checkbox" : column.headerName}
              // secondary={column.headerName }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: 'none', }}
              onClick={() => setColumnVisibility(initialColumnVisibility)}
            >
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: 'none' }}
              onClick={() => {
                const newColumnVisibility = {};
                columnDataTable.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibility(newColumnVisibility);
              }}

            >
              Hide All
            </Button>

          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  return (
    <Box>
      <Headtitle title={"Bank Details Verification Page"} />
      {/* ****** Header Content ****** */}
      {isUserRoleCompare?.includes("acompany") && (
        <>
          <Typography sx={userStyle.HeaderText}>Bank Details Verification Page</Typography>
          <Box sx={userStyle.container}>
            <Typography sx={userStyle.SubHeaderText}> Manage Bank Details Verfication Page</Typography>
            <br />
            <br />
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Name
                    </Typography>
                    <OutlinedInput disabled={true}
                      id="component-outlinedcode"
                      type="text"
                      value={employeeDetails.empName}
                      
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Employee Code
                    </Typography>
                    <OutlinedInput disabled={true}
                      id="component-outlinedname"
                      type="text"
                      value={employeeDetails.empCode}
                      
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Phone Number <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlinedcode"
                      type="text"
                      placeholder="Phone Number"
                      value={employeeDetails.empPhone}
                      onChange={(e) => {
                        handlechangereferencecontactno(e);
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Date of joining</Typography>
                    <OutlinedInput disabled={true}
                      id="component-outlined"
                      type="date"
                      placeholder="DOJ"
                      value={employeeDetails.empDoj}
                      
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <Typography>
                    Duration <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <FormControl fullWidth size="small">
                    <OutlinedInput id="component-outlined" type="text" placeholder="Duration" value={employeeDetails.empAge} onChange={(e)=>{handleAgeOfEmployee(e)}} />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <Typography>
                  Period <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Select
                    fullWidth
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={employeeDetails.empAgeSuffix}
                     onChange={(e) => {
                      handleAddingDate(e);
                     }}
                  >
                    <MenuItem value="" disabled>
                      {" "}
                      Please Select
                    </MenuItem>
                    <MenuItem value="Days"> {"Days"} </MenuItem>
                    <MenuItem value="Month"> {"Month"} </MenuItem>
                    <MenuItem value="Year"> {"Year"} </MenuItem>
                  </Select>
                </Grid>
                <Grid item md={4} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>DOT</Typography>
                    <OutlinedInput disabled={true}
                      id="component-outlined"
                      type="date"
                      placeholder="DOJ"
                      value={employeeDetails.empDot}
                      /*onChange={(e) => {
                        handleAddingDate(e)
                      }}*/
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              {/* <Grid container>
                {isUserRoleCompare?.includes("acompany") && (
                  <>
                    <Button variant="contained" type="submit">
                      SUBMIT
                    </Button>
                  </>
                )}            
              </Grid> */}

              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6}>
                  {isUserRoleCompare?.includes("acompany") && (
                    <>
                      <Button variant="contained" type="submit">
                        SUBMIT
                      </Button>
                    </>
                  )}

                </Grid>
                <Grid item md={2.5} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleClear}>Clear</Button>

                </Grid>
              </Grid>
            </form>
          </Box>
        </>
      )}
      <br />
       {isUserRoleCompare?.includes("lcompany") && (
        <>
          <Box sx={userStyle.container}>
            { /* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Bank Verification Details</Typography>
            </Grid>

            <br />

            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label >Show entries:</label>
                  <Select id="pageSizeSelect" value={pageSize}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={(bankUsers?.length)}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box >
                  {isUserRoleCompare?.includes("excelupdatepersonaldetails") && (
                    <>
                      <ExportXL csvData={rowDataTable.map((t, index) => ({
          Sno: index + 1,
          "Employee Name": t.empname,
          "Employee Code": t.empcode,
          "Phone":t.phone,
          "Date of join":t.doj,
          "Duration":t.noofdays,
          "Period":t.time,
          "DOT":t.dot
        }))} fileName={fileName} />
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvupdatepersonaldetails") && (
                    <>
                      <ExportCSV csvData={rowDataTable.map((t, index) => ({
          Sno: index + 1,
          "Employee Name": t.empname,
          "Employee Code": t.empcode,
          "Phone":t.phone,
          "Date of join":t.doj,
          "Duration":t.noofdays,
          "Period":t.time,
          "DOT":t.dot
        }))} fileName={fileName} />

                    </>
                  )}
                  {isUserRoleCompare?.includes("printupdatepersonaldetails") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handlePrint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfupdatepersonaldetails") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()} ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageupdatepersonaldetails") && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>
                  )}
                </Box >
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  <FormControl fullWidth size="small" >
                    <Typography>Search</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>Show All Columns</Button>&ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>Manage Columns</Button>&ensp;
            {isUserRoleCompare?.includes("bdcompany") && (
              <Button variant="contained" color="error" onClick={()=>handleClickOpenalert()} >Bulk Delete</Button>
            )}


            <br /><br />
            {!isCompany ?
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  
                  <ThreeDots
                    height="80"
                    width="80"
                    radius="9"
                    color="#1976d2"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                </Box>
              </>
              :
              <>
                <Box
                  style={{
                    width: '100%',
                    overflowY: 'hidden', // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid
                    onClipboardCopy={(copiedString) => setCopiedData(copiedString)}
                    rows={rowsWithCheckboxes}
                    columns={columnDataTable.filter((column) => columnVisibility[column.field])}
                    onSelectionModelChange={handleSelectionChange}
                    selectionModel={selectedRows}
                    autoHeight={true}
                    ref={gridRef}
                    density="compact"
                    hideFooter
                    getRowClassName={getRowClassName}
                    disableRowSelectionOnClick
                  />


                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing {filteredData.length > 0 ? ((page - 1) * pageSize) + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                  </Box>
                  <Box>
                    <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <FirstPageIcon />
                    </Button>
                    <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers?.map((pageNumber) => (
                      <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={((page)) === pageNumber ? 'active' : ''} disabled={page === pageNumber}>
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPages && <span>...</span>}
                    <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <NavigateNextIcon />
                    </Button>
                    <Button onClick={() => setPage((totalPages))} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
              </>}
          </Box>
        </>
      )}
      {/* Manage Column */}
      <Popover
        id={id}
        open={isManageColumnsOpen}
        anchorEl={anchorEl}
        onClose={handleCloseManageColumns}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {manageColumnsContent}
      </Popover>

      {/* Delete Modal */}
      <Box>
        <>
          <Box>
            {/* ALERT DIALOG */}
            <Dialog open={isDeleteOpen} onClose={handleCloseMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
              <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                  Are you sure?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseMod} variant="outlined">
                  Cancel
                </Button>
                <Button autoFocus variant="contained" color="error" onClick={(e) => delBankDetails(branchid)}>
                  {" "}
                  OK{" "}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </>

        {/* edit model */}
        <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth>
          <Box sx={{ padding: "20px 30px" }}>
            <form onSubmit={editSubmit}>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>Edit Bankdetailsinfo</Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">
                      Emp Name
                    </Typography>
                    <Typography>{areatid.empname}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">
                    Emp Code
                    </Typography>
                    <Typography>{areatid.empcode}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                     Date of join
                    </Typography>
                    <OutlinedInput disabled={true}
                      id="component-outlined"
                      type="date"
                      value={areatid.doj}
                      /*onChange={(e) => {
                        setAreatid({ ...areatid, doj: e.target.value });
                      }}*/
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                     DOT
                    </Typography>
                    <OutlinedInput disabled={true}
                      id="component-outlined"
                      type="date"
                      value={areatid.dot}
                      /*onChange={(e) => {
                        setAreatid({ ...areatid, dot: e.target.value });
                      }}*/
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Phone <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={areatid.phone}
                      onChange={(e) => {
                        handlechangeeditreferencecontactno(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                     Duration <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={areatid.noofdays}
                      onChange={(e) => {
                        setAreatid({ ...areatid,noofdays: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Typography>
                  Period <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Select style={{ height: '40px' }} 
                    fullWidth
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={areatid.time}
                      onChange={(e) => {
                        setAreatid({...areatid,time:e.target.value})
                      }}
                  >
                    <MenuItem value="" disabled>
                      {" "}
                      Please Select
                    </MenuItem>
                    <MenuItem value="Days"> {"Days"} </MenuItem>
                    <MenuItem value="Month"> {"Month"} </MenuItem>
                    <MenuItem value="Year"> {"Year"} </MenuItem>
                  </Select>
                </Grid>
              </Grid>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <Button variant="contained" type="submit">
                    {" "}
                    Update
                  </Button>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Dialog>

        {/* update address model with employee details */}
        <Dialog open={isUpdateAddressOpen} onClose={handleClickUpdateAddressCloseEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg" fullWidth>
          <Box sx={{ padding: "20px 30px" }}>
            <form onSubmit={addressEditSubmit}>
              <Grid container spacing={2}>
                <Typography sx={userStyle.HeaderText}>Add Address Details</Typography>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">
                      Emp Name
                    </Typography>
                    <Typography>
                      {employeeDetails.empName}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">
                    Emp Code
                    </Typography>
                    <Typography>
                      {employeeDetails.empCode}
                    </Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">
                      Phone
                    </Typography>
                    <Typography>
                      {employeeDetails.empPhone}
                    </Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <Typography sx={userStyle.SubHeaderText}>{" "} Address</Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Door/Flat No <b style={{ color: "red" }}>*</b></Typography>
                  {singleUser.isaddressupdated?<OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Door/Flat No"
                  value={singleUser.doorno}
                  onChange={(e) => {
                    setSingleUser({...singleUser,doorno:e.target.value})
                    setEmployeeDetails({...employeeDetails,empDoor:e.target.value})
                  }}
                />:<OutlinedInput
                id="component-outlined"
                type="text"
                placeholder="Door/Flat No"
                value={employeeDetails.empDoor}
                onChange={(e) => {
                  setEmployeeDetails({...employeeDetails,empDoor:e.target.value})
                }}
              />}
                </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Street/Block <b style={{ color: "red" }}>*</b></Typography>
                    {singleUser.isaddressupdated?<OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Street/Block"
                      value={singleUser.street}
                      onChange={(e) => {
                        setSingleUser({...singleUser,street:e.target.value})
                        setEmployeeDetails({...employeeDetails,empStreet:e.target.value})
                      }}
                    />:<OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Street/Block"
                    value={employeeDetails.empStreet}
                    onChange={(e) => {
                      setEmployeeDetails({...employeeDetails,empStreet:e.target.value})
                    }}
                  />}
                    
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Area/village <b style={{ color: "red" }}>*</b></Typography>
                    {singleUser.isaddressupdated?<OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Area/Village"
                      value={singleUser.area}
                      onChange={(e) => {
                        setSingleUser({...singleUser,area:e.target.value})
                        setEmployeeDetails({...employeeDetails,empArea:e.target.value})
                      }}
                    />:<OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Area/Village"
                    value={employeeDetails.empArea}
                    onChange={(e) => {
                      setEmployeeDetails({...employeeDetails,empArea:e.target.value})
                    }}
                  />}
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Landmark <b style={{ color: "red" }}>*</b></Typography>
                    {singleUser.isaddressupdated?<OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Landmark"
                      value={singleUser.landmark}
                      onChange={(e) => {
                        setSingleUser({...singleUser,landmark:e.target.value})
                        setEmployeeDetails({...employeeDetails,empLandmark:e.target.value})
                      }}
                    />:<OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Landmark"
                    value={employeeDetails.empLandmark}
                    onChange={(e) => {
                      setEmployeeDetails({...employeeDetails,empLandmark:e.target.value})
                    }}
                  />}
                  </FormControl>
                </Grid>
                <br />
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Taluk <b style={{ color: "red" }}>*</b></Typography>
                    {singleUser.isaddressupdated?<OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Taluk"
                      value={singleUser.taluk}
                      onChange={(e) => {
                        setSingleUser({...singleUser,taluk:e.target.value})
                        setEmployeeDetails({...employeeDetails,empTaluk:e.target.value})
                      }}
                    />:<OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Taluk"
                    value={employeeDetails.empTaluk}
                    onChange={(e) => {
                      setEmployeeDetails({...employeeDetails,empTaluk:e.target.value})
                    }}
                  />}
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>Post <b style={{ color: "red" }}>*</b></Typography>
                    {singleUser.isaddressupdated?<OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Post"
                      value={singleUser.post}
                      onChange={(e) => {
                        setSingleUser({...singleUser,post:e.target.value})
                        setEmployeeDetails({...employeeDetails,empPost:e.target.value})
                      }}
                    />:<OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Post"
                    value={employeeDetails.empPost}
                    onChange={(e) => {
                      setEmployeeDetails({...employeeDetails,empPost:e.target.value})
                    }}
                  />}
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>Pincode <b style={{ color: "red" }}>*</b></Typography>
                    {singleUser.isaddressupdated?<OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Pincode"
                      value={singleUser.pincode}
                      onChange={(e) => {
                        if(e.target.value.length<=6){
                          setSingleUser({...singleUser,pincode:e.target.value})
                          setEmployeeDetails({...employeeDetails,empPincode:e.target.value})
                        }
                      }}
                    />:<OutlinedInput
                    id="component-outlined"
                    type="number"
                    sx={userStyle.input}
                    placeholder="Pincode"
                    value={employeeDetails.empPincode}
                    onChange={(e) => {
                      if(e.target.value.length<=6){
                        setEmployeeDetails({...employeeDetails,empPincode:e.target.value})
                      }
                    }}
                  />}
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>Country <b style={{ color: "red" }}>*</b></Typography>
                    {singleUser.isaddressupdated?<Selects
                      options={Country.getAllCountries()}
                      getOptionLabel={(options) => {
                        return options["name"];
                      }}
                      getOptionValue={(options) => {
                        return options["name"];
                      }}
                      styles={colourStyles}
                      value={selectedCountryp1}
                      onChange={(item) => {
                        setSelectedCountryp1(item);
                        setEmployeeDetails({
                          ...employeeDetails,empCountry:item
                        })
                      }}
                    />:<Selects
                    options={Country.getAllCountries()}
                    getOptionLabel={(options) => {
                      return options["name"];
                    }}
                    getOptionValue={(options) => {
                      return options["name"];
                    }}
                    styles={colourStyles}
                    value={selectedCountryp}
                    onChange={(item) => {
                      setSelectedCountryp(item);
                      setEmployeeDetails({
                        ...employeeDetails,empCountry:item
                      })
                    }}
                  />}
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>State <b style={{ color: "red" }}>*</b></Typography>
                    {singleUser.isaddressupdated?<Selects
                      options={State?.getStatesOfCountry(selectedCountryp1?.isoCode)}
                      getOptionLabel={(options) => {
                        return options["name"];
                      }}
                      getOptionValue={(options) => {
                        return options["name"];
                      }}
                      value={selectedStatep1}
                      styles={colourStyles}
                      onChange={(item) => {
                        setSelectedStatep1(item);
                        setEmployeeDetails({
                          ...employeeDetails,empState:item
                        })
                      }}
                    />:<Selects
                    options={State?.getStatesOfCountry(selectedCountryp?.isoCode)}
                    getOptionLabel={(options) => {
                      return options["name"];
                    }}
                    getOptionValue={(options) => {
                      return options["name"];
                    }}
                    value={selectedStatep}
                    styles={colourStyles}
                    onChange={(item) => {
                      setSelectedStatep(item);
                      setEmployeeDetails({
                        ...employeeDetails,empState:item
                      })
                    }}
                  />}
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>City <b style={{ color: "red" }}>*</b></Typography>
                    {singleUser.isaddressupdated?<Selects
                      options={City.getCitiesOfState(selectedStatep1?.countryCode, selectedStatep1?.isoCode)}
                      getOptionLabel={(options) => {
                        return options["name"];
                      }}
                      getOptionValue={(options) => {
                        return options["name"];
                      }}
                      value={selectedCityp1}
                      styles={colourStyles}
                      onChange={(item) => {
                        setSelectedCityp1(item);
                        setEmployeeDetails({
                          ...employeeDetails,empCity:item
                        })
                      }}
                    />:<Selects
                    options={City.getCitiesOfState(selectedStatep?.countryCode, selectedStatep?.isoCode)}
                    getOptionLabel={(options) => {
                      return options["name"];
                    }}
                    getOptionValue={(options) => {
                      return options["name"];
                    }}
                    value={selectedCityp}
                    styles={colourStyles}
                    onChange={(item) => {
                      setSelectedCityp(item);
                      setEmployeeDetails({
                        ...employeeDetails,empCity:item
                      })
                    }}
                  />}
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <Button variant="contained" type="submit">
                    {" "}
                    Update
                  </Button>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <Button sx={userStyle.btncancel} onClick={handleClickUpdateAddressCloseEdit}>
                    {" "}
                    Cancel{" "}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Dialog>

        {/* Check Delete Modal */}
        <Box>
          <>
            <Box>
              {/* ALERT DIALOG */}
              <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                  <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />

                  <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                    {checkBranch?.length > 0 && checkUser?.length > 0 ? (
                      <>
                        <span style={{ fontWeight: "700", color: "#777" }}>{`${deletebranch?.name} `}</span>was linked in <span style={{ fontWeight: "700" }}>branch & user</span>{" "}
                      </>
                    ) : checkBranch?.length > 0 ? (
                      <>
                        <span style={{ fontWeight: "700", color: "#777" }}>{`${deletebranch?.name} `}</span> was linked in <span style={{ fontWeight: "700" }}>branch</span>
                      </>
                    ) : checkUser?.length > 0 ? (
                      <>
                        <span style={{ fontWeight: "700", color: "#777" }}>{`${deletebranch?.name} `}</span> was linked in <span style={{ fontWeight: "700" }}>user</span>
                      </>
                    ) : (
                      ""
                    )}
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseCheck} autoFocus variant="contained" color="error">
                    {" "}
                    OK{" "}
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </>
        </Box>

        {/* view model */}
        <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth>
          <Box sx={{padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}> View Employee</Typography>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"> Emp Name</Typography>
                    <Typography>{areaviewid.empname}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Emp Code</Typography>
                    <Typography>{areaviewid.empcode}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Date of join</Typography>
                    <Typography>{moment(areaviewid.doj).format("DD-MM-YYYY")}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">DOT</Typography>
                    <Typography>{moment(areaviewid.dot).format("DD-MM-YYYY")}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Phone</Typography>
                    <Typography>{areaviewid.phone}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Duration</Typography>
                    <Typography>{areaviewid.noofdays}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={4}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Period</Typography>
                    <Typography>{areaviewid.time}</Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br /> <br />
              <Grid container spacing={2}>
                <Button variant="contained" color="primary" onClick={handleCloseview}>
                  {" "}
                  Back{" "}
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>

        {/* this is info view details */}

        <Dialog open={openInfo} onClose={handleCloseinfo} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="lg">
          <Box sx={{ width: "550px", padding: "20px 50px" }}>
            <>
              <Typography sx={userStyle.HeaderText}> Info Bankdetails</Typography>
              <br />
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">addedby</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {addedby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {momentTimeZone(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </FormControl>
                </Grid>
                <br />
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Updated by</Typography>
                    <br />
                    <Table>
                      <TableHead>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}>{"SNO"}.</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"UserName"}</StyledTableCell>
                        <StyledTableCell sx={{ padding: "5px 10px !important" }}> {"Date"}</StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {updateby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}>{i + 1}.</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {item.name}</StyledTableCell>
                            <StyledTableCell sx={{ padding: "5px 10px !important" }}> {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}</StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />
              <br />
              <Grid container spacing={2}>
                <Button variant="contained" onClick={handleCloseinfo}>
                  {" "}
                  Back{" "}
                </Button>
              </Grid>
            </>
          </Box>
        </Dialog>

        {/* ******Print layout ****** */}
        <TableContainer component={Paper} sx={userStyle.printcls}>
          <Table aria-label="simple table" id="Customerduesreport" ref={componentRef}>
            <TableHead sx={{ fontWeight: "600" }}>
              <TableRow>
                <TableCell> S.No</TableCell>
                <TableCell>Employee Name </TableCell>
                <TableCell>Employee Code</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Date of join</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Period</TableCell>
                <TableCell>DOT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowDataTable &&
                rowDataTable?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.empname}</TableCell>
                    <TableCell>{row.empcode}</TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{row.doj}</TableCell>
                    <TableCell>{row.noofdays}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.dot}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box>
        <Dialog
          open={isDeleteOpencheckbox}
          onClose={handleCloseModcheckbox}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModcheckbox} sx={userStyle.btncancel}>Cancel</Button>
            <Button autoFocus variant="contained" color='error'
              onClick={(e) => delBankDetailsCheckbox(e)}
            > OK </Button>
          </DialogActions>
        </Dialog>

      </Box>
      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isDeleteOpenalert}
          onClose={handleCloseModalert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: 'orange' }} />
            <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>Please Select any Row</Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant="contained" color='error'
              onClick={handleCloseModalert}
            > OK </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color={color} onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* ALERT DIALOG */}
      <Box>
        <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={() => {
                sendEditRequest();
                handleCloseerrpop();
              }}
            >
              ok
            </Button>
            <Button
              style={{
                backgroundColor: "#f4f4f4",
                color: "#444",
                boxShadow: "none",
                borderRadius: "3px",
                padding: "7px 13px",
                border: "1px solid #0000006b",
                "&:hover": {
                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                    backgroundColor: "#f4f4f4",
                  },
                },
              }}
              onClick={handleCloseerrpop}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default BankDetailsVerification;
