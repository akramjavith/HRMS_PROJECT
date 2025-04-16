import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, TableBody, TableRow, TableCell, Select, MenuItem, Dialog,
    DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead,
    TableContainer, Button, List, ListItem, ListItemText, Popover, Checkbox, TextField, IconButton
} from "@mui/material";
import { userStyle, colourStyles } from "../../pageStyle";
import { handleApiError } from "../../components/Errorhandling";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import axios from "axios";
import { SERVICE } from '../../services/Baseservice';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { useReactToPrint } from "react-to-print";
import StyledDataGrid from "../../components/TableStyle";
import { UserRoleAccessContext, AuthContext } from '../../context/Appcontext';
import Headtitle from "../../components/Headtitle";
import { ThreeDots } from 'react-loader-spinner';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/system';
import Resizable from 'react-resizable';
import { saveAs } from "file-saver";
import Switch from '@mui/material/Switch';
import CloseIcon from '@mui/icons-material/Close';
import html2canvas from 'html2canvas';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import ImageIcon from '@mui/icons-material/Image';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { FaFileExcel, FaFileCsv } from 'react-icons/fa';
import PageHeading from "../../components/PageHeading";


function Salaryprocessreport() {

    const [selectedCompanyFrom, setSelectedCompanyFrom] = useState([]);
    const [selectedBranchFrom, setSelectedBranchFrom] = useState([]);
    const [selectedUnitFrom, setSelectedUnitFrom] = useState([]);
    const [selectedTeamFrom, setSelectedTeamFrom] = useState([]);

    const [companies, setCompanies] = useState([]);
    const [branches, setBranches] = useState([]);
    const [units, setUnits] = useState([]);
    const [teamsall, setTeamsall] = useState([]);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };



    const Typeoptions = [
        { label: "Amount Wise", value: "Amount Wise" },
        { label: "Process Wise", value: "Process Wise" },
    ];

    const salaryrangeoptions = [
        { label: "Less Than", value: "Less Than" },
        { label: "Greater Than", value: "Greater Than" },
        { label: "Between", value: "Between" },
        { label: "Exact", value: "Exact" },
    ];

    const [salaryfix, setSalaryFix] = useState([]);
    const [salaryfixexcel, setSalaryFixExcel] = useState([]);


    const [ebreadingdetailFilter, setEbreadingdetailFilter] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        type: "Please Select Type",
        salaryrange: "Please Select Salary Range",
        amountvalue: "",
        process: "Please Select Process",
        from: "",
        to: ""

    });

    const [ProcessOptions, setProcessOptions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const { isUserRoleCompare, isAssignBranch, pageName, setPageName } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const [ebreadingdetailCheck, setEbreadingdetailcheck] = useState(false);

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);


    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [copiedData, setCopiedData] = useState('');


    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, 'Salary Process Report List .png');
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


    const extractNumbers = (str) => {
        const numbers = str.match(/\d+/g);
        return numbers ? numbers.map(Number) : [];
    };

    const extractText = (str) => {
        return str.replace(/\d+/g, '');
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
        serialNumber: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        totalValue: true,
        targetPointsValue: true,
        experience: true,
        salarycode: true,
        targetpoints: true,
        statusallot: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);


    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };


    const [salSlabs, setsalSlabs] = useState([]);

    const [tarPoints, setTarpoints] = useState([]);
    //get all employees list details
    const fetchTargetpoints = async () => {
        setPageName(!pageName)
        try {
            let res_employee = await axios.get(SERVICE.TARGETPOINTS_LIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTarpoints(res_employee.data.targetpoints);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };



    const fetchSalarySlabs = async () => {
        setPageName(!pageName)
        try {

            let res_employee = await axios.get(SERVICE.SALARYSLAB_LIMITED, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setsalSlabs(res_employee.data.salaryslab);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const fetchCompanyAll = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.COMPANY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let companyalldata = res?.data?.companies.map((item) => ({
                ...item,
                value: item.name,
                label: item.name,
            }));
            setCompanies(companyalldata);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const fetchBranchAll = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setBranches(res.data.branch);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };
    const fetchUnitAll = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.UNIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setUnits(res.data.units);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };




    const fetchTeamAll = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.get(SERVICE.TEAMS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setTeamsall(res.data.teamsdetails);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };




    const processTeamDropdowns = async () => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.get(SERVICE.ALL_PROCESS_AND_TEAM_FILTER_LIMITED, {
                // let res_freq = await axios.get(SERVICE.ALL_PROCESS_AND_TEAM, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const companyall = res_freq?.data?.processteam
            setProcessOptions(companyall);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        processTeamDropdowns();

    }, [ebreadingdetailFilter.team])

    useEffect(() => {
        fetchCompanyAll();
        fetchBranchAll();
        fetchUnitAll();
        fetchTeamAll();

    }, [])

    useEffect(() => {

        fetchSalarySlabs();
        fetchTargetpoints();
    }, [ebreadingdetailFilter.process])



    const SalaryFixFilter = async () => {
        setEbreadingdetailcheck(true)
        setPageName(!pageName)
        try {
            // let res = await axios.post(SERVICE.SALARY_FIX_FILTERREPORT, {
            //     headers: {
            //         Authorization: `Bearer ${auth.APIToken}`,
            //     },
            //     company: selectedCompanyFrom.map(item => item.value),
            //     branch: selectedBranchFrom.map(item => item.value),
            //     salaryrange: ebreadingdetailFilter.salaryrange,
            //     type: ebreadingdetailFilter.type,
            //     process: ebreadingdetailFilter.process,
            //     amountvalue: ebreadingdetailFilter.amountvalue,
            //     fromamount: ebreadingdetailFilter.from,
            //     toamount: ebreadingdetailFilter.to,
            // });
            async function fetchDataInBatches() {
                let batchNumber = 1;
                let allData = [];
                let hasMoreData = true;

                while (hasMoreData) {
                    const response = await axios.post(
                        SERVICE.SALARY_FIX_FILTERREPORT,
                        {
                            company: selectedCompanyFrom.map(item => item.value),
                            branch: selectedBranchFrom.map(item => item.value),
                            salaryrange: ebreadingdetailFilter.salaryrange,
                            type: ebreadingdetailFilter.type,
                            process: ebreadingdetailFilter.process,
                            amountvalue: ebreadingdetailFilter.amountvalue,
                            fromamount: ebreadingdetailFilter.from,
                            toamount: ebreadingdetailFilter.to,
                            batchNumber: batchNumber,
                            batchSize: 1000,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                        }
                    );
                    if (response.data.results.length === 0) {
                        hasMoreData = false;
                    } else {
                        allData = [...allData, ...response.data.results];
                        batchNumber++;

                    }
                }

                return allData;
            }
            fetchDataInBatches().then(async (allData) => {
                let datavalue = allData.filter((d) => d != null);
                setSalaryFix(
                    datavalue
                );
                setEbreadingdetailcheck(false)
            });

        } catch (err) { setEbreadingdetailcheck(false); handleApiError(err, setShowAlert, handleClickOpenerr); }
    };


    const salaryFixFilterexport = async () => {

        setPageName(!pageName)
        try {
            let res = await axios.post(SERVICE.SALARY_FIX_FILTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: ebreadingdetailFilter.company,
                branch: ebreadingdetailFilter.branch,
                salaryrange: ebreadingdetailFilter.salaryrange,
                type: ebreadingdetailFilter.type,
                process: ebreadingdetailFilter.process,
                amountvalue: ebreadingdetailFilter.amountvalue,
                fromamount: ebreadingdetailFilter.from,
                toamount: ebreadingdetailFilter.to,
            });
            setSalaryFixExcel(
                res?.data?.result
            );
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };



    //submit option for saving
    const handleSubmitFilter = (e) => {
        e.preventDefault();
        if (selectedCompanyFrom.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Company"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedBranchFrom.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Branch"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (selectedUnitFrom.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Unit"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (selectedTeamFrom.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Team"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (ebreadingdetailFilter.type === "Please Select Type") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <Typography style={{ fontSize: "20px", fontWeight: 900 }}> Please Select Type </Typography>
                </>
            );
            handleClickOpenerr();

        }
        else if (ebreadingdetailFilter.type === "Amount Wise" && ebreadingdetailFilter.salaryrange === "Please Select Salary Range") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Salary Range"}
                    </p>
                </>
            );
            handleClickOpenerr();

        }

        else if (ebreadingdetailFilter.type === "Process Wise" && ebreadingdetailFilter.process === "Please Select Process") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Process"}
                    </p>
                </>
            );
            handleClickOpenerr();

        }

        else if (ebreadingdetailFilter.salaryrange === "Between" && ebreadingdetailFilter.from === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter From"}
                    </p>
                </>
            );
            handleClickOpenerr();

        }

        else if (ebreadingdetailFilter.salaryrange === "Between" && ebreadingdetailFilter.to === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter To"}
                    </p>
                </>
            );
            handleClickOpenerr();

        }
        else if (ebreadingdetailFilter.salaryrange === "Between" && Number(ebreadingdetailFilter.from) >= Number(ebreadingdetailFilter.to)) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"To must be greater than From"}
                    </p>
                </>
            );
            handleClickOpenerr();

        }

        else if ((ebreadingdetailFilter.salaryrange === "Less Than" ||
            ebreadingdetailFilter.salaryrange === "Greater Than" ||

            ebreadingdetailFilter.salaryrange === "Exact") && ebreadingdetailFilter.amountvalue === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Amount Value"}
                    </p>
                </>
            );
            handleClickOpenerr();

        }
        else {
            SalaryFixFilter()
        }
    }

    const handleClearFilter = async (e) => {
        e.preventDefault();
        // fetchEbreadingdetails();
        setEbreadingdetailFilter({
            ...ebreadingdetailFilter,

            type: "Please Select Type",
            salaryrange: "Please Select Salary Range",
            amountvalue: "",
            process: "Please Select Process",
            from: "",
            to: ""
        })
        setSelectedCompanyFrom([]);
        setSelectedBranchFrom([]);
        setSelectedUnitFrom([]);
        setSelectedTeamFrom([]);
        setProcessOptions([])
        setTeamsall([]);
        setSalaryFix([])
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "100px", color: "orange" }}
                />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Cleared Successfully"}
                </p>
            </>
        );
        handleClickOpenerr();
    }



    // pdf.....
    const columns = [
        { title: "Sno", field: "serialNumber" },
        { title: "Salary Amount", field: "totalValue" },
        { title: "Experience", field: "experience" },
        { title: "Process code", field: "salarycode" },
        { title: "Target Points", field: "targetPointsValue" },
    ]

    const downloadPdf = (isfilter) => {

        const doc = new jsPDF();

        // Initialize serial number counter
        let serialNumberCounter = 1;


        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            rowDataTable.map(row => ({ ...row, serialNumber: serialNumberCounter++ })) :
            salaryfix.map(row => {

                return {
                    ...row,
                    serialNumber: serialNumberCounter++,
                    experience: extractNumbers(row.salarycode)[0],
                }
            });

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: { fontSize: 5 },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: dataWithSerial,
        });

        doc.save("Salary Process Report List.pdf");
    };


    // Excel
    const fileName = "Salary Process Report List";


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Salary Process Report List',
        pageStyle: 'print'
    });



    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, []);

    const [items, setItems] = useState([]);


    const addSerialNumber = () => {
        const itemsWithSerialNumber = salaryfix?.map((item, index) => ({ ...item, experience: extractNumbers(item.salarycode), code: extractText(item.salarycode), serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }


    useEffect(() => {
        addSerialNumber();
    }, [salaryfix])


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
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 90, hide: !columnVisibility.serialNumber, headerClassName: "bold-header"
        },
        { field: "totalValue", headerName: "Salary Amount", flex: 0, width: 180, hide: !columnVisibility.totalValue, headerClassName: "bold-header" },
        { field: "experience", headerName: "Experience", flex: 0, width: 200, hide: !columnVisibility.experience, headerClassName: "bold-header" },
        { field: "salarycode", headerName: "Process Code", flex: 0, width: 200, hide: !columnVisibility.salarycode, headerClassName: "bold-header" },
        { field: "targetPointsValue", headerName: "Target Points", flex: 0, width: 180, hide: !columnVisibility.targetPointsValue, headerClassName: "bold-header" },

    ]



    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            totalValue: item.totalValue,
            targetPointsValue: item.targetPointsValue,
            experience: (item.experience),
            salarycode: item.salarycode,
            targetpoints: item.targetPointsValue,
            code: item.code
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

    useEffect(() => {
        // Retrieve column visibility from localStorage (if available)
        const savedVisibility = localStorage.getItem("columnVisibility");
        if (savedVisibility) {
            setColumnVisibility(JSON.parse(savedVisibility));
        }
    }, []);

    useEffect(() => {
        // Save column visibility to localStorage whenever it changes
        localStorage.setItem("columnVisibility", JSON.stringify(columnVisibility));
    }, [columnVisibility]);


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
                rowDataTable?.map((item, index) => ({
                    Sno: index + 1,
                    SalaryAmount: item.totalValue,
                    Experience: extractNumbers(item.salarycode)[0],
                    sProcesscode: item.salarycode,
                    TargetPoints: item.targetPointsValue,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                salaryfix.map((item, index) => ({
                    Sno: index + 1,
                    SalaryAmount: item.totalValue,
                    Experience: extractNumbers(item.salarycode)[0],
                    sProcesscode: item.salarycode,
                    TargetPoints: item.targetPointsValue,
                })),
                fileName,
            );

        }

        setIsFilterOpen(false)
    };

    const handleCompanyChangeFrom = (options) => {
        setSelectedCompanyFrom(options);
        setSelectedBranchFrom([]);
        setSelectedUnitFrom([]);
        setSelectedTeamFrom([])
        setEbreadingdetailFilter({
            ...ebreadingdetailFilter,
            type: "Please Select Type",
            process: "Please Select Process",
        })
    };
    const customValueRendererCompanyFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Company";
    };

    const handleBranchChangeFrom = (options) => {
        setSelectedBranchFrom(options);
        setSelectedUnitFrom([]);
        setSelectedTeamFrom([])
        setEbreadingdetailFilter({
            ...ebreadingdetailFilter,
            type: "Please Select Type",
            process: "Please Select Process",
        })
    };
    const customValueRendererBranchFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Branch";
    };

    //unit multiselect dropdown changes
    const handleUnitChangeFrom = (options) => {
        setSelectedUnitFrom(options);
        setSelectedTeamFrom([]);
        setEbreadingdetailFilter({
            ...ebreadingdetailFilter,
            type: "Please Select Type",
            process: "Please Select Process",
        })
    };
    const customValueRendererUnitFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Unit";
    };

    //Team multiselect dropdown changes
    const handleTeamChangeFrom = (options) => {
        setSelectedTeamFrom(options);
        setEbreadingdetailFilter({
            ...ebreadingdetailFilter,
            process: "Please Select Process",
        })

    };
    const customValueRendererTeamFrom = (valueCate, _employeename) => {
        return valueCate.length
            ? valueCate.map(({ label }) => label).join(", ")
            : "Please select Team";
    };



    return (
        <Box>
            <Headtitle title={'Salary Process Report'} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Add Salary Process Report"
                modulename="PayRoll"
                submodulename="Salary Slab"
                mainpagename="Salary Process Search Report"
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("asalaryprocesssearchreport")
                && (
                    <>

                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>Salary Process Report</Typography>
                                    </Grid>
                                </Grid><br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Company<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={isAssignBranch?.map(data => ({
                                                    label: data.company,
                                                    value: data.company,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                // options={companies}
                                                styles={colourStyles}
                                                // value={{ label: ebreadingdetailFilter.company, value: ebreadingdetailFilter.company }}
                                                // onChange={(e) => {
                                                //     setEbreadingdetailFilter({
                                                //         ...ebreadingdetailFilter, company: e.value,
                                                //         branch: "Please Select Branch",
                                                //         unit: "Please Select Unit",
                                                //         team: "Please Select Team",
                                                //     });
                                                // }}
                                                value={selectedCompanyFrom}
                                                onChange={handleCompanyChangeFrom}
                                                valueRenderer={customValueRendererCompanyFrom}
                                                labelledBy="Please Select Company"
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Branch<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={isAssignBranch?.filter(
                                                    (comp) =>
                                                        selectedCompanyFrom.map(data => data.value).includes(comp.company)
                                                  )?.map(data => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                  })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                  })}
                                                // options={Array.from(
                                                //     new Set(
                                                //         branches
                                                //             ?.filter((comp) =>
                                                //                 selectedCompanyFrom
                                                //                     .map((item) => item.value)
                                                //                     .includes(comp.company)
                                                //             )
                                                //             ?.map((com) => com.name)
                                                //     )
                                                // ).map((name) => ({
                                                //     label: name,
                                                //     value: name,
                                                // }))}
                                                styles={colourStyles}
                                                // value={{ label: ebreadingdetailFilter.branch, value: ebreadingdetailFilter.branch }}
                                                // onChange={(e) => {
                                                //     setEbreadingdetailFilter({
                                                //         ...ebreadingdetailFilter, branch: e.value,
                                                //         unit: "Please Select Unit",
                                                //         team: "Please Select Team",
                                                //     });

                                                // }}
                                                value={selectedBranchFrom}
                                                onChange={handleBranchChangeFrom}
                                                valueRenderer={customValueRendererBranchFrom}
                                                labelledBy="Please Select Branch"
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Unit<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={isAssignBranch?.filter(
                                                    (comp) =>
                                                        selectedCompanyFrom.map(data => data.value).includes(comp.company) && selectedBranchFrom.map(data => data.value).includes(comp.branch)
                                                  )?.map(data => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                  })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                  })}

                                                // options={Array.from(
                                                //     new Set(
                                                //         units
                                                //             ?.filter((comp) =>
                                                //                 selectedBranchFrom
                                                //                     .map((item) => item.value)
                                                //                     .includes(comp.branch)
                                                //             )
                                                //             ?.map((com) => com.name)
                                                //     )
                                                // ).map((name) => ({
                                                //     label: name,
                                                //     value: name,
                                                // }))}
                                                styles={colourStyles}
                                                // value={{ label: ebreadingdetailFilter.unit, value: ebreadingdetailFilter.unit }}
                                                // onChange={(e) => {
                                                //     setEbreadingdetailFilter({
                                                //         ...ebreadingdetailFilter, unit: e.value, team: "Please Select Team",
                                                //     });

                                                // }}
                                                value={selectedUnitFrom}
                                                onChange={handleUnitChangeFrom}
                                                valueRenderer={customValueRendererUnitFrom}
                                                labelledBy="Please Select Unit"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Team<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                // options={teamsall?.filter(
                                                //     (comp) =>
                                                //         ebreadingdetailFilter.company === comp.company && ebreadingdetailFilter.branch === comp.branch
                                                //         && ebreadingdetailFilter.unit === comp.unit
                                                // )?.map(data => ({
                                                //     label: data.teamname,
                                                //     value: data.teamname,
                                                // }))}
                                                options={Array.from(
                                                    new Set(
                                                        teamsall
                                                            ?.filter(
                                                                (comp) =>
                                                                    selectedBranchFrom
                                                                        .map((item) => item.value)
                                                                        .includes(comp.branch) &&
                                                                    selectedUnitFrom
                                                                        .map((item) => item.value)
                                                                        .includes(comp.unit)
                                                            )
                                                            ?.map((com) => com.teamname)
                                                    )
                                                ).map((teamname) => ({
                                                    label: teamname,
                                                    value: teamname,
                                                }))}
                                                styles={colourStyles}
                                                // value={{ label: ebreadingdetailFilter.team, value: ebreadingdetailFilter.team }}
                                                // onChange={(e) => {
                                                //     setEbreadingdetailFilter({
                                                //         ...ebreadingdetailFilter, team: e.value,
                                                //     });

                                                // }}
                                                value={selectedTeamFrom}
                                                onChange={handleTeamChangeFrom}
                                                valueRenderer={customValueRendererTeamFrom}
                                                labelledBy="Please Select Team"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <Typography>
                                            Type<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Selects
                                                options={Typeoptions}
                                                styles={colourStyles}
                                                value={{
                                                    label: ebreadingdetailFilter.type,
                                                    value: ebreadingdetailFilter.type,
                                                }}
                                                onChange={(e) => {
                                                    setEbreadingdetailFilter({
                                                        ...ebreadingdetailFilter,
                                                        type: e.value,
                                                        salaryrange: "Please Select Salary Range",
                                                        process: "Please Select Process"
                                                    });

                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {ebreadingdetailFilter.type === "Amount Wise" &&
                                        <>
                                            <Grid item md={4} xs={12} sm={12}>
                                                <Grid container spacing={2}>
                                                    <Grid item md={6} xs={6} sm={6}>
                                                        <Typography>
                                                            Salary Range<b style={{ color: "red" }}>*</b>
                                                        </Typography>
                                                        <FormControl fullWidth size="small">
                                                            <Selects
                                                                options={salaryrangeoptions}
                                                                styles={colourStyles}
                                                                value={{
                                                                    label: ebreadingdetailFilter.salaryrange,
                                                                    value: ebreadingdetailFilter.salaryrange,
                                                                }}
                                                                onChange={(e) => {
                                                                    setEbreadingdetailFilter({
                                                                        ...ebreadingdetailFilter,
                                                                        salaryrange: e.value,
                                                                        from: "",
                                                                        to: "",
                                                                        amountvalue: ""
                                                                    });
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    {ebreadingdetailFilter.salaryrange === "Between" ?
                                                        <>

                                                            <Grid item md={3} xs={3} sm={3}>
                                                                <Typography>
                                                                    From<b style={{ color: "red" }}>*</b>
                                                                </Typography>
                                                                <FormControl fullWidth size="small">
                                                                    <OutlinedInput
                                                                        id="component-outlined"
                                                                        type="text"
                                                                        size='small'
                                                                        value={ebreadingdetailFilter.from}
                                                                        onChange={(e) => {
                                                                            setEbreadingdetailFilter({
                                                                                ...ebreadingdetailFilter,
                                                                                from: e.target.value,
                                                                            });
                                                                        }}

                                                                    />
                                                                </FormControl>
                                                            </Grid>

                                                            <Grid item md={3} xs={3} sm={3}>
                                                                <Typography>
                                                                    To<b style={{ color: "red" }}>*</b>
                                                                </Typography>
                                                                <FormControl fullWidth size="small">
                                                                    <OutlinedInput
                                                                        id="component-outlined"
                                                                        type="text"
                                                                        size='small'
                                                                        value={ebreadingdetailFilter.to}
                                                                        onChange={(e) => {
                                                                            setEbreadingdetailFilter({
                                                                                ...ebreadingdetailFilter,
                                                                                to: e.target.value,
                                                                            });
                                                                        }}

                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                        </>
                                                        :
                                                        <Grid item md={6} xs={6} sm={6}>
                                                            <Typography>
                                                                Amount Value<b style={{ color: "red" }}>*</b>
                                                            </Typography>
                                                            <OutlinedInput
                                                                id="component-outlined"
                                                                type="text"
                                                                size='small'
                                                                value={ebreadingdetailFilter.amountvalue}
                                                                onChange={(e) => {
                                                                    setEbreadingdetailFilter({
                                                                        ...ebreadingdetailFilter,
                                                                        amountvalue: e.target.value,
                                                                    });
                                                                }}
                                                            />
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </Grid>

                                        </>
                                    }
                                    {ebreadingdetailFilter.type === "Process Wise" &&
                                        <>
                                            <Grid item md={3} xs={12} sm={12}>
                                                <Typography>
                                                    Process<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <FormControl fullWidth size="small">
                                                    <Selects
                                                        options={
                                                            Array.from(
                                                                new Set(ProcessOptions
                                                                    ?.filter(
                                                                        (comp) =>
                                                                            //  ebreadingdetailFilter.team === comp.team
                                                                            selectedTeamFrom
                                                                                .map((item) => item.value)
                                                                                .includes(comp.team)
                                                                    )
                                                                    ?.map((com) => com.process)
                                                                )
                                                            ).map((name) => ({
                                                                label: name,
                                                                value: name,
                                                            }))


                                                        }
                                                        styles={colourStyles}
                                                        value={{
                                                            label: ebreadingdetailFilter.process,
                                                            value: ebreadingdetailFilter.process,
                                                        }}
                                                        onChange={(e) => {
                                                            setEbreadingdetailFilter({
                                                                ...ebreadingdetailFilter,
                                                                process: e.value,
                                                            });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </>
                                    }

                                </Grid>
                                <br />  <br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={6}>
                                        <Button variant='contained' color='primary' onClick={handleSubmitFilter}>Filter</Button>

                                    </Grid>
                                    <Grid item md={2.5} xs={12} sm={6}>
                                        <Button sx={userStyle.btncancel} onClick={handleClearFilter}>Clear</Button>

                                    </Grid>
                                </Grid>

                            </>
                        </Box>
                    </>
                )}

            <br /> <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lsalaryprocesssearchreport") && (
                <>
                    <Box sx={userStyle.container}>
                        { /* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Salary Process Report List</Typography>
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
                                        {/* <MenuItem value={(ebreadingdetails?.length)}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Box >
                                    {isUserRoleCompare?.includes("excelsalaryprocesssearchreport") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("xl")
                                            }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvsalaryprocesssearchreport") && (
                                        <>
                                            <Button onClick={(e) => {
                                                setIsFilterOpen(true)
                                                setFormat("csv")
                                            }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printsalaryprocesssearchreport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>&ensp;<FaPrint />&ensp;Print&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfsalaryprocesssearchreport") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => {
                                                    setEbreadingdetailcheck(false)
                                                    setIsPdfFilterOpen(true)

                                                }}
                                            ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("imagesalaryprocesssearchreport") && (
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

                        <br /><br />
                        {ebreadingdetailCheck ?
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
            )
            }
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
                {/* print layout */}

                <TableContainer component={Paper} sx={userStyle.printcls}>
                    <Table sx={{ minWidth: 700, }} aria-label="customized table" id="usertable" ref={componentRef}>
                        <TableHead>
                            <TableRow>
                                <TableCell>S.no</TableCell>
                                <TableCell>Salary Amount</TableCell>
                                <TableCell>Experience</TableCell>
                                <TableCell>Process Code</TableCell>
                                <TableCell>Target Points</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody align="left">
                            {rowDataTable &&
                                (rowDataTable.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{row.totalValue}</TableCell>
                                        <TableCell>{row.experience}</TableCell>
                                        <TableCell>{row.salarycode}</TableCell>
                                        <TableCell>{row.targetPointsValue}</TableCell>
                                    </TableRow>
                                )))}
                        </TableBody>
                    </Table>
                </TableContainer>
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

                            salaryFixFilterexport()
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
    );
}


export default Salaryprocessreport;