import React, { useState, useEffect, useContext } from "react";
import {
    Box,
    Typography,
    OutlinedInput,
    DialogActions,
    FormControl,
    Grid,
    Dialog,
    Button,
    DialogContent,
    TextareaAutosize,
} from "@mui/material";
import { userStyle } from "../../pageStyle";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import Selects from "react-select";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Country, State, City } from "country-state-city";
import { Link } from "react-router-dom";

function AddLead() {
    const [lead, setLead] = useState({
        prefix: "Mr.",
        firstname: "",
        lastname: "",
        emailid: "",
        phonenumber: "",
        fax: "",
        website: "",
        leadsource: "Please Select Leadsource",
        leadstatus: "Please Select Leadstatus",
        industrytype: "Please Select Industrytype",
        noofemployee: "",
        annualrevenue: "",
        rating: "Please Select Rating",
        skypeid: "",
        secondaryemailid: "",
        twitterid: "",
        street: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",
        description: "",
        leadaddedby: "",
    });


    const [TextEditor, setTextEditor] = useState("");
    const [documentFiles, setdocumentFiles] = useState([]);



    const handleFileDelete = (index) => {
        setdocumentFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };



    const handleResumeUpload = (event) => {
        const resume = event.target.files;
        for (let i = 0; i < resume?.length; i++) {
            const reader = new FileReader();
            const file = resume[i];
            reader.readAsDataURL(file);
            reader.onload = () => {
                setdocumentFiles((prevFiles) => [...prevFiles, { name: file.name, preview: reader.result, data: reader.result.split(",")[1], remark: "resume file" }]);
            };
        }
    };

    const renderFilePreview = async (file) => {
        const response = await fetch(file.preview);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        window.open(link, "_blank");
    };

    const [isAddOpenalert, setAddOpenAlert] = useState(false);
    const [isClearOpenalert, setClearOpenAlert] = useState(false);
    const [errors, setErrors] = useState({});

    const { isUserRoleCompare, isUserRoleAccess } = useContext(
        UserRoleAccessContext
    );
    const { auth } = useContext(AuthContext);
    const navigation = useNavigate();
    //Datatable
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [showAlert, setShowAlert] = useState();
    const [leadArray, setLeadArray] = useState([]);
    const [isValidEmail, setIsValidEmail] = useState(false);
    useEffect(() => {
        const beforeUnloadHandler = (event) => handleBeforeUnload(event);
        window.addEventListener("beforeunload", beforeUnloadHandler);
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
        };
    }, []);

    useEffect(() => {
        fetchLeadAll();
    }, [])



    const [selectedCountryp, setSelectedCountryp] = useState(Country.getAllCountries().find((country) => country.name === "India"));
    const [selectedStatep, setSelectedStatep] = useState(State.getStatesOfCountry(selectedCountryp?.isoCode).find((state) => state.name === "Tamil Nadu"));
    const [selectedCityp, setSelectedCityp] = useState(City.getCitiesOfState(selectedStatep?.countryCode, selectedStatep?.isoCode).find((city) => city.name === "Tiruchirappalli"));

    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };

    // Error Popup model
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };


    const handleBeforeUnload = (event) => {
        event.preventDefault();
        event.returnValue = "";
    };
    const username = isUserRoleAccess.username;

    //add function
    const sendRequest = async (btn) => {
        try {
            let brandCreate = await axios.post(SERVICE.LEAD_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                prefix: lead.prefix,
                firstname: lead.firstname,
                lastname: lead.lastname,
                emailid: lead.emailid,
                phonenumber: lead.phonenumber,
                fax: lead.fax,
                website: lead.website,
                leadsource: lead.leadsource,
                leadstatus: lead.leadstatus,
                industrytype: lead.industrytype,
                noofemployee: lead.noofemployee,
                annualrevenue: lead.annualrevenue,
                rating: lead.rating,
                skypeid: lead.skypeid,
                secondaryemailid: lead.secondaryemailid,
                twitterid: lead.twitterid,
                street: lead.street,
                city: selectedCityp.name,
                state: selectedStatep.name,
                country: selectedCountryp.name,
                zipcode: lead.zipcode,
                description: lead.description,
                leadaddedby: lead.leadaddedby,
                document: [...documentFiles],
                addedby: [
                    {
                        name: String(isUserRoleAccess.companyname),
                        date: String(new Date()),
                    },
                ],
            });
            const country = Country.getAllCountries().find((country) => country.name === "India");
            const state = State.getStatesOfCountry(country?.isoCode).find((state) => state.name === "Tamil Nadu");
            const city = City.getCitiesOfState(state?.countryCode, state?.isoCode).find((city) => city.name === "Tiruchirappalli");
            setSelectedCountryp(country);
            setSelectedStatep(state);
            setSelectedCityp(city);
            await fetchLeadAll()
            if (btn === "save") {
                setAddOpenAlert(true);
                setTimeout(() => {
                    setAddOpenAlert(false);
                    navigation("/leadlist");
                }, 2000)
            } else {
                setAddOpenAlert(true);
                setTimeout(() => {
                    setAddOpenAlert(false);
                }, 2000)
            }



        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon
                            sx={{ fontSize: "100px", color: "orange" }}
                        />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>
                            {"something went wrong!"}
                        </p>
                    </>
                );
                handleClickOpenerr();
            }
        }
    };

    const fetchLeadAll = async () => {
        try {
            let res_status = await axios.get(SERVICE.LEADS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            setLeadArray(res_status?.data?.leads);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setShowAlert(
                    <>
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                        <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>
                    </>
                );
                handleClickOpenerr();
            } else {
                setShowAlert(
                    <>
                        {" "}
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} /> <p style={{ fontSize: "20px", fontWeight: 900 }}>{"something 5 went wrong!"}</p>{" "}
                    </>
                );
                handleClickOpenerr();
            }
        }
    };

    //submit option for saving
    const handleSubmit = async (e, btn) => {
        e.preventDefault();
        const newErrors = {};
        await fetchLeadAll()
        const isNameMatch = leadArray?.some((item) => item.firstname?.toLowerCase() == lead.firstname?.toLowerCase() &&
            item.lastname.toLowerCase() == lead.lastname.toLowerCase() &&
            item.emailid.toLowerCase() == lead.emailid.toLowerCase() &&
            item.phonenumber == lead.phonenumber.toString() &&
            item.fax.toLowerCase() === lead.fax.toLowerCase() &&
            item.leadsource.toLowerCase() == lead.leadsource.toLowerCase() &&
            item.leadstatus.toLowerCase() == lead.leadstatus.toLowerCase() &&
            item.industrytype.toLowerCase() == lead.industrytype.toLowerCase() &&
            item.street.toLowerCase() == lead.street.toLowerCase() &&
            item.city.toLowerCase() == selectedCityp.name.toLowerCase() &&
            item.state.toLowerCase() == selectedStatep.name.toLowerCase() &&
            item.country.toLowerCase() == selectedCountryp.name.toLowerCase() &&
            item.zipcode == lead.zipcode.toString()
        );
        console.log(isNameMatch)
        if (lead.firstname === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Firstname"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (lead.lastname === '') {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Lastname"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (lead.emailid !== "" && isValidEmail === false) {
            newErrors.email = <Typography style={{ color: "red" }}>Please enter valid email</Typography>;
        }

        else if (lead.emailid === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter EmailId"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (lead.phonenumber === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter PhoneNumber"}</p>
                </>
            );
            handleClickOpenerr();
        }

        else if (lead.leadsource === "Please Select Leadsource") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose LeadSource"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (lead.leadstatus === "Please Select Leadstatus") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose LeadStatus"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (lead.industrytype === "Please Select Industrytype") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose IndustryType"}</p>
                </>
            );
            handleClickOpenerr();
        }

        else if (lead.street === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter Street"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedCountryp.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose Country"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedStatep.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose State"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (selectedCityp.length === 0) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Choose City"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (lead.zipcode === "") {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Please Enter ZipCode"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else if (isNameMatch) {
            setShowAlert(
                <>
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
                    <p style={{ fontSize: "20px", fontWeight: 900 }}>{"Lead already exits!"}</p>
                </>
            );
            handleClickOpenerr();
        }
        else {
            sendRequest(btn);
        }
        setErrors(newErrors);
    };



    const handleclear = (e) => {
        e.preventDefault();
        setLead({
            prefix: "Mr.",
            firstname: "",
            lastname: "",
            emailid: "",
            phonenumber: "",
            fax: "",
            website: "",
            leadsource: "Please Select Leadsource",
            leadstatus: "Please Select Leadstatus",
            industrytype: "Please Select Industrytype",
            noofemployee: "",
            annualrevenue: "",
            rating: "Please Select Rating",
            skypeid: "",
            secondaryemailid: "",
            twitterid: "",
            street: "",
            city: "",
            state: "",
            country: "",
            zipcode: "",
            description: "",
            leadaddedby: "",
        })
        setClearOpenAlert(true)
        setTimeout(() => {
            setClearOpenAlert(false);
        }, 1000)
    };

    const leadsource = ["Advertisement", "Coldcall", "Employee Referral", "External Referral", "Online Store", "Partner", "Public Relation", "Sales Email Alias", "Seminar Partner", "Internal Server", "Chat", "Trade Show", "Web Download", "Web Search"];
    const leadstatus = ["Attempted to Contact", "Contact In Future", "Contacted", "Junk Lead", "Lost Lead", "Not Contacted", "Pre Qualified", "Not Qualified"];
    const Industry = ["ASPC (Application Service Provider)", "Data/Telecom OEM", "ERP (Enterprise Resource Planning)", "Goverment/Military", "Large Enterprise", "MSP (Management Service Provider)", "Service Provider", "Optical Networking", "Small/Medium Enterprise", "Storage Equipment", "Storage Serrvice Provider", "ERP", "Management ISV", "Wireless Industry", "System Integators"];
    const rating = ["Acquired", "Active", "Market Failed", "Project Cancelled", "Shutdown"];
    const firstname = ["Mr", "Mrs", "Ms", "Dr", "Prof"];
    const leadsourceOpt =
        leadsource.map((data) => ({
            ...data,
            label: data,
            value: data,
        }));
    const leadstatusOpt =
        leadstatus.map((data) => ({
            ...data,
            label: data,
            value: data,
        }));
    const industryOpt =
        Industry.map((data) => ({
            ...data,
            label: data,
            value: data,
        }));
    const ratingOpt =
        rating.map((data) => ({
            ...data,
            label: data,
            value: data,
        }));
    const firstnameOpt =
        firstname.map((data) => ({
            ...data,
            label: data,
            value: data,
        }));

    const handleChangephonenumber = (e) => {
        const regex = /^[0-9]+$/;
        const inputValue = e.target.value;
        if (regex.test(inputValue) || inputValue === "") {
            setLead({ ...lead, phonenumber: e.target.value });
        }
    };

    const handleChangeNoofemployee = (e) => {
        const regex = /^[0-9]+$/;
        const inputValue = e.target.value;
        if (regex.test(inputValue) || inputValue === "") {
            setLead({ ...lead, noofemployee: e.target.value });
        }
    };

    const handleChangeAnnualrevenue = (e) => {
        const regex = /^[0-9]+$/;
        const inputValue = e.target.value;
        if (regex.test(inputValue) || inputValue === "") {
            setLead({ ...lead, annualrevenue: e.target.value });
        }
    };

    const handleChangeZipcode = (e) => {
        const regex = /^[0-9]+$/;
        const inputValue = e.target.value;
        if (regex.test(inputValue) || inputValue === "") {
            setLead({ ...lead, zipcode: e.target.value });
        }
    };

    const validateEmail = (emailbranch) => {
        const regex = /\S+@\S+\.\S+/;
        return regex.test(emailbranch);
    };

    return (
        <Box>
            <Headtitle title={"ADD LEAD"} />
            {/* ****** Header Content ****** */}
            <Typography sx={userStyle.HeaderText}>Add Lead</Typography>

            <>
                {isUserRoleCompare?.includes("aleadcreate") && (
                    <Box sx={userStyle.selectcontainer}>
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Typography sx={userStyle.importheadtext} style={{ fontWeight: "600" }}>
                                        Lead Information
                                    </Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={2}>
                                <>
                                    <Grid item md={3} sm={12} xs={12}>


                                        <Typography>First Name<b style={{ color: "red" }}>*</b></Typography>



                                        <Grid container sx={{ display: "flex" }}>
                                            <Grid item md={4} sm={3} xs={3}>
                                                <FormControl size="small" fullWidth>

                                                    <Selects
                                                        value={{ value: lead.prefix, label: lead.prefix }}
                                                        options={firstnameOpt}
                                                        onChange={(e) => {
                                                            setLead({ ...lead, prefix: e.value });
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item md={8} sm={9} xs={9}>
                                                <FormControl size="small" fullWidth>
                                                    <OutlinedInput
                                                        id="component-outlined"
                                                        type="text"
                                                        placeholder="Please Enter First Name"
                                                        value={lead.firstname}
                                                        onChange={(e) => {
                                                            const inputValue = e.target.value;
                                                            if (/^[a-zA-Z]+$/.test(inputValue) || inputValue === '') {
                                                                setLead({
                                                                    ...lead,
                                                                    firstname: inputValue,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Last Name
                                                <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Last Name"
                                                value={lead.lastname}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value;
                                                    if (/^[a-zA-Z]+$/.test(inputValue) || inputValue === '') {
                                                        setLead({
                                                            ...lead,
                                                            lastname: inputValue,
                                                        });
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <FormControl fullWidth size="small">
                                                <Typography>Email Id
                                                    <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <OutlinedInput
                                                    id="component-outlined"
                                                    type="text"
                                                    placeholder="Please Enter Email"
                                                    value={lead.emailid}
                                                    onChange={(e) => {
                                                        setLead({ ...lead, emailid: e.target.value });
                                                        setIsValidEmail(validateEmail(e.target.value));
                                                    }}
                                                    InputProps={{
                                                        inputProps: {
                                                            pattern: /^\S+@\S+\.\S+$/,
                                                        },
                                                    }}
                                                />
                                            </FormControl>
                                            {errors.email && <div>{errors.email}</div>}
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Phone Number
                                                <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Phone Number"
                                                value={lead.phonenumber?.slice(0, 10)}
                                                onChange={(e) => {
                                                    handleChangephonenumber(e);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Fax

                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Fax"
                                                value={lead.fax}
                                                onChange={(e) => {
                                                    setLead({ ...lead, fax: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>WebSite

                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Website"
                                                value={lead.website}
                                                onChange={(e) => {
                                                    setLead({ ...lead, website: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Lead Source
                                                <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={leadsourceOpt}
                                                placeholder="Please Select Category"
                                                value={{ label: lead.leadsource, value: lead.leadsource }}
                                                onChange={(e) => {
                                                    setLead({
                                                        ...lead,
                                                        leadsource: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Lead Status
                                                <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={leadstatusOpt}
                                                placeholder="Please Select SubCategory"
                                                value={{ label: lead.leadstatus, value: lead.leadstatus }}
                                                onChange={(e) => {
                                                    setLead({
                                                        ...lead,
                                                        leadstatus: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Industry Type
                                                <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={industryOpt}
                                                placeholder="Please Select Frequency"
                                                value={{ label: lead.industrytype, value: lead.industrytype }}
                                                onChange={(e) => {
                                                    setLead({
                                                        ...lead,
                                                        industrytype: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>No of Employees
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Employee"
                                                value={lead.noofemployee}
                                                onChange={(e) => {
                                                    handleChangeNoofemployee(e)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Annual Revenue
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Annualrevenue"
                                                value={lead.annualrevenue}
                                                onChange={(e) => {
                                                    handleChangeAnnualrevenue(e)
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Rating
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={ratingOpt}
                                                placeholder="Please Select Rating"
                                                value={{ label: lead.rating, value: lead.rating }}
                                                onChange={(e) => {
                                                    setLead({
                                                        ...lead,
                                                        rating: e.value,
                                                    });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Skype Id
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Skype"
                                                value={lead.skypeid}
                                                onChange={(e) => {
                                                    setLead({ ...lead, skypeid: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Secondary Email
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Secondary Email"
                                                value={lead.secondaryemailid}
                                                onChange={(e) => {
                                                    setLead({ ...lead, secondaryemailid: e.target.value });
                                                    setIsValidEmail(validateEmail(e.target.value));
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Twitter ID
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Twitter"
                                                value={lead.twitterid}
                                                onChange={(e) => {
                                                    setLead({ ...lead, twitterid: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}></Grid>

                                    <Grid item xs={12}>
                                        <Typography sx={userStyle.importheadtext}><b>Address Information</b></Typography>
                                    </Grid>
                                    <br />
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Street<b style={{ color: "red" }}>*</b></Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={5}
                                                value={lead.street}
                                                onChange={(e) => {
                                                    setLead({ ...lead, street: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                Country
                                                <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={Country.getAllCountries()}
                                                getOptionLabel={(options) => {
                                                    return options["name"];
                                                }}
                                                getOptionValue={(options) => {
                                                    return options["name"];
                                                }}
                                                value={selectedCountryp}

                                                onChange={(item) => {
                                                    setSelectedCountryp(item);
                                                    setSelectedStatep([])
                                                    setSelectedCityp([])
                                                }}
                                                placeholder="Please Select Country"

                                            />
                                        </FormControl>






                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                State
                                                <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={State?.getStatesOfCountry(selectedCountryp?.isoCode)}
                                                getOptionLabel={(options) => {
                                                    return options["name"];
                                                }}
                                                getOptionValue={(options) => {
                                                    return options["name"];
                                                }}
                                                placeholder="Please Select State"
                                                value={selectedStatep}
                                                onChange={(item) => {
                                                    setSelectedStatep(item);
                                                    setSelectedCityp([])
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>
                                                City
                                                <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <Selects
                                                maxMenuHeight={250}
                                                options={City.getCitiesOfState(selectedStatep?.countryCode, selectedStatep?.isoCode)}
                                                getOptionLabel={(options) => {
                                                    return options["name"];
                                                }}
                                                getOptionValue={(options) => {
                                                    return options["name"];
                                                }}
                                                placeholder="Please Select City"
                                                value={selectedCityp}
                                                onChange={(item) => {
                                                    setSelectedCityp(item);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>


                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Zip Code
                                                <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Zipcode"
                                                value={lead.zipcode?.slice(0, 6)}
                                                onChange={(e) => {
                                                    handleChangeZipcode(e);
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}></Grid>

                                    <Grid item xs={12}>
                                        <Typography sx={userStyle.importheadtext}><b>Description Information</b></Typography>
                                    </Grid>
                                    <br />
                                    <Grid item md={4} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Description</Typography>
                                            <TextareaAutosize
                                                aria-label="minimum height"
                                                minRows={5}
                                                value={lead.description}
                                                onChange={(e) => {
                                                    setLead({ ...lead, description: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={3} xs={12} sm={12}>
                                        <FormControl fullWidth size="small">
                                            <Typography>Lead Added By
                                            </Typography>
                                            <OutlinedInput
                                                id="component-outlined"
                                                type="text"
                                                placeholder="Please Enter Leadaddedby"
                                                value={lead.leadaddedby}
                                                onChange={(e) => {
                                                    setLead({ ...lead, leadaddedby: e.target.value });
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item md={4} sm={12} xs={12}>

                                        <Typography >Upload Document</Typography>
                                        <Grid >
                                            <Button variant="contained" size="small" component="label" sx={{ "@media only screen and (max-width:550px)": { marginY: "5px" } }}>
                                                Upload
                                                <input
                                                    type="file"
                                                    id="resume"
                                                    accept=".xlsx, .xls, .csv, .pdf, .doc, .txt,"
                                                    name="file"
                                                    hidden
                                                    onChange={(e) => {
                                                        handleResumeUpload(e);
                                                        setTextEditor("");
                                                    }}
                                                />
                                            </Button>
                                            <br />
                                            <br />
                                            {documentFiles?.length > 0 &&
                                                documentFiles.map((file, index) => (
                                                    <>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={4} sm={6} xs={6}>
                                                                <Typography>{file.name}</Typography>
                                                            </Grid>
                                                            <Grid></Grid>
                                                            <Grid item md={2} sm={6} xs={6}>
                                                                <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", cursor: "pointer" }} onClick={() => renderFilePreview(file)} />
                                                            </Grid>
                                                            <Grid item md={2} sm={6} xs={6}>
                                                                <Button style={{ fontsize: "large", color: "#357AE8", cursor: "pointer", marginTop: "-5px" }} onClick={() => handleFileDelete(index)}>
                                                                    <DeleteIcon />
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                ))}
                                        </Grid>
                                    </Grid>

                                    <br />  <br />
                                </>
                            </Grid>
                            <br />
                            <Grid item md={12} sm={12} xs={12}>
                                <br />
                                <br />
                                <Grid sx={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                                    <Button variant="contained"
                                        onClick={(e) => {
                                            handleSubmit(e, "save")
                                        }}
                                    >
                                        {" "}
                                        Save
                                    </Button>
                                    <Button variant="contained"
                                        onClick={(e) => {
                                            handleSubmit(e, "saveadd")
                                        }}
                                    >
                                        {" "}
                                        Save And Add Another
                                    </Button>
                                    <Button sx={userStyle.btncancel}
                                        onClick={handleclear}
                                    >
                                        {" "}
                                        CLEAR
                                    </Button>
                                    <Grid item xs={4}>

                                        <>
                                            <Link to="/leadlist" >
                                                <Button sx={userStyle.btncancel}>CANCEL</Button>
                                            </Link>
                                        </>

                                    </Grid>
                                </Grid>
                            </Grid>
                        </>
                        {/* Add DIALOG */}
                        <Dialog open={isAddOpenalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                                <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <Typography variant="h6"><b>Added Successfully👍</b></Typography>
                            </DialogContent>
                        </Dialog>
                        {/* Clear DIALOG */}
                        <Dialog open={isClearOpenalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                            <DialogContent sx={{ padding: "37px 23px", width: "350px", textAlign: "center", alignItems: "center" }}>
                                <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
                                <Typography variant="h6"><b>Cleared Successfully👍</b></Typography>
                            </DialogContent>
                        </Dialog>
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
                )}
            </>
            <br />   <br />
        </Box>
    );
}

export default AddLead;
