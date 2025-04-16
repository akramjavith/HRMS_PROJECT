import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  OutlinedInput,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Button,
} from "@mui/material";
import { handleApiError } from "../../components/Errorhandling";
import { userStyle } from "../../pageStyle";
import "jspdf-autotable";
import axios from "axios";
import { SERVICE } from "../../services/Baseservice";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { UserRoleAccessContext } from "../../context/Appcontext";
import { AuthContext } from "../../context/Appcontext";
import Headtitle from "../../components/Headtitle";
import Selects from "react-select";
import { colourStyles } from "../../pageStyle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function ManageStockItemsPopup({
  setStockItemAuto,
  handleCloseviewalertstockitem,
}) {
  const [subcategoryOpt, setSubcategoryOption] = useState([]);
  const [uomOpt, setUomOpt] = useState([]);

  //state to handle holiday values
  const [managestockitemState, setManagestockitemState] = useState({
    stockcategory: "Please Select Stock category",
    stocksubcategory: "Please Select Stock Sub-category",
    itemname: "",
    uom: "Please Select UOM",
  });
  const [categoryOption, setCategoryOption] = useState([]);
  const [powerstationArray, setPowerstationArray] = useState([]);
  const { isUserRoleCompare, isUserRoleAccess } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();

  const [isAddOpenalert, setIsAddOpenalert] = useState(false);

  const [isAddOpenCheckalert, SetIsAddOpenCheckalert] = useState(false);
  useState(false);
  //useEffect

  //get all branches.
  const fetchCategoryAll = async () => {
    try {
      let res_location = await axios.get(SERVICE.STOCKCATEGORY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setCategoryOption([
        ...res_location?.data?.stockcategory?.map((t) => ({
          ...t,
          label: t.categoryname,
          value: t.categoryname,
        })),
      ]);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get all vom master name.
  const fetchVomMaster = async () => {
    try {
      let res_vom = await axios.get(SERVICE.ALL_VOMMASTERNAME, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setUomOpt(
        res_vom?.data?.vommaster?.map((t) => ({
          label: t.name,
          value: t.name,
        }))
      );
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchSubcategoryBased = async (e) => {
    try {
      let res_category = await axios.get(SERVICE.STOCKCATEGORY, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = res_category?.data?.stockcategory.filter((data) => {
        return e.value === data.categoryname;
      });

      let subcatOpt = data_set
        ?.map((item) => {
          return item.subcategoryname.map((subcategory) => {
            return {
              label: subcategory,
              value: subcategory,
            };
          });
        })
        .flat();
      setSubcategoryOption(subcatOpt);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //add function
  const sendRequest = async () => {
    try {
      let statusCreate = await axios.post(SERVICE.MANAGESTOCKITEMS_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        stockcategory: String(managestockitemState.stockcategory),
        stocksubcategory: String(managestockitemState.stocksubcategory),
        itemname: String(managestockitemState.itemname),
        uom: String(managestockitemState.uom),
        addedby: [
          {
            name: String(isUserRoleAccess?.username),
            date: String(new Date()),
          },
        ],
      });
      setStockItemAuto("none");
      await fetchHoliday();
      SetIsAddOpenCheckalert(true);
      setTimeout(() => {
        SetIsAddOpenCheckalert(false);
      }, 1000);
      handleCloseviewalertstockitem();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    const isNameMatch = powerstationArray?.some(
      (item) =>
        item.stockcategory?.toLowerCase() ===
          managestockitemState.stockcategory?.toLowerCase() &&
        item.stocksubcategory?.toLowerCase() ===
          managestockitemState.stocksubcategory?.toLowerCase() &&
        item.itemname?.toLowerCase() ===
          managestockitemState.itemname?.toLowerCase() &&
        item.uom?.toLowerCase() === managestockitemState.uom?.toLowerCase()
    );
    if (managestockitemState.stockcategory === "Please Select Stock category") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Stock category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (
      managestockitemState.stocksubcategory ===
      "Please Select Stock Sub-category"
    ) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Stock Sub-category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (managestockitemState.itemname === "") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Enter Item Name"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (managestockitemState.uom === "Please Select UOM") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select UOM"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (isNameMatch) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Manage stock Items already exists!"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else {
      sendRequest();
    }
  };
  const handleclear = (e) => {
    e.preventDefault();
    setManagestockitemState({
      stockcategory: "Please Select Stock category",
      stocksubcategory: "Please Select Stock Sub-category",
      itemname: "",
      uom: "Please Select UOM",
    });
    setSubcategoryOption([]);
  };

  //get all data.
  const fetchHoliday = async () => {
    try {
      let res_status = await axios.get(SERVICE.MANAGESTOCKITEMS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setPowerstationArray(res_status?.data?.managestockitems);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchCategoryAll();
    fetchHoliday();
    fetchVomMaster();
  }, []);

  const handleCloseAddalert = () => {
    setIsAddOpenalert(false);
  };

  return (
    <Box>
      <Headtitle title={"Manage Stock Items"} />
      <>
        {isUserRoleCompare?.includes("amanagestockitems") && (
          <Box sx={userStyle.selectcontainer}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Stock Items
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Stock Category<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={categoryOption}
                      styles={colourStyles}
                      value={{
                        label: managestockitemState.stockcategory,
                        value: managestockitemState.stockcategory,
                      }}
                      onChange={(e) => {
                        setManagestockitemState({
                          ...managestockitemState,
                          stockcategory: e.value,
                          stocksubcategory: "Please Select Stock Sub-category",
                        });
                        fetchSubcategoryBased(e);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Stock Sub-category<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={subcategoryOpt}
                      styles={colourStyles}
                      value={{
                        label: managestockitemState.stocksubcategory,
                        value: managestockitemState.stocksubcategory,
                      }}
                      onChange={(e) => {
                        setManagestockitemState({
                          ...managestockitemState,
                          stocksubcategory: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Item Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Item Name"
                      value={managestockitemState.itemname}
                      onChange={(e) => {
                        setManagestockitemState({
                          ...managestockitemState,
                          itemname: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      UOM<b style={{ color: "red" }}>*</b>{" "}
                    </Typography>
                    <Selects
                      options={uomOpt}
                      styles={colourStyles}
                      value={{
                        label: managestockitemState.uom,
                        value: managestockitemState.uom,
                      }}
                      onChange={(e) => {
                        setManagestockitemState({
                          ...managestockitemState,
                          uom: e.value,
                        });
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <br />
              <br />
              <Grid item md={12} sm={12} xs={12}>
                <br />
                <br />
                <Grid
                  container
                  spacing={2}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={userStyle.buttonadd}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </Grid>
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    <Button sx={userStyle.btncancel} onClick={handleclear}>
                      Clear
                    </Button>
                  </Grid>
                  <Grid item lg={1} md={2} sm={2} xs={12}>
                    <Button
                      sx={userStyle.btncancel}
                      onClick={handleCloseviewalertstockitem}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </>
          </Box>
        )}
      </>

      <Box>
        {/* Add DIALOG */}
        <Dialog
          open={isAddOpenalert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent
            sx={{
              width: "350px",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <ErrorOutlineOutlinedIcon
              sx={{ fontSize: "70px", color: "orange" }}
            />
            <Typography
              variant="h6"
              sx={{ color: "black", textAlign: "center" }}
            >
              Added Successfully
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant="contained"
              color="error"
              onClick={handleCloseAddalert}
            >
              {" "}
              OK{" "}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Add DIALOG */}
      <Dialog
        open={isAddOpenCheckalert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            padding: "37px 23px",
            width: "350px",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <CheckCircleOutlineIcon sx={{ fontSize: "100px", color: "orange" }} />
          <Typography variant="h6">
            <b>Added Successfully👍</b>
          </Typography>
        </DialogContent>
      </Dialog>
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
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={handleCloseerr}
            >
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
export default ManageStockItemsPopup;
