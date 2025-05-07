import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import LoadingButton from "@mui/lab/LoadingButton";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl, Grid,
    IconButton,
    List, ListItem, ListItemText,
    MenuItem,
    OutlinedInput,
    Paper,
    Popover,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import Switch from '@mui/material/Switch';
import { styled } from '@mui/system';
import axios from "axios";
import * as FileSaver from 'file-saver';
import { saveAs } from "file-saver";
import html2canvas from 'html2canvas';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import React, { useContext, useCallback, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from 'react-loader-spinner';
import { MultiSelect } from "react-multi-select-component";
import Resizable from 'react-resizable';
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import * as XLSX from 'xlsx';
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from "../../components/AggridTable";
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from '../../services/Baseservice';
import ExportData from "../../components/ExportData";
import domtoimage from 'dom-to-image';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { AgGridReact } from "ag-grid-react";


function Salaryprocessreport() {

    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);

    const [overallItems, setOverallItems] = useState([]);

    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const [pageNumbers, setPageNumbers] = useState([]);

    const gridApi = useRef(null);
    const columnApi = useRef(null);
    let minRowHeight = 25;
    let currentRowHeight;
    const onGridReady = useCallback((params) => {
        gridApi.current = params.api;
        columnApi.current = params.columnApi;
        // minRowHeight = params.api.getSizesForCurrentTheme().rowHeight;
        // currentRowHeight = minRowHeight;
    }, []);

    let exportColumnNames = [

        'Salary Amount',
        'Experience',
        'Process code',
        'Target Points'
    ];
    let exportRowValues = [

        'totalValue',
        'experience',
        'salarycode',
        'targetPointsValue'
    ];

    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("")
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
            pagename: String("Salary Process Report"),
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


    const [selectedCompanyFrom, setSelectedCompanyFrom] = useState([]);
    const [selectedBranchFrom, setSelectedBranchFrom] = useState([]);
    const [selectedUnitFrom, setSelectedUnitFrom] = useState([]);
    const [selectedTeamFrom, setSelectedTeamFrom] = useState([]);

    const [companies, setCompanies] = useState([]);
    const [branches, setBranches] = useState([]);
    const [units, setUnits] = useState([]);
    const [teamsall, setTeamsall] = useState([]);

    // const [isFilterOpen, setIsFilterOpen] = useState(false);
    // const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
    // // page refersh reload
    // const handleCloseFilterMod = () => {
    //     setIsFilterOpen(false);
    // };

    // const handleClosePdfFilterMod = () => {
    //     setIsPdfFilterOpen(false);
    // };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
        // setloadingdeloverall(false);
        setExportLoading(false)
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
        setExportLoading(false)
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

    const { isUserRoleCompare, isAssignBranch, pageName, setPageName, isUserRoleAccess, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const accessbranch = isUserRoleAccess?.role?.includes("Manager")
        ? isAssignBranch?.map((data) => ({
            branch: data.branch,
            company: data.company,
            unit: data.unit,
        }))
        : isAssignBranch
            ?.filter((data) => {
                let fetfinalurl = [];

                if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 &&
                    data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subsubpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 &&
                    data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.submodulenameurl;
                } else if (data?.modulenameurl?.length !== 0) {
                    fetfinalurl = data.modulenameurl;
                } else {
                    fetfinalurl = [];
                }

                const remove = [
                    window.location.pathname?.substring(1),
                    window.location.pathname,
                ];
                return fetfinalurl?.some((item) => remove?.includes(item));
            })
            ?.map((data) => ({
                branch: data.branch,
                company: data.company,
                unit: data.unit,
            }));


    const [ebreadingdetailCheck, setEbreadingdetailcheck] = useState(false);

    const gridRef = useRef(null);

    const [selectedRows, setSelectedRows] = useState([]);


    const [searchQueryManage, setSearchQueryManage] = useState("");

    const [copiedData, setCopiedData] = useState('');


    const gridRefTableImg = useRef(null);
    // image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Salary Process Report.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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

    const [delayedSearchQuery, setDelayedSearchQuery] = useState("");


    const SalaryFixFilter = async () => {
        setEbreadingdetailcheck(true)
        setPageName(!pageName)
        try {

            const response = await axios.post(
                SERVICE.SALARY_FIX_FILTERREPORT,
                {
                    company: selectedCompanyFrom.map(item => item.value),
                    branch: selectedBranchFrom.map(item => item.value),

                    team: selectedTeamFrom.map(item => item.value),
                    unit: selectedUnitFrom.map(item => item.value),
                    salaryrange: ebreadingdetailFilter.salaryrange,

                    type: ebreadingdetailFilter.type,
                    process: ebreadingdetailFilter.type == "Process Wise" ? ebreadingdetailFilter.process : "",
                    amountvalue: ebreadingdetailFilter.type == "Amount Wise" ? ebreadingdetailFilter.amountvalue : "",
                    fromamount: ebreadingdetailFilter.from,
                    toamount: ebreadingdetailFilter.to,
                    page: page,
                    pageSize: pageSize,
                    searchTerm: delayedSearchQuery,

                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );


            const itemsWithSerialNumber = response.data.results?.map((item, index) => ({
                ...item,
                experience: extractNumbers(item.salarycode), code: extractText(item.salarycode), serialNumber: index + 1
            }));


            let final = response.data.results;

            let subcates = final.map((d, index) => {
                return {
                    ...d,
                    id: index + 1,
                    serialNumber: (page - 1) * pageSize + index + 1,
                    experience: extractNumbers(d.salarycode),
                    code: extractText(d.salarycode)
                };
            });
            let subcatescount = response?.data?.totalCount;

            setTotalCount(subcatescount);
            setTotalPages(Math.ceil(subcatescount / pageSize));
            const firstVisiblePage = Math.max(1, page - 1);
            const lastVisiblePage = Math.min(firstVisiblePage + 3 - 1, Math.ceil(subcatescount / pageSize));

            const newPageNumbers = [];
            for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
                newPageNumbers.push(i);
            }
            setPageNumbers(newPageNumbers);
            setSalaryFix(subcates);
            // setProjmaster(subcates);
            setEbreadingdetailcheck(false);

            // setSalaryFix(itemsWithSerialNumber);
            // setEbreadingdetailcheck(false)

        } catch (err) { setEbreadingdetailcheck(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
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
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };



    //submit option for saving
    const handleSubmitFilter = (e) => {
        // e.preventDefault();
        if (selectedCompanyFrom.length === 0) {
            setPopupContentMalert("Please Select Company");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (selectedBranchFrom.length === 0) {
            setPopupContentMalert("Please Select Branch");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();

        } else if (selectedUnitFrom.length === 0) {
            setPopupContentMalert("Please Select Unit");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        } else if (selectedTeamFrom.length === 0) {
            setPopupContentMalert("Please Select Team");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (ebreadingdetailFilter.type === "Please Select Type") {
            setPopupContentMalert("Please Select Type");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else if (ebreadingdetailFilter.type === "Amount Wise" && ebreadingdetailFilter.salaryrange === "Please Select Salary Range") {
            setPopupContentMalert("Please Select Salary Range");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }

        else if (ebreadingdetailFilter.type === "Process Wise" && ebreadingdetailFilter.process === "Please Select Process") {
            setPopupContentMalert("Please Select Process");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }

        else if (ebreadingdetailFilter.salaryrange === "Between" && ebreadingdetailFilter.from === "") {
            setPopupContentMalert("Please Enter From");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }

        else if (ebreadingdetailFilter.salaryrange === "Between" && ebreadingdetailFilter.to === "") {
            setPopupContentMalert("Please Enter To");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();



        }
        else if (ebreadingdetailFilter.salaryrange === "Between" && Number(ebreadingdetailFilter.from) >= Number(ebreadingdetailFilter.to)) {
            setPopupContentMalert("To must be greater than From");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }

        else if ((ebreadingdetailFilter.salaryrange === "Less Than" ||
            ebreadingdetailFilter.salaryrange === "Greater Than" ||

            ebreadingdetailFilter.salaryrange === "Exact") && ebreadingdetailFilter.amountvalue === "") {
            setPopupContentMalert("Please Enter Amount Value");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();


        }
        else {
            // setSearchQuery("")
            SalaryFixFilter()
        }
    }
    useEffect(() => {
        if (selectedCompanyFrom.length === 0 && selectedBranchFrom.length === 0

            && selectedUnitFrom.length === 0 && selectedTeamFrom.length === 0
            && ebreadingdetailFilter.type === "Please Select Type"

        ) {

        } else {
            handleSubmitFilter()
        }
    }, [page, pageSize, delayedSearchQuery])



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
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        setSearchQuery("")

    }






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


    const addSerialNumber = (datas) => {

        setItems(datas);
        setOverallItems(datas);
    }


    useEffect(() => {
        addSerialNumber(salaryfix);
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
    useEffect(() => {
        const delay = setTimeout(() => {
            setDelayedSearchQuery(searchQuery);
        }, 2000);

        return () => clearTimeout(delay);
    }, [searchQuery]);

    // Split the search query into individual terms
    // const searchTerms = searchQuery.toLowerCase().split(" ");
    // // Modify the filtering logic to check each term
    // const filteredDatas = items?.filter((item) => {
    //     return searchTerms.every((term) =>
    //         Object.values(item).join(" ").toLowerCase().includes(term)
    //     );
    // });

    // const filteredData = filteredDatas.slice((page - 1) * pageSize, page * pageSize);

    // const totalPages = Math.ceil(filteredDatas.length / pageSize);

    // const visiblePages = Math.min(totalPages, 3);

    // const firstVisiblePage = Math.max(1, page - 1);
    // const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    // const pageNumbers = [];

    // const indexOfLastItem = page * pageSize;
    // const indexOfFirstItem = indexOfLastItem - pageSize;

    // for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    //     pageNumbers.push(i);
    // }

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
            flex: 0, width: 90, hide: !columnVisibility.serialNumber, headerClassName: "bold-header", pinned: 'left',
        },
        { field: "totalValue", headerName: "Salary Amount", flex: 0, width: 180, hide: !columnVisibility.totalValue, headerClassName: "bold-header", pinned: 'left', },
        { field: "experience", headerName: "Experience", flex: 0, width: 200, hide: !columnVisibility.experience, headerClassName: "bold-header", pinned: 'left', },
        { field: "salarycode", headerName: "Process Code", flex: 0, width: 200, hide: !columnVisibility.salarycode, headerClassName: "bold-header" },
        { field: "targetPointsValue", headerName: "Target Points", flex: 0, width: 180, hide: !columnVisibility.targetPointsValue, headerClassName: "bold-header" },

    ]



    const rowDataTable = salaryfix.map((item, index) => {
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


    const [exportLoading, setExportLoading] = useState(false);

    const handleExportXL = async (isfilter) => {
        try {

            if (isfilter === "filtered") {
                // Define headers
                let headers = ["Salary Amount", "Experience", "Process Code", "Target Points"];

                // Transform data
                const excelData = salaryfix.map((entry) => [
                    entry.totalValue, // Category Name
                    entry.experience, // Subcategory
                    entry.salarycode, // IP Address
                    entry.targetPointsValue, // Type

                ]);

                // Combine headers and data
                const finalData = [headers, ...excelData];

                // Create worksheet
                const ws = XLSX.utils.aoa_to_sheet(finalData);

                // Create workbook and export
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

                // Save file
                XLSX.writeFile(wb, "SalarySlabProcess.xlsx");
                setIsFilterOpen(false);
            } else if (isfilter === "overall") {
                let result = [];
                setExportLoading(true);

                let response = await axios.post(
                    SERVICE.SALARY_SLAB_SEARCH_EXCELDOWNLOAD,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },

                        company: selectedCompanyFrom.map(item => item.value),
                        branch: selectedBranchFrom.map(item => item.value),

                        team: selectedTeamFrom.map(item => item.value),
                        unit: selectedUnitFrom.map(item => item.value),
                        salaryrange: ebreadingdetailFilter.salaryrange,

                        type: ebreadingdetailFilter.type,
                        process: ebreadingdetailFilter.type == "Process Wise" ? ebreadingdetailFilter.process : "",
                        amountvalue: ebreadingdetailFilter.type == "Amount Wise" ? ebreadingdetailFilter.amountvalue : "",
                        fromamount: ebreadingdetailFilter.from,
                        toamount: ebreadingdetailFilter.to,
                        // ✅ Ensure Axios returns a Blob
                    },
                    {
                        responseType: "blob",
                    }
                );
                console.log(response, "response");
                // Create a Blob from the response
                const blob = new Blob([response.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });

                // Create a download link
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "SalarySlabProcess.xlsx";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                // Assuming response.data is the binary data for the Excel file

                setExportLoading(false);
                setIsFilterOpen(false);
            }
        } catch (err) {
            console.log(err, "errr")
            setExportLoading(false)
        }
    };

    const downloadCSV = async (isfilter) => {
        try {
            if (isfilter === "filtered") {
                let headers = ["Salary Amount", "Experience", "Process Code", "Target Points"];

                // Transform data
                const excelData = salaryfix.map((entry) => [
                    entry.totalValue, // Category Name
                    entry.experience, // Subcategory
                    entry.salarycode, // IP Address
                    entry.targetPointsValue, // Type

                ]);

                // Combine headers and data
                const finalData = [headers, ...excelData];
                // Convert to CSV
                const ws = XLSX.utils.aoa_to_sheet(finalData);
                const csvOutput = XLSX.utils.sheet_to_csv(ws);

                // Trigger CSV file download in browser
                const blob = new Blob([csvOutput], { type: "text/csv" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "SalarySlabProcess.csv";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else if (isfilter === "overall") {
                let result = [];
                setExportLoading(true);

                try {
                    let response = await axios.post(
                        SERVICE.SALARY_SLAB_SEARCH_CSVDOWNLOAD,
                        {
                            headers: {
                                Authorization: `Bearer ${auth.APIToken}`,
                            },
                            company: selectedCompanyFrom.map(item => item.value),
                            branch: selectedBranchFrom.map(item => item.value),

                            team: selectedTeamFrom.map(item => item.value),
                            unit: selectedUnitFrom.map(item => item.value),
                            salaryrange: ebreadingdetailFilter.salaryrange,

                            type: ebreadingdetailFilter.type,
                            process: ebreadingdetailFilter.type == "Process Wise" ? ebreadingdetailFilter.process : "",
                            amountvalue: ebreadingdetailFilter.type == "Amount Wise" ? ebreadingdetailFilter.amountvalue : "",
                            fromamount: ebreadingdetailFilter.from,
                            toamount: ebreadingdetailFilter.to,
                        },
                        {
                            responseType: "blob",
                        }
                    );
                    // Create a Blob from the response data
                    const blob = new Blob([response.data], { type: "text/csv" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");

                    a.href = url;
                    a.download = "SalarySlabProcess.csv"; // File name
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url); // Clean up
                    setExportLoading(false);
                    setIsFilterOpen(false);
                } catch (error) {
                    console.error("Error downloading CSV:", error);
                }
            }
        } catch (err) {
            setExportLoading(false)
        }
    };

    const downloadPdf = async (isfilter) => {
        try {
            if (isfilter === "filtered") {
                try {
                    let headers = ["Salary Amount", "Experience", "Process Code", "Target Points"];

                    // Transform data
                    const excelData = salaryfix.map((entry) => [
                        entry.totalValue, // Category Name
                        extractText(entry.salarycode), // Subcategory
                        entry.salarycode, // IP Address
                        entry.targetPointsValue, // Type

                    ]);

                    // Combine headers and data
                    const tableData = [headers, ...excelData];

                    const docDefinition = {
                        pageSize: "A4",
                        pageOrientation: "potrait", // Landscape mode
                        content: [
                            { text: "salaryslabprocess", style: "header", alignment: "center" },
                            { text: `Generated on: ${new Date().toLocaleString()}`, style: "subheader", alignment: "right" },
                            "\n",
                            {
                                table: {
                                    headerRows: 1,
                                    widths: ["auto", "auto", "auto", "auto"],
                                    body: tableData,
                                },
                                layout: "lightHorizontalLines", // Table styling
                            },
                        ],
                        styles: {
                            header: { fontSize: 14, bold: true },
                            subheader: { fontSize: 10, italics: true },
                        },
                        defaultStyle: { fontSize: 8 }, // Reduce font size
                    };

                    pdfMake.createPdf(docDefinition).download("SalarySlabProcess.pdf"); // Trigger downloa
                    setIsPdfFilterOpen(false);
                } catch (err) {
                    console.log(err);
                }
            } else if (isfilter === "overall") {

                setExportLoading(true);
                let response = await axios.post(
                    SERVICE.SALARY_SLAB_SEARCH_PDFDOWNLOAD,
                    {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },

                        company: selectedCompanyFrom.map(item => item.value),
                        branch: selectedBranchFrom.map(item => item.value),

                        team: selectedTeamFrom.map(item => item.value),
                        unit: selectedUnitFrom.map(item => item.value),
                        salaryrange: ebreadingdetailFilter.salaryrange,

                        type: ebreadingdetailFilter.type,
                        process: ebreadingdetailFilter.type == "Process Wise" ? ebreadingdetailFilter.process : "",
                        amountvalue: ebreadingdetailFilter.type == "Amount Wise" ? ebreadingdetailFilter.amountvalue : "",
                        fromamount: ebreadingdetailFilter.from,
                        toamount: ebreadingdetailFilter.to,
                    },
                    {
                        responseType: "blob",
                    }
                );
                const blob = new Blob([response.data], { type: "application/pdf" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "SalarySlabProcess.pdf";
                link.click();
                URL.revokeObjectURL(link.href);
                setExportLoading(false);
                setIsFilterOpen(false);
                setIsPdfFilterOpen(false);
            }
        } catch (err) {
            console.log(err, "errrpf")
            setExportLoading(false)
        }
    };



    return (
        <Box>
            <Headtitle title={'Salary Process Report'} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Salary Process Report"
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
                                                options={accessbranch?.map(data => ({
                                                    label: data.company,
                                                    value: data.company,
                                                })).filter((item, index, self) => {
                                                    return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                                                })}
                                                // options={companies}
                                                styles={colourStyles}

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
                                                options={accessbranch?.filter(
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
                                                options={accessbranch?.filter(
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
                                    <Grid item md={4} xs={12} sm={12} mt={3}>
                                        <Grid container spacing={2}>
                                            <Grid item md={3} xs={12} sm={6}>
                                                <Button variant='contained' color='primary' onClick={handleSubmitFilter} sx={buttonStyles.buttonsubmit}>Filter</Button>

                                            </Grid>
                                            <Grid item md={2.5} xs={12} sm={6}>
                                                <Button onClick={handleClearFilter} sx={buttonStyles.btncancel}>Clear</Button>

                                            </Grid>
                                        </Grid>
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
                                        <MenuItem value={(totalCount)}>All</MenuItem>
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

                                {/* <AggregatedSearchBar
                                    columnDataTable={columnDataTable}
                                    setItems={setItems}
                                    addSerialNumber={addSerialNumber}
                                    setPage={setPage}
                                    maindatas={salaryfix}
                                    setSearchedString={setSearchedString}
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                    paginated={false}
                                    totalDatas={salaryfix}
                                /> */}
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>

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
                            // <>
                            //     <AggridTable
                            //         rowDataTable={rowDataTable}
                            //         columnDataTable={columnDataTable}
                            //         columnVisibility={columnVisibility}
                            //         page={page}
                            //         setPage={setPage}
                            //         pageSize={pageSize}
                            //         totalPages={totalPages}
                            //         setColumnVisibility={setColumnVisibility}
                            //         isHandleChange={isHandleChange}
                            //         items={items}
                            //         selectedRows={selectedRows}
                            //         setSelectedRows={setSelectedRows}
                            //         gridRefTable={gridRef}
                            //         paginated={false}
                            //         filteredDatas={filteredDatas}
                            //         handleShowAllColumns={handleShowAllColumns}
                            //         setFilteredRowData={setFilteredRowData}
                            //         filteredRowData={filteredRowData}
                            //         setFilteredChanges={setFilteredChanges}
                            //         filteredChanges={filteredChanges}
                            //         gridRefTableImg={gridRefTableImg}
                            //         itemsList={overallItems}
                            //     />
                            // </>

                            <>
                                <Box
                                    style={{
                                        // height: 300,
                                        width: "100%",
                                        // overflowY: "hidden", // Hide the y-axis scrollbar
                                    }}
                                    className="ag-theme-quartz"
                                // ref={gridRefImg}
                                >
                                    <AgGridReact
                                        rowData={salaryfix}
                                        columnDefs={columnDataTable}
                                        defaultColDef={{
                                            flex: 1,
                                            resizable: true,
                                            // filter: true,
                                            // ...headerStyle,
                                        }}
                                        ref={gridRef} // Triggers when cell editing is complete.
                                        suppressRowClickSelection={true}
                                        rowSelection="multiple"
                                        onGridReady={onGridReady}
                                        onSelectionChanged={(event) => {
                                            const selectedRowsData = event.api.getSelectedRows();
                                            // setSelectedRows(selectedRowsData);
                                            setSelectedRows(selectedRowsData.map((item) => item._id));
                                        }}
                                        domLayout="autoHeight"
                                        getRowId={(params) => params.data.id}
                                        getRowNodeId={(data) => data.id}
                                    />
                                </Box>
                                <Box style={userStyle.dataTablestyle}>
                                    <Box>
                                        Showing {salaryfix.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, totalCount)} of {totalCount} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbers.map((pageNumber) => (
                                            <Button key={pageNumber} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber} sx={userStyle.paginationbtn}>
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <LastPageIcon />
                                        </Button>
                                    </Box>
                                </Box>
                            </>
                        }
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
                // isFilterOpen={isFilterOpen}
                // handleCloseFilterMod={handleCloseFilterMod}
                // fileFormat={fileFormat}
                // setIsFilterOpen={setIsFilterOpen}
                // isPdfFilterOpen={isPdfFilterOpen}
                // setIsPdfFilterOpen={setIsPdfFilterOpen}
                // handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={salaryfix ?? []}
                filename={"Paid Date Fix"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />

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
                    {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} /> : <FaFileCsv style={{ fontSize: "80px", color: "green" }} />}
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={(e) => {
                            fileFormat === "xl" ? handleExportXL("filtered") : downloadCSV("filtered");
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <LoadingButton
                        autoFocus
                        loading={exportLoading}
                        variant="contained"
                        onClick={(e) => {
                            fileFormat === "xl" ? handleExportXL("overall") : downloadCSV("overall");
                        }}
                    >
                        Export Over All Data
                    </LoadingButton>
                </DialogActions>
            </Dialog>

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
                            downloadPdf("filtered");
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <LoadingButton
                        variant="contained"
                        loading={exportLoading}
                        onClick={(e) => {
                            downloadPdf("overall");
                        }}
                    >
                        Export Over All Data
                    </LoadingButton>
                </DialogActions>
            </Dialog>

        </Box>
    );
}


export default Salaryprocessreport;