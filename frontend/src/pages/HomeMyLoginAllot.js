import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, FormGroup, FormControlLabel, OutlinedInput, TableBody, TableRow, TableCell, Select, Paper, MenuItem, Dialog, DialogContent, DialogActions, FormControl, Grid, Table, TableHead, TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton } from "@mui/material";
import { userStyle } from "../pageStyle";
import { FaFileCsv, FaFileExcel, FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../components/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../services/Baseservice";
import { handleApiError } from "../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import StyledDataGrid from "../components/TableStyle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { UserRoleAccessContext } from "../context/Appcontext";
import { AuthContext } from "../context/Appcontext";
import Headtitle from "../components/Headtitle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LoadingButton from "@mui/lab/LoadingButton";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";



const HomeMyLoginAllot = () => {
    const [selectedRows, setSelectedRows] = useState([]);
    const [items, setItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [loader, setLoader] = useState(false)
    const [copiedData, setCopiedData] = useState("");



    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    const { auth } = useContext(AuthContext);

    const { isUserRoleAccess, isUserRoleCompare, listPageAccessMode, pageName, setPageName, buttonStyles, isAssignBranch } = useContext(UserRoleAccessContext);




    // Error Popup model
    const [isErrorOpendialog, setIsErrorOpendialog] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpendialog(true);
    };

    const [loginAllottedList, setLoginAllotedList] = useState([]);



    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);


    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        projectvendor: true,
        userid: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);



    //serial no for listing items
    const addSerialNumber = () => {
        const itemsWithSerialNumber = loginAllottedList?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [loginAllottedList]);


    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = items?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }



    const columnDataTable = [

        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "projectvendor", headerName: "Project", flex: 0, width: 300, hide: !columnVisibility.projectvendor, headerClassName: "bold-header" },
        { field: "userid", headerName: "User ID", flex: 0, width: 300, hide: !columnVisibility.userid, headerClassName: "bold-header" },

    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            projectvendor: item.projectvendor,
            userid: item.userid,
        };
    });

    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.id),
    }));


    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));
    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };




    const fetchLoginAllotedList = async () => {
        // setPageName(!pageName)
        try {
            setLoader(true);


            let res = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const answer = res?.data?.clientuserid
                .filter(d => d.allotted === "allotted")
                .map(item => {
                    const lastLog = item.loginallotlog[item.loginallotlog.length - 1];
                    return {
                        ...lastLog,
                        projectvendor: item.projectvendor
                    };
                });

            let finalData = answer.filter(data => data.empname === isUserRoleAccess.companyname)
            setLoginAllotedList(finalData.filter((item, index) => index <= 5));
            setLoader(false);
        } catch (err) {
            setLoader(false);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    useEffect(() => {
        fetchLoginAllotedList();
    }, []);


    return (
        <>

            {isUserRoleCompare?.includes("lmyloginallot") && (


                <Grid item xs={12} md={7} sm={7} >

                    <Box sx={{ ...userStyle?.homepagecontainer, padding: "16px 5px" }}>
                        <Typography sx={{ fontWeight: "700", paddingLeft: "16px", paddingTop: "16px" }}>My Login Allot</Typography>
                        <br />
                        <br />

                        <Grid container spacing={2} sx={{ padding: "0px 20px" }}>

                            {loader ? (
                                <>
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px' }}>
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
                                    </Grid>
                                </>
                            ) : (

                                // <TableContainer component={Paper}>
                                //     <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable" >
                                //         <TableHead sx={{ fontWeight: "600" }}>
                                //             <StyledTableRow>
                                //                 <StyledTableCell>SNo</StyledTableCell>
                                //                 <StyledTableCell>Project</StyledTableCell>
                                //                 <StyledTableCell>User Id</StyledTableCell>
                                //             </StyledTableRow>
                                //         </TableHead>
                                //         <TableBody>
                                //             {loginAllottedList.length > 0 ? loginAllottedList.map((row, index) => {
                                //                 return (
                                //                     <StyledTableRow key={index}>
                                //                         <StyledTableCell>{index + 1}</StyledTableCell>
                                //                         <StyledTableCell>{row.projectvendor}</StyledTableCell>
                                //                         <StyledTableCell>{row.userid}</StyledTableCell>
                                //                     </StyledTableRow>
                                //                 )
                                //             }) :
                                //                 <StyledTableRow>
                                //                     <StyledTableCell colSpan={8} align="center">No Data Available</StyledTableCell> </StyledTableRow>

                                //             }

                                //         </TableBody>
                                //     </Table>
                                // </TableContainer>
                                <>

                                    <Box
                                        style={{
                                            width: "100%",
                                            overflowY: "hidden", // Hide the y-axis scrollbar
                                        }}
                                    >
                                        <StyledDataGrid onClipboardCopy={(copiedString) => setCopiedData(copiedString)} rows={rowsWithCheckboxes} columns={columnDataTable.filter((column) => columnVisibility[column.field])} onSelectionModelChange={handleSelectionChange} selectionModel={selectedRows} autoHeight={true} density="compact" hideFooter getRowClassName={getRowClassName} disableRowSelectionOnClick />
                                    </Box>

                                </>

                            )}

                        </Grid>
                        <br />
                        <Grid container sx={{ justifyContent: "flex-end", marginTop: "auto" }}>

                            <Link to="/updatepages/individualloginallotlist" target="_blank">
                                <Button variant="contained" sx={{ backgroundColor: '#ff5e65', borderRadius: "13px", textTransform: "capitalize", fontWeight: "bold" }} size="small">
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

export default HomeMyLoginAllot;
