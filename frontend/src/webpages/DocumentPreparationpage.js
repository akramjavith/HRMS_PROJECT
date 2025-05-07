import React, { useState, useEffect } from "react";
import "../App.css";
import {
    Box,
    Typography,
    Dialog,
    DialogContent,
    DialogActions,

    Button,

} from "@mui/material";
import moment from "moment-timezone";
import { useParams } from "react-router-dom";
import axios from "axios";
import { handleApiError } from "../components/Errorhandling";
import { SERVICE } from "../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

function DocumentPreparationpage() {
    // Error Popup model
    const [isErrorOpen, setIsErrorOpen] = useState(false);
    const [companyData, setCompanyData] = useState("");
    const [authorData, setAuthorData] = useState("");
    const [showAlert, setShowAlert] = useState();
    const handleClickOpenerr = () => {
        setIsErrorOpen(true);
    };
    const handleCloseerr = () => {
        setIsErrorOpen(false);
    };
    const name = useParams()?.name;
    const ids = useParams()?.id;
    const userid = useParams()?.userid;


    const issuedperson = useParams()?.issuedperson;
    const date = useParams()?.date;

    const TemplateDropdownsValue = async () => {
        try {
            let res = await axios.get(`${SERVICE.TEMPLATECONTROLPANEL_SINGLE}/${ids}`, {
            });
            let res_user = await axios.get(`${SERVICE.USER_SINGLE}/${userid}`, {
            });
            setAuthorData(res_user?.data?.suser)
            setCompanyData(res?.data?.stemplatecontrolpanel)

        } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
    };


    useEffect(() => { TemplateDropdownsValue(); }, [])








    function decryptString(str) {
        const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const shift = 3; // You should use the same shift value used in encryption
        let decrypted = "";
        for (let i = 0; i < str.length; i++) {
            let charIndex = characters.indexOf(str[i]);
            if (charIndex === -1) {
                // If character is not found, add it directly to the decrypted string
                decrypted += str[i];
            } else {
                // Reverse the shift for decryption
                charIndex = (charIndex - shift + characters.length) % characters.length;
                decrypted += characters[charIndex];
            }
        }
        return decrypted;
    }

    return (
        <>
         {/* <Poppers /> */}
            <div style={{ display: "flex",justifyContent:"flex-start", padding:"10px" }}>
                {companyData ? <img
                    src={companyData?.documentcompany[0]?.preview}
                    alt="Logo"
                    style={{ height: "50px", width: "auto", marginRight: "10px" }}
                /> : ""}
        </div >
        <div style={{textAlign: "center" ,flex: 1}}>
                <h2 className="roboto-bold">
                    {companyData ? companyData?.companyname : ""}
                </h2>
                <h2 style={{ color: "gray", fontSize: "1rem", margin: 0 }}>
                    {companyData ? companyData?.address : ""}
                </h2>
            </div>
            <div
                style={{
                    textAlign: "center",
                    paddingTop: "50px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "60vh",
                    }}
                    className="thankyoycard-container"
                >
                    {/* Thank You Card */}
                    <div
                        style={{
                            backgroundColor: "#ecf0f1",
                            border: "2px solid lightgray",
                            borderRadius: "10px",
                            padding: "20px",
                            width: "50%",
                            boxSizing: "border-box",
                            WebkitBoxShadow: "-1px 1px 15px 8px rgba(0,0,0,0.21)",
                            boxShadow: "-1px 1px 15px 8px rgba(0,0,0,0.21)",
                        }}
                        className="thankyoycard-subcontainer"
                    >
                        {/* <h1
                        style={{
                            fontSize: "2rem",
                            marginBottom: "20px",
                            textAlign: "center",
                        }}
                        className="thankyoycardh1"
                    >
                        Thank you!
                    </h1> */}
                        <p
                            style={{
                                fontSize: "1rem",
                                textAlign: "center",
                                lineHeight: "30px",

                                fontFamily: "Comic Sans MS, cursive, sans-serif",
                                letterSpacing: "2.2px",
                                wordSpacing: "-1.2px",
                                color: "#9C9C9C",
                                fontWeight: "bolder",
                                textDecoration: "none",
                                fontStyle: "italic",
                                fontVariant: "normal",
                                textTransform: "none",
                            }}
                            className="thankyoycardp"
                        >
                            {`On ${date?.replaceAll("_" , " ")}, ${decryptString(name)} received an important document from ${decryptString(issuedperson)}.
                            ${authorData?.companyname} joined us on ${moment(authorData?.doj).format("DD-MM-YYYY")} as a ${authorData?.designation}, and is identified by employee code ${authorData?.empcode}. 
                        The document was delivered promptly by our team to ensure timely 
                        communication and collaboration. We understand the significance of 
                        clear and efficient communication in our partnership with ${decryptString(name)}, 
                        and we are committed to providing timely updates and necessary information.
`}
                        </p>
                       
                    </div>
                    <br />
                </div>
            </div>
            <Box>
                <Dialog
                    open={isErrorOpen}
                    onClose={handleCloseerr}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
                    >
                        {/* <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: 'orange' }} /> */}
                        <Typography variant="h6">{showAlert}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleCloseerr}
                        >
                            ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </>
    );
}

export default DocumentPreparationpage;