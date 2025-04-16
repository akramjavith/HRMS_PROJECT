import React from "react";
import { userStyle } from "../pageStyle";
import { StyledTableRow, StyledTableCell } from "./Table";
import moment from "moment-timezone";
import {
  Box,
  Typography,
  TableBody,
  Dialog,
  FormControl,
  Grid,
  Table,
  TableHead,
  Button,
} from "@mui/material";

const InfoPopup = ({
  openInfo,
  handleCloseinfo,
  heading,
  addedby,
  updateby,
}) => {
  return (
    <Dialog
      open={openInfo}
      onClose={handleCloseinfo}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ marginTop: "95px" }}
    >
      <Box sx={{ width: "550px", padding: "20px 50px" }}>
        <>
          <Typography sx={userStyle.HeaderText}>{heading}</Typography>
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item md={12} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Added by</Typography>
                <br />
                <Table>
                  <TableHead>
                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                      {"SNO"}.
                    </StyledTableCell>
                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                      {" "}
                      {"UserName"}
                    </StyledTableCell>
                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                      {" "}
                      {"Date"}
                    </StyledTableCell>
                  </TableHead>
                  <TableBody>
                    {addedby?.map((item, i) => (
                      <StyledTableRow>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {i + 1}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {item.name}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </FormControl>
            </Grid>
            <Grid item md={12} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography variant="h6">Updated by</Typography>
                <br />
                <Table>
                  <TableHead>
                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                      {"SNO"}.
                    </StyledTableCell>
                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                      {" "}
                      {"UserName"}
                    </StyledTableCell>
                    <StyledTableCell sx={{ padding: "5px 10px !important" }}>
                      {" "}
                      {"Date"}
                    </StyledTableCell>
                  </TableHead>
                  <TableBody>
                    {updateby?.map((item, i) => (
                      <StyledTableRow>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {i + 1}.
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {item.name}
                        </StyledTableCell>
                        <StyledTableCell
                          sx={{ padding: "5px 10px !important" }}
                        >
                          {" "}
                          {moment(item.date).format("DD-MM-YYYY hh:mm:ss a")}
                        </StyledTableCell>
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
            <Button
              variant="contained"
              onClick={handleCloseinfo}
              sx={{ marginLeft: "15px" }}
            >
              {" "}
              Back{" "}
            </Button>
          </Grid>
        </>
      </Box>
    </Dialog>
  );
};

export default InfoPopup;