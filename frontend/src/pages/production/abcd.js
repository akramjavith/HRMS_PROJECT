import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import Selects from "react-select";
import { MultiSelect } from "react-multi-select-component";
import {
    Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem,
    OutlinedInput, Popover, Select, TextField, Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import { ThreeDots } from "react-loader-spinner";
import AlertDialog from "../../components/Alert";
import { DeleteConfirmation, PleaseSelectRow, } from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';

function QueueTypeMaster() {
    const [filteredRowData, setFilteredRowData] = useState([]);
    const [filteredChanges, setFilteredChanges] = useState(null);
    const [isHandleChange, setIsHandleChange] = useState(false);
    const [searchedString, setSearchedString] = useState("");
    const gridRefTable = useRef(null);
    const gridRefTableImg = useRef(null);
    const [openPopupMalert, setOpenPopupMalert] = useState(false);
    const [loader, setLoader] = useState(false);
    const [popupContentMalert, setPopupContentMalert] = useState("");
    const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
    const handleClickOpenPopupMalert = () => {
        setOpenPopupMalert(true);
        setloadingdeloverall(false);
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

    const [dialogData, setDialogData] = useState([]);

    let exportColumnNames = ["ProjectVendor", "Category", "Subcategory", "Type", "O-Rate", "New Rate"];
    let exportRowValues = ["vendor", "category", "subcategory", "type", "orate", "newrate"];

    const [unitRateArray, setUnitRateArray] = useState([]);

    const [vendors, setVendors] = useState([]);
    const [vendorsEdit, setVendorsEdit] = useState([]);



    const [managecategory, setManagecategory] = useState({
        vendor: "Please Select Project Vendor",
        category: "Please Select Category",
        subcategory: "Please Select SubCategory",
        type: "Please Select Type",
        newrate: "",
        orate: "Please Select Orate",
    });

    const [managecategoryEdit, setManageCategoryEdit] = useState({

        category: "Please Select Category",
        subcategory: "Please Select subcategory",
        type: "Please Select Type",
        newrate: "",
        orate: ""
    });


    const fetchVendors = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let vendorall = res_vendor?.data?.vendormaster.map((d) => ({
                ...d,
                label: d.projectname + "-" + d.name,
                value: d.projectname + "-" + d.name,
            }));
            setVendors(vendorall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const fetchVendorsEdit = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.VENDORMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let vendorall = res_vendor?.data?.vendormaster.map((d) => ({
                ...d,
                label: d.projectname + "-" + d.name,
                value: d.projectname + "-" + d.name,
            }));
            setVendorsEdit(vendorall);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    useEffect(() => {
        fetchVendors();
        fetchVendorsEdit();
    }, []);

    const handleChangemrate = (e) => {
        // Regular expression to match only positive numeric values
        const regex = /^[0-9]+(\.[0-9]+)?$/; // Only allows positive integers
        // const regex = /^\d*\.?\d*$/;

        const inputValue = e.target.value;
        if (regex.test(inputValue) || inputValue === "") {
            // Update the state with the valid numeric value
            setManagecategory({ ...managecategory, newrate: inputValue });
        }
    };

    const handleChangemrateEdit = (e) => {
        // Regular expression to match only positive numeric values
        const regex = /^[0-9]+(\.[0-9]+)?$/; // Only allows positive integers
        // const regex = /^\d*\.?\d*$/;

        const inputValue = e.target.value;
        if (regex.test(inputValue) || inputValue === "") {
            // Update the state with the valid numeric value
            setManageCategoryEdit({ ...managecategoryEdit, newrate: inputValue });
        }
    };


    const [categoryOpt, setCategories] = useState([])
    const [categoryOptedit, setCategoriesEdit] = useState([])
    const [subCtegoryOpt, setSubcategories] = useState([])
    const [subCtegoryOptedit, setSubcategoriesEdit] = useState([])
    const [selectedTypeFrom, setSelectedTypeForm] = useState([])
    const [selectedOrate, setSelectedOrate] = useState([])


    const [selectedTypeFromEdit, setSelectedTypeFormEdit] = useState([])


    const [selectedSubCategoryFrom, setSelectedSubCategoryForm] = useState([])
    const [selectedSubCategoryEditFrom, setSelectedSubCategoryEditForm] = useState([])
    const [selectedSubCategoryFromEdit, setSelectedSubCategoryFormEdit] = useState([])
    const [selectedSubCategoryValue, setSelectedSubCategoryValues] = useState([])
    const [selectedTypeValue, setSelectedTypeValues] = useState([])

    const [loadingdeloverall, setloadingdeloverall] = useState(false);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

    // page refersh reload
    const handleCloseFilterMod = () => {
        setIsFilterOpen(false);
    };
    const handleClosePdfFilterMod = () => {
        setIsPdfFilterOpen(false);
    };

    const [group, setGroup] = useState({ name: "", });
    const [groupEdit, setGroupEdit] = useState({ name: "" });
    const [groups, setGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [allGroupEdit, setAllGroupEdit] = useState([]);
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);
    const gridRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [searchQueryManage, setSearchQueryManage] = useState("");
    const [copiedData, setCopiedData] = useState("");
    const [openviewalert, setOpenviewalert] = useState(false);

    // view model
    const handleClickOpenviewalert = () => {
        setOpenviewalert(true);
    };
    const handleCloseviewalert = () => {
        setOpenviewalert(false);
    };

    //image
    const handleCaptureImage = () => {
        if (gridRefTableImg.current) {
            domtoimage.toBlob(gridRefTableImg.current)
                .then((blob) => {
                    saveAs(blob, "Queue Type Master.png");
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

    // view model
    const [openview, setOpenview] = useState(false);

    const handleClickOpenview = () => {
        setOpenview(true);
    };
    const handleCloseview = () => {
        setOpenview(false);
    };

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
        setloadingdeloverall(false);
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
        if (selectedRows.includes(params.data.id)) {
            return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
        }
        return ""; // Return an empty string for other rows
    };

    // Show All Columns & Manage Columns
    const initialColumnVisibility = {
        serialNumber: true,
        checkbox: true,
        vendor: true,
        category: true,
        subcategory: true,
        type: true,
        orate: true,
        newrate: true,
        actions: true,
    };

    const [columnVisibility, setColumnVisibility] = useState(
        initialColumnVisibility
    );

    // page refersh reload code
    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = ""; // This is required for Chrome support
    };

    const [deleteGroup, setDeletegroup] = useState("");

    const rowData = async (id, name) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PRODUCTION_QUEUETYPEMASTER_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setDeletegroup(res?.data?.squeuetypemaster);
            handleClickOpen();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // Alert delete popup
    let groupEditt = deleteGroup._id;
    const deleGroup = async () => {
        setPageName(!pageName)
        try {
            await axios.delete(`${SERVICE.PRODUCTION_QUEUETYPEMASTER_SINGLE}/${groupEditt}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            await fetchAllQueueTypeMaster();
            handleCloseMod();
            setFilteredRowData([])
            setFilteredChanges(null)
            setPage(1);
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const delGroupcheckbox = async () => {
        setPageName(!pageName)
        try {
            const deletePromises = selectedRows?.map((item) => {
                return axios.delete(`${SERVICE.PRODUCTION_QUEUETYPEMASTER_SINGLE}/${item}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                });
            });

            // Wait for all delete requests to complete
            await Promise.all(deletePromises);
            setIsHandleChange(false);
            handleCloseModcheckbox();
            setSelectedRows([]);
            setSelectAllChecked(false);
            setPage(1);
            setFilteredRowData([])
            setFilteredChanges(null)
            await fetchAllQueueTypeMaster();
            setPopupContent("Deleted Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //add function

    //dialog popup for sendrequest

    // const sendRequest = async () => {
    //     setPageName(!pageName)
    //     try {

    //         const batchSize = 100; 
    //         const batches = [];



    //         for (let i = 0; i < dialogData.length; i += batchSize) {
    //             const batch = dialogData.slice(i, i + batchSize);
    //             batches.push(batch);
    //         }

    //         // Collect all promises
    //         const allPromises = [];

    //         for (const batch of batches) {
    //             const batchPromises = batch.map((item) =>
    //                 axios.post(SERVICE.PRODUCTION_QUEUETYPEMASTER_CREATE, {
    //                     headers: {
    //                         Authorization: `Bearer ${auth.APIToken}`,
    //                     },
    //                     ...item,
    //                     addedby: [
    //                         {
    //                             name: String(isUserRoleAccess.companyname),
    //                             date: String(new Date()),
    //                         },
    //                     ],
    //                 })
    //             );
    //             allPromises.push(...batchPromises);
    //         }

    //         try {
    //             // Wait for all promises to finish
    //             await Promise.all(allPromises);

    //             // Perform actions after all requests are successful
    //             await fetchAllQueueTypeMaster();
    //             handleCloseModEditSub();
    //             setPopupContent("Added Successfully");
    //             setPopupSeverity("success");
    //             handleClickOpenPopup();
    //             setloadingdeloverall(false);

    //         } catch (error) {
    //             console.error("Error processing requests:", error);
    //             // Optionally handle errors here, such as displaying an error message
    //         }


    //     } catch (err) {
    //         handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    //     }
    // };


    const sendRequest = async () => {
        setPageName(!pageName)
        try {

            const batchSize = 100; // Adjust batch size based on backend capacity
            const batches = [];

            // Flatten the combinations of subcategories and types
            const combinedData = selectedSubCategoryValue.flatMap((subcategory) =>
                selectedTypeFrom.map(d => d.value).map((type) => ({ subcategory, type }))
            );

            // Split combinedData into batches
            for (let i = 0; i < combinedData.length; i += batchSize) {
                const batch = combinedData.slice(i, i + batchSize);
                batches.push(batch);
            }

            // Collect all promises
            const allPromises = [];

            for (const batch of batches) {
                const batchPromises = batch.map(({ subcategory, type }) =>
                    axios.post(SERVICE.PRODUCTION_QUEUETYPEMASTER_CREATE, {
                        headers: {
                            Authorization: `Bearer ${auth.APIToken}`,
                        },
                        vendor: String(managecategory.vendor),
                        category: String(managecategory.category),
                        orate: selectedOrate.map(item => item.value),
                        subcategory,
                        newrate: Number(managecategory.newrate),
                        type,
                        addedby: [
                            {
                                name: String(isUserRoleAccess.companyname),
                                date: String(new Date()),
                            },
                        ],
                    })
                );
                allPromises.push(...batchPromises);
            }

            try {
                // Wait for all promises to finish
                await Promise.all(allPromises);

                // Perform actions after all requests are successful
                await fetchAllQueueTypeMaster();
                setPopupContent("Added Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
                setloadingdeloverall(false);

            } catch (error) {
                console.error("Error processing requests:", error);
                // Optionally handle errors here, such as displaying an error message
            }


        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };




    const handleNewRateChange = (index, value) => {
        setDialogData((prevData) =>
            prevData.map((item, idx) =>
                idx === index ? { ...item, newrate: value } : item
            )
        );
    };

    //submit option for saving
    const handleSubmit = async (e) => {
        setPageName(!pageName)
        e.preventDefault();
        setloadingdeloverall(true);


        let res_grp = await axios.post(SERVICE.PRODUCTION_QUEUETYPEMASTER_DUPLICATE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            // orate: managecategory.orate,
            category: managecategory.category,
            subcategory: selectedSubCategoryValue,
            type: selectedTypeFrom.map((item) => item.value)

        });
        const isNameMatch = res_grp.data.queuetypemasters > 0

        if (selectedTypeFrom.length === 0) {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (managecategory.vendor === "Please Select Project Vendor") {
            setPopupContentMalert("Please Select Project Vendor");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (managecategory.category === "Please Select Category") {
            setPopupContentMalert("Please Select Category!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedOrate.length == 0) {
            setPopupContentMalert("Please Select Orate!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (selectedSubCategoryValue.length == 0) {
            setPopupContentMalert("Please Select SubCategory!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }

        else if (managecategory.newrate === "") {
            setPopupContentMalert("Please Enter newrate!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }


        else {

            // const dataToShow = selectedSubCategoryValue.flatMap((subcategory) =>
            //     selectedTypeFrom.map(d => ({
            //         category: managecategory.category,
            //         subcategory,
            //         type: d.value,
            //         newrate: managecategory.newrate,
            //         orate: managecategory.orate,
            //     }))
            // );

            // setDialogData(dataToShow);
            // handleClickOpenEditSub();

            sendRequest();
        }
    };


    const handleSubmitDialog = async (e) => {

        e.preventDefault();

        sendRequest();

    };



    const handleClear = () => {
        setPageName(!pageName)
        setManagecategory({
            ...managecategory,
            vendor: "Please Select Project Vendor",
            orate: "Please Select Orate",
            category: "Please Select Category",
            subcategory: "Please Select SubCategory",
            type: "Please Select Type",
            newrate: "",

        });
        setCategories([])
        setOrateDrop([])
        setSubcategories([])
        setSelectedSubCategoryForm([])
        setSelectedTypeForm([])
        setSelectedOrate([])
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


    //Edit model...
    const [isEditOpensub, setIsEditOpensub] = useState(false);
    const handleClickOpenEditSub = () => {
        setIsEditOpensub(true);
    };
    const handleCloseModEditSub = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setIsEditOpensub(false);
    };

    // info model
    const [openInfo, setOpeninfo] = useState(false);

    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };

    const handleCloseinfo = () => {
        setOpeninfo(false);
    };
    const [viewcode, setViewcode] = useState([])

    //get single row to edit....
    const getCode = async (e, data) => {
        console.log(data, "Datga")
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PRODUCTION_QUEUETYPEMASTER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            console.log(res.data.squeuetypemaster, "edit")
            setManageCategoryEdit({ ...res.data.squeuetypemaster, orate: data.orate });
            fetchAllSubCategoryEdit(data.category, data.orate)
            handleClickOpenEdit();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const getviewCode = async (e, data) => {

        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PRODUCTION_QUEUETYPEMASTER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setViewcode({ ...res.data.squeuetypemaster, orate: data.orate });

            fetchAllSubCategory(data.category)
            handleClickOpenview();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    // get single row to view....
    // const getviewCode = async (e) => {
    //     setPageName(!pageName)

    //     try {
    //         let res = await axios.get(`${SERVICE.PRODUCTION_QUEUETYPEMASTER_SINGLE}/${e}`, {
    //             headers: {
    //                 Authorization: `Bearer ${auth.APIToken}`,
    //             },
    //         });
    //         setGroupEdit(res?.data?.squeuetypemaster);
    //         handleClickOpenview();
    //     } catch (err) {
    //         handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    //     }
    // };

    // get single row to view....
    const getinfoCode = async (e) => {
        setPageName(!pageName)
        try {
            let res = await axios.get(`${SERVICE.PRODUCTION_QUEUETYPEMASTER_SINGLE}/${e}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setManageCategoryEdit(res.data.squeuetypemaster);
            handleClickOpeninfo();
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    //Project updateby edit page...
    let updateby = managecategoryEdit.updatedby;
    let addedby = managecategoryEdit.addedby;
    let projectsid = managecategoryEdit._id;

    //editing the single data...
    const sendEditRequest = async () => {
        setPageName(!pageName)
        try {
            let res = await axios.put(`${SERVICE.PRODUCTION_QUEUETYPEMASTER_SINGLE}/${projectsid}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                category: String(managecategoryEdit.category),
                subcategory: String(managecategoryEdit.subcategory),
                newrate: Number(managecategoryEdit.newrate),
                orate: Number(managecategoryEdit.orate),
                type: String(managecategoryEdit.type),
                updatedby: [
                    ...updateby,
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            await fetchAllQueueTypeMaster();
            handleCloseModEdit();
            setPopupContent("Updated Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const editSubmit = async (e) => {
        e.preventDefault();


        let res_grp = await axios.post(SERVICE.PRODUCTION_QUEUETYPEMASTER_DUPLICATE, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            category: managecategoryEdit.category,
            subcategory: [managecategoryEdit.subcategory],
            type: [managecategoryEdit.type],
            id: managecategoryEdit._id
        });
        const isNameMatch = res_grp.data.queuetypemasters > 0


        if (managecategoryEdit.category === "Please Select Category") {
            setPopupContentMalert("Please Select Category!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (managecategoryEdit.subcategory === "Please Select subcategory") {
            setPopupContentMalert("Please Select SubCategory!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (managecategoryEdit.type == "Please Select Type") {
            setPopupContentMalert("Please Select Type!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (managecategoryEdit.newrate === "") {
            setPopupContentMalert("Please Enter newrate!");
            setPopupSeverityMalert("warning");
            handleClickOpenPopupMalert();
        }
        else if (isNameMatch) {
            setPopupContentMalert("Data Already Exist!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendEditRequest();
        }
    };

    //get all project.
    const fetchAllQueueTypeMaster = async () => {
        setPageName(!pageName)
        try {
            let res_grp = await axios.get(SERVICE.PRODUCTION_QUEUETYPEMASTER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });



            setGroups(res_grp?.data?.queuetypemasters.map((item, index) => ({
                ...item,
                id: item._id,
                serialNumber: index + 1,

            })));



            setLoader(true);
        } catch (err) {
            setLoader(true);
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    //print...
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "Groupname List",
        pageStyle: "print",
    });

    useEffect(() => {
        fetchAllQueueTypeMaster();
    }, []);



    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    const [items, setItems] = useState([]);

    const addSerialNumber = (datas) => {
        setItems(datas);
    };

    useEffect(() => {
        addSerialNumber(groups);
    }, [groups]);

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

    const totalPages = Math.ceil(filteredDatas.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math.max(1, page - 1);
    const lastVisiblePage = Math.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

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

            sortable: false, // Optionally, you can make this column not sortable
            width: 90,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            hide: !columnVisibility.checkbox,
            headerClassName: "bold-header",
            pinned: "left",
            lockPinned: true,
        },
        {
            field: "serialNumber",
            headerName: "SNo",
            flex: 0,
            width: 100,
            hide: !columnVisibility.serialNumber,
            headerClassName: "bold-header",
        },
        {
            field: "vendor",
            headerName: "Project-Vendor",
            flex: 0,
            width: 250,
            hide: !columnVisibility.vendor,
            headerClassName: "bold-header",
        },
        {
            field: "category",
            headerName: "Category",
            flex: 0,
            width: 250,
            hide: !columnVisibility.category,
            headerClassName: "bold-header",
        },
        {
            field: "subcategory",
            headerName: "SubCategory",
            flex: 0,
            width: 250,
            hide: !columnVisibility.subcategory,
            headerClassName: "bold-header",
        },
        {
            field: "type",
            headerName: "Type",
            flex: 0,
            width: 250,
            hide: !columnVisibility.type,
            headerClassName: "bold-header",
        },
        {
            field: "orate",
            headerName: "O-Rate",
            flex: 0,
            width: 250,
            hide: !columnVisibility.orate,
            headerClassName: "bold-header",
        },
        {
            field: "newrate",
            headerName: "New-Rate",
            flex: 0,
            width: 250,
            hide: !columnVisibility.newrate,
            headerClassName: "bold-header",
        },
        {
            field: "actions",
            headerName: "Action",
            flex: 0,
            width: 250,
            minHeight: "40px !important",
            sortable: false,
            hide: !columnVisibility.actions,
            headerClassName: "bold-header",
            cellRenderer: (params) => (
                <Grid sx={{ display: "flex" }}>
                    {isUserRoleCompare?.includes("equeuetypemaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {

                                getCode(params.data.id, params.data);
                            }}
                        >
                            <EditOutlinedIcon sx={buttonStyles.buttonedit} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("dqueuetypemaster") && (
                        <Button
                            sx={userStyle.buttondelete}
                            onClick={(e) => {
                                rowData(params.data.id, params.data.name);
                            }}
                        >
                            <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
                        </Button>
                    )}
                    {isUserRoleCompare?.includes("vqueuetypemaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getviewCode(params.data.id, params.data);
                            }}
                        >
                            <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
                        </Button>
                    )
                    }
                    {isUserRoleCompare?.includes("iqueuetypemaster") && (
                        <Button
                            sx={userStyle.buttonedit}
                            onClick={() => {
                                getinfoCode(params.data.id);
                            }}
                        >
                            <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
                        </Button>
                    )}
                </Grid >
            ),
        },
    ];

    const rowDataTable = filteredData.map((item, index) => {
        return {
            id: item._id,
            serialNumber: item.serialNumber,
            vendor: item.category,
            category: item.category,
            subcategory: item.subcategory,
            type: item.type,
            orate: item.orate,
            newrate: item.newrate,
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
    const [fileFormat, setFormat] = useState("");

    //Access Module
    const pathname = window.location.pathname;
    const getapi = async () => {
        let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
            headers: {
                Authorization: `Bearer ${auth.APIToken}`,
            },
            empcode: String(isUserRoleAccess?.empcode),
            companyname: String(isUserRoleAccess?.companyname),
            pagename: String("Group"),
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

    useEffect(() => {
        getapi();
    }, []);

    const [typeMaster, setTypeMaster] = useState([])
    const [Oratedrop, setOrateDrop] = useState([])

    const fetchAllTypemaster = async (proj) => {
        setPageName(!pageName);
        try {
            let res_module = await axios.get(SERVICE.PRODUCTION_TYPEMASTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });

            // Default options
            const defaultOptions = [
                { label: "Other task queues", value: "Other task queues" },
            ];

            // Fetch and map dynamic options
            const dynamicOptions = Array.from(new Set(
                res_module?.data?.typemasters
                    .map((t) => t.name)
            )).map((name) => ({
                label: name,
                value: name,
            }));


            const combinedOptions = [...defaultOptions, ...dynamicOptions];

            // Remove duplicates with case-insensitive comparison
            const categoryOpt = Array.from(
                new Map(
                    combinedOptions.map(option => [option.label.toLowerCase(), option])
                ).values()
            );

            setTypeMaster(categoryOpt);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    // const fetchAllCategory = async (proj) => {
    //     setPageName(!pageName)
    //     try {
    //         let res_freq = await axios.get(SERVICE.PRODUCTION_UNITRATE, {
    //             headers: {
    //                 Authorization: `Bearer ${auth.APIToken}`,
    //             },
    //         });
    //         const categoryOpt = Array.from(new Set(
    //             res_freq?.data?.unitsrate
    //                 .map((t) => t.category)
    //         )).map((category) => ({
    //             label: category,
    //             value: category,
    //         }));
    //         setCategories(categoryOpt);

    //     } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    // };


    const fetchAllCategory = async (e) => {

        try {
            let res_module = await axios.post(SERVICE.CATEGORYPROD_LIMITED_REPORT_MULTI, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                projectvendor: [e.split("-")[0]],
            });
            const categoryOpt = Array.from(new Set(res_module?.data?.categoryprod.map((t) => t.name))).map((name) => ({
                label: name,
                value: name,
            }));
            setCategories(categoryOpt);
        } catch (err) {
            handleApiError(err, setShowAlert, handleClickOpenerr);
        }
    };

    const fetchAllCategoryEdit = async (e) => {
        setPageName(!pageName)
        try {
            let res_module = await axios.post(SERVICE.CATEGORYPROD_LIMITED_REPORT_MULTI, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                projectvendor: [e.split("-")[0]],
            });
            const categoryOpt = Array.from(new Set(res_module?.data?.categoryprod.map((t) => t.name))).map((name) => ({
                label: name,
                value: name,
            }));
            setCategoriesEdit(categoryOpt);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };





    const fetchAllOrate = async (project, category) => {

        setPageName(!pageName)
        try {
            let res_freq = await axios.post(SERVICE.UNITRATE_PRODUCTION_ORATE_CATEGORY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                project: project.split("-")[0],
                category: category

            });

            console.log(selectedTypeFrom, "selectedTypeFrom")
            const branches = res_freq.data.unitsrate;
            const branchdata = [
                ...branches
                    .map((d) => ({
                        ...d,
                        // label: d.orate,
                        // value: d.orate,
                        label: selectedTypeFrom.map(item => item.value).includes("Other task queues") ? d.mrate : d.orate,
                        value: selectedTypeFrom.map(item => item.value).includes("Other task queues") ? d.mrate : d.orate,



                    }))
                    .filter((item, index, self) =>
                        index === self.findIndex((t) => t.label === item.label)
                    ),
            ];
            console.log(branchdata, "branchdata")
            // setCategories(branchdata);
            setOrateDrop(branchdata);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };



    const fetchAllSubCategory = async (category, orate) => {
        setPageName(!pageName)
        try {
            let res_freq = await axios.post(SERVICE.UNITRATE_PRODUCTION_ORATE_SUBCATEGORY, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                category: category,
                orate: orate,


            });

            const branches = res_freq.data.unitsrate;
            const branchdata = [
                ...branches
                    .map((d) => ({
                        ...d,
                        label: d.subcategory,
                        value: d.subcategory,
                    }))
                    .filter((item, index, self) =>
                        index === self.findIndex((t) => t.label === item.label)
                    ),
            ];
            console.log(branchdata, "branchdata")
            setSubcategories(branchdata);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };


    const fetchAllSubCategoryEdit = async (cat) => {
        setPageName(!pageName)
        try {
            let res_module = await axios.get(SERVICE.SUBCATEGORYPROD_LIST_LIMITED, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            const branches = res_module.data.subcategoryprod.filter(data => cat == data.categoryname);
            const branchdata = [...branches.map((d) => ({
                ...d,
                label: d.name,
                value: d.name,
            }))];
            setSubcategoriesEdit(branchdata);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };





    //get all category.
    // const fetchAllSubCategory = async (cat) => {
    //     setPageName(!pageName)
    //     try {
    //         let res_module = await axios.get(SERVICE.SUBCATEGORYPROD_LIST_LIMITED, {
    //             headers: {
    //                 'Authorization': `Bearer ${auth.APIToken}`
    //             },
    //         });
    //         const branches = res_module.data.subcategoryprod.filter(data => cat == data.categoryname);
    //         const branchdata = [...branches.map((d) => ({
    //             ...d,
    //             label: d.name,
    //             value: d.name,
    //         }))];
    //         setSubcategories(branchdata);
    //     } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    // };

    const fetchorate = async (proj) => {
        setPageName(!pageName)
        try {
            let res_module = await axios.post(SERVICE.ORATE_VALUE_BY_QUEUEMASTER, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                vendor: managecategoryEdit.vendor,
                category: proj,
                // subcategory: proj
            });
            const orate = res_module.data.queuetypemasters ? res_module.data.queuetypemasters.orate : ""
            setManageCategoryEdit({
                ...managecategoryEdit,
                category: proj,
                orate: orate,
            });

        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };





    const handleSubCategoryChangeFrom = (options) => {
        setSelectedSubCategoryForm(options); // Save full options array
        const values = options.map((option) => option.value); // Extract values
        setSelectedSubCategoryValues(values);
        // fetchorateDialog(values); // Pass array of subcategory values
    };
    const handleSubCategoryFromEdit = (options) => {
        setSelectedSubCategoryEditForm(options);
        setSelectedSubCategoryFormEdit(options.map((a, index) => {
            return a.value;
        }))
    };
    const customValueRendererSubcategoryFrom = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Subcategory";
    };




    const handleTypeChangeFrom = (selected) => {
        const isOtherTaskSelected = selected.some(
            (option) => option.value === "Other task queues"
        );

        // If "Other task queues" is selected, keep only that option
        if (isOtherTaskSelected) {
            setSelectedTypeForm(
                selected.filter((option) => option.value === "Other task queues")
            );
        } else {
            // Otherwise, update normally
            setSelectedTypeForm(selected);
        }
        // setSelectedTypeForm(options)
    };

    const handleOrate = (options) => {
        setSelectedOrate(options)
        setSelectedSubCategoryValues([])
        setSelectedSubCategoryForm([])
        const selectedValues = options.map((a) => a.value);
        fetchAllSubCategory(managecategory.category, selectedValues);
    };
    const customValueRendererOrate = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Orate";
    };

    const handleTypeChangeFromEdit = (options) => {
        setSelectedTypeFormEdit(options)
    };
    const customValueRendererTypeFrom = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Type";
    };
    const customValueRendererTypeFromEdit = (valueCate, _employeename) => {
        return valueCate.length ? valueCate.map(({ label }) => label).join(", ") : "Please Select Type";
    };




    const fetchUnitRate = async () => {
        try {
            let res_freq = await axios.get(SERVICE.PRODUCTION_UNITRATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let unitsRates = res_freq?.data?.unitsrate;

            setUnitRateArray(unitsRates);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        // fetchAllCategory();
        // fetchAllCategoryEdit();
        fetchAllTypemaster();
        fetchUnitRate();
    }, [])




    return (
        <Box>
            <Headtitle title={"Queue Type Master"} />
            <PageHeading
                title="Queue Type Master"
                modulename="Production"
                submodulename="SetUp"
                mainpagename="Queue Type Master"
                subpagename=""
                subsubpagename=""
            />

            {isUserRoleCompare?.includes("aqueuetypemaster") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Add Queue Type Master
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Type <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <MultiSelect
                                            // options={typeMaster}
                                            options={typeMaster.map((option) => ({
                                                ...option,
                                                disabled:
                                                    selectedTypeFrom.some((selected) => selected.value === "Other task queues") &&
                                                    option.value !== "Other task queues",
                                            }))}
                                            value={selectedTypeFrom}
                                            onChange={handleTypeChangeFrom}
                                            valueRenderer={customValueRendererTypeFrom}
                                            labelledBy="Please Select Type"
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Vendor <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            options={vendors}
                                            value={{ label: managecategory.vendor, value: managecategory.vendor }}
                                            onChange={(e) => {
                                                setManagecategory({
                                                    ...managecategory,
                                                    vendor: e.value,
                                                    category: "Please Select Category",
                                                });
                                                setOrateDrop([])
                                                setSelectedOrate([])
                                                setSelectedSubCategoryForm([])
                                                fetchAllCategory(e.value)
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Category <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                            maxMenuHeight={250}
                                            options={categoryOpt}
                                            placeholder="Please Select Category"
                                            value={{ label: managecategory.category, value: managecategory.category }}
                                            onChange={(e) => {
                                                setManagecategory({
                                                    ...managecategory,
                                                    category: e.value,
                                                });
                                                fetchAllOrate(managecategory.vendor, e.value)
                                                setSubcategories([])
                                                setSelectedOrate([])
                                                setSelectedSubCategoryForm([])
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>

                                            Orate <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        {/* <Selects
                                            maxMenuHeight={250}
                                            options={Oratedrop}
                                            value={{ label: managecategory.orate, value: managecategory.orate }}
                                            onChange={(e) => {
                                                setManagecategory({
                                                    ...managecategory,
                                                    orate: e.value,
                                                    subcategory: "Please Select SubCategory",
                                                });
                                                setSelectedSubCategoryValues([])
                                                setSelectedSubCategoryForm([])
                                                fetchAllSubCategory(managecategory.category, e.value);
                                            }}
                                        /> */}
                                        <MultiSelect options={Oratedrop}
                                            value={selectedOrate}
                                            onChange={handleOrate}
                                            valueRenderer={customValueRendererOrate}
                                            labelledBy="Please Select Orate"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            Sub Category<b style={{ color: "red" }}>*</b>{" "}
                                        </Typography>
                                        <MultiSelect options={subCtegoryOpt}
                                            value={selectedSubCategoryFrom}
                                            onChange={handleSubCategoryChangeFrom}
                                            valueRenderer={customValueRendererSubcategoryFrom}
                                            labelledBy="Please Select SubCategory"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item md={3} xs={12} sm={12} lg={3}>
                                    <FormControl fullWidth size="small">
                                        <Typography>
                                            New-Rate<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <OutlinedInput id="component-outlined" type="Number" sx={userStyle.hideArrows} value={managecategory.newrate} onChange={handleChangemrate} />
                                    </FormControl>
                                </Grid>

                                <Grid item md={2} sm={6} xs={6} marginTop={3}>
                                    <LoadingButton
                                        onClick={handleSubmit}
                                        loading={loadingdeloverall}
                                        sx={buttonStyles.buttonsubmit}
                                        loadingPosition="end"
                                        variant="contained"
                                    >
                                        Submit
                                    </LoadingButton>
                                    {/* <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={handleSubmit} >Submit</Button> */}
                                </Grid>
                                <Grid item md={2.5} sm={6} xs={12} marginTop={3}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                            <br />
                        </>
                    </Box>
                </>
            )}
            <Box>
                {/* Edit DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth={true}
                    maxWidth="lg"
                    sx={{
                        overflow: "visible",
                        "& .MuiPaper-root": {
                            overflow: "visible",
                        },
                        marginTop: "95px"
                    }}
                >
                    <Box sx={{ padding: "20px" }}>
                        <>
                            <form onSubmit={editSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <Typography sx={userStyle.HeaderText}>
                                            Edit QueueType Master
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Type <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={typeMaster}
                                                value={{ label: managecategoryEdit.type, value: managecategoryEdit.type }}
                                                onChange={(e) => {
                                                    setManageCategoryEdit({
                                                        ...managecategoryEdit,
                                                        type: e.value,
                                                    });
                                                }}
                                            />

                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Vendor <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={vendorsEdit}
                                                value={{ label: managecategoryEdit.vendor, value: managecategoryEdit.vendor }}
                                                onChange={(e) => {
                                                    setManageCategoryEdit({
                                                        ...managecategoryEdit,
                                                        vendor: e.value,
                                                        category: "Please Select Category",
                                                    });

                                                    fetchAllCategoryEdit(e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Category <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={categoryOptedit}
                                                placeholder="Please Select Category"
                                                value={{ label: managecategoryEdit.category, value: managecategoryEdit.category }}
                                                onChange={(e) => {
                                                    fetchorate(e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12} lg={3}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                O-Rate
                                            </Typography>
                                            <OutlinedInput id="component-outlined" type="Number" sx={userStyle.hideArrows} value={managecategoryEdit.orate} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Sub Category<b style={{ color: "red" }}>*</b>{" "}
                                            </Typography>
                                            {/* <MultiSelect
                                                options={subCtegoryOpt}
                                                value={selectedSubCategoryEditFrom}
                                                onChange={handleSubCategoryFromEdit}
                                                valueRenderer={customValueRendererSubcategoryFrom}
                                                labelledBy="Please Select SubCategory"
                                            /> */}
                                            <Selects
                                                maxMenuHeight={250}
                                                options={subCtegoryOptedit}
                                                placeholder="Please Select Category"
                                                value={{ label: managecategoryEdit.subcategory, value: managecategoryEdit.subcategory }}
                                                onChange={(e) => {

                                                    fetchorate(e.value)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>


                                    <Grid item md={3} xs={12} sm={12} lg={3}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                New-Rate<b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput id="component-outlined" type="Number" sx={userStyle.hideArrows} value={managecategoryEdit.newrate} onChange={handleChangemrateEdit} />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <Button sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                                            Update
                                        </Button>
                                    </Grid>



                                    <Grid item md={3} xs={6} sm={6}>
                                        <Button sx={buttonStyles.btncancel} onClick={handleCloseModEdit}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                            <br />


                        </>
                    </Box>
                </Dialog>
            </Box>
            <br />
            {/* ****** Table Start ****** */}
            {isUserRoleCompare?.includes("lqueuetypemaster") && (

                <>
                    <Box sx={userStyle.container}>
                        {/* ******************************************************EXPORT Buttons****************************************************** */}
                        <Grid item xs={8}>
                            <Typography sx={userStyle.importheadtext}>
                                Type Master List
                            </Typography>
                        </Grid>
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
                                        <MenuItem value={groups?.length}>All</MenuItem>
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
                                    {isUserRoleCompare?.includes("excelqueuetypemaster") && (
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
                                    {isUserRoleCompare?.includes("csvqueuetypemaster") && (
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
                                    {isUserRoleCompare?.includes("printqueuetypemaster") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleprint}
                                            >
                                                &ensp;
                                                <FaPrint />
                                                &ensp;Print&ensp;
                                            </Button>
                                        </>
                                    )}
                                    {isUserRoleCompare?.includes("pdfqueuetypemaster") && (
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
                                    {isUserRoleCompare?.includes("imagequeuetypemaster") && (
                                        <>
                                            <Button
                                                sx={userStyle.buttongrp}
                                                onClick={handleCaptureImage}
                                            >
                                                <ImageIcon sx={{ fontSize: "15px" }} />{" "}
                                                &ensp;Image&ensp;
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item md={2} xs={6} sm={6}>
                                <Box>
                                    <AggregatedSearchBar
                                        columnDataTable={columnDataTable}
                                        setItems={setItems}
                                        addSerialNumber={addSerialNumber}
                                        setPage={setPage}
                                        maindatas={groups}
                                        setSearchedString={setSearchedString}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        paginated={false}
                                        totalDatas={groups}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <br />
                        <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
                            Show All Columns
                        </Button>
                        &ensp;
                        <Button
                            sx={userStyle.buttongrp}
                            onClick={handleOpenManageColumns}
                        >
                            Manage Columns
                        </Button>
                        &ensp;
                        {isUserRoleCompare?.includes("bdqueuetypemaster") && (
                            <Button
                                variant="contained"
                                sx={buttonStyles.buttonbulkdelete}
                                onClick={handleClickOpenalert}
                            >
                                Bulk Delete
                            </Button>
                        )}
                        <br />
                        {!loader ? (
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
                                <AggridTable
                                    rowDataTable={rowDataTable}
                                    columnDataTable={columnDataTable}
                                    columnVisibility={columnVisibility}
                                    page={page}
                                    setPage={setPage}
                                    pageSize={pageSize}
                                    totalPages={totalPages}
                                    setColumnVisibility={setColumnVisibility}
                                    isHandleChange={isHandleChange}
                                    items={items}
                                    selectedRows={selectedRows}
                                    setSelectedRows={setSelectedRows}
                                    gridRefTable={gridRefTable}
                                    paginated={false}
                                    filteredDatas={filteredDatas}
                                    // totalDatas={totalDatas}
                                    searchQuery={searchedString}
                                    handleShowAllColumns={handleShowAllColumns}
                                    setFilteredRowData={setFilteredRowData}
                                    filteredRowData={filteredRowData}
                                    setFilteredChanges={setFilteredChanges}
                                    filteredChanges={filteredChanges}
                                    gridRefTableImg={gridRefTableImg}
                                    itemsList={groups}
                                />
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

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> View QueueType Master</Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Category
                                    </Typography>
                                    <Typography>{viewcode.category}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Sub Category
                                    </Typography>
                                    <Typography>{viewcode.subcategory}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Type
                                    </Typography>
                                    <Typography>{viewcode.type}</Typography>
                                </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} lg={3}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        O-Rate
                                    </Typography>
                                    <Typography>{viewcode.orate}</Typography>                                        </FormControl>
                            </Grid>
                            <Grid item md={6} xs={12} sm={12} lg={3}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        New-Rate
                                    </Typography>
                                    <Typography>{viewcode.newrate}</Typography>                                        </FormControl>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Button
                                variant="contained"
                                sx={buttonStyles.btncancel}
                                onClick={handleCloseview}
                            >
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            {/* subcategory dialog */}

            <Dialog
                open={isEditOpensub}
                onClose={handleClickOpenEditSub}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
                maxWidth="lg"
                sx={{ marginTop: "95px" }}
            >
                <Box sx={{ padding: "20px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> Add QueueType Master</Typography>
                        <br /> <br />
                        {dialogData.map((data, index) => (
                            <Grid container spacing={2}>
                                <Grid item md={2.5} xs={12} sm={12} lg={2.5}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">
                                            Category
                                        </Typography>
                                        <Typography sx={{
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                            lineHeight: 'normal',
                                        }}>{data.category}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.5} xs={12} sm={12} lg={2.5}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">
                                            Sub Category
                                        </Typography>
                                        <Typography sx={{
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                            lineHeight: 'normal',
                                        }}>{data.subcategory}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2.5} xs={12} sm={12} lg={2.5}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">
                                            Type
                                        </Typography>
                                        <Typography sx={{
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                            lineHeight: 'normal',
                                        }}>{data.type}</Typography>
                                    </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12} lg={2}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6" >
                                            O-Rate
                                        </Typography>
                                        <Typography sx={{
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                            lineHeight: 'normal',
                                        }}>{data.orate}</Typography>                                        </FormControl>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12} lg={2}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6">
                                            New-Rate
                                        </Typography>
                                        {/* <Typography sx={{
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                            lineHeight: 'normal',
                                        }}>
                                            {data.newrate}
                                        </Typography>         */}
                                        <OutlinedInput id="component-outlined"
                                            type="Number" sx={userStyle.hideArrows}
                                            value={data.newrate}
                                            onChange={(e) => handleNewRateChange(index, e.target.value)} />

                                    </FormControl>


                                </Grid>
                            </Grid>
                        ))}
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={2} xs={12} sm={12} lg={2}>
                                {/* <Button
                                    onClick={handleSubmitDialog}
                                    sx={buttonStyles.buttonsubmit}

                                    variant="contained"
                                >
                                    Save
                                </Button> */}
                            </Grid>
                            <Grid item md={2} xs={12} sm={12} lg={2}>
                                <Button
                                    onClick={handleCloseModEditSub}
                                    // loading={loadingdeloverall}
                                    sx={buttonStyles.btncancel}

                                    variant="contained"
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog>

            {/* Reason of Leaving  */}
            <Dialog
                open={openviewalert}
                onClose={handleClickOpenviewalert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}> </Typography>
                        <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6"> Name</Typography>
                                </FormControl>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={8} xs={12} sm={12}>
                                    <FormControl fullWidth size="small">
                                        <Typography variant="h6"></Typography>

                                        <FormControl size="small" fullWidth>
                                            <TextField />
                                        </FormControl>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <br /> <br /> <br />
                        <Grid container spacing={2}>
                            <Grid item md={2} xs={12} sm={12}>
                                <Button
                                    variant="contained"
                                    sx={buttonStyles.buttonsubmit}
                                    onClick={handleCloseviewalert}
                                >
                                    Save
                                </Button>
                            </Grid>

                            <Grid item md={0.2} xs={12} sm={12}></Grid>
                            <Grid item md={2} xs={12} sm={12}>
                                <Button
                                    variant="contained"
                                    sx={buttonStyles.btncancel}
                                    onClick={handleCloseviewalert}
                                >
                                    {" "}
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </>
                </Box>
            </Dialog>

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
            {/* PRINT PDF EXCEL CSV */}
            <ExportData
                isFilterOpen={isFilterOpen}
                handleCloseFilterMod={handleCloseFilterMod}
                fileFormat={fileFormat}
                setIsFilterOpen={setIsFilterOpen}
                isPdfFilterOpen={isPdfFilterOpen}
                setIsPdfFilterOpen={setIsPdfFilterOpen}
                handleClosePdfFilterMod={handleClosePdfFilterMod}
                filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
                itemsTwo={groups ?? []}
                filename={"QueueTypeMaster"}
                exportColumnNames={exportColumnNames}
                exportRowValues={exportRowValues}
                componentRef={componentRef}
            />
            {/* INFO */}
            <InfoPopup
                openInfo={openInfo}
                handleCloseinfo={handleCloseinfo}
                heading="Queue Type Master Info"
                addedby={addedby}
                updateby={updateby}
            />
            {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpen}
                onClose={handleCloseMod}
                onConfirm={deleGroup}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
            <DeleteConfirmation
                open={isDeleteOpencheckbox}
                onClose={handleCloseModcheckbox}
                onConfirm={delGroupcheckbox}
                title="Are you sure?"
                confirmButtonText="Yes"
                cancelButtonText="Cancel"
            />
            {/* PLEASE SELECT ANY ROW */}
            <PleaseSelectRow
                open={isDeleteOpenalert}
                onClose={handleCloseModalert}
                message="Please Select any Row"
                iconColor="orange"
                buttonText="OK"
            />
            {/* EXTERNAL COMPONENTS -------------- END */}
        </Box>
    );
}

export default QueueTypeMaster;
