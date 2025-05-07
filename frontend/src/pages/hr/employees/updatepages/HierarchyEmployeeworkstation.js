import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Checkbox, List, ListItem, Popover, ListItemText, TableCell, TextField, IconButton, TableRow, Dialog, DialogContent, Select, MenuItem, DialogActions, FormControl, Grid, TextareaAutosize, Paper, Table, TableHead, TableContainer, Button, TableBody } from "@mui/material";
import { userStyle, colourStyles } from "../../../../pageStyle";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { SERVICE } from "../../../../services/Baseservice";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Selects from "react-select";
import { handleApiError } from "../../../../components/Errorhandling";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useReactToPrint } from "react-to-print";
import moment from "moment-timezone";
import { UserRoleAccessContext } from "../../../../context/Appcontext";
import { AuthContext } from "../../../../context/Appcontext";
import Headtitle from "../../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import { CircularProgress, Backdrop } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import { saveAs } from "file-saver";
import Switch from "@mui/material/Switch";
import CloseIcon from "@mui/icons-material/Close";
import html2canvas from "html2canvas";
import ImageIcon from "@mui/icons-material/Image";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel, FaFileCsv } from "react-icons/fa";
import LoadingButton from "@mui/lab/LoadingButton";
import PageHeading from "../../../../components/PageHeading";

