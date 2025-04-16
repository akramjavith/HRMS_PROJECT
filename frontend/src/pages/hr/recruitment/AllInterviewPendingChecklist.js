import React, { useState, useEffect, useRef, useContext } from "react";
import {
    TextField,
    IconButton,
    ListItem,
    List,
    Checkbox,
    ListItemText,
    Popover,
    InputLabel,
    Box,
    Typography,
    OutlinedInput,
    TableBody,
    Select,
    Paper,
    MenuItem,
    Dialog,
    DialogContent,
    DialogActions,
    FormControl,
    Grid,
    Table,
    TableHead,
    TableContainer,
    Button,
} from "@mui/material";
import moment from "moment-timezone";
import { userStyle } from "../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { handleApiError } from "../../../components/Errorhandling";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { SERVICE } from "../../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import StyledDataGrid from "../../../components/TableStyle";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import { saveAs } from "file-saver";
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";
import { LoadingButton } from "@mui/lab";
import PageHeading from "../../../components/PageHeading";



function AllInterviewPendingCheckList() {
    const [candidates, setCandidates] = useState([]);
    const [overallDatas, setOverallDatas] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { isUserRoleAccess, isUserRoleCompare, isAssignBranch, pageName, setPageName } = useContext(
        UserRoleAccessContext
    );
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [dateValue, setDateValue] = useState([]);
    const [timeValue, setTimeValue] = useState([]);
    const [dateValueRandom, setDateValueRandom] = useState([]);
    const [timeValueRandom, setTimeValueRandom] = useState([]);
    const [dateValueMultiFrom, setDateValueMultiFrom] = useState([]);
    const [dateValueMultiTo, setDateValueMultiTo] = useState([]);
    const [tableThree, setTableThree] = useState(true);

    const [isBtn, setIsBtn] = useState(false);
    const [btnSubmit, setBtnSubmit] = useState(false);

    const handleClear = () => {
        setValueComp([]);
        setValueBran([]);
        setSelectedOptionsCom([]);
        setSelectedOptionsBran([]);
        setCandidates(overallDatas);
    };
    // company
    const [selectedOptionsCom, setSelectedOptionsCom] = useState([]);
    let [valueComp, setValueComp] = useState("");

    const handleCompanyChange = (options) => {
        setValueComp(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsCom(options);

    };

    const customValueRendererCom = (valueComp, _companys) => {
        return valueComp.length
            ? valueComp.map(({ label }) => label).join(", ")
            : "Please Select Company";
    };

    // branch
    const [selectedOptionsBran, setSelectedOptionsBran] = useState([]);
    let [valueBran, setValueBran] = useState("");

    const handleBranchChange = (options) => {
        setValueBran(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsBran(options);
    };

    const customValueRendererBran = (valueBran, _branchs) => {
        return valueBran.length
            ? valueBran.map(({ label }) => label).join(", ")
            : "Please Select Branch";
    };

    //print...
    const componentRefTwo = useRef();
    const handleprintTwo = useReactToPrint({
        content: () => componentRefTwo.current,
        documentTitle: 'All Interview Pending Check List',
        pageStyle: 'print'
    });

    //submit option for saving
    const handleSubmit = (e) => {
        setBtnSubmit(true);
        e.preventDefault();

        let companies = selectedOptionsCom?.length === 0 ? "" : selectedOptionsCom?.map((item) => item.value);
        let branches = selectedOptionsBran?.length === 0 ? "" : selectedOptionsBran?.map((item) => item.value);;

        if (selectedOptionsCom.length === 0) {
            setBtnSubmit(false);
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
        } else {
            setBtnSubmit(false);

            let filteredData = overallDatas.filter(entry => {
                const companyMatch = !companies || companies.includes(entry.company);
                const branchMatch = !branches || branches.includes(entry.branch);
                return companyMatch && branchMatch;
            });

            setCandidates(filteredData);
        }


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
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

    const exportToExcel = (excelData, fileName) => {
        setPageName(!pageName)
        try {
            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

            // Check if the browser supports Blob and FileSaver
            if (!Blob || !FileSaver) {
                console.error('Blob or FileSaver not supported');
                return;
            }

            const data = new Blob([excelBuffer], { type: fileType });

            // Check if FileSaver.saveAs is available
            if (!FileSaver.saveAs) {
                console.error('FileSaver.saveAs is not available');
                return;
            }

            FileSaver.saveAs(data, fileName + fileExtension);
        } catch (error) {
            console.error('Error exporting to Excel', error);
        }
    };

    const formatData = (data) => {
        return data.map((item, index) => {
            return {
                Sno: index + 1,
                "Module Name": item.modulename || '',
                "Sub Module Name": item.submodule || '',
                "Main Page": item.mainpage || '',
                "Sub Page": item.subpage || '',
                "Sub Sub Page": item.subsubpage || '',

            };
        });
    };

    const handleExportXLTwo = (isfilter) => {
        const dataToExport = isfilter === "filtered" ? filteredDataTwo : itemsTwo;

        if (!dataToExport || dataToExport.length === 0) {
            console.error('No data available to export');
            return;
        }

        exportToExcel(formatData(dataToExport), 'All Interview Pending Check List');
        setIsFilterOpen(false);
    };

    // pdf.....
    const columnsTwo = [
        { title: "Module Name", field: "modulename" },
        { title: "Sub Module Name", field: "submodule" },
        { title: "Main Page", field: "mainpage" },
        { title: "Sub Page", field: "subpage" },
        { title: "Sub Sub Page", field: "subsubpage" },

    ];

    const downloadPdfTwo = (isfilter) => {
        const doc = new jsPDF();
        const columnsWithSerial = [
            { title: "S.No", dataKey: "serialNumber" }, // Serial number column
            ...columnsTwo.map((col) => ({ title: col.title, dataKey: col.field })),
        ];

        // Modify row data to include serial number
        const dataWithSerial =
            isfilter === "filtered"
                ? filteredDataTwo.map((t, index) => ({
                    ...t,
                    serialNumber: index + 1,

                }))
                : itemsTwo?.map((item, index) => ({
                    ...item,
                    serialNumber: index + 1,


                }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            columns: columnsWithSerial,
            body: dataWithSerial,
            styles: { fontSize: 5 },
        });

        doc.save("All Interview Pending Check List.pdf");
    };

    const [firstDateValue, setFirstDateValue] = useState([]);
    const [firstTimeValue, setFirstTimeValue] = useState([]);
    const [secondDateValue, setSecondDateValue] = useState([]);
    const [secondTimeValue, setSecondTimeValue] = useState([]);
    const { auth } = useContext(AuthContext);

    const [isEditOpen, setIsEditOpen] = useState(false);

    const [isBankdetail, setBankdetail] = useState(false);

    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "All Interview Pending Check List.png");
                });
            });
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

    //for assigning workstation
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [tableTwoDatas, setTableTwoDatas] = useState([]);
    const [itemsTwo, setItemsTwo] = useState([]);
    const [pageTwo, setPageTwo] = useState(1);
    const [searchQueryManageTwo, setSearchQueryManageTwo] = useState("");
    const [searchQueryTwo, setSearchQueryTwo] = useState("");

    // Manage Columns
    const addSerialNumberTwo = () => {
        const itemsWithSerialNumber = tableTwoDatas?.map((item, index) => ({ ...item, serialNumber: index + 1, id: index }));
        setItemsTwo(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumberTwo();
    }, [tableTwoDatas]);

    const initialColumnVisibilityTwo = {
        serialNumber: true,
        module: true,
        submodule: true,
        mainpage: true,
        subpage: true,
        subsubpage: true,
        actions: true,
    };


    const [columnVisibilityTwo, setColumnVisibilityTwo] = useState(initialColumnVisibilityTwo);

    // Manage Columns
    const [isManageColumnsOpenTwo, setManageColumnsOpenTwo] = useState(false);
    const [anchorElTwo, setAnchorElTwo] = useState(null);



    const openTwo = Boolean(anchorElTwo);
    const idTwo = openTwo ? 'simple-popover' : undefined;


    const [pageSizeTwo, setPageSizeTwo] = useState(10);


    // Split the search query into individual terms
    const searchTermsTwo = searchQueryTwo.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDataTwos = itemsTwo?.filter((item) => {
        return searchTermsTwo.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredDataTwo = filteredDataTwos.slice((pageTwo - 1) * pageSizeTwo, pageTwo * pageSizeTwo);

    const totalPagesTwo = Math.ceil(filteredDataTwos.length / pageSizeTwo);

    const visiblePagesTwo = Math.min(totalPagesTwo, 3);

    const firstVisiblePageTwo = Math.max(1, pageTwo - 1);
    const lastVisiblePageTwo = Math.min(firstVisiblePageTwo + visiblePagesTwo - 1, totalPagesTwo);

    const pageNumbersTwo = [];

    const indexOfLastItemTwo = pageTwo * pageSizeTwo;
    const indexOfFirstItemTwo = indexOfLastItemTwo - pageSizeTwo;

    for (let i = firstVisiblePageTwo; i <= lastVisiblePageTwo; i++) {
        pageNumbersTwo.push(i);
    }
    const columnDataTableTwo = [


        {
            field: "serialNumber", headerName: "SNo",
            flex: 0, width: 100, hide: !columnVisibilityTwo.serialNumber, headerClassName: "bold-header"
        },

        { field: "module", headerName: "Module Name", flex: 0, width: 200, hide: !columnVisibilityTwo.module, headerClassName: "bold-header" },
        { field: "submodule", headerName: "Sub Module Name", flex: 0, width: 200, hide: !columnVisibilityTwo.submodule, headerClassName: "bold-header" },
        { field: "mainpage", headerName: "Main Page", flex: 0, width: 200, hide: !columnVisibilityTwo.mainpage, headerClassName: "bold-header" },
        { field: "subpage", headerName: "Sub Page", flex: 0, width: 200, hide: !columnVisibilityTwo.subpage, headerClassName: "bold-header" },
        { field: "subsubpage", headerName: "Sub Sub Page", flex: 0, width: 200, hide: !columnVisibilityTwo.subsubpage, headerClassName: "bold-header" },

    ]

    const rowDataTableTwo = filteredDataTwo.map((item, index) => {
        return {
            id: index,
            serialNumber: item.serialNumber,
            module: item.modulename,
            submodule: item.submodule,
            mainpage: item.mainpage,
            subpage: item.subpage,
            subsubpage: item.subsubpage,
            uniquename: item.uniquename,
            count: item.count

        };
    });


    // // Function to filter columns based on search query
    const filteredColumnsTwo = columnDataTableTwo.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));


    const [getDetails, setGetDetails] = useState();
    const [groupDetails, setGroupDetails] = useState();

    const getCode = async (details) => {
        setGetDetails(details);
        setPageName(!pageName)
        try {
            setGroupDetails(details?.groups);
            let forFillDetails = details?.groups?.map((data) => {
                if (data.checklist === "Date Multi Random Time") {
                    if (data?.data && data?.data !== "") {
                        const [date, time] = data?.data?.split(" ");
                        return { date, time };
                    }

                } else {
                    return { date: "0", time: "0" };
                }
            });

            let forDateSpan = details?.groups?.map((data) => {
                if (data.checklist === "Date Multi Span") {
                    if (data?.data && data?.data !== "") {
                        const [fromdate, todate] = data?.data?.split(" ");
                        return { fromdate, todate };
                    }
                } else {
                    return { fromdate: "0", todate: "0" };
                }
            })
            let forDateTime = details?.groups?.map((data) => {
                if (data.checklist === "DateTime") {
                    if (data?.data && data?.data !== "") {
                        const [date, time] = data?.data?.split(" ");
                        return { date, time };
                    }
                } else {
                    return { date: "0", time: "0" };
                }
            })

            let forDateMultiSpanTime = details?.groups?.map((data) => {
                if (data.checklist === "Date Multi Span Time") {
                    if (data?.data && data?.data !== "") {
                        const [from, to] = data?.data?.split("/");
                        const [fromdate, fromtime] = from?.split(" ");
                        const [todate, totime] = to?.split(" ");
                        return { fromdate, fromtime, todate, totime };
                    }
                } else {
                    return { fromdate: "0", fromtime: "0", todate: "0", totime: "0" };
                }
            })
            setDateValueMultiFrom(forDateSpan.map((item) => item?.fromdate))
            setDateValueMultiTo(forDateSpan.map((item) => item?.todate))
            setDateValueRandom(forFillDetails.map((item) => item?.date))
            setTimeValueRandom(forFillDetails.map((item) => item?.time))
            setDateValue(forDateTime.map((item) => item?.date))
            setTimeValue(forDateTime.map((item) => item?.time))
            setFirstDateValue(forDateMultiSpanTime.map((item) => item?.fromdate))
            setFirstTimeValue(forDateMultiSpanTime.map((item) => item?.fromtime))
            setSecondDateValue(forDateMultiSpanTime.map((item) => item?.todate))
            setSecondTimeValue(forDateMultiSpanTime.map((item) => item?.totime))
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }

    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
    const handleCloseModalert = () => {
        setIsDeleteOpenalert(false);
    };

    // Manage Columns
    const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenManageColumns = (event) => {
        setAnchorEl(event.currentTarget);
        setManageColumnsOpen(true);
    };
    const handleCloseManageColumns = () => {
        setManageColumnsOpen(false);
        setSearchQueryManage("");
    };

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
        checkbox: true,
        mode: true,
        role: true,
        branch: true,
        fullname: true,
        mobile: true,
        email: true,
        dateofbirth: true,
        qualification: true,
        experience: true,
        skill: true,
        applieddate: true,
        actions: true,
        category: true,
        subcategory: true,
        checklist: true,
        updatestatus: true,

        name: true,
        empcode: true,
        company: true,
        unit: true,
        team: true,
        approvedthrough: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    // Edit model
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };

    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);

        setDateValueMultiFrom([]);
        setDateValueMultiTo([]);
        setDateValueRandom([]);
        setTimeValueRandom([]);
        setDateValue([]);
        setTimeValue([]);
        setFirstDateValue([]);
        setFirstTimeValue([]);
        setSecondDateValue([]);
        setSecondTimeValue([]);
        setGroupDetails([]);
    };

    //get all employees list details
    const fetchUnassignedCandidates = async () => {
        setTableThree(false);
        setBankdetail(false);
        setPageName(!pageName)
        const accessbranch = isAssignBranch
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }))
        try {

            let res = await axios.post(SERVICE.PENDINGINTERVIEWCHECKLIST, {
                assignbranch: accessbranch
            }, { headers: { Authorization: `Bearer ${auth.APIToken}` } });
            setCandidates(res?.data?.derivedDatas);
            setOverallDatas(res?.data?.derivedDatas);
            setBankdetail(true);
            setTableThree(true);

        } catch (err) {
            setTableThree(true);
            setBankdetail(true);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    //  PDF
    let columns = [
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Name", field: "fullname" },
        { title: "Contact Number", field: "mobile" },
        { title: "Email", field: "email" },
        { title: "Status", field: "updatestatus" },
        { title: "Category", field: "category" },
        { title: "Sub Category", field: "subcategory" },


    ];


    //------------------------------------------------------

    const [isFilterOpenNew, setIsFilterOpenNew] = useState(false);
    const [isPdfFilterOpenNew, setIsPdfFilterOpenNew] = useState(false);

    // page refersh reload
    const handleCloseFilterModNew = () => {
        setIsFilterOpenNew(false);
    };

    const handleClosePdfFilterModNew = () => {
        setIsPdfFilterOpenNew(false);
    };

    const [fileFormatNew, setFormatNew] = useState("xl");
    const fileTypeNew = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtensionNew = fileFormatNew === "xl" ? ".xlsx" : ".csv";

    const exportToExcelNew = (excelData, fileName) => {
        setPageName(!pageName)
        try {
            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

            // Check if the browser supports Blob and FileSaver
            if (!Blob || !FileSaver) {
                console.error('Blob or FileSaver not supported');
                return;
            }

            const data = new Blob([excelBuffer], { type: fileTypeNew });

            // Check if FileSaver.saveAs is available
            if (!FileSaver.saveAs) {
                console.error('FileSaver.saveAs is not available');
                return;
            }

            FileSaver.saveAs(data, fileName + fileExtensionNew);
        } catch (error) {
            console.error('Error exporting to Excel', error);
        }
    };

    const formatDataNew = (data) => {
        return data.map((item, index) => {

            return {
                Sno: index + 1,
                "Company": item.company,
                "Branch": item.branch,
                "Name": item.fullname,
                "Contact Number": item.mobile,
                "Email": item.email,
                "Status": item.updatestatus,
                Category: item.category,
                "Sub Category": item.subcategory,

            };
        });
    };

    const handleExportXLNew = (isfilter) => {

        const dataToExport = isfilter === "filtered" ? filteredData : items;

        if (!dataToExport || dataToExport.length === 0) {
            console.error('No data available to export');
            return;
        }

        exportToExcelNew(formatDataNew(dataToExport), 'All Interview Pending Check List');
        setIsFilterOpenNew(false);
    };


    const downloadPdfNew = (isfilter) => {
        const doc = new jsPDF();
        const columnsWithSerial = [
            { title: "S.No", dataKey: "serialNumber" }, // Serial number column
            ...columns.map((col) => ({ title: col.title, dataKey: col.field })),
        ];

        // Modify row data to include serial number
        const dataWithSerial =
            isfilter === "filtered"
                ? filteredData.map((t, index) => ({
                    ...t,
                    serialNumber: index + 1,

                }))
                : items?.map((item, index) => ({
                    ...item,
                    serialNumber: index + 1,


                }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            columns: columnsWithSerial,
            body: dataWithSerial,
            styles: { fontSize: 5 },
        });

        doc.save("All Interview Pending Check List.pdf");
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "All Interview Pending Check List",
        pageStyle: "print",
    });

    useEffect(() => {
        fetchUnassignedCandidates();
    }, []);

    //table entries ..,.
    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = candidates?.map((item, index) => {

            return {
                id: index,
                serialNumber: index + 1,
                fullname: item?.fullname,
                mobile: item?.mobile,
                email: item?.email,
                category: item?.category?.join(','),
                subcategory: item?.subcategory?.join(','),

                company: item?.company,
                branch: item?.branch,
                city: item?.city,
                groups: item?.groups?.filter((itemNew) => {
                    if (itemNew.checklist === "Attachments") {
                        return (itemNew.files === undefined || itemNew.files === "");
                    } else {
                        return (itemNew.data === undefined || itemNew.data === "");
                    }
                }),
                updatestatus: "Pending"

            };
        });
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [candidates]);

    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRows([]);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setSelectedRows([]);
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

    const filteredData = filteredDatas.slice(
        (page - 1) * pageSize,
        page * pageSize
    );

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );

    const pageNumbers = [];

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }

    let columnDataTable = [

        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 50,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 150,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 150,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "fullname",
            headerName: "Name",
            flex: 0,
            width: 150,
            hide: !columnVisibility.fullname,
            headerClassName: "bold-header",
        },

        {
            field: "mobile",
            headerName: "Contact No",
            flex: 0,
            width: 100,
            hide: !columnVisibility.mobile,
            headerClassName: "bold-header",
        },
        {
            field: "email",
            headerName: "Email",
            flex: 0,
            width: 100,
            hide: !columnVisibility.email,
            headerClassName: "bold-header",
        },
        {
            field: "updatestatus",
            headerName: "Status",
            flex: 0,
            width: 150,
            hide: !columnVisibility.updatestatus,
            headerClassName: "bold-header",
        },
        { field: "category", headerName: "Category", flex: 0, width: 100, hide: !columnVisibility.category, headerClassName: "bold-header" },
        { field: "subcategory", headerName: "Sub Category", flex: 0, width: 150, hide: !columnVisibility.subcategory, headerClassName: "bold-header" },
        {
            field: "mode",
            headerName: "Mode",
            flex: 0,
            width: 180,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.mode,
            headerClassName: "bold-header",
            // Assign Bank Detail
            renderCell: (params) => {

                return (
                    <Grid sx={{ display: "flex", justifyContent: 'center' }}>

                        <>
                            {isUserRoleCompare?.includes("eallinterviewpendingchecklist") && (
                                <div style={{
                                    color: '#fff', border: '1px solid #1565c0', padding: '2px 20px', borderRadius: '20px', transition: 'background-color 0.3s',
                                    cursor: 'pointer', backgroundColor: '#1565c0'
                                }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#fff';
                                        e.target.style.color = '#1565c0';
                                    }} // Change background color on hover
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#1565c0';
                                        e.target.style.color = '#fff';
                                    }}
                                    onClick={() => {

                                        handleClickOpenEdit();
                                        getCode(params.row);
                                    }}
                                >
                                    VIEW
                                </div>

                            )}
                        </>

                    </Grid>
                );
            },
        },

    ];



    const rowDataTable = filteredData.map((item, index) => {

        return {
            id: index,
            serialNumber: item?.serialNumber,
            role: item?.role,
            fullname: item?.fullname,
            mobile: item?.mobile,
            email: item?.email,
            category: item?.category,
            subcategory: item?.subcategory,
            checklist: item?.checklist,
            username: item?.username,
            password: item?.password,
            company: item?.company,
            branch: item?.branch,
            adharnumber: item?.adharnumber,
            pannumber: item?.pannumber,
            dateofbirth: item?.dateofbirth,
            address: item?.address,
            groups: item?.groups,
            information: item?.information,
            updatestatus: "Pending"

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

    // // Function to filter columns based on search query
    const filteredColumns = columnDataTable?.filter((column) =>
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
                <TextField
                    label="Find column"
                    variant="standard"
                    fullWidth
                    value={searchQueryManage}
                    onChange={(e) => setSearchQueryManage(e.target.value)}
                    sx={{ marginBottom: 5, position: "absolute" }}
                />
            </Box>
            <br />
            <br />
            <DialogContent
                sx={{ minWidth: "auto", height: "200px", position: "relative" }}
            >
                <List sx={{ overflow: "auto", height: "100%" }}>
                    {filteredColumns.map((column) => (
                        <ListItem key={column.field}>
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={
                                    <Switch
                                        sx={{ marginTop: "-5px" }}
                                        size="small"
                                        checked={columnVisibility[column.field]}
                                        onChange={() => toggleColumnVisibility(column.field)}
                                    />
                                }
                                secondary={
                                    column.field === "checkbox" ? "Checkbox" : column.headerName
                                }
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
                            onClick={() => setColumnVisibility(initialColumnVisibility)}
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
            {/* ****** Header Content ****** */}
            <Headtitle title={"All Interview Pending Check List"} />
            <PageHeading
                title="All Interview Pending Check List"
                modulename="Checklist"
                submodulename="All Interview Pending Checklist"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            <>

                <Box sx={userStyle.dialogbox}>
                    <>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Typography sx={userStyle.importheadtext}>All Interview Pending Check List</Typography>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>

                            <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
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
                                        value={selectedOptionsCom}
                                        onChange={(e) => {
                                            handleCompanyChange(e);
                                            setSelectedOptionsBran([]);
                                        }}
                                        valueRenderer={customValueRendererCom}
                                        labelledBy="Please Select Company"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} sm={12} xs={12} sx={{ display: "flex", flexDirection: "row" }}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Branch<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <MultiSelect
                                        options={isAssignBranch?.filter(
                                            (comp) =>
                                                selectedOptionsCom.map(data => data.value).includes(comp.company)
                                        )?.map(data => ({
                                            label: data.branch,
                                            value: data.branch,
                                        })).filter((item, index, self) => {
                                            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                        })}
                                        value={selectedOptionsBran}
                                        onChange={(e) => {
                                            handleBranchChange(e);
                                        }}
                                        valueRenderer={customValueRendererBran}
                                        labelledBy="Please Select Branch"
                                    />
                                </FormControl>
                            </Grid>

                        </Grid>
                        <Grid item md={12} sm={12} xs={12}>
                            <br />
                            <br />
                            <Grid
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "15px",
                                }}
                            >
                                <LoadingButton variant="contained"
                                    onClick={handleSubmit}
                                    disabled={isBtn}
                                    loading={btnSubmit}
                                >
                                    Filter
                                </LoadingButton>
                                <Button sx={userStyle.btncancel}
                                    onClick={handleClear}
                                >
                                    CLEAR
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </>
            <br />

            <>
                <>
                    {isUserRoleCompare?.includes("lallinterviewpendingchecklist") && (
                        <>
                            <Box sx={userStyle.container}>
                                {/* ******************************************************EXPORT Buttons****************************************************** */}
                                <Grid container spacing={2}>
                                    <Grid item md={12} lg={12} xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography sx={userStyle.SubHeaderText}>
                                            All Interview Pending Check List
                                        </Typography>
                                    </Grid>

                                </Grid>
                                <br />
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
                                            {isUserRoleCompare?.includes("excelallinterviewpendingchecklist") && (
                                                <>
                                                    <Button
                                                        onClick={(e) => {
                                                            setIsFilterOpenNew(true);
                                                            setFormatNew("xl");
                                                        }}
                                                        sx={userStyle.buttongrp}
                                                    >
                                                        <FaFileExcel />
                                                        &ensp;Export to Excel&ensp;
                                                    </Button>

                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("csvallinterviewpendingchecklist") && (
                                                <>

                                                    <Button
                                                        onClick={(e) => {
                                                            setIsFilterOpenNew(true);
                                                            setFormatNew("csv");
                                                        }}
                                                        sx={userStyle.buttongrp}
                                                    >
                                                        <FaFileCsv />
                                                        &ensp;Export to CSV&ensp;
                                                    </Button>

                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printallinterviewpendingchecklist") && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                        &ensp;
                                                        <FaPrint />
                                                        &ensp;Print&ensp;
                                                    </Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("pdfallinterviewpendingchecklist") && (
                                                <>
                                                    <Button
                                                        sx={userStyle.buttongrp}
                                                        onClick={() => {
                                                            setIsPdfFilterOpenNew(true);
                                                        }}
                                                    >
                                                        <FaFilePdf />
                                                        &ensp;Export to PDF&ensp;
                                                    </Button>
                                                </>
                                            )}
                                            {isUserRoleCompare?.includes("printallinterviewpendingchecklist") && (
                                                <Button
                                                    sx={userStyle.buttongrp}
                                                    onClick={handleCaptureImage}
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
                                        <Box>
                                            <FormControl fullWidth size="small">
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
                                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                                    Show All Columns
                                </Button>
                                &ensp;
                                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                                    Manage Columns
                                </Button>
                                &ensp;
                                <br />
                                <br />
                                {!isBankdetail ? (
                                    <>
                                        <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                                ) : (
                                    <>
                                        <Box
                                            style={{
                                                width: "100%",
                                                overflowY: "hidden", // Hide the y-axis scrollbar
                                            }}
                                        >
                                            <StyledDataGrid
                                                onClipboardCopy={(copiedString) =>
                                                    setCopiedData(copiedString)
                                                }
                                                rows={rowsWithCheckboxes}
                                                columns={columnDataTable.filter(
                                                    (column) => columnVisibility[column.field]
                                                )}
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
                                                Showing{" "}
                                                {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                                                {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                                                {filteredDatas.length} entries
                                            </Box>
                                            <Box>
                                                <Button
                                                    onClick={() => setPage(1)}
                                                    disabled={page === 1}
                                                    sx={userStyle.paginationbtn}
                                                >
                                                    <FirstPageIcon />
                                                </Button>
                                                <Button
                                                    onClick={() => handlePageChange(page - 1)}
                                                    disabled={page === 1}
                                                    sx={userStyle.paginationbtn}
                                                >
                                                    <NavigateBeforeIcon />
                                                </Button>
                                                {pageNumbers?.map((pageNumber) => (
                                                    <Button
                                                        key={pageNumber}
                                                        sx={userStyle.paginationbtn}
                                                        onClick={() => handlePageChange(pageNumber)}
                                                        className={page === pageNumber ? "active" : ""}
                                                        disabled={page === pageNumber}
                                                    >
                                                        {pageNumber}
                                                    </Button>
                                                ))}
                                                {lastVisiblePage < totalPages && <span>...</span>}
                                                <Button
                                                    onClick={() => handlePageChange(page + 1)}
                                                    disabled={page === totalPages}
                                                    sx={userStyle.paginationbtn}
                                                >
                                                    <NavigateNextIcon />
                                                </Button>
                                                <Button
                                                    onClick={() => setPage(totalPages)}
                                                    disabled={page === totalPages}
                                                    sx={userStyle.paginationbtn}
                                                >
                                                    <LastPageIcon />
                                                </Button>
                                            </Box>
                                        </Box>
                                    </>
                                )}
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
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                    >
                        {manageColumnsContent}
                    </Popover>
                </>
            </>

            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isDeleteOpenalert}
                    onClose={handleCloseModalert}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "70px", color: "orange" }}
                        />
                        <Typography
                            variant="h6"
                            sx={{ color: "black", textAlign: "center" }}
                        >
                            Please Select any Row
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={handleCloseModalert}
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* Bulk delete ALERT DIALOG */}
            <Dialog
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                >
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "70px", color: "orange" }}
                    />
                    <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                        Please Select any Row
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        variant="contained"
                        color="error"
                        onClick={handleCloseModalert}
                    >
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={isErrorOpen}
                onClose={handleCloseerr}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                >
                    <Typography variant="h6">{showAlert}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="error" onClick={handleCloseerr}>
                        ok
                    </Button>
                </DialogActions>
            </Dialog>


            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="simple table" id="branch" ref={componentRef}>
                    <TableHead sx={{ fontWeight: "200" }}>
                        <StyledTableRow>
                            <StyledTableCell>SI.NO</StyledTableCell>
                            <StyledTableCell>Company</StyledTableCell>
                            <StyledTableCell>Branch</StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Conatact Number</StyledTableCell>
                            <StyledTableCell>Email</StyledTableCell>
                            <StyledTableCell>Status</StyledTableCell>
                            <StyledTableCell>Category</StyledTableCell>
                            <StyledTableCell>Sub Category</StyledTableCell>


                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell> {row.company}</StyledTableCell>
                                    <StyledTableCell> {row.branch}</StyledTableCell>
                                    <StyledTableCell> {row.fullname}</StyledTableCell>
                                    <StyledTableCell> {row.mobile}</StyledTableCell>
                                    <StyledTableCell> {row.email}</StyledTableCell>
                                    <StyledTableCell> {row.updatestatus}</StyledTableCell>
                                    <StyledTableCell> {row.category}</StyledTableCell>
                                    <StyledTableCell> {row.subcategory}</StyledTableCell>

                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>



            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="simple table" id="branch" ref={componentRefTwo}>
                    <TableHead sx={{ fontWeight: "500" }}>
                        <StyledTableRow>
                            <StyledTableCell>SI.NO</StyledTableCell>
                            <StyledTableCell>Module Name</StyledTableCell>
                            <StyledTableCell>Sub Module Name</StyledTableCell>
                            <StyledTableCell>Main Page</StyledTableCell>
                            <StyledTableCell>Sub Page</StyledTableCell>
                            <StyledTableCell>Sub Sub Page</StyledTableCell>

                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rowDataTableTwo &&
                            rowDataTableTwo.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell> {row.module}</StyledTableCell>
                                    <StyledTableCell> {row.submodule}</StyledTableCell>
                                    <StyledTableCell> {row.mainpage}</StyledTableCell>
                                    <StyledTableCell> {row.subpage}</StyledTableCell>
                                    <StyledTableCell> {row.subsubpage}</StyledTableCell>

                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {/*Export XL Data  */}
            <Dialog
                open={isFilterOpen}
                onClose={handleCloseFilterMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
                    {fileFormat === "xl" ? (
                        <>
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

                            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
                            <Typography variant="h5" sx={{ textAlign: "center" }}>
                                Choose Export
                            </Typography>
                        </>
                    ) : (
                        <>
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

                            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
                            <Typography variant="h5" sx={{ textAlign: "center" }}>
                                Choose Export
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={(e) => {
                            handleExportXLTwo("filtered");
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={(e) => {
                            handleExportXLTwo("overall");

                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog
                open={isPdfFilterOpen}
                onClose={handleClosePdfFilterMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
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
                            downloadPdfTwo("filtered");
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdfTwo("overall");
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/* for second */}
            {/*Export XL Data  */}
            <Dialog
                open={isFilterOpenNew}
                onClose={handleCloseFilterModNew}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
                    {fileFormatNew === "xl" ? (
                        <>
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseFilterModNew}
                                sx={{
                                    position: "absolute",
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>

                            <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
                            <Typography variant="h5" sx={{ textAlign: "center" }}>
                                Choose Export
                            </Typography>
                        </>
                    ) : (
                        <>
                            <IconButton
                                aria-label="close"
                                onClick={handleCloseFilterModNew}
                                sx={{
                                    position: "absolute",
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>

                            <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
                            <Typography variant="h5" sx={{ textAlign: "center" }}>
                                Choose Export
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={(e) => {
                            handleExportXLNew("filtered");
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={(e) => {
                            handleExportXLNew("overall");

                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
            {/*Export pdf Data  */}
            <Dialog
                open={isPdfFilterOpenNew}
                onClose={handleClosePdfFilterModNew}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    sx={{
                        textAlign: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={handleClosePdfFilterModNew}
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
                            downloadPdfNew("filtered");
                            setIsPdfFilterOpenNew(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdfNew("overall");
                            setIsPdfFilterOpenNew(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit DIALOG */}
            <Dialog open={isEditOpen} onClose={handleCloseModEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="xl" fullWidth={true} sx={{
                overflow: 'visible',
                '& .MuiPaper-root': {
                    overflow: 'auto',
                },
            }}>
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.SubHeaderText} >
                            All Interview Pending Check List
                        </Typography>
                        <br />
                        <br />
                        <Grid container spacing={2} >
                            <Grid item md={12} xs={12} sm={12} >
                                <FormControl fullWidth size="small" sx={{ display: 'flex', justifyContent: 'center', border: '1px solid black', borderRadius: '20px' }} >
                                    <Typography sx={{ fontSize: '1rem', textAlign: 'center' }} >
                                        Name: <span style={{ fontWeight: '500', fontSize: '1.2rem', display: 'inline-block', textAlign: 'center' }}> {`${getDetails?.fullname}`}</span>
                                    </Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead >
                                    <TableRow>

                                        <TableCell style={{ fontSize: '1.2rem' }}>Details</TableCell>
                                        <TableCell style={{ fontSize: '1.2rem' }}>Field</TableCell>
                                        <TableCell style={{ fontSize: '1.2rem' }}>Allotted To</TableCell>
                                        <TableCell style={{ fontSize: '1.2rem' }}>Completed By</TableCell>
                                        <TableCell style={{ fontSize: '1.2rem' }}>Completed At</TableCell>
                                        <TableCell style={{ fontSize: '1.2rem' }}>Status</TableCell>

                                        <TableCell style={{ fontSize: '1.2rem' }}>Category</TableCell>
                                        <TableCell style={{ fontSize: '1.2rem' }}>Sub Category</TableCell>

                                        {/* Add more table headers as needed */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {groupDetails?.map((row, index) => (
                                        <TableRow key={index}>

                                            <TableCell>{row.details}</TableCell>
                                            {
                                                (() => {
                                                    switch (row.checklist) {
                                                        case "Text Box":

                                                            return <TableCell>
                                                                <OutlinedInput
                                                                    style={{ height: '32px' }}
                                                                    value={row.data}
                                                                    readOnly

                                                                />
                                                            </TableCell>;
                                                        case "Text Box-number":
                                                            return <TableCell>
                                                                <OutlinedInput value={row.data}
                                                                    style={{ height: '32px' }}
                                                                    type="text"
                                                                    readOnly

                                                                />
                                                            </TableCell>;
                                                        case "Text Box-alpha":
                                                            return <TableCell>
                                                                <OutlinedInput
                                                                    style={{ height: '32px' }}
                                                                    value={row.data}
                                                                    readOnly

                                                                />
                                                            </TableCell>;
                                                        case "Text Box-alphanumeric":
                                                            return <TableCell>
                                                                <OutlinedInput
                                                                    style={{ height: '32px' }}
                                                                    value={row.data}
                                                                    readOnly
                                                                />
                                                            </TableCell>;
                                                        case "Attachments":
                                                            return <TableCell>
                                                                <div>
                                                                    <InputLabel sx={{ m: 1 }}>File</InputLabel>


                                                                    <div>

                                                                        <Box
                                                                            sx={{ display: "flex", flexDirection: 'column', marginTop: "10px", gap: "10px" }}
                                                                        >



                                                                            {row.files && <Grid container spacing={2} sx={{
                                                                                display: "flex", flexDirection: 'column'
                                                                            }}>
                                                                                <Grid item lg={8} md={8} sm={8} xs={8}>
                                                                                    <Typography>{row.files.name}</Typography>
                                                                                </Grid>
                                                                                <Grid item lg={1} md={1} sm={1} xs={1}>
                                                                                    <VisibilityOutlinedIcon
                                                                                        style={{
                                                                                            fontsize: "large",
                                                                                            color: "#357AE8",
                                                                                            cursor: "pointer",
                                                                                        }}
                                                                                        onClick={() => renderFilePreviewEdit(row.files)}
                                                                                    />
                                                                                </Grid>

                                                                            </Grid>}

                                                                        </Box>

                                                                    </div>

                                                                </div>


                                                            </TableCell>;
                                                        case "Pre-Value":
                                                            return <TableCell><Typography>{row?.data}</Typography>

                                                            </TableCell>;
                                                        case "Date":
                                                            return <TableCell>
                                                                <OutlinedInput
                                                                    style={{ height: '32px' }}
                                                                    type='date'
                                                                    value={row.data}
                                                                    readOnly
                                                                />
                                                            </TableCell>;
                                                        case "Time":
                                                            return <TableCell>
                                                                <OutlinedInput
                                                                    style={{ height: '32px' }}
                                                                    type='time'
                                                                    value={row.data}
                                                                    readOnly
                                                                />
                                                            </TableCell>;
                                                        case "DateTime":
                                                            return <TableCell>
                                                                <Stack direction="row" spacing={2}>
                                                                    <OutlinedInput
                                                                        style={{ height: '32px' }}
                                                                        type='date'
                                                                        value={dateValue[index]}
                                                                        readOnly
                                                                    />
                                                                    <OutlinedInput
                                                                        type='time'
                                                                        style={{ height: '32px' }}
                                                                        value={timeValue[index]}
                                                                        readOnly
                                                                    />
                                                                </Stack>
                                                            </TableCell>;
                                                        case "Date Multi Span":
                                                            return <TableCell>
                                                                <Stack direction="row" spacing={2}>
                                                                    <OutlinedInput
                                                                        style={{ height: '32px' }}
                                                                        type='date'
                                                                        value={dateValueMultiFrom[index]}
                                                                        readOnly
                                                                    />
                                                                    <OutlinedInput
                                                                        type='date'
                                                                        style={{ height: '32px' }}
                                                                        value={dateValueMultiTo[index]}
                                                                        readOnly
                                                                    />
                                                                </Stack>
                                                            </TableCell>;
                                                        case "Date Multi Span Time":
                                                            return <TableCell>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                                    <Stack direction="row" spacing={2}>
                                                                        <OutlinedInput
                                                                            style={{ height: '32px' }}
                                                                            type='date'
                                                                            value={firstDateValue[index]}
                                                                            readOnly
                                                                        />
                                                                        <OutlinedInput
                                                                            type='time'
                                                                            style={{ height: '32px' }}
                                                                            value={firstTimeValue[index]}
                                                                            readOnly
                                                                        />
                                                                    </Stack>
                                                                    <Stack direction="row" spacing={2}>

                                                                        <OutlinedInput
                                                                            type='date'
                                                                            style={{ height: '32px' }}
                                                                            value={secondDateValue[index]}
                                                                            readOnly
                                                                        />
                                                                        <OutlinedInput
                                                                            style={{ height: '32px' }}
                                                                            type='time'
                                                                            value={secondTimeValue[index]}
                                                                            readOnly
                                                                        />
                                                                    </Stack>
                                                                </div>

                                                            </TableCell>;
                                                        case "Date Multi Random":
                                                            return <TableCell>
                                                                <OutlinedInput
                                                                    style={{ height: '32px' }}
                                                                    type='date'
                                                                    value={row.data}
                                                                    readOnly
                                                                />
                                                            </TableCell>;
                                                        case "Date Multi Random Time":
                                                            return <TableCell>
                                                                <Stack direction="row" spacing={2}>
                                                                    <OutlinedInput
                                                                        style={{ height: '32px' }}
                                                                        type='date'
                                                                        value={dateValueRandom[index]}
                                                                        readOnly
                                                                    />
                                                                    <OutlinedInput
                                                                        type='time'
                                                                        style={{ height: '32px' }}
                                                                        value={timeValueRandom[index]}
                                                                        readOnly
                                                                    />
                                                                </Stack>
                                                            </TableCell>;
                                                        case "Radio":
                                                            return <TableCell>
                                                                <FormControl component="fieldset">
                                                                    <RadioGroup value={row.data} sx={{ display: 'flex', flexDirection: 'row !important' }}
                                                                    >
                                                                        <FormControlLabel value="No" control={<Radio />} label="No" />
                                                                        <FormControlLabel value="Yes" control={<Radio />} label="Yes" />

                                                                    </RadioGroup>
                                                                </FormControl>
                                                            </TableCell>;

                                                        default:
                                                            return <TableCell></TableCell>; // Default case
                                                    }
                                                })()
                                            }
                                            <TableCell>
                                                {Array.isArray(row?.employee) &&
                                                    row.employee.map((item, index) => (
                                                        <Typography key={index} variant="body1">
                                                            {`${index + 1}. ${item}, `}
                                                        </Typography>
                                                    ))}
                                            </TableCell>
                                            <TableCell>
                                                <Typography>{row?.completedby}</Typography>
                                            </TableCell>
                                            <TableCell>{row.completedat && moment(row.completedat).format("DD-MM-YYYY hh:mm:ss A")}</TableCell>

                                            <TableCell>
                                                {row.checklist === "DateTime" ?
                                                    (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16) ?
                                                        <Typography>Completed</Typography>
                                                        : <Typography>Pending</Typography>
                                                    : row.checklist === "Date Multi Span" ?
                                                        (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 21) ?
                                                            <Typography>Completed</Typography>
                                                            : <Typography>Pending</Typography>
                                                        : row.checklist === "Date Multi Span Time" ?
                                                            (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 33) ?
                                                                <Typography>Completed</Typography>
                                                                : <Typography>Pending</Typography>
                                                            : row.checklist === "Date Multi Random Time" ?
                                                                (((row.data !== undefined && row.data !== "") || (row.files !== undefined)) && row.data.length === 16) ?
                                                                    <Typography>Completed</Typography>
                                                                    : <Typography>Pending</Typography>
                                                                : ((row.data !== undefined && row.data !== "") || (row.files !== undefined)) ?
                                                                    <Typography>Completed</Typography>
                                                                    : <Typography>Pending</Typography>
                                                }
                                            </TableCell>


                                            <TableCell>{row.category}</TableCell>
                                            <TableCell>{row.subcategory}</TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <br /> <br /> <br />
                        <Grid container>
                            <Button variant="contained" color="primary" onClick={handleCloseModEdit}>
                                Back
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>
        </Box >
    );
}

export default AllInterviewPendingCheckList;