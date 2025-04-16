import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import hilifelogo from "../login/hilifelogo.png";

function ExitInterviewEndPage() {

  const mode = useParams()?.mode;
  const candidateid = useParams()?.candidateid;
  const roundid = useParams()?.roundid;

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  const [answerStatus, setAnswerStatus] = useState([]);
  return (
    <>
      <div
        style={{
          textAlign: "center",
          paddingTop: "50px",
        }}
      >
        {/* Navbar */}
        <div
          style={{
            padding: "10px",
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            backgroundColor: "black",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={hilifelogo}
              alt="Logo"
              style={{ height: "50px", width: "auto", marginRight: "10px" }}
            />
            <h2 style={{ color: "white", fontSize: "1.5rem", margin: 0 }}>
              HIHRMS
            </h2>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: mode === "typingtest" ? "100vh" : "90vh",
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
              margin: "0 auto", // Center the card horizontally
              boxSizing: "border-box",
              boxShadow: "-1px 1px 15px 8px rgba(0,0,0,0.21)",
            }}
            className="thankyou-card-container"
          >
            <h1
              style={{
                fontSize: "2rem",
                marginBottom: "20px",
                textAlign: "center",
              }}
              className="thankyou-card-h1"
            >
              Thank you!
            </h1>
            <p
              style={{
                fontSize: "1rem",
                textAlign: "center",
                lineHeight: "1.5", // Adjusted for better readability
                fontFamily: "Comic Sans MS, cursive, sans-serif",
                letterSpacing: "1.5px", // Adjusted for a more balanced look
                color: "#9C9C9C",
                fontWeight: "bold",
                fontStyle: "italic",
              }}
              className="thankyou-card-p"
            >
              Thank you so much for completing your exit interview! We truly value the time you took to share your thoughts and experiences with us. Your feedback is incredibly important and helps us improve continuously. We wish you all the best in your future endeavors. Thanks for being such an important part of our journey!
            </p>
          </div>

          <br />
          {/* <p
            style={{
              fontSize: "0.8rem",
              textAlign: "center",
              lineHeight: "30px",

              fontFamily: "Comic Sans MS, cursive, sans-serif",
              letterSpacing: "2.2px",
              wordSpacing: "-1.2px",
              color: "#f5bf42",
              fontWeight: "bolder",
              textDecoration: "none",
              fontStyle: "italic",
              fontVariant: "normal",
              textTransform: "none",
            }}
          >
            Further details check your Email !!
          </p> */}
          <br />
        </div>
      </div>

      {/* ALERT DIALOG */}
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
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

export default ExitInterviewEndPage;