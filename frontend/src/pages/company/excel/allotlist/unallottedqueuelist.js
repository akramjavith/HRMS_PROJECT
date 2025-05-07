import React, { useState, useEffect, useRef, useContext } from "react";
import { Box, Typography, IconButton, OutlinedInput, Dialog, Select, Checkbox, TableCell, TableRow, MenuItem, TableBody, DialogContent, DialogActions, FormControl, Grid, Paper, Table, TableHead, TableContainer, Button } from "@mui/material";
import { userStyle, selectDropdownStyles } from "../../../../pageStyle";
import { StyledTableRow, StyledTableCell } from "../../../../components/Table";
import { handleApiError } from "../../../../components/Errorhandling";
import { AuthContext } from '../../../../context/Appcontext';
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel, } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import 'jspdf-autotable';
import jsPDF from "jspdf";
import axios from "axios";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import { SERVICE } from "../../../../services/Baseservice";
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Headtitle from "../../../../components/Headtitle";
import Selects from "react-select";
import CloseIcon from "@mui/icons-material/Close";
import { UserRoleAccessContext } from '../../../../context/Appcontext';
import CircularProgress, { circularProgressClasses, } from '@mui/material/CircularProgress';
import Pagination from '../../../../components/Pagination';
import LoadingButton from "@mui/lab/LoadingButton";
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

