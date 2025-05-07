import React, { useState, useEffect, useRef } from "react";
import { SERVICE } from "../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import "../App.css";
import hilifelogo from "../login/hilifelogo.png";
import { handleApiError } from "../components/Errorhandling";
import moment from "moment-timezone";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  TableBody,
  Paper,
  Table,
  TableHead,
  TableContainer,
  Container,
  Button,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useParams } from "react-router-dom";

function InterviewEndPage() {
  useEffect(() => {
    fetchStatus();
  }, []);

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
  const fetchStatus = async () => {
    try {
      let single_round = await axios.post(
        `${SERVICE.INTERVIEW_ROUND}/${candidateid}/${roundid}`
      );

      setAnswerStatus(
        single_round?.data?.interviewRound?.interviewForm?.map((t, index) => ({
          questionNo: index + 1,
          speed: t.userans?.includes("InComplete")
            ? "InComplete"
            : `${t.typingspeedans} wpm`,
          accuracy: t.userans?.includes("InComplete")
            ? "InComplete"
            : `${t.typingaccuracyans} %`,
          mistakes: t.userans?.includes("InComplete")
            ? "InComplete"
            : t.typingmistakesans,
          status: t.typingresult === "Eligible" ? true : false,
          // timetakeninseconds: t.userans?.includes("InComplete")
          //   ? "InComplete"
          //   : `${t.timetaken} seconds`,
          timetakeninseconds: t.userans?.includes("InComplete")
            ? "InComplete"
            : `${moment.utc(t.timetaken * 1000).format("mm:ss")}`,
        }))
      );
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const TypingTestResultCard = ({ result }) => {
    return (
      <Card
        variant="outlined"
        sx={{
          marginBottom: 2,
          backgroundColor: "#ecf0f1",
          border: "2px solid lightgray",
          borderRadius: "10px",
          boxSizing: "border-box",
          WebkitBoxShadow: "-1px 1px 15px 8px rgba(0,0,0,0.21)",
          boxShadow: "-1px 1px 15px 8px rgba(0,0,0,0.21)",
          minWidth: "240px",
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Question No: {result.questionNo} &nbsp;{" "}
            {result.status ? (
              <CheckCircleIcon
                color="success"
                sx={{ fontSize: 20, marginTop: "10px" }}
              />
            ) : (
              <CancelIcon
                color="error"
                sx={{ fontSize: 20, marginTop: "10px" }}
              />
            )}
          </Typography>
          <Divider />
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={12}>
              <Typography variant="body1">
                <b>Speed :</b> {result.speed}
              </Typography>
              <Typography variant="body1">
                <b>Accuracy :</b> {result.accuracy}
              </Typography>
              <Typography variant="body1">
                <b>Mistakes :</b> {result.mistakes}
              </Typography>
              <Typography variant="body1">
                <b>Time Taken :</b> {result.timetakeninseconds}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const TypingTestResults = ({ answerStatus }) => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid
          container
          spacing={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {answerStatus &&
            answerStatus.length > 0 &&
            mode === "typingtest" &&
            answerStatus.map((result, index) => (
              <Grid
                item
                key={index}
                xs={12}
                sm={6}
                md={4}
                lg={4}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  minWidth: "240px",
                  marginRight: "10px",
                }}
              >
                <TypingTestResultCard result={result} />
              </Grid>
            ))}
        </Grid>
      </Box>
    );
  };
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
              boxSizing: "border-box",
              WebkitBoxShadow: "-1px 1px 15px 8px rgba(0,0,0,0.21)",
              boxShadow: "-1px 1px 15px 8px rgba(0,0,0,0.21)",
            }}
            className="thankyoycard-subcontainer"
          >
            <h1
              style={{
                fontSize: "2rem",
                marginBottom: "20px",
                textAlign: "center",
              }}
              className="thankyoycardh1"
            >
              Thank you!
            </h1>
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
              Thanks a bunch for filling that out. It means a lot to us, just
              like you do! We really appreciate you giving us a moment of your
              time today. Thanks for being you!!
            </p>
          </div>
          <br />
          <p
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
          </p>
          <br />
          {mode === "typingtest" && (
            <TypingTestResults answerStatus={answerStatus} />
          )}
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

export default InterviewEndPage;