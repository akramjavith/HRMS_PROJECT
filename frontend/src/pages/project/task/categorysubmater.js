import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, FormControl, TableBody, TextField, TableRow, FormControlLabel, TableCell, Select,
    MenuItem, DialogContent, Grid, Dialog, DialogActions, Paper, Table, TableHead, TableContainer, Button,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { FaPrint, FaFilePdf, FaTrash, FaEdit } from "react-icons/fa";
import Selects from "react-select";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { ExportXL, ExportCSV } from "../../../components/Export";
import { StyledTableRow, StyledTableCell } from "../../../components/Table";
import { handleApiError } from "../../../components/Errorhandling";
import { useReactToPrint } from "react-to-print";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import { makeStyles } from "@material-ui/core";
import { FaPlus } from "react-icons/fa";
import Headtitle from "../../../components/Headtitle";
import { SERVICE } from '../../../services/Baseservice';
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import moment from 'moment-timezone';
import { AuthContext } from '../../../context/Appcontext';
import { UserRoleAccessContext } from '../../../context/Appcontext';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';


const useStyles = makeStyles((theme) => ({
    inputs: {
        display: "none",
    },
    preview: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: theme.spacing(2),
        "& > *": {
            margin: theme.spacing(1),
        },
    },
}));


function Catsubcategory() {
    const [categoryForm, setCategoryForm] = useState("");

    const [subcategorylist, setSubcategorylist] = useState([])
    const [SubcategoryEdit, setSubCategoryEdit] = useState([]);
    const [exceldata, setExceldata] = useState([]);
    const [newpriority, setNewpriority] = useState("");
    const { auth } = useContext(AuthContext);
    const { isUserRoleCompare } = useContext(UserRoleAccessContext);
    const { isUserRoleAccess } = useContext(UserRoleAccessContext);
    const [deleteCategory, setDeleteCategory] = useState({});
    // added the delete functionality state
    const [checkPointgroup, setCheckPointgroup] = useState([]);
    // added the edit functioanlity state
    const [ovProj, setOvProj] = useState("")
    const [getOverAllCount, setGetOverallCount] = useState("");
    const [ovProjcount, setOvProjcount] = useState(0)

    //Datatable
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(1);

    // view model
    const [openview, setOpenview] = useState(false);
    const handleClickOpenview = () => {
        setOpenview(true);
    };

    const handleCloseview = () => {
        setOpenview(false);
    };

    //check delete model
    const [isCheckOpen, setisCheckOpen] = useState(false);
    const handleClickOpenCheck = () => {
        setisCheckOpen(true);
    };
    const handleCloseCheck = () => {
        setisCheckOpen(false);
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

    // info model
    const [openInfo, setOpeninfo] = useState(false);
    const handleClickOpeninfo = () => {
        setOpeninfo(true);
    };
    const handleCloseinfo = () => {
        setOpeninfo(false);
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


    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setIsEditOpen(false);
        setEditingIndexcheckedit(-1);

    };
    const username = isUserRoleAccess.username;

    //Edit Button
    const editSubmit = (e) => {
        e.preventDefault();

    }
    let printsno = 1;
    const [todoscheck, setTodoscheck] = useState([]);
    const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
    const [editedTodocheck, setEditedTodocheck] = useState("");
    const [editedTododescheck, setEditedTododescheck] = useState("");
    const [editnewpriority, seteditNewpriority] = useState("");
    const [newTodoTitlecheck, setNewTodoTitlecheck] = useState("");

    const handleCreateTodocheck = () => {

        const newTodocheck = {
            label: newTodoTitlecheck || "",
        };
        setdeverrormsg("")
        setTodoscheck([...todoscheck, newTodocheck]);
        setNewTodoTitlecheck("")

    };

    const handleDeleteTodocheck = (index) => {
        const newTodoscheck = [...todoscheck];
        newTodoscheck.splice(index, 1);
        setTodoscheck(newTodoscheck);
    };

    const handleEditTodocheck = (index) => {

        setEditingIndexcheck(index);
        setEditedTododescheck(todoscheck[index].label);
    };

    const handleUpdateTodocheck = () => {
        const label = editedTododescheck;
        if (
            !todoscheck.find(
                (todo, index) =>
                    index !== editingIndexcheck &&
                    todo.label.toLowerCase() === editedTododescheck.toLowerCase()
            )
        ) {
            const newTodoscheck = [...todoscheck];
            newTodoscheck[editingIndexcheck].label = label;
            setTodoscheck(newTodoscheck);
            setEditingIndexcheck(-1);
            setEditedTodocheck("");
            setEditedTododescheck("");
            seteditNewpriority("");
        }
        else {
            const newTodoscheck = [...todoscheck];
            newTodoscheck[editingIndexcheck].label = "";

            setTodoscheck(newTodoscheck);
            setEditingIndexcheck(-1);
            setEditedTodocheck("");
            setEditedTododescheck("");
            seteditNewpriority("");
        }
    };


    const [todoscheckedit, setTodoscheckedit] = useState([]);
    const [editingIndexcheckedit, setEditingIndexcheckedit] = useState(-1);
    const [editedTododescheckedit, setEditedTododescheckedit] = useState("");
    const [allCategoryEdit, setAllCategoryedit] = useState("");
    const [newTododescheckedit, setNewTododescheckedit] = useState("");



    const handleCreateTodocheckedit = () => {

        const newTodocheck = {
            label: newTododescheckedit || "",
        };
        setdeverrormsg("")
        setTodoscheckedit([...todoscheckedit, newTodocheck]);
        setNewTododescheckedit("");

    };

    const handleDeleteTodocheckedit = (index) => {
        const newTodoscheck = [...todoscheckedit];
        newTodoscheck.splice(index, 1);
        setTodoscheckedit(newTodoscheck);
    };

    const handleEditTodocheckedit = (index) => {

        setEditingIndexcheckedit(index);
        setEditedTododescheckedit(todoscheckedit[index].label);
    };

    const handleUpdateTodocheckedit = () => {
        const label = editedTododescheckedit;
        if (
            !todoscheckedit.find(
                (todo, index) =>
                    index !== editingIndexcheckedit &&
                    todo.label.toLowerCase() === editedTododescheckedit.toLowerCase()
            )
        ) {
            const newTodoscheck = [...todoscheckedit];
            newTodoscheck[editingIndexcheckedit].label = label;
            setTodoscheckedit(newTodoscheck);
            setEditingIndexcheckedit(-1);
            setEditedTododescheckedit("");
        }
        else {
            const newTodoscheck = [...todoscheckedit];
            newTodoscheck[editingIndexcheckedit].label = "";
            setTodoscheckedit(newTodoscheck);
            setEditingIndexcheckedit(-1);
            setEditedTododescheckedit("");
        }
    };



    // Delete model
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const handleClickOpen = () => {
        setIsDeleteOpen(true);
    };
    const handleCloseMod = () => {
        setIsDeleteOpen(false);
    };
    // get all taskcheckdefaultRoute
    const fetchTaskcheckdefault = async () => {
        try {
            let res = await axios.get(
                SERVICE.SUBCATEGORY,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }
            );
            setSubcategorylist(res.data.category)
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const handlecloseSubmit = (e) => {
        e.preventDefault();
        setCategoryForm("")
        setTodoscheck([])
        setNewTodoTitlecheck("")
        // sendRequest();
    };
    //create alert for same name
    let todoCheck = todoscheck.length > 0 ? todoscheck.some((d) => d.label && d.label.toLowerCase() === newTodoTitlecheck.toLowerCase()) ? true : false : "";
    //edit (create) alert for same name
    let todoCheckCreateEdit = todoscheck.length > 0 ? todoscheck.some((d, index) => { return index != editingIndexcheck && (d.label && d.label.toLowerCase() === (editedTododescheck).toLowerCase()) }) ? true : false : "";
    //edit alert for same name
    let todoCheckEdit = todoscheckedit.length > 0 ? todoscheckedit.some((d) => d.label && d.label.toLowerCase() === (newTododescheckedit).toLowerCase()) ? true : false : "";
    //edit (edit) alert for same name
    let todoCheckEditededit = todoscheckedit.length > 0 ? todoscheckedit.some((d, index) => index != editingIndexcheckedit && (d.label && d.label.toLowerCase() === (editedTododescheckedit).toLowerCase())) ? true : false : "";
    //this is add database
    const sendRequest = async () => {
        try {

            let res = await axios.post(SERVICE.SUBCATEGORY_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                categoryname: String(categoryForm),
                subcategoryname: [...todoscheck],
                addedby: [
                    {
                        name: String(username),
                        date: String(new Date()),

                    },
                ],
            }
            );
            await fetchTaskcheckdefault();
            setCategoryForm("")
            setTodoscheck([])
            setNewTodoTitlecheck("")
            setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "100px", color: "orange" }}
                  />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Added Successfully"}
                  </p>
                </>
              );
              handleClickOpenerr();
            } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const sendRequestCreate = (e) => {
        e.preventDefault();
        const isNameMatch = subcategorylist.some(item => item.categoryname.toLowerCase() === (categoryForm).toLowerCase());

        if (categoryForm === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please enter Category Name !"}</p>
                </>
            );
            handleClickOpenerr();

        }
        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Name already exits!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            sendRequest();
        }
    }


    const getCode = async (id) => {
        try {
            let res = await axios.get(
                `${SERVICE.SUBCATEGORY_SINGLE}/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }
            );
            setSubCategoryEdit(res?.data?.scategory);
            setTodoscheckedit(res?.data?.scategory.subcategoryname)
            setOvProj(res?.data?.scategory.categoryname);
            getOverallEditSection(res?.data?.scategory.categoryname);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(
                `${SERVICE.SUBCATEGORY_SINGLE}/${e}`,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }
            );
            setSubCategoryEdit(res?.data?.scategory);
            setTodoscheckedit(res?.data?.scategory.subcategoryname)
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get all taskcheckdefaultRoute
    const fetchTaskcheckdefaultAll = async () => {
        try {
            let res = await axios.get(
                SERVICE.SUBCATEGORY,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }
            );
            setAllCategoryedit(res?.data?.category.filter(item => item._id !== SubcategoryEdit._id));
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };



    const rowData = async (id, categoryname) => {
        try {
            let res = await axios.get(
                `${SERVICE.SUBCATEGORY_SINGLE}/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }
            );
            setDeleteCategory(res?.data?.scategory);

            let rescheckgrp = await axios.post(SERVICE.CHECKPOINTGROUP_CHECK, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                checkgroupname: String(categoryname)
            })

            setCheckPointgroup(rescheckgrp?.data?.checkptgroups)

            if ((rescheckgrp?.data?.checkptgroups).length > 0
               

            ) {
                handleClickOpenCheck();
            }
            else {
                handleClickOpen();
            }

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // Alert delete popup
    let deletecategory = deleteCategory._id;
    const delTaskcheckdefault = async () => {
        try {
            await axios.delete(
                `${SERVICE.SUBCATEGORY_SINGLE}/${deletecategory}`,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }
            );
            await fetchTaskcheckdefault();
            handleCloseMod();
            setPage(1);
            setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "100px", color: "orange" }}
                  />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Deleted Successfully"}
                  </p>
                </>
              );
              handleClickOpenerr();
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}

    };


    //Desigantion updateby edit page...
    let updateby = SubcategoryEdit?.updatedby;
    let addedby = SubcategoryEdit?.addedby;


    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "categorylist",
        pageStyle: "print",
    });

    // Excel
    const fileName = "category and Subcategory";

    const categorysuball = subcategorylist?.map((item, index) => ({
        ...item,
        catename: item.categoryname,
        subcatename: (item.subcategoryname)?.map((item, i) => `${i + 1 + ". "}` + item.label + " ").toString(),
    }));


    // get particular columns for export excel
    const getexcelDatas = async () => {
        try {
            let response = await axios.get(SERVICE.SUBCATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            var data = categorysuball.map((t, index) => ({
                Sno: index + 1,
                categoryname: t.catename,
                subcategoryname: t.subcatename,
            }));
            setExceldata(data);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const handleEditsubmit = (e) => {
        e.preventDefault();
        fetchTaskcheckdefaultAll();
        const isNameMatch = allCategoryEdit.some(item => item.categoryname.toLowerCase() === (SubcategoryEdit.categoryname).toLowerCase());
        if (SubcategoryEdit.categoryname === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please enter Category Name !"}</p>
                </>
            );
            handleClickOpenerr();

        } else if (todoscheckedit.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                    <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Please add subcCategory Name !"}</p>
                </>
            );
            handleClickOpenerr();

        }
        else if (SubcategoryEdit.categoryname != ovProj && ovProjcount > 0) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {getOverAllCount}
                    </p>
                </>
            );
            handleClickOpenerrpop()
        }

        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Name already exits!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            sendEditRequest();
        }
    }

    let editid = SubcategoryEdit._id

    //this is add database
    const sendEditRequest = async () => {
        try {

            let res = await axios.put(`${SERVICE.SUBCATEGORY_SINGLE}/${editid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

                categoryname: String(SubcategoryEdit.categoryname),
                subcategoryname: [...todoscheckedit], 
                updatedby: [
                    ...updateby, {
                        name: String(username),
                        date: String(new Date()),
                    },
                ],
            }
            );
            setSubCategoryEdit({ categoryname: "" })
            setTodoscheckedit([""])
            await fetchTaskcheckdefaultAll();
            await getOverallEditSectionUpdate();
            handleCloseModEdit()
            setShowAlert(
                <>
                  <ErrorOutlineOutlinedIcon
                    sx={{ fontSize: "100px", color: "orange" }}
                  />
                  <p style={{ fontSize: "20px", fontWeight: 900 }}>
                    {"Updated Successfully"}
                  </p>
                </>
              );
              handleClickOpenerr();
            } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //overall edit section for all pages 
    const getOverallEditSection = async (e) => {
        try {

            let res = await axios.post(SERVICE.OVERALL_SUBCATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                oldname: e,
            });
          
            setOvProjcount(res.data.count)
            setGetOverallCount(`The ${e} is linked in ${res.data.checkptgroups.length > 0}  ? "checkpoints group ," : ""}
 
    whether you want to do changes ..??`)
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };
    //overall edit section for all pages 
    const getOverallEditSectionUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.OVERALL_SUBCATEGORY, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                oldname: ovProj,
            });
            sendEditRequestOverall(res.data.checkptgroups)
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    const sendEditRequestOverall = async (category) => {

        try {
            if (category.length > 0) {
                let answ = category.map((d, i) => {
                    
                    let res = axios.put(`${SERVICE.CHECKPOINTGROUP_SINGLE}/${d._id}`, {
                        headers: {
                            'Authorization': `Bearer ${auth.APIToken}`
                        },
                        category: String(SubcategoryEdit.categoryname),

                    });

                })

            }

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    useEffect(() => {
        fetchTaskcheckdefault();
    }, [subcategorylist])

    useEffect(() => {
        fetchTaskcheckdefault();
        fetchTaskcheckdefaultAll();
    }, [])

    useEffect(() => {

        fetchTaskcheckdefaultAll();
    }, [isEditOpen, SubcategoryEdit])

    useEffect(() => {
        getexcelDatas();
    }, [subcategorylist])

    //pdf..
    const columns = [

        { title: "categoryname", field: "catename" },

        { title: "Subcategoryname", field: "subcatename" },

    ]

    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 6,
            },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: categorysuball,
        });
        doc.save("CatSubcategory.pdf");
    };


    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = subcategorylist?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [subcategorylist]);

    //table sorting
    const [sorting, setSorting] = useState({ column: "", direction: "" });

    const handleSorting = (column) => {
        const direction =
            sorting.column === column && sorting.direction === "asc" ? "desc" : "asc";
        setSorting({ column, direction });
    };

    const sortedData = items?.sort((a, b) => {
        if (sorting.direction === "asc") {
            return a[sorting.column] > b[sorting.column] ? 1 : -1;
        } else if (sorting.direction === "desc") {
            return a[sorting.column] < b[sorting.column] ? 1 : -1;
        }
        return 0;
    });

    const renderSortingIcon = (column) => {
        if (sorting.column !== column) {
            return (
                <>
                    <Box style={{ color: "#bbb6b6" }}>
                        <Grid style={{ height: "6px", fontSize: "1.6rem" }}>
                            <ArrowDropUpOutlinedIcon />
                        </Grid>
                        <Grid style={{ height: "6px", fontSize: "1.6rem" }}>
                            <ArrowDropDownOutlinedIcon />
                        </Grid>
                    </Box>
                </>
            );
        } else if (sorting.direction === "asc") {
            return (
                <>
                    <Box>
                        <Grid style={{ height: "6px" }}>
                            <ArrowDropUpOutlinedIcon
                                style={{ color: "black", fontSize: "1.6rem" }}
                            />
                        </Grid>
                        <Grid style={{ height: "6px" }}>
                            <ArrowDropDownOutlinedIcon
                                style={{ color: "#bbb6b6", fontSize: "1.6rem" }}
                            />
                        </Grid>
                    </Box>
                </>
            );
        } else {
            return (
                <>
                    <Box>
                        <Grid style={{ height: "6px" }}>
                            <ArrowDropUpOutlinedIcon
                                style={{ color: "#bbb6b6", fontSize: "1.6rem" }}
                            />
                        </Grid>
                        <Grid style={{ height: "6px" }}>
                            <ArrowDropDownOutlinedIcon
                                style={{ color: "black", fontSize: "1.6rem" }}
                            />
                        </Grid>
                    </Box>
                </>
            );
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
            value.toString().toLowerCase().startsWith(searchQuery.toLowerCase())
        )
    );

    const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);

    const totalPages = Math.ceil(filteredDatas?.length / pageSize);

    const visiblePages = Math.min(totalPages, 3);

    const firstVisiblePage = Math?.max(1, page - 1);
    const lastVisiblePage = Math?.min(
        firstVisiblePage + visiblePages - 1,
        totalPages
    );

    const pageNumbers = [];

    const indexOfLastItem = page * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;

    for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
        pageNumbers.push(i);
    }






    const [deverrormsg, setdeverrormsg] = useState("");

    return (
        <Box>
            {/* ****** Header Content ****** */}
            <Headtitle title={'Checkpoint Category Master'} />
            <Typography sx={userStyle.HeaderText}>Checkpoint Category Master</Typography>
            <>
                <Box sx={userStyle.dialogbox}>
                    <form onSubmit={sendRequestCreate}>
                        <Typography sx={userStyle.HeaderText}>Checkpoint Category Master</Typography>

                        <Grid container spacing={2}>


                            <Grid item md={6} xs={12} sm={12}>
                                <Typography>Category Name <b style={{ color: "red" }}>*</b></Typography>
                                <FormControl fullWidth size="small">
                                    <OutlinedInput
                                        id="component-outlined"
                                        type="text"
                                        placeholder="categoryname"
                                        value={categoryForm}
                                        onChange={(e) => {
                                            setCategoryForm(e.target.value)
                                        }}
                                    />
                                </FormControl>
                            </Grid><br /><br />
                        </Grid>
                        <br />
                        <Typography sx={userStyle.HeaderText}>Subcategory Master</Typography>
                        <Grid item md={12} xs={12} sm={12}>
                            <>
                                <br />
                                <Grid container spacing={1}>
                                    <Grid item md={12} sm={12} xs={12}>
                                        <Typography>SubCategory Name</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1}>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <TextField fullWidth
                                            size="small"
                                            variant="outlined"
                                            value={newTodoTitlecheck}
                                            onChange={(e) =>
                                                setNewTodoTitlecheck(
                                                    String(e.target.value)

                                                )
                                            }
                                        />
                                        {todoCheck ? <Typography sx={{ color: "red" }}>please Choose Different name</Typography> : ""}
                                    </Grid>
                                    <Grid item md={2} sm={1} xs={1}>
                                        {todoCheck ? "" : <Button
                                            variant="contained"
                                            style={{
                                                height: '30px',
                                                minWidth: '20px',
                                                padding: '19px 13px',
                                                color: 'white',
                                                background: 'rgb(25, 118, 210)'
                                            }}
                                            onClick={() => { newTodoTitlecheck && handleCreateTodocheck() }}
                                        >
                                            <FaPlus style={{ fontSize: "15px" }} />
                                        </Button>}
                                    </Grid>
                                </Grid>


                                <br />
                                <br />
                                <Box>
                                    {todoscheck.map((todo, index) => (
                                        <div key={index}>
                                            {editingIndexcheck === index ? (
                                                <Grid container spacing={1}>
                                                    <Grid item md={6} sm={6} xs={6}>
                                                        <TextField fullwidth
                                                            size="small"
                                                            variant="outlined"
                                                            value={editedTododescheck}
                                                            onChange={(e) =>
                                                                setEditedTododescheck(
                                                                    String(e.target.value)

                                                                )
                                                            }
                                                        />
                                                        {todoCheckCreateEdit ? <Typography sx={{ color: "red" }}>please Choose Different name</Typography> : ""}
                                                    </Grid>
                                                    <Grid item md={1.5} sm={1.5} xs={1.5}>
                                                        {todoCheckCreateEdit ? "" : <Button
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
                                                            onClick={handleUpdateTodocheck}
                                                        >
                                                            <CheckCircleIcon
                                                                style={{
                                                                    color: "#216d21",
                                                                    fontSize: "1.5rem",
                                                                }}
                                                            />
                                                        </Button>}
                                                    </Grid>
                                                    <Grid item md={1} sm={1} xs={1}>
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
                                            ) : (
                                                <Grid container spacing={1}>

                                                    <Grid item md={3} sm={3} xs={3}>
                                                        <Typography
                                                            variant="subtitle2"
                                                            color="textSecondary"
                                                        >
                                                            {todo.label}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={1.5} sm={1.5} xs={1.5}>
                                                        <Button
                                                            variant="contained"
                                                            style={{
                                                                minWidth: '20px',
                                                                minHeight: '41px',
                                                                background: 'transparent',
                                                                boxShadow: 'none',
                                                                marginTop: '-13px !important',
                                                                '&:hover': {
                                                                    background: '#f4f4f4',
                                                                    borderRadius: '50%',
                                                                    minHeight: '41px',
                                                                    minWidth: '20px',
                                                                    boxShadow: 'none',
                                                                },
                                                            }}
                                                            onClick={() => handleEditTodocheck(index)}
                                                        >
                                                            <FaEdit
                                                                style={{
                                                                    color: "#1976d2",
                                                                    fontSize: "1.2rem",
                                                                }}
                                                            />
                                                        </Button>
                                                    </Grid>
                                                    <Grid item md={1} sm={1} xs={1}>
                                                        <Button
                                                            variant="contained"
                                                            style={{
                                                                minWidth: '20px',
                                                                minHeight: '41px',
                                                                background: 'transparent',
                                                                boxShadow: 'none',
                                                                marginTop: '-13px !important',
                                                                '&:hover': {
                                                                    background: '#f4f4f4',
                                                                    borderRadius: '50%',
                                                                    minHeight: '41px',
                                                                    minWidth: '20px',
                                                                    boxShadow: 'none',
                                                                },
                                                            }}
                                                            onClick={() => handleDeleteTodocheck(index)}
                                                        >
                                                            <DeleteIcon
                                                                style={{
                                                                    color: "#b92525",
                                                                    fontSize: "1.2rem",
                                                                }}
                                                            />
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            )}
                                            <br />
                                        </div>
                                    ))}

                                </Box>
                            </>
                        </Grid>
                        <br />
                        <br />
                        <Grid container sx={userStyle.gridcontainer} spacing={2}>
                            <Grid item md={4} sm={12} xs={12}></Grid>
                            <Grid item md={2} sm={6} xs={6}>
                                {isUserRoleCompare[0]?.ccategorysub && (
                                    <>
                                        <Button sx={userStyle.buttonadd}
                                            disabled={editingIndexcheck != -1}

                                            variant="contained" type="submit">Save</Button>
                                    </>
                                )}
                            </Grid>
                            <Grid item md={4} sm={6} xs={6}>
                                <Button sx={userStyle.btncancel} variant="contained" onClick={handlecloseSubmit}>CANCEL</Button>
                            </Grid>
                            <Grid item md={2} sm={12} xs={12}></Grid>
                        </Grid>
                    </form>
                </Box>
                <Box>

                </Box>
                <br />
                {isUserRoleCompare[0]?.lcategorysub && (
                    <Box sx={userStyle.container}>
                        {/* ****** Header Buttons ****** */}
                        <Grid container style={{ justifyContent: "center" }}>
                            <Grid>
                                <Grid container sx={{ justifyContent: "center" }}>
                                    <Grid>
                                        {isUserRoleCompare[0]?.excelcategorysub && (
                                            <>
                                                <ExportXL csvData={exceldata} fileName={fileName} />
                                            </>
                                        )}
                                        {isUserRoleCompare[0]?.csvcategorysub && (
                                            <>
                                                <ExportCSV csvData={exceldata} fileName={fileName} />
                                            </>
                                        )}
                                        {isUserRoleCompare[0]?.printcategorysub && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                                    &ensp;
                                                    <FaPrint />
                                                    &ensp;Print&ensp;
                                                </Button>
                                            </>
                                        )}
                                        {isUserRoleCompare[0]?.pdfcategorysub && (
                                            <>
                                                <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                                                    <FaFilePdf />
                                                    &ensp;Export to PDF&ensp;
                                                </Button>
                                            </>
                                        )}
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Grid>
                        <br />
                        {/* ****** Table Start ****** */}
                        <>
                            {/* ******************************************************EXPORT Buttons****************************************************** */}
                            {/* ****** Table Grid Container ****** */}
                            <Grid style={userStyle.dataTablestyle}>
                                <Box>
                                    <label>Show entries:</label>
                                    <Select
                                        id="pageSizeSelect"
                                        value={pageSize}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 200,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        onChange={handlePageSizeChange}
                                        style={{ width: "77px" }}
                                    >
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={25}>25</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                        <MenuItem value={100}>100</MenuItem>
                                        <MenuItem value={subcategorylist.length}>All</MenuItem>
                                    </Select>
                                </Box>
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
                            {/* ****** Table start ****** */}
                            <TableContainer component={Paper}>
                                <Table
                                    width="2000px"
                                    aria-label="customized table"
                                    id="usertable"
                                >
                                    <TableHead style={{ fontWeight: "600" }}>
                                        <StyledTableRow>
                                            <StyledTableCell onClick={() => handleSorting("serialNumber")} ><Box sx={userStyle.tableheadstyle}> <Box>SI-No</Box><Box>{renderSortingIcon("serialNumber")}</Box> </Box></StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting("categoryname")}><Box sx={userStyle.tableheadstyle}> <Box>Category Name</Box><Box>{renderSortingIcon("categoryname")}</Box> </Box> </StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting("subcategoryname")} ><Box sx={userStyle.tableheadstyle}> <Box>SubCategory Name</Box><Box>{renderSortingIcon("subcategoryname")}</Box></Box>  </StyledTableCell>
                                            <StyledTableCell>Actions</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody align="left">
                                        {filteredData.length > 0 ? (
                                            filteredData?.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                    <StyledTableCell>{row.categoryname}</StyledTableCell>
                                                    <StyledTableCell>{(row.subcategoryname)?.map((item, i) => `${i + 1 + ". "}` + item.label + " ")}</StyledTableCell>
                                                    <StyledTableCell component="th" scope="row">
                                                        <Grid sx={{ display: "flex" }}>
                                                            {isUserRoleCompare[0]?.ecategorysub && (
                                                                <>
                                                                    <Button
                                                                        sx={userStyle.buttonedit}
                                                                        onClick={() => {
                                                                            handleClickOpenEdit();
                                                                            getCode(row._id);
                                                                        }}
                                                                    >
                                                                        <EditOutlinedIcon style={{ fontsize: "large" }} />
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {isUserRoleCompare[0]?.dcategorysub && (
                                                                <>
                                                                    <Button
                                                                        sx={userStyle.buttondelete}
                                                                        onClick={(e) => {
                                                                            rowData(row._id, row.categoryname);
                                                                        }}
                                                                    >
                                                                        <DeleteOutlineOutlinedIcon
                                                                            style={{ fontSize: "large" }}
                                                                        />
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {isUserRoleCompare[0]?.vcategorysub && (
                                                                <>
                                                                    <Button
                                                                        sx={userStyle.buttonedit}
                                                                        onClick={() => {
                                                                            handleClickOpenview();
                                                                            getviewCode(row._id);
                                                                        }}
                                                                    >
                                                                        <VisibilityOutlinedIcon style={{ fontsize: "large" }} />
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {isUserRoleCompare[0]?.icategorysub && (
                                                                <>
                                                                    <Button
                                                                        sx={userStyle.buttonedit}
                                                                        onClick={() => {
                                                                            handleClickOpeninfo();
                                                                            // getinfoCode(row._id);
                                                                        }}
                                                                    >
                                                                        <InfoOutlinedIcon style={{ fontsize: "large" }} />
                                                                    </Button>
                                                                </>
                                                            )}
                                                        </Grid>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))) : <StyledTableRow> <StyledTableCell colSpan={4} align="center">No Data Available</StyledTableCell> </StyledTableRow>}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box style={userStyle.dataTablestyle}>
                                <Box> Showing {(page - 1) * pageSize + 1} to{" "}  {Math.min(page * pageSize, filteredDatas.length)} of {filteredDatas.length} entries </Box>
                                <Box>
                                    <Button onClick={() => setPage(1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                        <FirstPageIcon />
                                    </Button>
                                    <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} sx={userStyle.paginationbtn}>
                                        <NavigateBeforeIcon />
                                    </Button>
                                    {pageNumbers?.map((pageNumber) => (
                                        <Button key={pageNumber} sx={userStyle.paginationbtn} onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "active" : ""} disabled={page === pageNumber}  > {pageNumber}  </Button>
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

                            {/* ****** Table End ****** */}
                        </>
                        {/* ****** Table End ****** */}
                    </Box>
                )}
            </>

            {/* ****** Table End ****** */}

            {/* Check Delete Modal */}
            <Box>
                <>
                    <Box>
                        {/* ALERT DIALOG */}
                        <Dialog
                            open={isCheckOpen}
                            onClose={handleCloseCheck}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} />
                                <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>
                                    {
                                        (checkPointgroup?.length > 0
                                            //   && checkCashbook?.length > 0
                                            //   && checkVoucher?.length > 0
                                        ) ? (
                                            <span style={{ fontWeight: '700', color: '#777' }}>
                                                {`${deleteCategory?.categoryname} `}  was linked in CategoryPoint Group,
                                            </span>
                                        ) : (
                                            (checkPointgroup?.length > 0
                                                // || checkCashbook?.length > 0
                                                // || checkVoucher?.length > 0
                                            ) && (
                                                <div>
                                                    <span style={{ fontWeight: '700', color: '#777' }}> {deleteCategory?.categoryname}</span> <span > was linked in </span>
                                                    {checkPointgroup?.length > 0 && (
                                                        <span style={{ fontWeight: '700' }}>CategoryPoint Group , </span>
                                                    )}
                                                    {/* {checkCashbook?.length > 0 && (
                                <span style={{ fontWeight: '700' }}>Cashbook Register , </span>
                              )}
                              {checkVoucher?.length > 0 && (
                                <span style={{ fontWeight: '700' }}>Voucher, </span>
                              )}                        */}
                                                </div>
                                            )
                                        )
                                    }
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseCheck} autoFocus variant="contained" color='error'> OK </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </>
            </Box >


            {/* Delete Modal */}
            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isDeleteOpen}
                    onClose={handleCloseMod}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        style={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <ErrorOutlineOutlinedIcon
                            style={{ fontSize: "80px", color: "orange" }}
                        />
                        <Typography variant="h5" style={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button style={{
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

                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Box>
                {/* ALERT DIALOG */}
                <Dialog
                    open={isEditOpen}
                    onClose={handleCloseModEdit}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="sm"
                    fullWidth={true}
                >
                    <DialogContent >
                        <Box >
                            <>

                                <Typography sx={userStyle.HeaderText}>
                                    Edit CheckPoints Category
                                </Typography>
                                <br />

                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Category Name <b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                aria-label="maximum height"
                                                minRows={5}
                                                style={{ width: "100%" }}
                                                value={SubcategoryEdit.categoryname}
                                                onChange={(e) => {
                                                    setSubCategoryEdit({
                                                        ...SubcategoryEdit,
                                                        categoryname: e.target.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={12} xs={12} sm={12}>

                                        <Typography>Subcategory Name</Typography>
                                        <br />
                                        <Grid container spacing={1}>
                                            <Grid item md={8} sm={8} xs={8}>
                                                <TextField fullWidth
                                                    size="small"
                                                    variant="outlined"
                                                    value={newTododescheckedit}
                                                    onChange={(e) =>
                                                        setNewTododescheckedit(
                                                            String(e.target.value)

                                                        )
                                                    }

                                                />
                                                {todoCheckEdit ? <Typography sx={{ color: "red" }}>please Choose Different name</Typography> : ""}
                                            </Grid>
                                            <Grid item md={2} sm={2} xs={2}>
                                                {todoCheckEdit ? "" :
                                                    <Button
                                                        variant="contained"
                                                        style={{
                                                            height: '30px',
                                                            minWidth: '20px',
                                                            padding: '19px 13px',
                                                            color: 'white',
                                                            background: 'rgb(25, 118, 210)'
                                                        }}
                                                        onClick={() => { newTododescheckedit && handleCreateTodocheckedit() }}
                                                    >
                                                        <FaPlus style={{ fontSize: "15px" }} />
                                                    </Button>}
                                            </Grid>
                                        </Grid>
                                        <br />  <br />
                                        {

                                            todoscheckedit?.map((todo, index) => (
                                                <div key={index}>
                                                    {editingIndexcheckedit === index ? (
                                                        <Grid container spacing={1}>
                                                            <Grid item md={8} sm={8} xs={8}>
                                                                <TextField fullwidth
                                                                    size="small"
                                                                    variant="outlined"
                                                                    value={editedTododescheckedit}
                                                                    onChange={(e) =>
                                                                        setEditedTododescheckedit(
                                                                            String(e.target.value)

                                                                        )
                                                                    }

                                                                />
                                                                {todoCheckEditededit ? <Typography sx={{ color: "red" }}>please Choose Different name</Typography> : ""}

                                                            </Grid>
                                                            <Grid item md={1.5} sm={1.5} xs={1.5}>
                                                                {todoCheckEditededit ? "" : <Button
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
                                                                    onClick={handleUpdateTodocheckedit}
                                                                >
                                                                    <CheckCircleIcon
                                                                        style={{
                                                                            color: "#216d21",
                                                                            fontSize: "1.5rem",
                                                                        }}
                                                                    />
                                                                </Button>}
                                                            </Grid>
                                                            <Grid item md={1} sm={1} xs={1}>
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
                                                                    onClick={() => setEditingIndexcheckedit(-1)}
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
                                                    ) : (
                                                        <Grid container spacing={1}>

                                                            <Grid item md={8} sm={8} xs={8}>
                                                                <Typography
                                                                    variant="subtitle2"
                                                                    color="textSecondary"
                                                                >
                                                                    {todo.label}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item md={1.5} sm={1.5} xs={1.5}>
                                                                <Button
                                                                    variant="contained"
                                                                    style={{
                                                                        minWidth: '20px',
                                                                        minHeight: '41px',
                                                                        background: 'transparent',
                                                                        boxShadow: 'none',
                                                                        marginTop: '-13px !important',
                                                                        '&:hover': {
                                                                            background: '#f4f4f4',
                                                                            borderRadius: '50%',
                                                                            minHeight: '41px',
                                                                            minWidth: '20px',
                                                                            boxShadow: 'none',
                                                                        },
                                                                    }}
                                                                    onClick={() => handleEditTodocheckedit(index)}
                                                                >
                                                                    <FaEdit
                                                                        style={{
                                                                            color: "#1976d2",
                                                                            fontSize: "1.2rem",
                                                                        }}
                                                                    />
                                                                </Button>
                                                            </Grid>
                                                            <Grid item md={1} sm={1} xs={1}>
                                                                <Button
                                                                    variant="contained"
                                                                    style={{
                                                                        minWidth: '20px',
                                                                        minHeight: '41px',
                                                                        background: 'transparent',
                                                                        boxShadow: 'none',
                                                                        marginTop: '-13px !important',
                                                                        '&:hover': {
                                                                            background: '#f4f4f4',
                                                                            borderRadius: '50%',
                                                                            minHeight: '41px',
                                                                            minWidth: '20px',
                                                                            boxShadow: 'none',
                                                                        },
                                                                    }}
                                                                    onClick={() => handleDeleteTodocheckedit(index)}
                                                                >
                                                                    <DeleteIcon
                                                                        style={{
                                                                            color: "#b92525",
                                                                            fontSize: "1.2rem",
                                                                        }}
                                                                    />
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    )}
                                                    <br />
                                                </div>
                                            ))

                                        }

                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container spacing={2}>
                                    <Grid item lg={4} md={4} xs={12} sm={12}>
                                        <Button variant="contained" disabled={editingIndexcheckedit != -1} onClick={handleEditsubmit}>
                                            Update
                                        </Button>
                                    </Grid>
                                    <Grid item lg={4} md={4} xs={12} sm={12}>
                                        <Button sx={userStyle.btncancel} onClick={handleCloseModEdit}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                </Grid>

                            </>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Box>

            {/* ALERT DIALOG  OVERALLEDIT */}
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
                        <Button variant="contained" style={{
                            padding: '7px 13px',
                            color: 'white',
                            background: 'rgb(25, 118, 210)'
                        }} onClick={() => {
                            sendEditRequest();
                            handleCloseerrpop();
                        }}>
                            ok
                        </Button>
                        <Button
                            style={{
                                backgroundColor: '#f4f4f4',
                                color: '#444',
                                boxShadow: 'none',
                                borderRadius: '3px',
                                padding: '7px 13px',
                                border: '1px solid #0000006b',
                                '&:hover': {
                                    '& .css-bluauu-MuiButtonBase-root-MuiButton-root': {
                                        backgroundColor: '#f4f4f4',
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

            {/* view model */}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
            >
                <Box style={{ width: "650px", padding: "20px 50px" }}>
                    <Box>
                        <Typography sx={userStyle.HeaderText}>View CheckPoints Master Page </Typography>
                        <br />
                        <br />
                        <>
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography variant="h6">Category Name</Typography>
                                    <Typography>{SubcategoryEdit.categoryname}</Typography>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography variant="h6">SubCategory Name</Typography>
                                    <Typography>{(SubcategoryEdit.subcategoryname)?.map((item, i) => `${i + 1 + ". "}` + item.label + " ")}</Typography>
                                </Grid>
                            </Grid>
                            <br />
                        </>


                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Button variant="contained" onClick={handleCloseview}>
                                {" "}
                                Back{" "}
                            </Button>
                        </Grid>
                        <Grid item md={1} xs={12} sm={12}></Grid>
                    </Box>
                </Box>
            </Dialog>



            {/* print layout */}

            <TableContainer component={Paper} sx={userStyle.printcls}>
                <Table
                    style={{ minWidth: 700 }}
                    aria-label="customized table"
                    id="usertable"
                    ref={componentRef}
                >
                    <TableHead style={{ fontWeight: "600" }}>
                        <TableRow>
                            <TableCell> S.NO</TableCell>
                            <TableCell>Category Name</TableCell>
                            <TableCell>SubCategory Name</TableCell>

                        </TableRow>
                    </TableHead>

                    <TableBody align="left">
                        {subcategorylist &&
                            subcategorylist.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{printsno++}</TableCell>
                                    <TableCell>{row.categoryname}</TableCell>
                                    <TableCell>{(row.subcategoryname)?.map((item, i) => `${i + 1 + ". "}` + item.label + " ")}</TableCell>
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
                    <DialogContent
                        style={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>


            {/* ALERT DIALOG */}
            <Dialog
                open={isDeleteOpen}
                onClose={handleCloseMod}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent
                    style={{ width: "350px", textAlign: "center", alignItems: "center" }}
                >
                    <ErrorOutlineOutlinedIcon
                        style={{ fontSize: "80px", color: "orange" }}
                    />
                    <Typography variant="h5" style={{ color: "red", textAlign: "center" }}>
                        Are you sure?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button style={{
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
                    }}
                        onClick={handleCloseMod}>
                        Cancel
                    </Button>
                    <Button
                        autoFocus
                        variant="contained"
                        color="error"
                        onClick={(e) => delTaskcheckdefault(SubcategoryEdit)}
                    >
                        {" "}
                        OK{" "}
                    </Button>
                </DialogActions>
            </Dialog>


            {/* this is info view details */}

            <Dialog
                open={openInfo}
                onClose={handleCloseinfo}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="lg"
            >
                <Box sx={{ width: "550px", padding: "20px 50px" }}>
                    <>
                        <Typography sx={userStyle.HeaderText}>
                            {" "}
                            CheckPoints Master Info
                        </Typography>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">addedby</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"UserName"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {addedby?.map((item, i) => (
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
                            <br />
                            <Grid item md={12} xs={12} sm={12}>
                                <FormControl fullWidth size="small">
                                    <Typography variant="h6">Updated by</Typography>
                                    <br />
                                    <Table>
                                        <TableHead>
                                            <StyledTableCell sx={{ padding: '5px 10px !important' }}>{"SNO"}.</StyledTableCell>
                                            <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"UserName"}</StyledTableCell>
                                            <StyledTableCell sx={{ padding: '5px 10px !important' }}> {"Date"}</StyledTableCell>
                                        </TableHead>
                                        <TableBody>
                                            {updateby?.map((item, i) => (
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
        </Box >
    );
}

export default Catsubcategory;