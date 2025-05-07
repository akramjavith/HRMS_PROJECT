import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Select, MenuItem, Dialog, TableBody, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { SERVICE } from '../../../services/Baseservice';
import axios from "axios";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { handleApiError } from "../../../components/Errorhandling";
import { useReactToPrint } from "react-to-print";
import moment from 'moment-timezone';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { AuthContext, UserRoleAccessContext } from '../../../context/Appcontext';
import StyledDataGrid from "../../../components/TableStyle";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from 'react-loader-spinner';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';
import Resizable from 'react-resizable';
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
const InternCourse = () => {

  //fetch branch
  const [internCourses, setInternCourses] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
  const [internCourse, setInternCourse] = useState({
    name: "", code: "", addedby: "",
  });
  const [getrowid, setRowGetid] = useState("");
  const [deleteunit, setDeleteunit] = useState({});
  const [internCourseedit, setInternCourseedit] = useState({ name: "", code: "" });
  const [setUsername] = useState("");

  let username = isUserRoleAccess.username;

  const [isInterncourse, setIsInterncourse] = useState(false);

  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState('');
  const [searchQuery, setSearchQuery] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };

  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };


  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, 'Interncourse.png');
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


  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState()
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };

  const handleCloseview = () => {
    setOpenview(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  const { auth } = useContext(AuthContext);

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
    code: true,
    name: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);



  // get all branches
  const fetchUnits = async () => {
    try {
      let res_unit = await axios.get(SERVICE.INTERNCOURSE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setIsInterncourse(true)
      setInternCourses(res_unit?.data?.internCourses);
    } catch (err) {setIsInterncourse(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
  }

  const [internCoursesArrayEdit, setInternCoursesArrayEdit] = useState([])

  const fetchInternCourseEdit = async () => {
    try {
      let res_unit = await axios.get(SERVICE.INTERNCOURSE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setIsInterncourse(true)
      setInternCoursesArrayEdit(res_unit?.data?.internCourses.filter((item) => item._id !== internCourseedit._id));
    } catch (err) {setIsInterncourse(true);handleApiError(err, setShowAlert, handleClickOpenerr);}

  }

  useEffect(() => {
    fetchInternCourseEdit()
  }, [internCourseedit])


  const [internCoursesArray, setInternCoursesArray] = useState([])

  const fetchInterncourse = async () => {
    try {
      let res_unit = await axios.get(SERVICE.INTERNCOURSE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setIsInterncourse(true)
      setInternCoursesArray(res_unit?.data?.internCourses);
    } catch (err) {setIsInterncourse(true);handleApiError(err, setShowAlert, handleClickOpenerr);}

  }

  useEffect(() => {
    fetchInterncourse()
  }, [isFilterOpen])

  //set function to get particular row
  const rowData = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.INTERNCOURSE_SINGLE}/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setDeleteunit(res?.data?.sinternCourse);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }

  // Alert delete popup

  let internCourseId = deleteunit._id;
  const delIntern = async () => {
    try {
      await axios.delete(`${SERVICE.INTERNCOURSE_SINGLE}/${internCourseId}`, {
      });
      await fetchUnits();
      setPage(1);
      setSelectedRows([]);
      handleClose();
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const delInterncheckbox = async () => {
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.INTERNCOURSE_SINGLE}/${item}`, {
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
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Deleted Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();

      await fetchUnits();

     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };



  //  PDF
  const columns = [
    // { title: "Sno", field: "serialNumber" },
    { title: "Code", field: "code" },
    { title: "Name", field: "name" },

  ]

  // const downloadPdf = () => {
  //   const doc = new jsPDF()
  //   doc.autoTable({
  //     theme: "grid",
  //     columns: columns?.map(col => ({ ...col, dataKey: col.field })),
  //     body: items
  //   })
  //   doc.save('interncourse.pdf')
  // }
  const downloadPdf = (isfilter) => {

    const doc = new jsPDF();

    let serialNumberCounter = 1;

    const columnsWithSerial = [
      { title: "SNo", dataKey: "serialNumber" },
      ...columns.map((col) => ({ ...col, dataKey: col.field })),
    ];

    const dataWithSerial = isfilter === "filtered" ?
      rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
      internCoursesArray.map(row => ({ ...row, serialNumber: serialNumberCounter++ }));

    doc.autoTable({
      theme: "grid",
      columns: columnsWithSerial,
      body: dataWithSerial,
    });

    doc.save("interncourse.pdf");
  };

  const getCode = async (e) => {

    try {
      let res = await axios.get(`${SERVICE.INTERNCOURSE_SINGLE}/${e}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      })
      setInternCourseedit(res?.data?.sinternCourse);
      setRowGetid(res?.data?.sinternCourse);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }

  // get single row to view....
  const getviewCode = async (e) => {
    try {
      let res = await axios.get(`${SERVICE.INTERNCOURSE_SINGLE}/${e}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setInternCourseedit(res?.data?.sinternCourse);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}

  };

  // get single row to view....
  const getinfoCode = async (e) => {

    try {
      let res = await axios.get(`${SERVICE.INTERNCOURSE_SINGLE}/${e}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      setInternCourseedit(res?.data?.sinternCourse);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  let updatelist = [];
  updatelist = internCourseedit?.updatedby;

  // Excel
  const fileName = "Interncourse";

  const [branchData, setBranchData] = useState([]);

  // get particular columns for export excel
  const getexcelDatas = async () => {

    try {
      let response = await axios.get(SERVICE.INTERNCOURSE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
      });
      var data = response.data.internCourses.length > 0 &&
        response.data.internCourses.map(t => ({
          code: t.code,
          Name: t.name
        }));
      setBranchData(data);
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Units',
    pageStyle: 'print'
  });
  const [isBtn,setIsBtn] = useState(false)
  //add page....
  const sendRequest = async () => {
    setIsBtn(true)
    try {
      let units = await axios.post(SERVICE.INTERNCOURSE_CREATE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        code: String(internCourse.code),
        name: String(internCourse.name),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),

          },
        ],
      })
      await fetchUnits();
      setInternCourse(internCourses.data)
      setInternCourse({ name: "", code: "" })
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Added Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
      setIsBtn(false)
    } catch (err) {setIsBtn(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
  }

  const handleClear = (e) => {
    e.preventDefault();
    setInternCourse({ code: "", name: "" });
    setShowAlert(
      <>
        <TaskAltIcon
          sx={{ fontSize: "100px", color: "green" }}
        />
        <p style={{ fontSize: "20px", fontWeight: 900 }}>
          {"Cleared Successfully"}
        </p>
      </>
    );
    handleClickOpenerr();

  }

  //id for login...

  let loginid = localStorage.LoginUserId;

  //unit updateby edit page...
  let updateby = internCourseedit?.updatedby;
  let addedby = internCourseedit?.addedby;

  //edit post call
  let unit_id = getrowid._id
  const sendRequestEdit = async () => {
    try {
      let branches = await axios.put(`${SERVICE.INTERNCOURSE_SINGLE}/${unit_id}`, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        code: String(internCourseedit.code),
        name: String(internCourseedit.name),
        updatedby: [
          ...updateby, {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      })
      await fetchUnits();
      setInternCourseedit(branches.data);
      handleCloseModEdit();
      setShowAlert(
        <>
          <TaskAltIcon
            sx={{ fontSize: "100px", color: "green" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
     } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (internCourse.code === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Code "}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (internCourse.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Name"}</p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }

  }

  const editSubmit = (e) => {
    e.preventDefault();
    const isCodeMatch = internCoursesArrayEdit.some((item) => item.code?.toLowerCase() === internCourseedit.code?.toLowerCase())
    const isNameMatch = internCoursesArrayEdit.some((item) => item.name?.toLowerCase() === internCourseedit.name?.toLowerCase() )
      
    if (internCourseedit.code === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Code"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (internCourseedit.name === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Enter Name"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (isCodeMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Code Already Exists!"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
          <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Name Already Exists!"}</p>
        </>
      );
      handleClickOpenerr();
    }
    else {
      sendRequestEdit();
    }
  }

  useEffect(
    () => {

      getexcelDatas();

    }, [internCourses]
  );
  useEffect(
    () => {
      fetchUnits();

    }, []
  );

  let total = 0;
  const [items, setItems] = useState([]);

  const addSerialNumber = () => {
    const itemsWithSerialNumber = internCourses?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
    setItems(itemsWithSerialNumber);
  }

  useEffect(() => {
    addSerialNumber();
  }, [internCourses])


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

  //table sorting end
  let sno = 1;

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
    { field: "code", headerName: "Code", flex: 0, width: 150, hide: !columnVisibility.code, headerClassName: "bold-header" },
    { field: "name", headerName: "Name", flex: 0, width: 150, hide: !columnVisibility.name, headerClassName: "bold-header" },

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
          {isUserRoleCompare?.includes("einterncourse") && (
            <Button sx={userStyle.buttonedit} onClick={() => {
              handleClickOpenEdit();
              getCode(params.row.id)
            }}><EditOutlinedIcon style={{ fontsize: 'large' }} /></Button>
          )}
          {isUserRoleCompare?.includes("dinterncourse") && (
            <Button sx={userStyle.buttondelete} onClick={(e) => { handleClickOpen(); rowData(params.row.id) }}><DeleteOutlineOutlinedIcon style={{ fontSize: 'large' }} /></Button>
          )}
          {isUserRoleCompare?.includes("vinterncourse") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpenview();
                getviewCode(params.row.id);
              }}
            >
              <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
            </Button>
          )}
          {isUserRoleCompare?.includes("iinterncourse") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                handleClickOpeninfo();
                getinfoCode(params.row.id);
              }}
            >
              <InfoOutlinedIcon style={{ fontsize: "large" }} />
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
      code: item.code,
      name: item.name,

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

  const [fileFormat, setFormat] = useState('')
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = fileFormat === "xl" ? '.xlsx' : '.csv';
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }


  const handleExportXL = (isfilter) => {
    if (isfilter === "filtered") {
      exportToCSV(
        rowDataTable?.map((t, index) => ({
          "Sno": index + 1,
          "Code": t.code,
          "Name": t.name,
        })),
        fileName,
      );
    } else if (isfilter === "overall") {
      exportToCSV(
        internCoursesArray.map((t, index) => ({
          "Sno": index + 1,
          "Code": t.code,
          "Name": t.name,
        })),
        fileName,
      );

    }

    setIsFilterOpen(false)
  };



  return (
    <div>
      <Headtitle title={"INTERNCOURSE"} />
      <Typography sx={userStyle.HeaderText}>
        Intern Courses
      </Typography>
      {isUserRoleCompare?.includes("ainterncourse") && (
        <>
          <Box sx={userStyle.container}>
            <Typography sx={userStyle.SubHeaderText}>Add Intern Course</Typography>
            <>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={4} sm={12} sx={12}>
                  <FormControl fullWidth size="small" >
                    <Typography>Code <b style={{ color: "red" }}>*</b></Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Code"
                      value={internCourse.code}
                      onChange={(e) => { setInternCourse({ ...internCourse, code: e.target.value }) }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} sx={12}>
                  <FormControl fullWidth size="small" >
                    <Typography>Name <b style={{ color: "red" }}>*</b></Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Name"
                      value={internCourse.name}
                      onChange={(e) => { setInternCourse({ ...internCourse, name: e.target.value }) }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <br />
              {/* <Grid container>
                <Button variant="contained" style={{ marginLeft: "55em" }} onClick={handleSubmit}>Create</Button>
              </Grid> */}
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={6}>

                  <Button variant="contained" onClick={handleSubmit} disabled={isBtn}>
                    Create
                  </Button>
                </Grid>
                <Grid item md={2.5} xs={12} sm={6}>
                  <Button sx={userStyle.btncancel} onClick={handleClear}>Clear</Button>

                </Grid>
              </Grid>
            </>
          </Box>
          <br />
        </>
      )}
      {isUserRoleCompare?.includes("linterncourse") && (
        <>
          <Box sx={userStyle.container}>
            { /* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>Intern Course List</Typography>
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
                    {/* <MenuItem value={(internCourses?.length)}>All</MenuItem> */}
                  </Select>
                </Box>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box >
                  {isUserRoleCompare?.includes("excelinterncourse") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchInterncourse()
                        setFormat("xl")
                      }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvinterncourse") && (
                    <>
                      <Button onClick={(e) => {
                        setIsFilterOpen(true)
                        fetchInterncourse()
                        setFormat("csv")
                      }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                    </>
                  )}
                  {isUserRoleCompare?.includes("printinterncourse") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfinterncourse") && (
                    <>
                      <Button sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true)
                          fetchInterncourse()
                        }}
                      ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imageinterncourse") && (
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

            {isUserRoleCompare?.includes("bdinterncourse") && (
              <Button variant="contained" color="error" onClick={handleClickOpenalert} >Bulk Delete</Button>)}

            <br />
            <br></br>
            {!isInterncourse ?
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
              <Typography sx={userStyle.SubHeaderText}>Edit Intern Course</Typography>
              <br />    <br />
              <Grid container spacing={2}>
                <Grid item md={6} sm={12} sx={12}>
                  <FormControl fullWidth size="small" >
                    <Typography>Code <b style={{ color: "red" }}>*</b></Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Code"
                      value={internCourseedit.code}
                      onChange={(e) => { setInternCourseedit({ ...internCourseedit, code: e.target.value }) }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={12} sx={12}>
                  <FormControl fullWidth size="small" >
                    <Typography>Name <b style={{ color: "red" }}>*</b></Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Name"
                      value={internCourseedit.name}
                      onChange={(e) => { setInternCourseedit({ ...internCourseedit, name: e.target.value }) }}
                    />
                  </FormControl><br /><br />
                </Grid>
                <Grid container>
                  <br />
                  <Grid item md={0.3}></Grid>
                  <Button variant="contained" onClick={editSubmit} >Update</Button>
                  <Grid item md={0.4}></Grid>
                  <Button sx={userStyle.btncancel} onClick={handleCloseModEdit} >Cancel</Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </Dialog>
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
              <Button onClick={(e) => delIntern(internCourseId)} autoFocus variant="contained" color='error'> OK </Button>
            </DialogActions>
          </Dialog>
          {/* print layout */}
          <TableContainer component={Paper} sx={userStyle.printcls}>
            <Table sx={{ minWidth: 700, }} aria-label="customized table" id="usertable" ref={componentRef}>
              <TableHead sx={{ fontWeight: "600" }}>
                <StyledTableRow>
                  <StyledTableCell> Sno</StyledTableCell>
                  <StyledTableCell>Code </StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody align="left">
                {rowDataTable &&
                  (rowDataTable?.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>{index + 1}</StyledTableCell>
                      <StyledTableCell>{row.code}</StyledTableCell>
                      <StyledTableCell>{row.name}</StyledTableCell>
                    </StyledTableRow>
                  )))}
              </TableBody>

            </Table>
          </TableContainer>

        </Box>

        {/* view model */}
        <Dialog
          open={openview}
          onClose={handleClickOpenview}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
        >
          <Box sx={{ width: "550px", padding: '20px 50px' }}>
            <>
              <Typography sx={userStyle.HeaderText}> View Intern Course </Typography>
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={6} xs={12} sm={12} >
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Name</Typography>
                    <Typography>{internCourseedit.name}</Typography>
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12} >
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Code</Typography>
                    <Typography>{internCourseedit.code}</Typography>
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br />  <br />
              <Grid container spacing={2}>
                <Button variant="contained" color="primary" onClick={handleCloseview}> Back </Button>
              </Grid>
            </>
          </Box>
        </Dialog>

        {/* this is info view details */}


        <Dialog
          open={openInfo}
          onClose={handleCloseinfo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box sx={{ width: '550px', padding: '20px 50px' }}>
            <>
              <Typography sx={userStyle.HeaderText}>Intern Course Info</Typography>
              <br /><br />
              <Grid container spacing={2}>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">addedby</Typography>
                    <Table>
                      <TableHead>
                        <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"UserName"}</StyledTableCell>
                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {addedby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                            <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                            <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </FormControl>
                </Grid>
                <Grid item md={12} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography variant="h6">Updated by</Typography>
                    <Table>
                      <TableHead>
                        <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"UserName"}</StyledTableCell>
                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                      </TableHead>
                      <TableBody>
                        {updateby?.map((item, i) => (
                          <StyledTableRow>
                            <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                            <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                            <StyledTableCell sx={{ padding: '5px 10px !important' }}> {moment(item.date).format('DD-MM-YYYY hh:mm:ss a')}</StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </FormControl>
                </Grid>
              </Grid>
              <br /> <br /><br />
              <Grid container spacing={2}>
                <Button variant="contained" onClick={handleCloseinfo}> Back </Button>
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
                onClick={(e) => delInterncheckbox(e)}
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

        {/*Export XL Data  */}
        <Dialog open={isFilterOpen} onClose={handleCloseFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>

            <IconButton
              aria-label="close"
              onClick={handleCloseFilterMod}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>

            {fileFormat === 'xl' ?
              <FaFileExcel style={{ fontSize: "70px", color: "green" }} />
              : <FaFileCsv style={{ fontSize: "70px", color: "green" }} />
            }
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              Choose Export
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus variant="contained"
              onClick={(e) => {
                handleExportXL("filtered")
              }}
            >
              Export Filtered Data
            </Button>
            <Button autoFocus variant="contained"
              onClick={(e) => {
                handleExportXL("overall")
                fetchInterncourse()
              }}
            >
              Export Over All Data
            </Button>
          </DialogActions>
        </Dialog>
        {/*Export pdf Data  */}
        <Dialog open={isPdfFilterOpen} onClose={handleClosePdfFilterMod} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ textAlign: "center", alignItems: "center", justifyContent: "center" }}>
            <IconButton
              aria-label="close"
              onClick={handleClosePdfFilterMod}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>

            <PictureAsPdfIcon sx={{ fontSize: "80px", color: "red" }} />
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              Choose Export
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={(e) => {
                downloadPdf("filtered")
                setIsPdfFilterOpen(false);
              }}
            >
              Export Filtered Data
            </Button>
            <Button variant="contained"
              onClick={(e) => {
                downloadPdf("overall")
                setIsPdfFilterOpen(false);
              }}
            >
              Export Over All Data
            </Button>
          </DialogActions>
        </Dialog>
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
    </div>
  );
};

export default InternCourse;