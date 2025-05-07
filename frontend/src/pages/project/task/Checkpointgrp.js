import React, { useState, useEffect, useRef, useContext } from "react";
import {
    Box, Typography, OutlinedInput, FormControl, TableBody, TextField, InputLabel, TableRow, FormControlLabel, TableCell, Select,
    MenuItem, DialogContent, TextareaAutosize, Grid, Dialog, DialogActions, Paper, Table, TableHead, TableContainer, Button,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
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
import DeleteIcon from "@mui/icons-material/Delete";
import { SERVICE } from "../../../services/Baseservice";
import { AUTH } from "../../../services/Authservice";
import { UserRoleAccessContext, AuthContext } from '../../../context/Appcontext'
import axios from "axios";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import moment from 'moment-timezone';
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


function Checkpointgrouping() {

    const [checkpointgroups, setcheckpointgroups] = useState({ category: "", subcategory: '', checkpointgrp: "" });
    const [checkpointgrps, setcheckpointgrps] = useState([]);
    const [checkpointgrpsall, setcheckpointgrpsall] = useState([]);
    const [checkpointedit, setcheckpointedit] = useState([]);
    const [viewdata, setViewdata] = useState([]);
    const [infodata, setInfodata] = useState([]);
    const [exceldata, setExceldata] = useState([]);

    const { auth } = useContext(AuthContext);

    const { isUserRoleCompare, allProjects, isUserRoleAccess } = useContext(UserRoleAccessContext);


    let username = isUserRoleAccess.username;

    const [subcategorylist, setSubcategorylist] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");


    const selectedCategoryData = subcategorylist.find(category => category.categoryname === selectedCategory);

    const handleCategoryChange = (event) => {
        const newSelectedCategory = event.target.value;
        setSelectedCategory(newSelectedCategory);
        setSelectedSubCategory("")
    };


    const handleSubCategoryChange = (event) => {
        const newSelectedCategory = event.target.value;
        setSelectedSubCategory(newSelectedCategory);
    };

    //edit categorry and subcategoryss
    const [selectedCategoryedit, setSelectedCategoryedit] = useState([]);
    const [selectedSubCategoryedit, setSelectedSubCategoryedit] = useState("");

    const selectedCategoryDataEdit = subcategorylist.find(category => category.categoryname === selectedCategoryedit);


    const handleCategoryChangeedit = (event) => {
        const newSelectedCategoryedit = event.target.value;
        setSelectedCategoryedit(newSelectedCategoryedit);
        setSelectedSubCategoryedit("")
    };


    const handleSubCategoryChangeedit = (event) => {
        const newSelectedCategoryedit = event.target.value;
        setSelectedSubCategoryedit(newSelectedCategoryedit);
    }

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

    let printsno = 1;

    const handleChangephonenumber = (e) => {
        // Regular expression to match only positive numeric values
        const regex = /^[0-9]+$/;  // Only allows positive integers
        // const regex = /^\d*\.?\d*$/;
        const inputValue = (e.target.value.slice(0, 4));
        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === '') {
            // Update the state with the valid numeric value
            setNewTodoTimecheck(inputValue);
        }
    };

    const handleChangephonenumberupdate = (e) => {

        // Regular expression to match only positive numeric values
        const regex = /^[0-9]+$/;  // Only allows positive integers
        // const regex = /^\d*\.?\d*$/;
        const inputValue = (e.target.value.slice(0, 4));
        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === '') {
            // Update the state with the valid numeric value
            setEditedTododescheck(inputValue);
        }
    };

    const handleChangephonenumberedit = (e) => {
        // Regular expression to match only positive numeric values
        const regex = /^[0-9]+$/;  // Only allows positive integers
        // const regex = /^\d*\.?\d*$/;
        const inputValue = (e.target.value.slice(0, 4));
        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === '') {
            // Update the state with the valid numeric value
            setNewTodoTimecheckedit(inputValue);
        }
    };

    const handleChangephonenumbereditupdate = (e) => {
        // Regular expression to match only positive numeric values
        const regex = /^[0-9]+$/;  // Only allows positive integers
        // const regex = /^\d*\.?\d*$/;
        const inputValue = (e.target.value.slice(0, 4));
        // Check if the input value matches the regex or if it's empty (allowing backspace)
        if (regex.test(inputValue) || inputValue === '') {
            // Update the state with the valid numeric value
            setEditedTododescheckedit(inputValue);
        }
    };

    const [todoscheck, setTodoscheck] = useState([]);
    const [editingIndexcheck, setEditingIndexcheck] = useState(-1);
    const [editedTododescheck, setEditedTododescheck] = useState(0);
    const [editcheckpoint, seteditcheckpoint] = useState("");
    const [newTodoLabelcheck, setNewTodoLabelcheck] = useState("");
    const [newTodoTimecheck, setNewTodoTimecheck] = useState(0);


    const [deverrormsg, setdeverrormsg] = useState("");

    const handleCreateTodocheck = () => {
        const newTodocheck = {
            label: newTodoLabelcheck,
            time: newTodoTimecheck,

        };
        setdeverrormsg("")
        setTodoscheck([...todoscheck, newTodocheck]);
        setNewTodoLabelcheck("");
        setNewTodoTimecheck(0);
    };


    const handleDeleteTodocheck = (index) => {
        const newTodoscheck = [...todoscheck];
        newTodoscheck.splice(index, 1);
        setTodoscheck(newTodoscheck);
    };

    const handleEditTodocheck = (index) => {
        setEditingIndexcheck(index);
        setEditedTododescheck(todoscheck[index].time);
        seteditcheckpoint(todoscheck[index].label);
    };

    const handleUpdateTodocheck = () => {

        const time = editedTododescheck;
        const label = editcheckpoint

        if (
            !todoscheck.find(
                (todo, index) =>
                    index !== editcheckpoint &&
                    todo.label?.toLowerCase() === editcheckpoint?.toLowerCase()
            )
        ) {

            const newTodoscheck = [...todoscheck];
            newTodoscheck[editingIndexcheck].time = time;
            newTodoscheck[editingIndexcheck].label = label;
            setTodoscheck(newTodoscheck);
            setEditingIndexcheck(-1);
            seteditcheckpoint("");
            setEditedTododescheck(0);
        }
        else {
            const newTodoscheck = [...todoscheck];
            newTodoscheck[editingIndexcheck].time = time;
            newTodoscheck[editingIndexcheck].label = label;

            setTodoscheck(newTodoscheck);
            setEditingIndexcheck(-1);
            seteditcheckpoint("");
            setEditedTododescheck(0);
        }
    };

    //edit 

    const [todoscheckedit, setTodoscheckedit] = useState([]);
    const [editingIndexcheckedit, setEditingIndexcheckedit] = useState(-1);
    const [editedTododescheckedit, setEditedTododescheckedit] = useState(0);
    const [editcheckpointedit, seteditcheckpointedit] = useState("");
    const [newTodoLabelcheckedit, setNewTodoLabelcheckedit] = useState("");
    const [newTodoTimecheckedit, setNewTodoTimecheckedit] = useState(0);


    const [deverrormsgedit, setdeverrormsgedit] = useState("");

    const handleCreateTodocheckedit = () => {

        const newTodocheckedit = {
            label: newTodoLabelcheckedit,
            time: newTodoTimecheckedit,

        };
        setdeverrormsgedit("")
        setTodoscheckedit([...todoscheckedit, newTodocheckedit]);

        setNewTodoLabelcheckedit("")
        setNewTodoTimecheckedit(0)
    };


    const handleDeleteTodocheckedit = (index) => {
        const newTodoscheckedit = [...todoscheckedit];
        newTodoscheckedit.splice(index, 1);
        setTodoscheckedit(newTodoscheckedit);
    };

    const handleEditTodocheckedit = (index) => {
        setEditingIndexcheckedit(index);
        setEditedTododescheckedit(todoscheckedit[index].time);
        seteditcheckpointedit(todoscheckedit[index].label);
    };

    const handleUpdateTodocheckedit = () => {

        const time = editedTododescheckedit;
        const label = editcheckpointedit

        if (
            !todoscheckedit?.find(
                (todo, index) =>
                    index !== editcheckpointedit &&
                    todo.label?.toLowerCase() === editcheckpointedit?.toLowerCase()
            )
        ) {
            const newTodoscheckedit = [...todoscheckedit];
            newTodoscheckedit[editingIndexcheckedit].time = time;
            newTodoscheckedit[editingIndexcheckedit].label = label;
            setTodoscheckedit(newTodoscheckedit);
            setEditingIndexcheckedit(-1);

        }
        else {
            const newTodoscheckedit = [...todoscheckedit];
            newTodoscheckedit[editingIndexcheckedit].time = time;
            newTodoscheckedit[editingIndexcheckedit].label = label;
            setTodoscheckedit(newTodoscheckedit);
            setEditingIndexcheckedit(-1);

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

    //Edit model...
    const [isEditOpen, setIsEditOpen] = useState(false);
    const handleClickOpenEdit = () => {
        setIsEditOpen(true);
    };
    const handleCloseModEdit = (e, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setIsEditOpen(false);
        seteditcheckpointedit("");
        setEditedTododescheckedit(0);
        setNewTodoLabelcheckedit("");
        setEditingIndexcheckedit(-1)
        setTodoscheckedit([]);
    };

    // get all taskcheckdefaultRoute
    const fetchcatsubcategory = async () => {
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

    const fetchCheckptgrps = async () => {
        try {
            let res = await axios.get(SERVICE.CHECKPOINTGROUP, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

            });

            setcheckpointgrps(res?.data?.checkptgroups)
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}

    }

    const fetchCheckptgrpsAll = async () => {
        try {
            let res = await axios.get(SERVICE.CHECKPOINTGROUP, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

            });

            setcheckpointgrpsall(res?.data?.checkptgroups.filter(item => item._id !== checkpointedit._id));
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}

    }

    const fetchCheckptgrpsedit = async () => {
        try {
            let res = await axios.get(SERVICE.CHECKPOINTGROUP, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

            });

            setcheckpointgrpsall(res?.data?.checkptgroups.filter(item => item._id !== checkpointedit._id));

         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}

    }

    const getCode = async (id) => {
        try {
            let res = await axios.get(
                `${SERVICE.CHECKPOINTGROUP_SINGLE}/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }
            );
            await fetchCheckptgrps();
            setcheckpointedit(res?.data?.sgroup);
            setTodoscheckedit(res?.data?.sgroup.checkpointgrp);
            setSelectedCategoryedit(res?.data?.sgroup.category);
            setSelectedSubCategoryedit(res?.data?.sgroup.subcategory);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    // get single row to view....
    const getviewCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.CHECKPOINTGROUP_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            await fetchCheckptgrps();
            setViewdata(res?.data?.sgroup);
            setTodoscheckedit(res?.data?.sgroup.checkpointgrp);
            setSelectedCategoryedit(res?.data?.sgroup.category);
            setSelectedSubCategoryedit(res?.data?.sgroup.subcategory);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    // get single row to view....
    const getinfoCode = async (e) => {
        try {
            let res = await axios.get(`${SERVICE.CHECKPOINTGROUP_SINGLE}/${e}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
            });
            await fetchCheckptgrps();
            setInfodata(res?.data?.sgroup);
            setTodoscheckedit(res?.data?.sgroup.checkpointgrp);
            setSelectedCategoryedit(res?.data?.sgroup.category);
            setSelectedSubCategoryedit(res?.data?.sgroup.subcategory);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const [deleteCategory, setDeleteCategory] = useState({});
    const [checkGroup, setCheckGroup] = useState();

    const rowData = async (id, category) => {
        try {
            let res = await axios.get(
                `${SERVICE.CHECKPOINTGROUP_SINGLE}/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }
            );
            setDeleteCategory(res?.data?.sgroup);
            let resdev = await axios.post(SERVICE.CHECKPOINTGROUPTOTASK, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                checkunit: String(category)

            })
            setCheckGroup(resdev?.data?.tasks)
            if ((resdev?.data?.tasks)?.length > 0) {
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
                `${SERVICE.CHECKPOINTGROUP_SINGLE}/${deletecategory}`,
                {
                    headers: {

                        'Authorization': `Bearer ${auth.APIToken}`
                    }
                }
            );
            await fetchCheckptgrps();
            handleCloseMod();
            setPage(1);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}

    };

    //Desigantion updateby edit page...
    let updateby = checkpointedit?.updatedby;
    let addedby = infodata?.addedby;

    //create alert for same name
    let todoCheck = todoscheck?.length > 0 ? todoscheck?.some((d) => d.label && d.label?.toLowerCase() === newTodoLabelcheck?.toLowerCase()) ? true : false : false;
    //edit (create) alert for same name/
    let todoCheckCreateEdit = todoscheck?.length > 0 ? todoscheck?.some((d, index) => { return index != editingIndexcheck && (d.label && d.label?.toLowerCase() === (editcheckpoint)?.toLowerCase()) }) ? true : false : false;
    //edit alert for same name
    let todoCheckEdit = todoscheckedit?.length > 0 ? todoscheckedit?.some((d) => d.label && d.label?.toLowerCase() === (newTodoLabelcheckedit)?.toLowerCase()) ? true : false : false;
    //edit (edit) alert for same name
    let todoCheckEditededit = todoscheckedit?.length > 0 ? todoscheckedit?.some((d, index) => index != editingIndexcheckedit && (d.label && d.label?.toLowerCase() === (editcheckpointedit)?.toLowerCase())) ? true : false : false;

    const sendRequest = async () => {

        try {
            let req = await axios.post(SERVICE.CHECKPOINTGROUP_CREATE, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },

                category: String(selectedCategory),
                subcategory: String(selectedSubCategory),
                checkpointgrp: [...todoscheck],

                addedby: [
                    {
                        name: String(username),
                        date: String(new Date()),
                    },
                ],
            });

            await fetchCheckptgrps();
            setcheckpointgroups("");
            setTodoscheck([]);
            setSelectedCategory("");
            setSelectedSubCategory("");
            setNewTodoLabelcheck("");
            setNewTodoTimecheck(0);
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        const isNameMatch = checkpointgrps?.some(item => item.subcategory?.toLowerCase() === (selectedSubCategory)?.toLowerCase());
        const isCategoryMatch = checkpointgrps?.some(item => item.category?.toLowerCase() === (selectedCategory)?.toLowerCase());

        if (selectedCategory === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select Category"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedSubCategory === "" && (selectedCategoryData.subcategoryname).length != 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Select SubCategory"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (todoscheck.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Checkpoints"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (isNameMatch && (selectedCategoryData.subcategoryname).length != 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Subcategory name already exits!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (isCategoryMatch && (selectedCategoryData.subcategoryname).length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Category name already exits!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }

        else {
            sendRequest();
        }
    };



    const handlecloseSubmit = (e) => {
        e.preventDefault();
        setNewTodoLabelcheck("");
        setSelectedCategory("");
        setSelectedSubCategory("");
        setEditedTododescheck(0);
        setTodoscheck([]);
    };

    let editid = checkpointedit._id

    //this is add database
    const sendEditRequest = async () => {
        try {

            let res = await axios.put(`${SERVICE.CHECKPOINTGROUP_SINGLE}/${editid}`, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                },
                category: String(selectedCategoryedit),
                subcategory: String(((selectedCategoryDataEdit.subcategoryname).length == 0) ? "" : selectedSubCategoryedit),
                checkpointgrp: [...todoscheckedit],
                updatedby: [
                    ...updateby, {
                        name: String(username),
                        date: String(new Date()),
                    },
                ],
            }
            );
            await fetchCheckptgrps();
            setTodoscheckedit([]);
            setSelectedCategoryedit("");
            setSelectedSubCategoryedit("");
            handleCloseModEdit()
        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    const handleEditsubmit = (e) => {
        const isNameMatch = checkpointgrpsall?.some(item => item.subcategory?.toLowerCase() === (selectedSubCategoryedit)?.toLowerCase());
        const isCategoryMatch = checkpointgrpsall?.some(item => item.category?.toLowerCase() === (selectedCategoryedit)?.toLowerCase());

        e.preventDefault();
        fetchCheckptgrpsAll();
        if (selectedCategoryedit == "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Category"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedSubCategoryedit == "" && (selectedCategoryDataEdit.subcategoryname).length != 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter SubCategory"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else if (todoscheckedit.length == 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Please Enter Checkpoints"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (isNameMatch && (selectedCategoryDataEdit.subcategoryname).length != 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Subcategory name already exits!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        } else if (isCategoryMatch && (selectedCategoryDataEdit.subcategoryname).length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon
                        sx={{ fontSize: "100px", color: "orange" }}
                    />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>
                        {"Category name already exits!"}
                    </p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            sendEditRequest();
        }
    }

    // Print
    const componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "checkpointgrps",
        pageStyle: "print",
    });

    // Excel
    const fileName = "category and Subcategory";

    const checkcatsubgrp = checkpointgrps?.map((item, index) => ({
        ...item,
        category: item.category,
        subcategory: (item.subcategory),
        checkpointgrp: (item.checkpointgrp)?.map((item, i) => `${i + 1 + ". "}` + item.label + item.time + " ").toString(),
    }));

    // get perticular columns for export excel
    const getexcelDatas = async () => {
        try {
            let response = await axios.get(SERVICE.CHECKPOINTGROUP, {
                headers: {
                    'Authorization': `Bearer ${auth.APIToken}`
                }
            });
            var data = checkcatsubgrp.map((t, index) => ({
                Sno: index + 1,
                category: t.category,
                subcategory: t.subcategory,
                checkpointgrp: t.checkpointgrp
            }));
            setExceldata(data);
         } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };

    useEffect(() => {
        getexcelDatas();
    }, [checkpointgrps])


    //pdf..
    const columns = [
        { title: "category", field: "category" },
        { title: "Subcategory", field: "subcategory" },
        { title: "checkpointgrp", field: "checkpointgrp" },
    ]

    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.autoTable({
            theme: "grid",
            styles: {
                fontSize: 6,
            },
            columns: columns.map((col) => ({ ...col, dataKey: col.field })),
            body: checkcatsubgrp,
        });
        doc.save("CheckpointGrouping.pdf");
    };


    const [items, setItems] = useState([]);

    const addSerialNumber = () => {
        const itemsWithSerialNumber = checkpointgrps?.map((item, index) => ({
            ...item,
            serialNumber: index + 1,
        }));
        setItems(itemsWithSerialNumber);
    };

    useEffect(() => {
        addSerialNumber();
    }, [checkpointgrps]);

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


    useEffect(() => {
        fetchCheckptgrpsedit()
        fetchCheckptgrps();
        fetchCheckptgrpsAll();
        fetchcatsubcategory();
    }, [])

    useEffect(() => {
        fetchCheckptgrpsAll();
    }, [isEditOpen, checkpointedit])

    useEffect(() => {
        fetchCheckptgrpsedit()
    }, [isEditOpen, checkpointedit])

    return (
        <Box>
            {/* ****** Header Content ****** */}
            <Headtitle title={'Checkpoint Grouping'} />
            <Typography sx={userStyle.HeaderText}>Checkpoint Grouping</Typography>
            <br />
            <>

                <Box sx={userStyle.dialogbox}>
                    <form >
                        <Typography sx={userStyle.SubHeaderText}>Checkpoint Grouping Master</Typography>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item md={6} xs={12} sm={12}>
                                {/* <Typography>Category</Typography> */}
                                <FormControl size="small" fullWidth>
                                    <InputLabel id="category-label">Category<b style={{ color: "red" }}>*</b></InputLabel>
                                    <Select
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 200,
                                                    width: 80,
                                                },
                                            },
                                        }}
                                        value={selectedCategory}
                                        label="Category"
                                        onChange={handleCategoryChange}>
                                        <MenuItem value="">Select Category</MenuItem>
                                        {subcategorylist.map((category, index) => (
                                            <MenuItem key={index} value={category.categoryname}>{category.categoryname}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid><br />

                            <Grid item md={6} xs={12} sm={12}>
                                {((selectedCategoryData?.subcategoryname)?.length != 0) ?

                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="category-label">SubCategory</InputLabel>
                                        <Select
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            value={selectedSubCategory}
                                            label="SubCategory"
                                            onChange={handleSubCategoryChange}>
                                            <MenuItem value="">Select Subcategory</MenuItem>
                                            {selectedCategoryData && selectedCategoryData.subcategoryname.map((subcategory, index) => (
                                                <MenuItem key={index} value={subcategory.label}>{subcategory.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    : null
                                }
                            </Grid><br />
                        </Grid>
                        <br />
                        <Grid item md={12} xs={12} sm={12}>
                            <>
                                <br />
                                <Grid container spacing={1}>
                                    <Grid item md={4} sm={6} xs={6}>
                                        <Typography>Checkpoints</Typography>

                                    </Grid>
                                    <Grid item md={3} sm={6} xs={6}>
                                        <Typography>Estimate Time (Minutes)</Typography>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1}>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <TextareaAutosize
                                            aria-label="maximum height"
                                            minRows={3}
                                            style={{ width: "100%" }}
                                            size="small"
                                            variant="outlined"
                                            value={newTodoLabelcheck}
                                            onChange={(e) =>
                                                setNewTodoLabelcheck(
                                                    String(e.target.value)
                                                )
                                            }
                                        />
                                        {todoCheck ? <Typography sx={{ color: "red" }}>please Choose Different name</Typography> : ""}

                                    </Grid>
                                    <Grid item md={3} sm={12} xs={12}>
                                        <TextField fullWidth
                                            size="small"
                                            variant="outlined"
                                            value={newTodoTimecheck}
                                            onChange={(e) =>
                                                handleChangephonenumber(e)
                                            }
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={1} xs={1}>
                                        {/* <Button
                                            variant="contained"
                                            style={{
                                                height: '30px',
                                                minWidth: '20px',
                                                padding: '19px 13px',
                                                color: 'white',
                                                background: 'rgb(25, 118, 210)'
                                            }}
                                            onClick={handleCreateTodocheck}
                                        >
                                            <FaPlus style={{ fontSize: "15px" }} />
                                        </Button> */}

                                        {todoCheck ? "" : <Button
                                            variant="contained"
                                            style={{
                                                height: '30px',
                                                minWidth: '20px',
                                                padding: '19px 13px',
                                                // color: 'white',
                                                // background: 'rgb(25, 118, 210)'
                                            }}
                                            disabled={(newTodoLabelcheck == "" || (newTodoTimecheck === ""))}
                                            onClick={() => { handleCreateTodocheck() }}
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
                                                    <Grid item md={3} sm={6} xs={6}>
                                                        <TextareaAutosize
                                                            aria-label="maximum height"
                                                            minRows={3}
                                                            style={{ width: "100%" }}
                                                            value={editcheckpoint}
                                                            onChange={(e) =>
                                                                seteditcheckpoint(
                                                                    String(e.target.value)

                                                                )
                                                            }
                                                        />
                                                        {todoCheckCreateEdit ? <Typography color="red">Please Choose different name</Typography> : ""}
                                                    </Grid>
                                                    <Grid item md={3} sm={6} xs={6}>
                                                        <TextField fullwidth
                                                            size="small"
                                                            variant="outlined"
                                                            value={editedTododescheck}
                                                            onChange={(e) =>
                                                                handleChangephonenumberupdate(e)

                                                            }
                                                        />
                                                    </Grid>
                                                    <Grid item md={1.5} sm={1.5} xs={1.5}>
                                                        {todoCheckCreateEdit ? "" : (editedTododescheck !== "" && editcheckpoint !== "" ?
                                                            <Button variant="contained"
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
                                                            </Button> : "")}
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
                                                            sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}
                                                        >
                                                            {todo.label}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item md={3} sm={3} xs={3}>
                                                        <Typography
                                                            variant="subtitle2"
                                                            color="textSecondary"
                                                        >
                                                            {todo.time}
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
                                {isUserRoleCompare[0]?.ccategorysubgrp && (
                                    <>
                                        <Button sx={userStyle.buttonadd}
                                            disabled={editingIndexcheck != -1}
                                            variant="contained"
                                            type="submit" onClick={handleSubmit}>SAVE</Button>
                                    </>
                                )}
                            </Grid>
                            <Grid item md={4} sm={6} xs={6}>
                                <Button sx={userStyle.btncancel} variant="contained"
                                    onClick={handlecloseSubmit}
                                >CANCEL</Button>
                            </Grid>
                            <Grid item md={2} sm={12} xs={12}></Grid>
                        </Grid>
                    </form>
                </Box>
                <Box>
                </Box>
                <br />
                {isUserRoleCompare[0]?.lcategorysubgrp && (
                    <Box sx={userStyle.container}>
                        <Typography sx={userStyle.SubHeaderText}>Checkpoint Grouping List</Typography>
                        <br />
                        {/* ****** Header Buttons ****** */}

                        <Grid container sx={{ justifyContent: "center" }}>
                            <Grid>
                                {isUserRoleCompare[0]?.excelcategorysubgrp && (
                                    <>
                                        <ExportXL csvData={exceldata} fileName={fileName} />
                                    </>
                                )}
                                {isUserRoleCompare[0]?.csvcategorysubgrp && (
                                    <>
                                        <ExportCSV csvData={exceldata} fileName={fileName} />
                                    </>
                                )}
                                {isUserRoleCompare[0]?.printcategorysubgrp && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={handleprint}>
                                            &ensp;
                                            <FaPrint />
                                            &ensp;Print&ensp;
                                        </Button>
                                    </>
                                )}
                                {isUserRoleCompare[0]?.pdfcategorysubgrp && (
                                    <>
                                        <Button sx={userStyle.buttongrp} onClick={() => downloadPdf()}>
                                            <FaFilePdf />
                                            &ensp;Export to PDF&ensp;
                                        </Button>
                                    </>
                                )}
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
                                        <MenuItem value={checkpointgrps.length}>All</MenuItem>
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
                                            <StyledTableCell onClick={() => handleSorting("category")}><Box sx={userStyle.tableheadstyle}> <Box>Category</Box><Box>{renderSortingIcon("category")}</Box> </Box> </StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting("subcategory")} ><Box sx={userStyle.tableheadstyle}> <Box>SubCategory</Box><Box>{renderSortingIcon("subcategory")}</Box></Box>  </StyledTableCell>
                                            <StyledTableCell onClick={() => handleSorting("checkpointgrp")} ><Box sx={userStyle.tableheadstyle}> <Box>checkpointgrp</Box><Box>{renderSortingIcon("checkpointgrp")}</Box></Box>  </StyledTableCell>
                                            <StyledTableCell>Actions</StyledTableCell>
                                        </StyledTableRow>
                                    </TableHead>
                                    <TableBody align="left">
                                        {filteredData.length > 0 ? (
                                            filteredData?.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell>{row.serialNumber}</StyledTableCell>
                                                    <StyledTableCell>{row.category}</StyledTableCell>
                                                    <StyledTableCell>{row.subcategory}</StyledTableCell>
                                                    <StyledTableCell>{(row.checkpointgrp)?.map((item, i) => `${i + 1 + ". "}` + item.label + item.time + " ")}</StyledTableCell>
                                                    <StyledTableCell component="th" scope="row">
                                                        <Grid sx={{ display: "flex" }}>
                                                            {isUserRoleCompare[0]?.ecategorysubgrp && (
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
                                                            {isUserRoleCompare[0]?.dcategorysubgrp && (
                                                                <>
                                                                    <Button
                                                                        sx={userStyle.buttondelete}
                                                                        onClick={(e) => {
                                                                            rowData(row._id, row.category);
                                                                        }}
                                                                    >
                                                                        <DeleteOutlineOutlinedIcon
                                                                            style={{ fontSize: "large" }}
                                                                        />
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {isUserRoleCompare[0]?.vcategorysubgrp && (
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
                                                            {isUserRoleCompare[0]?.icategorysubgrp && (
                                                                <>
                                                                    <Button
                                                                        sx={userStyle.buttonedit}
                                                                        onClick={() => {
                                                                            handleClickOpeninfo();
                                                                            getinfoCode(row._id);
                                                                        }}
                                                                    >
                                                                        <InfoOutlinedIcon style={{ fontsize: "large" }} />
                                                                    </Button>
                                                                </>
                                                            )}

                                                        </Grid>
                                                    </StyledTableCell>

                                                </StyledTableRow>
                                            ))) : <StyledTableRow> <StyledTableCell colSpan={5} align="center">No Data Available</StyledTableCell> </StyledTableRow>}
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
                        <Button onClick={handleCloseMod} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button
                            autoFocus
                            variant="contained"
                            color="error"
                            onClick={(e) => delTaskcheckdefault(checkpointedit)}
                        >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            {/* view models s*/}
            <Dialog
                open={openview}
                onClose={handleClickOpenview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="md"
            >
                <Box style={{ width: "650px", padding: "20px 50px" }}>
                    <Box>
                        <Typography sx={userStyle.HeaderText}>View Checkpoint Grouping </Typography>
                        <br />
                        <br />
                        <>
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography variant="h6">Category</Typography>
                                    <Typography>{viewdata.category}</Typography>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12}>
                                    <Typography variant="h6">Subcategory</Typography>
                                    <Typography>{viewdata.subcategory}</Typography>
                                </Grid>
                                <Grid item md={6} xs={12} sm={12} sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}>
                                    <Typography variant="h6">Checkpoints</Typography>
                                    <Typography>{(viewdata.checkpointgrp)?.map((item, i) => `${i + 1 + ". "}` + item.label + item.time + " ")}</Typography>
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

                        <form >
                            <Typography sx={userStyle.SubHeaderText}>Edit Checkpoint Grouping Master</Typography>
                            <br />   <br />
                            <Grid container spacing={2}>
                                <Grid item md={6} xs={12} sm={12}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="category-label">Category<b style={{ color: "red" }}>*</b></InputLabel>
                                        <Select
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 200,
                                                        width: 80,
                                                    },
                                                },
                                            }}
                                            value={selectedCategoryedit}
                                            label="Category"
                                            onChange={handleCategoryChangeedit}>
                                            <MenuItem value="">Select Category</MenuItem>
                                            {subcategorylist.map((category, index) => (
                                                <MenuItem key={index} value={category.categoryname}>{category.categoryname}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid><br />

                                <Grid item md={6} xs={12} sm={12}>
                                    {((selectedCategoryDataEdit?.subcategoryname)?.length != 0) ?

                                        <FormControl size="small" fullWidth>
                                            <InputLabel id="category-label">SubCategory</InputLabel>
                                            <Select
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200,
                                                            width: 80,
                                                        },
                                                    },
                                                }}
                                                value={selectedSubCategoryedit}
                                                label="SubCategory"
                                                onChange={handleSubCategoryChangeedit}>
                                                <MenuItem value="">Select Subcategory</MenuItem>
                                                {selectedCategoryDataEdit && selectedCategoryDataEdit.subcategoryname.map((subcategory, index) => (
                                                    <MenuItem key={index} value={subcategory.label}>{subcategory.label}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        : null
                                    }
                                </Grid><br />
                            </Grid>
                            <br />
                            <Grid item md={12} xs={12} sm={12}>
                                <>
                                    <br />
                                    <Grid container spacing={1}>
                                        <Grid item md={5} sm={12} xs={12}>
                                            <Typography>Checkpoint</Typography>

                                        </Grid>
                                        <Grid item md={5} sm={12} xs={12}>
                                            <Typography>Estimate Time (Minutes)</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1}>
                                        <Grid item md={5} sm={12} xs={12}>
                                            <TextareaAutosize
                                                aria-label="maximum height"
                                                minRows={3}
                                                style={{ width: "100%" }}
                                                value={newTodoLabelcheckedit}
                                                onChange={(e) =>
                                                    setNewTodoLabelcheckedit(
                                                        String(e.target.value)
                                                    )
                                                }
                                            />
                                            {todoCheckEdit ? <Typography sx={{ color: "red" }}>please Choose Different name</Typography> : ""}

                                        </Grid>
                                        <Grid item md={5} sm={12} xs={12}>
                                            <TextField fullWidth
                                                size="small"
                                                variant="outlined"
                                                value={newTodoTimecheckedit}
                                                onChange={(e) =>
                                                    handleChangephonenumberedit(e)
                                                }
                                            />

                                        </Grid>
                                        <Grid item md={2} sm={1} xs={1}>
                                            {todoCheckEdit ? "" : <Button
                                                variant="contained"
                                                style={{
                                                    height: '30px',
                                                    minWidth: '20px',
                                                    padding: '19px 13px',
                                                    // color: 'white',
                                                    // background: 'rgb(25, 118, 210)'
                                                }}
                                                disabled={(newTodoLabelcheckedit == "" || newTodoTimecheckedit === "")}
                                                onClick={handleCreateTodocheckedit}
                                            >
                                                <FaPlus style={{ fontSize: "15px" }} />
                                            </Button>}
                                        </Grid>

                                    </Grid>


                                    <br />
                                    <br />
                                    <Box>
                                        {todoscheckedit.map((todo, index) => (
                                            <div key={index}>
                                                {editingIndexcheckedit === index ? (
                                                    <Grid container spacing={2}>
                                                        <Grid item md={3} sm={6} xs={6}>
                                                            <TextareaAutosize
                                                                aria-label="maximum height"
                                                                minRows={3}
                                                                style={{ width: "100%" }}
                                                                value={editcheckpointedit}
                                                                onChange={(e) =>

                                                                    seteditcheckpointedit(
                                                                        String(e.target.value)

                                                                    )
                                                                }
                                                            />
                                                            {todoCheckEditededit ? <Typography color="red">Please Choose different name</Typography> : ""}

                                                        </Grid>

                                                        <Grid item md={3} sm={6} xs={6}>
                                                            <TextField fullwidth
                                                                size="small"
                                                                variant="outlined"
                                                                value={editedTododescheckedit}
                                                                onChange={(e) =>

                                                                    handleChangephonenumbereditupdate(e)
                                                                }
                                                            />

                                                        </Grid>
                                                        <Grid item md={1.5} sm={1.5} xs={1.5}>
                                                            {todoCheckEditededit ? "" : (editedTododescheckedit != "" && editcheckpointedit != "" ? <Button variant="contained"
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
                                                            </Button> : "")}
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
                                                        <Grid item md={3} sm={3} xs={3}>
                                                            <Typography
                                                                variant="subtitle2"
                                                                color="textSecondary"
                                                                sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}
                                                            >
                                                                {todo.label}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item md={3} sm={3} xs={3}>
                                                            <Typography
                                                                variant="subtitle2"
                                                                color="textSecondary"
                                                                sx={{ whiteSpace: 'pre-line', wordBreak: 'break-all' }}
                                                            >
                                                                {todo.time}
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
                                        ))}

                                    </Box>
                                </>
                            </Grid>
                            <br />
                            <br />
                            <Grid container spacing={2}>
                                <Grid item md={4} sm={6} xs={6}>
                                    <Button sx={userStyle.buttonadd} variant="contained" type="submit"
                                        disabled={editingIndexcheckedit != -1}
                                        onClick={handleEditsubmit}
                                    >UPDATE</Button>
                                </Grid>
                                <Grid item md={4} sm={6} xs={6}>
                                    <Button sx={userStyle.btncancel} onClick={handleCloseModEdit} variant="contained">CANCEL</Button>
                                </Grid>

                            </Grid>
                        </form>

                    </DialogContent>
                </Dialog>
            </Box>

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
                            <TableCell>Category</TableCell>
                            <TableCell>SubCategory</TableCell>
                            <TableCell>Checkpoint Group</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody align="left">
                        {checkpointgrps &&
                            checkpointgrps.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{printsno++}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.subcategory}</TableCell>
                                    <TableCell>{(row.checkpointgrp)?.map((item, i) => `${i + 1 + ". "}` + item.label + item.time + " ")}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>


                </Table>
            </TableContainer>

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
                                        (checkGroup?.length > 0
                                        ) ? (
                                            <span style={{ fontWeight: '700', color: '#777' }}>
                                                {`${deleteCategory?.category} `}  was linked in Task
                                            </span>
                                        ) : (
                                            (checkGroup?.length > 0
                                            ) && (
                                                <div>
                                                    <span style={{ fontWeight: '700', color: '#777' }}> {deleteCategory?.category}</span> <span > was linked in </span>
                                                    {checkGroup?.length > 0 && (
                                                        <span style={{ fontWeight: '700' }}>Purchase </span>
                                                    )}

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
                            CheckPoint Group Info
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
        </Box>
    );
}

export default Checkpointgrouping;