function Unallotqueuelist() {
    const [isBtn, setIsBtn] = useState(false);
    const [isBtn1, setIsBtn1] = useState(false);
    const [isBtn2, setIsBtn2] = useState(false);
    const [loadingOverall, setLoadingOverall] = useState(false);
    const [categories, setCategories] = useState([]);
    const [queues, setQueues] = useState([]);
    const [timePointsList, setTimePointsList] = useState([])
    const [isLoader, setIsLoader] = useState(false)
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [pagemap, setPagemap] = useState(1);
    const [pageSizeMap, setPageSizeMap] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedProject, setSelectedProject] = useState("Select Project");
    const [selectedCategory, setSelectedCategory] = useState("Select Category");
    const [selectedSubCategory, setSelectedSubCategory] = useState("Select Subcategory");
    const [selectedQueue, setSelectedQueue] = useState("Select Queue");
    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
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
                filteredDatasmap?.map((item, index) => ({
                    Sno: index + 1,
                    Project: item.project,
                    Vendor: item.vendor,
                    Customer: item.customer,
                    Process: item.process,
                })),
                fileName,
            );
        } else if (isfilter === "overall") {
            setLoadingOverall(true)
            let res_task = await axios.get(SERVICE.EXCELUNALLOTEDFILTERED_OVERALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            exportToCSV(
                res_task?.data?.finalResult?.map((item, index) => ({
                    Sno: index + 1,
                    Project: item.project,
                    Vendor: item.vendor,
                    Customer: item.customer,
                    Process: item.process,
                })),
                fileName,
            );
            setLoadingOverall(false)
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
            ...columns.map((col) => ({ ...col, dataKey: col.field })),
        ];
        let overall;
        if (isfilter === "overall") {
            let res_task = await axios.get(SERVICE.EXCELUNALLOTEDFILTERED_OVERALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            overall = res_task?.data?.finalResult?.map((item, index) => ({
                serialNumber: index + 1,
                project: item.project,
                vendor: item.vendor,
                customer: item.customer,
                process: item.process,
            }));

        }
        // Modify row data to include serial number
        const dataWithSerial = isfilter === "filtered" ?
            filteredDatasmap.map((item, index) => ({
                serialNumber: index + 1,
                project: item.project,
                vendor: item.vendor,
                customer: item.customer,
                process: item.process,
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

        doc.save("UnAllottedQueueList.pdf");
    };

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


    //TIMEPOINTS CALCULATIONS

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



    const [tableData, setTableData] = useState([]);

    // get all Excelsmapdatas
    const fetchUnalltedFiltered = async () => {
        setIsLoader(false);
        try {
            let res_branch_mapdata = await axios.post(SERVICE.EXCELUNALLOTEDFILTERED, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                page: pagemap,
                pageSize: pageSizeMap
            });
            const ans = res_branch_mapdata?.data?.finalResult?.length > 0 ? res_branch_mapdata?.data?.finalResult : []
            const itemsWithSerialNumber = ans?.map((item, index) => ({
                ...item,
                serialNumber: (pagemap - 1) * pageSizeMap + index + 1,
                // serialNumber: index + 1,
            }));
            setTableData(itemsWithSerialNumber);
            setTotalProjects(ans?.length > 0 ? res_branch_mapdata?.data?.totalProjects : 0);
            setTotalPages(ans?.length > 0 ? res_branch_mapdata?.data?.totalPages : 0);
            setPageSizeMap((data) => { return ans?.length > 0 ? data : 10 });
            setPagemap((data) => { return ans?.length > 0 ? data : 1 });
            setIsLoader(true);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    }



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
        } else {
            setIsBtn1(true)
            setIsBtn2(true)
            let res_branch_mapdata = await axios.get(SERVICE.EXCELUNALLOTEDFILTERED_OVERALL, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            res_branch_mapdata?.data?.finalResult?.forEach(async (item) => {
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
                        await fetchUnalltedFiltered();
                        setIsBtn1(false)
                        setIsBtn2(false)
                    } catch (err) {setIsBtn1(false);setIsBtn2(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
                }

            });
        }

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
                    NotificationManager.success('Successfully Added 👍', '', 2000);
                    await fetchUnalltedFiltered();
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
        setIsBtn(true)
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
                    await fetchUnalltedFiltered();
                    setIsBtn(false)
                } catch (err) {setIsBtn(false);handleApiError(err, setShowAlert, handleClickOpenerr);}
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
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Cleared Successfully"}
                </p>
            </>
        );
        handleClickOpenerr();
    }

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

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState()
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
        setIsBtn1(false)
        setIsBtn2(false)
        setIsBtn(false)
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        setIsBtn1(false)
        setIsBtn2(false)
        setIsBtn(false)
    };


    useEffect(() => {
        fetchCategoryDropdowns();
        fetchAllQueueGrp();
        fetchAllTimePoints();
    }, [])
    useEffect(() => {
        fetchUnalltedFiltered();

    }, [pagemap, pageSizeMap])

    //pdf....
    const columns = [
        { title: "Project Name", field: "project" },
        { title: "Vendor Name", field: "vendor" },
        { title: "Customer", field: "customer" },
        { title: "Process", field: "process" },
    ];
 
    // Excel
    const fileName = "UnAllottedQueueList";


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Unalloted Queue List ",
        pageStyle: "print",
    });


    const [itemsmap, setItemsMap] = useState([]);
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

    // Split the search query into individual terms
    const searchOverTerms = searchQueryMap.toLowerCase().split(" ");

    // Modify the filtering logic to check each term
    const filteredDatasmap = tableData?.filter((item) => {
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
        setSelectAll(updatedSelectedRows.length === filteredDatasmap.length);
    };

    //CHECK BOX CHECKALL SELECTION
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedRows([]);
            setSelectAll(false);
        } else {
            const allRowIds = filteredDatasmap.map((row) => row.id);
            setSelectedRows(allRowIds);
            setSelectAll(true);
        }
    };


    return (
        <Box>
            <Headtitle title={'Unalloted Queue List'} />
            {isUserRoleCompare?.includes("lunallottedqueuelist")
                && (
                    <>
                        <Box sx={userStyle.container}>

                            <Grid container spacing={2}>
                                <Grid item md={8} sm={8} xs={12}>
                                    <Typography sx={userStyle.HeaderText}> UnAllotted Queue List </Typography>
                                    <NotificationContainer />
                                </Grid>

                                <Grid item md={4} sm={4} xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                        <LoadingButton loading={isBtn2} variant="contained" onClick={sendRequest}>Update All</LoadingButton>
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
                                            setSelectedProject(e.value); 
                                            setSelectedCategory("Select Category")
                                            setSelectedQueue("Select Queue")
                                            setSelectedSubCategory("Select Subcategory");
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
                                            setSelectedCategory(e.value); 
                                            setSelectedSubCategory("Select Subcategory");
                                            setSelectedQueue("Select Queue")
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
                                    <LoadingButton loading={isBtn} variant="contained" color="warning" onClick={handleSubmitSelected}>Update Selected</LoadingButton>

                                </Grid>
                                <Grid item md={2} sm={6} xs={12} marginTop={3}>
                                    <Button sx={userStyle.btncancel} onClick={handleSubmitSelectedcancel}>CLEAR</Button>

                                </Grid>
                            </Grid>
                            <br /><br />
                            <Grid container sx={{ justifyContent: "center" }}>
                                <Grid>
                                    {isUserRoleCompare?.includes("excelunallottedqueuelist")
                                        && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("xl")
                                                }} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel&ensp;</Button>
                                            </>
                                        )}
                                    {isUserRoleCompare?.includes("csvunallottedqueuelist")
                                        && (
                                            <>
                                                <Button onClick={(e) => {
                                                    setIsFilterOpen(true)
                                                    setFormat("csv")
                                                }} sx={userStyle.buttongrp}><FaFileCsv />&ensp;Export to CSV&ensp;</Button>

                                            </>
                                        )}
                                    {isUserRoleCompare?.includes("printunallottedqueuelist")
                                        && (
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
                                    {isUserRoleCompare?.includes("pdfunallottedqueuelist")
                                        && (
                                            <>
                                                <Button sx={userStyle.buttongrp}
                                                    onClick={() => {
                                                        setIsPdfFilterOpen(true)
                                                    }}                                                ><FaFilePdf />&ensp;Export to PDF&ensp;</Button>
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
                            {!isLoader ?
                                <>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FacebookCircularProgress />
                                    </Box>
                                </> :
                                <>
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
                                                    <StyledTableCell ><Box sx={userStyle.tableheadstyle}><Box>Time</Box></Box></StyledTableCell>
                                                    <StyledTableCell><Box sx={userStyle.tableheadstyle}><Box>Points</Box></Box></StyledTableCell>
                                                    <StyledTableCell >Action</StyledTableCell>
                                                </StyledTableRow>
                                            </TableHead>
                                            <TableBody align="left">
                                                {filteredDatasmap.length > 0 ? (
                                                    filteredDatasmap?.map((row, index) => {
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


                                    <Box>
                                        <Pagination
                                            page={searchQueryMap !== "" ? 1 : pagemap}
                                            pageSize={pageSizeMap}
                                            totalPages={searchQueryMap !== "" ? 1 : totalPages}
                                            onPageChange={handlePageChangeMap}
                                            pageItemLength={filteredDatasmap?.length}
                                            totalProjects={
                                                searchQueryMap !== "" ? filteredDatasmap?.length : totalProjects
                                            }
                                        />                                    {/* <Pagination page={page} pageSize={pageSize} totalPagesCount={totalPages} onPageChange={handlePageChange} pageItemLength={employees} /> */}
                                    </Box>
                                </>}


                            <Grid item md={4} xs={12}>
                                <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                    <LoadingButton loading={isBtn1} variant="contained" onClick={sendRequest}>Update All</LoadingButton>
                                </Box>
                            </Grid>

                        </Box>
                    </>
                )
            }
            <br />

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
                    <LoadingButton loading={loadingOverall} variant="contained"
                        onClick={(e) => {
                            handleExportXL("overall")
                        }}
                    >
                        Export Over All Data
                    </LoadingButton>
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
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {filteredDatasmap.length > 0 &&
                            filteredDatasmap.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.project}</TableCell>
                                    <TableCell>{row.vendor}</TableCell>
                                    <TableCell>{row.customer}</TableCell>
                                    <TableCell>{row.process}</TableCell>
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