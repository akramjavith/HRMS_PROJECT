
import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, IconButton, 
    OutlinedInput, Dialog, Select, 
    TableCell, TableRow, Checkbox,
     MenuItem, TableBody, DialogContent,
      DialogActions, FormControl, Grid,
       Paper, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle, colourStyles, colourStylesEdit } from "../../../../pageStyle";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import { AuthContext, UserRoleAccessContext } from '../../../../context/Appcontext';
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../../../components/Errorhandling";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import 'jspdf-autotable';
import jsPDF from "jspdf";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Selects from "react-select";
import 'react-notifications/lib/notifications.css';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { SERVICE } from "../../../../services/Baseservice";
import Headtitle from "../../../../components/Headtitle";
import moment from 'moment-timezone';
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import CircularProgress, { circularProgressClasses, } from '@mui/material/CircularProgress';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import html2canvas from 'html2canvas';
import ImageIcon from '@mui/icons-material/Image';
import Pagination from '../../../../components/Pagination';
function FacebookCircularProgress(props) {
    return (
        <Box style={{ position: 'relative' }}>
            <CircularProgress
                variant="determinate"
                style={{
                    color: (theme) =>
                        theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                }}
                size={40}
                thickness={4}
                {...props}
                value={100}
            />
            <CircularProgress
                variant="indeterminate"
                disableShrink
                style={{
                    color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                    animationDuration: '550ms',
                    position: 'absolute',
                    left: 0,
                    [`& .${circularProgressClasses.circle}`]: {
                        strokeLinecap: 'round',
                    },
                }}
                size={40}
                thickness={4}
                {...props}
            />
        </Box>
    );
}