const HierarchyBasedEmployeeWorkstationStatus = () => {

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [fileFormat, setFormat] = useState("");
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = fileFormat === "xl" ? ".xlsx" : ".csv";
    const exportToCSV = (csvData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    const handleExportXL = (isfilter) => {
        if (isfilter === "filtered") {
            exportToCSV(
                rowDataTable.map((item, index) => {
                    return {
                        "S.No": index + 1,
                        "Employee Code": item.empcode,
                        "Employee Name": item.companyname,
                        Company: item.company,
                        Branch: item.branch,
                        Unit: item.unit,
                        "Status": item.workstationstatus,
                        "Workstation": item.workstation,
                        "System Short Name": item.systemshortname,
                    };
                }),
                fileName
            );
        } else if (isfilter === "overall") {
            exportToCSV(
                items?.map((item, index) => ({
                    "S.No": index + 1,
                    "Employee Code": item.empcode,
                    "Employee Name": item.companyname,
                    Company: item.company,
                    Branch: item.branch,
                    Unit: item.unit,
                    "Status": item.workstationstatus,
                    "Workstation": item.workstation,
                    "System Short Name": item.systemshortname,
                })),
                fileName
            );
        }
        setIsFilterOpen(false);
    };

    const { auth } = useContext(AuthContext);
    const [isBtn, setIsBtn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginStatus, setLoginStatus] = useState([]);
    const [loginStatusUpdate, setLoginStatusUpdate] = useState([]);
    const [idLoginStatus, setIdLoginStatus] = useState({});
    const { isUserRoleCompare, isUserRoleAccess, pageName,
        setPageName } = useContext(UserRoleAccessContext);
    const [isBranch, setIsBranch] = useState(false);

    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    //image
    const handleCaptureImage = () => {
        if (gridRef.current) {
            html2canvas(gridRef.current).then((canvas) => {
                canvas.toBlob((blob) => {
                    saveAs(blob, "HierarchyBasedEmployeeWorkstationStatus.png");
                });
            });
        }
    };


    const modeDropDowns = [{ label: 'My Hierarchy List', value: 'myhierarchy' }, { label: 'All Hierarchy List', value: 'allhierarchy' }, { label: 'My + All Hierarchy List', value: "myallhierarchy" }];
    const sectorDropDowns = [{ label: 'Primary', value: 'Primary' }, { label: 'Secondary', value: 'Secondary' }, { label: 'Tertiary', value: "Tertiary" }, { label: 'All', value: "all" }]
    const [modeselection, setModeSelection] = useState({ label: "My Hierarchy List", value: "myhierarchy" })
    const [sectorSelection, setSectorSelection] = useState({ label: "Primary", value: "Primary" })



    const handleSelectionChange = (newSelection) => {
        setSelectedRows(newSelection.selectionModel);
    };

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
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

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        if (selectedRows.length === 0) {
            setIsDeleteOpenalert(true);
        } else {
        }
    };
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
        if (selectedRows.includes(params.row.orginalid)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
        "& .MuiDataGrid-virtualScroller": {
            overflowY: "hidden",
        },
        "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: " bold !important ",
        },
        "& .custom-id-row": {
            backgroundColor: "#1976d22b !important",
        },

        "& .MuiDataGrid-row.Mui-selected": {
            "& .custom-ago-row, & .custom-in-row, & .custom-others-row": {
                backgroundColor: "unset !important", // Clear the background color for selected rows
            },
        },
        "&:hover": {
            "& .custom-ago-row:hover": {
                backgroundColor: "#ff00004a !important",
            },
            "& .custom-in-row:hover": {
                backgroundColor: "#ffff0061 !important",
            },
            "& .custom-others-row:hover": {
                backgroundColor: "#0080005e !important",
            },
        },
    }));

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        company: true,
        branch: true,
        unit: true,
        team: true,
        username: true,
        empcode: true,
        companyname: true,
        userloginname: true,
        macaddress: true,
        localip: true,
        date: true,
        hostname: true,
        department: true,
        workstationstatus: true,
        workstation: true,
        systemshortname: true,
        actions: true,
        version: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

    const [workstationSystemName, setWorkstationSystemName] = useState()

    const fetchWorkstationSystemname = async () => {
        setPageName(!pageName);
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
            fetchBranch(updatedData)


        } catch (err) {

            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    useEffect(() => {
        fetchWorkstationSystemname();
    }, []);

    const fetchBranch = async (workSystemNames) => {
        setPageName(!pageName);

        try {
            let res_branch = await axios.post(SERVICE.HIERARCHY_BASED_USER_WORKSTATION_DEFAULT, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                hierachy: "myhierarchy",
                sector: "Primary",
                username: isUserRoleAccess.companyname,
                team: isUserRoleAccess.team,
                pagename: "menuteamworkstation",
            });


            const transformData = (data) => data
                ?.filter(item => item.employeecount !== "0")
                ?.flatMap(item => {
                    const validStatuses = item.loginUserStatus?.filter(status => status.macaddress !== "none") || [];
                    return validStatuses.length > 0 ? validStatuses.map(status => ({
                        ...item,
                        _id: item._id,
                        workstation: item.workstation || "",
                    })) : [];
                });

            const transformedData = transformData(res_branch?.data?.resultAccessFilter);

            const generateWorkstationData = (item) => {
                if (!item?.workstation || !Array.isArray(item?.workstation)) return [];

                return item?.workstation.map((workstation, index) => ({
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    team: item.team,
                    floor: item.floor,
                    workstation: workstation === "Please Select Primary Work Station" ? "" : workstation,
                    companyname: item.companyname,
                    empcode: item.empcode,
                    _id: item._id,
                    index,
                }));
            };

            const generatedData = transformedData.flatMap(item => {
                let data = generateWorkstationData(item);
                if (item?.workstationinput) {
                    data.push({
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        team: item.team,
                        floor: item.floor,
                        workstationInput: item.workstationinput,
                        companyname: item.companyname,
                        empcode: item.empcode,
                        workmode: item.workmode,
                        _id: item._id,
                    });
                }
                return data;
            });

            const assignPrimarySecondaryWorkstations = (data) => {
                const empcodeTracker = new Set();
                return data.map(emp => {
                    const workstations = typeof emp.workstation === 'string'
                        ? emp.workstation.split(',').map(ws => ws.trim())
                        : [];

                    const isPrimary = !empcodeTracker.has(emp.empcode) &&
                        workstations.length > 0;
                    const primary = isPrimary ? workstations[0] : "";
                    const secondary = isPrimary ? workstations.slice(1).join(', ') :
                        workstations.join(', ');

                    if (isPrimary) empcodeTracker.add(emp.empcode);

                    return {
                        ...emp,
                        primaryworkstation: primary,
                        secondaryworkstation: secondary,
                        workstationstatus: emp.workmode || (primary ? "Primary" : "Secondary"),
                    };
                });
            };

            const updatedData = assignPrimarySecondaryWorkstations(generatedData);

            const shortnameset = updatedData.map(item => {
                const primaryOrSecondary = item.primaryworkstation.split('(')[0] || item.secondaryworkstation.split('(')[0];
                const branchAndFloor = item.primaryworkstation || item.secondaryworkstation;

                const match = branchAndFloor.match(/\(([^)]+)\)/);
                if (!match) return item;

                const bracketBranch = match[1];
                const hyphenCount = bracketBranch.split('-').length - 1;

                const Branch = hyphenCount === 1 ? bracketBranch.split('-')[0].trim() :
                    bracketBranch?.split('-').slice(0, 2).join('-');

                const Floor = hyphenCount === 1
                    ? bracketBranch.split('-')[1].trim()
                    : hyphenCount === 2 ? bracketBranch.split('-').pop().trim() :
                        bracketBranch.split('-').slice(-2).join('-').replace(')', '');

                // const [Branch, Floor] = hyphenCount === 1
                //     ? [bracketBranch.split('-')[0], bracketBranch.split('-')[1]] 
                //     : hyphenCount === 2 ? bracketBranch.split('-').pop() :
                //     [bracketBranch.split('-').slice(0, 2).join('-'), 
                //         bracketBranch.split('-').pop()];
               
                const short = workSystemNames?.find(sht =>
                    sht.branch === Branch &&
                    sht.floor === Floor
                    && sht.cabinname === primaryOrSecondary);

                return {
                    ...item,
                    systemshortname: item.workstationstatus === "Office" || item.workstationstatus === "Remote"
                        ? item.workstationInput?.slice(0, 15)
                        : short?.systemshortname,
                };
            });

            setLoginStatus( shortnameset?.filter(
                (item, index, self) =>
                  item?.systemshortname !== undefined &&
                  item?.workstation !== undefined && item?.workstation !== ""  && 
                  self.findIndex(
                    (t) => t.companyname === item.companyname && t.workstation === item.workstation
                  ) === index
              ));
            setIsBranch(true);
        } catch (err) {
            setIsBranch(true);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };


    const HandleTablesubmit = (e) => {
        e?.preventDefault();
        TableFilter();
    }

    const TableFilter = async () => {
        // setIsBtn(true)
        setIsBranch(false);
        setPageName(!pageName);
        try {
            let res_employee = await axios.post(SERVICE.HIERARCHY_BASED_USER_WORKSTATION, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                hierachy: modeselection.value,
                sector: sectorSelection.value,
                username: isUserRoleAccess.companyname,
                team: isUserRoleAccess.team,
                pagename: "menuteamworkstation",
            });
            if (res_employee?.data?.resultedTeam?.length > 0 && res_employee?.data?.resultAccessFilter?.length < 1 && ["myallhierarchy", "allhierarchy"]?.includes(modeselection.value)) {
                alert("Some employees have not been given access to this page.")
            }
            const transformData = (data) => {
                const transformedArray = [];

                data?.forEach((item, ind) => {
                    const getwithoutmacstatus = item.loginUserStatus.filter((data, index) => { return data.macaddress != "none" })
                    if (item.loginUserStatus && getwithoutmacstatus.length > 0 && item.employeecount !== "0") {

                        getwithoutmacstatus.forEach((status, index) => {
                            const newItem = {
                                ...item,
                                _id: item?._id,
                                branch: item.branch,
                                companyname: item.companyname,
                                empcode: item.empcode,
                                company: item.company,
                                unit: item.unit,
                                team: item.team,
                                workstation: item?.workstation,
                                floor: item?.floor,
                            };
                            transformedArray.push(newItem);
                        });
                    }
                });

                return transformedArray;
            };

            const transformedData = transformData(res_employee?.data?.resultAccessFilter);

            const generatedData = [];

            transformedData.forEach((item) => {
                if (item?.workstation?.length === 0) {
                    generatedData.push([]);
                } else {
                    if (Array.isArray(item?.workstation)) {
                        item?.workstation.forEach((workstation, index) => {
                            const cleanedWorkstation = typeof workstation === 'string' ? workstation : '';

                            const workstationData = {
                                company: item.company,
                                branch: item.branch,
                                unit: item.unit,
                                team: item.team,
                                floor: item.floor,
                                workstation: workstation === "Please Select Primary Work Station" ? "" : cleanedWorkstation,
                                companyname: item.companyname,
                                empcode: item.empcode,
                                _id: item._id,
                                index: index
                            };

                            generatedData.push(workstationData);
                        });
                    }
                }

                // Update the check to ensure workstationinput is valid
                if (item?.workstationinput) {
                    const workstationInputData = {
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        team: item.team,
                        floor: item.floor,
                        workstationInput: item.workstationinput,
                        companyname: item.companyname,
                        empcode: item.empcode,
                        workmode: item.workmode,
                        _id: item._id
                    };

                    generatedData.push(workstationInputData);
                }
            });

            const assignPrimarySecondaryWorkstations = (data) => {
                const empcodeTracker = new Set(); // To keep track of the first occurrence of each empcode

                return data.map((emp) => {
                    const workstations = typeof emp.workstation === 'string'
                        ? emp.workstation.split(',').map(ws => ws.trim())
                        : [];

                    const isPrimary = !empcodeTracker.has(emp.empcode) && workstations.length > 0; // Check if this is the first occurrence of empcode

                    const primary = isPrimary ? workstations[0] : ''; // Assign primary workstation for the first occurrence
                    const secondary = isPrimary ? workstations.slice(1) : workstations; // Assign secondary for subsequent occurrences
                    const secondaryworkstation = secondary.join(', ');

                    // Track the empcode once the primary is assigned
                    if (isPrimary) {
                        empcodeTracker.add(emp.empcode);
                    }

                    return {
                        ...emp,
                        primaryworkstation: primary || "",
                        workstationstatus: emp?.workmode === undefined ? (primary === "" ? "Secondary" : "Primary") : emp?.workmode,
                        secondaryworkstation: secondaryworkstation || "",
                    };
                });
            };


            const updatedData = assignPrimarySecondaryWorkstations(generatedData);

            const shortnameset = updatedData?.map((item) => {
                const short = workstationSystemName?.find((sht) => {
                    const primaryOrSecondary = item?.primaryworkstation === ""
                        ? item?.secondaryworkstation?.split('(')[0]
                        : item?.primaryworkstation?.split('(')[0];

                    const branchandfloor = item?.primaryworkstation === ""
                        ? item?.secondaryworkstation
                        : item?.primaryworkstation;


                    const Bracketsbranch = branchandfloor.match(/\(([^)]+)\)/)?.[1];

                    if (Bracketsbranch) {
                        const hyphenCount = Bracketsbranch.split('-').length - 1;

                        const Branch = hyphenCount === 1 ? Bracketsbranch.split('-')[0].trim() : Bracketsbranch?.split('-').slice(0, 2).join('-');

                        const Floor = hyphenCount === 1
                            ? Bracketsbranch.split('-')[1].trim()
                            : hyphenCount === 2 ? Bracketsbranch.split('-').pop().trim() :
                                Bracketsbranch.split('-').slice(-2).join('-').replace(')', '');

                        return sht?.branch === Branch &&
                            sht?.floor === Floor &&
                            sht?.cabinname === primaryOrSecondary;
                    } else {
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

            setLoginStatus(
                shortnameset?.filter(
                  (item, index, self) =>
                    item?.systemshortname !== undefined &&
                    item?.workstation !== undefined && item?.workstation !== ""  && 
                    self.findIndex(
                      (t) => t.companyname === item.companyname && t.workstation === item.workstation
                    ) === index
                )
              );
                          // setTableDataSecondary(res_employee.data.resultAccessFilter);
            setIsBtn(false)
            setIsBranch(true);
        } catch (err) {
            setIsBtn(false);
            setIsBranch(true);
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    }

    //  PDF
    const columns = [
        { title: "Employee Code", field: "empcode" },
        { title: "Employee Name", field: "companyname" },
        { title: "Company", field: "company" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Status", field: "workstationstatus" },
        { title: "Workstation", field: "workstation" },
        { title: "System Short Name", field: "systemshortname" },
    ];


    const downloadPdf = (isfilter) => {
        const doc = new jsPDF();
        // Modify columns to include serial number column
        const columnsWithSerial = [
            { title: "SNo", dataKey: "serialNumber" }, // Serial number column
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];

        // Modify row data to include serial number
        const dataWithSerial =
            isfilter === "filtered"
                ? rowDataTable.map((item, index) => {
                    return {
                        serialNumber: index + 1,
                        empcode: item.empcode,
                        companyname: item.companyname,
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        workstationstatus: item.workstationstatus,
                        workstation: item.workstation,
                        systemshortname: item.systemshortname,

                    };
                })
                : items?.map((item, index) => ({
                    serialNumber: index + 1,
                    empcode: item.empcode,
                    companyname: item.companyname,
                    company: item.company,
                    branch: item.branch,
                    unit: item.unit,
                    workstationstatus: item.workstationstatus,
                    workstation: item.workstation,
                    systemshortname: item.systemshortname,

                }));

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            columns: columnsWithSerial,
            body: dataWithSerial,
            styles: { fontSize: "4", cellWidth: "auto" },
        });

        doc.save("HierarchyBasedEmployeeWorkstationStatus.pdf");
    };

    // Excel
    const fileName = "HierarchyBasedEmployeeWorkstationStatus";
    let excelno = 1;

    // useEffect(() => {
    //     fetchBranch();

    // }, []);


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "HierarchyBasedEmployeeWorkstationStatus",
        pageStyle: "print",
    });

    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = loginStatus?.map((item, index) => ({
            ...item, serialNumber: index + 1,

            id: item._id,
            empcode: item.empcode,
            companyname: item.companyname,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            team: item.team,
            userloginname: item?.username,
            designation: item.designation,
            department: item.department,
            macaddress: item?.loginUserStatus?.macaddress,
            localip: item?.loginUserStatus?.localip,
            status: item?.loginUserStatus?.status,
            username: item?.loginUserStatus?.username,
            hostname: item?.loginUserStatus?.hostname,
            version: item?.loginUserStatus?.version,
            count: item?.count,
            addressid: item?.loginUserStatus?._id,
            date: item?.loginUserStatus?.createdAt ? moment(item?.loginUserStatus?.createdAt).format("DD-MM-YYYY hh:mm:ss a") : ""
        }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [loginStatus]);

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
        return searchTerms.every((term) => Object.values(item).join(" ").toLowerCase().includes(term));
    });

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);


    const totalPages = Math.ceil(filteredDatas?.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;

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
                            const allRowIds = rowDataTable.map((row) => row.orginalid);
                            setSelectedRows(allRowIds);
                        }
                        setSelectAllChecked(!selectAllChecked);
                    }}
                />
            ),

            renderCell: (params) => (
                <Checkbox
                    checked={selectedRows.includes(params.row.orginalid)}
                    onChange={() => {
                        let updatedSelectedRows;
                        if (selectedRows.includes(params.row.orginalid)) {
                            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== params.row.orginalid);
                        } else {
                            updatedSelectedRows = [...selectedRows, params.row.orginalid];
                        }

                        setSelectedRows(updatedSelectedRows);

                        // Update the "Select All" checkbox based on whether all rows are selected
                        setSelectAllChecked(updatedSelectedRows.length === filteredData.length);
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
            width: 80,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        { field: "empcode", headerName: "Employee Code", flex: 0, width: 160, hide: !columnVisibility.empcode, headerClassName: "bold-header" },
        { field: "companyname", headerName: "Employee Name", flex: 0, width: 220, hide: !columnVisibility.companyname, headerClassName: "bold-header" },
        { field: "company", headerName: "Company", flex: 0, width: 100, hide: !columnVisibility.company, headerClassName: "bold-header" },
        { field: "branch", headerName: "Branch", flex: 0, width: 100, hide: !columnVisibility.branch, headerClassName: "bold-header" },
        { field: "unit", headerName: "Unit", flex: 0, width: 120, hide: !columnVisibility.unit, headerClassName: "bold-header" },
        // { field: "team", headerName: "Team", flex: 0, width: 120, hide: !columnVisibility.team, headerClassName: "bold-header" },
        {
            field: "workstationstatus",
            headerName: "Status",
            flex: 0,
            width: 200,
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
                                    params.row.workstationstatus === "Primary" ? "lightgreen" :
                                        params.row.workstationstatus === "Secondary" ? "skyblue" :
                                            params.row.workstationstatus === "Office" || params.row.workstationstatus === "Remote" ? "pink" : "yellow",
                                color: "black",
                                display: "flex",
                                justifyContent: "center",
                                width: "200px"
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
            id: index + 1,
            orginalid: item.id,
            serialNumber: item.serialNumber,
            empcode: item.empcode,
            companyname: item.companyname,
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            primaryworkstation: item.primaryworkstation,
            secondaryworkstation: item.secondaryworkstation,
            workstationstatus: item.workstationstatus,
            workstation: item.workstation,
            systemshortname: item.systemshortname,

        };
    });


    const rowsWithCheckboxes = rowDataTable.map((row) => ({
        ...row,
        // Create a custom field for rendering the checkbox
        checkbox: selectedRows.includes(row.orginalid),
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
        <Box style={{ padding: "10px", minWidth: "325px", "& .MuiDialogContent-root": { padding: "10px 0" } }}>
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
                            <ListItemText
                                sx={{ display: "flex" }}
                                primary={<Switch sx={{ marginTop: "-5px" }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />}
                                secondary={column.field === "checkbox" ? "Checkbox" : column.headerName}
                            // secondary={column.headerName }
                            />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item md={4}>
                        <Button variant="text" sx={{ textTransform: "none" }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
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



    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);


    return (
        <>
            <Headtitle title={"HIERARCHY EMPLOYEE LOGIN STATUS"} />
            <PageHeading
                title="Hierarchy Based Employee Workstation Status"
                modulename="Human Resources"
                submodulename="HR"
                mainpagename="Employee"
                subpagename="Employee Update Details"
                subsubpagename="WorkStation Assigned Report"
            />            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lteamworkstation") && (
                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>Hierarchy Based Employee Workstation Status List </Typography>
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
                                        {/* <MenuItem value={loginStatus?.length}>All</MenuItem> */}
                                    </Select>
                                </Box>
                            </Grid>
                            <Grid item md={8} xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Box>
                                    {isUserRoleCompare?.includes("excelteamworkstation") && (
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
                                    {isUserRoleCompare?.includes("csvteamworkstation") && (
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
                                    {isUserRoleCompare?.includes("printteamworkstation") && (
                                        <>
                                            <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfteamworkstation") && (
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
                                    {isUserRoleCompare?.includes("imageteamworkstation") && (
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                                            {" "}
                                            <ImageIcon sx={{ fontSize: "15px" }} /> &ensp;Image&ensp;{" "}
                                        </Button>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <FormControl fullWidth size="small">
                                        <Typography>Search</Typography>
                                        <OutlinedInput id="component-outlined" type="text" value={searchQuery} onChange={handleSearchChange} />
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={2}>
                            <Grid item lg={1.5} md={1.5} xs={12} sm={6}>
                                <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                                    Show All Columns
                                </Button>
                                &ensp;
                            </Grid>
                            <Grid item lg={1.5} md={1} xs={12} sm={6}>
                                <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
                                    Manage Columns
                                </Button>
                                &ensp;
                            </Grid>
                            <Grid item lg={2} md={2.5} xs={12} sm={6}>
                                <Selects
                                    options={modeDropDowns}
                                    styles={colourStyles}
                                    value={{ label: modeselection.label, value: modeselection.value }}
                                    onChange={(e) => setModeSelection(e)}
                                />
                            </Grid>
                            <Grid item lg={2} md={2.5} xs={12} sm={6}>
                                <Selects
                                    options={sectorDropDowns}
                                    styles={colourStyles}
                                    value={{ label: sectorSelection.label, value: sectorSelection.value }}
                                    onChange={(e) => setSectorSelection(e)}
                                />
                            </Grid>
                            <Grid item lg={3} md={2} xs={12} sm={6}>
                                <LoadingButton loading={isBtn} variant="contained" onClick={(e) => HandleTablesubmit(e)}>Filter</LoadingButton>
                            </Grid>
                        </Grid>
                        <br />
                        <br />
                        {!isBranch ? (
                            <>
                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                    {/* <CircularProgress color="inherit" />  */}
                                    <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                                        Showing {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries
                                    </Box>
                                    <Box>
                                        <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <FirstPageIcon />
                                        </Button>
                                        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                            <NavigateBeforeIcon />
                                        </Button>
                                        {pageNumbers?.map((pageNumber) => (
                                            <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}>
                                                {pageNumber}
                                            </Button>
                                        ))}
                                        {lastVisiblePage < totalPages && <span>...</span>}
                                        <Button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
                                            <NavigateNextIcon />
                                        </Button>
                                        <Button onClick={() => setPage(totalPages)} disabled={page === totalPages} sx={userStyle.paginationbtn}>
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
            <br />
            <br />


            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* print layout */}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table sx={{ minWidth: 700 }} aria-label="simple table" id="branch" ref={componentRef}>
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell>SI.NO</TableCell>
                            <TableCell>Employee Code</TableCell>
                            <TableCell>Employee Name </TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell>Branch </TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Workstation</TableCell>
                            <TableCell>System Short Name</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rowDataTable &&
                            rowDataTable?.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.empcode} </TableCell>
                                    <TableCell>{row.companyname} </TableCell>
                                    <TableCell>{row.company}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.workstationstatus} </TableCell>
                                    <TableCell>{row.workstation}</TableCell>
                                    <TableCell>{row.systemshortname}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>


            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent>
                    <DialogActions>
                        {isLoading ? (
                            <>
                                <Backdrop sx={{ color: "blue", zIndex: (theme) => theme.zIndex.drawer + 2 }} open={isLoading}>
                                    <CircularProgress color="inherit" />
                                </Backdrop>
                            </>
                        ) : (
                            <>
                                <Grid>
                                    <Button
                                        variant="contained"
                                        style={{
                                            padding: "7px 13px",
                                            color: "white",
                                            background: "rgb(25, 118, 210)",
                                        }}
                                        onClick={() => {

                                            handleCloseerrpop();
                                        }}
                                    >
                                        ok
                                    </Button>
                                </Grid>
                            </>
                        )}
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

            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: "orange" }} />
                        <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
                            Please Select any Row
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>


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
                    {fileFormat === "csv" ? (
                        <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
                    ) : (
                        <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
                    )}

                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                        Choose Export
                    </Typography>
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
        </>
    );
};

export default HierarchyBasedEmployeeWorkstationStatus;