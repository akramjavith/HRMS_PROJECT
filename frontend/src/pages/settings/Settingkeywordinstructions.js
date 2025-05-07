import React, { useContext } from "react";
import { userStyle } from "../../pageStyle";
import { Box, Typography, TableBody, Paper, Table, TableHead, TableContainer } from "@mui/material";
import { StyledTableRow, StyledTableCell } from "../../components/Table";
import "jspdf-autotable";
import Headtitle from "../../components/Headtitle";
import { UserRoleAccessContext } from "../../context/Appcontext";

function SettingKeyWordInstructions() {
  const { isUserRoleCompare } = useContext(UserRoleAccessContext);

  return (
    <Box>
      <Headtitle title={"KEYWORD INSTRUCTIONS"} />
      <Typography sx={userStyle.HeaderText}>Keyword Instructions</Typography>
      {/* ****** Instructions Box ****** */}
      {isUserRoleCompare?.includes("lkeywordinstructions") && (
        <Box sx={userStyle.container}>
          <Typography sx={userStyle.importheadtext}>Instructions</Typography>
          <br />
          <Typography sx={userStyle.importsubheadtex}>Follow the instructions carefully before Creating Template</Typography>
          <br />
          <TableContainer
            component={Paper}
            sx={{
              padding: 1,
              width: "100%",
              margin: "auto",
              overflow: "auto",
              "&::-webkit-scrollbar": { width: 20 },
              "&::-webkit-scrollbar-track": { backgroundColor: "pink" },
              "&::-webkit-scrollbar-thumb": { backgroundColor: "blue" },
            }}
          >
            {/* ****** Table ****** */}
            <Table md={{ minWidth: 200, maxHeight: "5px", overflow: "auto" }} aria-label="customized table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>S.No</StyledTableCell>
                  <StyledTableCell align="left">Keywords</StyledTableCell>
                  <StyledTableCell align="left">Instructions</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    1
                  </StyledTableCell>
                  <StyledTableCell align="left"> 
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$COMPANYNAME$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Company Name of the selected company</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    2
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$JOBTITLE$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Job Title of the selected position</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    3
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$LOCATION$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Location of the selected position</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    4
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$DEPARTMENT$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Depatment of the selected position</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    5
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$TYPE$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Type of the selected position</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    6
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$APPLICATION:DEADLINE$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Application Deadline of the selected position</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    7
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$JOB:DESCRIPTION$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Job Description of the selected position</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    8
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$JOB:REQUIRMENTS$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Job Requirements of the selected position</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    9
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$JOBBENEFITS$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Job Benefits of the selected position</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    10
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$ROLESANDRESPONSIBLITIES$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Role & Responsibilities of the selected position</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    11
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$CONTACT:INFORMATION$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Contact information of the selected position</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    12
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$FULLNAME$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Full Name of the selected position</Typography>
                  </StyledTableCell>
                </StyledTableRow>
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    13
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$APPLICATION:EMAIL$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the Application Email of the selected position</Typography>
                  </StyledTableCell>
                </StyledTableRow>

               
                {/* <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    29
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Box sx={{ display: "flex", gap: "2px" }}>
                      <Typography sx={userStyle.importTabledata}>$SYSTEM:COUNT$</Typography>
                    </Box>{" "}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {" "}
                    <Typography sx={userStyle.importTabledata}>It denotes the System count of the selected person</Typography>
                  </StyledTableCell>
                </StyledTableRow> */}
              </TableBody>
            </Table>
            {/* ****** Table Ends ****** */}
          </TableContainer>
          <br />
        </Box>
      )}
      {/* ****** Instructions Box Ends ****** */}
    </Box>
  );
}

export default SettingKeyWordInstructions;
