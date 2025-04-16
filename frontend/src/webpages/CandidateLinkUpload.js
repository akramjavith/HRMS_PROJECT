import React, { useState, useEffect } from "react";
import { SERVICE } from "../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import "../App.css";
import hilifelogo from "../login/hilifelogo.png";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import axios from "axios";
import { handleApiError } from "../components/Errorhandling";
import { useParams } from "react-router-dom";
import UploadIcon from "@mui/icons-material/Upload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

function CandidateLinkUpload() {
  const { count, uniqueid, filename } = useParams();

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [candidateFiles, setCandidateFiles] = useState([]);
  const [candidateFullName, setCandidateFullName] = useState("");
  const [candidateFilesTotalArray, setCandidateFilesTotalArray] = useState([]);
  const [candidateID, setCandidateId] = useState("");

  useEffect(() => {
    fetchStatus();
  }, [count, uniqueid, filename]);

  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };

  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const fetchStatus = async () => {
    try {
      let response = await axios.post(`${SERVICE.CANDIDATEFILEUPLOAD_LINK}`, {
        uniqueid: uniqueid,
        count: count,
        filename: filename,
      });

      setCandidateFiles(response?.data?.result || []);
      setCandidateId(response?.data?.candidateid);
      setCandidateFilesTotalArray(response?.data?.totalarray);

      let casesensitivefirstname = response?.data?.firstname
        ?.replace(/\s+/g, "")
        ?.toLowerCase();
      let casesensitivelastname = response?.data?.lastname
        ?.replace(/\s+/g, "")
        ?.toLowerCase();

      setCandidateFullName(
        `${casesensitivefirstname}_${casesensitivelastname}`
      );
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  const backPage = useNavigate();
  const handleSubmit = async () => {
    try {
      let emptyFile = candidateFiles.find((file) => file.name === "");
      let empty = !!emptyFile;
      if (empty) {
        setShowAlert(
          <>
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "100px", color: "orange" }}
            />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>
              {`Please Upload ${emptyFile.candidatefilename}`}
            </p>
          </>
        );
        handleClickOpenerr();
      } else {
        let finalArray = candidateFilesTotalArray.map((item) => {
          const newItem = candidateFiles.find(({ _id }) => _id === item._id);
          return newItem ? newItem : item;
        });
        let response = await axios.put(
          `${SERVICE.CANDIDATES_SINGLE}/${candidateID}`,
          {
            candidatedatafile: finalArray,
          }
        );
        backPage(`/thankyouforupload`);
      }
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const handleFileUpload = (event, fileName) => {
    const resume = event.target.files;
    const reader = new FileReader();
    const file = resume[0];
    const maxSizeInMB = 2;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file?.size > maxSizeInBytes) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {`File Size Should Be Less than ${maxSizeInMB} MB`}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      reader.readAsDataURL(file);
      reader.onload = () => {
        const fileData = reader.result.split(",")[1];
        let extension = file.name.split(".").pop();
        const updatedFiles = candidateFiles.map((item) => {
          if (item.candidatefilename === fileName) {
            return {
              ...item,
              data: fileData,
              name: `${candidateFullName}_${item.shortname}.${extension}`,
              preview: reader.result,
              uploaded: true,
              uploadedby: "candidate",
            };
          }
          return item;
        });
        setCandidateFiles(updatedFiles);
      };
    }
  };

  const renderFilePreviewCandidate = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };

  const handleFileCandidateDelete = (fileName) => {
    const updatedFiles = candidateFiles.map((item) => {
      if (item.candidatefilename === fileName) {
        return {
          ...item,
          data: "",
          name: "",
          preview: "",
          uploaded: false,
          uploadedby: "",
        };
      }
      return item;
    });
    setCandidateFiles(updatedFiles);
  };

  return (
    <>
      <div
        style={{
          textAlign: "center",
          paddingTop: "50px",
        }}
      >
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
      </div>

      {candidateFiles?.length > 0 && (
        <Box
          sx={{
            mt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            // minHeight: "100vh",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 600,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <List sx={{ width: "100%" }}>
              {candidateFiles?.map((file, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={file.candidatefilename}
                    secondary={
                      file.uploaded
                        ? `Uploaded File: ${file.name}`
                        : "Please upload a file less than 2 MB"
                    }
                  />
                  <ListItemSecondaryAction>
                    <Button
                      variant="outlined"
                      size="small"
                      component="label"
                      startIcon={<UploadIcon />}
                    >
                      Upload
                      <input
                        type="file"
                        accept=".xlsx, .xls, .csv, .pdf, .doc, .txt"
                        hidden
                        onChange={(e) =>
                          handleFileUpload(e, file.candidatefilename)
                        }
                      />
                    </Button>
                    {file.uploaded && (
                      <>
                        <IconButton edge="end" aria-label="view">
                          <VisibilityIcon
                            style={{
                              fontsize: "large",
                              color: "#357AE8",
                              cursor: "pointer",
                            }}
                            onClick={() => renderFilePreviewCandidate(file)}
                          />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          style={{
                            fontsize: "large",
                            color: "red",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleFileCandidateDelete(file.candidatefilename)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{ marginTop: "20px" }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      )}

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
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

export default CandidateLinkUpload;