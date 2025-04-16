import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box, Button, Checkbox, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton,
  List, ListItem, ListItemText, MenuItem, OutlinedInput, Popover, Select, TextField, Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import AlertDialog from "../../components/Alert";
import { DeleteConfirmation, PleaseSelectRow, } from "../../components/DeleteConfirmation.js";
import ExportData from "../../components/ExportData";
import InfoPopup from "../../components/InfoPopup.js";
import MessageAlert from "../../components/MessageAlert";
import AggregatedSearchBar from "../../components/AggregatedSearchBar";
import AggridTable from "../../components/AggridTable";
import domtoimage from 'dom-to-image';
import PageHeading from "../../components/PageHeading";

function VendorGrouping() {
  const [isHandleChange, setIsHandleChange] = useState(false);
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);
  const [searchedString, setSearchedString] = useState("");
  const gridRefTable = useRef(null);
  const gridRefTableImg = useRef(null);
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setloadingdeloverall(false);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("");
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  let exportColumnNames = ["Name", "Vendor"];
  let exportRowValues = ["name", "vendor"];

  const [loadingdeloverall, setloadingdeloverall] = useState(false);
  const [subsubcomponent, setSubsubcomponent] = useState({
    categoryname: "",
    subcategoryname: "",
    subsubname: "",
  });
  const [subsusbcomponents, setSubsubcomponents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allSubsubcomponentedit, setAllSubsubcomponentedit] = useState([]);

  const [selectedRowsVendorGrouping, setSelectedRowsVendorGrouping] = useState([])
  // Error Popup model
  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [showAlertpop, setShowAlertpop] = useState();
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };

  const [ovProj, setOvProj] = useState("");
  const [ovProjvendor, setOvProjvendor] = useState("");
  const [ovProjCount, setOvProjCount] = useState("");
  const [getOverAllCount, setGetOverallCount] = useState("");
  //check delete model
  const [isCheckOpen, setisCheckOpen] = useState(false);
  const [overalldeletecheck, setOveraldeletecheck] = useState({
    vendorgrouping: [],
    expense: [],
    assetdetail: [],
    schedule: [],
    stock: [],
    manualstockentry: [],
  });

  const handleClickOpenCheck = () => {
    setisCheckOpen(true);
  };
  const handleCloseCheck = () => {
    setisCheckOpen(false);
  };

  //check delete model
  const [isbulkCheckOpen, setisCheckOpenbulk] = useState(false);
  const handleClickOpenCheckbulk = () => {
    setisCheckOpenbulk(true);
  };
  const handlebulkCloseCheck = () => {

    setisCheckOpenbulk(false);
  };








  const { isUserRoleCompare, isUserRoleAccess, pageName, setPageName, buttonStyles } = useContext(
    UserRoleAccessContext
  );
  const { auth } = useContext(AuthContext);
  const [subsubcomponentCheck, setSubsubcomponentcheck] = useState(false);
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [vendorGroupingIndidvidual, setVendorGroupingIndidvidual] = useState();
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [name, setName] = useState("");
  const [nameEdit, setNameEdit] = useState("");
  const [vendorEdit, setVendorEdit] = useState("Please Select Vendor");
  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);

  const handleCategoryChange = (options) => {
    setSelectedOptionsCate(options);
  };

  const customValueRendererCate = (valueCate, _categorys) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Vendor";
  };

  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage.toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, "Vendor Grouping.png");
        })
        .catch((error) => {
          console.error("dom-to-image error: ", error);
        });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // view model
  const [openview, setOpenview] = useState(false);

  const handleClickOpenview = () => {
    setOpenview(true);
  };
  const handleCloseview = () => {
    setOpenview(false);
  };

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
    setloadingdeloverall(false);
  };

  //Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };
  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  // const handleClickOpenalert = () => {
  //   setIsHandleChange(true);
  //   if (selectedRows.length === 0) {
  //     setIsDeleteOpenalert(true);
  //   } else {
  //     setIsDeleteOpencheckbox(true);
  //   }
  // };


  const handleClickOpenalert = async () => {
    try {


      let value = [...new Set(selectedRowsVendorGrouping.flat())]
      console.log(value, "value")
      setIsHandleChange(true);
      if (selectedRows.length === 0) {
        setIsDeleteOpenalert(true);
      } else {


        let resexpense = await axios.post(SERVICE.OVERALL_DELETE_VENDOR_GROUPING_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          data: value,

        });




        setCheckExpense(resexpense?.data?.expense);
        setCheckAssetdetail(resexpense?.data?.assetdetail);
        setCheckSchedule(resexpense?.data?.schedulepayment);
        setCheckstock(resexpense?.data?.stock);
        setCheckmanualstock(resexpense?.data?.manualstockentry);



        let expense = resexpense?.data?.expense?.map(t => ({
          name: t.vendorgrouping,
          vendor: t.vendorname
        }
        ));
        let assetdetail = resexpense?.data?.assetdetail?.map(t => ({
          name: t.vendorgroup,
          vendor: t.vendor
        }
        ));
        let schedule = resexpense?.data?.schedulepayment?.map(t => ({
          name: t.vendorgrouping,
          vendor: t.vendor
        }
        ));
        let stock = resexpense?.data?.stock?.map(t => ({
          name: t.vendorgroup,
          vendor: t.vendor
        }
        ));
        let manualstockentry = resexpense?.data?.manualstockentry?.map(t => ({
          name: t.vendorgroup,
          vendor: t.vendorname
        }
        ));

        if (
          (resexpense?.data?.stock).length > 0 ||
          (resexpense?.data?.expense).length > 0 ||
          (resexpense?.data?.assetdetail).length > 0 ||
          (resexpense?.data?.schedulepayment).length > 0 ||
          (resexpense?.data?.manualstockentry).length > 0
        ) {
          handleClickOpenCheckbulk();
          setOveraldeletecheck({
            ...overalldeletecheck,
            expense: expense,
            assetdetail: assetdetail,
            schedule: schedule,
            stock: stock,
            manualstockentry: manualstockentry

          })


          setCheckExpense([])
          setCheckAssetdetail([])
          setCheckSchedule([])
          setCheckstock([])
          setCheckmanualstock([])
        } else {
          setIsDeleteOpencheckbox(true);
        }
      }
    }
    catch
    (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);

    }
  };



  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
  };

  //Delete model
  const [isDeleteOpencheckbox, setIsDeleteOpencheckbox] = useState(false);

  const handleClickOpencheckbox = () => {
    setIsDeleteOpencheckbox(true);
  };
  const handleCloseModcheckbox = () => {
    setIsDeleteOpencheckbox(false);
  };

  // Manage Columns
  const [isManageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenManageColumns = (event) => {
    setAnchorEl(event.currentTarget);
    setManageColumnsOpen(true);
  };
  const handleCloseManageColumns = () => {
    setManageColumnsOpen(false);
    setSearchQueryManage("");
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.data.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    categoryname: true,
    subcategoryname: true,
    name: true,
    vendor: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  const [deleteSubsub, setDeleteSubsub] = useState("");


  const [checkexpense, setCheckExpense] = useState([]);
  const [checkassetdetail, setCheckAssetdetail] = useState([]);
  const [checkSchedule, setCheckSchedule] = useState([]);
  const [checkstock, setCheckstock] = useState([]);
  const [checkmanualstock, setCheckmanualstock] = useState([]);


  const rowData = async (id, name, vendor) => {
    setPageName(!pageName)
    try {
      // let res = await axios.get(`${SERVICE.SINGLE_VENDORGROUPING}/${id}`, {
      //   headers: {
      //     Authorization: `Bearer ${auth.APIToken}`,
      //   },
      // });


      const [res, resexpense] = await Promise.all([
        axios.get(`${SERVICE.SINGLE_VENDORGROUPING}/${id}`, {
          headers: {
            'Authorization': `Bearer ${auth.APIToken}`
          }
        }),

        axios.post(SERVICE.OVERALL_DELETE_VENDOR_GROUPING_LINKED_DATA, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          // vendorgroup: [name],
          // vendor: [vendor],
          data: [{ name: name, vendor: vendor }]
        }),


      ])

      setDeleteSubsub(res?.data?.svendorgrouping);

      setCheckExpense(resexpense?.data?.expense);
      setCheckAssetdetail(resexpense?.data?.assetdetail);
      setCheckSchedule(resexpense?.data?.schedulepayment);
      setCheckstock(resexpense?.data?.stock);
      setCheckmanualstock(resexpense?.data?.manualstockentry);

      if (
        (resexpense?.data?.stock).length > 0 ||
        (resexpense?.data?.expense).length > 0 ||
        (resexpense?.data?.assetdetail).length > 0 ||
        (resexpense?.data?.schedulepayment).length > 0 ||
        (resexpense?.data?.manualstockentry).length > 0
      ) {
        handleClickOpenCheck();
      } else {
        handleClickOpen();
      }



      // handleClickOpen();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Alert delete popup
  let Subsubsid = deleteSubsub?._id;
  const delSubsub = async () => {
    setPageName(!pageName)
    try {
      if (Subsubsid) {
        await axios.delete(`${SERVICE.SINGLE_VENDORGROUPING}/${Subsubsid}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });

        handleCloseMod();
        setFilteredRowData([])
        setFilteredChanges(null)
        setSelectedRows([]);
        setPage(1);
        await fetchSubsubcomponent();
        setPopupContent("Deleted Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const delSubsubcheckbox = async () => {
    setPageName(!pageName)
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_VENDORGROUPING}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      await Promise.all(deletePromises);
      setIsHandleChange(false);
      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      setFilteredRowData([])
      setFilteredChanges(null)
      await fetchSubsubcomponent();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };



  const delaccountheadwithoutlink = async () => {
    try {
      let valfilter = [
        ...overalldeletecheck.expense,
        ...overalldeletecheck.assetdetail,
        ...overalldeletecheck.schedule,
        ...overalldeletecheck.stock,
        ...overalldeletecheck.manualstockentry
      ];

      let filtered = rowDataTable.filter(d =>
        !valfilter.some(condition =>
          condition.name === d.name && condition.vendor === d.vendor
        )
      )?.flatMap(d => selectedRows?.filter(item => d.id === item));
      console.log(filtered, "filtered")

      const deletePromises = filtered?.map((item) => {
        return axios.delete(`${SERVICE.SINGLE_VENDORGROUPING}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handlebulkCloseCheck();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchSubsubcomponent();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };


  const [vendorOpt, setVendoropt] = useState([]);

  const fetchVendor = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.ALL_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const all = [
        ...res?.data?.vendordetails.map((d) => ({
          ...d,
          label: d.vendorname,
          value: d.vendorname,
        })),
      ];
      setVendoropt(all);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //add function
  const sendRequest = async () => {
    setPageName(!pageName)
    let vendors = selectedOptionsCate.map((item) => item.value);
    try {
      let vendorgroup = Promise.all(
        vendors.map(async (data) => {
          await axios.post(
            SERVICE.ADD_VENDORGROUPING,
            {
              vendor: data,
              name: name,
              addedby: [
                {
                  name: String(isUserRoleAccess.companyname),
                  date: String(new Date()),
                },
              ],
            },
            {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
            }
          );
        })
      );



      setSubsubcomponent({ ...subsubcomponent, subsubname: "" });
      setPage(1)
      await fetchSubsubcomponent();
      setloadingdeloverall(false);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    } finally {
      await fetchSubsubcomponent();
    }
  };

  //submit option for saving

  const handleSubmit = (e) => {
    setPageName(!pageName)
    setloadingdeloverall(true);
    let vendors = selectedOptionsCate.map((item) => item.value);

    e.preventDefault();
    const isNameMatch = subsusbcomponents.some(
      (item) =>
        item.name.toLowerCase() === name.toLowerCase() &&
        vendors.includes(item.vendor)
    );

    if (name == "" || name == undefined) {
      setPopupContentMalert("Please Enter Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCate.length == 0) {
      setPopupContentMalert("Please Select Vendor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  const handleClear = (e) => {
    setPageName(!pageName)
    e.preventDefault();
    setSelectedOptionsCate([]);
    setName("");

    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //Edit model...
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleClickOpenEdit = () => {
    setIsEditOpen(true);
  };
  const handleCloseModEdit = (e, reason) => {
    if (reason && reason === "backdropClick") return;
    setIsEditOpen(false);
  };

  // info model
  const [openInfo, setOpeninfo] = useState(false);

  const handleClickOpeninfo = () => {
    setOpeninfo(true);
  };

  const handleCloseinfo = () => {
    setOpeninfo(false);
  };

  //get single row to edit....
  const getCode = async (e, name, vendor) => {
    console.log(vendor, "vendor")
    setPageName(!pageName)
    try {
      const [resSingleVendorGroup, resAllVendorGrouping] = await Promise.all([
        axios.get(`${SERVICE.SINGLE_VENDORGROUPING}/${e}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
        axios.get(SERVICE.ALL_VENDORGROUPING, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }),
      ]);
      setAllSubsubcomponentedit(
        resAllVendorGrouping?.data?.vendorgrouping.filter(
          (item) =>
            item._id !== resSingleVendorGroup?.data?.svendorgrouping?._id
        )
      );
      setNameEdit(resSingleVendorGroup?.data?.svendorgrouping?.name);
      setVendorEdit(resSingleVendorGroup?.data?.svendorgrouping?.vendor);
      setVendorGroupingIndidvidual(resSingleVendorGroup?.data?.svendorgrouping);
      setOvProj(name);
      setOvProjvendor(vendor);
      getOverallEditSection(name, vendor);
      handleClickOpenEdit();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // get single row to view....
  const getviewCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VENDORGROUPING}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendorGroupingIndidvidual(res?.data?.svendorgrouping);
      handleClickOpenview();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // get single row to view....
  const getinfoCode = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VENDORGROUPING}/${e}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendorGroupingIndidvidual(res?.data?.svendorgrouping);
      handleClickOpeninfo();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchVendor();
  }, []);

  //Project updateby edit page...
  let updateby = vendorGroupingIndidvidual?.updatedby;
  let addedby = vendorGroupingIndidvidual?.addedby;

  let subprojectsid = vendorGroupingIndidvidual?._id;


  const getOverallEditSection = async (e, vendor) => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_VENDOR_GROUPING_LINKED_DATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: e,
        oldnamevendor: vendor
      });
      setOvProjCount(res?.data?.count);


      setGetOverallCount(`The ${e + "," + vendor} is linked in
     ${res?.data?.expense?.length > 0 ? "Expense ," : ""}
    ${res?.data?.assetdetail?.length > 0 ? "Asset List ," : ""}
      ${res?.data?.schedulepayment?.length > 0 ? "Schedule Payment," : ""}
        ${res?.data?.stock?.length > 0 ? "Stock Purchase ," : ""} 
    ${res?.data?.manualstockentry?.length > 0 ? "Manual Stock Entry ," : ""} 
    whether you want to do changes ..??`);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //overall edit section for all pages
  const getOverallEditSectionUpdate = async () => {
    try {
      let res = await axios.post(SERVICE.OVERALL_EDIT_VENDOR_GROUPING_LINKED_DATA, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        oldname: ovProj,
        oldnamevendor: ovProjvendor
      });

      sendEditRequestOverall(
        res?.data?.expense,
        res?.data?.assetdetail,
        res?.data?.schedulepayment,
        res?.data?.stock,
        res?.data?.manualstockentry

      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const sendEditRequestOverall = async (
    expense, assetdetail, schedulepayment, stock, manualstockentry) => {
    try {

      if (expense.length > 0) {
        let answ = expense.map((d, i) => {
          let res = axios.put(`${SERVICE.EXPENSES_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            vendorgrouping: String(nameEdit),

          });
        });
      }

      if (assetdetail.length > 0) {
        let answ = assetdetail.map((d, i) => {
          let res = axios.put(`${SERVICE.ASSETDETAIL_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            vendorgroup: String(nameEdit),

          });
        });
      }

      // if (assetdetail.length > 0) {

      //   let assetdetailaltered = assetdetail.map((d, i) => {

      //     return {
      //       ...d,
      //       vendorgroup: d.vendorgroup === ovProj && d.vendor === ovProjvendor ? nameEdit : d.vendorgroup,
      //       subcomponent: d.subcomponent.map(item => {
      //         if (item.vendorgroup === ovProj && item.vendor === ovProjvendor) {
      //           return {
      //             ...item,
      //             vendorgroup: String(nameEdit),
      //           }
      //         } else {

      //           return item
      //         }
      //       })
      //     }
      //   })



      //   let answ = assetdetailaltered.map((d, i) => {
      //     let res = axios.put(`${SERVICE.ASSETDETAIL_SINGLE}/${d._id}`, {
      //       headers: {
      //         Authorization: `Bearer ${auth.APIToken}`,
      //       },

      //       vendorgroup: d.vendorgroup,
      //       subcomponent: d.subcomponent


      //     });
      //   });
      // }

      if (schedulepayment.length > 0) {
        let answ = schedulepayment.map((d, i) => {
          let res = axios.put(`${SERVICE.SINGLE_SCHEDULEPAYMENTMASTER}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            vendorgrouping: String(nameEdit),
          });
        });
      }





      if (stock.length > 0) {
        let answ = stock.map((d, i) => {
          let res = axios.put(`${SERVICE.STOCKPURCHASE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            vendorgroup: String(nameEdit),
          });
        });
      }

      // if (stock.length > 0) {

      //   let stockaltered = stock.map((d, i) => {

      //     return {
      //       ...d,
      //       vendorgroup: d.vendorgroup === ovProj && d.vendor === ovProjvendor ? nameEdit : d.vendorgroup,
      //       subcomponent: d.subcomponent.map(item => {
      //         if (item.vendorgroup === ovProj && item.vendor === ovProjvendor) {
      //           return {
      //             ...item,
      //             vendorgroup: String(nameEdit),
      //           }
      //         } else {

      //           return item
      //         }
      //       })
      //     }
      //   })



      //   let answ = stockaltered.map((d, i) => {
      //     let res = axios.put(`${SERVICE.STOCKPURCHASE_SINGLE}/${d._id}`, {
      //       headers: {
      //         Authorization: `Bearer ${auth.APIToken}`,
      //       },

      //       vendorgroup: d.vendorgroup,
      //       subcomponent: d.subcomponent
      //     });
      //   });
      // }

      if (manualstockentry.length > 0) {
        let answ = manualstockentry.map((d, i) => {
          let res = axios.put(`${SERVICE.MANUAL_STOCKPURCHASE_SINGLE}/${d._id}`, {
            headers: {
              Authorization: `Bearer ${auth.APIToken}`,
            },
            vendorgroup: String(nameEdit),
          });
        });
      }


      // if (manualstockentry.length > 0) {

      //   let manualstockentryaltered = manualstockentry.map((d, i) => {

      //     return {
      //       ...d,
      //       vendorgroup: d.vendorgroup === ovProj && d.vendor === ovProjvendor ? nameEdit : d.vendorgroup,
      //       subcomponent: d.subcomponent.map(item => {
      //         if (item.vendorgroup === ovProj && item.vendor === ovProjvendor) {
      //           return {
      //             ...item,
      //             vendorgroup: String(nameEdit),
      //           }
      //         } else {

      //           return item
      //         }
      //       })
      //     }
      //   })



      //   let answ = manualstockentryaltered.map((d, i) => {
      //     let res = axios.put(`${SERVICE.MANUAL_STOCKPURCHASE_SINGLE}/${d._id}`, {
      //       headers: {
      //         Authorization: `Bearer ${auth.APIToken}`,
      //       },

      //       vendorgroup: d.vendorgroup,
      //       subcomponent: d.subcomponent
      //     });
      //   });
      // }


    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //editing the single data...
  const sendEditRequest = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.put(
        `${SERVICE.SINGLE_VENDORGROUPING}/${subprojectsid}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },

          name: nameEdit,
          vendor: vendorEdit,
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );

      await fetchSubsubcomponent();
      await fetchSubsubcomponentAll();
      await getOverallEditSectionUpdate();
      handleCloseModEdit();
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const editSubmit = async (e) => {
    setPageName(!pageName)
    e.preventDefault();

    const isNameMatch = allSubsubcomponentedit.some(
      (item) =>
        item.name.toLowerCase() === nameEdit.toLowerCase() &&
        item.vendor == vendorEdit
    );
    if (nameEdit == undefined || nameEdit == "") {
      setPopupContentMalert("Please Enter Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendorEdit == undefined || vendorEdit == "") {
      setPopupContentMalert("Please Select Vendor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    }
    else if (nameEdit != ovProj && ovProjCount > 0) {
      setShowAlertpop(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>{getOverAllCount}</p>
        </>
      );
      handleClickOpenerrpop();
    }
    else {
      sendEditRequest();
    }
  };

  //get all Sub vendormasters.
  const fetchSubsubcomponent = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VENDORGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSubsubcomponentcheck(true);
      setSubsubcomponents(res_vendor?.data?.vendorgrouping.map((item, index) => ({
        ...item,
        id: item._id,
        serialNumber: index + 1,
      })));
    } catch (err) {
      setSubsubcomponentcheck(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //get all Sub vendormasters.
  const fetchSubsubcomponentAll = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VENDORGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAllSubsubcomponentedit(
        res_vendor?.data?.vendorgrouping.filter(
          (item) => item._id !== vendorGroupingIndidvidual?._id
        )
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Vendor Grouping",
    pageStyle: "print",
  });

  useEffect(() => {
    fetchSubsubcomponent();
    // fetchSubsubcomponentAll();
  }, []);

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(subsusbcomponents);
  }, [subsusbcomponents]);

  //Datatable
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRows([]);
    setSelectAllChecked(false);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setSelectedRows([]);
    setSelectAllChecked(false);
    setPage(1);
  };

  //datatable....
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  // Split the search query into individual terms
  const searchTerms = searchQuery.toLowerCase().split(" ");
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) =>
      Object.values(item).join(" ").toLowerCase().includes(term)
    );
  });

  const filteredData = filteredDatas.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredDatas.length / pageSize);

  const visiblePages = Math.min(totalPages, 3);

  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(
    firstVisiblePage + visiblePages - 1,
    totalPages
  );

  const pageNumbers = [];

  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  for (let i = firstVisiblePage; i <= lastVisiblePage; i++) {
    pageNumbers.push(i);
  }

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const CheckboxHeader = ({ selectAllChecked, onSelectAll }) => (
    <div>
      <Checkbox checked={selectAllChecked} onChange={onSelectAll} />
    </div>
  );

  const columnDataTable = [
    {
      field: "checkbox",
      headerName: "Checkbox", // Default header name
      headerStyle: {
        fontWeight: "bold", // Apply the font-weight style to make the header text bold
        // Add any other CSS styles as needed
      },

      sortable: false, // Optionally, you can make this column not sortable
      width: 90,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
      pinned: "left",
      lockPinned: true,
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 100,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0,
      width: 250,
      hide: !columnVisibility.name,
      headerClassName: "bold-header",
    },
    {
      field: "vendor",
      headerName: "Vendor",
      flex: 0,
      width: 250,
      hide: !columnVisibility.vendor,
      headerClassName: "bold-header",
    },

    {
      field: "actions",
      headerName: "Action",
      flex: 0,
      width: 250,
      minHeight: "40px !important",
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: "bold-header",
      cellRenderer: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("evendorgrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getCode(params.data.id, params.data.name, params.data.vendor);
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dvendorgrouping") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.data.id, params.data.name, params.data.vendor);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
            </Button>
          )}
          {isUserRoleCompare?.includes("vvendorgrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getviewCode(params.data.id);
              }}
            >
              <VisibilityOutlinedIcon sx={buttonStyles.buttonview} />
            </Button>
          )}
          {isUserRoleCompare?.includes("ivendorgrouping") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                getinfoCode(params.data.id);
              }}
            >
              <InfoOutlinedIcon sx={buttonStyles.buttoninfo} />
            </Button>
          )}
        </Grid>
      ),
    },
  ];

  const rowDataTable = filteredData.map((item, index) => {
    return {
      id: item._id,
      serialNumber: item.serialNumber,
      name: item.name,
      vendor: item.vendor,
    };
  });

  const rowsWithCheckboxes = rowDataTable.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row.id),
  }));

  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };

  // // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) =>
    column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase())
  );

  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };

  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box
      style={{
        padding: "10px",
        minWidth: "325px",
        "& .MuiDialogContent-root": { padding: "10px 0" },
      }}
    >
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumns}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ position: "relative", margin: "10px" }}>
        <TextField
          label="Find column"
          variant="standard"
          fullWidth
          value={searchQueryManage}
          onChange={(e) => setSearchQueryManage(e.target.value)}
          sx={{ marginBottom: 5, position: "absolute" }}
        />
      </Box>
      <br />
      <br />
      <DialogContent
        sx={{ minWidth: "auto", height: "200px", position: "relative" }}
      >
        <List sx={{ overflow: "auto", height: "100%" }}>
          {filteredColumns.map((column) => (
            <ListItem key={column.field}>
              <ListItemText
                sx={{ display: "flex" }}
                primary={
                  <Switch
                    sx={{ marginTop: "-5px" }}
                    size="small"
                    checked={columnVisibility[column.field]}
                    onChange={() => toggleColumnVisibility(column.field)}
                  />
                }
                secondary={
                  column.field === "checkbox" ? "Checkbox" : column.headerName
                }
              // secondary={column.headerName }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: "none" }}
              onClick={() => setColumnVisibility(initialColumnVisibility)}
            >
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: "none" }}
              onClick={() => {
                const newColumnVisibility = {};
                columnDataTable.forEach((column) => {
                  newColumnVisibility[column.field] = false; // Set hide property to true
                });
                setColumnVisibility(newColumnVisibility);
              }}
            >
              Hide All
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Box>
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);

  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const [fileFormat, setFormat] = useState("");

  //Access Module
  const pathname = window.location.pathname;
  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Vendor Grouping"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),
      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });

  }

  useEffect(() => {
    getapi();
  }, []);


  const getLinkedLabelItem1 = (overalldeletecheck) => {
    const {
      expense = [],
      schedule = [],
      assetdetail = [],

      stock = [],
      manualstockentry = []
    } = overalldeletecheck;
    const labels = [];

    expense.forEach(item => labels.push(item.name));

    schedule.forEach(item => labels.push(item.name));
    assetdetail.forEach(item => labels.push(item.name));

    stock.forEach(item => labels.push(item.name));
    manualstockentry.forEach(item => labels.push(item.name));
    // Remove duplicates using a Set
    const uniqueLabels = [...new Set(labels)];
    return uniqueLabels.join(", ");


    return labels;

  };

  const getLinkedLabelItem = (overalldeletecheck) => {
    const {

      expense = [],
      schedule = [],
      assetdetail = [],

      stock = [],
      manualstockentry = []

    } = overalldeletecheck;

    const uniqueLabels = [
      ...expense, ...schedule,
      ...assetdetail, ...stock,
      ...manualstockentry].filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.name === value.name &&
              t.vendor === value.vendor
          )
      )

    // return labels;
    const formattedLabels = uniqueLabels.map(
      item => `${item.name},${item.vendor}`
    );

    console.log(formattedLabels, "uniqueLabels");
    return formattedLabels.join(", ");

  };




  const getLinkedLabel = (overalldeletecheck) => {
    const {
      expense = [],
      assetdetail = [],
      schedule = [],
      stock = [],
      manualstockentry = []
    } = overalldeletecheck;
    const labels = [];

    if (expense.length > 0) labels.push("Expense");
    if (assetdetail.length > 0) labels.push("Asset Details List");
    if (schedule.length > 0) labels.push("Schedule Payment Master");
    if (stock.length > 0) labels.push("Stock Purchase");
    if (manualstockentry.length > 0) labels.push("Manual Stock Entry");
    // console.log(labels, "labels")
    return labels.join(", ");
  };

  const getFilteredUnits1 = (subsusbcomponents, selectedRows, overalldeletecheck) => {
    const {
      expense = [],
      assetdetail = [],
      schedule = [],
      stock = [],
      manualstockentry = []
    } = overalldeletecheck;
    const allConditions = [...new Set([
      ...expense,
      ...assetdetail,
      ...schedule,
      ...stock, ...manualstockentry
    ])];

    return subsusbcomponents.filter(d => selectedRows?.includes(d._id) && !allConditions.includes(d.name));
  };

  const getFilteredUnits = (subsusbcomponents, selectedRows, overalldeletecheck) => {
    const {
      expense = [],
      schedule = [],
      assetdetail = [],

      stock = [],
      manualstockentry = []

    } = overalldeletecheck;

    const allConditions = [
      ...expense, ...schedule,
      ...assetdetail, ...stock,
      ...manualstockentry].filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.name === value.name &&
              t.vendor === value.vendor
          )
      )

    return subsusbcomponents.filter(d => selectedRows?.includes(d._id) && !allConditions.some(condition =>
      condition.name === d.name && condition.vendor === d.vendor

    ))

  };

  const shouldShowDeleteMessage = (subsusbcomponents, selectedRows, overalldeletecheck) => {
    return getFilteredUnits(subsusbcomponents, selectedRows, overalldeletecheck).length > 0;
  };

  const shouldEnableOkButton = (subsusbcomponents, selectedRows, overalldeletecheck) => {
    return getFilteredUnits(subsusbcomponents, selectedRows, overalldeletecheck).length === 0;
  };





  return (
    <Box>
      <Headtitle title={"Vendor Grouping"} />
      {/* ****** Header Content ****** */}
      {isUserRoleCompare?.includes("avendorgrouping") && (
        <>
          <PageHeading
            title="Vendor Grouping"
            modulename="Asset"
            submodulename="Master"
            mainpagename="Vendor Grouping"
            subpagename=""
            subsubpagename=""
          />
          <Box sx={userStyle.dialogbox}>
            <>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={userStyle.importheadtext}>
                    Add Vendor Grouping
                  </Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Name <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      placeholder="Please Enter Name"
                      value={name}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const capitalizedValue = inputValue
                          .toLowerCase() // Convert entire string to lowercase
                          .split(" ") // Split string by spaces
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          ) // Capitalize first letter of each word
                          .join(" "); // Join words back together with spaces
                        setName(capitalizedValue);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Vendors <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={vendorOpt}
                      value={selectedOptionsCate}
                      onChange={(e) => {
                        handleCategoryChange(e);
                      }}
                      valueRenderer={customValueRendererCate}
                      labelledBy="Please Select Vendor"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={1} xs={12} sm={6} marginTop={3}>
                  <LoadingButton
                    onClick={handleSubmit}
                    loading={loadingdeloverall}
                    sx={buttonStyles.buttonsubmit}
                    loadingPosition="end"
                    variant="contained"
                  >
                    Submit
                  </LoadingButton>
                </Grid>
                <Grid item md={1} xs={12} sm={6} marginTop={3}>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </>
          </Box>
        </>
      )}
      <Box>
        {/* Edit DIALOG */}
        <Dialog
          open={isEditOpen}
          onClose={handleCloseModEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth={true}
          maxWidth="md"
          sx={{
            overflow: "visible",
            "& .MuiPaper-root": {
              overflow: "visible",
            },
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <>
              <form onSubmit={editSubmit}>
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Vendor Grouping
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Name <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Please Enter Name"
                        value={nameEdit}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const capitalizedValue = inputValue
                            .toLowerCase() // Convert entire string to lowercase
                            .split(" ") // Split string by spaces
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            ) // Capitalize first letter of each word
                            .join(" "); // Join words back together with spaces
                          setNameEdit(capitalizedValue);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Vendors <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={vendorOpt}
                        value={{ label: vendorEdit, value: vendorEdit }}
                        onChange={(e) => {
                          setVendorEdit(e.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />

                <br />

                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button variant="contained" type="submit" sx={buttonStyles.buttonsubmit}>
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      sx={buttonStyles.btncancel}
                      onClick={handleCloseModEdit}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </>
          </Box>
        </Dialog>
      </Box>
      <br />
      {/* ****** Table Start ****** */}
      {isUserRoleCompare?.includes("lvendorgrouping") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Vendor Grouping List
              </Typography>
            </Grid>
            <br />
            <Grid container spacing={2} style={userStyle.dataTablestyle}>
              <Grid item md={2} xs={12} sm={12}>
                <Box>
                  <label>Show entries:</label>
                  <Select
                    id="pageSizeSelect"
                    value={pageSize}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 180,
                          width: 80,
                        },
                      },
                    }}
                    onChange={handlePageSizeChange}
                    sx={{ width: "77px" }}
                  >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={(subsusbcomponents?.length)}>All</MenuItem>
                  </Select>
                </Box>
              </Grid>
              <Grid
                item
                md={8}
                xs={12}
                sm={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box>
                  {isUserRoleCompare?.includes("excelvendorgrouping") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          setFormat("xl");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("csvvendorgrouping") && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          setFormat("csv");
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("printvendorgrouping") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfvendorgrouping") && (
                    <>
                      <Button
                        sx={userStyle.buttongrp}
                        onClick={() => {
                          setIsPdfFilterOpen(true);
                        }}
                      >
                        <FaFilePdf />
                        &ensp;Export to PDF&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("imagevendorgrouping") && (
                    <Button
                      sx={userStyle.buttongrp}
                      onClick={handleCaptureImage}
                    >
                      {" "}
                      <ImageIcon
                        sx={{ fontSize: "15px" }}
                      /> &ensp;Image&ensp;{" "}
                    </Button>
                  )}
                </Box>
              </Grid>
              <Grid item md={2} xs={6} sm={6}>
                <Box>
                  <AggregatedSearchBar
                    columnDataTable={columnDataTable}
                    setItems={setItems}
                    addSerialNumber={addSerialNumber}
                    setPage={setPage}
                    maindatas={subsusbcomponents}
                    setSearchedString={setSearchedString}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    paginated={false}
                    totalDatas={subsusbcomponents}
                  />
                </Box>
              </Grid>
            </Grid>
            <br />
            <Button sx={userStyle.buttongrp} onClick={handleShowAllColumns}>
              Show All Columns
            </Button>
            &ensp;
            <Button sx={userStyle.buttongrp} onClick={handleOpenManageColumns}>
              Manage Columns
            </Button>
            &ensp;
            {isUserRoleCompare?.includes("bdvendorgrouping") && (
              <Button
                variant="contained"
                color="error"
                sx={buttonStyles.buttonbulkdelete}
                onClick={handleClickOpenalert}
              >
                Bulk Delete
              </Button>
            )}
            <br />
            {!subsubcomponentCheck ? (
              <>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ThreeDots
                    height="80"
                    width="80"
                    radius="9"
                    color="#1976d2"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                </Box>
              </>
            ) : (
              <>
                <AggridTable
                  rowDataTable={rowDataTable}
                  columnDataTable={columnDataTable}
                  columnVisibility={columnVisibility}
                  page={page}
                  setPage={setPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  setColumnVisibility={setColumnVisibility}
                  isHandleChange={isHandleChange}
                  items={items}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  gridRefTable={gridRefTable}
                  paginated={false}
                  filteredDatas={filteredDatas}
                  pagenamecheck={"Vendor Grouping"}
                  selectedRowsVendorGrouping={selectedRowsVendorGrouping}
                  setSelectedRowsVendorGrouping={setSelectedRowsVendorGrouping}
                  // totalDatas={totalDatas}
                  searchQuery={searchedString}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={subsusbcomponents}
                />
              </>
            )}
          </Box>
        </>
      )}
      {/* Manage Column */}
      <Popover
        id={id}
        open={isManageColumnsOpen}
        anchorEl={anchorEl}
        onClose={handleCloseManageColumns}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {manageColumnsContent}
      </Popover>

      {/* view model */}
      <Dialog
        open={openview}
        onClose={handleClickOpenview}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
      >
        <Box sx={{ width: "750px", padding: "20px 50px" }}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {" "}
              View Vendor Grouping
            </Typography>
            <br /> <br />
            <Grid container spacing={2}>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6"> Name</Typography>
                  <Typography>{vendorGroupingIndidvidual?.name}</Typography>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography variant="h6">Vendor</Typography>
                  <Typography>{vendorGroupingIndidvidual?.vendor}</Typography>
                </FormControl>
              </Grid>
            </Grid>
            <br /> <br /> <br />
            <Grid container spacing={2}>
              <Button
                variant="contained"
                sx={buttonStyles.btncancel}
                onClick={handleCloseview}
              >
                {" "}
                Back{" "}
              </Button>
            </Grid>
          </>
        </Box>
      </Dialog>


      <Dialog open={isCheckOpen} onClose={handleCloseCheck} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ width: "350px", textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />

          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            {(() => {
              // Mapping of conditions and their corresponding labels
              const conditions = [
                { check: checkexpense?.length > 0, label: "Expense" },
                { check: checkassetdetail?.length > 0, label: "Asset Details List" },
                { check: checkSchedule?.length > 0, label: "Schedule Payment Master" },
                { check: checkstock?.length > 0, label: "Stock Purchase" },
                { check: checkmanualstock?.length > 0, label: "Manual Stock Entry" },
              ];

              // Filter out the true conditions
              const linkedItems = conditions.filter((item) => item.check);

              // Build the message dynamically
              if (linkedItems.length > 0) {
                const linkedLabels = linkedItems.map((item) => item.label).join(", ");
                return (
                  <>
                    <span style={{ fontWeight: "700", color: "#777" }}>{`${deleteSubsub.name + "," + deleteSubsub.vendor} `}</span>
                    was linked in <span style={{ fontWeight: "700" }}>{linkedLabels}</span>
                  </>
                );
              } else {
                // Default empty message if no conditions are true
                return "";
              }
            })()}
          </Typography>


        </DialogContent>
        <DialogActions>
          < Button onClick={handleCloseCheck} autoFocus variant="contained" color="error">
            {" "}
            OK{" "}
          </Button>
        </DialogActions>
      </Dialog>




      <Dialog open={isbulkCheckOpen} onClose={handlebulkCloseCheck} aria-labelledby="alert-dialog-title" maxWidth="sm" aria-describedby="alert-dialog-description">
        <DialogContent sx={{ textAlign: "center", alignItems: "center" }}>
          <ErrorOutlineOutlinedIcon sx={{ fontSize: "80px", color: "orange" }} />
          <Typography variant="h6" sx={{ color: "black", textAlign: "center" }}>
            {(
              overalldeletecheck.expense?.length > 0 ||
              overalldeletecheck.assetdetail?.length > 0 ||
              overalldeletecheck.schedule?.length > 0 ||
              overalldeletecheck.stock?.length > 0 ||
              overalldeletecheck.manualstockentry?.length > 0
            )
              && (
                <>
                  <span style={{ fontWeight: "700", color: "#777" }}>
                    {getLinkedLabelItem(overalldeletecheck)}
                  </span>{' '}
                  was linked in{' '}
                  <span style={{ fontWeight: "700", color: "#777" }}>
                    {getLinkedLabel(overalldeletecheck)}
                  </span>
                  {shouldShowDeleteMessage(subsusbcomponents, selectedRows, overalldeletecheck) && (
                    <Typography>Do you want to delete others?...</Typography>
                  )}
                </>
              )}
          </Typography>
        </DialogContent>
        <DialogActions>
          {shouldEnableOkButton(subsusbcomponents, selectedRows, overalldeletecheck) ? (
            <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error"> OK </Button>
          ) : null}
          {shouldShowDeleteMessage(subsusbcomponents, selectedRows, overalldeletecheck) && (
            <>
              <Button onClick={delaccountheadwithoutlink} variant="contained"> Yes </Button>
              <Button onClick={handlebulkCloseCheck} autoFocus variant="contained" color="error">Cancel</Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Box>
        <Dialog
          open={isErrorOpenpop}
          onClose={handleCloseerrpop}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ marginTop: "95px" }}
        >
          <DialogContent
            sx={{ width: "350px", textAlign: "center", alignItems: "center" }}
          >
            <Typography variant="h6">{showAlertpop}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{
                padding: "7px 13px",
                color: "white",
                background: "rgb(25, 118, 210)",
              }}
              onClick={() => {
                sendEditRequest();
                handleCloseerrpop();
              }}
            >
              ok
            </Button>
            <Button
              style={{
                backgroundColor: "#f4f4f4",
                color: "#444",
                boxShadow: "none",
                borderRadius: "3px",
                padding: "7px 13px",
                border: "1px solid #0000006b",
                "&:hover": {
                  "& .css-bluauu-MuiButtonBase-root-MuiButton-root": {
                    backgroundColor: "#f4f4f4",
                  },
                },
              }}
              onClick={handleCloseerrpop}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* EXTERNAL COMPONENTS -------------- START */}
      {/* VALIDATION */}
      <MessageAlert
        openPopup={openPopupMalert}
        handleClosePopup={handleClosePopupMalert}
        popupContent={popupContentMalert}
        popupSeverity={popupSeverityMalert}
      />
      {/* SUCCESS */}
      <AlertDialog
        openPopup={openPopup}
        handleClosePopup={handleClosePopup}
        popupContent={popupContent}
        popupSeverity={popupSeverity}
      />
      {/* PRINT PDF EXCEL CSV */}
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={subsusbcomponents ?? []}
        filename={"Vendor Grouping"}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />
      {/* INFO */}
      <InfoPopup
        openInfo={openInfo}
        handleCloseinfo={handleCloseinfo}
        heading="Vendor Grouping Info"
        addedby={addedby}
        updateby={updateby}
      />
      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={handleCloseMod}
        onConfirm={delSubsub}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delSubsubcheckbox}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/* PLEASE SELECT ANY ROW */}
      <PleaseSelectRow
        open={isDeleteOpenalert}
        onClose={handleCloseModalert}
        message="Please Select any Row"
        iconColor="orange"
        buttonText="OK"
      />
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
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default VendorGrouping;