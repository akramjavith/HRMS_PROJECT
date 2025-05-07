

import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, OutlinedInput, Dialog, Select, InputLabel, Checkbox, TableCell, TableRow, MenuItem, TableBody, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle, colourStyles, selectDropdownStyles } from "../../../../pageStyle";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import { AuthContext } from '../../../../context/Appcontext';
import { FaPrint, FaFilePdf } from "react-icons/fa";
import { ExportXL, ExportCSV } from "../../../../components/Export";
import { handleApiError } from "../../../../components/Errorhandling";
import { useReactToPrint } from "react-to-print";
import 'jspdf-autotable';
import jsPDF from "jspdf";
import axios from "axios";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { SERVICE } from "../../../../services/Baseservice";
import moment from 'moment-timezone';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import Headtitle from "../../../../components/Headtitle";
import Selects from "react-select";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { UserRoleAccessContext } from '../../../../context/Appcontext';



function Unallotqueuelist() {
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch } = useContext(UserRoleAccessContext);

    const [excels, setExcels] = useState([]);
    const [excelmapdata, setExcelmapdata] = useState([]);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [branchName, setBranchName] = useState("");
    const [unitName, setUnitName] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);
    const [queues, setQueues] = useState([]);
    const [timePointsList, setTimePointsList] = useState([])
    const [openview, setOpenview] = useState(false);

    const [pagemap, setPagemap] = useState(1);
    const [pageSizeMap, setPageSizeMap] = useState(1);

    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [selectedProject, setSelectedProject] = useState("Select Project");
    const [selectedCategory, setSelectedCategory] = useState("Select Category");
    const [selectedSubCategory, setSelectedSubCategory] = useState("Select Subcategory");
    const [selectedQueue, setSelectedQueue] = useState("Select Queue");


    const [exceledit, setExceledit] = useState({
        customer: "", process: "", category: "", subcategory: "", queue: "", time: "", points: "", updateby: ""

    });
    const [getrowid, setRowGetid] = useState("");
    const { auth } = useContext(AuthContext);

    //Delete model
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
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

    // view model
    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
        setExceledit([])
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };

    const [deletedata, setDeletedata] = useState({});

    //get all Time Loints List.
    const fetchAllTimePoints = async () => {
        try {
            let res_queue = await axios.get(SERVICE.TIMEPOINTS, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            setTimePointsList(res_queue?.data?.timepoints)
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const getTimeandPoints = (project, category, subcategory) => {


        const matchingTeams = timePointsList.filter(team => team.project === project && team.category === category && team.subcategory === subcategory);
        if (matchingTeams.length > 0) {
            return matchingTeams[0].time;

        }
    }

    const getPoints = (project, category, subcategory) => {

        const matchingTeams = timePointsList.filter(team => team.project === project && team.category === category && team.subcategory === subcategory);
        if (matchingTeams.length > 0) {
            return matchingTeams[0].points;

        }
    }

    const fetchCategoryDropdowns = async () => {
        try {
            let res_project = await axios.get(SERVICE.CATEGORYEXCEL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });


            setCategories(res_project?.data?.categoryexcel);

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //CHECK BOX SELECTION
    const handleCheckboxChange = (id) => {
        if (selectedRows.includes(id)) {
            // If the row is already selected, remove it from the array
            setSelectedRows(selectedRows.filter((selectedId) => selectedId !== id));
        } else {
            // If the row is not selected, add it to the array
            setSelectedRows([...selectedRows, id]);
        }
    };
    //CHECK BOX CHECKALL SELECTION
    const handleSelectAll = () => {
        if (selectAll) {
            // If "Select All" is checked, unselect all rows
            setSelectedRows([]);
        } else {
            // If "Select All" is not checked, select all rows
            const allRowIds = filteredDatasmap.map((row) => row.id);
            setSelectedRows(allRowIds);
        }
        // Toggle the state of "Select All"
        setSelectAll(!selectAll);
    };


    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ''; // This is required for Chrome support
    };

    useEffect(
        () => {
            const beforeUnloadHandler = (event) => handleBeforeUnload(event);
            window.addEventListener('beforeunload', beforeUnloadHandler);
            return () => {
                window.removeEventListener('beforeunload', beforeUnloadHandler);
            };
        }, [])

    let queueid = deletedata._id;
    const delqueue = async () => {
        try {
            await axios.delete(`${SERVICE.EXCELMAPDATA_SINGLE}/${queueid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            await fetchExcelmapdata();
            handleCloseMod();
            setPage(1);
       } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    // get single row to edit....
    const getCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.EXCELMAPDATA_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            setExceledit(res?.data?.sexcelmapdata);
            setRowGetid(res?.data?.sexcelmapdata);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}

    };

    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.EXCELMAPDATA_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            setExceledit(res?.data?.sexcelmapdata);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}

    };

    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.EXCELMAPDATA_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setExceledit(res?.data?.sexcelmapdata);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get all Excels
    const fetchExcel = async () => {
        try {
            let res_branch = await axios.get(SERVICE.EXCEL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            setExcels((res_branch?.data?.excel[((res_branch?.data?.excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process'));
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    const fetchAllQueueGrp = async () => {
        try {
            let res_queue = await axios.get(SERVICE.QUEUEGROUP, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            const subcatall = [...res_queue?.data?.queuegroups.map((d) => (
                {
                    ...d,
                    label: d.name,
                    value: d.name
                }
            ))];
            setQueues(subcatall)
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get all Excelsmapdatas
    const fetchExcelmapdata = async () => {
        try {
            let res_branch_mapdata = await axios.get(SERVICE.EXCELMAPDATA, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            setExcelmapdata(res_branch_mapdata?.data?.excelmapdatas);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    const setBranchNameval = branchName ? branchName : exceledit.branch
    const setUnitNamesval = unitName ? unitName : exceledit.unit
    const [tableData, setTableData] = useState([]);
    const [state3, setState3] = useState([]);
    const [getfilterdata, setfilterdata] = useState([]);


    const getfilterdatas = () => {
        const filteredData = excels?.filter(
            (value, index, self) =>
                self.findIndex(
                    (v) => v.customer === value.customer && v.process === value.process
                ) === index
        );
        setfilterdata(filteredData)
    }

    useEffect(() => {
        getfilterdatas()
    }, [excels])

    const compareStates = () => {
        const result = getfilterdata?.filter((item2) =>
            !excelmapdata.some((item1) => item1.customer === item2.customer && item1.process === item2.process)
        );

        setState3(result);
    };

    useEffect(() => {
        compareStates()
    }, [getfilterdata])

    useEffect(() => {
        setTableData(state3?.map((item, i) => ({ ...item, category: "", subcategory: "", queue: "", id: i })));
    }, [state3]);

    const updateData = (index, key, value) => {
        const updatedData = tableData?.map((row, i) => {
            if (row.id === index) {
                return { ...row, [key]: value };
            }
            return row;
        });
        setTableData(updatedData);
    };



    const sendRequest = async () => {
        tableData.forEach(async (item) => {
            if (item.category !== "" && item.queue !== "") {
                try {
                    const response = await axios.post(SERVICE.EXCELMAPDATA_CREATE, {
                        project: item.project,
                        vendor: item.vendor,
                        process: item.process,
                        hyperlink: item.hyperlink,
                        customer: item.customer,
                        priority: item.priority,
                        category: item.category,
                        subcategory: item.subcategory == "Please Select Subcategory" || item.subcategory == "" ? "ALL" : item.subcategory,
                        queue: item.queue,
                        count: item.count,
                        tat: item.tat,
                        created: item.created,

                        time: getTimeandPoints(item.project, item.category, item.subcategory ? item.subcategory : "ALL"),
                        points: getPoints(item.project, item.category, item.subcategory ? item.subcategory : "ALL"),
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),

                            },
                        ],
                    });
                   
                    NotificationManager.success('Successfully Added 👍', '', 2000);
                    await fetchExcelmapdata();fetchExcel();
                } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
            }

        });

    }


    const sendRequestIndex = async (index) => {
        tableData.forEach(async (item, i) => {
            if (item.category !== "" && item.queue !== "" && item.id === index) {
                try {
                    const response = await axios.post(SERVICE.EXCELMAPDATA_CREATE, {
                        project: item.project,
                        vendor: item.vendor,
                        process: item.process,
                        hyperlink: item.hyperlink,
                        customer: item.customer,
                        priority: item.priority,
                        category: item.category,
                        subcategory: item.subcategory == "Please Select Subcategory" || item.subcategory == "" ? "ALL" : item.subcategory,
                        queue: item.queue,
                        count: item.count,
                        tat: item.tat,
                        created: item.created,
                        time: getTimeandPoints(item.project, item.category, item.subcategory ? item.subcategory : "ALL"),
                        points: getPoints(item.project, item.category, item.subcategory ? item.subcategory : "ALL"),
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),

                            },
                        ],
                    });
                    // setTableData([])
                    NotificationManager.success('Successfully Added 👍', '', 2000);
                    await fetchExcelmapdata();fetchExcel();
                } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
            }

            else if (item.id === index && (item.category == "" || item.queue == "")) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                        <p style={{ fontSize: '20px', fontWeight: 900 }}>{'please choose All Fields'}</p>
                    </>
                );
                handleClickOpenerr();
            };
        });

    }


    const sendRequestSelected = async () => {
        tableData.forEach(async (item, i) => {
            if (selectedRows.includes(item.id)) {

                try {
                    const response = await axios.post(SERVICE.EXCELMAPDATA_CREATE, {
                        project: item.project,
                        vendor: item.vendor,
                        process: item.process,
                        hyperlink: item.hyperlink,
                        customer: item.customer,
                        priority: item.priority,
                        category: selectedCategory,
                        subcategory: selectedSubCategory === "Select Subcategory" ? "ALL" : selectedSubCategory,
                        queue: selectedQueue,
                        count: item.count,
                        tat: item.tat,
                        created: item.created,
                        time: getTimeandPoints(selectedProject, selectedCategory, selectedSubCategory === "Select Subcategory" ? "ALL" : selectedSubCategory),
                        points: getPoints(selectedProject, selectedCategory, selectedSubCategory === "Select Subcategory" ? "ALL" : selectedSubCategory),
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),

                            },
                        ],
                    });
                    setSelectedRows([]);
                    setSelectAll(false);
                    setSelectedCategory("Select Category");
                    setSelectedSubCategory("Select Subcategory");
                    setSelectedProject("Select Project");
                    setSelectedQueue("Select Queue");
                    NotificationManager.success('Successfully Added 👍', '', 2000);
                    await fetchExcelmapdata();fetchExcel();
                } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
            }


        });

    }


    const handleSubmitSelected = (e) => {
        e.preventDefault();
        let notMatchProject = tableData.filter((item, i) => {
            if (selectedRows.includes(item.id) && item.project != selectedProject) {
                return item
            }

        })

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
        } else if (selectedProject === "" || selectedProject === "Select Project") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Project Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedCategory === "" || selectedCategory === "Select Category") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Category Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else if (selectedQueue === "" || selectedQueue === "Select Queue") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Queue Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (notMatchProject.length > 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <br />
                    <span > You have selected the </span>
                    <span style={{ fontSize: "20px", fontWeight: 900 }}>  {notMatchProject.map(item => item.project + " ")}</span>
                    <span>project , please remove this from selected row </span>
                  
                </>
            );
            handleClickOpenerr();
        }
        else {
            sendRequestSelected();
        }
    }

    const handleSubmitSelectedcancel = (e) => {
        e.preventDefault();
        setSelectedRows([]);
        setSelectAll(false);
        setSelectedCategory("Select Category");
        setSelectedSubCategory("Select Subcategory");
        setSelectedProject("Select Project");
        setSelectedQueue("Select Queue");
    }

    let updateby = exceledit?.updatedby;
    let newdate = new Date();

    //edit post call
    let excelmap_id = getrowid._id
    const sendRequestEdit = async () => {
        try {
            let excelmap = await axios.put(`${SERVICE.EXCELMAPDATA_SINGLE}/${excelmap_id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                project: String(exceledit.project),
                vendor: String(exceledit.vendor),
                customer: String(exceledit.customer),
                process: String(exceledit.process),
                category: String(exceledit.category),
                subcategory: String(exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory),
                queue: String(exceledit.queue),
                time: getTimeandPoints(exceledit.project, exceledit.category, exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory) ? getTimeandPoints(exceledit.project, exceledit.category, exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory) : "",
                points: getPoints(exceledit.project, exceledit.category, exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory) ? getPoints(exceledit.project, exceledit.category, exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory) : "",
                username: String(isUserRoleAccess.companyname),
                updatedate: String(moment(newdate).format('DD-MM-YYYY hh:mm:ss a')),
                updatedby: [
                    ...updateby, {
                        name: String(isUserRoleAccess.companyname),
                        category: String(exceledit.category),
                        subcategory: String(exceledit.subcategory),
                        queue: String(exceledit.queue),
                        date: String(new Date()),
                    },
                ],
            })
            setExceledit(excelmap.data);
            handleCloseModEdit();
            await fetchExcelmapdata();fetchExcel();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }

    const editSubmit = (e) => {
        e.preventDefault();
        if (exceledit.category === "" || exceledit.category === "Please Select Category") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Category Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (exceledit.queue === "" || exceledit.queue === "Please Select Queue") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Queue Name"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            sendRequestEdit();
        }
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

    useEffect(() => {
        fetchBranchDropdwons();
        fetchUnitDropdwons();
        fetchTeamDropdwons();
    }, [isEditOpen, setBranchNameval, setUnitNamesval])


    useEffect(() => {
        fetchExcelmapdata();
        fetchBranch();
        fetchteams();
        fetchUnits();
        getusername();
        fetchBranch();
        fetchExcel();
    }, [])

    useEffect(() => {
        fetchCategoryDropdowns();
        fetchSubCategoryDropdowns();
        fetchAllQueueGrp();
        fetchAllTimePoints();

    }, [])

    useEffect(() => {
        fetchCategoryDropdowns();
        fetchSubCategoryDropdowns();
        fetchAllQueueGrp();
        fetchAllTimePoints();

    }, [exceledit])

    //UnAlloted queue list
    const checkunallot = tableData?.map((item, index) => ({
        ...item,
        sno: index + 1,
        project: item.project,
        vendor: item.vendor,
        customer: item.customer,
        process: item.process,
        category: "",
        subcategory: "",
        queue: "",
        time: "",
        points: ""

    }));

    //pdf....
    const columns = [
        { title: "Sno", field: "sno" },
        { title: "Project Name", field: "project" },
        { title: "Vendor Name", field: "vendor" },
        { title: "Customer", field: "customer" },
        { title: "Process", field: "process" },
        { title: "Category Name", field: "category" },
        { title: "Subcategory Name", field: "subcategory" },
        { title: "Time", field: "time" },
        { title: "Points", field: "points" },

    ];
    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 6, // Set the font size to 10
            },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: checkunallot,
        });
        doc.save("unalloted.pdf");
    };

    const [excelData, setExceldata] = useState("");

    // Excel
    const fileName = "UnAllotted Queue";

    const getexcelDatas = async () => {
            var data = checkunallot?.map((t, index) => ({
                "Sno": index + 1,
                "project Name": t.project,
                "Vendor Name": t.vendor,
                "Customer": t.customer,
                "Process": t.process,
                "Category Name": t.category,
                "Subcategory Name": t.subcategory,
                "Time": t.time,
                "Points": t.points,
            }));
            setExceldata(data);
    };

    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Unalloted Queue List ",
        pageStyle: "print",
    });


    //Alloted Queue list
    const checkallotqueue = excelmapdata?.map((item, index) => ({
        ...item,
        sno: index + 1,
        project: item.project,
        vendor: item.vendor,
        customer: item.customer,
        process: item.process,
        category: item.category,
        subcategory: item.subcategory,
        queue: item.queue,
        time: item.time,
        points: item.points

    }));

    const allotcolumns = [
        { title: "Sno", field: "sno" },
        { title: "Project Name", field: "project" },
        { title: "Vendor Name", field: "vendor" },
        { title: "Customer", field: "customer" },
        { title: "Process", field: "process" },
        { title: "Category Name", field: "category" },
        { title: "Subcategory Name", field: "subcategory" },
        { title: "Queue Name", field: "queue" },
        { title: "Time", field: "time" },
        { title: "Points", field: "points" },

    ];

    const downloadPdfAllot = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 6, // Set the font size to 10
            },
            columns: allotcolumns.map((col) => ({ ...col, dataKey: col.field })),
            body: checkallotqueue,
        });
        doc.save("Alloted Queue.pdf");
    }

    const [excelDataAllot, setExceldataAllot] = useState("");


    const fileNameAllot = "Allotted Queue";

    const getexcelDatasAllot = async () => {

            var data = checkallotqueue?.map((t, index) => ({
                "Sno": index + 1,
                "project Name": t.project,
                "Vendor Name": t.vendor,
                "Customer": t.customer,
                "Process": t.process,
                "Category Name": t.category,
                "Subcategory Name": t.subcategory,
                "Queue Name": t.queue,
                "Time": t.time,
                "Points": t.points,
            }));
            setExceldataAllot(data);
    };

    //print...
    const componentRefAllot = useRef();
    const handleprintAllot = useReactToPrint({
        content: () => componentRefAllot.current,
        documentTitle: "Alloted Queue List ",
        pageStyle: "print",
    })

    const [items, setItems] = useState([]);
    const addSerialNumber = () => {
        const itemsWithSerialNumber = excelmapdata?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItems(itemsWithSerialNumber);
    }

    const [itemsmap, setItemsMap] = useState([]);

    const addSerialNumberMap = () => {
        const itemsWithSerialNumber = tableData?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
        setItemsMap(itemsWithSerialNumber);
    }

    useEffect(() => {
        addSerialNumber();
        addSerialNumberMap();
    }, [tableData, excelmapdata])


    //table sorting
    const [sorting, setSorting] = useState({ column: '', direction: '' });

    const handleSorting = (column) => {
        const direction = sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc';
        setSorting({ column, direction });
    };


    const sortedData = items.sort((a, b) => {
        if (sorting.direction === 'asc') {
            return a[sorting.column] > b[sorting.column] ? 1 : -1;
        } else if (sorting.direction === 'desc') {
            return a[sorting.column] < b[sorting.column] ? 1 : -1;
        }
        return 0;
    });


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

    const filteredDatas = items.filter((item) =>
        Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

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

    //datatable for unalloted list

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

    const filteredDatasmap = itemsmap.filter((item) =>
        Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchQueryMap.toLowerCase())
        )
    );

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

    useEffect(() => {
        getexcelDatas()
    }, [tableData, state3])


    useEffect(() => {
        getexcelDatasAllot()
    }, [excelmapdata, exceledit])


    return (
        <Box>
            <Headtitle title={'Unalloted List'} />
            {
                isUserRoleCompare?.includes("lunallottedqueuelist") && (
                    <>
                        <Box sx={userStyle.container}>

                            <Grid container spacing={2}>
                                <Grid item md={8} sm={8} xs={12}>
                                    <Typography sx={userStyle.HeaderText}> UnAllotted Queue List </Typography>
                                    <NotificationContainer />
                                </Grid>

                                <Grid item md={4} sm={4} xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                        <Button variant="contained" onClick={sendRequest}>Update All</Button>
                                    </Box>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} sm={6} xs={12}>
                                    <Typography> Project</Typography>
                                    <Selects
                                        options={Array.from(new Set(tableData
                                            .map(pro => pro.project)
                                        ))
                                            .map(project => ({
                                                label: project,
                                                value: project
                                            }))}
                                        styles={selectDropdownStyles}
                                        value={{ label: selectedProject, value: setSelectedProject }}
                                        onChange={(e) => {
                                            setSelectedProject(e.value); setSelectedCategory("Select Category")
                                        }
                                        }
                                    />
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    <Typography> Category</Typography>
                                    <Selects
                                        options={categories
                                            .filter(category => category.project === selectedProject)
                                            .map(sub => ({
                                                ...sub,
                                                label: sub.name,
                                                value: sub.name
                                            }
                                            ))
                                        }
                                        styles={selectDropdownStyles}
                                        value={{ label: selectedCategory, value: setSelectedCategory }}
                                        onChange={(e) => {
                                            setSelectedCategory(e.value); setSelectedSubCategory("Select Subcategory"); setSelectedQueue("Select Queue")
                                        }
                                        }
                                    />
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    <Typography>Sub Category</Typography>
                                    <Selects
                                        options={Array.from(new Set(
                                            [...(timePointsList
                                                .filter(time => time.category === selectedCategory)
                                                .map(sub => sub.subcategory)
                                            ), ("ALL")]
                                        ))
                                            .map(timevalue => ({
                                                label: timevalue,
                                                value: timevalue
                                            }))
                                        }
                                        styles={selectDropdownStyles}
                                        value={{ label: selectedSubCategory, value: setSelectedSubCategory }}
                                        onChange={(e) =>
                                            setSelectedSubCategory(e.value)
                                        }
                                    />
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    <Typography> Queue</Typography>
                                    <Selects
                                        options={Array.from(new Set(queues
                                            .filter(queue => queue.categories?.includes(selectedCategory))
                                            .map(sub => sub.queuename)
                                        ))
                                            .map(queuename => ({
                                                label: queuename,
                                                value: queuename
                                            }))}
                                        styles={selectDropdownStyles}
                                        value={{ label: selectedQueue, value: setSelectedQueue }}
                                        onChange={(e) =>
                                            setSelectedQueue(e.value)
                                        }
                                    />
                                </Grid>
                                <Grid item md={2} sm={6} xs={12} >
                                    <Typography> Time</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        size="small"
                                        readOnly
                                        value={getTimeandPoints(selectedProject, selectedCategory, selectedSubCategory !== "Select Subcategory" ? selectedSubCategory : "ALL") ? getTimeandPoints(selectedProject, selectedCategory, selectedSubCategory !== "Select Subcategory" ? selectedSubCategory : "ALL") : '00:00:00'}
                                    />
                                </Grid>
                                <Grid item md={2} sm={6} xs={12} >
                                    <Typography> Points</Typography>
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        size="small"
                                        readOnly
                                        value={getPoints(selectedProject, selectedCategory, selectedSubCategory !== "Select Subcategory" ? selectedSubCategory : "ALL") ? getPoints(selectedProject, selectedCategory, selectedSubCategory !== "Select Subcategory" ? selectedSubCategory : "ALL") : Number(0).toFixed(4)}
                                    />
                                </Grid>
                                <Grid item md={2} sm={6} xs={12} marginTop={3}>
                                    <Button variant="contained" color="warning" onClick={handleSubmitSelected}>Update Selected</Button>

                                </Grid>
                                <Grid item md={2} sm={6} xs={12} marginTop={3}>
                                    <Button sx={userStyle.btncancel} onClick={handleSubmitSelectedcancel}>CLEAR</Button>

                                </Grid>
                            </Grid>
                            <br /><br />
                            <Grid container sx={{ justifyContent: "center" }}>
                                <Grid>
                                    {isUserRoleCompare?.includes("excelunallottedqueuelist") && (
                                        <>
                                            <ExportXL csvData={excelData} fileName={fileName} />
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvunallottedqueuelist") && (
                                        <>
                                            <ExportCSV csvData={excelData} fileName={fileName} />
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printunallottedqueuelist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={handleprint}
                                            >
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfunallottedqueuelist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => downloadPdf()}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                </Grid>
                            </Grid>

                            <Grid style={userStyle.dataTablestyle}>
                                <Box>
                                    <Select id="pageSizeSelectMap" value={pageSizeMap} onChange={handlePageSizeChangeMap} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={(tableData?.length)}>All</MenuItem>
                                    </Select>
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

                            <TableContainer >
                                <Table
                                    aria-label="simple table"
                                    id="excel"
                                    sx={{ overflow: 'auto' }}
                                >
                                    <TableHead sx={{ fontWeight: "600" }}>
                                        <StyledTableRow>
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
                                            <StyledTableCell onClick={() => handleSortingMap('time')}><Box sx={userStyle.tableheadstyle}><Box>Time</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconMap('time')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSortingMap('points')}><Box sx={userStyle.tableheadstyle}><Box>Points</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconMap('points')}</Box></Box></StyledTableCell>
                                            <StyledTableCell >Action</StyledTableCell>

                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody align="left">
                                        {filteredDataMap.length > 0 ? (
                                            filteredDataMap?.map((row, index) => {
                                                return (
                                                    <StyledTableRow key={index} sx={{ background: selectedRows.includes(row.id) ? "#1976d22b !important" : "inherit" }}>
                                                        <StyledTableCell>
                                                            <Checkbox
                                                                checked={selectedRows.includes(row.id)}
                                                                onChange={() => handleCheckboxChange(row.id)}
                                                            />
                                                        </StyledTableCell>
                                                        <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                        <StyledTableCell>{row.project} </StyledTableCell>
                                                        <StyledTableCell>{row.vendor}</StyledTableCell>
                                                        <StyledTableCell>{row.customer}</StyledTableCell>
                                                        <StyledTableCell>{row.process}</StyledTableCell>
                                                        <StyledTableCell >
                                                            <FormControl sx={{ minWidth: '250px' }} fullWidth>

                                                                <Selects
                                                                    options={selectedRows.includes(row.id) ? [] : categories
                                                                        .filter(category => category.project === row.project)
                                                                        .map(sub => ({

                                                                            ...sub,
                                                                            label: sub.name,
                                                                            value: sub.name
                                                                        }
                                                                        ))
                                                                    }

                                                                    styles={{
                                                                        menuList: styles => ({
                                                                            ...styles,
                                                                            background: 'white',
                                                                            maxHeight: '200px',
                                                                            width: '100%',
                                                                            boxShadow: '0px 0px 5px #00000052',
                                                                            position: selectedRows.includes(row.id) ? 'absolute' : 'relative',
                                                                        }),
                                                                        // Set a higher z-index for the dropdown menu
                                                                        menu: (provided) => ({
                                                                            ...provided,
                                                                            zIndex: 9999,// Adjust the value as needed
                                                                            position: selectedRows.includes(row.id) ? 'absolute' : 'relative',

                                                                        }),

                                                                    }}

                                                                    value={{ label: row.category, value: row.category }}
                                                                    onChange={(e) =>
                                                                        updateData(row.id, "category", e.value)
                                                                    }

                                                                />

                                                            </FormControl>
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            <FormControl sx={{ minWidth: '250px' }} fullWidth>

                                                                <Selects
                                                                    options={selectedRows.includes(row.id) ? [] : Array.from(new Set(
                                                                        [...(timePointsList
                                                                            .filter(time => time.category === row.category)
                                                                            .map(sub => sub.subcategory)
                                                                        ), ("ALL")]
                                                                    ))
                                                                        .map(timevalue => ({
                                                                            label: timevalue,
                                                                            value: timevalue
                                                                        }))

                                                                    }
                                                                    styles={{
                                                                        menuList: styles => ({
                                                                            ...styles,
                                                                            background: 'white',
                                                                            maxHeight: '200px',
                                                                            width: '100%',
                                                                            boxShadow: '0px 0px 5px #00000052',
                                                                            position: selectedRows.includes(row.id) ? 'absolute' : 'relative',
                                                                        }),
                                                                        // Set a higher z-index for the dropdown menu
                                                                        menu: (provided) => ({
                                                                            ...provided,
                                                                            zIndex: 9999,// Adjust the value as needed
                                                                            position: selectedRows.includes(row.id) ? 'absolute' : 'relative',

                                                                        }),

                                                                    }}
                                                                    value={{ label: row.subcategory, value: row.subcategory }}

                                                                    onChange={(e) => updateData(row.id, "subcategory", e.value)}
                                                                />

                                                            </FormControl>
                                                        </StyledTableCell>
                                                        <StyledTableCell>
                                                            <FormControl sx={{ minWidth: '250px' }} fullWidth>

                                                                <Selects
                                                                    options={selectedRows.includes(row.id) ? [] : Array.from(new Set(queues
                                                                        .filter(queue => queue.categories?.includes(row.category))
                                                                        .map(sub => sub.queuename)
                                                                    ))
                                                                        .map(queuename => ({
                                                                            label: queuename,
                                                                            value: queuename
                                                                        }))}

                                                                    styles={{
                                                                        menuList: styles => ({
                                                                            ...styles,
                                                                            background: 'white',
                                                                            maxHeight: '200px',
                                                                            width: '100%',
                                                                            boxShadow: '0px 0px 5px #00000052',
                                                                            position: selectedRows.includes(row.id) ? 'absolute' : 'relative',
                                                                        }),
                                                                        // Set a higher z-index for the dropdown menu
                                                                        menu: (provided) => ({
                                                                            ...provided,
                                                                            zIndex: 9999,// Adjust the value as needed
                                                                            position: selectedRows.includes(row.id) ? 'absolute' : 'relative',

                                                                        }),

                                                                    }}
                                                                    value={{ label: row.queue, value: row.queue }}
                                                                    onChange={(e) =>
                                                                        updateData(row.id, "queue", e.value)
                                                                    }
                                                                />

                                                            </FormControl>
                                                        </StyledTableCell>
                                                        <StyledTableCell>{getTimeandPoints(row.project, row.category, (row.subcategory ? row.subcategory : "ALL"))}</StyledTableCell>
                                                        <StyledTableCell>{getPoints(row.project, row.category, (row.subcategory ? row.subcategory : "ALL"))}</StyledTableCell>
                                                        <StyledTableCell>
                                                            <Button variant="contained" sx={{ height: '34px' }} onClick={(e) => sendRequestIndex(row.id)}>Update</Button>
                                                            
                                                        </StyledTableCell>

                                                    </StyledTableRow>
                                                )
                                            })) : <StyledTableRow> <StyledTableCell colSpan={12} align="center">No Data Available</StyledTableCell> </StyledTableRow>}
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
                            <Grid item md={4} xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                    <Button variant="contained" onClick={sendRequest}>Update All</Button>
                                </Box>
                            </Grid>

                        </Box>
                    </>
                )
            }
            <br />

            <br />
            {
                isUserRoleCompare?.includes("lunallottedqueuelist") && (
                    <>
                        <Box sx={userStyle.container}>
                            <Typography sx={userStyle.SubHeaderText}> Allotted Queue List</Typography>
                            <Grid container sx={{ justifyContent: "center" }}>
                                <Grid>
                                    {isUserRoleCompare?.includes("excelunallottedqueuelist") && (
                                        <>
                                            <ExportXL csvData={excelDataAllot} fileName={fileNameAllot} />
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("csvunallottedqueuelist") && (
                                        <>
                                            <ExportCSV csvData={excelDataAllot} fileName={fileNameAllot} />
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("printunallottedqueuelist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={handleprintAllot}
                                            >
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfunallottedqueuelist") && (
                                        <>
                                            <Button sx={userStyle.buttongrp}
                                                onClick={() => downloadPdfAllot()}
                                            >
                                                <FaFilePdf />
                                                &ensp;Export to PDF&ensp;
                                            </Button>
                                        </>
                                    )}
                                </Grid>
                            </Grid>

                            <Grid style={userStyle.dataTablestyle}>
                                <Box>
                                    <Select id="pageSizeSelect" value={pageSize} onChange={handlePageSizeChange} sx={{ width: "77px" }}>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={(excelmapdata.length)}>All</MenuItem>
                                    </Select>
                                </Box>
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
                            <TableContainer component={Paper} >
                                <Table
                                    aria-label="simple table"
                                    id="excel"
                                >
                                    <TableHead sx={{ fontWeight: "600" }}>
                                        <StyledTableRow>
                                            <StyledTableCell onClick={() => handleSorting('serialNumber')}><Box sx={userStyle.tableheadstyle}><Box>SNo</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('serialNumber')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('project')}><Box sx={userStyle.tableheadstyle}><Box>Project</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('project')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('vendor')}><Box sx={userStyle.tableheadstyle}><Box>vendor</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('vendor')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('customer')}><Box sx={userStyle.tableheadstyle}><Box>Customer</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('customer')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('process')}><Box sx={userStyle.tableheadstyle}><Box>Process</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIcon('process')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('category')}><Box sx={userStyle.tableheadstyle}><Box>Category</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconMap('category')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('subcategory')}><Box sx={userStyle.tableheadstyle}><Box>Subcategory</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconMap('subcategory')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('queue')}><Box sx={userStyle.tableheadstyle}><Box>Queue</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconMap('queue')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('time')}><Box sx={userStyle.tableheadstyle}><Box>Time</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconMap('time')}</Box></Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting('points')}><Box sx={userStyle.tableheadstyle}><Box>Points</Box><Box sx={{ marginTop: '-6PX' }}>{renderSortingIconMap('points')}</Box></Box></StyledTableCell>
                                            <StyledTableCell >Action</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody align="left">
                                        {filteredData.length > 0 ? (
                                            filteredData?.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                    <StyledTableCell>{row.project} </StyledTableCell>
                                                    <StyledTableCell>{row.vendor}</StyledTableCell>
                                                    <StyledTableCell>{row.customer}</StyledTableCell>
                                                    <StyledTableCell>{row.process}</StyledTableCell>
                                                    <StyledTableCell>

                                                        {row.category}
                                                    </StyledTableCell>


                                                    <StyledTableCell>

                                                        {row.subcategory}
                                                    </StyledTableCell>
                                                    <StyledTableCell>

                                                        {row.queue}
                                                    </StyledTableCell>

                                                    <StyledTableCell>{getTimeandPoints(row.project, row.category, row.subcategory ? row.subcategory : "ALL")}</StyledTableCell>
                                                    <StyledTableCell>{getPoints(row.project, row.category, row.subcategory ? row.subcategory : "ALL")}</StyledTableCell>

                                                    <StyledTableCell component="th" scope="row" colSpan={1}>
                                                        <Grid sx={{ display: "flex" }}>
                                                            <Button sx={userStyle.buttonedit} onClick={() => {
                                                                handleClickOpenEdit();
                                                                getCode(row._id)
                                                            }}>
                                                                <EditOutlinedIcon style={{ fontsize: "large" }} />
                                                            </Button>
                                                            <Button
                                                                sx={userStyle.buttonedit}
                                                                onClick={() => {
                                                                    handleClickOpenview();
                                                                    getviewCode(row._id);
                                                                }}
                                                            >
                                                                <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                                                            </Button>

                                                            <Button
                                                                sx={userStyle.buttonedit}
                                                                onClick={() => {
                                                                    handleClickOpeninfo();
                                                                    getinfoCode(row._id);
                                                                }}
                                                            >
                                                                <InfoOutlinedIcon style={{ fontsize: "large" }} />
                                                            </Button>

                                                        </Grid>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))) : <StyledTableRow> <StyledTableCell colSpan={11} align="center">No Data Available</StyledTableCell> </StyledTableRow>}
                                    </TableBody>
                                </Table>
                            </TableContainer>

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
                    maxWidth="md"
                    sx={{
                        overflow: 'visible',
                        '& .MuiPaper-root': {
                            overflow: 'visible',
                        },
                    }}
                >
                    <Box sx={{ padding: '20px' }}>
                        <>
                            <Typography sx={userStyle.SubHeaderText}> Edit Alloted List</Typography>
                            <br /><br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontSize: '18px', fontWight: '900' }}> Customer</Typography>
                                        <Typography>{exceledit.customer}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontSize: '18px', fontWight: '900' }}> Process</Typography>
                                        <Typography>{exceledit.process}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontSize: '18px', fontWight: '900' }}> Project</Typography>
                                        <Typography>{exceledit.project}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12} >
                                    <FormControl fullWidth size="small">
                                        <Typography sx={{ fontSize: '18px', fontWight: '900' }}> Vendot</Typography>
                                        <Typography>{exceledit.vendor}</Typography>
                                    </FormControl>
                                </Grid>
                                <br />
                                <br />
                                <br />
                                <Grid item md={4} xs={12} sm={12} >
                                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                    <FormControl fullWidth>
                                        <Selects
                                            options={
                                                categories
                                                    .filter(category => category?.project === exceledit?.project)
                                                    .map(sub => ({
                                                        ...sub,
                                                        label: sub.name,
                                                        value: sub.name
                                                    }))
                                            }

                                            styles={colourStyles}
                                            value={{ label: exceledit.category, value: exceledit?.category }}
                                            onChange={(e) => {
                                                setExceledit({
                                                    ...exceledit,
                                                    category: e.value, subcategory: "Please Select Subcategory", queue: 'Please Select Queue'
                                                });

                                            }}
                                        />

                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <InputLabel id="demo-simple-select-label">Subcategory</InputLabel>
                                    <FormControl fullWidth>
                                        <Selects

                                            options={Array.from(new Set(
                                                [...(timePointsList
                                                    .filter(time => time.category === exceledit?.category)
                                                    .map(sub => sub.subcategory)
                                                ), ("ALL")]
                                            ))
                                                .map(timevalue => ({
                                                    label: timevalue,
                                                    value: timevalue
                                                }))

                                            }
                                            styles={colourStyles}
                                            value={{ label: exceledit?.subcategory, value: exceledit?.subcategory }}

                                            onChange={(e) => {
                                                setExceledit({
                                                    ...exceledit,
                                                    subcategory: e.value,
                                                });
                                            }}
                                        />


                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <InputLabel id="demo-simple-select-label">Queue</InputLabel>
                                    <FormControl fullWidth>
                                        <Selects
                                            options={Array.from(new Set(queues
                                                .filter(queue => queue.categories?.includes(exceledit.category))
                                                .map(sub => sub.queuename)
                                            ))
                                                .map(queuename => ({
                                                    label: queuename,
                                                    value: queuename
                                                }))}

                                            styles={colourStyles}
                                            value={{ label: exceledit.queue, value: exceledit.queue }}

                                            onChange={(e) => {
                                                setExceledit({
                                                    ...exceledit,
                                                    queue: e.value,
                                                });
                                            }}
                                        />

                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography>Time</Typography>
                                    <FormControl fullWidth>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            size="small"
                                            readOnly
                                            value={getTimeandPoints(exceledit.project, exceledit.category, exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory) ? getTimeandPoints(exceledit.project, exceledit.category, exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory) : 0}
                                        // value={getTimeandPoints(exceledit.project, exceledit.category, (exceledit.subcategory === "Please Select Subcategory" || exceledit.subcategory === "" ? "ALL" : exceledit.subcategory)) ? getTimeandPoints(exceledit.project, exceledit.category, exceledit.category, (exceledit.subcategory === "Please Select Subcategory" || exceledit.subcategory === "" ? "ALL" : exceledit.subcategory)) : 0}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12} >
                                    <Typography>Points</Typography>
                                    <FormControl fullWidth>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            size="small"
                                            readOnly
                                            value={getPoints(exceledit.project, exceledit.category, exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory) ? getPoints(exceledit.project, exceledit.category, exceledit.subcategory === "Please Select Subcategory" ? "ALL" : exceledit.subcategory) : 0}
                                        // value={getPoints(exceledit.project, exceledit.category, exceledit.category, exceledit.subcategory === "Please Select Subcategory" || exceledit.subcategory === "" ? "ALL" : exceledit.subcategory) ? getPoints(exceledit.project, exceledit.category, exceledit.category, exceledit.subcategory === "Please Select Subcategory" || exceledit.subcategory === "" ? "ALL" : exceledit.subcategory) : 0}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br />
                            <br />
                            <br />
                            <Grid container>
                                <br />
                                <Grid item md={1}></Grid>
                                <Button variant="contained" onClick={editSubmit}>Update</Button>
                                <Grid item md={1}></Grid>
                                <Button sx={userStyle.btncancel} onClick={handleCloseModEdit} >Cancel</Button>
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
                    maxWidth="lg"
                >
                    <Box sx={{ width: "850px", padding: "20px 30px" }}>
                        <>
                            <Typography sx={userStyle.HeaderText}>
                                {" "}
                                Teams Activity log
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
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"UserName"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Category Name"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Subcategory Name"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Queue Name"}</StyledTableCell>
                                                <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                                            </TableHead>
                                            <TableBody>
                                                {updateby?.map((item, i) => (
                                                    <StyledTableRow>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}>{i + 1}.</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.name}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.category}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.subcategory}</StyledTableCell>
                                                        <StyledTableCell sx={{ padding: '5px 10px !important' }}> {item.queue}</StyledTableCell>
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

            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isDeleteOpen}
                    onClose={handleCloseMod}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "80px", color: "orange" }}
                        />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseMod} style={{
                            backgroundColor: '#f4f4f4',
                            color: '#444',
                            boxShadow: 'none',
                            borderRadius: '3px',
                            border: '1px solid #0000006b',
                            '&:hover': {
                                '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                    backgroundColor: '#f4f4f4',
                                },
                            },
                        }}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={(e) => delqueue(queueid)}
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
                onClose={handleCloseview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={{ width: '550px', padding: '20px 50px' }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View Alloted Queue List</Typography>
                        <br /><br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Project</Typography>
                                    <Typography>{exceledit.project}</Typography>
                                </FormControl>
                            </Grid><br />
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Vendor</Typography>
                                    <Typography>{exceledit.vendor}</Typography>
                                </FormControl>
                            </Grid><br />
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Customer</Typography>
                                    <Typography>{exceledit.customer}</Typography>
                                </FormControl>
                            </Grid><br />
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography variant="h6">Process</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{exceledit.process}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography variant="h6">Category</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{exceledit.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography variant="h6">Subcategory</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{exceledit.subcategory}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography variant="h6">Queue</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{exceledit.queue}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography variant="h6">Time</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{exceledit.time}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <Typography variant="h6">Points</Typography>
                                <FormControl fullWidth size="small">
                                    <Typography>{exceledit.points}</Typography>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /><br />
                        <Grid container spacing={2}>
                            <Button variant="contained" onClick={handleCloseview}> Back </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>


            {/* print layout for unalloted*/}
            <TableContainer component={Paper} sx={userStyle.printcls}>
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
                            <TableCell>Time </TableCell>
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
                                    <TableCell>{ }</TableCell>
                                    <TableCell>{ }</TableCell>
                                    <TableCell>{ }</TableCell>
                                    <TableCell>{ }</TableCell>
                                    <TableCell>{ }</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>



            {/* print layout for Alloted*/}
            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table
                    sx={{ minWidth: 700 }}
                    aria-label="customized table"
                    id="usertable"
                    ref={componentRefAllot}
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
                            <TableCell>Time </TableCell>
                            <TableCell>Points</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {excelmapdata.length > 0 &&
                            excelmapdata.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.customer}</TableCell>
                                    <TableCell>{row.process}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{row.queue}</TableCell>
                                    <TableCell>{getTimeandPoints(row.project, row.category, row.subcategory ? row.subcategory : "ALL")}</TableCell>
                                    <TableCell>{getPoints(row.project, row.category, row.subcategory ? row.subcategory : "ALL")}</TableCell>
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

export default Unallotqueuelist;