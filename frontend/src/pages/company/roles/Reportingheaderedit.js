import { DeleteOutlineOutlined } from "@material-ui/icons";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Box, Button, Dialog, DialogActions, DialogContent, FormControl, Grid, OutlinedInput, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { Link, useNavigate, useParams } from "react-router-dom";
import Selects from "react-select";
import { Bounce, Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlertDialog from "../../../components/Alert";
import { handleApiError } from "../../../components/Errorhandling";
import Headtitle from "../../../components/Headtitle";
import { menuItems } from "../../../components/menuItemsList";
import MessageAlert from "../../../components/MessageAlert";
import PageHeading from "../../../components/PageHeading";
import { RestrictionList } from "../../../components/RestrictionList";
import { AuthContext, UserRoleAccessContext } from "../../../context/Appcontext";
import { colourStyles, userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";

function ReportingHeaderEdit() {

    let toastId = null; // Store toast ID to control it

    const showToast = () => {
        toastId = toast.info(
            <div
            >
                <p style={{ marginBottom: "10px", fontSize: "14px", fontWeight: "bold" }}>
                    You have made changes. Please update!
                </p>
                <button
                    onClick={
                        editSubmit
                    }
                    style={{
                        backgroundColor: "gold",
                        border: "none",
                        padding: "8px 16px",
                        cursor: "pointer",
                        borderRadius: "5px",
                        fontWeight: "bold",
                        marginRight: "10px",
                        transition: "background-color 0.3s ease, transform 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#e6b800";
                        e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = "gold";
                        e.target.style.transform = "scale(1)";
                    }}
                >
                    Update
                </button>
            </div>,
            {
                position: "top-right",
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                theme: "dark",
                transition: Slide,
                closeButton: false,
            }
        );
    };

    // Function to close the toast manually
    const closeToast = () => {
        if (toastId == null) {
            toast.dismiss(toastId);
        }
    };

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

    const [subprojid, setSubprojid] = useState();
    const [reportingheaderNameEdit, setReportingheaderNameEdit] = useState("");
    const [moduleName, setModuleName] = useState("Please Select Module");
    const [submoduleOptions, setSubModuleOptions] = useState([]);
    const [mainpageOptions, setMainPageOptions] = useState([]);
    const [subpageOptions, setSubpageOptions] = useState([]);
    const [subsubpageOptions, setSubSubpageOptions] = useState([]);
    const [subModuleTitle, setsubModuleTitle] = useState([]);
    const [mainPageTitle, setmainPageTitle] = useState([]);
    const [subPageTitle, setSubpageTitle] = useState([]);
    const [subsubPageTitle, setSubSubpageTitle] = useState([]);
    const [moduleDbNames, setModuleDbNames] = useState([]);
    const [subModuleDbNames, setSubModuleDbNames] = useState([]);
    const [mainPageDbNames, setMainPageDbNames] = useState([]);
    const [subPageDbNames, setSubPageDbNames] = useState([]);
    const [subSubPageDbNames, setSubSubPageDbNames] = useState([]);

    // / Sub Module Multiselect
    const [selectedOptionsSubModule, setSelectedOptionsSubModule] = useState([]);
    let [valueSubModule, setValueSubModule] = useState("");
    // Main Page Multiselect
    const [selectedOptionsMainPage, setSelectedOptionsMainPage] = useState([]);
    let [valueMainPage, setValueMainPage] = useState("");
    // Sub Page Multiselect
    const [selectedOptionsSubPage, setSelectedOptionsSubPage] = useState([]);
    const [selectedOptionsSubSubPage, setSelectedOptionsSubSubPage] = useState([]);

    //Delete model
    const [isDeleteOpen, setisDeleteOpen] = useState(false);
    const handleClickOpendel = () => {
        setisDeleteOpen(true);
    };
    const handleCloseDel = () => {
        setisDeleteOpen(false);
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

    const backPage = useNavigate();
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles, } = useContext(UserRoleAccessContext);

    const compareDataTodo = (data1, data2) => {
        if (!Array.isArray(data1) || !Array.isArray(data2)) return true; // Ensure both are arrays

        if (data1.length !== data2.length) return true; // Different lengths mean different data

        return data1.some((obj1) => {
            // Try to find a matching object in data2
            const isMatchingObjectFound = data2.some((obj2) => {
                const keys1 = Object.keys(obj1).filter((key) => key !== "_id" && key !== "employeegracetime");
                const keys2 = Object.keys(obj2).filter((key) => key !== "_id" && key !== "employeegracetime");

                if (keys1.length !== keys2.length) return false; // If keys don't match, not a valid match

                return keys1.every((key) => {
                    const value1 = obj1[key]?.toString().trim();
                    const value2 = obj2[key]?.toString().trim();
                    return value2.includes(value1); // Check if value1 exists in value2
                });
            });

            return !isMatchingObjectFound; // If no match found, data is different
        });
    };


    const [reportingEditOptions, setReportingEditOptions] = useState([]);
    const [reportingEditOptionsDup, setReportingEditOptionsDup] = useState([]);

    const [hasChangesTodo, setHasChangesTodo] = useState(false);

    useEffect(() => {
        setHasChangesTodo(compareDataTodo(reportingEditOptions, reportingEditOptionsDup));
    }, [reportingEditOptions, reportingEditOptionsDup]);

    useEffect(() => {
        if (hasChangesTodo) {
            showToast();
        } else {
            closeToast();
        }
    }, [hasChangesTodo])


    const { auth } = useContext(AuthContext);

    const username = isUserRoleAccess.username;

    const id = useParams().id;

    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);

    const [showAlert, setShowAlert] = useState();

    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    // overall edit date
    const [ovProj, setOvProj] = useState("");
    const [ovProjCount, setOvProjCount] = useState("");
    const [getOverAllCount, setGetOverallCount] = useState("");
    const [dataNew, setDatanew] = useState("");

    //get single row to edit....
    const getCode = async () => {
        setPageName(!pageName);
        try {
            let res = await axios.get(`${SERVICE.REPORTINGHEADER_SINGLE}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setSubprojid(res?.data?.sreportingheader);
            setReportingheaderNameEdit(res?.data?.sreportingheader?.name);
            const transformed = [];
            const moduleDbNames = [];
            const moduleTitleNames = [];
            const subModuleDbNames = [];
            const subModuleTitleNames = [];
            const mainPageDbNames = [];
            const mainPageTitleNames = [];
            const subPageDbNames = [];
            const subsubPageDbNames = [];
            const subPageTitleNames = [];
            const subsubPageTitleNames = [];

            let ans = menuItems.filter((itemmodule) => {
                if (res?.data?.sreportingheader?.modulename?.includes(itemmodule.title)) {
                    moduleTitleNames.push(itemmodule.title);
                    moduleDbNames.push(itemmodule.dbname);

                    if (itemmodule.submenu) {
                        itemmodule.submenu.filter((itemsubmod) => {
                            if (res?.data?.sreportingheader?.submodulename?.includes(itemsubmod.title)) {
                                subModuleDbNames.push(itemsubmod.dbname);
                                subModuleTitleNames.push(itemmodule.title);

                                if (itemsubmod.submenu) {
                                    itemsubmod.submenu.filter((itemmainpage) => {
                                        if (res?.data?.sreportingheader?.mainpagename?.includes(itemmainpage.title)) {
                                            mainPageDbNames.push(itemsubmod.dbname);
                                            mainPageTitleNames.push(itemmodule.title);

                                            if (itemmainpage.submenu) {
                                                itemmainpage.submenu.filter((itemsubpage) => {
                                                    if (res?.data?.sreportingheader?.subpagename?.includes(itemsubpage.title)) {
                                                        subPageDbNames.push(itemsubmod.dbname);
                                                        subPageTitleNames.push(itemmodule.title);

                                                        if (itemsubpage.submenu) {
                                                            itemsubpage.submenu.filter((itemsubsubpage) => {
                                                                if (res?.data?.sreportingheader?.subsubpagename?.includes(itemsubsubpage.title)) {
                                                                    subsubPageDbNames.push(itemsubmod.dbname);
                                                                    subsubPageTitleNames.push(itemmodule.title);

                                                                    transformed.push({
                                                                        name: itemmodule.title,
                                                                        submodule: itemsubmod.title,
                                                                        mainpage: itemmainpage.title,
                                                                        subpage: itemsubpage.title,
                                                                        subsubpage: itemsubsubpage.title,
                                                                    });

                                                                }
                                                            });
                                                        } else {
                                                            transformed.push({
                                                                name: itemmodule.title,
                                                                submodule: itemsubmod.title,
                                                                mainpage: itemmainpage.title,
                                                                subpage: itemsubpage.title,
                                                            });
                                                        }
                                                    }
                                                });
                                            } else {
                                                transformed.push({
                                                    name: itemmodule.title,
                                                    submodule: itemsubmod.title,
                                                    mainpage: itemmainpage.title,
                                                });
                                            }
                                        }
                                    });
                                } else {
                                    transformed.push({
                                        name: itemmodule.title,
                                        submodule: itemsubmod.title,
                                    });
                                }
                            }
                        });
                    } else {

                    }
                }
            });

            setReportingEditOptions(transformed);
            setReportingEditOptionsDup(transformed);
            getOverallEditSection(res?.data?.sreportingheader?.name);
            setDatanew(res?.data?.sreportingheader?.name);
            setOvProj(res?.data?.sreportingheader?.name);
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
    };
    const [deleted, setDeleted] = useState([]);

    const [selectedDelete, setSelectedDelete] = useState("");

    const handleTodoDelete = (index) => {
        setSelectedDelete(index)
        handleClickOpendel();
    }

    const removeArray = (index) => {
        const ans = [...reportingEditOptions];
        ans.splice(index, 1);
        setDeleted(ans);
        setReportingEditOptions(ans);

        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
        handleCloseDel();

    };
    // restriction code
    const [moduelOptions, setModuleOptions] = useState([]);
    //module dropdowns
    const module = moduelOptions?.length > 0 ?
        moduelOptions?.map((data) => ({
            ...data,
            label: data.title,
            value: data.title,
            dbname: data.dbname,
        })) : [];

    useEffect(() => {
        function findAllSubmodules(data, searchTerms) {
            let matches = [];

            for (let item of data) {
                // Check if the current item's title is in the searchTerms array
                if (searchTerms.includes(item.title)) {
                    matches.push({ title: item?.title, dbname: item?.dbname }); // Add matched item to results
                }

                // If submenu exists, search recursively
                if (item.submenu && item.submenu.length > 0) {
                    const subItemsMatches = findAllSubmodules(item.submenu, searchTerms); // Search submenu recursively
                    if (subItemsMatches.length > 0) {
                        // If any subItem matches, include the current item with the matched subItems
                        matches.push({
                            title: item.title,
                            dbname: item?.dbname,
                            submenu: subItemsMatches
                        });
                    }
                }
            }

            return matches; // Return all matches found in this level of recursion
        }


        const result = findAllSubmodules(menuItems, RestrictionList);
        setModuleOptions(result)
        if (result.length > 0) {
            console.log('Found matching objects:', result);
        } else {
            console.log('No matches found');
        }
    }, [])

    //Submodule dropdowns
    const fetchSubModuleDropDowns = (options) => {

        //subModuleDropDown Names
        let subModu = moduelOptions?.filter((data) => options === data.title);
        let Submodule = subModu.length > 0 ? subModu?.map((item) => item.submenu) : [];
        let singleArray = Submodule.length > 0 ? [].concat(...Submodule) : [];
        //Removing Add in the list
        let filteredArray =
            singleArray.length > 0 ?
                singleArray.filter((innerArray) => {
                    return !innerArray.title.startsWith("123 ");
                }) : [];

        setSubModuleOptions(
            filteredArray.length > 0 ?
                filteredArray?.map((data) => ({
                    ...data,
                    label: data.title,
                    value: data.title,
                })) : []
        );
    };
    //MainPage dropdowns
    const fetchMainDropDowns = (options) => {

        let ans = options;
        setsubModuleTitle(ans.map((data) => data.title));
        let subModule = ans.filter((data) => data.submenu).map((item) => item.submenu);
        let answer = [].concat(...subModule).map((d) => ({
            ...d,
            label: d.title,
            value: d.title,
        }));
        setMainPageOptions(answer);
    };
    //subPage dropdowns
    const fetchSubPageDropDowns = (options) => {

        let ans = options;
        setmainPageTitle(options.map((data) => data.title));
        let subModule = ans.filter((data) => data.submenu).map((item) => item.submenu);
        let answer = [].concat(...subModule).map((d) => ({
            ...d,
            label: d.title,
            value: d.title,
        }));
        setSubpageOptions(answer);
    };
    //subPage dropdowns
    const fetchSubSubPageDropDowns = (options) => {

        let ans = options;
        setSubpageTitle(options.map((data) => data.title));
        let subModule = ans.filter((data) => data.submenu).map((item) => item.submenu);
        let answer = [].concat(...subModule).map((d) => ({
            ...d,
            label: d.title,
            value: d.title,
        }));
        setSubSubpageOptions(answer);
    };

    // / Sub Module Multiselect
    const handleSubModuleChange = (options) => {
        let dbNames =
            options.length > 0 &&
            options.map((a, index) => {
                return a.dbname;
            });
        setSubModuleDbNames(dbNames);
        setValueSubModule(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsSubModule(options);
        setSelectedOptionsMainPage([]);
        setSelectedOptionsSubPage([]);
        setSelectedOptionsSubSubPage([]);
        fetchMainDropDowns(options);
        if (options.length == 0) {
            setSelectedOptionsMainPage([]);
            setValueMainPage("");
        }
        setSubpageOptions([])
        setSubSubpageOptions([])
    };
    const customValueRendererSubModule = (valueSubModule, _submoduleOptions) => {
        return valueSubModule.length ? valueSubModule.map(({ label }) => label).join(", ") : <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Sub-Module</span>;
    };
    // Main Page Multiselect
    const handleMainPageChange = (options) => {
        let dbNames =
            options.length > 0 &&
            options.map((a, index) => {
                return a.dbname;
            });
        setMainPageDbNames(dbNames);
        setValueMainPage(
            options.map((a, index) => {
                return a.value;
            })
        );
        setSelectedOptionsSubPage([]);
        setSelectedOptionsSubSubPage([]);
        setSubSubpageOptions([])
        fetchSubPageDropDowns(options);
        setSelectedOptionsMainPage(options);
    };
    const customValueRendererMainPage = (valueMainPage, _mainpageOptions) => {
        return valueMainPage.length ? valueMainPage.map(({ label }) => label).join(", ") : <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Main-Page</span>;
    };
    // Sub Page Multiselect
    const handleSubPageChange = (options) => {
        let dbNames =
            options.length > 0 &&
            options.map((a, index) => {
                return a.dbname;
            });

        setSubPageDbNames(dbNames);
        setSelectedOptionsSubSubPage([]);
        setSelectedOptionsSubPage(options);
        setSubpageTitle(options.map((data) => data.title));
        fetchSubSubPageDropDowns(options)
    };
    const customValueRendererSubPage = (valueSubPage, _subpageOptions) => {
        return valueSubPage.length ? valueSubPage.map(({ label }) => label).join(", ") : <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Sub-Page</span>;
    };

    // Sub-Sub Page Multiselect
    const handleSubSubPageChange = (options) => {
        let dbNames =
            options.length > 0 &&
            options.map((a, index) => {
                return a.dbname;
            });
        setSubSubPageDbNames(dbNames);
        setSelectedOptionsSubSubPage(options);
        setSubSubpageTitle(options.map((data) => data.title));
    };
    const customValueRendererSubSubPage = (valueSubPage, _subpageOptions) => {
        return valueSubPage.length ? valueSubPage.map(({ label }) => label).join(", ") : <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Sub Sub-Page</span>;
    };

    //Todo Page
    const fetchhTodo = () => {

        if (moduleName === "Please Select Module" && valueSubModule.length < 1) {
            setPopupContentMalert("Please Select Module& Sub-Module");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (valueSubModule.length < 1 && submoduleOptions.length > 1) {
            setPopupContentMalert("Please Select Sub Module Page");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        // else if (valueMainPage.length < 1 && mainpageOptions.length > 1) {
        //     setPopupContentMalert("Please Select Main Page");
        //     setPopupSeverityMalert("info");
        //     handleClickOpenPopupMalert();
        // }

        else {
            const todo = [];
            let ans = menuItems.filter((itemmodule) => {
                if (moduleName?.includes(itemmodule.title)) {

                    if (itemmodule.submenu) {
                        itemmodule.submenu.filter((itemsubmod) => {
                            if (subModuleTitle?.includes(itemsubmod.title)) {
                                if (itemsubmod.submenu) {
                                    itemsubmod.submenu.filter((itemmainpage) => {
                                        if (mainPageTitle?.includes(itemmainpage.title)) {
                                            if (itemmainpage.submenu) {
                                                itemmainpage.submenu.filter((itemsubpage) => {
                                                    if (subPageTitle?.includes(itemsubpage.title)) {
                                                        if (itemsubpage.submenu) {
                                                            itemsubpage.submenu.filter((itemsubsubpage) => {
                                                                if (subsubPageTitle?.includes(itemsubsubpage.title)) {
                                                                    todo.push({
                                                                        name: itemmodule.title,
                                                                        submodule: itemsubmod.title,
                                                                        mainpage: itemmainpage.title,
                                                                        subpage: itemsubpage.title,
                                                                        subsubpage: itemsubsubpage.title,
                                                                    });

                                                                }
                                                            });
                                                        } else {
                                                            todo.push({
                                                                name: itemmodule.title,
                                                                submodule: itemsubmod.title,
                                                                mainpage: itemmainpage.title,
                                                                subpage: itemsubpage.title,
                                                            });
                                                        }
                                                    }
                                                });
                                            } else {
                                                todo.push({
                                                    name: itemmodule.title,
                                                    submodule: itemsubmod.title,
                                                    mainpage: itemmainpage.title,
                                                });
                                            }
                                        }
                                    });
                                } else {
                                    todo.push({
                                        name: itemmodule.title,
                                        submodule: itemsubmod.title,
                                    });
                                }
                            }
                        });
                    }
                }
            });

            const unmatchedItems = [];

            for (let i = 0; i < todo.length; i++) {
                const item2 = todo[i];
                const isMatched = reportingEditOptions.some((item1) => deepCompareWithoutControl(item1, item2));

                if (!isMatched) {
                    unmatchedItems.push(item2);
                }
            }

            function deepCompareWithoutControl(obj1, obj2) {
                const keys1 = Object.keys(obj1).filter((key) => key !== "control" && key !== "controlgroupingtitles");
                const keys2 = Object.keys(obj2).filter((key) => key !== "control" && key !== "controlgroupingtitles");

                if (keys1.length !== keys2.length) {
                    return false;
                }

                for (const key of keys1) {
                    if (obj1[key] !== obj2[key]) {
                        return false;
                    }
                }

                return true;
            }

            if (unmatchedItems.length > 0) {
                setReportingEditOptions([...reportingEditOptions, ...unmatchedItems]);
                setHasChangesTodo(compareDataTodo([...reportingEditOptions, ...unmatchedItems], reportingEditOptionsDup));
                setPopupContent("Data is Added");
                setPopupSeverity("success");
                handleClickOpenPopup();
            } else {
                setPopupContentMalert("These Data is Already Added");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };

    const hanldeClear = () => {
        setModuleName("Please Select Module");
        setsubModuleTitle([]);
        setmainPageTitle([]);
        setSubpageTitle([]);
        setSubSubpageTitle([]);
        setValueMainPage([])
        setValueSubModule([])
        setSubModuleOptions([]);
        setMainPageOptions([]);
        setSubpageOptions([]);
        setSubSubpageOptions([]);
        setsubModuleTitle([]);
        setSelectedOptionsSubModule([]);
        setSelectedOptionsMainPage([]);
        setSelectedOptionsSubPage([]);
        setSelectedOptionsSubSubPage([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    };

    const handleBAck = () => {
        setModuleName("Please Select Module");
        setSubModuleOptions([]);
        setMainPageOptions([]);
        setSubpageOptions([]);
        setSubSubpageOptions([]);
        setsubModuleTitle([]);
        setSelectedOptionsSubModule([]);
        setSelectedOptionsMainPage([]);
        setSelectedOptionsSubPage([]);
        setSelectedOptionsSubSubPage([]);
        backPage("/reportingheadercreate");
    };

    let updateby = subprojid?.updatedby;
    let addedby = subprojid?.addedby;

    //submiit Request
    const fetchSubmit = async () => {
        setPageName(!pageName);
        try {
            if (reportingheaderNameEdit === "") {
                setPopupContentMalert("Please Enter Header Name");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
            else {
                const moduleTitle = Array.from(new Set(reportingEditOptions.map((data) => data.name)));

                const subMod = reportingEditOptions.filter((data) => data.submodule !== undefined);

                const submooduleTitle = Array.from(new Set(subMod.map((data) => data.submodule)));

                const mainPage = reportingEditOptions.filter((data) => data.mainpage !== undefined);
                const mainPageTitle = Array.from(new Set(mainPage.map((data) => data.mainpage)));

                const subPage = reportingEditOptions.filter((data) => data.subpage !== undefined);
                const subPageTitle = Array.from(new Set(subPage.map((data) => data.subpage)));

                const subSubPage = reportingEditOptions.filter((data) => data.subsubpage !== undefined);
                const subSubPageTitle = Array.from(new Set(subSubPage.map((data) => data.subsubpage)));

                let res = await axios.put(`${SERVICE.REPORTINGHEADER_SINGLE}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${auth.APIToken}`,
                    },
                    name: String(reportingheaderNameEdit),
                    modulename: moduleTitle,
                    submodulename: submooduleTitle,
                    mainpagename: mainPageTitle,
                    subpagename: subPageTitle,
                    subsubpagename: subSubPageTitle,
                    reportingnew: [...subprojid?.reportingnew, ...moduleDbNames, ...subModuleDbNames, ...mainPageDbNames, ...subPageDbNames, ...subSubPageDbNames],
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });
                setPopupContent("Updated Successfully");
                setPopupSeverity("success");
                handleClickOpenPopup();
                await getOverallEditSectionUpdate();
                backPage("/reportingheadercreate");
                setModuleName("Please Select Module");
                setSubModuleOptions([]);
                setMainPageOptions([]);
                setSubpageOptions([]);
                setSubSubpageOptions([]);
                setsubModuleTitle([]);
            }
        } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }

    };

    const editSubmit = (e) => {
        e.preventDefault();
        //  if (reportingheaderNameEdit != ovProj && ovProjCount > 0 && dataNew !== reportingheaderNameEdit) {
        if (ovProjCount > 0 && dataNew !== reportingheaderNameEdit) {
            setShowAlertpop(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
                </>
            );
            handleClickOpenerrpop();
        }
        else {
            fetchSubmit();
        }
    };


    //overall edit section for all pages
    const getOverallEditSection = async (e, name) => {
        try {
            let res = await axios.post(SERVICE.OVERALL_EDITREPORTINGHEADER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                oldname: e,
            });
            setOvProjCount(res?.data?.count);
            setGetOverallCount(`The ${e} is linked in ${res?.data?.count > 0 ? " Hierarchy Pages ," : ""}. 
        Do you want to proceed with the changes?`);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };
    //overall edit section for all pages
    const getOverallEditSectionUpdate = async () => {
        try {
            let res = await axios.post(SERVICE.OVERALL_EDITREPORTINGHEADER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                oldname: ovProj,
                newname: reportingheaderNameEdit
            });
            sendEditRequestOverall(res?.data?.hirerarchi);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    const sendEditRequestOverall = async (oldname, newname) => {
        try {
            // Make sure both oldname and newname are provided
            if (!oldname || !newname) {
                console.error('Both oldname and newname must be provided');
                return;
            }

            // Send the PUT request to your backend API with oldname and newname
            const res = await axios.put(`${SERVICE.HIRERARCHI_SINGLE}`, {
                oldname: oldname,
                newname: reportingheaderNameEdit,
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`, // Ensure API token is passed for authorization
                },
            });

            if (res.data.success) {
                setPopupContentMalert("Records updated successfully!");
                setPopupSeverityMalert("success");
                handleClickOpenPopupMalert();
            }

        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); // Your existing error handling logic
        }
    };

    useEffect(() => {
        getCode();
    }, []);

    return (
        <Box>
            <Headtitle title={"Edit Reporting Header "} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Edit Reporting Header"
                modulename="Setup"
                submodulename="Reporting Header"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />
            {isUserRoleCompare?.includes("ereportingheader") && (
                <>
                    <Box sx={userStyle.dialogbox}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item md={8} xs={12} sm={12}>
                                    <Typography sx={userStyle.importheadtext}>
                                        Edit Reporting Header
                                    </Typography>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    {/* <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={fetchSubmit}> */}
                                    <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={editSubmit}>
                                        Update
                                    </Button>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Link to={`/reportingheadercreate`} sx={buttonStyles.buttonsubmit} style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}>
                                        <Button variant="contained" sx={buttonStyles.btncancel} >Back</Button>
                                    </Link>
                                </Grid>

                            </Grid>
                            <br />
                            <Grid item md={12} xs={12} sx={{ display: "flex" }}>
                                <Typography variant="h6">
                                    Header Name<b style={{ color: "red" }}>*</b>:
                                </Typography>
                                &emsp;
                                <FormControl>
                                    <OutlinedInput type="text" value={reportingheaderNameEdit} onChange={(e) => setReportingheaderNameEdit(e.target.value)} />
                                </FormControl>
                            </Grid>
                            <Grid container sx={{ justifyContent: "left" }} spacing={2}>
                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>
                                        Module<b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <FormControl size="small" fullWidth>
                                        <Selects
                                            styles={colourStyles}
                                            options={module}
                                            value={{ value: moduleName, label: moduleName }}
                                            onChange={(e) => {
                                                setModuleDbNames([...moduleDbNames, e.dbname])
                                                setModuleName(e.value);
                                                fetchSubModuleDropDowns(e.value);
                                                setSelectedOptionsSubModule([]);
                                                setSelectedOptionsMainPage([]);
                                                setSelectedOptionsSubPage([]);
                                                setSelectedOptionsSubSubPage([]);
                                                setMainPageOptions([])
                                                setSubpageOptions([])
                                                setSubSubpageOptions([])

                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>Sub-Module<b style={{ color: "red" }}>*</b></Typography>
                                    <FormControl size="small" fullWidth>

                                        <MultiSelect size="small"
                                            options={submoduleOptions}
                                            value={selectedOptionsSubModule}
                                            onChange={handleSubModuleChange} valueRenderer={customValueRendererSubModule} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>Main-Page</Typography>
                                    <FormControl size="small" fullWidth>

                                        <MultiSelect size="small"
                                            options={mainpageOptions}
                                            value={selectedOptionsMainPage}
                                            onChange={handleMainPageChange} valueRenderer={customValueRendererMainPage} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>Sub-Page</Typography>
                                    <FormControl size="small" fullWidth>
                                        <MultiSelect size="small" options={subpageOptions} value={selectedOptionsSubPage} onChange={handleSubPageChange} valueRenderer={customValueRendererSubPage} />
                                    </FormControl>
                                </Grid>
                                <Grid item md={4} xs={12} sm={12}>
                                    <Typography>Sub Sub-Page</Typography>
                                    <FormControl size="small" fullWidth>
                                        <MultiSelect size="small" options={subsubpageOptions} value={selectedOptionsSubSubPage} onChange={handleSubSubPageChange} valueRenderer={customValueRendererSubSubPage} />
                                    </FormControl>
                                </Grid>

                            </Grid>
                            <br></br>
                            <br></br>
                            <br></br>
                            <Grid container spacing={2}>
                                <Grid item md={1} xs={12} sm={12}>
                                    {moduleName === "Please Select Module" ? "" :
                                        <Button variant="contained" sx={buttonStyles.buttonsubmit} onClick={fetchhTodo}>
                                            ADD
                                        </Button>}
                                </Grid>
                                <Grid item md={1} xs={12} sm={12}>
                                    <Button sx={buttonStyles.btncancel} onClick={hanldeClear}>
                                        Clear
                                    </Button>
                                </Grid>
                            </Grid>
                            <br />
                            <br />

                            <Typography>
                                <b>Reporting Header List </b>
                            </Typography>
                            <br></br>
                            <Grid container spacing={2}>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Typography>
                                        <b>Module Name</b>
                                    </Typography>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Typography>
                                        <b>Sub-Module Name</b>
                                    </Typography>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Typography>
                                        <b>Main Page Name</b>
                                    </Typography>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Typography>
                                        <b>Sub-Page Name</b>
                                    </Typography>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Typography>
                                        <b>Sub-Sub-Page Name</b>
                                    </Typography>
                                </Grid>

                                <Grid item md={2} xs={12} sm={12}>
                                    <Typography>
                                        <b>Actions</b>
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br></br>

                            {reportingEditOptions.length > 0 &&
                                reportingEditOptions.map((data, index) => {
                                    return (
                                        <Grid container spacing={2}>
                                            <Grid item md={2} xs={12} sm={12}>
                                                <Typography>{data.name}</Typography>
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={12}>
                                                <Typography>{data.submodule}</Typography>
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={12}>
                                                <Typography>{data.mainpage}</Typography>
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={12}>
                                                <Typography>{data.subpage}</Typography>
                                            </Grid>
                                            <Grid item md={2} xs={12} sm={12}>
                                                <Typography>{data.subsubpage}</Typography>
                                            </Grid>

                                            <Grid item md={2} xs={12} sm={12}>
                                                <Button
                                                    //   onClick={(e) => removeArray(index)}
                                                    onClick={(e) => handleTodoDelete(index)}
                                                >
                                                    <DeleteOutlineOutlined sx={buttonStyles.buttondelete} />
                                                </Button>
                                                {/* )} */}
                                            </Grid>
                                        </Grid>
                                    );
                                })}
                            { }
                            <br />
                            <br />
                            <br />

                            <Grid container spacing={2}>

                                <Grid item xs={12} sm={6} md={2.5} lg={2.5}>
                                    <Button sx={buttonStyles.btncancel} onClick={handleBAck}>
                                        Back
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    </Box>
                </>
            )
            }
            {/* ALERT DIALOG */}
            <Box>
                <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="error" onClick={handleCloseerr}>
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* Delete Modal */}
            <Box>
                {/* ALERT DIALOG */}
                <Dialog open={isDeleteOpen} onClose={handleCloseDel} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
                        <Typography variant="h5" sx={{ color: "red", textAlign: "center" }}>
                            Are you sure?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDel} sx={buttonStyles.btncancel}>
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" sx={buttonStyles.buttonbulkdelete} onClick={(e) => removeArray(selectedDelete)}   >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* ALERT DIALOG for the overall edit*/}
            <Box>
                <Dialog open={isErrorOpenpop} onClose={handleCloseerrpop} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                    <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
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
                                fetchSubmit();
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
            <ToastContainer transition={Bounce} />
        </Box >
    );
}

export default ReportingHeaderEdit;