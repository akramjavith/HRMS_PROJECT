import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    FormControl,
    Grid,
    MenuItem,
    OutlinedInput,
    Select,
    TextareaAutosize,
    Typography
} from "@mui/material";
import axios from "axios";
import domtoimage from 'dom-to-image';
import { saveAs } from "file-saver";
import "jspdf-autotable";
import moment from "moment-timezone";
import React, { useContext, useEffect, useRef, useState } from "react";
import Selects from "react-select";
import AlertDialog from "../../components/Alert";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";


function AddIncome() {
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





    let today = new Date();

    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();
    let formattedDate = yyyy + "-" + mm + "-" + dd;

    const [income, setIncome] = useState({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        source: "Please Select Source",
        paymentmode: "Please Select Payment Mode",
        date: formattedDate,
        time: "",
        modeDrop: "Please Select Mode",
        notes: "",
        amount: "",
    });


    const [incomes, setIncomes] = useState([]);
    const [modeDrop, setmodeDrop] = useState("Please Select Mode");
    const [searchQuery, setSearchQuery] = useState("");
    const {
        isUserRoleCompare,
        isUserRoleAccess,
        isAssignBranch,
        pageName,
        setPageName,
        buttonStyles,
    } = useContext(UserRoleAccessContext);
    const [sourceDrop, setSourceDrop] = useState([]);
    const [sourceDropEdit, setSourcedropEdit] = useState([]);

    const { auth } = useContext(AuthContext);
    const [incomeCheck, setIncomecheck] = useState(false);
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [sourceNameDrop, setSourceNameDrop] = useState([]);
    const [copiedData, setCopiedData] = useState("");
    const [sourceNameDropEdit, setSourceNameDropEdit] = useState([]);
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
                    data?.subpagenameurl?.length !== 0 && data?.subpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.subpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 &&
                    data?.mainpagenameurl?.length !== 0 && data?.mainpagenameurl?.includes(window.location.pathname)
                ) {
                    fetfinalurl = data.mainpagenameurl;
                } else if (
                    data?.modulenameurl?.length !== 0 &&
                    data?.submodulenameurl?.length !== 0 && data?.submodulenameurl?.includes(window.location.pathname)
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

    //image

    const gridRefTableImg = useRef(null);
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Income.png");
                })
                .catch((error) => {
                    console.error("dom-to-image error: ", error);
                });
        }
    };


    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchedString, setSearchedString] = useState("");
    const [isHandleChange, setIsHandleChange] = useState(false);

    // view model
    const [openview, setOpenview] = useState(false);

    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
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

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    //Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };

    //Delete model
    const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

    const handleClickOpenalert = () => {
        setIsHandleChange(true);
        if (selectedRows.length === 0) {
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



    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const [deleteIncome, setDeleteIncome] = useState("");


    // Alert delete popup
    let Incomesid = deleteIncome?._id;



    const fetchSourceDropdowns = async () => {
        try {
            let res = await axios.get(SERVICE.SOURCE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            const sourceall = [
                ...res?.data?.sources.map((d) => ({
                    ...d,
                    label: d.sourcename,
                    value: d.sourcename,
                })),
            ];

            setSourceDrop(sourceall);
            setSourcedropEdit(sourceall);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    const [isBtn, setIsBtn] = useState(false);

    //add function
    const sendRequest = async () => {
        setPageName(!pageName);
        setIsBtn(true);
        try {
            let subprojectscreate = await axios.post(SERVICE.INCOME_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: String(income.company),
                branch: String(income.branch),
                unit: String(income.unit),
                paymentmode: String(income.paymentmode),
                source: String(income.source),
                amount: Number(income.amount),
                date: String(income.date),
                time: String(income.time),
                modeDrop: String(modeDrop),
                sortdate: String(modeDrop === "Received" ? new Date() : ""),
                notes: String(income.notes),
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchIncome();
            setIncome({
                ...income,
                notes: "",
                amount: "",
                time: "",
                date: formattedDate,
            });
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
            setIsBtn(false);
        } catch (err) {
            setIsBtn(false);
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = incomes.some(
            (item) =>
                item.company === income.company &&
                item.branch === income.branch &&
                item.unit === income.unit &&
                item.source === income.source &&
                item.paymentmode === income.paymentmode &&
                item.amount == income.amount &&
                item.modeDrop === modeDrop &&
                item.time === income.time
        );
        if (income.company === "Please Select Company") {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (income.branch === "Please Select Branch") {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (income.unit === "Please Select Unit") {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (income.paymentmode === "Please Select Payment Mode") {
            setPopupContentMalert("Please Select Payment Mode!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (income.source === "Please Select Source") {
            setPopupContentMalert("Please Select Source!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (income.amount === "") {
            setPopupContentMalert("Please Enter Amount!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (modeDrop === "Please Select Mode" || modeDrop === "") {
            setPopupContentMalert("Please Select Mode!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (income.date === "") {
            setPopupContentMalert("Please Select Date!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (income.time === "") {
            setPopupContentMalert("Please Select Time!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (isNameMatch) {
            setPopupContentMalert("Income already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            sendRequest();
        }
    };

    const handleClear = (e) => {
        e.preventDefault();
        setIncome({
            company: "Please Select Company",
            branch: "Please Select Branch",
            unit: "Please Select Unit",
            paymentmode: "Please Select Payment Mode",
            source: "Please Select Source",
            date: formattedDate,
            time: "",
            modeDrop: "Please Select Mode",
            notes: "",
            amount: "",
        });
        setmodeDrop("Please Select Mode");
        setSourceNameDrop([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpen(false);
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };



    //editing the single data...





    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(incomes);
    }, [incomes]);



    const [logicOperator, setLogicOperator] = useState("AND");

    const [selectedColumn, setSelectedColumn] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("Contains");
    const [filterValue, setFilterValue] = useState("");
    const [additionalFilters, setAdditionalFilters] = useState([]);
    const conditions = ["Contains", "Does Not Contain", "Equals", "Does Not Equal", "Begins With", "Ends With", "Blank", "Not Blank"]; // AgGrid-like conditions
    const [totalPages, setTotalPages] = useState(0);
    const [totalDatas, setTotalDatas] = useState(0);
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalProjectsData, setTotalProjectsData] = useState([]);
    // Search bar
    const [anchorElSearch, setAnchorElSearch] = React.useState(null);
    const handleClickSearch = (event) => {
        setAnchorElSearch(event.currentTarget);
        localStorage.removeItem("filterModel");
    };
    const handleCloseSearch = () => {
        setAnchorElSearch(null);
        setSearchQuery("");
    };

    const openSearch = Boolean(anchorElSearch);
    const idSearch = openSearch ? 'simple-popover' : undefined;

    const handleAddFilter = () => {
        if (selectedColumn && filterValue || ["Blank", "Not Blank"].includes(selectedCondition)) {
            setAdditionalFilters([
                ...additionalFilters,
                { column: selectedColumn, condition: selectedCondition, value: filterValue }
            ]);
            setSelectedColumn("");
            setSelectedCondition("Contains");
            setFilterValue("");
        }
    };
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

    // Debounce the search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery); // Update debounced query after the timeout
        }, 300); // Debounce delay in milliseconds (adjust as needed)

        return () => {
            clearTimeout(handler); // Clear the timeout if searchQuery changes within the delay
        };
    }, [searchQuery]);



    //get all Sub vendormasters.
    const fetchIncome = async () => {
        setPageName(!pageName);

        try {

            let res = await axios.post(
                SERVICE.INCOME,
                {
                    assignbranch: accessbranch,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                }
            );

            let data = res?.data?.incomes.map((item) => ({
                ...item,
                date: moment(item.date)?.format("DD-MM-YYYY"),
            }));
            setIncomes(data);

        } catch (err) {
            setIncomecheck(true);
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
    };



    //print...
    const componentRef = useRef();

    useEffect(() => {
        fetchSourceDropdowns();
        fetchIncome();
    }, []);

    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    //Datatable


    //datatable....

    // Split the search query into individual terms
    const searchTerms = searchQuery.toLowerCase().split(" ");
    // Modify the filtering logic to check each term





    // Show All Columns functionality
    // // Function to filter columns based on search query


    // Manage Columns functionality


    // JSX for the "Manage Columns" popover content


    //get all Sourcename vendormasters.
    const fetchSourceNameAll = async (e) => {
        try {
            let res_meet = await axios.get(SERVICE.SOURCEOFPAYMENT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let data_set = res_meet?.data?.SourceofPy.filter((data) => {
                return data.paymentmode.some((item) => item === e);
            });
            const units = [
                ...data_set.map((d) => ({
                    ...d,
                    label: d.sourcename,
                    value: d.sourcename,
                })),
            ];
            setSourceNameDrop(units);
            setSourceNameDropEdit(units);
        } catch (err) {
            handleApiError(
                err,
                setPopupContentMalert,
                setPopupSeverityMalert,
                handleClickOpenPopupMalert
            );
        }
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
            pagename: String("Add Income"),
            commonid: String(isUserRoleAccess?._id),
            date: String(new Date()),

            addedby: [
                {
                    name: String(isUserRoleAccess?.username),
                    date: String(new Date()),
                },
            ],
        });
    };

    return (
        <Box>
            <Headtitle title={"ADD INCOME"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Add Income"
                modulename="Expenses"
                submodulename="Add Income"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("aaddincome") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Add Income
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Company<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={accessbranch
                                                ?.map((data) => ({
                                                    label: data.company,
                                                    value: data.company,
                                                }))
                                                .filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label && i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            styles={colourStyles}
                                            value={{ label: income.company, value: income.company }}
                                            onChange={(e) => {
                                                setIncome({
                                                    ...income,
                                                    company: e.value,
                                                    branch: "Please Select Branch",
                                                    unit: "Please Select Unit",
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Branch<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={accessbranch
                                                ?.filter((comp) => income.company === comp.company)
                                                ?.map((data) => ({
                                                    label: data.branch,
                                                    value: data.branch,
                                                }))
                                                .filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label && i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            styles={colourStyles}
                                            value={{ label: income.branch, value: income.branch }}
                                            onChange={(e) => {
                                                setIncome({
                                                    ...income,
                                                    branch: e.value,
                                                    unit: "Please Select Unit",
                                                });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Unit<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={accessbranch
                                                ?.filter(
                                                    (comp) =>
                                                        income.company === comp.company &&
                                                        income.branch === comp.branch
                                                )
                                                ?.map((data) => ({
                                                    label: data.unit,
                                                    value: data.unit,
                                                }))
                                                .filter((item, index, self) => {
                                                    return (
                                                        self.findIndex(
                                                            (i) =>
                                                                i.label === item.label && i.value === item.value
                                                        ) === index
                                                    );
                                                })}
                                            styles={colourStyles}
                                            value={{ label: income.unit, value: income.unit }}
                                            onChange={(e) => {
                                                setIncome({ ...income, unit: e.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Payment Mode<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={sourceDrop}
                                            styles={colourStyles}
                                            value={{
                                                label: income.paymentmode,
                                                value: income.paymentmode,
                                            }}
                                            onChange={(e) => {
                                                setIncome({
                                                    ...income,
                                                    paymentmode: e.value,
                                                    source: "Please Select Source",
                                                });
                                                fetchSourceNameAll(e.sourcename);
                                                setSourceNameDrop([]);
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Source<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            options={sourceNameDrop}
                                            styles={colourStyles}
                                            value={{ label: income.source, value: income.source }}
                                            onChange={(e) => {
                                                setIncome({ ...income, source: e.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Amount<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="number"
                                            placeholder="Please Enter Amount"
                                            sx={userStyle.input}
                                            value={income.amount}
                                            onChange={(e) => {
                                                setIncome({ ...income, amount: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>Notes</Typography>
                                        <TextareaAutosize
                                            aria-label="minimum height"
                                            minRows={5}
                                            value={income.notes}
                                            onChange={(e) => {
                                                setIncome({ ...income, notes: e.target.value });
                                            }}
                                            style={{ resize: "none" }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Mode<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Select
                                            fullWidth
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            value={modeDrop}
                                            onChange={(e) => {
                                                setmodeDrop(e.target.value);
                                            }}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value="Please Select Mode" disabled>
                                                {" "}
                                                {"Please Select Mode"}{" "}
                                            </MenuItem>
                                            <MenuItem value="Pending"> {"Pending"} </MenuItem>
                                            <MenuItem value="Received"> {"Received"} </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Date<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput
                                            id="component-outlined"
                                            type="date"
                                            value={income.date}
                                            onChange={(e) => {
                                                setIncome({ ...income, date: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={6}>
                                    <Typography>
                                        {" "}
                                        Time <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <FormControl fullWidth size="small">
                                        <OutlinedInput
                                            value={income.time}
                                            type="time"
                                            onChange={(e) => {
                                                setIncome({ ...income, time: e.target.value });
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <br /> <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={6}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSubmit}
                                        disabled={isBtn}
                                        sx={buttonStyles.buttonsubmit}
                                    >
                                        Submit
                                    </Button>
                                </Grid>
                                <Grid item md={2.5} xs={12} sm={6}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </>
            )}

            <br />


            {/* ALERT DIALOG */}
            <Box>
                <Dialog
                    open={isErrorOpenpop}
                    onClose={handleCloseerrpop}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlertpop}</Typography>
                    </DialogContent>
                    <DialogActions>
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

            {/* EXTERNAL COMPONENTS -------------- START */}
            {/* VALIDATION */}
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
        </Box>
    );
}

export default AddIncome;
