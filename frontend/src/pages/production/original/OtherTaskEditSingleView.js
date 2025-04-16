import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, OutlinedInput, Dialog, DialogContent, DialogActions, FormControl, Grid, Button } from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import { Link, useNavigate, useParams } from "react-router-dom";
import Selects from "react-select";
import axios from "axios";
import "jspdf-autotable";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import moment from "moment-timezone";
import { UserRoleAccessContext } from "../../../context/Appcontext";
import { handleApiError } from "../../../components/Errorhandling";
import { AuthContext } from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import { ThreeDots } from "react-loader-spinner";

function OtherEditSingleViewList() {
    const datetimeZoneOptions = [
        { value: "India Standard Time", label: "India Standard Time" },
        { value: "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi", label: "(GMT +5:30) Bombay, Calcutta, Madras, New Delhi" },
        { value: "(GMT -12:00) Eniwetok, Kwajalein", label: "(GMT -12:00) Eniwetok, Kwajalein" },
        { value: "(GMT -11:00) Midway Island, Samoa", label: "(GMT -11:00) Midway Island, Samoa" },
        { value: "(GMT -10:00) Hawaii", label: "(GMT -10:00) Hawaii" },
        { value: "(GMT -9:30) Taiohae", label: "(GMT -9:30) Taiohae" },
        { value: "(GMT -9:00) Alaska", label: "(GMT -9:00) Alaska" },
        { value: "(GMT -8:00) Pacific Time (US & Canada)", label: "(GMT -8:00) Pacific Time (US & Canada)" },
        { value: "(GMT -7:00) Mountain Time (US & Canada)", label: "(GMT -7:00) Mountain Time (US & Canada)" },
        { value: "(GMT -6:00) Central Time (US & Canada), Mexico City", label: "(GMT -6:00) Central Time (US & Canada), Mexico City" },
        { value: "(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima", label: "(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima" },
        { value: "(GMT -4:30) Caracas", label: "(GMT -4:30) Caracas" },
        { value: "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz", label: "(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz" },
        { value: "(GMT -3:30) Newfoundland", label: "(GMT -3:30) Newfoundland" },
        { value: "(GMT -3:00) Brazil, Buenos Aires, Georgetown", label: "(GMT -3:00) Brazil, Buenos Aires, Georgetown" },
        { value: "(GMT -2:00) Mid-Atlantic", label: "(GMT -2:00) Mid-Atlantic" },
        { value: "(GMT -1:00) Azores, Cape Verde Islands", label: "(GMT -1:00) Azores, Cape Verde Islands" },
        { value: "(GMT) Western Europe Time, London, Lisbon, Casablanca", label: "(GMT) Western Europe Time, London, Lisbon, Casablanca" },
        { value: "(GMT +1:00) Brussels, Copenhagen, Madrid, Paris", label: "(GMT +1:00) Brussels, Copenhagen, Madrid, Paris" },
        { value: "(GMT +2:00) Kaliningrad, South Africa", label: "(GMT +2:00) Kaliningrad, South Africa" },
        { value: "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg", label: "(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg" },
        { value: "(GMT +3:30) Tehran", label: "(GMT +3:30) Tehran" },
        { value: "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi", label: "(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi" },
        { value: "(GMT +4:30) Kabul", label: "(GMT +4:30) Kabul" },
        { value: "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent", label: "(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent" },
        { value: "(GMT +5:45) Kathmandu, Pokhara", label: "(GMT +5:45) Kathmandu, Pokhara" },
        { value: "(GMT +6:00) Almaty, Dhaka, Colombo", label: "(GMT +6:00) Almaty, Dhaka, Colombo" },
        { value: "(GMT +6:30) Yangon, Mandalay", label: "(GMT +6:30) Yangon, Mandalay" },
        { value: "(GMT +7:00) Bangkok, Hanoi, Jakarta", label: "(GMT +7:00) Bangkok, Hanoi, Jakarta" },
        { value: "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong", label: "(GMT +8:00) Beijing, Perth, Singapore, Hong Kong" },
        { value: "(GMT +8:45) Eucla", label: "(GMT +8:45) Eucla" },
        { value: "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk", label: "(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk" },
        { value: "(GMT +9:30) Adelaide, Darwin", label: "(GMT +9:30) Adelaide, Darwin" },
        { value: "(GMT +10:00) Eastern Australia, Guam, Vladivostok", label: "(GMT +10:00) Eastern Australia, Guam, Vladivostok" },
        { value: "(GMT +10:30) Lord Howe Island", label: "(GMT +10:30) Lord Howe Island" },
        { value: "(GMT +11:00) Magadan, Solomon Islands, New Caledonia", label: "(GMT +11:00) Magadan, Solomon Islands, New Caledonia" },
        { value: "(GMT +11:30) Norfolk Island", label: "(GMT +11:30) Norfolk Island" },
        { value: "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka", label: "(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka" },
        { value: "(GMT +12:45) Chatham Islands", label: "(GMT +12:45) Chatham Islands" },
        { value: "(GMT +13:00) Apia, Nukualofa", label: "(GMT +13:00) Apia, Nukualofa" },
        { value: "(GMT +14:00) Line Islands, Tokelau", label: "(GMT +14:00) Line Islands, Tokelau" },
    ];

    const istTimeZoneall = datetimeZoneOptions.find((option) => option.label.includes("India Standard Time"));
    const istTimeZone = istTimeZoneall.label;

    const [singleViewEdit, setSingleViewEdit] = useState({ category: "", filecategory: "", alllogin: "", unitid: "", user: "", dateval: "", unitrate: "", flagcount: "", section: "", vendor: "", fromdate: "", todate: "" });

    const { isUserRoleCompare, isUserRoleAccess } = useContext(UserRoleAccessContext);
    const { auth } = useContext(AuthContext);

    const backPage = useNavigate();

    const [vendors, setVendors] = useState([]);
    const [allLogins, setAllLogins] = useState([]);
    const [loginids, setLoginids] = useState([]);
    const username = isUserRoleAccess.username;
    const companyname = isUserRoleAccess.companyname;

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

    //get all Sub vendormasters.
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
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //get all Sub vendormasters.
    const fetchAllLogins = async () => {
        try {
            let res_vendor = await axios.get(SERVICE.ALL_CLIENTUSERIDDATA, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });


            let userids = res_vendor?.data?.clientuserid.find(item => singleViewEdit.user == item.userid)
            let findempname = userids && userids.empname
            let alluserid = res_vendor?.data?.clientuserid
                .filter((item) => singleViewEdit.vendor === item.projectvendor)
                .map((d) => ({
                    ...d,
                    label: d.userid,
                    value: d.userid,
                }));
            let alluseridNames = res_vendor?.data?.clientuserid
                .filter((item) => item.empname == findempname)
                .map((d) => ({
                    ...d,
                    label: d.userid,
                    value: d.userid,
                }));
            setAllLogins(alluserid);
            setLoginids(alluseridNames);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    const getviewCodealledit = async () => {
        try {
            let res = await axios.get(`${SERVICE.PRODUCTION_UPLOAD_SINGLE_OTHER}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            setSingleViewEdit(res?.data?.sproductionupload);
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    //submit option for saving
    const handleSubmit = (e) => {
        e.preventDefault();
        // const isNameMatch = productionsOriginal.some(item => item.nameround.toLowerCase() === (singleViewEdit.nameround).toLowerCase());
        if (singleViewEdit.vendor === "Please Select Vendor") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Select Vendor"}</p>
                </>
            );
            handleClickOpenerr();
        } else if (singleViewEdit.category === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Category"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (singleViewEdit.unitid === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Indentitfier"}</p>
                </>
            );
            handleClickOpenerr();
        } else if (singleViewEdit.dateval === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Date"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (singleViewEdit.unitrate === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter UnitRate"}</p>
                </>
            );
            handleClickOpenerr();
        }

        else {
            editSubmit();
        }
    };

    const cancelvalues = (e) => {
        backPage("/production/othertaskuploadlist")
    }

    let updatedBy = singleViewEdit.updatedby;
    //add function
    const editSubmit = async () => {
        try {
            let subprojectscreate = await axios.put(`${SERVICE.PRODUCTION_UPLOAD_SINGLE_OTHER}/${id}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                vendor: String(singleViewEdit.vendor),
                fromdate: String(singleViewEdit.fromdate),
                todate: String(singleViewEdit.todate),
                datetimezone: String(singleViewEdit.datetimezone),
                category: String(singleViewEdit.category),
                filecategory: String(singleViewEdit.filecategory ? singleViewEdit.filecategory : ""),
                user: String(singleViewEdit.user),
                alllogin: String(singleViewEdit.alllogin ? singleViewEdit.alllogin : ""),
                unitrate: String(singleViewEdit.unitrate),
                flagcount: String(singleViewEdit.flagcount),
                dateval: String(singleViewEdit.dateval),
                unitid: String(singleViewEdit.unitid),
                section: String(singleViewEdit.section ? singleViewEdit.section : ""),
                updatedby: [
                    ...updatedBy,
                    {
                        name: String(isUserRoleAccess.companyname),
                        companyname: String(companyname),
                        date: String(new Date()),
                    },
                ],
            });
            backPage("/production/othertaskuploadlist")
        } catch (err) { handleApiError(err, setShowAlert, handleClickOpenerr); }
    };

    useEffect(() => {
        fetchVendors();
        getviewCodealledit();
    }, []);

    useEffect(() => {
        fetchAllLogins();
    }, [singleViewEdit.vendor]);

    return (
        <Box>
            <Headtitle title={"Other Task Upload List"} />
            {/* ****** Header Content ****** */}
            {isUserRoleCompare?.includes("eothertaskuploadlist") && (
                <>
                    <Typography sx={userStyle.HeaderText}>Other Task Upload List</Typography>
                    <Box sx={userStyle.dialogbox}>
                        <Typography sx={userStyle.SubHeaderText}>Edit Other Task Upload List</Typography>
                        <br />
                        <br />
                        <Grid container spacing={3}>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Project-Vendor
                                    </Typography>
                                    <Selects
                                        options={vendors}
                                        value={{ label: singleViewEdit.vendor, value: singleViewEdit.vendor }}
                                        onChange={(e) => {
                                            setSingleViewEdit({ ...singleViewEdit, vendor: e.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item md={6} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                From Date <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlinedname"
                                                type="date"
                                                value={singleViewEdit.fromdate}
                                                onChange={(e) => {
                                                    setSingleViewEdit({ ...singleViewEdit, fromdate: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={6} sm={6} xs={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                To Date <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlinedname"
                                                type="date"
                                                value={singleViewEdit.todate}
                                                onChange={(e) => {
                                                    setSingleViewEdit({ ...singleViewEdit, todate: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        File Category
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedcode"
                                        type="text"
                                        value={singleViewEdit.filecategory}
                                        onChange={(e) => {
                                            setSingleViewEdit({ ...singleViewEdit, filecategory: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Date Time Zone
                                    </Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={datetimeZoneOptions}
                                        placeholder="Please Select Time Zone"
                                        value={{ label: singleViewEdit.datetimezone, value: singleViewEdit.datetimezone }}
                                        onChange={(e) => {
                                            setSingleViewEdit({ ...singleViewEdit, datetimezone: e.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Category
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedcode"
                                        type="text"
                                        value={singleViewEdit.category}
                                        onChange={(e) => {
                                            setSingleViewEdit({ ...singleViewEdit, category: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Indentitfier
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedcode"
                                        type="text"
                                        value={singleViewEdit.unitid}
                                        onChange={(e) => {
                                            setSingleViewEdit({ ...singleViewEdit, unitid: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Date <b style={{ color: "red" }}>*</b>
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedcode"
                                        type="text"
                                        value={singleViewEdit.dateval}
                                        onChange={(e) => {
                                            setSingleViewEdit({ ...singleViewEdit, dateval: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Login ID
                                    </Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={loginids}
                                        placeholder="Please Select Time Zone"
                                        value={{ label: singleViewEdit.user, value: singleViewEdit.user }}
                                        onChange={(e) => {
                                            setSingleViewEdit({ ...singleViewEdit, user: e.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Unit Rate
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedcode"
                                        type="text"
                                        value={singleViewEdit.unitrate}
                                        onChange={(e) => {
                                            setSingleViewEdit({ ...singleViewEdit, unitrate: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Flag Count
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedcode"
                                        type="text"
                                        value={singleViewEdit.flagcount}
                                        onChange={(e) => {
                                            setSingleViewEdit({ ...singleViewEdit, flagcount: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        Section
                                    </Typography>
                                    <OutlinedInput
                                        id="component-outlinedcode"
                                        type="text"
                                        value={singleViewEdit.section}
                                        onChange={(e) => {
                                            setSingleViewEdit({ ...singleViewEdit, section: e.target.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <FormControl fullWidth size="small">
                                    <Typography>
                                        All Login
                                    </Typography>
                                    <Selects
                                        maxMenuHeight={300}
                                        options={allLogins}
                                        placeholder="Please Select Time Zone"
                                        value={{ label: singleViewEdit.alllogin, value: singleViewEdit.alllogin }}
                                        onChange={(e) => {
                                            setSingleViewEdit({ ...singleViewEdit, alllogin: e.value });
                                        }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <br />
                        {/* <Grid container>
                {isUserRoleCompare?.includes("acompany") && (
                  <>
                    <Button variant="contained" type="submit">
                      SUBMIT
                    </Button>
                  </>
                )}            
              </Grid> */}

                        <Box sx={{ display: 'flex', justifyContent: 'end', gap: '20px' }}>

                            <Button variant="contained" onClick={handleSubmit}>
                                SUBMIT
                            </Button>
                            <Button sx={userStyle.btncancel} onClick={cancelvalues}>
                                Cancel
                            </Button>

                        </Box>
                        {/* </form> */}
                    </Box>
                </>
            )}

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
        </Box>
    );
}

export default OtherEditSingleViewList;