function Allottedresponsiblelist() {
    const { isUserRoleCompare, isUserRoleAccess, allUsersData, isAssignBranch, allTeam } = useContext(UserRoleAccessContext);
    const [branches, setBranches] = useState([]);
    const [excelmapdataresperson, setExcelmapdataresperson] = useState([]);
    const [units, setUnits] = useState([]);
    const [unitstabledata, setUnitstabledata] = useState([]);
    const [isLoader, setIsLoader] = useState(false)
    const [teamDrop, setTeamDrop] = useState([]);
    const [unitName, setUnitName] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [updatedbydata, setupdatedbydata] = useState([])
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [exceledit, setExceledit] = useState({
        customer: "", process: "", branch: "", unit: "", team: "", updateby: ""

    });
    let username = isUserRoleAccess.username;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
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

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };

    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };
    const handleExportXL = async (isfilter) => {
        if (isfilter === "filtered") {
            exportToCSV(
                filteredDatas?.map((t, index) => ({
                    Sno: index + 1,
                    "project Name": t.project,
                    "Vendor Name": t.vendor,
                    "Customer": t.customer,
                    "Process": t.process,
                    "Category Name": t.category,
                    "Subcategory Name": t.subcategory,
                    "Queue Name": t.queue,
                    "Branch": t.branch,
                    "unit": t.unit,
                    "team": t.team,
                    "resperson": t.resperson,
                    "sector": t.priority,
                })),
                fileNameRes,
            );
        } else if (isfilter === "overall") {

            let res_task = await axios.get(SERVICE.EXCELMAPDATARESPERSON, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const ans = res_task?.data?.excelmaprespersondatas?.length > 0 ? res_task?.data?.excelmaprespersondatas?.flatMap((item , index) => item.todo.map(todoItem => ({
                _id: item?._id,
                serialNumber: (page - 1) * pageSize + index + 1,
                project: item.project,
                vendor: item.vendor,
                customer: item.customer,
                process: item.process,
                category: item.category,
                subcategory: item.subcategory,
                queue: item.queue,
                branch: todoItem?.branch,
                unit: todoItem?.unit,
                team: todoItem?.team,
                resperson: todoItem?.resperson,
                priority: todoItem?.priority,

            }))) : []
            exportToCSV(
                ans?.map((t, index) => ({
                    Sno: index + 1,
                    "project Name": t.project,
                    "Vendor Name": t.vendor,
                    "Customer": t.customer,
                    "Process": t.process,
                    "Category Name": t.category,
                    "Subcategory Name": t.subcategory,
                    "Queue Name": t.queue,
                    "Branch": t.branch,
                    "unit": t.unit,
                    "team": t.team,
                    "resperson": t.resperson,
                    "sector": t.priority,
                })),
                fileNameRes,
            );

        }

        setIsFilterOpen(false)
    };

    const downloadPdf = async (isfilter) => {
        const doc = new jsPDF();
        // Initialize serial number counter
        let serialNumberCounter = 1;

        // Modify columns to include serial number column
        const columnsWithSerial = [
            { title: "SNo", dataKey: "serialNumber" }, // Serial number column
            ...columnsres.map((col) => ({ ...col, dataKey: col.field })),
        ];
        let overall;
        if (isfilter === "overall") {
            let res_task = await axios.get(SERVICE.EXCELMAPDATARESPERSON, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            overall = res_task?.data?.excelmaprespersondatas?.flatMap((item , index) => item.todo.map(todoItem => ({
                _id: item?._id,
                serialNumber: index + 1,
                project: item.project,
                vendor: item.vendor,
                customer: item.customer,
                process: item.process,
                category: item.category,
                subcategory: item.subcategory,
                queue: item.queue,
                branch: todoItem?.branch,
                unit: todoItem?.unit,
                team: todoItem?.team,
                resperson: todoItem?.resperson,
                priority: todoItem?.priority,

            })));
        }
        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            filteredDatas.map((item, index) => ({
                serialNumber: index + 1,
                project: item.project,
                vendor: item.vendor,
                customer: item.customer,
                process: item.process,
                category: item.category,
                subcategory: item.subcategory,
                queue: item.queue,
                branch: item?.branch,
                unit: item?.unit,
                team: item?.team,
                resperson: item?.resperson,
                priority: item?.priority,
            })) :
            overall

        // Generate PDF
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 4,
            },
            columns: columnsWithSerial,
            body: dataWithSerial,
        });

        doc.save("AllottedResponsibleQueueList.pdf");
    };

    const dropdowndata = [{ label: 'NOT FOR US', value: 'NOT FOR US' }, { label: 'OTHER-NFU', value: 'OTHER-NFU' }, { label: 'OTHER', value: 'OTHER' }, { label: 'WEB-NFU', value: 'WEB-NFU' }]
    const [getrowid, setRowGetid] = useState("");
    const { auth } = useContext(AuthContext);

    // Edit model
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const gridRef = useRef(null);

    const [canvasState, setCanvasState] = useState(false)

    //image
    const handleCaptureImage = () => {
        // Find the table by its ID
        const table = document.getElementById("excelcanvastable");

        // Clone the table element
        const clonedTable = table.cloneNode(true);

        // Append the cloned table to the document body (it won't be visible)
        clonedTable.style.position = "absolute";
        clonedTable.style.top = "-9999px";
        document.body.appendChild(clonedTable);

        // Use html2canvas to capture the cloned table
        html2canvas(clonedTable).then((canvas) => {
            // Remove the cloned table from the document body
            document.body.removeChild(clonedTable);

            // Convert the canvas to a data URL and create a download link
            const dataURL = canvas.toDataURL("image/jpeg", 0.8);
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "Allotted Responsible Person List.png";
            link.click();
        });
    };

    const handleCloseModEdit = (e, reason) => {

        setNewBranch("Select Branch");
        setNewUnit("Select Unit");
        setNewTeam("Select Team");
        setNewResperson("Select Responsible Person");
        setNewPriority("Select Sector");
        setEditingIndexcheck(-1)

        if (reason && reason === "backdropClick")
            return;
        setIsEditOpen(false);
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        if (selectedRows.length == 0) {
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

    //Delete model
    const [bulkDataOverall, setBulkDataOverall] = useState([]);
    const [isEditOpenalert, setIsEditOpenalert] = useState(false);
    const [isEditAnsCheckalert, setIsEditAnsCheckalert] = useState(false);
    const [isEditOpencheckbox, setIsEditOpencheckbox] = useState(false);
    const [bulkEditProjectName, setBulkEditProjectName] = useState("Select Branch");

    const handleClickOpenalertEdit = () => {
        let ans = excelmapdataresperson?.filter((data) => selectedRows.includes(data._id)).map((data) => data.project)
        let uniqueArray = Array.from(new Set(ans));
        setBulkEditProjectName(uniqueArray[0])
        if (selectedRows.length == 0) {
            setIsEditOpenalert(true);
        }
        else if (selectedRows.length > 0 && uniqueArray?.length > 1) {
            setIsEditAnsCheckalert(true)
        }
        else {
            fetchFilteredBulkdata();
            setIsEditOpencheckbox(true);

        }
    };

    const fetchFilteredBulkdata = async () => {
        try {

            let res = await axios.get(SERVICE.EXCELMAPDATARESPERSON, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let result = res?.data?.excelmaprespersondatas.filter((data) => selectedRows.includes(data._id));
            setBulkDataOverall(result);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}

    }


    const handleBulkOverAllFiledCheck = () => {
        if (newpriorityOverall === "" || newpriorityOverall === "Select Sector") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Choose Sector"}</p>
                </>
            );
            handleClickOpenerr();

        } else if (newbranchOverall === "" || newbranchOverall === "Select Branch") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Choose Branch"}</p>
                </>
            );
            handleClickOpenerr();

        }
        else if (newunitOverall === "" || newunitOverall === "Select Unit") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Choose Unit"}</p>
                </>
            );
            handleClickOpenerr();

        }
        else if (newteamOverall === "" || newteamOverall === "Select Team") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Choose Team"}</p>
                </>
            );
            handleClickOpenerr();

        }
        else if (newrespersonOverall === "" || newrespersonOverall === "Select Team") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Choose Responsible Person"}</p>
                </>
            );
            handleClickOpenerr();

        }
        else {
            handleSubmitBulk();
        }
    }


    const handleSubmitBulk = () => {
        let ans = bulkDataOverall.length > 0 && bulkDataOverall?.forEach((data, i) => {
            const answer = data.todo.some(data => data.branch === newbranchOverall);
            const primaryCheck = data.todo.some(data => data.priority === "Primary" && newpriorityOverall === 'Primary');
            if (!answer) {
                if (primaryCheck) {
                    const answer = data.todo.filter(data => data.priority === "Primary")
                    const todoanswer = data.todo.map((data) => {
                        if (data.priority === "Primary") {
                            data.branch = newbranchOverall === "Select Branch" ? data.branch : newbranchOverall
                            data.unit = newunitOverall === "Select Unit" ? "unallotted" : newunitOverall
                            data.team = newteamOverall === "Select Team" ? "unallotted" : newteamOverall
                            data.resperson = newrespersonOverall === "Select Responsible Person" ? "unallotted" : newrespersonOverall
                            data.priority = "Primary"
                        }
                        return data
                    });

                    try {
                        const response = axios.put(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${data._id}`, {
                            todo: todoanswer,
                        });
                        setSelectedRows([]);
                        setSelectAll(false);
                        handleCloseBulEdit();
                         OnFilterSubmit('false');
                        setNewBranchOverall("Select Branch");
                        setNewUnitOverall("Select Unit");
                        setNewTeamOverall("Select Team");
                        setNewRespersonOverall("Select Responsible Person");
                        setNewPriorityOverall("Select Sector");

                    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
                } else {
                    const newTodocheck = {
                        branch: newbranchOverall,
                        unit: newunitOverall === "Select Unit" ? "unallotted" : newunitOverall,
                        team: newteamOverall === "Select Team" ? "unallotted" : newteamOverall,
                        resperson: newrespersonOverall === "Select Responsible Person" ? "unallotted" : newrespersonOverall,
                        priority: newpriorityOverall  === "Select Sector" ? "unallotted" : newpriorityOverall,
                    };
                    try {
                        const response = axios.put(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${data._id}`, {
                            todo: [...data.todo, newTodocheck],
                        });
                        setSelectedRows([]);
                        setSelectAll(false);
                        handleCloseBulEdit();
                     OnFilterSubmit('false');
                        setNewBranchOverall("Select Branch");
                        setNewUnitOverall("Select Unit");
                        setNewTeamOverall("Select Team");
                        setNewRespersonOverall("Select Responsible Person");
                        setNewPriorityOverall("Select Sector");

                    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
                }
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"Some of Data You have Chose Contains the branch Name already in it.Remaining Will get's Updated"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }

        })

        OnFilterSubmit("false")
    }

    const handleCloseModalertEdit = () => {
        setIsEditOpenalert(false);
    };
    const handleCloseAnsCheckEdit = () => {
        setIsEditAnsCheckalert(false);
    };
    const handleCloseBulEdit = () => {
        setIsEditOpencheckbox(false);
        setNewBranchOverall("Select Branch");
        setNewUnitOverall("Select Unit");
        setNewTeamOverall("Select Team");
        setNewRespersonOverall("Select Responsible Person");
        setNewPriorityOverall("Select Sector");
    };

    // get single row to edit....
    const getCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setupdatedbydata(res?.data?.sexcelmaprespersondata.updatedby)
            setExceledit(res?.data?.sexcelmaprespersondata);
            setRowGetid(res?.data?.sexcelmaprespersondata);
            setTodoscheck(res?.data?.sexcelmaprespersondata?.todo);
            setNewBranch("Select Branch");
            setNewUnit("Select Unit");
            setNewTeam("Select Team");
            setNewResperson("Select Responsible Person");
            setNewPriority("Select Sector");
            seterrormsgedit("")
            handleClickOpenEdit();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}

    };


    const [todoscheck, setTodoscheck] = useState([]);
    const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
    const [newbranch, setNewBranch] = useState("Select Branch");
    const [newunit, setNewUnit] = useState("Select Unit");
    const [newteam, setNewTeam] = useState("Select Team");
    const [newresperson, setNewResperson] = useState("Select Responsible Person");
    const [newpriority, setNewPriority] = useState("Select Sector");
    const [todoscheckOverall, setTodoscheckOverall] = useState([]);
    const [editingIndexcheckOverall, setEditingIndexcheckOverall] = useState(-1);
    const [newbranchOverall, setNewBranchOverall] = useState("Select Branch");
    const [newunitOverall, setNewUnitOverall] = useState("Select Unit");
    const [newteamOverall, setNewTeamOverall] = useState("Select Team");
    const [newrespersonOverall, setNewRespersonOverall] = useState("Select Responsible Person");
    const [newpriorityOverall, setNewPriorityOverall] = useState("Select Sector");
    const [newbrancheditOverall, setNewBrancheditOverall] = useState("Select Branch");
    const [newuniteditOverall, setNewUniteditOverall] = useState("Select Unit");
    const [newteameditOverall, setNewTeameditOverall] = useState("Select Team");
    const [newrespersoneditOverall, setNewRespersoneditOverall] = useState("Select Responsible Person");
    const [newpriorityeditOverall, setNewPriorityeditOverall] = useState("Select Sector");
    const [errormsgeditOverall, seterrormsgeditOverall] = useState("");
    const [errormsgedittodoOverall, seterrormsgedittodoOverall] = useState("");

    const [newbranchedit, setNewBranchedit] = useState("Select Branch");
    const [newunitedit, setNewUnitedit] = useState("Select Unit");
    const [newteamedit, setNewTeamedit] = useState("Select Team");
    const [newrespersonedit, setNewRespersonedit] = useState("Select Responsible Person");
    const [newpriorityedit, setNewPriorityedit] = useState("Select Sector");
    const [errormsgedit, seterrormsgedit] = useState("");
    const [errormsgedittodo, seterrormsgedittodo] = useState("");

    //filter fields
    const [newcheckbranch, setNewcheckBranch] = useState("Select Branch");
    const [allFilters, setAllFilters] = useState({
        project: "Please Select Project",
        vendor: "Please Select Vendor",
        category: "Please Select Category",
        subcategory: "Please Select Subcategory",
        queue: "Please Select Queue",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        team: "Please Select Team",
        responsibleperson: "Please Select ResponsiblePerson",
        sector: "Please Select Sector"
    })
    const [vendors, setVendors] = useState([]);
    const [projects, setProjects] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const [subcategorys, setSubCategorys] = useState([]);
    const [queues, setQueues] = useState([]);
    const [branchs, setBranchs] = useState([]);
    const [unitsDrop, setUnitsDrop] = useState([]);
    const [unitstabledatadrop, setUnitstabledataDrop] = useState([]);
    const [newcheckunit, setNewcheckUnit] = useState("Select Unit");
    const [newcheckteam, setNewcheckTeam] = useState("Select Team");
    const [usersDrop, setUsersDrop] = useState([]);
    const handleCreateTodocheckedit = () => {
        if (
            newbranch !== "Select Branch" &&
            newunit !== "Select Unit" &&
            newteam !== "Select Team" &&
            newresperson !== "Select Responsible Person" &&
            newpriority !== "Select Sector"
        ) {
            const isDuplicate = todoscheck.some((todo) => todo.priority === newpriority || todo.branch === newbranch);
            const isDuplicatebranch = todoscheck.some((todo) => todo.branch === newbranch);
            const isDuplicatepriority = todoscheck.some((todo) => todo.priority === newpriority);
            if (!isDuplicate) {
                const newTodocheck = {
                    branch: newbranch,
                    unit: newunit,
                    team: newteam,
                    resperson: newresperson,
                    priority: newpriority,
                };
                setTodoscheck([...todoscheck, newTodocheck]);
                setNewBranch("Select Branch");
                setNewUnit("Select Unit");
                setNewTeam("Select Team");
                setNewResperson("Select Responsible Person");
                setNewPriority("Select Sector");
                seterrormsgedit("")
            } else {
                seterrormsgedit((isDuplicatepriority && isDuplicatebranch) ? 'Already this sector,branch added' : (isDuplicatebranch) ? 'Already this branch added' : (isDuplicatepriority) ? 'Already this Sector added' : "");
            }
        } else {
            seterrormsgedit(newbranch === "Select Branch" && newunit == "Select Unit" && newteam == "Select Team" ? "Please Fill All Fields" : newbranch === "Select Branch" ? "Please Select Branch" : newunit == "Select Unit" ? "Please select Unit" : newteam == "Select Team" ? "Please select Team" : newresperson == "Select Responsible Person" ? "Please select Responsible Person" : "Please select Sector")
        }
    };

    const handleEditTodocheck = (index) => {
        setEditingIndexcheck(index);
        setNewBranchedit(todoscheck[index].branch);
        setNewUnitedit(todoscheck[index].unit);
        setNewTeamedit(todoscheck[index].team);
        setNewRespersonedit(todoscheck[index].resperson);
        setNewPriorityedit(todoscheck[index].priority);
    };


    const handleUpdateTodocheck = () => {
        if (newbranchedit !== "Select Branch" && newunitedit !== "Select Unit" && newteamedit !== "Select Team" && newrespersonedit !== "Select Responsible Person" && newpriorityedit !== "Select Sector") {
            const branch = newbranchedit;
            const unit = newunitedit;
            const team = newteamedit;
            const resperson = newrespersonedit;
            const priority = newpriorityedit;
            let branchdupe = !todoscheck.find((todo, index) => index !== editingIndexcheck && todo.branch.toLowerCase() === newbranchedit.toLowerCase())
            let prioritydupe = !todoscheck.find((todo, index) => index !== editingIndexcheck && todo.priority.toLowerCase() === newpriorityedit.toLowerCase())
            if (!todoscheck.find(
                (todo, index) =>
                    index !== editingIndexcheck &&
                    todo.branch.toLowerCase() === newbranchedit.toLowerCase() && todo.priority.toLowerCase() === newpriorityedit.toLowerCase()
            )) {
                const newTodoscheck = [...todoscheck];
                newTodoscheck[editingIndexcheck].branch = branch;
                newTodoscheck[editingIndexcheck].unit = unit;
                newTodoscheck[editingIndexcheck].team = team;
                newTodoscheck[editingIndexcheck].resperson = resperson;
                newTodoscheck[editingIndexcheck].priority = priority;
                setTodoscheck(newTodoscheck);
                setEditingIndexcheck(-1);
            } else {
                seterrormsgedittodo((branchdupe && prioritydupe) ? 'Already this sector,branch added' : (branchdupe) ? 'Already this branch added' : (prioritydupe) ? 'Already this sector added' : "");
            }
        } else {
            seterrormsgedittodo(newbranchedit === "Select Branch" && newunitedit === "Select Unit" && newteamedit === "Select Team" && newrespersonedit === "Select Responsible Person" && newpriorityedit === "Please select Sector" ? "Please Fill All Fields" : newbranchedit === "Select Branch" ? "Please Select Branch" : newunitedit == "Select Unit" ? "Please select Unit" : newteamedit == "Select Team" ? "Please select Team" : newrespersonedit == "Select Responsible Person" ? "Please select Responsible Person" : "Please select Sector")
        }
    };


    const handleDeleteTodocheckedit = (index) => {
        const newTodoscheck = [...todoscheck];
        newTodoscheck.splice(index, 1);
        setTodoscheck(newTodoscheck);
    };


    //Bulk Edit Overall Function 

    const handleCreateTodocheckeditOverall = () => {
        if (
            newbranchOverall !== "Select Branch" &&
            newunitOverall !== "Select Unit" &&
            newteamOverall !== "Select Team" &&
            newrespersonOverall !== "Select Responsible Person" &&
            newpriorityOverall !== "Select Sector"
        ) {
            const isDuplicate = todoscheckOverall.some((todo) => todo.priority === newpriorityOverall || todo.branch === newbranchOverall);
            const isDuplicatebranch = todoscheckOverall.some((todo) => todo.branch === newbranchOverall);
            const isDuplicatepriority = todoscheckOverall.some((todo) => todo.priority === newpriorityOverall);
            if (!isDuplicate) {
                const newTodocheck = {
                    branch: newbranchOverall,
                    unit: newunitOverall,
                    team: newteamOverall,
                    resperson: newrespersonOverall,
                    priority: newpriorityOverall,
                };
                setTodoscheckOverall([...todoscheckOverall, newTodocheck]);
                setNewBranchOverall("Select Branch");
                setNewUnitOverall("Select Unit");
                setNewTeamOverall("Select Team");
                setNewRespersonOverall("Select Responsible Person");
                setNewPriorityOverall("Select Sector");
                seterrormsgeditOverall("")
            } else {
                seterrormsgeditOverall((isDuplicatepriority && isDuplicatebranch) ? 'Already this sector,branch added' : (isDuplicatebranch) ? 'Already this branch added' : (isDuplicatepriority) ? 'Already this Sector added' : "");
            }
        } else {
            seterrormsgeditOverall(newbranchOverall === "Select Branch" && newunitOverall == "Select Unit" && newteamOverall == "Select Team" ? "Please Fill All Fields" : newbranchOverall === "Select Branch" ? "Please Select Branch" : newunitOverall == "Select Unit" ? "Please select Unit" : newteamOverall == "Select Team" ? "Please select Team" : newrespersonOverall == "Select Responsible Person" ? "Please select Responsible Person" : "Please select Sector")
        }
    };

    const handleEditTodocheckOverall = (index) => {
        setEditingIndexcheckOverall(index);
        setNewBrancheditOverall(todoscheckOverall[index].branch);
        setNewUniteditOverall(todoscheckOverall[index].unit);
        setNewTeameditOverall(todoscheckOverall[index].team);
        setNewRespersoneditOverall(todoscheckOverall[index].resperson);
        setNewPriorityeditOverall(todoscheckOverall[index].priority);
    };


    const handleUpdateTodocheckOverall = () => {
        if (newbrancheditOverall !== "Select Branch" && newuniteditOverall !== "Select Unit" && newteameditOverall !== "Select Team" && newrespersoneditOverall !== "Select Responsible Person" && newpriorityeditOverall !== "Select Sector") {
            const branch = newbrancheditOverall;
            const unit = newuniteditOverall;
            const team = newteameditOverall;
            const resperson = newrespersoneditOverall;
            const priority = newpriorityeditOverall;
            let branchdupe = !todoscheckOverall.find((todo, index) => index !== editingIndexcheckOverall && todo.branch.toLowerCase() === newbrancheditOverall.toLowerCase())
            let prioritydupe = !todoscheckOverall.find((todo, index) => index !== editingIndexcheckOverall && todo.priority.toLowerCase() === newpriorityeditOverall.toLowerCase())
            if (!todoscheckOverall.find(
                (todo, index) =>
                    index !== editingIndexcheckOverall &&
                    todo.branch.toLowerCase() === newbrancheditOverall.toLowerCase() && todo.priority.toLowerCase() === newpriorityeditOverall.toLowerCase()
            )) {
                const newTodoscheck = [...todoscheckOverall];
                newTodoscheck[editingIndexcheckOverall].branch = branch;
                newTodoscheck[editingIndexcheckOverall].unit = unit;
                newTodoscheck[editingIndexcheckOverall].team = team;
                newTodoscheck[editingIndexcheckOverall].resperson = resperson;
                newTodoscheck[editingIndexcheckOverall].priority = priority;
                setTodoscheckOverall(newTodoscheck);
                setEditingIndexcheckOverall(-1);
            } else {
                seterrormsgedittodoOverall((branchdupe && prioritydupe) ? 'Already this sector,branch added' : (branchdupe) ? 'Already this branch added' : (prioritydupe) ? 'Already this sector added' : "");
            }
        } else {
            seterrormsgedittodoOverall(newbrancheditOverall === "Select Branch" && newuniteditOverall === "Select Unit" && newteameditOverall === "Select Team" && newrespersoneditOverall === "Select Responsible Person" && newpriorityeditOverall === "Please select Sector" ? "Please Fill All Fields" : newbrancheditOverall === "Select Branch" ? "Please Select Branch" : newuniteditOverall == "Select Unit" ? "Please select Unit" : newteameditOverall == "Select Team" ? "Please select Team" : newrespersoneditOverall == "Select Responsible Person" ? "Please select Responsible Person" : "Please select Sector")
        }
    };


    const handleDeleteTodocheckeditOverall = (index) => {
        const newTodoscheck = [...todoscheckOverall];
        newTodoscheck.splice(index, 1);
        setTodoscheckOverall(newTodoscheck);
    };
    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setExceledit(res?.data?.sexcelmaprespersondata);
            setupdatedbydata(res?.data?.sexcelmaprespersondata.updatedby)
            handleClickOpeninfo();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    //project change vendor filter
    const handleProjectChange = async (e) => {
        try {
            const [
                res_vendor,
                res_category
            ] = await Promise.all([
                axios.post(SERVICE.PROJECTVENDOR, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    project: String(e.value)
                }),
                axios.post(SERVICE.PROJECTCATEGORY, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    project: String(e.value)
                })
            ]);
            const vendorall = [...res_vendor?.data?.projectvendor.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            const categoryall = [...res_category?.data?.projectcategory.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            setCategorys(categoryall)
            setVendors(vendorall);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    //category change subcategory filter
    const handleCategorychange = async (e) => {
        try {
            const [
                res_subcategory,
            ] = await Promise.all([
                axios.post(SERVICE.CATEGORYSUBCATEGORY, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    category: String(e.value),
                    project: String(allFilters.project)
                }),
            ]);
            const subcatall = [...res_subcategory?.data?.catsubtime.map((d) => (
                {
                    ...d,
                    label: d.subcategory,
                    value: d.subcategory
                }
            ))];
            const queueall = [...res_subcategory?.data?.queueCheck.map((d) => (
                {
                    ...d,
                    label: d.queuename,
                    value: d.queuename
                }
            ))];
            setSubCategorys(subcatall)
            setQueues(queueall);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //branch change unit filter
    const handleChangeBranch = async (e) => {
        if (e.value == "NOT FOR US" || e.value == "OTHER-NFU" || e.value == "OTHER" || e.value == "WEB-NFU") {
            setUnitsDrop([...dropdowndata])
        } else {
            try {
                let res_unit = await axios.post(SERVICE.BRANCHUNIT, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    },
                    branch: String(e.value)
                });
                const unitsall = [...dropdowndata, ...res_unit?.data?.branchunits.map((d) => (
                    {
                        ...d,
                        label: d.name,
                        value: d.name
                    }
                ))];
                setUnits(unitsall)
             } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
}

    //filter options
    const fetchProjectDropdowns = async () => {
        try {
            let res_project = await axios.get(SERVICE.PROJECTMASTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const projall = [...res_project?.data?.projmaster.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            setProjects(projall);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const fetchBranchDropdowns = async () => {
        let res = isAssignBranch?.map(data => ({
            label: data.branch,
            value: data.branch,
          })).filter((item, index, self) => {
            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
          })
            const branchall = [...dropdowndata, ...res];
            setBranchs(branchall);
    };

    // get all units
    const fetchUnitsDrop = async (branch) => {
        let res = isAssignBranch?.filter(
            (comp) =>
                branch === comp.branch
          )?.map(data => ({
            label: data.unit,
            value: data.unit,
          })).filter((item, index, self) => {
            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
          })

            setUnitstabledataDrop(res);
    }

    const fetchUnitsEditDrop = async (branch) => {
        let res = isAssignBranch?.filter(
            (comp) =>
                branch === comp.branch
          )?.map(data => ({
            label: data.unit,
            value: data.unit,
          })).filter((item, index, self) => {
            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
          })

          setUnitstabledata(res);
    }
    const fetchUnitsIndividualDrop = async (branch) => {
        let res = isAssignBranch?.filter(
            (comp) =>
                branch === comp.branch
          )?.map(data => ({
            label: data.unit,
            value: data.unit,
          })).filter((item, index, self) => {
            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
          })

          setUnitstabledata(res);
    }
    const fetchUnitsTodoeditDrop = async (branch) => {
        let res = isAssignBranch?.filter(
            (comp) =>
                branch === comp.branch
          )?.map(data => ({
            label: data.unit,
            value: data.unit,
          })).filter((item, index, self) => {
            return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
          })

          setUnitstabledata(res);
    }
    //get all employees list details
    const fetchEmployeeDrop = async () => {
            setUsersDrop(allUsersData);
    }

    // EXCEL_WORK_ORDER_OTHERallFilter
    //On Submit Filtering Data of Excel Datas
    const OnFilterSubmit = async (e) => {
        try {
            let res_employee = await axios.post(SERVICE.ALLOTTED_RESPONSIBLE_QUEUE_LIST_FILTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                project: allFilters.project === "Please Select Project" ? "" : allFilters.project,
                vendor: allFilters.vendor === "Please Select Vendor" ? "" : allFilters.vendor,
                category: allFilters.category === "Please Select Category" ? "" : allFilters.category,
                subcategory: allFilters.subcategory === "Please Select Subcategory" ? "" : allFilters.subcategory,
                queue: allFilters.queue === "Please Select Queue" ? "" : allFilters.queue,
                branch: allFilters.branch === "Please Select Branch" ? "" : allFilters.branch,
                unit: allFilters.unit === "Please Select Unit" ? "" : allFilters.unit,
                team: allFilters.team === "Please Select Team" ? "" : allFilters.team,
                resperson: allFilters.responsibleperson === "Please Select ResponsiblePerson" ? "" : allFilters.responsibleperson,
                prioritystatus: allFilters.sector === "Please Select Sector" ? "" : allFilters.sector,
                page: page,
                pageSize: pageSize,
                value: e


            });
            const ans = res_employee?.data?.result?.length > 0 ? res_employee?.data?.result : []
            const itemsWithSerialNumber = ans?.flatMap((item , index) => item.todo.map(todoItem => ({
                _id: item?._id,
                serialNumber: (page - 1) * pageSize + index + 1,
                project: item.project,
                vendor: item.vendor,
                customer: item.customer,
                process: item.process,
                category: item.category,
                subcategory: item.subcategory,
                queue: item.queue,
                branch: todoItem?.branch,
                unit: todoItem?.unit,
                team: todoItem?.team,
                resperson: todoItem?.resperson,
                priority: todoItem?.priority,

            })));
            setExcelmapdataresperson(itemsWithSerialNumber);
            setTotalProjects(ans?.length > 0 ? res_employee?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_employee?.data?.totalPages : 0);
            setPageSize((data) => { return ans?.length > 0 ? data : 10 });
            setPage((data) => { return ans?.length > 0 ? data : 1 });

            setIsLoader(true)
        } catch (err) {setIsLoader(true);handleApiError(err, setShowAlert, handleClickOpenerr);}

    }

    const handleSubmit = (e) => {
        setIsLoader(false)
        e.preventDefault();
        if (allFilters.project === "Please Select Project" && allFilters.vendor === "Please Select Vendor" &&
            allFilters.category === "Please Select Category" && allFilters.subcategory === "Please Select Subcategory" &&
            allFilters.queue === "Please Select Queue" && allFilters.branch === "Please Select Branch" &&
            allFilters.unit === "Please Select Unit" && allFilters.team === "Please Select Team" &&
            allFilters.responsibleperson === "Please Select ResponsiblePerson" && allFilters.sector === "Please Select Sector") {
            setIsLoader(true)
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Select Atleast One Field"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {

            OnFilterSubmit("true");
        }
    }

    useEffect(() => {
        OnFilterSubmit("false")
    }, [page, pageSize])

    const handleClear = () => {
        setAllFilters({
            project: "Please Select Project",
            vendor: "Please Select Vendor",
            category: "Please Select Category",
            subcategory: "Please Select Subcategory",
            queue: "Please Select Queue",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            team: "Please Select Team",
            responsibleperson: "Please Select ResponsiblePerson",
            sector: "Please Select Sector"
        });
        setCategorys([])
        setVendors([]);
        setSubCategorys([])
        setQueues([]);
        setUnitsDrop([])
        setUnits([]);
        setUsersDrop([]);
        setNewcheckBranch("Select Branch");
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Cleared Successfully"}</p>
            </>
        );
        handleClickOpenerr();
        OnFilterSubmit("Cleared")

    }
    useEffect(
        () => {
            fetchProjectDropdowns();
            fetchBranchDropdowns();
            fetchEmployeeDrop();
        }, []);



    const [deleteAlloted, setDeleteAllotted] = useState([])
    //set function to get particular row
    const rowData = async (id, name) => {
        try {
            let res = await axios.get(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            handleClickOpen();
            setDeleteAllotted(res?.data?.sexcelmaprespersondata);

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    // Alert delete popup
    let projectid = deleteAlloted._id;
    const delProject = async () => {
        try {
            let res = await axios.delete(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${projectid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await OnFilterSubmit('false');
            handleCloseMod();
            setPage(1);
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Deleted Successfully"}</p>
                </>
            );
            handleClickOpenerr();
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const delProjectcheckbox = async () => {
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${item}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            await OnFilterSubmit('false');
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAll(false);
            setPage(1);
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Deleted Successfully"}</p>
                </>
            );
            handleClickOpenerr();
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get all branches
    const fetchBranch = async () => {
            const branchdata = isAssignBranch?.map(data => ({
                label: data.branch,
                value: data.branch,
              })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
              })
            setBranches([...dropdowndata, ...branchdata])
    }

    const [unitsmap, setUnitsmap] = useState([]);

    useEffect(() => {
        const groupedData = units?.reduce((acc, current) => {
            const { branch, name } = current;
            if (!acc[branch]) {
                acc[branch] = { branch, name: [] };
            }
            acc[branch].name.push(name);
            return acc;
        }, {});
        setUnitsmap(Object.values(groupedData));
    }, [units]);

    const setUnitNamesval = unitName ? unitName : exceledit.unit
    //Team Dropdowns based on unit name 
    const fetchTeamDropdwons = async () => {
            let teamDetails = allTeam.filter((data) => {
                if (setUnitNamesval === data.unit) {
                    return data
                }
                else if (setUnitNamesval === "all") {
                    return data
                }
            })
            setTeamDrop(teamDetails)
    }

    let loginid = localStorage.LoginUserId;
    let newdate = new Date();
    //edit post call
    let excelmap_id = exceledit._id

    const sendRequestEdit = async () => {

        try {
            let excelmap = await axios.put(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${excelmap_id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

                username: String(isUserRoleAccess.companyname),
                todo: todoscheck,
                updatedate: String(moment(newdate).format('DD-MM-YYYY hh:mm:ss a')),
                updatedby: [
                    ...updatedbydata, {
                        name: String(isUserRoleAccess.companyname),
                        todo: todoscheck,
                        date: String(new Date()),
                    },
                ],
            })
            handleCloseModEdit();
            await OnFilterSubmit('false');
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Updated Successfully"}</p>
                </>
            );
            handleClickOpenerr();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    const editSubmit = (e) => {
        e.preventDefault();
        if (todoscheck.length > 0) {
            sendRequestEdit();
        } else {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please Allot atleast One Responsible person"}</p>
                </>
            );
            handleClickOpenerr();
        }

    }

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    useEffect(() => {
        fetchTeamDropdwons();
    }, [isEditOpen])


    useEffect(() => {
        fetchBranch();
    }, [])


    const newData = excelmapdataresperson;

    const [serial, setSerial] = useState([])
    const addSerialNumbernewdata = () => {
        const itemsWithSerialNumber = newData?.map((item, index) => ({ ...item, sno: index + 1 }));
        setSerial(itemsWithSerialNumber);
    }


    useEffect(() => {
        addSerialNumbernewdata();
    }, [newData])


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Unalloted Responsible Person ",
        pageStyle: "print",
    });


    //pdf....
    const columnsres = [
        { title: "Project Name", field: "project" },
        { title: "Vendor Name", field: "vendor" },
        { title: "Customer", field: "customer" },
        { title: "Process", field: "process" },
        { title: "Category Name", field: "category" },
        { title: "Subcategory Name", field: "subcategory" },
        { title: "Queue Name", field: "queue" },
        { title: "Branch", field: "branch" },
        { title: "Unit", field: "unit" },
        { title: "Team", field: "team" },
        { title: "Resperson", field: "resperson" },
        { title: "Sector", field: "priority" },

    ];
    const downloadPdfRes = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 6, // Set the font size to 10
            },
            columns: columnsres.map((col) => ({ ...col, dataKey: col.field })),
            body: serial,
        });
        doc.save("UnAllotedResperson.pdf");
    };

    // Excel
    const fileNameRes = "Allotted Responsible Person";


    //print...
    const componentRefRes = useRef();
    const handleprintres = useReactToPrint({
        content: () => componentRefRes.current,
        documentTitle: "Alloted Responsible Person ",
        pageStyle: "print",
    });



    //table sorting
    const [sorting, setSorting] = useState({ column: '', direction: '' });

    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
        setSorting({ column, direction });
    };


    const renderSortingIcon = (column) => {
        if (sorting.column !== column) {
            return <>
                <Box sx={{ color: '#bbb6b6' }}>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropUpOutlinedIcon />
                    </Grid>
                    <Grid sx={{ height: '6px', fontSize: '1.6rem' }}>
                        <ArrowDropDownOutlinedIcon />
                    </Grid>
                </Box>
            </>;
        } else if (sorting.direction === 'asc') {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        } else {
            return <>
                <Box >
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropUpOutlinedIcon style={{ color: '#bbb6b6', fontSize: '1.6rem' }} />
                    </Grid>
                    <Grid sx={{ height: '6px' }}>
                        <ArrowDropDownOutlinedIcon style={{ color: 'black', fontSize: '1.6rem' }} />
                    </Grid>
                </Box>
            </>;
        }
    };

    //sorting for unalloted list table
    //Datatable
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
    };


    //datatable....
    const [searchQuery, setSearchQuery] = useState("");
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
    };

    // Split the search query into individual terms
    const searchOverTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term
    const filteredDatas = excelmapdataresperson?.filter((item) => {
        return searchOverTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    //CHECK BOX SELECTION
    const handleCheckboxChange = (id) => {
        let updatedSelectedRows;
        if (selectedRows.includes(id)) {
            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== id);
        } else {
            updatedSelectedRows = [...selectedRows, id];
        }

        setSelectedRows(updatedSelectedRows);

        // Update the "Select All" checkbox based on whether all rows are selected
        setSelectAll(updatedSelectedRows.length === filteredDatas.length);
    };

    //CHECK BOX CHECKALL SELECTION
    const handleSelectAll = () => {
        if (selectAll) {

            setSelectedRows([]);
            setSelectAll(false);
        } else {
            if (filteredDatas.length === 0) {
                // Do not allow checking when there are no rows
                return;
            }
            const allRowIds = filteredDatas.map((row) => row._id);
            setSelectedRows(allRowIds);
            setSelectAll(true);
        }
    };

    return (
        <Box>
            <Headtitle title={'UnAllotted Responsible Person List'} />
            {isUserRoleCompare?.includes("lallottedresponsiblelist")
                && (
                    <>
                        <Box sx={userStyle.container}>
                            <Typography sx={userStyle.SubHeaderText}>Allotted Responsible Person List </Typography>

                            <Grid container spacing={2}>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Project</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={projects}
                                            styles={colourStyles}
                                            value={{ label: allFilters.project, value: allFilters.project }}
                                            onChange={(e) => { handleProjectChange(e); setAllFilters({ ...allFilters, project: e.value, vendor: "Please Select Vendor", category: "Please Select Category", subcategory: "Please Select Subcategory", queue: "Please Select Queue" }) }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Vendor</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={vendors}
                                            styles={colourStyles}
                                            value={{ label: allFilters.vendor, value: allFilters.vendor }}
                                            onChange={(e) => setAllFilters({ ...allFilters, vendor: e.value })}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Category</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={categorys}
                                            styles={colourStyles}
                                            value={{ label: allFilters.category, value: allFilters.category }}
                                            onChange={(e) => { setAllFilters({ ...allFilters, category: e.value }); handleCategorychange(e); }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Subcategory</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={subcategorys}
                                            styles={colourStyles}
                                            value={{ label: allFilters.subcategory, value: allFilters.subcategory }}
                                            onChange={(e) => { setAllFilters({ ...allFilters, subcategory: e.value }); }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Queue</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={queues}
                                            styles={colourStyles}
                                            value={{ label: allFilters.queue, value: allFilters.queue }}
                                            onChange={(e) => { setAllFilters({ ...allFilters, queue: e.value }); }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Branch</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={branchs}
                                            styles={colourStyles}
                                            value={{ label: allFilters.branch, value: allFilters.branch }}
                                            onChange={(e) => {
                                                setNewcheckBranch(e.value); setNewcheckUnit("Select Unit");
                                                fetchUnitsDrop(e.value);
                                                handleChangeBranch(e); setAllFilters({ ...allFilters, branch: e.value, unit: "Please Select Unit", team: "Please Select Team", responsibleperson: "Please Select ResponsiblePerson" })
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Unit</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={[...dropdowndata, ...unitstabledatadrop]}
                                            styles={colourStyles}
                                            value={{ label: allFilters.unit, value: allFilters.unit }}
                                            onChange={(e) => {
                                                setNewcheckUnit(e.value); setNewcheckTeam("Select Team");
                                                setAllFilters({ ...allFilters, unit: e.value, team: "Please Select Team", responsibleperson: "Please Select ResponsiblePerson" })
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Team</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={[...dropdowndata, ...(allTeam
                                                .filter(team => team.unit === newcheckunit && team.branch === newcheckbranch)
                                                .map(sub => ({
                                                    ...sub,
                                                    label: sub.teamname,
                                                    value: sub.teamname
                                                }
                                                )))]
                                            }
                                            styles={colourStyles}
                                            value={{ label: allFilters.team, value: allFilters.team }}
                                            onChange={(e) => { setAllFilters({ ...allFilters, team: e.value }) }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Responsibleperson</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={[...dropdowndata, ...(usersDrop
                                                .filter(user => user.unit === newcheckunit && user.branch === newcheckbranch && user.team === allFilters.team)
                                                .map(sub => ({
                                                    ...sub,
                                                    label: sub.companyname,
                                                    value: sub.companyname
                                                }
                                                )))]}
                                            styles={colourStyles}
                                            value={{ label: allFilters.responsibleperson, value: allFilters.responsibleperson }}
                                            onChange={(e) => { setAllFilters({ ...allFilters, responsibleperson: e.value }) }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Typography>Sector</Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            options={[...dropdowndata, ...[{ label: 'Primary', value: 'Primary' }, { label: 'Secondary', value: 'Secondary' }, { label: 'Tertiary', value: 'Tertiary' }]]}
                                            styles={colourStyles}
                                            value={{ label: allFilters.sector, value: allFilters.sector }}
                                            onChange={(e) => { setAllFilters({ ...allFilters, sector: e.value }) }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item lg={6} md={3} xs={12} sm={6}>
                                </Grid>

                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Button variant="contained" onClick={(e) => handleSubmit(e)} >FILTER</Button>
                                </Grid>
                                <Grid item lg={3} md={3} xs={12} sm={6}>
                                    <Button sx={userStyle.btncancel} onClick={handleClear}>CLEAR</Button>
                                </Grid>
                            </Grid><br></br>
                            <br></br>
                            <br></br>

                            <Grid container spacing={2} style={userStyle.dataTablestyle}>
                                <Grid item md={1} xs={12} sm={12}>
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
                                <Grid item md={1.4} xs={12} sm={12} marginTop={4} >
                                    {isUserRoleCompare?.includes("bdallottedresponsiblelist")
                                        && (
                                            <Button variant="contained" sx={{ textTransform: 'capitalize' }} color="error" onClick={handleClickOpenalert} size="small" >Bulk Delete</Button>
                                        )}
                                </Grid>
                                <Grid item md={1} xs={12} sm={12} marginTop={4} >
                                    {isUserRoleCompare?.includes("beallottedresponsiblelist")
                                        && (
                                            <Button variant="contained" sx={{ textTransform: 'capitalize' }} color="success" onClick={handleClickOpenalertEdit} size="small" >Bulk Edit</Button>
                                        )}
                                </Grid>
                                <Grid item md={6.5} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Box >
                                        {isUserRoleCompare?.includes("excelallottedresponsiblelist")
                                            && (

                                                <>
                                                    <Button onClick={(e) => {
                                                        setIsFilterOpen(true)
                                                        setFormat("xl")
                                                    }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                                </>
                                            )}
                                        {isUserRoleCompare?.includes("csvallottedresponsiblelist")
                                            && (

                                                <>
                                                    <Button onClick={(e) => {
                                                        setIsFilterOpen(true)
                                                        setFormat("csv")
                                                    }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                                </>
                                            )}
                                        {isUserRoleCompare?.includes("printallottedresponsiblelist")
                                            && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleprintres} >  &ensp; <FaPrint /> &ensp;Print&ensp; </Button>
                                                </>
                                            )}
                                        {isUserRoleCompare?.includes("pdfallottedresponsiblelist")
                                            && (

                                                <>
                                                    <Button sx={userStyle.buttongrp}
                                                        onClick={() => {
                                                            setIsPdfFilterOpen(true)
                                                        }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
                                                </>
                                            )}
                                        <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;Image&ensp; </Button>

                                    </Box>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
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


                            {!isLoader ?

                                <>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FacebookCircularProgress />
                                    </Box>
                                </> :
                                <>
                                    <TableContainer component={Paper} >
                                        <Table
                                            aria-label="simple table"
                                            id="excel"
                                            ref={gridRef}
                                        >
                                            <TableHead sx={{ fontWeight: "600" }}>
                                                <StyledTableRow>

                                                    <StyledTableCell>
                                                        <Checkbox
                                                            checked={selectAll}
                                                            onChange={handleSelectAll}
                                                        />
                                                    </StyledTableCell>

                                                    <StyledTableCell onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('project')}><Box sx={userStyle.tableheadstyle}><Box>Project</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('project')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('vendor')}><Box sx={userStyle.tableheadstyle}><Box>Vendor</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('vendor')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('customer')}><Box sx={userStyle.tableheadstyle}><Box>Customer</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('customer')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('process')}><Box sx={userStyle.tableheadstyle}><Box>Process</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('process')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('category')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('category')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('subcategory')}><Box sx={userStyle.tableheadstyle}><Box>Subcategory</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('subcategory')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('queue')}><Box sx={userStyle.tableheadstyle}><Box>Queue</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('queue')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell  onClick={() => handleSorting('branch')}><Box sx={userStyle.tableheadstyle }><Box>Branch</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('branch')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell  onClick={() => handleSorting('unit')}><Box sx={ userStyle.tableheadstyle }><Box>Unit</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('unit')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell  onClick={() => handleSorting('team')}><Box sx={userStyle.tableheadstyle }><Box>Team</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('team')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell  onClick={() => handleSorting('resperson')}><Box sx={userStyle.tableheadstyle}><Box>Responsible Person</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('resperson')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell  onClick={() => handleSorting('sector')}><Box sx={userStyle.tableheadstyle }><Box>Sector</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('sector')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell onClick={() => handleSorting('lastupdated')}><Box sx={userStyle.tableheadstyle}><Box>Last Updated</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('lastupdated')}</Box></Box></StyledTableCell>
                                                    <StyledTableCell >Action</StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>
                                            <TableBody align="left">
                                                {filteredDatas.length > 0 ? (
                                                    filteredDatas?.map((row, index) => (
                                                        <StyledTableRow key={index} sx={{ background: selectedRows.includes(row._id) ? "#1976d22b !important" : "inherit" }}>
                                                            <StyledTableCell>
                                                                <Checkbox
                                                                    checked={selectedRows.includes(row._id)}
                                                                    onChange={() => handleCheckboxChange(row._id)}
                                                                />
                                                            </StyledTableCell>
                                                            <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                            <StyledTableCell>{row.project}</StyledTableCell>
                                                            <StyledTableCell>{row.vendor} </StyledTableCell>
                                                            <StyledTableCell>{row.customer} </StyledTableCell>
                                                            <StyledTableCell>{row.process} </StyledTableCell>
                                                            <StyledTableCell>{row.category} </StyledTableCell>
                                                            <StyledTableCell>{row.subcategory} </StyledTableCell>
                                                            <StyledTableCell>{row.queue} </StyledTableCell>
                                                            <StyledTableCell>{row.branch} </StyledTableCell>
                                                            <StyledTableCell>{row.unit} </StyledTableCell>
                                                            <StyledTableCell>{row.team} </StyledTableCell>
                                                            <StyledTableCell>{row.resperson} </StyledTableCell>
                                                            <StyledTableCell>{row.priority} </StyledTableCell>
                                                            {/* <StyledTableCell colspan={5}>
                                                                {row.todo.map((item, i) => (
                                                                    <Grid container spacing={1} key={i}>
                                                                        <Grid item md={0.2} sm={0.2} xs={0.2}>
                                                                            {i + 1}. &ensp;
                                                                        </Grid>
                                                                        <Grid item md={2.5} sm={2.5} xs={2.5}>
                                                                            &ensp; {item?.branch}
                                                                        </Grid>
                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                            {item?.unit}
                                                                        </Grid>
                                                                        <Grid item md={2} sm={2} xs={2}>
                                                                            {item?.team}
                                                                        </Grid>
                                                                        <Grid item md={3.8} sm={3.8} xs={3.8}>
                                                                            {item?.resperson}
                                                                        </Grid>
                                                                        <Grid item md={1.5} sm={2} xs={2}>
                                                                            {item?.priority}
                                                                        </Grid>
                                                                    </Grid>
                                                                ))}

                                                            </StyledTableCell> */}


                                                            <StyledTableCell>
                                                                {(row.updatedate)}<br />
                                                                {(row.username)}
                                                            </StyledTableCell>
                                                            <StyledTableCell component="th" scope="row" colSpan={1}>
                                                                <Grid sx={{ display: "flex" }}>
                                                                    {isUserRoleCompare?.includes("eallottedresponsiblelist")
                                                                        && (
                                                                            <>
                                                                                <Button sx={userStyle.buttonedit} onClick={() => {
                                                                              
                                                                                    getCode(row._id)
                                                                                }}>
                                                                                    <EditOutlinedIcon style={{ fontsize: "large" }} />
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                    {isUserRoleCompare?.includes("iallottedresponsiblelist")
                                                                        && (
                                                                            <>
                                                                                <Button
                                                                                    sx={userStyle.buttonedit}
                                                                                    onClick={() => {
                                                                              
                                                                                        getinfoCode(row._id);
                                                                                    }}
                                                                                >

                                                                                    <InfoOutlinedIcon style={{ fontsize: "large" }} />

                                                                                </Button>
                                                                                <Button
                                                                                    sx={userStyle.buttondelete}
                                                                                    onClick={(e) => {
                                                                                        rowData(row._id, row.name);
                                                                                    }}
                                                                                >
                                                                                    <DeleteOutlineOutlinedIcon
                                                                                        style={{ fontsize: "large" }}
                                                                                    />
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                </Grid>
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                    ))) : <StyledTableRow> <StyledTableCell colSpan={15} align="center">No Data Available</StyledTableCell> </StyledTableRow>}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Box>
                                        <Pagination
                                            page={ searchQuery !== "" ? 1 : page}
                                            pageSize={pageSize}
                                            totalPages={searchQuery !== "" ? 1 : totalPages}
                                            onPageChange={handlePageChange}
                                            pageItemLength={filteredDatas?.length}
                                            totalProjects={
                                                searchQuery !== "" ? filteredDatas?.length : totalProjects
                                            }
                                        />                                    {/* <Pagination page={page} pageSize={pageSize} totalPagesCount={totalPages} onPageChange={handlePageChange} pageItemLength={employees} /> */}
                                    </Box>


                                </>
                            }
                        </Box>
                    </>
                )
            }
            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                    fullWidth={true}
                    sx={{
                        overflow: 'visible',
                        '& .MuiPaper-root': {
                            overflow: 'visible',
                        },
                    }}
                >
                    <DialogContent sx={{ overflow: 'auto' }}>
                        <>
                            <Typography sx={userStyle.HeaderText}> Edit Alloted Responsible Person List</Typography>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontSize: '18px', fontWight: '900', color: 'black' }}> Customer</Typography>
                                        <Typography>{exceledit.customer}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontSize: '18px', fontWight: '900' }}> Process</Typography>
                                        <Typography>{exceledit.process}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontSize: '18px', fontWight: '900' }}> Category</Typography>
                                        <Typography>{exceledit.category}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontSize: '18px', fontWight: '900' }}> Subcategory</Typography>
                                        <Typography>{exceledit.subcategory}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontSize: '18px', fontWight: '900' }}> Queue</Typography>
                                        <Typography>{exceledit.queue}</Typography>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />  <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography>Branch</Typography>
                                    <FormControl fullWidth>
                                        <Selects
                                            options={branches}
                                            styles={colourStyles}
                                            value={{ label: newbranch, value: newbranch }}
                                            onChange={(e) => {
                                                setNewBranch(e.value); 
                                                fetchUnitsIndividualDrop(e.value);
                                                setNewUnit("Select Unit");
                                                 setNewResperson("Select Responsible Person")
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography>Unit</Typography>
                                    <FormControl fullWidth>

                                        <Selects
                                            options={[...dropdowndata, ...unitstabledata]}
                                            styles={colourStyles}
                                            value={{ label: newunit, value: newunit }}
                                            onChange={(e) => {
                                                setNewUnit(e.value); setNewTeam("Select Team")
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography >Team</Typography>
                                    <FormControl fullWidth>

                                        <Selects
                                            options={[...dropdowndata, ...(allTeam
                                                .filter(team => team.unit === newunit && team.branch === newbranch)
                                                .map(sub => ({
                                                    ...sub,
                                                    label: sub.teamname,
                                                    value: sub.teamname
                                                }
                                                )))]
                                            }
                                            styles={colourStyles}
                                            value={{ label: newteam, value: newteam }}
                                            onChange={(e) => {
                                                setNewTeam(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography >Responsible Person</Typography>
                                    <FormControl fullWidth>
                                        <Selects
                                            options={[...dropdowndata, ...(allUsersData
                                                .filter(user => user.unit === newunit && user.branch === newbranch && user.team === newteam)
                                                .map(sub => ({
                                                    ...sub,
                                                    label: sub.companyname,
                                                    value: sub.companyname
                                                }
                                                )))]}
                                            styles={colourStyles}
                                            value={{ label: newresperson, value: newresperson }}
                                            onChange={(e) => {
                                                setNewResperson(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography >Sector</Typography>
                                    <FormControl fullWidth>
                                        <Selects
                                            options={[...dropdowndata, ...[{ label: 'Primary', value: 'Primary' }, { label: 'Secondary', value: 'Secondary' }, { label: 'Tertiary', value: 'Tertiary' }]]}
                                            styles={colourStyles}
                                            value={{ label: newpriority, value: newpriority }}
                                            onChange={(e) => {
                                                setNewPriority(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={2} sm={2} xs={2} marginTop={3}>
                                    <Button variant="contained" sx={{ minWidth: '40px', height: '37px' }} onClick={handleCreateTodocheckedit}><FaPlus sx={{ color: 'white' }} /></Button>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container>
                                <Typography color="error">{errormsgedit}</Typography>
                            </Grid>
                            <br />
                            <br />
                            {todoscheck?.map((item, i) => (
                                <div key={i}>
                                    {editingIndexcheck === i ? (
                                        <>
                                            <Grid container spacing={1}>
                                                <Grid item md={0.2} sm={0.2} xs={0.2}>
                                                    {i + 1}. &ensp;
                                                </Grid>
                                                <Grid item md={2} sm={2} xs={2}>
                                                    <FormControl fullWidth>
                                                        <Selects
                                                            options={branches}
                                                            styles={colourStylesEdit}
                                                            value={{ label: newbranchedit, value: newbranchedit }}
                                                            onChange={(e) => {
                                                                setNewBranchedit(e.value); 
                                                                fetchUnitsTodoeditDrop(e.value);
                                                                setNewUnitedit("Select Unit"); 
                                                                setNewRespersonedit("Select Responsible Person")
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={2} sm={2} xs={2}>
                                                    <FormControl fullWidth>
                                                        <Selects
                                                            options={[...dropdowndata, ...unitstabledata]
                                                            }
                                                            styles={colourStylesEdit}
                                                            value={{ label: newunitedit, value: newunitedit }}
                                                            onChange={(e) => {
                                                                setNewUnitedit(e.value); setNewTeamedit("Select Team")
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={2} sm={2} xs={2}>
                                                    <FormControl fullWidth>
                                                        <Selects
                                                            options={[...dropdowndata, ...(allTeam
                                                                .filter(team => team.unit === newunitedit && team.branch === newbranchedit)
                                                                .map(sub => ({
                                                                    ...sub,
                                                                    label: sub.teamname,
                                                                    value: sub.teamname
                                                                }
                                                                )))]
                                                            }
                                                            styles={colourStylesEdit}
                                                            value={{ label: newteamedit, value: newteamedit }}
                                                            onChange={(e) => {
                                                                setNewTeamedit(e.value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={3.0} sm={3.0} xs={3.0}>
                                                    <FormControl fullWidth>
                                                        <Selects
                                                            options={[...dropdowndata, ...(allUsersData
                                                                .filter(user => user.unit === newunitedit && user.branch === newbranchedit && user.team === newteamedit)
                                                                .map(sub => ({
                                                                    ...sub,
                                                                    label: sub.companyname,
                                                                    value: sub.companyname
                                                                }
                                                                )))]}
                                                            styles={colourStylesEdit}
                                                            value={{ label: newrespersonedit, value: newrespersonedit }}
                                                            onChange={(e) => {
                                                                setNewRespersonedit(e.value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={1.8} sm={1.8} xs={1.8}>
                                                    <FormControl fullWidth>
                                                        <Selects
                                                            options={[...dropdowndata, ...[{ label: 'Primary', value: 'Primary' }, { label: 'Secondary', value: 'Secondary' }, { label: 'Tertiary', value: 'Tertiary' }]]}
                                                            styles={colourStylesEdit}
                                                            value={{ label: newpriorityedit, value: newpriorityedit }}
                                                            onChange={(e) => {
                                                                setNewPriorityedit(e.value);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={0.5} sm={0.5} xs={0.5}>
                                                    <Button
                                                        variant="contained"
                                                        style={{
                                                            minWidth: '20px',
                                                            minHeight: '41px',
                                                            background: 'transparent',
                                                            boxShadow: 'none',
                                                            '&:hover': {
                                                                background: '#f4f4f4',
                                                                borderRadius: '50%',
                                                                minHeight: '41px',
                                                                minWidth: '20px',
                                                                boxShadow: 'none',
                                                            },
                                                        }}
                                                        onClick={handleUpdateTodocheck}
                                                    >
                                                        <CheckCircleIcon
                                                            style={{
                                                                color: "#216d21",
                                                                fontSize: "1.5rem",
                                                            }}
                                                        />
                                                    </Button>
                                                </Grid>
                                                <Grid item md={0.5} sm={0.5} xs={0.5}>
                                                    <Button
                                                        variant="contained"
                                                        style={{
                                                            minWidth: '20px',
                                                            minHeight: '41px',
                                                            background: 'transparent',
                                                            boxShadow: 'none',
                                                            marginTop: '-3px !important',
                                                            '&:hover': {
                                                                background: '#f4f4f4',
                                                                borderRadius: '50%',
                                                                minHeight: '41px',
                                                                minWidth: '20px',
                                                                boxShadow: 'none',
                                                            },
                                                        }}
                                                        onClick={() => setEditingIndexcheck(-1)}
                                                    >
                                                        <CancelIcon
                                                            style={{
                                                                color: "#b92525",
                                                                fontSize: "1.5rem",
                                                            }}
                                                        />
                                                    </Button>
                                                </Grid>

                                            </Grid>
                                            <Grid container>
                                                <Typography color="error">{errormsgedittodo}</Typography>
                                            </Grid>
                                        </>

                                    ) : (

                                        <Grid container spacing={1}>
                                            <Grid item md={0.2} sm={0.2} xs={0.2}>
                                                {i + 1}. &ensp;
                                            </Grid>
                                            <Grid item md={2} sm={2} xs={2}>
                                                &ensp; {item.branch}
                                            </Grid>
                                            <Grid item md={2} sm={2} xs={2}>
                                                {item.unit}
                                            </Grid>
                                            <Grid item md={2} sm={2} xs={2}>
                                                {item.team}
                                            </Grid>
                                            <Grid item md={3.0} sm={3.0} xs={3.0}>
                                                {item.resperson}
                                            </Grid>
                                            <Grid item md={1.5} sm={1.5} xs={1.5}>
                                                {item.priority}
                                            </Grid>
                                            <Grid item md={0.8} sm={0.8} xs={0.8}>
                                                <Button
                                                    variant="contained"
                                                    style={{
                                                        minWidth: '20px',
                                                        minHeight: '41px',
                                                        background: 'transparent',
                                                        boxShadow: 'none',
                                                        marginTop: '-13px',
                                                        '&:hover': {
                                                            background: '#f4f4f4',
                                                            borderRadius: '50%',
                                                            minHeight: '41px',
                                                            minWidth: '20px',
                                                            boxShadow: 'none',
                                                        },
                                                    }}
                                                    onClick={() => handleEditTodocheck(i)}
                                                >
                                                    <FaEdit
                                                        style={{
                                                            color: "#1976d2",
                                                            fontSize: "1.2rem",

                                                        }}
                                                    />
                                                </Button>
                                            </Grid>
                                            <Grid item md={0.5} sm={0.5} xs={0.5}>
                                                <Button onClick={(e) => handleDeleteTodocheckedit(i)} sx={{ borderRadius: "50%", minWidth: '35px', minHeight: '35px', marginTop: '-8px' }}>
                                                    <FaTrash style={{
                                                        color: "#b92525",
                                                        fontSize: "0.9rem",
                                                    }}
                                                    />
                                                </Button>
                                            </Grid>

                                        </Grid>

                                    )}
                                    <br />
                                </div>

                            ))}
                            <br />
                            <br />


                        </>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={editSubmit}>Update</Button>
                        <Button sx={userStyle.btncancel} onClick={handleCloseModEdit} >Cancel</Button>
                    </DialogActions>
                </Dialog>


                {/* Delete Modal */}
                <Box>
                    {/* ALERT DIALOG */}
                    <Dialog
                        open={isDeleteOpen}
                        onClose={handleCloseMod}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                            <Typography variant="h5" sx={{ color: 'red', textAlign: 'center' }}>Are you sure?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseMod} sx={userStyle.btncancel}>Cancel</Button>
                            <Button autoFocus variant="contained" color='error'
                                onClick={(e) => delProject(projectid)}
                            > OK </Button>
                        </DialogActions>
                    </Dialog>

                </Box>

                {/* this is info view details */}


                <Dialog
                    open={openInfo}
                    onClose={handleCloseinfo}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                >
                    <Box sx={{ width: "850px", padding: "20px 30px" }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>
                                {" "}
                                Alloted Responsible Person Info
                            </Typography>
                            <br />
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={12} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">Updated by</Typography>
                                        <br />
                                        <Table>
                                            <TableHead>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"Username"}.</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {updatedbydata?.map((item, i) => (
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
            </Box>

            {/* print layout for Alloted Responsible person*/}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                    id="usertable"
                    ref={componentRefRes}
                >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell> Project Name</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Process</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Subcategory Name</TableCell>
                            <TableCell>Queue Name</TableCell>
                            <TableCell>Branch </TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Resperson</TableCell>
                            <TableCell>Sector</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {newData.length > 0 &&
                            newData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.customer}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.queue}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.resperson}</TableCell>
                                    <TableCell>{row.priority}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TableContainer component={Paper} style={{
                display: canvasState === false ? 'none' : 'block',
            }} >
                <Table
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                    id="excelcanvastable"
                    ref={gridRef}
                >
                    <TableHead sx={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell> SI.No</TableCell>
                            <TableCell> Project Name</TableCell>
                            <TableCell>Vendor Name</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Process</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>Subcategory Name</TableCell>
                            <TableCell>Queue Name</TableCell>
                            <TableCell>Branch </TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Resperson</TableCell>
                            <TableCell>Sector</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {filteredDatas.length > 0 &&
                            filteredDatas.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.customer}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.queue}</TableCell>
                                    <TableCell>{row.branch}</TableCell>
                                    <TableCell>{row.unit}</TableCell>
                                    <TableCell>{row.team}</TableCell>
                                    <TableCell>{row.resperson}</TableCell>
                                    <TableCell>{row.priority}</TableCell>
                                    {/* <TableCell colspan={5}>
                                        {row.todo.map((item, i) => (
                                            <Grid container spacing={1} key={i}>
                                                <Grid item md={0.2} sm={0.2} xs={0.2}>
                                                    {i + 1}. &ensp;
                                                </Grid>
                                                <Grid item md={2.5} sm={2.5} xs={2.5}>
                                                    &ensp; {item?.branch}
                                                </Grid>
                                                <Grid item md={2} sm={2} xs={2}>
                                                    {item?.unit}
                                                </Grid>
                                                <Grid item md={2} sm={2} xs={2}>
                                                    {item?.team}
                                                </Grid>
                                                <Grid item md={3.8} sm={3.8} xs={3.8}>
                                                    {item?.resperson}
                                                </Grid>
                                                <Grid item md={1.5} sm={2} xs={2}>
                                                    {item?.priority}
                                                </Grid>
                                            </Grid>
                                        ))}

                                    </TableCell> */}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

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
                            onClick={delProjectcheckbox}
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
                    {fileFormat === "xl" ? <FaFileExcel style={{ fontSize: "80px", color: "green" }} />
                        :
                        <FaFileCsv style={{ fontSize: "80px", color: "green" }} />
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
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6" >{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>ok</Button>
                    </DialogActions>
                </Dialog>
            </Box>








            {/* Bulk Edit Options (alert Boxes and Edit Field)  */}
            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isEditOpenalert}
                    onClose={handleCloseModalertEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: 'orange' }} />
                        <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>Please Select any Row</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color='error'
                            onClick={handleCloseModalertEdit}
                        > OK </Button>
                    </DialogActions>
                </Dialog>
            </Box>


            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isEditAnsCheckalert}
                    onClose={handleCloseAnsCheckEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "70px", color: 'orange' }} />
                        <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>Please Select Same Project for all Row</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" color='error'
                            onClick={handleCloseAnsCheckEdit}
                        > OK </Button>
                    </DialogActions>
                </Dialog>
            </Box>


            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isEditOpencheckbox}
                    onClose={handleCloseBulEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="lg"
                >
                    <Box sx={{ padding: '20px' }}>
                        <>
                            <Typography sx={userStyle.SubHeaderText}>Bulk Edit Alloted Responsible List</Typography>
                            <br /><br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography >Sector</Typography>
                                    <FormControl fullWidth>
                                        <Selects
                                            options={[...dropdowndata, ...[{ label: 'Primary', value: 'Primary' }, { label: 'Secondary', value: 'Secondary' }, { label: 'Tertiary', value: 'Tertiary' }]]}
                                            styles={colourStyles}
                                            value={{ label: newpriorityOverall, value: newpriorityOverall }}
                                            onChange={(e) => {
                                                setNewPriorityOverall(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography>Branch</Typography>
                                    <FormControl fullWidth>
                                        <Selects
                                            options={branches}
                                            styles={colourStyles}
                                            value={{ label: newbranchOverall, value: newbranchOverall }}
                                            onChange={(e) => {
                                                setNewBranchOverall(e.value);
                                                fetchUnitsEditDrop(e.value);
                                                setNewUnitOverall("Select Unit");
                                                setNewTeamOverall("Select Team")
                                                setNewRespersonOverall("Select Responsible Person")
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography>Unit</Typography>
                                    <FormControl fullWidth>

                                        <Selects
                                            options={[...dropdowndata, ...unitstabledata]
                                            }
                                            styles={colourStyles}
                                            value={{ label: newunitOverall, value: newunitOverall }}
                                            onChange={(e) => {
                                                setNewUnitOverall(e.value);
                                                setNewTeamOverall("Select Team")
                                                setNewRespersonOverall("Select Responsible Person")
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography >Team</Typography>
                                    <FormControl fullWidth>

                                        <Selects
                                            options={[...dropdowndata, ...(allTeam
                                                .filter(team => team.unit === newunitOverall && team.branch === newbranchOverall)
                                                .map(sub => ({
                                                    ...sub,
                                                    label: sub.teamname,
                                                    value: sub.teamname
                                                }
                                                )))]
                                            }
                                            styles={colourStyles}
                                            value={{ label: newteamOverall, value: newteamOverall }}
                                            onChange={(e) => {
                                                setNewTeamOverall(e.value);
                                                setNewRespersonOverall("Select Responsible Person")
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography >Responsible Person</Typography>
                                    <FormControl fullWidth>
                                        <Selects
                                            options={[...dropdowndata, ...(allUsersData
                                                .filter(user => user.unit === newunitOverall && user.branch === newbranchOverall && user.team === newteamOverall)
                                                .map(sub => ({
                                                    ...sub,
                                                    label: sub.companyname,
                                                    value: sub.companyname
                                                }
                                                )))]}
                                            styles={colourStyles}
                                            value={{ label: newrespersonOverall, value: newrespersonOverall }}
                                            onChange={(e) => {
                                                setNewRespersonOverall(e.value);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container>
                                <Typography color="error">{errormsgeditOverall}</Typography>
                            </Grid>
                            <br />
                            <br />
                        </>
                    </Box>

                    <DialogActions>
                        <Grid container>
                            <br />
                            <Grid item md={1}></Grid>
                            <Button variant="contained" onClick={handleBulkOverAllFiledCheck}>Update</Button>
                            <Grid item md={1}></Grid>
                            <Button sx={userStyle.btncancel} onClick={handleCloseBulEdit} >Cancel</Button>
                        </Grid>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>

    );
}

export default Allottedresponsiblelist;