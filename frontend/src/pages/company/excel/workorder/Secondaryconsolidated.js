import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Dialog, Select, Checkbox, TableCell, TableRow, MenuItem, TableBody, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle, colourStyles, colourStylesEdit } from "../../../../pageStyle";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import { AuthContext, UserRoleAccessContext } from '../../../../context/Appcontext';
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../../components/Export";
import { useReactToPrint } from "react-to-print";
import moment from 'moment-timezone';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import 'jspdf-autotable';
import jsPDF from "jspdf";
import axios from "axios";
import ImageIcon from '@mui/icons-material/Image';
import { handleApiError } from "../../../../components/Errorhandling";
import html2canvas from 'html2canvas';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Selects from "react-select";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { SERVICE } from "../../../../services/Baseservice";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import CircularProgress, { circularProgressClasses, } from '@mui/material/CircularProgress';


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


function Secondaryconsolidated({ comp, setComp }) {
    const gridRef = useRef(null);
    const { isUserRoleCompare, isUserRoleAccess, allUsersData, allTeam, isAssignBranch } = useContext(UserRoleAccessContext);

    const [excelsmapdata, setExcelsmapdata] = useState([]);
    const [branches, setBranches] = useState([]);
    const [users, setUsers] = useState([]);
    const [excelmapdataresperson, setExcelmapdataresperson] = useState([]);
    const [unitstabledata, setUnitstabledata] = useState([]);
    const [isLoader, setIsLoader] = useState(false);

    const [pagemap, setPagemap] = useState(1);
    const [pageSizeMap, setPageSizeMap] = useState(1);

    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const dropdowndata = [{ label: 'NOT FOR US', value: 'NOT FOR US' }, { label: 'OTHER-NFU', value: 'OTHER-NFU' }, { label: 'OTHER', value: 'OTHER' }, { label: 'WEB-NFU', value: 'WEB-NFU' }]
    const { auth } = useContext(AuthContext);

    const [todoscheck, setTodoscheck] = useState([]);
    const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
    const [newbranch, setNewBranch] = useState("Select Branch");
    const [newunit, setNewUnit] = useState("Select Unit");
    const [newteam, setNewTeam] = useState("Select Team");
    const [newresperson, setNewResperson] = useState("Select Responsible Person");
    const [newpriority, setNewPriority] = useState("Select Sector");

    const [newbranchedit, setNewBranchedit] = useState("Select Branch");
    const [newunitedit, setNewUnitedit] = useState("Select Unit");
    const [newteamedit, setNewTeamedit] = useState("Select Team");
    const [newrespersonedit, setNewRespersonedit] = useState("Select Responsible Person");
    const [newpriorityedit, setNewPriorityedit] = useState("Select Sector");
    const [errormsgedit, seterrormsgedit] = useState("");
    const [errormsgedittodo, seterrormsgedittodo] = useState("");
    // Edit model
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };



    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
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

    const handleSubmitSelectedcancel = (e) => {
        e.preventDefault();
        setSelectedRows([]);
        setSelectAll(false);
        setNewcheckBranch("Select Branch");
        setNewcheckUnit("Select Unit");
        setNewcheckTeam("Select Team");
        setNewcheckResperson("Select Responsible Person");
        setNewcheckPriority("Select Sector");
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Cleared Successfully"}</p>
            </>
        );
        handleClickOpenerr();
    }

    //overall selected check box functionality todo list
    const [newcheckbranch, setNewcheckBranch] = useState("Select Branch");
    const [newcheckunit, setNewcheckUnit] = useState("Select Unit");
    const [newcheckteam, setNewcheckTeam] = useState("Select Team");
    const [newcheckresperson, setNewcheckResperson] = useState("Select Responsible Person");
    const [newcheckpriority, setNewcheckPriority] = useState("Select Sector");
    const [errormsgeditcheck, seterrormsgeditcheck] = useState("");
    const [exceledit, setExceledit] = useState({
        customer: "", process: "", branch: "", unit: "", team: "", updateby: ""

    });
    // get single row to edit....
    const getCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            setExceledit(res?.data?.sexcelmaprespersondata);
            setTodoscheck(res?.data?.sexcelmaprespersondata?.todo);
            setNewBranch("Select Branch");
            setNewUnit("Select Unit");
            setNewTeam("Select Team");
            setNewResperson("Select Responsible Person");
            setNewPriority("Select Sector");
            seterrormsgedit("")
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}

    };

    const [deleteAlloted, setDeleteAllotted] = useState([])
    //set function to get particular row
    const rowData = async (id, name) => {
        try {
            let res = await axios.get(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            let answer = res?.data?.sexcelmaprespersondata?.todo.filter(data => data.priority);
            let ans = answer.length > 0 && answer.filter((item) => item.priority != "Secondary");
            const secPresent = answer.length > 0 && answer.filter((item) => item.priority === "Secondary");
            if (secPresent.length > 0) {
                handleClickOpen();
                setDeleteAllotted(res?.data?.sexcelmaprespersondata);
            }
            else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{"There is no Secondary Priority Queue Allotted"}</p>
                    </>
                );
                handleClickOpenerr();

            }

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    // Alert delete popup
    let projectid = deleteAlloted._id;
    const delProject = async () => {
        try {
            let answer = deleteAlloted?.todo.filter(data => data.priority);
            let ans = answer.length > 0 && answer.filter((item) => item.priority != "Secondary");
            const secPresent = answer.length > 0 && answer.filter((item) => item.priority === "Secondary");

            if (secPresent.length > 0) {
                const response = await axios.put(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${projectid}`, {
                    todo: ans,
                });
                NotificationManager.success('Successfully Added 👍', '', 2000);
                handleCloseMod();

            }
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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

    const [onChangeBranchEdit, setOnChangeBranchEdit] = useState("");

    const editSubmit = (e) => {
        e.preventDefault();
        // let answer = deleteAlloted?.todo.filter(data => data.priority);
        let ans = todoscheck.length > 0 && todoscheck.filter((item) => item.priority != "Secondary");
        const isDasdasBranchPresent = ans.some(data => data.branch === onChangeBranchEdit);
        if (isDasdasBranchPresent === true) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Branch Name is already assigned"}</p>
                </>
            );
            handleClickOpenerr();

        }
        else if (todoscheck.length > 0) {
            sendRequestEdit();
        }


    }
    let updateby = exceledit.updatedby;
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
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        todo: todoscheck,
                        date: String(new Date()),
                    },
                ],
            })
            handleCloseModEdit();
            await fetchExcelmapdata();fetchExcelmappeddata();
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    // get all Excels
    const fetchExcelmappeddata = async () => {
        try {
            let res_branch = await axios.get(SERVICE.EXCELMAPDATA, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setExcelsmapdata(res_branch?.data?.excelmapdatas);
            setIsLoader(true);
        } catch (err) {setIsLoader(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }



    // get all Excelsmapdatas
    const fetchExcelmapdata = async () => {
        try {
            let res_branch_mapdata = await axios.get(SERVICE.EXCELMAPDATARESPERSON, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            setExcelmapdataresperson(res_branch_mapdata?.data?.excelmaprespersondatas);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }


    // get all branches
    const fetchBranch = async () => {
            let res_branch = isAssignBranch?.map(data => ({
                label: data.branch,
                value: data.branch,
              })).filter((item, index, self) => {
                return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
              })
            setBranches([...dropdowndata, ...res_branch])
    }

    // get all units
    const fetchUnits = async (branch) => {
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

    const [state3, setState3] = useState([]);

    const [getfilterdata, setfilterdata] = useState([]);


    const getfilterdatas = () => {
        const filteredData = excelsmapdata?.filter(
            (value, index, self) =>
                self.findIndex(
                    (v) => v.customer === value.customer && v.process === value.process
                ) === index
        );
        setfilterdata(filteredData)
    }

    useEffect(() => {
        getfilterdatas()
    }, [excelsmapdata])

    const compareStates = () => {
        const result = getfilterdata?.filter((item2) =>
            !excelmapdataresperson.some((item1) => item1.customer === item2.customer && item1.process === item2.process)
        );

        setState3(result);
    };



    useEffect(() => {
        compareStates()
    }, [getfilterdata])

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    const fetchUsers = async() =>{
        setUsers(allUsersData);
        }

    useEffect(() => {
        fetchExcelmapdata();
        fetchBranch();
        fetchUsers();
        fetchExcelmappeddata();
    }, [])


    const [tableDataTertiary, setTableDataTertiary] = useState([]);

    const fetchTertiaryList = async () => {
        try {
            let res = await axios.get(SERVICE.WITHOUT_SECONDARY_CONSOLIDATED, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });

            setTableDataTertiary(res?.data?.matchedData);
            setIsLoader(true)

        } catch (err) {setIsLoader(true);handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    //sorting for unalloted list table
    let newdate = new Date();
    const sendRequestindexSelected = async (index) => {

        excelmapdataresperson.forEach(async (item, i) => {
            const newTodocheck = {
                branch: newcheckbranch,
                unit: newcheckunit === "Select Unit" ? "unallotted" : newcheckunit,
                team: newcheckteam === "Select Team" ? "unallotted" : newcheckteam,
                resperson: newcheckresperson === "Select Responsible Person" ? "unallotted" : newcheckresperson,
                priority: "Secondary",
            };
            if (selectedRows.includes(item._id)) {
                const isDasdasBranchPresent = item.todo.some(data => data.branch === newcheckbranch);
                const answer = item.todo.filter(data => data.priority === "Secondary")
                const todoanswer = item.todo.map((data) => {
                    if (data.priority === "Secondary") {
                        data.branch = newcheckbranch === "Select Branch" ? data.branch : newcheckbranch
                        data.unit = newcheckunit === "Select Unit" ? "unallotted" : newcheckunit
                        data.team = newcheckteam === "Select Team" ? "unallotted" : newcheckteam
                        data.resperson = newcheckresperson === "Select Responsible Person" ? "unallotted" : newcheckresperson
                        data.priority = "Secondary"
                    }
                    return data
                });

                if (isDasdasBranchPresent === false && answer.length < 1) {
                    try {
                        const response = await axios.put(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${item._id}`, {
                            todo: [...item.todo, newTodocheck],
                        });
                        NotificationManager.success('Successfully Added 👍', '', 2000);
                        setSelectedRows([]);
                        setSelectAll(false);

                    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}

                }
                if (answer.length > 0) {
                    try {
                        const response = await axios.put(`${SERVICE.EXCELMAPDATARESPERSON_SINGLE}/${item._id}`, {
                            todo: todoanswer,
                        });
                        NotificationManager.success('Successfully Added 👍', '', 2000);
                        setSelectedRows([]);
                        setSelectAll(false);

                    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}

                }
                else if (isDasdasBranchPresent === true) {
                    setShowAlert(
                        <>
                            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                            <p style={{ fontSize: "20px", fontWeight: 900 }}>
                                {"Please Choose Different Branch"}
                            </p>
                        </>
                    );
                    handleClickOpenerr();

                }
            }

        });
        setComp("updated")

    }

    const handleSubmitSelected = (e) => {
        e.preventDefault();
        if (selectedRows.length <= 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Any Row"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (newcheckbranch === "Select Branch") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Branch "}
                    </p>
                </>
            );
            handleClickOpenerr();

        }
        else {
            sendRequestindexSelected();
        }
    }


    const newData = tableDataTertiary.flatMap((item) => ({
        project: item.project,
        vendor: item.vendor,
        customer: item.customer,
        process: item.process,
        category: item.category,
        subcategory: item.subcategory,
        queue: item.queue,
        branch: (item.todo)?.map((item, i) => `${i + 1 + ". "}` + " " + item.branch).toString(),
        unit: (item.todo)?.map((item, i) => `${i + 1 + ". "}` + " " + item.unit).toString(),
        team: (item.todo)?.map((item, i) => `${i + 1 + ". "}` + " " + item.team).toString(),
        resperson: (item.todo)?.map((item, i) => `${i + 1 + ". "}` + " " + item.resperson).toString(),
        priority: (item.todo)?.map((item, i) => `${i + 1 + ". "}` + " " + item.priority).toString(),
        points: item.points
    }));




    const [dropdownValues, setDropdownValues] = useState([]);
    //UnAlloted queue list
    const checkunallot = newData?.map((item, index) => ({
        ...item,
        sno: index + 1,
        project: item.project,
        vendor: item.vendor,
        customer: item.customer,
        process: item.process,
        category: item.category,
        subcategory: item.subcategory,
        queue: item.queue,
        branch: item.branch,
        unit: item.unit,
        team: item.team,
        resperson: item.resperson,
        priority: item.priority,
        points: item.points

    }));



    const [serial, setSerial] = useState([])
    const addSerialNumbernewdata = () => {
        const itemsWithSerialNumber = newData?.map((item, index) => ({ ...item, sno: index + 1 }));
        setSerial(itemsWithSerialNumber);
    }


    useEffect(() => {
        addSerialNumbernewdata();
        fetchTertiaryList();
    }, [tableDataTertiary])

    //pdf....
    const columns = [
        { title: "Sno", field: "serialNumber" },
        { title: "Project Name", field: "project" },
        { title: "Vendor Name", field: "vendor" },
        { title: "Customer", field: "customer" },
        { title: "Process", field: "process" },
        { title: "Category Name", field: "category" },
        { title: "Subcategory Name", field: "subcategory" },
        { title: "Queue Name", field: "queue" },
        { title: "Branch", field: "branches" },
        { title: "Unit", field: "units" },
        { title: "Team", field: "teams" },
        { title: "Resperson", field: "respersons" },
        { title: "sector", field: "priorities" },
        { title: "points", field: "points" },

    ];    const handleCaptureImage = () => {
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
            link.download = "Without_Secondary_Consolidated_WorkOrder.png";
            link.click();
        });
    };
    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 6, // Set the font size to 10
            },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: filteredDataMap,
        });
        doc.save("Without_Secondary_Consolidated_WorkOrder.pdf");
    };

    // Excel
    const fileName = "Without_Secondary_Consolidated_WorkOrder";

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Without_Secondary_Consolidated_WorkOrder",
        pageStyle: "print",
    });
    const [itemsmap, setItemsMap] = useState([]);

    const addSerialNumberMap = () => {
        const itemsWithSerialNumber = tableDataTertiary?.map((item, index) => ({ ...item, serialNumber: index + 1 ,
            branches : (item.todo)?.map((item, i) => `${i + 1 + ". "}` + " " + item.branch).toString(),
            units : (item.todo)?.map((item, i) => `${i + 1 + ". "}` + " " + item.unit).toString(),
            teams : (item.todo)?.map((item, i) => `${i + 1 + ". "}` + " " + item.team).toString(),
            respersons : (item.todo)?.map((item, i) => `${i + 1 + ". "}` + " " + item.resperson).toString(),
            priorities : (item.todo)?.map((item, i) => `${i + 1 + ". "}` + " " + item.priority).toString(),
        }));
        setItemsMap(itemsWithSerialNumber);
    }


    useEffect(() => {
        addSerialNumberMap();
    }, [tableDataTertiary])

    //sorting for unalloted list table

    //table sorting
    const [sortingmap, setSortingMap] = useState({ column: '', direction: '' });

    const handleSortingMap = (column) => {
        const direction = sortingmap.column === column && sortingmap.direction === 'asc' ? 'desc' : 'asc';
        setSortingMap({ column, direction });
    };

    const sortedDataMap = itemsmap.sort((a, b) => {
        if (sortingmap.direction === 'asc') {
            return a[sortingmap.column] > b[sortingmap.column] ? 1 : -1;
        } else if (sortingmap.direction === 'desc') {
            return a[sortingmap.column] < b[sortingmap.column] ? 1 : -1;
        }
        return 0;
    });

    const renderSortingIconMap = (column) => {
        if (sortingmap.column !== column) {
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
        } else if (sortingmap.direction === 'asc') {
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

    //Datatable
    const handlePageChangeMap = (newPage) => {
        setPagemap(newPage);
    };

    const handlePageSizeChangeMap = (event) => {
        setPageSizeMap(Number(event.target.value));
        setPagemap(1);
    };


    //datatable....
    const [searchQueryMap, setSearchQueryMap] = useState("");
    const handleSearchChangeMap = (event) => {

        setSearchQueryMap(event.target.value);
        setPagemap(1);
    };

    // Split the search query into individual terms
    const searchOverTerms = searchQueryMap.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatasmap = itemsmap?.filter((item) => {
        return searchOverTerms.every((term) =>
            Object.values(item).join(" ").toLowerCase().includes(term)
        );
    });

    const filteredDataMap = filteredDatasmap?.slice((pagemap - 1) * pageSizeMap, pagemap * pageSizeMap);

    const totalPagesmap = Math.ceil(filteredDatasmap?.length / pageSizeMap);

    const visiblePagesmap = Math.min(totalPagesmap, 3);

    const firstVisiblePagemap = Math.max(1, pagemap - 1);
    const lastVisiblePagemap = Math.min(firstVisiblePagemap + visiblePagesmap - 1, totalPagesmap);

    const pageNumbersmap = [];

    const indexOfLastItemmap = pagemap * pageSizeMap;
    const indexOfFirstItemmap = indexOfLastItemmap - pageSizeMap;

    for (let i = firstVisiblePagemap; i <= lastVisiblePagemap; i++) {
        pageNumbersmap.push(i);
    }

    const handleCheckboxChange = (id) => {

        let updatedSelectedRows;
        if (selectedRows.includes(id)) {
            updatedSelectedRows = selectedRows.filter((selectedId) => selectedId !== id);
        } else {
            updatedSelectedRows = [...selectedRows, id];
        }

        setSelectedRows(updatedSelectedRows);
        // Update the "Select All" checkbox based on whether all rows are selected
        setSelectAll(updatedSelectedRows.length === filteredDataMap.length);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([]);
            setSelectAll(false);
        } else {
            const allRowIds = filteredDataMap.map((row) => row._id);
            setSelectedRows(allRowIds);
            setSelectAll(true);
        }
    };


    return (
        <Box>
            <Box sx={userStyle.container}>
                <Grid container >
                    <Grid item md={8} xs={12}>
                        <Typography sx={userStyle.SubHeaderText}>Without Secondary Consolidated work Order </Typography>
                        <NotificationContainer />
                    </Grid>
                </Grid>

                <br />
                <Grid container spacing={2}>
                    <Grid item md={4} xs={12} sm={6} >
                        <Typography>Branch</Typography>
                        <FormControl fullWidth>

                            <Selects
                                options={branches}

                                styles={colourStyles}
                                value={{ label: newcheckbranch, value: newcheckbranch }}
                                onChange={(e) => {

                                    setNewcheckBranch(e.value);
                                    fetchUnits(e.value);
                                    setNewcheckUnit("Select Unit");
                                    setNewcheckTeam("Select Team")
                                    setNewcheckResperson("Select Responsible Person");
                                    setNewcheckPriority("Select Sector");
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={6} >
                        <Typography>Unit</Typography>
                        <FormControl fullWidth>
                            <Selects
                                options={[...dropdowndata, ...unitstabledata]}
                                styles={colourStyles}
                                value={{ label: newcheckunit, value: newcheckunit }}
                                onChange={(e) => {
                                    setNewcheckUnit(e.value);
                                    setNewcheckTeam("Select Team")
                                    setNewcheckResperson("Select Responsible Person");
                                    setNewcheckPriority("Select Sector");
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={6} >
                        <Typography >Team</Typography>
                        <FormControl fullWidth>
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
                                value={{ label: newcheckteam, value: newcheckteam }}
                                onChange={(e) => {
                                    setNewcheckTeam(e.value);
                                    setNewcheckResperson("Select Responsible Person");
                                    setNewcheckPriority("Select Sector");
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={6} >
                        <Typography >Responsible Person</Typography>
                        <FormControl fullWidth>
                            <Selects
                                options={[...dropdowndata, ...(users
                                    .filter(user => user.unit === newcheckunit && user.branch === newcheckbranch && user.team === newcheckteam)
                                    .map(sub => ({
                                        ...sub,
                                        label: sub.companyname,
                                        value: sub.companyname
                                    }
                                    )))]}
                                styles={colourStyles}
                                value={{ label: newcheckresperson, value: newcheckresperson }}
                                onChange={(e) => {
                                    setNewcheckResperson(e.value);
                                    setNewcheckPriority("Select Sector");
                                }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={4} xs={12} sm={6} >
                        <Typography >Sector</Typography>
                        <FormControl fullWidth>
                            <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={"Secondary"}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={2} sm={3.5} xs={6} marginTop={3}>
                        <Button variant="contained" color="warning" onClick={handleSubmitSelected}>Update Selected</Button>
                    </Grid>
                    <Grid item md={1} sm={1.5} xs={3} marginTop={3}>
                        <Button sx={userStyle.btncancel} onClick={handleSubmitSelectedcancel}>CLEAR</Button>

                    </Grid>
                </Grid>
                <Grid container>
                    <Typography color="error">{errormsgeditcheck}</Typography>
                </Grid>
                <br /><br />
                <br /><br />
                <Grid container sx={{ justifyContent: "center" }}>
                    <Grid>
                        {isUserRoleCompare?.includes("excelsecondaryworkorderlist")
                            && (
                                <>
                                    <ExportXL csvData={filteredDataMap?.map((t, index) => ({
                                        "Sno": index + 1,
                                        "project Name": t.project,
                                        "Vendor Name": t.vendor,
                                        "Customer": t.customer,
                                        "Process": t.process,
                                        "Category Name": t.category,
                                        "Subcategory Name": t.subcategory,
                                        "Queue Name": t.queue,
                                        "Branch": t.branches,
                                        "unit": t.units,
                                        "team": t.teams,
                                        "resperson": t.respersons,
                                        "sector": t.priorities,
                                        "points": t.points,
                                    }))} fileName={fileName} />
                                </>
                            )}
                        {isUserRoleCompare?.includes("csvsecondaryworkorderlist") && (
                            <>
                                <ExportCSV csvData={filteredDataMap?.map((t, index) => ({
                                    "Sno": index + 1,
                                    "project Name": t.project,
                                    "Vendor Name": t.vendor,
                                    "Customer": t.customer,
                                    "Process": t.process,
                                    "Category Name": t.category,
                                    "Subcategory Name": t.subcategory,
                                    "Queue Name": t.queue,
                                    "Branch": t.branches,
                                    "unit": t.units,
                                    "team": t.teams,
                                    "resperson": t.respersons,
                                    "sector": t.priorities,
                                    "points": t.points,
                                }))} fileName={fileName} />
                            </>
                        )}
                        {isUserRoleCompare?.includes("printsecondaryworkorderlist") && (
                            <>
                                <Button sx={userStyle.buttongrp} onClick={handleprint} > &ensp; <FaPrint /> &ensp;Print&ensp;  </Button>
                            </>
                        )}
                        {isUserRoleCompare?.includes("pdfsecondaryworkorderlist") && (
                            <>
                                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()} > <FaFilePdf /> &ensp;Export to PDF&ensp; </Button>
                            </>
                        )}
                        {isUserRoleCompare?.includes("imagesecondaryworkorderlist")
                                            && (
                                                <>
                                                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}> <ImageIcon sx={{ fontSize: "15px" }} />  &ensp;image&ensp; </Button>
                                                </>
                                            )}
                    </Grid>
                </Grid>

                <Grid style={userStyle.dataTablestyle}>
                    <Box >
                        <FormControl >
                            <Typography>Show Entries</Typography>
                            <Select id="pageSizeSelectMap" value={pageSizeMap} onChange={handlePageSizeChangeMap} sx={{ width: "77px" }}>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl fullWidth size="small" >
                            <Typography>Search</Typography>
                            <OutlinedInput
                                id="component-outlined"
                                type="text"
                                value={searchQueryMap}
                                onChange={handleSearchChangeMap}
                            />
                        </FormControl>
                    </Box>
                </Grid>
                {!isLoader ?
                    <>
                        <Box style={{ display: 'flex', justifyContent: 'center' }}>
                            <FacebookCircularProgress />
                        </Box>
                    </>
                    :
                    <>
                        <TableContainer component={Paper} >
                            <Table
                                aria-label="simple table"
                              
                                id="excelcanvastable"
                                ref={gridRef}
                            >
                                <TableHead sx={{ fontWeight: "600", lineHeight: '1.2rem' }}>
                                    <StyledTableRow >
                                        <StyledTableCell>
                                            <Checkbox
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell onClick={() => handleSortingMap('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconMap('serialNumber')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSortingMap('project')}><Box sx={userStyle.tableheadstyle}><Box>Project</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconMap('project')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSortingMap('vendor')}><Box sx={userStyle.tableheadstyle}><Box>Vendor</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconMap('vendor')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSortingMap('customer')}><Box sx={userStyle.tableheadstyle}><Box>Customer</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconMap('customer')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSortingMap('process')}><Box sx={userStyle.tableheadstyle}><Box>Process</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconMap('process')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSortingMap('category')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconMap('category')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSortingMap('subcategory')}><Box sx={userStyle.tableheadstyle}><Box>Subcategory</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconMap('subcategory')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSortingMap('queue')}><Box sx={userStyle.tableheadstyle}><Box>Queue</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconMap('queue')}</Box></Box></StyledTableCell>
                                        <StyledTableCell><Box sx={{ minWidth: '100px', display: 'flex', fontWeight: '550', fontSize: '12px', lineHeight: '1rem', }}><Box>Branch</Box></Box></StyledTableCell>
                                        <StyledTableCell><Box sx={{ minWidth: '100px', display: 'flex', fontWeight: '550', fontSize: '12px', lineHeight: '1rem', }}><Box>Unit</Box></Box></StyledTableCell>
                                        <StyledTableCell><Box sx={{ minWidth: '100px', display: 'flex', fontWeight: '550', fontSize: '12px', lineHeight: '1rem', }}><Box>Team</Box></Box></StyledTableCell>
                                        <StyledTableCell><Box sx={{ minWidth: '200px', display: 'flex', fontWeight: '550', fontSize: '12px', lineHeight: '1rem', }}><Box>Responsible Person</Box></Box></StyledTableCell>
                                        <StyledTableCell><Box sx={{ minWidth: '100px', display: 'flex', fontWeight: '550', fontSize: '12px', lineHeight: '1rem', }}><Box>Sector</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSortingMap('points')}><Box sx={userStyle.tableheadstyle}><Box>Points</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconMap('points')}</Box></Box></StyledTableCell>
                                        <StyledTableCell onClick={() => handleSortingMap('actions')}><Box sx={userStyle.tableheadstyle}><Box>Actions</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconMap('actions')}</Box></Box></StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody align="left">
                                    {filteredDataMap.length > 0 ? (
                                        filteredDataMap?.map((row, indexval) => (
                                            <StyledTableRow key={indexval} sx={{ background: selectedRows.includes(row.id) ? "#1976d22b !important" : "inherit" }}>
                                                <StyledTableCell>
                                                    <Checkbox
                                                        checked={selectedRows.includes(row._id)}
                                                        onChange={() => handleCheckboxChange(row._id)}
                                                    />
                                                </StyledTableCell>
                                                <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                <StyledTableCell>{row.project} </StyledTableCell>
                                                <StyledTableCell>{row.vendor}</StyledTableCell>
                                                <StyledTableCell>{row.customer}</StyledTableCell>
                                                <StyledTableCell>{row.process}</StyledTableCell>
                                                <StyledTableCell>{row.category}</StyledTableCell>
                                                <StyledTableCell>{row.subcategory}</StyledTableCell>
                                                <StyledTableCell>{row.queue}</StyledTableCell>
                                                <StyledTableCell colspan={5}>
                                                    {row.todo.map((item, i) => (
                                                        <Grid container spacing={1} key={i}>
                                                            <Grid item md={0.2} sm={0.2} xs={0.2}>
                                                                {i + 1}. &ensp;
                                                            </Grid>
                                                            <Grid item md={2.5} sm={2.5} xs={2.5}>
                                                                &ensp; {item.branch}
                                                            </Grid>
                                                            <Grid item md={2} sm={2} xs={2}>
                                                                {item.unit}
                                                            </Grid>
                                                            <Grid item md={2} sm={2} xs={2}>
                                                                {item.team}
                                                            </Grid>
                                                            <Grid item md={3.8} sm={3.8} xs={3.8}>
                                                                {item.resperson}
                                                            </Grid>
                                                            <Grid item md={1.5} sm={2} xs={2}>
                                                                {item.priority}
                                                            </Grid>
                                                        </Grid>
                                                    ))}

                                                </StyledTableCell>
                                                <StyledTableCell>{row.points}</StyledTableCell>
                                                <StyledTableCell component="th" scope="row" colSpan={1}>
                                                    <Grid sx={{ display: "flex" }}>
                                                        {isUserRoleCompare?.includes("esecondaryworkorderlist") && (
                                                            <>
                                                                <Button sx={userStyle.buttonedit} onClick={() => {
                                                                    handleClickOpenEdit();
                                                                    getCode(row._id)
                                                                }}>
                                                                    <EditOutlinedIcon style={{ fontsize: "large" }} />
                                                                </Button>
                                                            </>
                                                        )}
                                                        {isUserRoleCompare?.includes("dsecondaryworkorderlist") && (
                                                            <>
                                                                {/* <Button
                                                                    sx={userStyle.buttonedit}
                                                                    onClick={() => {
                                                                        handleClickOpeninfo();
                                                                        getinfoCode(row._id);
                                                                    }}
                                                                >

                                                                    <InfoOutlinedIcon style={{ fontsize: "large" }} />

                                                                </Button> */}
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
                                        ))) : <StyledTableRow> <StyledTableCell colSpan={19} align="center">No Data Available</StyledTableCell> </StyledTableRow>}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box style={userStyle.dataTablestyle}>
                            <Box>
                                Showing  {filteredDataMap.length > 0 ? ((pagemap - 1) * pageSizeMap) + 1 : 0}  to {Math.min(pagemap * pageSizeMap, filteredDatasmap.length)} of {filteredDatasmap.length} entries
                            </Box>

                            <Box>
                                <Button onClick={() => setPagemap(1)} disabled={pagemap === 1} sx={userStyle.paginationbtn}>
                                    <FirstPageIcon />
                                </Button>
                                <Button onClick={() => handlePageChangeMap(pagemap - 1)} disabled={pagemap === 1} sx={userStyle.paginationbtn}>
                                    <NavigateBeforeIcon />
                                </Button>
                                {pageNumbersmap?.map((pageNumber) => (
                                    <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChangeMap(pageNumber)} className={((pagemap)) === pageNumber ? 'active' : ''} disabled={pagemap === pageNumber}>
                                        {pageNumber}
                                    </Button>
                                ))}
                                {lastVisiblePagemap < totalPagesmap && <span>...</span>}
                                <Button onClick={() => handlePageChangeMap(pagemap + 1)} disabled={pagemap === totalPagesmap} sx={userStyle.paginationbtn}>
                                    <NavigateNextIcon />
                                </Button>
                                <Button onClick={() => setPagemap((totalPagesmap))} disabled={pagemap === totalPagesmap} sx={userStyle.paginationbtn}>
                                    <LastPageIcon />
                                </Button>
                            </Box>
                        </Box>
                    </>
                }
                <br />
            </Box>
            <br />

            {/* print layout for UnAlloted Responsible person*/}
            < TableContainer component={Paper} sx={userStyle.printcls} >
                <Table
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                    id="usertable"
                    ref={componentRef}
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
                            <TableCell>Branch</TableCell>
                            <TableCell>Unit </TableCell>
                            <TableCell>Team</TableCell>
                            <TableCell>Responsible Person</TableCell>
                            <TableCell>Sector</TableCell>
                            <TableCell>Points</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {filteredDataMap.length > 0 &&
                            filteredDataMap.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.customer}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.queue}</TableCell>
                                    <TableCell>{(row.todo)?.map((item, i) => `${i + 1 + ". "}` + " " + item.branch).toString()}</TableCell>
                                    <TableCell>{(row.todo)?.map((item, i) => `${i + 1 + ". "}` + " " + item.unit).toString()}</TableCell>
                                    <TableCell>{(row.todo)?.map((item, i) => `${i + 1 + ". "}` + " " + item.team).toString()}</TableCell>
                                    <TableCell>{(row.todo)?.map((item, i) => `${i + 1 + ". "}` + " " + item.resperson).toString()}</TableCell>
                                    <TableCell>{(row.todo)?.map((item, i) => `${i + 1 + ". "}` + " " + item.priority).toString()}</TableCell>
                                    <TableCell>{row.points}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

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
                            <Typography sx={userStyle.HeaderText}> Edit Without Secondary Consolidated Work Order</Typography>
                            <br />
                            <br />
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
                                                                setOnChangeBranchEdit(e.value);
                                                                fetchUnits(e.value);
                                                                setNewUnitedit("Select Unit");
                                                                setNewTeamedit("Select Team")
                                                                setNewRespersonedit("Select Responsible Person")
                                                            }}
                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={2} sm={2} xs={2}>
                                                    <FormControl fullWidth>
                                                        <Selects
                                                            options={[...dropdowndata, ...unitstabledata]}
                                                            styles={colourStylesEdit}
                                                            value={{ label: newunitedit, value: newunitedit }}
                                                            onChange={(e) => {
                                                                setNewUnitedit(e.value);
                                                                setNewTeamedit("Select Team");
                                                                setNewRespersonedit("Select Responsible Person")
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
                                                            options={[...dropdowndata, ...(users
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
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        value={"Secondary"}
                                                        size="small"
                                                    />

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
                                            {item.priority === "Secondary" ? <>
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
                                            </>
                                                : ""}

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
            </Box>
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
                            onClick={(e) => delProject()}
                        > OK </Button>
                    </DialogActions>
                </Dialog>

            </Box>


        </Box>


    );
}

export default Secondaryconsolidated;