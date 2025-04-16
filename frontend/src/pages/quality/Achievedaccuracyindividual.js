import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, OutlinedInput, Paper, Popover, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import CircularProgress, {
    circularProgressClasses,
} from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import axios from "axios";
import domtoimage from 'dom-to-image';
import * as FileSaver from 'file-saver';
import { saveAs } from "file-saver";
import { CsvBuilder } from "filefy";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaDownload, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaTrash } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from "../../components/AggridTable";
import AlertDialog from "../../components/Alert";
import {
    DeleteConfirmation,
    PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import SendToServer from "../sendtoserver";



function FacebookCircularProgress(props) {
    return (
        <Box sx={{ position: "relative" }}>
            <CircularProgress
                variant="determinate"
                sx={{
                    color: (theme) =>
                        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
                }}
                size={40}
                thickness={4}
                {...props}
                value={100}
            />
            <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={{
                    color: (theme) =>
                        theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
                    animationDuration: "550ms",
                    position: "absolute",
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: "round",
                    },
                }}
                size={40}
                thickness={4}
                {...props}
            />
        </Box>
    );
}

function AcheivedAccurayIndividual() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [filteredRowDatapopviewall, setFilteredRowDataviewall] = useState([]);
    const [filteredChangespopviewall, setFilteredChangespopviewall] = useState(null);

    const [overallItems, setOverallItems] = useState([]);
    const [overallItemsviewall, setOverallItemsviewall] = useState([]);

    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("")
    const [isHandleChangeNew, setIsHandleChangeNew] = useState(false);
    const [searchedStringNew, setSearchedStringNew] = useState("")
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
    }

    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Achieved Accuracy Individual"),
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

    useEffect(() => {
        getapi();
    }, []);


    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, isAssignBranch,
        buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const [loader, setLoader] = useState(false);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [openview, setOpenview] = useState(false);
    const [openInfo, setOpeninfo] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [fileNameID, setFileNameID] = useState("");


    const [btnSubmit, setBtnSubmit] = useState(false);
    const [productionoriginalviewAll, setProductionoriginalViewAll] = useState(
        []
    );

    const [btnUpload, setBtnUpload] = useState(true);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    const [isFilterOpen2, setIsFilterOpen2] = useState(false);
    const [isPdfFilterOpen2, setIsPdfFilterOpen2] = useState(false);

    let exportColumnNames = ["Date", "Project", "Vendor", "Queue", "File Name", "Added By", "Added Date&Time",];
    let exportRowValues = ["date", "project", "vendor", "queue", "filename", "addedby", "addedbydatetime"];
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const handleCloseFilterMod2 = () => {
        setIsFilterOpen2(false);
    };

    const handleClosePdfFilterMod2 = () => {
        setIsPdfFilterOpen2(false);
    };


    const [dataArrayLength, setDataArrayLength] = useState([]);
    const [AlertButton, setAlertButton] = useState(false);
    const [dataupdated, setDataupdated] = useState("");
    const [fileupload, setFileupload] = useState([]);
    const [show, setShow] = useState(false);
    const [fileName, setFileName] = useState("");
    const [dayPointsUploadOverallData, setDayPiontsUploadOverallData] = useState(
        []
    );
    const [achievedAccuracyIndividualList, setAchievedAccuracyIndividualList] = useState([]);

    const [openviewAll, setOpenviewAll] = useState(false);

    const handleClickOpenviewAll = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setOpenviewAll(true);
    };

    const [fileNameView, setFileNameView] = useState("");
    const [pageSizeviewAll, setPageSizeviewAll] = useState(10);
    const [searchQueryviewAll, setSearchQueryviewAll] = useState("");
    const [searchQueryManageviewAll, setSearchQueryManageviewAll] = useState("");
    const [pageviewAll, setPageviewAll] = useState(1);



    const gridRefviewall = useRef(null);



    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        date: true,
        project: true,
        vendor: true,
        queue: true,
        filename: true,
        addedby: true,
        addedbydatetime: true,

        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const [productionfirstViewCheck, setProductionfirstViewcheck] =
        useState(false);

    const initialColumnVisibilityviewAll = {
        serialNumber: true,
        date: true,
        project: true,
        vendor: true,
        queue: true,
        loginid: true,
        accuracy: true,
        totalfield: true,
        actions: true,
    };

    const [columnVisibilityviewAll, setColumnVisibilityviewAll] = useState(
        initialColumnVisibilityviewAll
    );



    let exportColumnNamesall = ["Date", "Project", "Vendor", "Queue", "Login ID", "Accuracy", "Total Field",];
    let exportRowValuesall = ["date", "project", "vendor", "queue", "loginid", "accuracy", "totalfield"];



    const gridRefTableImgViewall = useRef(null);
    // image
    const handleCaptureImageviewall = () => {
        if (gridRefTableImgViewall.current) {
            domtoimage.toBlob(gridRefTableImgViewall.current)
                .then((blob) => {
                    saveAs(blob, fileNameView);
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };


    // datavallist:datavallist,
    const columnDataTableviewAll = [
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 70,
            hide: !columnVisibilityviewAll.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 100,
            hide: !columnVisibilityviewAll.date,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "project",
            headerName: "Project",
            flex: 0,
            width: 120,
            hide: !columnVisibilityviewAll.project,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "vendor",
            headerName: "Vendor",
            flex: 0,
            width: 120,
            hide: !columnVisibilityviewAll.vendor,
            headerClassName: "bold-header",
        },
        {
            field: "queue",
            headerName: "Queue",
            flex: 0,
            width: 120,
            hide: !columnVisibilityviewAll.queue,
            headerClassName: "bold-header",
        },
        {
            field: "loginid",
            headerName: "Login ID",
            flex: 0,
            width: 120,
            hide: !columnVisibilityviewAll.loginid,
            headerClassName: "bold-header",
        },
        {
            field: "accuracy",
            headerName: "Accuracy",
            flex: 0,
            width: 120,
            hide: !columnVisibilityviewAll.accuracy,
            headerClassName: "bold-header",
        },
        {
            field: "totalfield",
            headerName: "Total Field",
            flex: 0,
            width: 120,
            hide: !columnVisibilityviewAll.totalfield,
            headerClassName: "bold-header",
        },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 80,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex", gap: "20px" }}>
                    {isUserRoleCompare?.includes("eacheivedaccuracyindividual") && (
                        <Link
                            to={`/quality/accuracy/acheivedaccuracyindividualedit/${params.data.id}/${fileNameID}`}
                        >
                            <Button sx={{ minWidth: "40px" }}>
                                <EditOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonedit} />
                            </Button>
                        </Link>
                    )}
                </Grid>
            ),
        },
    ];

    //Datatable
    const handlePageChangeviewAll = (newPage) => {
        setPageviewAll(newPage);
    };

    const handlePageSizeChangeviewAll = (event) => {
        setPageSizeviewAll(Number(event.target.value));
        setPageviewAll(1);
    };

    //datatable....
    const handleSearchChangeviewAll = (event) => {
        setSearchQueryviewAll(event.target.value);
        setPageviewAll(1);
    };

    // Show All Columns functionality
    const handleShowAllColumnsviewAll = () => {
        const updatedVisibility = { ...columnVisibilityviewAll };
        for (const columnKey in updatedVisibility) {
            updatedVisibility[columnKey] = true;
        }
        setColumnVisibilityviewAll(updatedVisibility);
    };

    // // Function to filter columns based on search query
    const filteredColumnsviewAll = columnDataTableviewAll.filter((column) =>
        column.headerName
            .toLowerCase()
            .includes(searchQueryManageviewAll.toLowerCase())
    );

    // Manage Columnsviewall
    const [isManageColumnsOpenviewAll, setManageColumnsOpenviewAll] =
        useState(false);
    const [anchorElviewAll, setAnchorElviewAll] = useState(null);

    const handleOpenManageColumnsviewAll = (event) => {
        setAnchorElviewAll(event.currentTarget);
        setManageColumnsOpenviewAll(true);
    };
    const handleCloseManageColumnsviewAll = () => {
        setManageColumnsOpenviewAll(false);
        setSearchQueryManageviewAll("");
    };

    // JSX for the "Manage Columns" popover content
    const manageColumnsContentviewAll = (
        <Box
            style={{
                padding: "10px",
                minWidth: "325px",
                "& .MuiDialogContent-root": { padding: "10px 0" },
            }}
        >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumnsviewAll}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: "relative", margin: "10px" }}>
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManageviewAll}
                    onChange={(e) => setSearchQueryManageviewAll(e.target.value)}
                    sx={{ marginBottom: 5, position: "absolute" }}
                />
            </Box>
            <br />
            <br />
            <DialogContent
                sx={{ minWidth: "auto", height: "200px", position: "relative" }}
            >
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumnsviewAll.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibilityviewAll[column.field]}
                                        onChange={() => toggleColumnVisibilityviewAll(column.field)}
                                    />
                                }
                                secondary={
                                    column.field === "checkbox" ? "Checkbox" : column.headerName
                                }
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
                            sx={{ textTransform: "none" }}
                            onClick={() =>
                                setColumnVisibilityviewAll(initialColumnVisibilityviewAll)
                            }
                        >
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => {
                                const newColumnVisibility = {};
                                columnDataTableviewAll.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibilityviewAll(newColumnVisibility);
                            }}
                        >
                            Hide All
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Box>
    );


    // Manage Columns functionality
    const toggleColumnVisibilityviewAll = (field) => {
        setColumnVisibilityviewAll((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };

    const handleCloseviewAll = () => {
        setOpenviewAll(false);
        setProductionoriginalViewAll([]);
        setSearchQueryviewAll("");
        setPageviewAll(1);
        setPageSizeviewAll(10)
        setColumnVisibilityviewAll(initialColumnVisibilityviewAll);
    };

    const [documentFiles, setdocumentFiles] = useState([]);
    const ExportsHead = () => {
        new CsvBuilder("Achieved Accuracy Individual")
            .setColumns([

                "Login ID",
                "Accuracy",
                "Total Fields",

            ])
            .exportFile();
    };

    const sendJSON = async () => {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
            }
        };

        // Ensure that items is an array of objects before sending
        if (dataArrayLength === 0 && acheivedAccuracyDetails.date === "") {

            setPopupContentMalert("No data to upload!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
            return;
        }

        setPageName(!pageName)
        try {
            // setLoading(true); // Set loading to true when starting the upload
            xmlhttp.open("POST", SERVICE.ADDACHEIVEDACCURACYINDIVIDUAL);
            xmlhttp.setRequestHeader(
                "Content-Type",
                "application/json;charset=UTF-8"
            );
            xmlhttp.send(JSON.stringify(items));
            await fetchAllAChievedAccuracyIndividual();
            setFileName("")
            setDataArrayLength([])
            setShow(false)
            setAlertButton(false)
            setdocumentFiles([]);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        } finally {
            // setLoading(false); // Set loading back to false when the upload is complete

            setPopupContent("Uploaded Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            await fetchAllAChievedAccuracyIndividual();
            setFileName("")
            setDataArrayLength([])
            setShow(false)
            setAlertButton(false)

        }
    };

    const fetchAllAChievedAccuracyIndividual = async () => {
        setPageName(!pageName)
        try {
            let res_queue = await axios.get(SERVICE.GETACHEIVEDACCURACYINDIVIDUAL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAchievedAccuracyIndividualList(res_queue.data.achievedaccuracyindividual);
            let answer = res_queue?.data?.achievedaccuracyindividual
                .map((data) => data.uploaddata)
                .flat();
            setDayPiontsUploadOverallData(answer);
            fetchEmployee();

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const [achievedAccuracyIndividualListArray, setAchievedAccuracyIndividualListArray] = useState([])
    const fetchAllAChievedAccuracyIndividualArray = async () => {
        setPageName(!pageName)
        try {
            let res_queue = await axios.get(SERVICE.GETACHEIVEDACCURACYINDIVIDUAL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAchievedAccuracyIndividualListArray(res_queue.data.achievedaccuracyindividual.map((row, index) =>
            ({
                ...row,
                serialNumber: index + 1,
                date: moment(row.date).format('DD-MM-YYYY'),
                addedby: row.addedby?.length > 0 ? row?.addedby[0]?.name : "",
                addedbydatetime: row.addedby?.length > 0 ? moment(row?.addedby[0]?.date).format("DD-MM-YYYY hh:mm:ss A") : "",
            })));
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchAllAChievedAccuracyIndividualArray()
    }, [isFilterOpen])


    const [overallFilterdata, setOverallFilterdata] = useState([]);
    const [overallData, setOverallData] = useState([]);
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchEmployee = async () => {
        setPageName(!pageName)

        try {
            let res_employee = await axios.post(SERVICE.ACHEIVEDACCURACYINDIVIDUAL_SORT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                page: Number(page),
                pageSize: Number(pageSize),
                searchQuery: searchQuery
            });

            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
            const ansOverall = res_employee?.data?.totalProjectsOverallData?.length > 0 ? res_employee?.data?.totalProjectsOverallData : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (page - 1) * pageSize + index + 1,
                // serialNumber: index + 1,
            }));
            const itemsWithSerialNumberoverall = ansOverall?.map((item, index) => ({
                ...item,
                serialNumber: index + 1,
                // serialNumber: index + 1,
            }));

            //   setcheckemployeelist(true);
            setOverallFilterdata(itemsWithSerialNumber.map((item, index) => {
                return {
                    id: item._id,
                    serialNumber: item.serialNumber,
                    project: item.project,
                    vendor: item.vendor,
                    queue: item.queue,
                    filename: item.filename,
                    date: moment(item.date).format("DD-MM-YYYY"),
                    addedby: item.addedby?.length > 0 ? item?.addedby[0]?.name : "",
                    addedbydatetime: item.addedby?.length > 0 ? moment(item?.addedby[0]?.date).format("DD-MM-YYYY hh:mm:ss A") : "",

                };
            }));
            setOverallData(itemsWithSerialNumberoverall.map((item, index) => {
                return {
                    id: item._id,
                    serialNumber: item.serialNumber,
                    project: item.project,
                    vendor: item.vendor,
                    queue: item.queue,
                    filename: item.filename,
                    date: moment(item.date).format("DD-MM-YYYY"),
                    addedby: item.addedby?.length > 0 ? item?.addedby[0]?.name : "",
                    addedbydatetime: item.addedby?.length > 0 ? moment(item?.addedby[0]?.date).format("DD-MM-YYYY hh:mm:ss A") : "",

                };
            }));
            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);

            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });
            setLoader(true);
        } catch (err) {
            setLoader(true);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }

    };
    const [searchQuery, setSearchQuery] = useState("");


    useEffect(() => {
        fetchEmployee();
    }, [page, pageSize]);



    const [itemsFilterdata, setItemsFilterdata] = useState([]);

    const addSerialNumber = (datas) => {
        setItemsFilterdata(datas);

    };

    useEffect(() => {
        addSerialNumber(overallFilterdata);
    }, [overallFilterdata]);


    const [itemsviewAll, setItemsviewAll] = useState([]);

    const addSerialNumberviewAll = (datas) => {
       
        setItemsviewAll(datas);

    };

    useEffect(() => {
        addSerialNumberviewAll(productionoriginalviewAll);
    }, [productionoriginalviewAll]);

    const clearFileSelection = () => {
        setFileupload([]);
        setFileName("");
        setItems("");
        readExcel(null);
        setShow(false);
        setAlertButton(false);
        setDataupdated("");

        setdocumentFiles([]);
    };


    let today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;






    const readExcel = (file, name, e) => {
        if (
            name?.split(".")[1] === "xlsx" ||
            name?.split(".")[1] === "xls" ||
            name?.split(".")[1] === "csv"
        ) {
            const resume = e.target.files;

            let documentarray;
            const reader = new FileReader();
            const files = resume[0];
            reader.readAsDataURL(files);
            reader.onload = () => {
                documentarray = [
                    {
                        name: files.name,
                        preview: reader.result,
                        data: reader.result.split(",")[1],
                        remark: "resume file",
                    },
                ];
            };

            const promise = new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file);

                fileReader.onload = (e) => {
                    const bufferArray = e.target.result;
                    const wb = XLSX.read(bufferArray, { type: "buffer" });
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];

                    // Convert the sheet to JSON
                    const data = XLSX.utils.sheet_to_json(ws);

                    resolve(data);
                };
                fileReader.onerror = (error) => {
                    reject(error);
                };
            });
            promise.then((d) => {


                const dataArray = d.map((item, index) => ({

                    date: acheivedAccuracyDetails.date,
                    project: acheivedAccuracyDetails.project,
                    vendor: acheivedAccuracyDetails.vendor,
                    queue: acheivedAccuracyDetails.queue,
                    loginid: item["Login ID"],
                    accuracy: !isNaN(item["Accuracy"]) ? (item["Accuracy"] * 100).toFixed(2) : item["Accuracy"],
                    totalfield: item["Total Fields"],
                    filename: name.split(".")[0],


                }

                ));




                const uniqueCombinationstime = new Set();

                // Filter and deduplicate CATEGORIES
                const filteredArray1time = dayPointsUploadOverallData.filter((item) => {

                    const combination = `${item.date}-${item.project}-${item.vendor}-${item.queue}-${item.loginid?.toLowerCase()}-${item.accuracy}-${item.totalfield}`;


                    if (!uniqueCombinationstime.has(combination)) {
                        uniqueCombinationstime.add(combination);
                        return true;
                    }
                    return false;
                });
                // Filter and deduplicate EXCEL DATA
                const filteredArray2time = dataArray.some(
                    (data) => data.loginid !== undefined
                )
                    ? dataArray.filter((item) => {
                        const combination = `${item.date}-${item.project}-${item.vendor}-${item.queue}-${item.loginid?.toLowerCase()}-${item.accuracy}-${item.totalfield}`;
                        if (!uniqueCombinationstime.has(combination)) {
                            uniqueCombinationstime.add(combination);
                            return true;
                        }
                        return false;
                    })
                    : [];
                // const name =

                const ans = [
                    {
                        filename: name.split(".")[0],
                        date: acheivedAccuracyDetails.date,
                        project: acheivedAccuracyDetails.project,
                        vendor: acheivedAccuracyDetails.vendor,
                        queue: acheivedAccuracyDetails.queue,
                        uploaddata: filteredArray2time,
                        document: [...documentarray],
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    },
                ];

                setItems(ans);
                setShow(true);
                setAlertButton(true);
                setDataArrayLength(filteredArray2time.length);
            });
        }
    };

    const [isSubmit, setIsSubmit] = useState(false);
    const [isSubmitEdit, setIsSubmitEdit] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");



    const [isEditOpen, setIsEditOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [itemsList, setItemsList] = useState([]);
    const [copiedData, setCopiedData] = useState("");
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // Show All Columns & Manage Columns




    const [accuracyMasterArray, setAccuracyMasterArray] = useState([]);


    useEffect(() => {
        fetchAccuracyMaster();
        fetchAllAChievedAccuracyIndividual();
    }, []);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);


    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);
    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibility");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);


    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };
    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setBtnSubmit(false);
    };
    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };

    const ResetFunc = () => {
        fetchAllAChievedAccuracyIndividual();
        setItems([]);
        setFileName("");
        setShow(false);
        setFileupload("");
        setAlertButton(false);
        setDataArrayLength("");
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);

        // ResetFunc();
    };

    // info model
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };
    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    const handleCloseModSubmit = () => {
        setIsSubmit(false);
    };
    const handleCloseModSubmitEdit = () => {
        setIsSubmitEdit(false);
    };
    // page refersh reload
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };
    const username = isUserRoleAccess.username;
    // Manage Columns
    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };
    //Delete model
    const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

    const handleClickOpencheckbox = () => {
        setIsDeleteOpencheckbox(true);
    };
    const handleCloseModcheckbox = () => {
        setIsDeleteOpencheckbox(false);
    };
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

    const handleResumeUpload = async (e) => {
        if (acheivedAccuracyDetails.date === "" || acheivedAccuracyDetails.date === undefined) {

            setPopupContentMalert("Please Fill the Date");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (acheivedAccuracyDetails.project === "Please Select Project" || acheivedAccuracyDetails.project === "" || acheivedAccuracyDetails.project === undefined) {


            setPopupContentMalert("Please Select Project");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (acheivedAccuracyDetails.vendor === "Please Select Vendor" || acheivedAccuracyDetails.vendor === "" || acheivedAccuracyDetails.vendor === undefined) {

            setPopupContentMalert("Please Select Vendor");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else if (acheivedAccuracyDetails.queue === "Please Select Queue" || acheivedAccuracyDetails.queue === "" || acheivedAccuracyDetails.queue === undefined) {


            setPopupContentMalert("Please Select Queue");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        }
        else {
            const file = e.target.files[0];
            setFileupload(file);
            setDataupdated("uploaded");
            readExcel(file, file.name, e);
            setFileName(file.name);
            e.target.value = null;
        }
    }



    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;
    const getRowClassName = (params) => {
        if (selectedRows.includes(params.row.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };


    const [upload, setUpload] = useState([]);




    const [uploadEdit, setUploadEdit] = useState([]);

    const handleResumeUploadEdit = (event) => {
        const resume = event.target.files;
        for (let i = 0; i < resume.length; i++) {
            const reader = new FileReader();
            const file = resume[i];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setUploadEdit((prevFiles) => [
                    ...prevFiles,
                    {
                        name: file.name,
                        preview: reader.result,
                        data: reader.result.split(",")[1],
                        remark: "resume file",
                    },
                ]);
            };
        }
    };
    const renderFilePreviewEdit = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };
    const handleFileDeleteEdit = (index) => {
        setUploadEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };


    const [uploadView, setUploadView] = useState([]);

    const renderFilePreviewView = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const [pageNumber, setPageNumber] = useState(1);

    const gettingValues = async (newValue) => {
        if (newValue.length < 2) {
            setAcheivedAccuracyDetails((prev) => ({
                ...prev, clientstatus: "", internalstatus: ""
            }))
        }
        setPageName(!pageName)
        try {
            let res_data = await axios.post(SERVICE.EXPECTEDACCURACY_SINGLEBYDETAILS, {
                project: acheivedAccuracyDetails.project,
                // vendor: acheivedAccuracyDetails.vendor,
                queue: acheivedAccuracyDetails.queue,
                acheivedaccuracy: Number(newValue)
            })
            res_data.data.existinglist.map((data) => {
                if (data.mode === "Client") {
                    setAcheivedAccuracyDetails((prev) => ({
                        ...prev, clientstatus: `${data.statusmode} ${data.percentage} %`,
                    }))
                }
                if (data.mode === "Internal") {
                    setAcheivedAccuracyDetails((prev) => ({
                        ...prev, internalstatus: `${data.statusmode} ${data.percentage} %`,
                    }))
                }
            })


        } catch (err) {
            setAcheivedAccuracyDetails((prev) => ({ ...prev, clientstatus: "", internalstatus: "" }))
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

        }
    }

    const gettingValuesEdit = async (newValue) => {

        if (newValue.length < 2) {
            setAcheivedAccuracyDetailsEdit((prev) => ({
                ...prev, clientstatus: "", internalstatus: ""
            }))
        }
        setPageName(!pageName)
        try {
            let res_data = await axios.post(SERVICE.EXPECTEDACCURACY_SINGLEBYDETAILS, {
                project: acheivedAccuracyDetailsEdit.project,
                // vendor: acheivedAccuracyDetailsEdit.vendor,
                queue: acheivedAccuracyDetailsEdit.queue,
                acheivedaccuracy: Number(newValue)
            })
            res_data.data.existinglist.map((data) => {
                if (data.mode === "Client") {
                    setAcheivedAccuracyDetailsEdit((prev) => ({
                        ...prev, clientstatus: `${data.statusmode} ${data.percentage} %`,
                    }))
                }
                if (data.mode === "Internal") {
                    setAcheivedAccuracyDetailsEdit((prev) => ({
                        ...prev, internalstatus: `${data.statusmode} ${data.percentage} %`,
                    }))
                }
            })


        } catch (err) {
            setAcheivedAccuracyDetailsEdit((prev) => ({
                ...prev, clientstatus: "", internalstatus: ""
            }))
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

        }
    }

    //options
    const statusModeOptions = [
        { label: "Penalty", value: "Penalty" },
        { label: "Bonus", value: "Bonus" },
    ]
    const modeOptions = [
        { label: "Client", value: "Client" },
        { label: "Internal", value: "Internal" },
    ]

    const [selectedMode, setSelectedMode] = useState("Please Select Mode");
    const [selectedStatusMode, setSelectedStatusMode] = useState("Please Select Status Mode");
    const [acheivedAccuracyDetails, setAcheivedAccuracyDetails] = useState({
        project: "Please Select Project",
        vendor: "Please Select Vendor",
        queue: "Please Select Queue",
        date: "", acheivedaccuracy: "", clientstatus: "", internalstatus: "", minimumaccuracy: ""
    });

    useEffect(() => {
        if (acheivedAccuracyDetails.date === "" || acheivedAccuracyDetails.date === undefined) {

            setBtnUpload(true);

        }
        else if (acheivedAccuracyDetails.project === "Please Select Project" || acheivedAccuracyDetails.project === "" || acheivedAccuracyDetails.project === undefined) {

            setBtnUpload(true);

        }
        else if (acheivedAccuracyDetails.vendor === "Please Select Vendor" || acheivedAccuracyDetails.vendor === "" || acheivedAccuracyDetails.vendor === undefined) {

            setBtnUpload(true);

        }
        else if (acheivedAccuracyDetails.queue === "Please Select Queue" || acheivedAccuracyDetails.queue === "" || acheivedAccuracyDetails.queue === undefined) {

            setBtnUpload(true);

        }
        else {
            setBtnUpload(false);
        }

    }, [acheivedAccuracyDetails])

    const [acheivedAccuracyDetailsEdit, setAcheivedAccuracyDetailsEdit] = useState({
        project: "Please Select Project",
        vendor: "Please Select Vendor",
        queue: "Please Select Queue",
        date: "", acheivedaccuracy: "", clientstatus: "", internalstatus: "", minimumaccuracy: ""
    });

    const [queueOption, setQueueOption] = useState([]);
    const [projectOpt, setProjectopt] = useState([]);
    const [vendorOpt, setVendoropt] = useState([]);

    const [queueOptionEdit, setQueueOptionEdit] = useState([]);
    const [projectOptEdit, setProjectoptEdit] = useState([]);
    const [vendorOptEdit, setVendoroptEdit] = useState([]);

    const [accuracyMasterEdit, setAccuracyMasterEdit] = useState({ project: "Please Select Project", });

    const fetchProjectDropdowns = async () => {
        setPageName(!pageName)
        try {
            let res_category = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const companyall = [
                ...res_category?.data?.projmaster.map((d) => ({
                    ...d,
                    label: d.name,
                    value: d.name,
                })),
            ];

            setProjectopt(companyall);
            setProjectoptEdit(companyall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const fetchVendorDropdowns = async (e) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_project.data.vendormaster.filter((d) => d.projectname === e.value);

            const catall = result.map((d) => ({
                ...d,
                label: d.projectname + '_' + d.name,
                value: d.projectname + '_' + d.name,
            }));

            setVendoropt(catall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchVendorDropdownsEdit = async (e) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_project.data.vendormaster.filter((d) => d.projectname === e);

            const catall = result.map((d) => ({
                ...d,
                label: d.projectname + '_' + d.name,
                value: d.projectname + '_' + d.name,
            }));

            setVendoroptEdit(catall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const fetchQueueDropdowns = async (e) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.ACCURACYMASTERGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_project.data.accuracymaster.filter((d) => d.projectvendor === e.value);

            const catall = result.map((d) => ({
                ...d,
                label: d.queue,
                value: d.queue,
            }));

            setQueueOption(catall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchQueueDropdownsEdit = async (e) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.ACCURACYMASTERGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let result = res_project.data.accuracymaster.filter((d) => d.projectvendor === e);

            const catall = result.map((d) => ({
                ...d,
                label: d.queue,
                value: d.queue,
            }));

            setQueueOptionEdit(catall);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchMinimumaccuracy = async (e, project) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.ACCURACYMASTERGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });


            let result = res_project.data.accuracymaster.filter((d) => (d.queue === e.value && d.projectvendor === project));

            setAcheivedAccuracyDetails((prev) => ({
                ...prev, minimumaccuracy: result[0].minimumaccuracy
            }))

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const fetchMinimumaccuracyEdit = async (e, project) => {
        setPageName(!pageName)
        try {
            let res_project = await axios.get(SERVICE.ACCURACYMASTERGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });


            let result = res_project.data.accuracymaster.filter((d) => (d.queue === e.value && d.projectvendor === project));

            setAcheivedAccuracyDetailsEdit((prev) => ({
                ...prev, minimumaccuracy: result[0].minimumaccuracy
            }))

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    useEffect(() => {
        fetchProjectDropdowns();
    }, []);



    const fetchAccuracyMaster = async () => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ACHEIVEDACCURACYGETALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            // setLoader(true);
            setAccuracyMasterArray(res_freq?.data?.acheivedaccuracy);
        } catch (err) { setLoader(true); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const [idDelete, setIdDelete] = useState("");
    //set function to get particular row
    const rowData = async (id) => {

        setPageName(!pageName)
        try {
            // let res = await axios.get(`${SERVICE.SINGLEACHEIVEDACCURACYINDIVIDUAL}/${id}`, {
            //     headers: {
            //         Authorization: `Bearer ${auth.APIToken}`,
            //     },
            // });
            setIdDelete(id);
            // setAcheivedAccuracyDetailsEdit(res?.data?.sachievedaccuracyindividual);
            handleClickOpen();
        } catch (err) {
            console.log(err);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    // Alert delete popup
    let brandid = acheivedAccuracyDetailsEdit._id;
    const delBrand = async () => {
        setPageName(!pageName)
        try {
            await axios.delete(`${SERVICE.SINGLEACHEIVEDACCURACYINDIVIDUAL}/${idDelete}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            handleCloseMod();
            setSelectedRows([]);
            setPage(1);


            await fetchAccuracyMaster();
            fetchEmployee();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            console.log(err)
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //add function
    const sendRequest = async () => {

        handleCloseModSubmit()
        setPageName(!pageName)
        try {
            await axios.post(SERVICE.ACHEIVEDACCURACY_CREATE, {
                date: String(acheivedAccuracyDetails.date),
                project: String(acheivedAccuracyDetails.project),
                vendor: String(acheivedAccuracyDetails.vendor),
                queue: String(acheivedAccuracyDetails.queue),
                acheivedaccuracy: acheivedAccuracyDetails.acheivedaccuracy,
                clientstatus: acheivedAccuracyDetails.clientstatus,
                internalstatus: acheivedAccuracyDetails.internalstatus,
                minimumaccuracy: acheivedAccuracyDetails.minimumaccuracy,
                files: [...upload],
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchAccuracyMaster();

            setSelectedMode("Please Select Mode")
            setSelectedStatusMode("Please Select Status Mode")
            setAcheivedAccuracyDetails({ ...acheivedAccuracyDetails, date: "", acheivedaccuracy: "", clientstatus: "", internalstatus: "", })
            setUpload([]);
            setBtnSubmit(false);

            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    //Edit model...
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };


    // get single row to view....
    // get single row to view....

    const [productionoriginalViewAllFilter, setProductionoriginalViewAllFilter] = useState([])
    const getviewCodeall = async (id) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.SINGLEACHEIVEDACCURACYINDIVIDUAL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setProductionoriginalViewAllFilter(res?.data?.sachievedaccuracyindividual?.uploaddata.map((row, index) => ({
                ...row,
                serialNumber: index + 1,
                date: moment(row.date).format("DD-MM-YYYY"),
                accuracy: row?.accuracy === null ? "NA" : Number(row?.accuracy) + " %",
            })));
            setProductionoriginalViewAll(res?.data?.sachievedaccuracyindividual?.uploaddata.map((row, index) => ({
                ...row,
                serialNumber: index + 1,
                date: moment(row.date).format("DD-MM-YYYY"),
                accuracy: row?.accuracy === null ? "NA" : Number(row?.accuracy) + " %",
            })));
            setOverallItemsviewall(res?.data?.sachievedaccuracyindividual?.uploaddata.map((row, index) => ({
                ...row,
                serialNumber: index + 1,
                date: moment(row.date).format("DD-MM-YYYY"),
                accuracy: row?.accuracy === null ? "NA" : Number(row?.accuracy) + " %",
            })));
            setFileNameView(res?.data?.sachievedaccuracyindividual?.filename);
            setFileNameID(res?.data?.sachievedaccuracyindividual?._id);
            setProductionfirstViewcheck(true);
            handleClickOpenviewAll();
            await fetchEmployee();
            setProductionfirstViewcheck(false);

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); } finally {
            setProductionfirstViewcheck(true);
            setPageviewAll(1);
            setColumnVisibilityviewAll(initialColumnVisibilityviewAll);
        }
    };



    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.ACHEIVEDACCURACY_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setAcheivedAccuracyDetailsEdit(res?.data?.sacheivedaccuracy);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    //frequency master name updateby edit page...
    let updateby = acheivedAccuracyDetailsEdit.updatedby;
    let addedby = acheivedAccuracyDetailsEdit.addedby;
    let frequencyId = acheivedAccuracyDetailsEdit._id;

    //editing the single data...
    const sendEditRequest = async () => {
        // handleCloseModSubmit()       
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.ACHEIVEDACCURACY_SINGLE}/${frequencyId}`, {

                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                date: String(acheivedAccuracyDetailsEdit.date),
                project: String(acheivedAccuracyDetailsEdit.project),
                vendor: String(acheivedAccuracyDetailsEdit.vendor),
                queue: String(acheivedAccuracyDetailsEdit.queue),
                acheivedaccuracy: acheivedAccuracyDetailsEdit.acheivedaccuracy,
                clientstatus: acheivedAccuracyDetailsEdit.clientstatus,
                internalstatus: acheivedAccuracyDetailsEdit.internalstatus,
                minimumaccuracy: acheivedAccuracyDetailsEdit.minimumaccuracy,
                files: [...uploadEdit],
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            handleCloseModEdit();
            await fetchAccuracyMaster();
            handleCloseModSubmitEdit();

            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };

    const editSubmit = (e) => {
        e.preventDefault();
        if (acheivedAccuracyDetailsEdit.date === "" || acheivedAccuracyDetailsEdit.date === undefined) {

            setPopupContentMalert("Please Fill the Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (acheivedAccuracyDetailsEdit.project === 'Please Select Project') {

            setPopupContentMalert("Please Select Project!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (acheivedAccuracyDetailsEdit.vendor === 'Please Select Vendor') {

            setPopupContentMalert("Please Select Vendor!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (acheivedAccuracyDetailsEdit.queue === "Please Select Queue") {

            setPopupContentMalert("Please Select Queue!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }

        else if (acheivedAccuracyDetailsEdit.acheivedaccuracy === "" || acheivedAccuracyDetailsEdit.acheivedaccuracy === undefined) {

            setPopupContentMalert("Please Enter Achieved Accuracy Value!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    };
    const delAreagrpcheckbox = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.SINGLEACHEIVEDACCURACYINDIVIDUAL}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });
            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);

            await fetchAccuracyMaster();
            await fetchEmployee();



            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Achieved Accuracy Individual.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };

    // pdf.....
    const columns = [
        // { title: "Sno", field: "serialNumber" },
        { title: "Date", field: "date" },
        { title: "Project", field: "project" },
        { title: "Vendor", field: "vendor" },
        { title: "Queue", field: "queue" },
        { title: "File Name", field: "filename" },
        { title: "Added By", field: "addedby" },
        { title: "Added Date&Time", field: "addedbydatetime" },


        // { title: "Code", field: "code" },
    ];

    // Excel
    const fileName1 = "Achieved Accuracy Individual";
    // get particular columns for export excel

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Achieved Accuracy Individual",
        pageStyle: "print",
    });

    //serial no for listing items
    // const addSerialNumber = () => {
    //     const itemsWithSerialNumber = achievedAccuracyIndividualList?.map((item, index) => ({
    //         ...item,
    //         serialNumber: index + 1,
    //     }));
    //     setItemsList(itemsWithSerialNumber);
    // };
    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
        setSelectAllChecked(false);
    };
    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
        setSelectAllChecked(false);
        setPage(1);
    };
    //datatable....
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatas = itemsFilterdata?.filter((item) => {
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });


    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
        </div>
    );
    const columnDataTable = [
        {
            field: "checkbox",
            headerName: "Checkbox",
            headerStyle: {
                fontWeight: "bold", // Apply the font-weight style to make the header text bold
                // Add any other CSS styles as needed
            },
            headerCheckboxSelection: true,
            checkboxSelection: true,
            pinned: 'left',

            sortable: false, // Optionally, you can make this column not sortable
            width: 75,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 75,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "date",
            headerName: "Date",
            flex: 0,
            width: 100,
            hide: !columnVisibility.date,
            headerClassName: "bold-header",
            pinned: 'left',
        },
        {
            field: "project",
            headerName: "Project",
            flex: 0,
            width: 100,
            hide: !columnVisibility.project,
            headerClassName: "bold-header",
        },
        {
            field: "vendor",
            headerName: "Vendor",
            flex: 0,
            width: 200,
            hide: !columnVisibility.vendor,
            headerClassName: "bold-header",
        },
        {
            field: "queue",
            headerName: "Queue",
            flex: 0,
            width: 200,
            hide: !columnVisibility.queue,
            headerClassName: "bold-header",
        },
        {
            field: "filename",
            headerName: "File Name",
            flex: 0,
            width: 200,
            hide: !columnVisibility.filename,
            headerClassName: "bold-header",
        },
        {
            field: "addedby",
            headerName: "Added By",
            flex: 0,
            width: 150,
            hide: !columnVisibility.addedby,
            headerClassName: "bold-header",
        },
        {
            field: "addedbydatetime",
            headerName: "Added Date & Time",
            flex: 0,
            width: 200,
            hide: !columnVisibility.addedbydatetime,
            headerClassName: "bold-header",
        },

        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>

                    {isUserRoleCompare?.includes("dacheivedaccuracyindividual") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vacheivedaccuracyindividual") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCodeall(params.data.id);
                            }}
                        >
                            <VisibilityOutlinedIcon style={{ fontsize: "large" }} sx={buttonStyles.buttonview} />
                        </Button>
                    )}

                </Grid>
            ),
        },
    ];
    const rowDataTable = filteredDatas.map((item, index) => {
        return {
            id: item.id,
            serialNumber: item.serialNumber,
            project: item.project,
            vendor: item.vendor,
            queue: item.queue,
            filename: item.filename,
            date: item.date,
            addedby: item.addedby,
            addedbydatetime: item.addedbydatetime,

        };
    });



    const openviewpopall = Boolean(anchorElviewAll);
    const idviewall = openviewpopall ? "simple-popover" : undefined;

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibilityviewAll");
        if (savedVisibility) {
            setColumnVisibilityviewAll(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem(
            "columnVisibilityviewAll",
            JSON.stringify(columnVisibilityviewAll)
        );
    }, [columnVisibilityviewAll]);
    // Split the search query into individual terms
    const searchTermsviewAll = searchQueryviewAll.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDataviewAlls = itemsviewAll?.filter((item) => {
        return searchTermsviewAll.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredDataviewAll = filteredDataviewAlls.slice(
        (pageviewAll - 1) * pageSizeviewAll,
        pageviewAll * pageSizeviewAll
    );

    const totalPagesviewAll = Math.ceil(
        filteredDataviewAlls.length / pageSizeviewAll
    );

    const visiblePagesviewAll = Math.min(totalPagesviewAll, 3);

    const firstVisiblePageviewAll = Math.max(1, pageviewAll - 1);
    const lastVisiblePageviewAll = Math.min(
        firstVisiblePageviewAll + visiblePagesviewAll - 1,
        totalPagesviewAll
    );

    const pageNumbersviewall = [];

    // const indexOfLastItemviewAll = pageviewAll * pageSizeviewAll;
    // const indexOfFirstItemviewAll = indexOfLastItemviewAll - pageSizeviewAll;

    for (let i = firstVisiblePageviewAll; i <= lastVisiblePageviewAll; i++) {
        pageNumbersviewall.push(i);
    }

    //print.view.all.
    const componentRefviewall = useRef();
    const handleprintviewall = useReactToPrint({
        content: () => componentRefviewall.current,
        documentTitle: fileNameView,
        pageStyle: "print",
    });

    const rowDataTableviewAll = filteredDataviewAll.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            date: item.date,
            project: item.project,
            vendor: item.vendor,
            queue: item.queue,
            loginid: item.loginid,
            accuracy: item?.accuracy,
            totalfield: item.totalfield,
        };
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
    // Function to filter columns based on search query
    const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));
    // Manage Columns functionality
    const toggleColumnVisibility = (field) => {
        setColumnVisibility((prevVisibility) => ({
            ...prevVisibility,
            [field]: !prevVisibility[field],
        }));
    };
    // JSX for the "Manage Columns" popover content
    const manageColumnsContent = (
        <Box
            style={{
                padding: "10px",
                minWidth: "325px",
                "& .MuiDialogContent-root": { padding: "10px 0" },
            }}
        >
            <Typography variant="h6">Manage Columns</Typography>
            <IconButton
                aria-label="close"
                onClick={handleCloseManageColumns}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <Box sx={{ position: "relative", margin: "10px" }}>
                <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: "absolute" }} />
            </Box>
            <br />
            <br />
            <DialogContent sx={{ minWidth: "auto", height: "200px", position: "relative" }}>
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText sx={{ display: "flex" }} primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === "checkbox" ? "Checkbox" : column.headerName} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
                            {" "}
                            Show All
                        </Button>
                    </Grid>
                    <Grid item md={4}></Grid>
                    <Grid item md={4}>
                        <Button
                            variant="text"
                            sx={{ textTransform: "none" }}
                            onClick={() => {
                                const newColumnVisibility = {};
                                columnDataTable.forEach((column) => {
                                    newColumnVisibility[column.field] = false; // Set hide property to true
                                });
                                setColumnVisibility(newColumnVisibility);
                            }}
                        >
                            {" "}
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

    const filename = "Achieved Accuracy Individual"


    const handleExportXL = (isfilter) => {
        if (isfilter === "filtered") {
            exportToCSV(
                rowDataTable?.map((t, index) => ({
                    SNo: index + 1,
                    Date: t.date,
                    "Project": t.project,
                    "Vendor": t.vendor,
                    "Queue": t.queue,
                    "File Name": t.filename,
                    // "Added By": t.addedby,
                    // "Added Date&Time": t.addedbydatetime,
                })),
                filename,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                achievedAccuracyIndividualListArray.map((t, index) => ({
                    SNo: index + 1,
                    Date: moment(t.date).format('DD-MM-YYYY'),
                    "Project": t.project,
                    "Vendor": t.vendor,
                    "Queue": t.queue,
                    "File Name": t.filename,
                    // "Added By": t?.addedby[0]?.name,
                    // "Added Date&Time": moment(t?.addedby[0]?.date).format("DD-MM-YYYY hh:mm:ss A"),
                })),
                filename,
            );

        }

        setIsFilterOpen(false)
    };


    const handleExportXL2 = (isfilter) => {
        if (isfilter === "filtered") {
            exportToCSV(
                rowDataTableviewAll?.map((t, index) => ({
                    "S.No": t.serialNumber,
                    Date: t.date,
                    "Project": t.project,
                    "Vendor": t.vendor,
                    "Queue": t.queue,
                    "Login ID": t.loginid,
                    "Accuracy": t.accuracy,
                    "Total Field": t.totalfield,
                })),
                fileNameView,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                productionoriginalViewAllFilter.map((t, index) => ({
                    "S.No": index + 1,
                    Date: moment(t.date).format("DD-MM-YYYY"),
                    "Project": t.project,
                    "Vendor": t.vendor,
                    "Queue": t.queue,
                    "Login ID": t.loginid,
                    "Accuracy": t.accuracy,
                    "Total Field": t.totalfield,
                })),
                fileNameView,
            );

        }

        setIsFilterOpen2(false)
    };

    const handleclear = (e) => {
        e.preventDefault()
        setDataArrayLength([])
        setShow(false)
        setFileName("")
        setDataupdated("")
        setAlertButton(false)
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    }


    return (
        <Box>
            <Headtitle title={"ACHIEVED ACCURACY INDIVIDUAL"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Achieved Accuracy Individual"
                modulename="Quality"
                submodulename="Accuracy"
                mainpagename="Acheived Accuracy Individual"
                subpagename=""
                subsubpagename=""
            />

            <>
                {isUserRoleCompare?.includes("aacheivedaccuracyindividual") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>Add Achieved Accuracy Individual</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Date<b style={{ color: "red" }}>*</b>  </Typography>
                                        <OutlinedInput id="myDateInput" type="date" value={acheivedAccuracyDetails.date} onChange={(e) => {
                                            setAcheivedAccuracyDetails((prev) => ({
                                                ...prev, date: e.target.value
                                            })
                                            )
                                            setDataArrayLength([]);
                                            setAlertButton(false);
                                        }} />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Project <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={projectOpt}
                                            styles={colourStyles}
                                            value={{
                                                label: acheivedAccuracyDetails.project,
                                                value: acheivedAccuracyDetails.project,
                                            }}
                                            onChange={(e) => {

                                                setAcheivedAccuracyDetails({
                                                    ...acheivedAccuracyDetails,
                                                    project: e.value,
                                                    queue: "Please Select Queue",
                                                    vendor: "Please Select Vendor", minimumaccuracy: ""

                                                });
                                                fetchQueueDropdowns(e);
                                                fetchVendorDropdowns(e);
                                                setDataArrayLength([]);
                                                setAlertButton(false);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Vendor <b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={vendorOpt}
                                            styles={colourStyles}
                                            value={{
                                                label: acheivedAccuracyDetails.vendor,
                                                value: acheivedAccuracyDetails.vendor,
                                            }}
                                            onChange={(e) => {

                                                setAcheivedAccuracyDetails({
                                                    ...acheivedAccuracyDetails,
                                                    vendor: e.value,

                                                });
                                                setDataArrayLength([]);
                                                setAlertButton(false);

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Queue<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={queueOption}
                                            styles={colourStyles}
                                            value={{
                                                label: acheivedAccuracyDetails.queue,
                                                value: acheivedAccuracyDetails.queue,
                                            }}
                                            onChange={(e) => {

                                                fetchMinimumaccuracy(e, acheivedAccuracyDetails.project);
                                                setAcheivedAccuracyDetails({
                                                    ...acheivedAccuracyDetails,
                                                    queue: e.value,
                                                });
                                                setAcheivedAccuracyDetails((prev) => ({ ...prev, acheivedaccuracy: "", clientstatus: "", internalstatus: "" }))
                                                setDataArrayLength([]);
                                                setAlertButton(false);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>


                            </Grid>
                            <br />
                            <br />
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                {dataArrayLength > 0 && AlertButton ? (
                                    <Alert severity="success">File Accepted!</Alert>
                                ) : null}
                                {dataArrayLength == 0 &&
                                    dataupdated == "uploaded" &&
                                    AlertButton ? (
                                    <Alert severity="error">No data to upload!</Alert>
                                ) : null}
                            </Box>
                            <br></br>
                            <Grid container spacing={2}>
                                <Grid item md={2}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        sx={buttonStyles.buttonsubmit}
                                        disabled={btnUpload}
                                    >
                                        Upload
                                        <input
                                            id="resume"
                                            name="file"
                                            hidden
                                            type="file"
                                            accept=".xlsx, .xls , .csv"
                                            onChange={(e) => {
                                                handleResumeUpload(e);

                                            }}
                                        />
                                    </Button>
                                </Grid>
                                <Grid item md={7}>
                                    {fileName && dataArrayLength > 0 ? (
                                        <Box sx={{ display: "flex", justifyContent: "left" }}>
                                            <p>{fileName}</p>
                                            <Button onClick={() => clearFileSelection()}>
                                                <FaTrash style={{ color: "red" }} />
                                            </Button>
                                        </Box>
                                    ) : null}
                                </Grid>
                                <Grid item md={3}>
                                    {show && dataArrayLength > 0 && (
                                        <>
                                            <Box sx={{ display: "flex" }}>
                                                <Box>
                                                    <div readExcel={readExcel} />
                                                    <SendToServer sendJSON={sendJSON} />
                                                </Box>
                                                &nbsp;
                                                &nbsp;
                                                <Box item md={3} xs={12} sm={6}>
                                                    <Button sx={buttonStyles.btncancel} onClick={handleclear}>
                                                        Clear
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                            <br />
                            <br />
                            <Button
                                variant="contained"
                                color="success"
                                sx={{ textTransform: "Capitalize" }}
                                onClick={(e) => ExportsHead()}
                            >
                                <FaDownload />
                                &ensp;Download template file
                            </Button>


                        </>
                    </Box>
                )}
            </>
            <br /> <br />
            {/* ****** Table Start ****** */}
            {
                isUserRoleCompare?.includes("lacheivedaccuracyindividual") && (
                    <>
                        <Box sx={userStyle.container}>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>List Achieved Accuracy Individual</Typography>
                            </Grid>
                            <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Box>
                                        <label>Show entries:</label>
                                        <Select
                                            id="pageSizeSelect"
                                            value={pageSize}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 180,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            onChange={handlePageSizeChange}
                                            sx={{ width: "77px" }}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={25}>25</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                            <MenuItem value={accuracyMasterArray?.length}>All</MenuItem>
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid
                                    item
                                    md={8}
                                    xs={12}
                                    sm={12}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box>
                                        {isUserRoleCompare?.includes("excelacheivedaccuracyindividual") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    fetchAllAChievedAccuracyIndividualArray()
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvacheivedaccuracyindividual") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    fetchAllAChievedAccuracyIndividualArray()
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printacheivedaccuracyindividual") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfacheivedaccuracyindividual") && (
                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                        fetchAllAChievedAccuracyIndividualArray()
                                                    }}
                                                >
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imageacheivedaccuracyindividual") && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                                    {" "}
                                                    <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItemsFilterdata}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={overallFilterdata}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        paginated={true}
                                        totalDatas={overallData}
                                    />
                                </Grid>
                            </Grid>
                            <br />
                            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                                Show All Columns
                            </Button>
                            &ensp;
                            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                                Manage Columns
                            </Button>
                            &ensp;
                            {isUserRoleCompare?.includes("bdacheivedaccuracyindividual") && (
                                <>
                                    <Button variant="contained" color="error" onClick={handleClickOpenalert} sx={buttonStyles.buttonbulkdelete}>
                                        Bulk Delete
                                    </Button>
                                </>
                            )}
                            <br />
                            <br />
                            {!loader ? (
                                <Box sx={userStyle.container}>
                                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "350px" }}>
                                        <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
                                    </Box>
                                </Box>
                            ) : (
                                <>
                                    <AggridTable
                                        rowDataTable={rowDataTable}
                                        columnDataTable={columnDataTable}
                                        columnVisibility={columnVisibility}
                                        page={page}
                                        setPage={setPage}
                                        pageSize={pageSize}
                                        totalPages={totalPages}
                                        setColumnVisibility={setColumnVisibility}
                                        isHandleChange={isHandleChange}
                                        items={itemsFilterdata}
                                        selectedRows={selectedRows}
                                        setSelectedRows={setSelectedRows}
                                        gridRefTable={gridRef}
                                        paginated={true}
                                        filteredDatas={filteredDatas}
                                        totalDatas={totalProjects}
                                        searchQuery={searchedString}
                                        handleShowAllColumns={handleShowAllColumns}
                                        setFilteredRowData={setFilteredRowData}
                                        filteredRowData={filteredRowData}
                                        setFilteredChanges={setFilteredChanges}
                                        filteredChanges={filteredChanges}
                                        gridRefTableImg={gridRefTableImg}
                                        itemsList={overallData}
                                    />
                                </>
                            )}
                            {/* ****** Table End ****** */}
                        </Box>
                    </>
                )
            }
            {/* ****** Table End ****** */}
            {/* Manage Column */}
            <Popover
                id={id}
                open={isManageColumnsOpen}
                anchorEl={anchorEl}
                onClose={handleCloseManageColumns}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                {manageColumnsContent}
            </Popover>


            {/*Submit ALERT DIALOG */}
            <Dialog open={isSubmit} onClose={handleCloseModSubmit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "400px", textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        {submitMessage}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseModSubmit}
                        style={{
                            backgroundColor: "#f4f4f4",
                            color: "#444",
                            boxShadow: "none",
                            borderRadius: "3px",
                            border: "1px solid #0000006b",
                            "&:hover": {
                                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                    backgroundColor: "#f4f4f4",
                                },
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button autoFocus variant="contained" color="error" onClick={sendRequest}>
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Submit Edit ALERT DIALOG */}
            <Dialog open={isSubmitEdit} onClose={handleCloseModSubmitEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent sx={{ width: "400px", textAlign: "center", alignItems: "center" }}>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                    <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                        {submitMessage}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseModSubmitEdit}
                        style={{
                            backgroundColor: "#f4f4f4",
                            color: "#444",
                            boxShadow: "none",
                            borderRadius: "3px",
                            border: "1px solid #0000006b",
                            "&:hover": {
                                "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                                    backgroundColor: "#f4f4f4",
                                },
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button autoFocus variant="contained" color="error" onClick={sendEditRequest}>
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* view model */}
            <Dialog open={openview} onClose={handleClickOpenview} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md">
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Achieved Accuracy</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Date</Typography>
                                    <Typography>{moment(acheivedAccuracyDetailsEdit.date).format('DD-MM-YYYY')}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Project</Typography>
                                    <Typography>{acheivedAccuracyDetailsEdit.project}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Vendor</Typography>
                                    <Typography>{acheivedAccuracyDetailsEdit.vendor}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Queue</Typography>
                                    <Typography>{acheivedAccuracyDetailsEdit.queue}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Minimum Accuracy</Typography>
                                    <Typography>{`${acheivedAccuracyDetailsEdit.minimumaccuracy} %`}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Achieved Accuracy</Typography>
                                    <Typography>{`${acheivedAccuracyDetailsEdit.acheivedaccuracy} %`}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Client Status</Typography>
                                    <Typography>{acheivedAccuracyDetailsEdit.clientstatus}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Internal Status</Typography>
                                    <Typography>{`${acheivedAccuracyDetailsEdit.internalstatus}`}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid
                                item
                                lg={6}
                                md={6}
                                xs={12}
                                sm={12}
                                sx={{ marginTop: "20px" }}
                            >
                                {uploadView?.length > 0 &&
                                    uploadView.map((file, index) => (
                                        <>
                                            <Grid container spacing={2}>
                                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                                    <Typography>{file.name}</Typography>
                                                </Grid>
                                                <Grid item lg={1} md={1} sm={1} xs={1}>
                                                    <VisibilityOutlinedIcon
                                                        style={{
                                                            fontsize: "large",
                                                            color: "#357AE8",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => renderFilePreviewView(file)}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </>
                                    ))}
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleCloseview} sx={buttonStyles.btncancel}>
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            style={{
                                padding: "7px 13px",
                                color: "white",
                                background: "rgb(25, 118, 210)",
                            }}
                            onClick={handleCloseerr}
                        >
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* Edit DIALOG */}
            <Box>
                <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="md" fullWidth={true} sx={{
                    overflow: 'visible',
                    '& .MuiPaper-root': {
                        overflow: 'auto',
                    },
                }}>
                    <Box sx={{ padding: "20px 50px" }}>
                        <>
                            <Grid container spacing={2}>
                                <Typography sx={userStyle.HeaderText}>Edit Achieved Accuracy</Typography>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Date<b style={{ color: "red" }}>*</b>  </Typography>
                                        <OutlinedInput id="myDateInput" type="date" value={acheivedAccuracyDetailsEdit.date} onChange={(e) => {
                                            setAcheivedAccuracyDetailsEdit((prev) => ({
                                                ...prev, date: e.target.value
                                            })
                                            )
                                        }} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Project<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={projectOptEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: acheivedAccuracyDetailsEdit.project,
                                                value: acheivedAccuracyDetailsEdit.project,
                                            }}
                                            onChange={(e) => {

                                                setAcheivedAccuracyDetailsEdit({
                                                    ...acheivedAccuracyDetailsEdit,
                                                    project: e.value,
                                                    queue: "Please Select Queue",
                                                    vendor: "Please Select Vendor", minimumaccuracy: ""
                                                });
                                                fetchQueueDropdownsEdit(e.value);
                                                fetchVendorDropdownsEdit(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Vendor<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={vendorOptEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: acheivedAccuracyDetailsEdit.vendor,
                                                value: acheivedAccuracyDetailsEdit.vendor,
                                            }}
                                            onChange={(e) => {

                                                setAcheivedAccuracyDetailsEdit({
                                                    ...acheivedAccuracyDetailsEdit,
                                                    vendor: e.value,
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Queue<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <Selects
                                            options={queueOptionEdit}
                                            styles={colourStyles}
                                            value={{
                                                label: acheivedAccuracyDetailsEdit.queue,
                                                value: acheivedAccuracyDetailsEdit.queue,
                                            }}
                                            onChange={(e) => {
                                                fetchMinimumaccuracyEdit(e, acheivedAccuracyDetailsEdit.project)

                                                setAcheivedAccuracyDetailsEdit({
                                                    ...acheivedAccuracyDetailsEdit,
                                                    queue: e.value,
                                                });
                                                setAcheivedAccuracyDetailsEdit((prev) => ({
                                                    ...prev, acheivedaccuracy: "", clientstatus: "", internalstatus: ""
                                                }));

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Minimum Accuracy
                                        </Typography>
                                        <OutlinedInput
                                            readOnly={true}
                                            value={acheivedAccuracyDetailsEdit.minimumaccuracy}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>
                                        Achieved Accuracy %<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <Grid className="expected-accuracy">
                                        <FormControl fullWidth size="small" >
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="number"
                                                inputProps={{
                                                    min: 0,
                                                    max: 100,
                                                    step: 0.01,
                                                    pattern: "\\d*\\.?\\d{0,2}"
                                                }}
                                                placeholder="Please enter the number 0-100"
                                                value={acheivedAccuracyDetailsEdit.acheivedaccuracy}
                                                sx={userStyle.input}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    // Check if the new value matches the allowed pattern
                                                    const isValid = /^(\d{0,2}(\.\d{0,2})?|100(\.00?)?)$/.test(newValue);
                                                    if (isValid) {
                                                        setAcheivedAccuracyDetailsEdit(prev => ({
                                                            ...prev,
                                                            acheivedaccuracy: newValue
                                                        }));
                                                        gettingValuesEdit(newValue)
                                                    }
                                                }}
                                            />
                                        </FormControl>

                                    </Grid>
                                </Grid>
                                <Grid
                                    item
                                    lg={2}
                                    md={2}
                                    xs={12}
                                    sm={12}
                                    sx={{ marginTop: "20px" }}
                                >
                                    <Button variant="contained" size="small" component="label">
                                        Upload
                                        <input
                                            type="file"
                                            id="resume"
                                            multiple
                                            accept=".pdf, .doc, .txt,.jpg,.png"
                                            name="file"
                                            hidden
                                            onChange={handleResumeUploadEdit}
                                        />
                                    </Button>
                                </Grid>
                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    xs={12}
                                    sm={12}
                                    sx={{ marginTop: "20px" }}
                                >
                                    {uploadEdit?.length > 0 &&
                                        uploadEdit.map((file, index) => (
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={8} md={8} sm={8} xs={8}>
                                                        <Typography>{file.name}</Typography>
                                                    </Grid>
                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                        <VisibilityOutlinedIcon
                                                            style={{
                                                                fontsize: "large",
                                                                color: "#357AE8",
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() => renderFilePreviewEdit(file)}
                                                        />
                                                    </Grid>
                                                    <Grid item lg={1} md={1} sm={1} xs={1}>
                                                        <Button
                                                            style={{
                                                                fontsize: "large",
                                                                color: "#357AE8",
                                                                cursor: "pointer",
                                                                marginTop: "-5px",
                                                            }}
                                                            onClick={() => handleFileDeleteEdit(index)}
                                                        >
                                                            <DeleteIcon />
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ))}
                                </Grid>


                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button variant="contained" onClick={editSubmit}>
                                        {" "}
                                        Update
                                    </Button>
                                </Grid>
                                <br />
                                <Grid item md={6} xs={12} sm={12}>
                                    <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                                        {" "}
                                        Cancel{" "}
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </Dialog>
            </Box>

            <br />


            <Dialog
                open={openviewAll}
                onClose={handleClickOpenviewAll}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="lg"
                sx={{ marginTop: "80px" }}
            >

                <Box sx={{ marginTop: '5%' }}>
                    <DialogContent >
                        <>
                            <Typography sx={userStyle.HeaderText}>{fileNameView}</Typography>
                            {/* <br /> */}
                            <Grid container style={userStyle.dataTablestyle}>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Box>
                                        <label>Show entries:</label>
                                        <Select
                                            id="pageSizeSelect"
                                            value={pageSizeviewAll}
                                            size="small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 180,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            onChange={handlePageSizeChangeviewAll}
                                            sx={{ width: "77px" }}
                                        >
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={25}>25</MenuItem>
                                            <MenuItem value={50}>50</MenuItem>
                                            <MenuItem value={100}>100</MenuItem>
                                            <MenuItem value={productionoriginalviewAll?.length}>
                                                All
                                            </MenuItem>
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid
                                    item
                                    md={8}
                                    xs={12}
                                    sm={12}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Box>
                                        {isUserRoleCompare?.includes("excelacheivedaccuracyindividual") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen2(true)
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("csvacheivedaccuracyindividual") && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen2(true)
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("printacheivedaccuracyindividual") && (
                                            <>
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={handleprintviewall}
                                                >
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("pdfacheivedaccuracyindividual") && (
                                            <>
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen2(true)
                                                    }}
                                                >
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare?.includes("imageacheivedaccuracyindividual") && (
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleCaptureImageviewall}
                                            >
                                                {" "}
                                                <ImageIcon
                                                    sx={{ fontSize: "15px" }}
                                                /> &ensp;Image&ensp;{" "}
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={6} sm={6}>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTableviewAll}
                                        setItems={setItemsviewAll}
                                        addSerialNumber={addSerialNumberviewAll}
                                        setPage={setPageviewAll}
                                        maindatas={productionoriginalviewAll}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQueryviewAll}
                                        setSearchQuery={setSearchQueryviewAll}
                                        paginated={false}
                                        totalDatas={overallItemsviewall}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={handleShowAllColumnsviewAll}
                            >
                                Show All Columns
                            </Button>
                            &ensp;
                            <Button
                                sx={userStyle.buttongrp}
                                onClick={handleOpenManageColumnsviewAll}
                            >
                                Manage Columns
                            </Button>
                            <br /><br></br>
                            {/* Manage Column */}
                            <Popover
                                id={idviewall}
                                open={isManageColumnsOpenviewAll}
                                anchorEl={anchorElviewAll}
                                onClose={handleCloseManageColumnsviewAll}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                            >
                                {manageColumnsContentviewAll}
                            </Popover>
                            {/* <br /> */}
                            {!productionfirstViewCheck ? (
                                <>
                                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                                        <FacebookCircularProgress />
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <AggridTable
                                        rowDataTable={rowDataTableviewAll}
                                        columnDataTable={columnDataTableviewAll}
                                        columnVisibility={columnVisibilityviewAll}
                                        page={pageviewAll}
                                        setPage={setPageviewAll}
                                        pageSize={pageSizeviewAll}
                                        totalPages={totalPagesviewAll}
                                        setColumnVisibility={setColumnVisibilityviewAll}
                                        isHandleChange={isHandleChangeNew}
                                        items={itemsviewAll}
                                        selectedRows={selectedRows}
                                        setSelectedRows={setSelectedRows}
                                        gridRefTable={gridRefviewall}
                                        paginated={false}
                                        filteredDatas={filteredDataviewAlls}
                                        // totalDatas={totalProjects}
                                        searchQuery={searchQueryviewAll}
                                        handleShowAllColumns={handleShowAllColumnsviewAll}
                                        setFilteredRowData={setFilteredRowDataviewall}
                                        filteredRowData={filteredRowDatapopviewall}
                                        setFilteredChanges={setFilteredChangespopviewall}
                                        filteredChanges={filteredChangespopviewall}
                                        gridRefTableImg={gridRefTableImgViewall}
                                        itemsList={overallItemsviewall}
                                    />
                                </>
                            )}
                        </>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            sx={buttonStyles.btncancel}
                            onClick={handleCloseviewAll}
                        >
                            Back
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                    id="usertable"
                    ref={componentRefviewall}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Project</TableCell>
                            <TableCell>Vendor</TableCell>
                            <TableCell>Queue</TableCell>
                            <TableCell>Login ID</TableCell>
                            <TableCell>Accuracy</TableCell>
                            <TableCell>Total Field</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody align="left">
                        {rowDataTableviewAll &&
                            rowDataTableviewAll.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.queue}</TableCell>
                                    <TableCell>{row.loginid}</TableCell>
                                    <TableCell>{row.accuracy}</TableCell>
                                    <TableCell>{row.totalfield}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
            {/* EXTERNAL COMPONENTS -------------- END */}
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={overallData ?? []}
                filename={"Achieved Accuracy Individual"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            <ExportData
                isFilterOpen={isFilterOpen2}
                handleCloseFilterMod={handleCloseFilterMod2}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen2}
                isPdfFilterOpen={isPdfFilterOpen2}
                setIsPdfFilterOpen={setIsPdfFilterOpen2}
                handleClosePdfFilterMod={handleClosePdfFilterMod2}
                filteredDataTwo={(filteredChanges !== null ? filteredRowDatapopviewall : rowDataTableviewAll) ?? []}
                itemsTwo={productionoriginalviewAll ?? []}
                filename={fileNameView}
                exportColumnNames={exportColumnNamesall}
                exportRowValues={exportRowValuesall}
                componentRef={componentRefviewall}
            />
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Achieved Accuracy Individual Info"
                addedby={addedby ?? []}
                updateby={updateby ?? []}
            />
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={delBrand}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delAreagrpcheckbox}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />


        </Box >
    );
}

export default AcheivedAccurayIndividual;