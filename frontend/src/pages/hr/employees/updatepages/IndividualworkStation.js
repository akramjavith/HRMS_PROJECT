import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Paper,
    Popover,
    Select,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TextField,
    Typography
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import * as FileSaver from "file-saver";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import * as XLSX from "xlsx";
import { handleApiError } from "../../../../components/Errorhandling";
import Headtitle from "../../../../components/Headtitle";
import PageHeading from "../../../../components/PageHeading";
import { StyledTableCell, StyledTableRow } from "../../../../components/Table";
import StyledDataGrid from "../../../../components/TableStyle";
import {
    AuthContext,
    UserRoleAccessContext,
} from "../../../../context/Appcontext";
import { userStyle } from "../../../../pageStyle";
import { SERVICE } from "../../../../services/Baseservice";

function IndividualWorkstation() {

    const [keyPrimaryShortname, setPrimaryKeyShortname] = useState("")

    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [getIndexData, setGetIndexData] = useState("");
    const {
        isUserRoleAccess,
        isUserRoleCompare,
        allUsersData,
        allTeam,
        isAssignBranch,
        pageName,
        setPageName,
    } = useContext(UserRoleAccessContext);
    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { auth } = useContext(AuthContext);

    const [isBankdetail, setBankdetail] = useState(false);

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [updatedFieldEmployee, setUpdatedFieldEmployee] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "Individual Workstation.png");
                });
            });
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    // view model
    const [openview, setOpenview] = useState(false);

    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
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
        if (selectedRows.includes(params.row.editid)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        empcode: true,
        companyname: true,
        company: true,
        branch: true,
        unit: true,
        floor: true,
        workstationstatus: true,
        workstation: true,
        status: true,
        systemshortname: true,
        workstationInput: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    // get single userdata to view

    const [userReport, setUserReport] = useState({
        empcode: "",
        companyname: "",
        company: "",
        branch: "",
        unit: "",
        floor: "",
        workstation: "",
    });

    const [workstationSystemName, setWorkstationSystemName] = useState()

    const fetchWorkstationSystemname = async () => {
        try {
            let res_employee = await axios.get(SERVICE.WORKSTATION, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const result = res_employee?.data?.locationgroupings.flatMap((item) => {
                return item.combinstation.flatMap((combinstationItem) => {
                    return combinstationItem.subTodos.length > 0
                        ? combinstationItem.subTodos.map((subTodo) => {
                            return {
                                company: item.company, branch: item.branch, unit: item.unit, floor: item.floor, id: item._id,
                                cabinname: subTodo.subcabinname
                            }
                        })
                        : [{
                            company: item.company, branch: item.branch, unit: item.unit, floor: item.floor, id: item._id,
                            cabinname: combinstationItem.cabinname
                        }
                        ];
                });
            });


            let res_company = await axios.get(SERVICE.COMPANY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let res_branch = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let res_unit = await axios.get(SERVICE.UNIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const rescompanydata = result.map((data, index) => {
                let updatedData = data;
                res_company?.data?.companies.map((item, i) => {
                    if (data.company === item.name) {
                        updatedData = { ...data, companycode: item.code };
                    }
                });

                return updatedData;
            });

            const resBranchdata = rescompanydata.map((data, index) => {
                let updatedData = data;
                res_branch?.data?.branch.map((item, i) => {
                    if (data.branch === item.name) {
                        updatedData = { ...data, branchcode: item.code };
                    }
                });

                return updatedData;
            });

            const resUnitdata = resBranchdata.map((data, index) => {
                let updatedData = data;
                res_unit?.data?.units.map((item, i) => {
                    if (data.unit === item.name) {
                        updatedData = { ...data, unitcode: item.code };
                    }
                });

                return updatedData;
            });


            // Calculate counts dynamically
            const counts = {};

            const updatedData = resUnitdata.map(obj => {

                const key = `${obj.company}-${obj.branch}-${obj.unit}-${obj.floor}`;
                obj.count = (counts[key] || 0) + 1;
                counts[key] = obj.count;

                obj.systemshortname = `${obj?.companycode}_${obj?.branchcode}#${obj.count}#${obj?.unitcode}_${obj.cabinname}`;

                obj.systemshortname = `${obj?.branchcode}_${obj.count}_${obj?.unitcode}_${obj.cabinname}`;

                return obj;
            });
            setWorkstationSystemName(updatedData);
            fetchEmployee(updatedData);
            // fetchEmployee()


        } catch (err) {

            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };


    const [isEditOpen, setIsEditOpen] = useState(false);
    // Edit model
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
        setPrimaryKeyShortname("")
    };
    const [allWorkStationOpt, setAllWorkStationOpt] = useState([]);
    const [primaryWorkStation, setPrimaryWorkStation] = useState(
        "Select Primary Workstation"
    );
    const [workStationOpt, setWorkStationOpt] = useState([]);
    const [updateWorkStation, setUpdateworkStation] = useState([]);
    const [filteredWorkStation, setFilteredWorkStation] = useState([]);
    const [empaddform, setEmpaddform] = useState({
        company: "",
        branch: "",
        unit: "",
        floor: "",
        workstation: "Please Select Work Station",
    });

    //get all employees list details
    const fetchEmployee = async (workstationSystemNames) => {
        setPageName(!pageName);
        setBankdetail(true);

        try {
            let response = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            const individual = response.data.users?.filter((item) => item?._id === isUserRoleAccess?._id)
            const generatedData = [];
            individual.forEach((item) => {
                if (item?.workstation?.length === 0) {
                    generatedData.push([]);
                } else {
                    if (Array.isArray(item?.workstation)) {

                        item?.workstation.forEach((workstation, index) => {
                            const cleanedWorkstation = typeof workstation === 'string'
                                ? workstation
                                : '';

                            const workstationData = {
                                company: item.company,
                                branch: item.branch,
                                unit: item.unit,
                                team: item.team,
                                floor: item.floor,
                                workstation:
                                    workstation === "Please Select Primary Work Station"
                                        ? ""
                                        : cleanedWorkstation,
                                companyname: item.companyname,
                                empcode: item.empcode,
                                cabinname: item.cabinname,
                                _id: item._id,
                                index: index
                            };

                            generatedData.push(workstationData);
                        });
                    }
                }

                if (item?.workstationinput || item?.workmode) {
                    const workstationInputData = {
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        team: item.team,
                        floor: item.floor,
                        workstationInput: item.workstationinput,
                        companyname: item.companyname,
                        empcode: item.empcode,
                        cabinname: item.cabinname,
                        workmode: item.workmode,
                        workstation: item?.workstation,
                        _id: item._id
                    };

                    generatedData.push(workstationInputData);
                }
            });

            const filteredData = generatedData.filter(item => {
                return Array.isArray(item) ? item.length > 0 : true;
            });

            const filsteemp = filteredData

            const assignPrimarySecondaryWorkstations = (data) => {
                return data.map((emp, index) => {
                    const workstations = typeof emp.workstation === 'string'
                        ? emp.workstation.split(',').map(ws => ws.trim())
                        : [];

                    const primary = index === 0 && workstations.length > 0 ? workstations[0] : '';
                    const secondary = index === 0 ? workstations.slice(1) : workstations;
                    const secondaryworkstation = secondary.join(', ');

                    return {
                        ...emp,
                        primaryworkstation: primary || "",
                        workstationstatus: emp?.workmode === undefined ? primary === "" ? "Secondary Workstation" : "Primary Workstation" : emp?.workmode,
                        secondaryworkstation: secondaryworkstation || "",
                    };
                });
            };

            const updatedData = assignPrimarySecondaryWorkstations(filsteemp);

            const shortnameset = updatedData?.map((item) => {
                const short = workstationSystemNames?.find((sht) => {
                    const primaryOrSecondary = item?.primaryworkstation === ""
                        ? item?.secondaryworkstation?.split('(')[0]
                        : item?.primaryworkstation?.split('(')[0];

                    const branchandfloor = item?.primaryworkstation === ""
                        ? item?.secondaryworkstation
                        : item?.primaryworkstation;

                    console?.log(branchandfloor, "statio");

                    const Bracketsbranch = branchandfloor.match(/\(([^)]+)\)/)?.[1];
                    console?.log(Bracketsbranch, "bf");

                    if (Bracketsbranch) {
                        const hyphenCount = Bracketsbranch.split('-').length - 1;

                        const Branch = hyphenCount === 1 ? Bracketsbranch.split('-')[0].trim() : Bracketsbranch?.split('-').slice(0, 2).join('-');

                        const Floor = hyphenCount === 1 ? Bracketsbranch.split('-')[1].trim() :
                            hyphenCount === 2 ? Bracketsbranch.split('-').pop() :
                                Bracketsbranch.split('-').slice(-2).join('-').replace(')', '');

                        return sht?.branch === Branch &&
                            sht?.floor === Floor &&
                            sht?.cabinname === primaryOrSecondary;
                    } else {
                        console?.log("No branch or floor info found in parentheses.");
                        return false;
                    }
                });

                return {
                    ...item,
                    systemshortname: item?.workstationstatus === "Office" || item?.workstationstatus === "Remote"
                        ? item?.workstationInput?.slice(0, 15)
                        : short?.systemshortname,
                    workstationstatus: item?.workstationstatus,
                    workstation: item?.workstationInput === undefined ? item?.workstation : item?.workstationInput,
                };
            });

            setEmployees(shortnameset?.filter((item) => (item?.workstation && item?.workstation !== "") && (item?.systemshortname && item?.systemshortname !== "")));
            setBankdetail(false);

        } catch (err) {
            setBankdetail(false);

            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };


    const [indexGet, setIndexGet] = useState();



    const delAddemployee = async () => {
        setPageName(!pageName);
        try {
            let del = await axios.put(`${SERVICE.USER_SINGLE_PWD}/${boredit}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                workstation: updateWorkStation,
            });
            await fetchEmployee();
            setPage(1);
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Removed Successfully"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };


    useEffect(() => {
        fetchWorkstationSystemname();
    }, []);



    //Boardingupadate updateby edit page...
    let updateby = empaddform?.updatedby;
    //edit post call.
    let boredit = empaddform?._id;



    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
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
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";

    const exportToExcel = (excelData, fileName) => {
        setPageName(!pageName);
        try {
            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
            const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

            // Check if the browser supports Blob and FileSaver
            if (!Blob || !FileSaver) {
                console.error("Blob or FileSaver not supported");
                return;
            }

            const data = new Blob([excelBuffer], { type: fileType });

            // Check if FileSaver.saveAs is available
            if (!FileSaver.saveAs) {
                console.error("FileSaver.saveAs is not available");
                return;
            }

            FileSaver.saveAs(data, fileName + fileExtension);
        } catch (error) {
            console.error("Error exporting to Excel", error);
        }
    };

    const formatData = (data) => {
        return data.map((item, index) => {
            return {
                Sno: index + 1,
                Empcode: item.empcode || "",
                Name: item.companyname || "",
                Company: item.company || "",
                Branch: item.branch || "",
                Unit: item.unit || "",
                Floor: item.floor || "",
                "Status": item.workstationstatus || "",
                "Workstation": item.workstation || "",
                "System Short Name": item?.systemshortname === undefined ? "" : item?.systemshortname || "",
            };
        });
    };

    const handleExportXL = (isfilter) => {
        const dataToExport = isfilter === "filtered" ? filteredData : employees;

        if (!dataToExport || dataToExport.length === 0) {
            console.error("No data available to export");
            return;
        }

        exportToExcel(formatData(dataToExport), "Individual WorkStation");
        setIsFilterOpen(false);
    };

    //  PDF
    // pdf.....
    const columns = [
        { title: "Emp Code", field: "empcode" },
        { title: "Name", field: "companyname" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Status", field: "workstationstatus" },
        { title: "Workstation", field: "workstation" },
        { title: "System Short Name", field: "systemshortname" },
    ];

    const downloadPdf = (isfilter) => {
        const doc = new jsPDF();

        // Initialize serial number counter
        // Modify columns to include serial number column
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
                : employees?.map((item, index) => ({
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

        doc.save("Individual WorkStation.pdf");
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Individual WorkStation",
        pageStyle: "print",
    });

    //table entries ..,.
    const [items, setItems] = useState([]);

    const addSerialNumber = () => {

        const itemsWithSerialNumber = employees?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        setItems(itemsWithSerialNumber);

    };

    useEffect(() => {
        addSerialNumber();
    }, [employees]);

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

    const totalPages = Math.ceil(employees.length / pageSize);

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

    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
        <div>
            <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
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
                            updatedSelectedRows = selectedRows.filter(
                                (selectedId) => selectedId !== params.row.id
                            );
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.id];
                        }

                        setSelectedRows(updatedSelectedRows);

                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(
                            updatedSelectedRows.length === filteredData.length
                        );
                    }}
                />
            ),
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
        },
        {
            field: "empcode",
            headerName: "Emp Code",
            flex: 0,
            width: 200,
            hide: !columnVisibility.empcode,
            headerClassName: "bold-header",
        },
        {
            field: "companyname",
            headerName: "Name",
            flex: 0,
            width: 200,
            hide: !columnVisibility.companyname,
            headerClassName: "bold-header",
        },
        {
            field: "company",
            headerName: "Company",
            flex: 0,
            width: 200,
            hide: !columnVisibility.company,
            headerClassName: "bold-header",
        },
        {
            field: "branch",
            headerName: "Branch",
            flex: 0,
            width: 200,
            hide: !columnVisibility.branch,
            headerClassName: "bold-header",
        },
        {
            field: "unit",
            headerName: "Unit",
            flex: 0,
            width: 200,
            hide: !columnVisibility.unit,
            headerClassName: "bold-header",
        },
        {
            field: "workstationstatus",
            headerName: "Status",
            flex: 0,
            width: 300,
            hide: !columnVisibility.workstationstatus,
            headerClassName: "bold-header",
            renderCell: (params) => (
                <>
                    {params.row.workstationstatus && (
                        <Button
                            variant="contained"
                            style={{
                                padding: "10px",
                                background:
                                    params.row.workstationstatus === "Primary Workstation" ? "lightgreen" :
                                        params.row.workstationstatus === "Secondary Workstation" ? "skyblue" :
                                            params.row.workstationstatus === "Office" || params.row.workstationstatus === "Remote" ? "pink" : "yellow",
                                color: "black"
                            }}
                        >
                            {params.row.workstationstatus}
                        </Button>
                    )}
                </>
            ),
        },
        {
            field: "workstation",
            headerName: "Workstation",
            flex: 0,
            width: 200,
            hide: !columnVisibility.workstation,
            headerClassName: "bold-header",
        },
        {
            field: "systemshortname",
            headerName: "System Short Name",
            flex: 0,
            width: 250,
            hide: !columnVisibility.systemshortname,
            headerClassName: "bold-header",
        },

    ];


    const rowDataTable = filteredData.map((item, index) => {
        return {
            serialNumber: item.serialNumber,
            id: index,
            editid: item._id,
            dataindex: item.index,
            empcode: item.empcode,
            companyname: item.companyname,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            floor: item.floor,
            workstationstatus: item.workstationstatus,
            workstation: item.workstation,
            status: "Assigned",
            systemshortname: item?.systemshortname,
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
            <Headtitle title={"ASSIGN WORK STATION"} />

            <PageHeading
                title="Individual WorkStation"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Employee"
                subpagename="Employee Update Details"
                subsubpagename="WorkStation Assigned Report"
            />

            <br />
            {isUserRoleCompare?.includes("lindividualworkstation") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Individual WorkStation List
                            </Typography>
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
                                    {isUserRoleCompare?.includes(
                                        "excelindividualworkstation"
                                    ) && (
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
                                    {isUserRoleCompare?.includes(
                                        "csvindividualworkstation"
                                    ) && (
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
                                    {isUserRoleCompare?.includes(
                                        "printindividualworkstation"
                                    ) && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes(
                                        "pdfindividualworkstation"
                                    ) && (
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
                                    {isUserRoleCompare?.includes(
                                        "imageindividualworkstation"
                                    ) && (
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
                        {isBankdetail ? (
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



            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="sm"
            >
                <Box sx={{ padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            View Assigned Workstation
                        </Typography>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Employee Code</Typography>
                                    <Typography>{userReport.empcode}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl size="small" fullWidth>
                                    <Typography variant="h6"> Employee Name</Typography>
                                    <Typography>{userReport.companyname}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Company</Typography>
                                    <Typography>{userReport.company}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Branch</Typography>
                                    <Typography>{userReport.branch}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Unit</Typography>
                                    <Typography>{userReport.unit}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Floor</Typography>
                                    <Typography>{userReport.floor}</Typography>
                                </FormControl>
                            </Grid>

                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">
                                        Workstation{" "}
                                        <span style={{ fontWeight: "lighter" }}>
                                            {indexGet === 0 ? "(Primary)" : "(Secondary)"}
                                        </span>
                                    </Typography>
                                    <Typography>{userReport.workstation}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>

                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">
                                        System Short Name
                                    </Typography>
                                    <Typography>
                                        {(() => {
                                            const selectedCabinName = userReport?.workstation?.split('(')[0];

                                            const shortname = workstationSystemName
                                                ?.filter((systemItem) => systemItem?.cabinname === selectedCabinName)
                                                ?.map((systemItem) => systemItem?.systemshortname)?.toString();

                                            return shortname || "";
                                        })()}
                                    </Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleCloseview}
                            >
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
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

            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table aria-label="simple table" id="branch" ref={componentRef}>
                    <TableHead sx={{ fontWeight: "600" }}>
                        <StyledTableRow>
                            <StyledTableCell>SI.NO</StyledTableCell>
                            <StyledTableCell>Emp Code</StyledTableCell>
                            <StyledTableCell>Emp Name</StyledTableCell>
                            <StyledTableCell>Company</StyledTableCell>
                            <StyledTableCell>Branch</StyledTableCell>
                            <StyledTableCell>Unit</StyledTableCell>
                            <StyledTableCell>Status</StyledTableCell>
                            <StyledTableCell>Workstation</StyledTableCell>
                            <StyledTableCell>System Short Name </StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {rowDataTable &&
                            rowDataTable.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell>{index + 1}</StyledTableCell>
                                    <StyledTableCell>{row.empcode} </StyledTableCell>
                                    <StyledTableCell> {row.companyname}</StyledTableCell>
                                    <StyledTableCell> {row.company}</StyledTableCell>
                                    <StyledTableCell> {row.branch}</StyledTableCell>
                                    <StyledTableCell> {row.unit}</StyledTableCell>
                                    <StyledTableCell> {row.workstationstatus}</StyledTableCell>
                                    <StyledTableCell> {row.workstation}</StyledTableCell>
                                    <StyledTableCell> {row.systemshortname === undefined ? "" : row?.systemshortname}</StyledTableCell>
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
                            handleExportXL("filtered");
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button
                        autoFocus
                        variant="contained"
                        onClick={(e) => {
                            handleExportXL("overall");
                            // fetchProductionClientRateArray();
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
                            downloadPdf("filtered");
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Filtered Data
                    </Button>
                    <Button
                        variant="contained"
                        onClick={(e) => {
                            downloadPdf("overall");
                            setIsPdfFilterOpen(false);
                        }}
                    >
                        Export Over All Data
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default IndividualWorkstation;
