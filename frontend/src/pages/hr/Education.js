import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import ImageIcon from '@mui/icons-material/Image';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Paper, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextareaAutosize, TextField, Typography } from "@mui/material";
import Switch from '@mui/material/Switch';
import { styled } from '@mui/system';
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from 'react-loader-spinner';
import Resizable from 'react-resizable';
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import { userStyle } from "../../pageStyle";
import { SERVICE } from '../../services/Baseservice';
const Education = () => {
  //fetch branch
  const [educations, setEducations] = useState([]);
  const [educationsalledit, setEducationsalledit] = useState([]);

  let exportColumnNames = ['Name', 'Description'];
  let exportRowValues = ['name', 'description'];

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
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const [education, setEducation] = useState({
    name: "", description: ""
  });
  const [getrowid, setRowGetid] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteeducation, setDeleteeducation] = useState({});
  const [educationedit, setEducationedit] = useState({});
  const { isUserRoleCompare, buttonStyles } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [isBtn, setIsBtn] = useState(false);

  const [isEducation, setIsEducation] = useState(false);

  const { isUserRoleAccess } = useContext(UserRoleAccessContext);

  const username = isUserRoleAccess.username;

  const gridRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState('');

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'Education.png');
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

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };


  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };



  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleClose = () => {
    setIsDeleteOpen(false);
  };

  // Edit model
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick")
      return;
    setIsEditOpen(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {

    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
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
    name: true,
    description: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);



  // get all branches
  const fetchUnits = async () => {
    try {
      let res_unit = await axios.get(SERVICE.EDUCATION, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });

      setEducations(res_unit?.data?.educations);
      setIsEducation(true)
    } catch (err) { setIsEducation(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }


  //set function to get particular row
  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.EDUCATION_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setDeleteeducation(res?.data?.seducation);
      handleClickOpen();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }

  // Alert delete popup

  let unitid = deleteeducation._id;
  const delEducation = async () => {
    try {
      await axios.delete(`${SERVICE.EDUCATION_SINGLE}/${unitid}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      await fetchUnits();
      setPage(1);
      setSelectedRows([]);
      handleClose();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };


  const delEducationcheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.EDUCATION_SINGLE}/${item}`, {
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

      await fetchUnits();

      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();

    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //------------------------------------------------------

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("xl");

  const getCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.EDUCATION_SINGLE}/${e}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      })
      setEducationedit(res?.data?.seducation);
      setRowGetid(res?.data?.seducation);
      handleClickOpenEdit();

    } catch (err) { setIsEducation(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }

  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.EDUCATION_SINGLE}/${e}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      handleClickOpenview();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // get single row to view....
  const getinfoCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.EDUCATION_SINGLE}/${e}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setEducationedit(res?.data?.seducation);
      handleClickOpeninfo();

    } catch (err) { setIsEducation(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  // get all branches
  const fetchUnitsAll = async () => {
    try {
      let res_unit = await axios.get(SERVICE.EDUCATION, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setEducationsalledit(res_unit?.data?.educations.filter(item => item._id !== educationedit._id));
    } catch (err) { setIsEducation(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }



  // Excel
  const fileName = "Education";



  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Educations',
    pageStyle: 'print'
  });

  const sendRequest = async () => {
    setIsBtn(true)
    try {
      let units = await axios.post(SERVICE.EDUCATION_CREATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        name: String(education.name),
        description: String(education.description),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      })
      await fetchUnits();
      setEducation(units.data)
      setEducation({ name: "", description: "" })
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false)
    } catch (err) { setIsEducation(true); setIsBtn(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }



  //Education updateby edit page...
  let updateby = educationedit.updatedby;
  let addedby = educationedit.addedby;
  //edit post call
  let unit_id = getrowid._id
  const sendRequestEdit = async () => {
    try {
      let education = await axios.put(`${SERVICE.EDUCATION_SINGLE}/${unit_id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        name: String(educationedit.name),
        description: String(educationedit.description),
        updatedby: [
          ...updateby, {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),

          },
        ],
      })
      await fetchUnits();
      await fetchUnitsAll();
      setEducationedit(education.data);
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();

    } catch (err) { setIsEducation(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = educations.some(item => item.name.toLowerCase() === (education.name).toLowerCase());

    if (education.name === "") {
      setPopupContentMalert("Please enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (isNameMatch) {
      setPopupContentMalert("Data already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendRequest();
    }

  }

  const handleClear = (e) => {
    e.preventDefault();
    setEducation({
      name: "", description: ""
    });
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  }

  const editSubmit = (e) => {
    e.preventDefault();
    fetchUnitsAll();
    const isNameMatch = educationsalledit.some(item => item.name.toLowerCase() === (educationedit.name).toLowerCase());

    if (educationedit.name === "") {

      setPopupContentMalert("Please Enter Name");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {

      setPopupContentMalert("Data already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else {
      sendRequestEdit();
      // sendRequest();
    }
  }

  useEffect(() => {

    getapi();

  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Education"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });

  }


  useEffect(
    () => {
      fetchUnits();
      fetchUnitsAll();
    }, []
  );
  useEffect(
    () => {
      fetchUnitsAll();
    }, [isEditOpen, educationedit]
  );

  //table entries ..,.
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = educations?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  }


  useEffect(() => {
    addSerialNumber();
  }, [educations])

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
      flex: 0, width: 90, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
    },
    { field: "name", headerName: "Name", flex: 0, width: 120, hide: !columnVisibility.name, headerClassName: "bold-header" },
    { field: "description", headerName: "Description", flex: 0, width: 130, hide: !columnVisibility.description, headerClassName: "bold-header" },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Grid sx={{ display: 'flex' }}>
          {isUserRoleCompare?.includes("eeducation") && (
            <Button sx={userStyle.buttonedit} onClick={() => {
              getCode(params.row.id);
            }}>
              <EditOutlinedIcon style={{ fontsize: 'large' }} sx={buttonStyles.buttonedit} /></Button>
          )}
          {isUserRoleCompare?.includes("deducation") && (
            <Button sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id)
              }}>
              <DeleteOutlineOutlinedIcon style={{ fontsize: 'large' }}
                sx={buttonStyles.buttondelete} />                </Button>
          )}
          {isUserRoleCompare?.includes("veducation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ieducation") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttoninfo} />
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
      name: item.name,
      description: item.description,

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

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ''; // This is required for Chrome support
  };

  useEffect(
    () => {
      const beforeUnloadHandler = (event) => handleBeforeUnload(event);
      window.addEventListener('beforeunload', beforeUnloadHandler);
      return () => {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
      };
    }, []);

  return (
    <Box>
      <Headtitle title={' EDUCATION'} />
      {/* ****** Header Content ****** */}

      <PageHeading
        title="Education"
        modulename="Human Resources"
        submodulename="HR"
        mainpagename="HR Setup"
        subpagename="Education"
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aeducation") && (
        <>
          <Box sx={userStyle.container}>
            <Typography sx={userStyle.SubHeaderText}>Add Education</Typography>
            <>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={5} sm={12} xs={12}>
                  <FormControl fullWidth size="small" >
                    <Typography>Name <b style={{ color: "red" }}>*</b></Typography>
                    <OutlinedInput
                      id="component-outlined"
                      placeholder="Please Enter the Name"
                      type="text"
                      value={education.name}
                      onChange={(e) => { setEducation({ ...education, name: e.target.value }) }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={5} sm={12} xs={12}>
                  <FormControl fullWidth size="small" >
                    <Typography>Description</Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={4}
                      style={{ width: "100%" }}
                      value={education.description}
                      onChange={(e) => {
                        setEducation({ ...education, description: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={2} xs={12} sm={12} >
                  <Typography>&nbsp;</Typography>
                  <Button variant="contained" onClick={handleSubmit} disabled={isBtn} sx={buttonStyles.buttonsubmit}>
                    Submit
                  </Button>


                  &nbsp;
                  &nbsp;
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                    Clear
                  </Button>


                </Grid>

              </Grid>

            </>
          </Box>
          <br />
        </>
      )}
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("leducation") && (
        <>
          <Box sx={userStyle.container}>
            { /* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Education List</Typography>
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
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box >
                  {isUserRoleCompare?.includes("exceleducation") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csveducation") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>

                    </>
                  )}
                  {isUserRoleCompare?.includes("printeducation") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfeducation") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageeducation") && (
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
            {isUserRoleCompare?.includes("bdeducation") && (
              <Button sx={buttonStyles.buttonbulkdelete} onClick={handleClickOpenalert} >Bulk Delete</Button>)}


            <br /><br />
            {!isEducation ?
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
        {/* ALERT DIALOG */}

      </Box>
      <Box>
        {/* ALERT DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={userStyle.container}>
            <>
              <Typography sx={userStyle.HeaderText}>Edit Education</Typography>
              <br />
              <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                  <FormControl fullWidth size="small" >
                    <Typography>Name <b style={{ color: "red" }}>*</b></Typography>
                    <OutlinedInput
                      id="component-outlined"
                      placeholder="Please Enter the Name"
                      type="text"
                      value={educationedit.name}
                      onChange={(e) => { setEducationedit({ ...educationedit, name: e.target.value }) }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <FormControl fullWidth size="small" >
                    <Typography>Description</Typography>
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={4}
                      style={{ width: "100%" }}
                      value={educationedit.description}
                      onChange={(e) => {
                        setEducationedit({ ...educationedit, description: e.target.value });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid><br />
              <Grid container spacing={2}>
                <Grid item md={4} sm={4} xs={4}>
                  <Button sx={buttonStyles.buttonsubmit} onClick={editSubmit} >Update</Button>
                </Grid>
                <Grid item md={4} sm={4} xs={4}>
                  <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit} >Cancel</Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
      </Box>
      <Box>
        <>
          <Box>
            {/* ALERT DIALOG */}
            <Dialog
              open={isDeleteOpen}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} sx={userStyle.btncancel}>Cancel</Button>
                <Button onClick={(e) => delEducation(unitid)} autoFocus variant="contained" color='error'> OK </Button>
              </DialogActions>
            </Dialog>
            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
              <Table sx={{ minWidth: 700, }} aria-label="customized table" id="usertable" ref={componentRef}>
                <TableHead sx={{ fontWeight: "600" }}>
                  <TableRow>
                    <TableCell> Sno</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Description </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody align="left">
                  {filteredData &&
                    (filteredData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.description}</TableCell>
                      </TableRow>
                    )))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
        {/* ALERT DIALOG */}

        {/* view model */}
        <Dialog
          open={openview}
          onClose={handleClickOpenview}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ width: "550px", padding: '20px 50px' }}>
            <>
              <Typography sx={userStyle.HeaderText}> View Education</Typography>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12} >
                  <FormControl fullWidth size="small">
                    <Typography variant="h6"> Name</Typography>
                    <Typography>{educationedit.name}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12} >
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Description</Typography>
                    <Typography>{educationedit.description}</Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />  <br />
              <Grid container spacing={2}>
                <Button sx={buttonStyles.btncancel} onClick={handleCloseview}> Back </Button>
              </Grid>
            </>
          </Box>
        </Dialog>



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
                onClick={(e) => delEducationcheckbox(e)}
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
          <Dialog
            open={isErrorOpen}
            onClose={handleCloseerr}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
              <Typography variant="h6" >{showAlert}</Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      />
      {/* SUCCESS */}
      <AlertDialog
        openPopup={openPopup}
        handleClosePopup={handleClosePopup}
        popupContent={popupContent}
        popupSeverity={popupSeverity}
      />
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={educations ?? []}
        filename={"Education"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Education Info"
        addedby={addedby}
        updateby={updateby}
      />
    </Box>
  );
}

export default Education;