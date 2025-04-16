import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, OutlinedInput, Dialog, DialogContent, DialogActions, FormControl, Grid, Button } from "@mui/material";
import { MultiSelect } from "react-multi-select-component";
import { userStyle, colourStyles } from "../../../pageStyle";
import axios from "axios";
import { SERVICE } from "../../../services/Baseservice";
import { UserRoleAccessContext, AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import PageHeading from "../../../components/PageHeading";

import Selects from "react-select";
import { menuItems } from "../../../components/menuItemsList";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteOutlineOutlined, EditOutlined } from "@material-ui/icons";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { Link } from "react-router-dom";
import { handleApiError } from "../../../components/Errorhandling";

function ReportingHeaderEdit() {
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
    const backPage = useNavigate();
    const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName } = useContext(UserRoleAccessContext);

    const [reportingEditOptions, setReportingEditOptions] = useState([]);
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
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
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

        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: 'orange' }} />
                <p style={{ fontSize: '20px', fontWeight: 900 }}>{"Deleted Successfully"}</p>
            </>
        );
        handleClickOpenerr();
        handleCloseDel();

    };

    //module dropdowns
    const module = menuItems.map((d) => ({
        ...d,
        label: d.title,
        value: d.title,
    }));

    //Submodule dropdowns
    const fetchSubModuleDropDowns = (e) => {
        let subModule = menuItems.filter((data) => data.title === e);
        let dropdown = subModule.map((data) => data.submenu);
        let ans = [].concat(...dropdown).map((d) => ({
            ...d,
            label: d.title,
            value: d.title,
        }));
        setSubModuleOptions(ans);
    };
    //MainPage dropdowns
    const fetchMainDropDowns = (e) => {
        let ans = e;
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
    const fetchSubPageDropDowns = (e) => {
        let ans = e;
        setmainPageTitle(e.map((data) => data.title));
        let subModule = ans.filter((data) => data.submenu).map((item) => item.submenu);
        let answer = [].concat(...subModule).map((d) => ({
            ...d,
            label: d.title,
            value: d.title,
        }));
        setSubpageOptions(answer);
    };
    //subPage dropdowns
    const fetchSubSubPageDropDowns = (e) => {
        let ans = e;
        setSubpageTitle(e.map((data) => data.title));
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
        setSelectedOptionsSubSubPage(options);
        setSubSubpageTitle(options.map((data) => data.title));
    };
    const customValueRendererSubSubPage = (valueSubPage, _subpageOptions) => {
        return valueSubPage.length ? valueSubPage.map(({ label }) => label).join(", ") : <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Sub Sub-Page</span>;
    };

    //Todo Page
    const fetchhTodo = () => {

        if (moduleName === "Please Select Module" && valueSubModule.length < 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Module& Sub-Module"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (valueSubModule.length < 1 && submoduleOptions.length > 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Sub Module Page"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (valueMainPage.length < 1 && mainpageOptions.length > 1) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Main Page"}</p>
                </>
            );
            handleClickOpenerr();
        }

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
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Data is Added"}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"These Data is Already Added"}</p>
                    </>
                );
                handleClickOpenerr();
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
        setShowAlert(
            <>
                <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Cleared Successfully"}</p>
            </>
        );
        handleClickOpenerr();
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

    //ubmiit Request
    const fetchSubmit = async () => {
        setPageName(!pageName);
        try {
            if (reportingheaderNameEdit === "") {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Header Name"}</p>
                    </>
                );
                handleClickOpenerr();
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
                    //   reportingnew: controlNames,
                    updatedby: [
                        ...updateby,
                        {
                            name: String(isUserRoleAccess.companyname),
                            date: String(new Date()),
                        },
                    ],
                });
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Updated Successfully"}</p>
                    </>
                );
                handleClickOpenerr();
                backPage("/reportingheadercreate");
                setModuleName("Please Select Module");
                setSubModuleOptions([]);
                setMainPageOptions([]);
                setSubpageOptions([]);
                setSubSubpageOptions([]);
                setsubModuleTitle([]);
            }
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }

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
                                    <Button variant="contained" color="primary" onClick={fetchSubmit}>
                                        Update
                                    </Button>
                                </Grid>
                                <Grid item md={2} xs={12} sm={12}>
                                    <Link to={`/reportingheadercreate`} style={{ textDecoration: "none", color: "#fff", minWidth: "0px" }}>
                                        <Button variant="contained" >Back</Button>
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
                                        <Button variant="contained" onClick={fetchhTodo}>
                                            ADD
                                        </Button>}
                                </Grid>
                                <Grid item md={1} xs={12} sm={12}>
                                    <Button sx={userStyle.btncancel} onClick={hanldeClear}>
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
                                                    <DeleteOutlineOutlined />
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
                                    <Button sx={userStyle.btncancel} onClick={handleBAck}>
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
                        <Button onClick={handleCloseDel} sx={userStyle.btncancel}>
                            Cancel
                        </Button>
                        <Button autoFocus variant="contained" color="error" onClick={(e) => removeArray(selectedDelete)}   >
                            {" "}
                            OK{" "}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box >
    );
}

export default ReportingHeaderEdit;