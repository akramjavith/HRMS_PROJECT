import { makeStyles } from "@material-ui/core";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Checkbox,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import "jspdf-autotable";
import React, { useContext, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Selects from "react-select";
import csvIcon from "../../components/Assets/CSV.png";
import excelIcon from "../../components/Assets/excel-icon.png";
import fileIcon from "../../components/Assets/file-icons.png";
import pdfIcon from "../../components/Assets/pdf-icon.png";
import wordIcon from "../../components/Assets/word-icon.png";
import { handleApiError } from "../../components/Errorhandling";
import Headtitle from "../../components/Headtitle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { colourStyles, userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
import Webcamimage from "./Webcameimageasset";
import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import Switch from '@mui/material/Switch';
import { alpha, styled } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
  inputs: {
    display: "none",
  },
  preview: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));


const NavbarSwitch = styled((props) => (
  <Switch
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
    onClick={props.onClick}
  />
))(({ theme, buttonStyles }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    backgroundColor: buttonStyles?.navbar?.backgroundColor,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
    backgroundColor: buttonStyles?.navbar?.backgroundColor,
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: buttonStyles?.navbar?.color,
    '&:hover': {
      backgroundColor: alpha(buttonStyles?.navbar?.backgroundColor, theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: buttonStyles?.navbar?.backgroundColor,
  },
}));

function AssetDetails() {
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

  const [showNavbar, setShowNavbar] = useState(true);

  // Handle navbar hide/show
  const toggleNavbar = () => {
    setShowNavbar((prev) => !prev);
  };

  const [loadingdeloverall, setloadingdeloverall] = useState(false);

  const [areas, setAreas] = useState([]);
  const [locations, setLocations] = useState([{ label: "ALL", value: "ALL" }]);

  const EbUsage = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  const [stockCodeCount, setStockCodeCount] = useState(0);
  const [workStationOpt, setWorkStationOpt] = useState([]);
  const [Specification, setSpecification] = useState([]);
  let name = "create";
  let allUploadedFiles = [];
  const [filteredWorkStation, setFilteredWorkStation] = useState([]);

  const handleChangephonenumber = (e) => {
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value;
    if (regex.test(inputValue) || inputValue === "") {
      setAssetdetail({ ...assetdetail, estimation: inputValue });
    }
  };

  const { auth } = useContext(AuthContext);
  const {
    isUserRoleCompare,
    isUserRoleAccess,
    workStationSystemName,
    isAssignBranch,
    allfloor,
    alllocationgrouping,
    allarea,
    allareagrouping,
    allBranch, buttonStyles,
    pageName, setPageName
  } = useContext(UserRoleAccessContext);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [vendor, setVendor] = useState("Please Select Vendor ");
  const [vendorGroup, setVendorGroup] = useState("Please Select Vendor Group");
  const [materialOpt, setMaterialopt] = useState([]);
  const [vendorOpt, setVendoropt] = useState([]);
  const [vendorOptInd, setVendoroptInd] = useState([]);
  const [vendorGroupOpt, setVendorGroupopt] = useState([]);
  const [vendorOverall, setVendorOverall] = useState([]);
  const [lastcodeVal, setLastCodeVal] = useState(0);
  const [isimgviewbill, setImgviewbill] = useState(false);
  const handleImgcodeviewbill = () => {
    setImgviewbill(true);
  };
  const handlecloseImgcodeviewbill = () => {
    setImgviewbill(false);
  };
  //TODOS
  const [todos, setTodos] = useState([]);
  const classes = useStyles();
  //filter fields
  const [newcheckbranch, setNewcheckBranch] = useState("Please Select Branch");
  const [floors, setFloors] = useState([]);
  //   post call setstate
  const [assetdetail, setAssetdetail] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    unit: "Please Select Unit",
    floor: "Please Select Floor",
    area: "Please Select Area",
    location: "Please Select Location",
    workstation: "Please Select Workstation",
    workcheck: false,
    department: "Please Select Department",
    responsibleteam: "Please Select Responsible Person",
    team: "Please Select Responsible Team",
    assettype: "",
    asset: "",
    material: "Please Select Material",
    component: "Please Select Component",
    branchcode: "",
    companycode: "",
    code: "",
    countquantity: 1,
    materialcountcode: 0,
    serial: "",
    rate: "",
    warranty: "Yes",
    warrantycalculation: "",
    estimation: "",
    estimationtime: "Days",
    purchasedate: "",
    address: "",
    phonenumber: "",
    vendor: "Please Select Vendor ",
    customercare: "",
    stockcode: "",
    overallrate: true,
    ebusage: "Please Select EB Usage",
  });

  const [specificationGrouping, setSpecificationGrouping] = useState([]);

  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const fetchSpecificationGrouping = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.ALL_ASSETSPECIFICATIONGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let getvalues = res?.data?.assetspecificationgrouping.filter(
        (item) =>
          item.assetmaterial === assetdetail.material &&
          assetdetail.component === item.component
      );
      setSpecificationGrouping(getvalues);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    fetchWorkStation();
    fetchMaterialAll();
    fetchVendor();
  }, []);
  useEffect(() => {
    fetchSpecificationGrouping();
  }, [assetdetail.component]);

  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleClickOpenalert = () => {
    setIsDeleteOpenalert(true);
  };

  const handleAddInput = async (e) => {
    setAssetdetail({ ...assetdetail, component: e });
    let res = await axios.get(SERVICE.ASSETDETAIL, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });

    let subs = res.data.assetdetails
      .filter((d) => d.component === e)
      .flatMap((item) => item.subcomponent);

    let specificationItem = Specification.find(
      (item) => e === item.categoryname
    );

    let filtersub = specificationItem?.subcategoryname;
    let result;

    if (filtersub.length > 0) {
      result = filtersub?.map((sub, index) => {
        let strings = assetdetail.code + "#" + autovalid;
        let refNOINC = 1;
        let addauto = Number(refNOINC) + index;
        refNOINC = ("00" + addauto)?.substr(-4);
        newvaltodo = strings + "$" + refNOINC;

        return {
          ...sub,
          subname: sub.subcomponent,
          sub: `${index + 1}.${sub.subcomponent}`,
          type: sub.type ? "Please Select Type" : "",
          model: sub.model ? "Please Select Model" : "",
          subcomponentcheck: false,
          size: sub.size ? "Please Select Size" : "",
          variant: sub.variant ? "Please Select variant" : "",
          brand: sub.brand ? "Please Select Brand" : "",
          serial: sub.serial ? "" : undefined,
          other: sub.other ? "" : undefined,
          capacity: sub.capacity ? "Please Select Capacity" : "",
          hdmiport: sub.hdmiport ? "" : undefined,
          vgaport: sub.vgaport ? "" : undefined,
          dpport: sub.dpport ? "" : undefined,
          usbport: sub.usbport ? "" : undefined,
          paneltypescreen: sub.paneltypescreen
            ? "Please Select Panel Type"
            : "",
          resolution: sub.resolution ? "Please Select Screen Resolution" : "",
          connectivity: sub.connectivity ? "Please Select Connectivity" : "",
          daterate: sub.daterate ? "Please Select Data Rate" : "",
          compatibledevice: sub.compatibledevice
            ? "Please Select Compatible Device"
            : "",
          outputpower: sub.outputpower ? "Please Select Output Power" : "",
          collingfancount: sub.collingfancount
            ? "Please Select Cooling Fan Count"
            : "",
          clockspeed: sub.clockspeed ? "Please Select Clock Speed" : "",
          core: sub.core ? "Please Select Core" : "",
          speed: sub.speed ? "Please Select Speed" : "",
          frequency: sub.frequency ? "Please Select Frequency" : "",
          output: sub.output ? "Please Select Output" : "",
          ethernetports: sub.ethernetports
            ? "Please Select Ethernet Ports"
            : "",
          distance: sub.distance ? "Please Select Distance" : "",
          lengthname: sub.lengthname ? "Please Select Length" : "",
          slot: sub.slot ? "Please Select Slot" : "",
          noofchannels: sub.noofchannels ? "Please Select No. Of Channels" : "",
          colours: sub.colours ? "Please Select Colour" : "",
          warranty: assetdetail.warranty ? assetdetail.warranty : undefined,
          code: newvaltodo ? newvaltodo : undefined,
          countquantity: assetdetail.countquantity
            ? assetdetail.countquantity
            : undefined,
          rate: assetdetail.rate ? assetdetail.rate : undefined,
          estimation: assetdetail.estimation
            ? assetdetail.estimation
            : undefined,
          estimationtime: assetdetail.estimationtime
            ? assetdetail.estimationtime
            : undefined,
          warrantycalculation: assetdetail.warrantycalculation
            ? assetdetail.warrantycalculation
            : undefined,
          purchasedate: selectedPurchaseDate ? selectedPurchaseDate : undefined,
          vendorgroup: vendorGroup ? vendorGroup : undefined,
          vendor: vendor ? vendor : undefined,
          phonenumber: vendorgetid.phonenumber
            ? vendorgetid.phonenumber
            : undefined,
          address: vendorgetid.address ? vendorgetid.address : undefined,
        };
      });
    } else if (
      filtersub.length === 0 &&
      !(
        !specificationItem.type &&
        !specificationItem.model &&
        !specificationItem.size &&
        !specificationItem.variant &&
        !specificationItem.brand &&
        !specificationItem.serial &&
        !specificationItem.other &&
        !specificationItem.capacity &&
        !specificationItem.hdmiport &&
        !specificationItem.vgaport &&
        !specificationItem.dpport &&
        !specificationItem.usbport
      )
    ) {
      result = [
        {
          type: specificationItem.type ? "Please Select Type" : "",
          model: specificationItem.model ? "Please Select Model" : "",
          size: specificationItem.size ? "Please Select Size" : "",
          variant: specificationItem.variant ? "Please Select variant" : "",
          subcomponentcheck: false,
          brand: specificationItem.brand ? "Please Select Brand" : "",
          serial: specificationItem.serial ? "" : undefined,
          other: specificationItem.other ? "" : undefined,
          capacity: specificationItem.capacity ? "Please Select Capacity" : "",
          hdmiport: specificationItem.hdmiport ? "" : undefined,
          vgaport: specificationItem.vgaport ? "" : undefined,
          dpport: specificationItem.dpport ? "" : undefined,
          usbport: specificationItem.usbport ? "" : undefined,
          paneltypescreen: specificationItem.paneltypescreen
            ? "Please Select Panel Type"
            : "",
          resolution: specificationItem.resolution
            ? "Please Select Screen Resolution"
            : "",
          connectivity: specificationItem.connectivity
            ? "Please Select Connectivity"
            : "",
          daterate: specificationItem.daterate ? "Please Select Data Rate" : "",
          compatibledevice: specificationItem.compatibledevice
            ? "Please Select Compatible Device"
            : "",
          outputpower: specificationItem.outputpower
            ? "Please Select Output Power"
            : "",
          collingfancount: specificationItem.collingfancount
            ? "Please Select Cooling Fan Count"
            : "",
          clockspeed: specificationItem.clockspeed
            ? "Please Select Clock Speed"
            : "",
          core: specificationItem.core ? "Please Select Core" : "",
          speed: specificationItem.speed ? "Please Select Speed" : "",
          frequency: specificationItem.frequency
            ? "Please Select Frequency"
            : "",
          output: specificationItem.output ? "Please Select Output" : "",
          ethernetports: specificationItem.ethernetports
            ? "Please Select Ethernet Ports"
            : "",
          distance: specificationItem.distance ? "Please Select Distance" : "",
          lengthname: specificationItem.lengthname
            ? "Please Select Length"
            : "",
          slot: specificationItem.slot ? "Please Select Slot" : "",
          noofchannels: specificationItem.noofchannels
            ? "Please Select No. Of Channels"
            : "",
          colours: specificationItem.colours ? "Please Select Colour" : "",
          code:
            assetdetail.material === e
              ? assetdetail.code + "#" + autovalid + newval
              : newvaltodo,
          countquantity: assetdetail.countquantity
            ? assetdetail.countquantity
            : undefined,
          rate: assetdetail.rate ? assetdetail.rate : undefined,
          warranty: assetdetail.warranty ? assetdetail.warranty : undefined,
          estimation: assetdetail.estimation
            ? assetdetail.estimation
            : undefined,
          estimationtime: assetdetail.estimationtime
            ? assetdetail.estimationtime
            : undefined,
          warrantycalculation: assetdetail.warrantycalculation
            ? assetdetail.warrantycalculation
            : undefined,
          purchasedate: selectedPurchaseDate ? selectedPurchaseDate : undefined,
          vendorgroup: vendorGroup ? vendorGroup : undefined,
          vendor: vendor ? vendor : undefined,
          phonenumber: vendorgetid.phonenumber
            ? vendorgetid.phonenumber
            : undefined,
          address: vendorgetid.address ? vendorgetid.address : undefined,
        },
      ];
    }
    setTodos(result);
    setVendoroptInd(new Array(result.length).fill(vendorOpt));
  };
  const calculateTotalRate = () => {
    let sum = 0;
    todos.forEach((item) => {
      sum += parseInt(item.rate);
    });
    return String(sum);
  };

  const handleChange = async (index, name, value, id) => {
    const updatedTodos = [...todos];
    updatedTodos[index] = {
      ...updatedTodos[index],
      [name]: value,
    };
    if (name === "rate" && assetdetail.overallrate == false) {
      let sum = 0;
      updatedTodos.forEach((item) => {
        sum += parseInt(item.rate);
      });
      setAssetdetail({ ...assetdetail, rate: String(sum) });
    }
    setTodos(updatedTodos);
    const updatedTodo = updatedTodos[index];
    if (
      updatedTodo.estimationtime !== "" &&
      updatedTodo.purchasedate &&
      updatedTodo.estimation !== ""
    ) {
      const currentDate = new Date(updatedTodo.purchasedate);
      let expiryDate = new Date(currentDate);
      if (updatedTodo.estimationtime === "Days") {
        expiryDate.setDate(
          currentDate.getDate() + parseInt(updatedTodo.estimation)
        );
      } else if (updatedTodo.estimationtime === "Month") {
        expiryDate.setMonth(
          currentDate.getMonth() + parseInt(updatedTodo.estimation)
        );
      } else if (updatedTodo.estimationtime === "Year") {
        expiryDate.setFullYear(
          currentDate.getFullYear() + parseInt(updatedTodo.estimation)
        );
      }
      const formattedExpiryDate = formatDateString(expiryDate);
      let formattedempty = formattedExpiryDate.includes("NaN-NaN-NaN")
        ? ""
        : formattedExpiryDate;
      // Update the calculated expiry date in the todo
      const updatedTodosCopy = [...updatedTodos];
      updatedTodosCopy[index] = {
        ...updatedTodosCopy[index],
        warrantycalculation: formattedempty,
        vendorid: vendornameid,
      };
      setTodos(updatedTodosCopy);
    }
    const updatedTodovendor = updatedTodos[index];
    if (updatedTodovendor.vendor !== "" && id) {
      const res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const updatedTodosCopy = [...updatedTodos];
      updatedTodosCopy[index] = {
        ...updatedTodosCopy[index],
        address: res?.data?.svendordetails.address,
        phonenumber: res?.data?.svendordetails.phonenumber,
      };
      setTodos(updatedTodosCopy);
    }
  };
  const handleDelete = (index) => {
    const updatedTodos = [...todos];
    updatedTodos.splice(index, 1);
    setTodos(updatedTodos);
    if (assetdetail.overallrate == false) {
      let sum = 0;
      updatedTodos.forEach((item) => {
        sum += parseInt(item.rate);
      });
      setAssetdetail({ ...assetdetail, rate: String(sum) });
    }
  };

  const [getimgbillcode, setGetImgbillcode] = useState([]);

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  //cancel for create section
  const handleClear = async () => {
    try {
      let res = await axios.get(SERVICE.ASSETS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const resultall = res?.data?.assetmaterial.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
        assettype: d.assettype,
        asset: d.assethead,
      }));

      const assetmaterialuniqueArray = resultall.filter((item, index, self) => {
        return (
          self.findIndex(
            (i) => i.label === item.label && i.value === item.value
          ) === index
        );
      });

      setMaterialopt(assetmaterialuniqueArray);
      setFloors([]);
      setPreviewURL(null);
      setVendorGroup("Please Select Vendor Group");
      setVendoropt([]);
      setSpecification([])
      setAreas([])
      setLocations([{ label: "ALL", value: "ALL" }]);
      setTodos([]);
      setAssetdetail({
        company: "Please Select Company",
        branch: "Please Select Branch",
        unit: "Please Select Unit",
        floor: "Please Select Floor",
        area: "Please Select Area",
        location: "Please Select Location",
        department: "Please Select Department",
        responsibleteam: "Please Select Responsible Person",
        team: "Please Select Responsible Team",
        assettype: "",
        asset: "",
        material: "Please Select Material",
        component: "Please Select Component",
        branchcode: "",
        companycode: "",
        code: "",
        countquantity: 1,
        materialcountcode: 0,
        brand: "Please Select Brand",
        serial: "",
        rate: "",
        overallrate: true,
        warranty: "Yes",
        warrantycalculation: "",
        estimation: "",
        estimationtime: "Days",
        purchasedate: "",
        address: "",
        phonenumber: "",
        vendor: "Please Select Vendor ",
        customercare: "",
        stockcode: stockCodeCount,
        workstation: "",
        workcheck: false,
        ebusage: "Please Select EB Usage",
      });
      setSelectedPurchaseDate("");
      setVendor("Please Select Vendor ");
      setVendorgetid({ address: "", phonenumber: "" });
      setPopupContent("Cleared Successfully");
      setPopupSeverity("success");
      setRefImage([])
      setCapturedImages([])
      setRefImageDrag([])
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchWorkStation = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.WORKSTATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const result = res?.data?.locationgroupings.flatMap((item) => {
        return item.combinstation.flatMap((combinstationItem) => {
          return combinstationItem.subTodos.length > 0
            ? combinstationItem.subTodos.map(
              (subTodo) =>
                subTodo.subcabinname +
                "(" +
                item.branch +
                "-" +
                item.floor +
                ")"
            )
            : [
              combinstationItem.cabinname +
              "(" +
              item.branch +
              "-" +
              item.floor +
              ")",
            ];
        });
      });
      setWorkStationOpt(res?.data?.locationgroupings);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  useEffect(() => {
    var filteredWorks;
    // if (
    //   (assetdetail.unit === "" || assetdetail.unit == undefined) &&
    //   (assetdetail.floor === "" || assetdetail.floor == undefined)
    // ) {
    //   filteredWorks = workStationOpt?.filter(
    //     (u) =>
    //       u.company === assetdetail.company && u.branch === assetdetail.branch
    //   );
    // } else if (assetdetail.unit === "" || assetdetail.unit == undefined) {
    //   filteredWorks = workStationOpt?.filter(
    //     (u) =>
    //       u.company === assetdetail.company &&
    //       u.branch === assetdetail.branch &&
    //       u.floor === assetdetail.floor
    //   );
    // } else if (assetdetail.floor === "" || assetdetail.floor == undefined) {
    //   filteredWorks = workStationOpt?.filter(
    //     (u) =>
    //       u.company === assetdetail.company &&
    //       u.branch === assetdetail.branch &&
    //       u.unit === assetdetail.unit
    //   );
    // } else {

    filteredWorks = workStationOpt?.filter(
      (u) =>
        u.company === assetdetail.company &&
        u.branch === assetdetail.branch &&
        u.unit === assetdetail.unit &&
        u.floor === assetdetail.floor
    );
    // }
    // const result = filteredWorks?.flatMap((item) => {
    //   return item.combinstation.flatMap((combinstationItem) => {
    //     return combinstationItem.subTodos.length > 0
    //       ? combinstationItem.subTodos.map(
    //         (subTodo) =>
    //           subTodo.subcabinname +
    //           "(" +
    //           item.branch +
    //           "-" +
    //           item.floor +
    //           ")"
    //       )
    //       : [
    //         combinstationItem.cabinname +
    //         "(" +
    //         item.branch +
    //         "-" +
    //         item.floor +
    //         ")",
    //       ];
    //   });
    // });

    const result = filteredWorks?.flatMap((item) => {
      return item.combinstation.flatMap((combinstationItem) => {
        return combinstationItem.subTodos.length > 0
          ? combinstationItem.subTodos.map(
            (subTodo) => {
              let workStat = subTodo.subcabinname +
                "(" +
                item.branch +
                "-" +
                item.floor +
                ")"

              return {
                ...item,
                finalworkstation: workStat,
                finalindividualcabinname: subTodo.subcabinname
              }
            }

          )
          : [
            {
              ...item,
              finalworkstation: combinstationItem.cabinname +
                "(" +
                item.branch +
                "-" +
                item.floor +
                ")",
              finalindividualcabinname: combinstationItem.cabinname
            }


          ];
      });
    });
    const updatedResult = result.map(mainObj => {
      const match = workStationSystemName?.find(secObj =>
        secObj.company === mainObj.company &&
        secObj.branch === mainObj.branch &&
        secObj.unit === mainObj.unit &&
        secObj.floor === mainObj.floor &&
        secObj.cabinname === mainObj.finalindividualcabinname
      );

      if (match) {
        return { ...mainObj, systemshortname: match.systemshortname }; // Add systemshortname to matched object
      }

      return mainObj; // Return original object if no match is found
    });
    setFilteredWorkStation(
      updatedResult.flat()?.map((d) => ({
        ...d,
        // label: d,
        // value: d,
        label: d?.systemshortname
          ? `${d?.finalworkstation}(${d?.systemshortname})`
          : d?.finalworkstation, value: d?.finalworkstation,
      }))
    );
  }, [
    assetdetail.company,
    assetdetail.branch,
    assetdetail.unit,
    assetdetail.floor,
  ]);

  const fetchFloor = async (e) => {
    let result = allfloor.filter(
      (d) => d.branch === e.value || d.branch === e.branch
    );
    const floorall = result.map((d) => ({
      ...d,
      label: d.name,
      value: d.name,
    }));
    setFloors(floorall);
  };
  const fetchArea = async (e) => {
    let result = allareagrouping
      .filter((d) => d.branch === newcheckbranch && d.floor === e)
      .map((data) => data.area);
    let ji = [].concat(...result);
    const all = ji.map((d) => ({
      ...d,
      label: d,
      value: d,
    }));
    setAreas(all);
  };
  const fetchLocation = async (e) => {
    let result = alllocationgrouping
      .filter(
        (d) =>
          d.branch === assetdetail.branch &&
          d.floor === assetdetail.floor &&
          d.area === e
      )
      .map((data) => data.location);
    let ji = [].concat(...result);
    const all = [
      { label: "ALL", value: "ALL" },
      ...ji.map((d) => ({
        ...d,
        label: d,
        value: d,
      })),
    ];
    setLocations(all);
  };

  const fetchMaterialAll = async () => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.ASSETS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const resultall = res?.data?.assetmaterial.map((d) => ({
        ...d,
        label: d.name,
        value: d.name,
        assettype: d.assettype,
        asset: d.assethead,
      }));

      const assetmaterialuniqueArray = resultall.filter((item, index, self) => {
        return (
          self.findIndex(
            (i) => i.label === item.label && i.value === item.value
          ) === index
        );
      });
      setMaterialopt(assetmaterialuniqueArray);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const fetchspecification = async (e) => {
    setPageName(!pageName)
    try {
      let res = await axios.get(SERVICE.ASSETWORKSTAION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res.data.assetworkstation.filter(
        (d) => d.workstation === e.value
      );

      const resultall = result.map((d) => ({
        ...d,
        label: d.categoryname,
        value: d.categoryname,
      }));

      setSpecification(resultall);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleChangeGroupName = async (e) => {
    let foundDatas = vendorOverall
      .filter((data) => {
        return data.name == e.value;
      })
      .map((item) => item.vendor);

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

    let final = all.filter((data) => {
      return foundDatas.includes(data.value);
    });

    setVendoropt(final);
  };

  const handleChangeGroupNameIndexBased = async (e, index) => {
    let foundDatas = vendorOverall
      .filter((data) => {
        return data.name == e.value;
      })
      .map((item) => item.vendor);

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

    let final = all.filter((data) => {
      return foundDatas.includes(data.value);
    });

    let spreaded = [...vendorOptInd];
    spreaded[index] = final;

    setVendoroptInd(spreaded);
  };

  //fetching Groupname for Dropdowns
  const fetchVendor = async () => {
    setPageName(!pageName)
    try {
      let res1 = await axios.get(SERVICE.ALL_VENDORGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const allGroup = Array.from(
        new Set(res1?.data?.vendorgrouping.map((d) => d.name))
      ).map((item) => {
        return {
          label: item,
          value: item,
        };
      });

      setVendorGroupopt(allGroup);
      setVendorOverall(res1?.data?.vendorgrouping);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [uniqueid, setUniqueid] = useState(0);
  const [individualasset, setIndividualAsset] = useState([]);
  const [maintentance, setMaintentance] = useState([]);

  //get all project.
  const fetchMaintentance = async () => {
    setPageName(!pageName)
    try {
      let res_project = await axios.get(SERVICE.ASSETWORKSTATIONGROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let single = res_project?.data?.assetworkstationgrouping;

      const uniqueObjects = [];
      const uniqueKeysMap = new Map();

      single.forEach((obj) => {
        const key = `${obj.company}-${obj.branch}-${obj.unit}-${obj.team}-${obj.area}-${obj.location}`;

        if (!uniqueKeysMap.has(key)) {
          obj.id = [obj._id];
          uniqueKeysMap.set(key, obj);
        } else {
          const existingObj = uniqueKeysMap.get(key);
          existingObj.assetmaterial += `, ${obj.assetmaterial}`;
          existingObj.subcomponents = existingObj.subcomponents.concat(
            obj.subcomponents.join(",")
          );
          existingObj.component = existingObj.component.concat(
            obj.component.join(",")
          );
          existingObj.id = existingObj.id.concat(obj._id);
          uniqueKeysMap.set(key, existingObj);
        }
      });

      uniqueObjects.push(...uniqueKeysMap.values());
      setMaintentance(uniqueObjects);
      if (res_project?.data?.assetworkstationgrouping.length > 0) {
        setUniqueid(
          res_project?.data?.assetworkstationgrouping[
            res_project?.data?.assetworkstationgrouping.length - 1
          ].uniqueid
        );
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchMaintentanceIndividual = async () => {
    try {
      let res_project = await axios.get(SERVICE.ASSETWORKSTATIONGROUP, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setIndividualAsset(res_project?.data?.assetworkstationgrouping);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [assetdetails, setAssetdetails] = useState([]);

  const fetchAssetDetails = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ASSETDETAILFILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setAssetdetails(res_vendor?.data?.assetdetails);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  // Function to find an object where the 'name' property is missing and return it in array format
  function findObjectWithMissingName() {
    let sub =
      assetdetail.assetmaterial !== "" &&
      assetdetails.find((t) => t.material === assetdetail.assetmaterialcheck) &&
      assetdetails
        .find((t) => t.material === assetdetail.assetmaterialcheck)
        ?.subcomponent.map((item) => item.subname + "-" + item.code);
    const objectsWithMissingName = [];
    if (sub) {
      for (let obj of sub) {
        if (obj.hasOwnProperty("sub") && obj.hasOwnProperty("subname")) {
          objectsWithMissingName.push(obj);
        }
      }

      return objectsWithMissingName;
    }
  }

  // Example usage
  const objectsWithMissingName = findObjectWithMissingName();

  useEffect(() => {
    fetchMaintentanceIndividual();
    fetchMaintentance();
    fetchAssetDetails();
  }, []);

  //add function...
  const sendRequest = async (isNameMatch) => {
    setPageName(!pageName)
    let uniqueval = uniqueid ? uniqueid + 1 : 1;
    try {
      let res = await axios.post(SERVICE.ASSETDETAIL_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(assetdetail.company),
        branch: String(assetdetail.branch),
        unit: String(assetdetail.unit),
        floor: String(assetdetail.floor),
        location: String(assetdetail.location),
        area: String(assetdetail.area),
        ebusage: String(assetdetail.ebusage),
        workstation: String(
          assetdetail.workcheck === "Please Select Workstation" ? "" : assetdetail.workstation
        ),
        workcheck: String(assetdetail.workcheck),
        assettype: String(
          assetdetail.assettype == undefined ? "" : assetdetail.assettype
        ),
        asset: String(assetdetail.asset),
        material: String(
          assetdetail.material === "Please Select Material"
            ? ""
            : assetdetail.material
        ),
        component: String(
          assetdetail.component === "Please Select Component"
            ? ""
            : assetdetail.component
        ),
        subcomponent: todos ? [...todos] : [],
        code: String(assetdetail.code + "#" + autovalid + newval),
        countquantity: String(assetdetail.countquantity),
        materialcountcode: String(assetdetail.materialcountcode),
        serial: String(assetdetail.serial),
        rate: String(assetdetail.rate),
        overallrate: Boolean(assetdetail.overallrate),
        vendorid: String(vendornameid),
        address: String(vendorgetid.address),
        phonenumber: String(vendorgetid.phonenumber),
        warranty: String(assetdetail.warranty),
        estimation: String(assetdetail.estimation),
        estimationtime: String(assetdetail.estimationtime)
          ? assetdetail.estimationtime
          : "Days",
        warrantycalculation: String(assetdetail.warrantycalculation),
        purchasedate: selectedPurchaseDate,
        vendor: String(vendor),
        vendorgroup: String(vendorGroup),
        customercare: String(assetdetail.customercare),
        stockcode: String(assetdetail.stockcode),
        files: allUploadedFiles.concat(refImage, refImageDrag, capturedImages),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
        status: "In Working",
        assignedthrough: "ASSET",
      });

      if (assetdetail.workcheck == true && isNameMatch === false) {
        axios.post(`${SERVICE.ASSETWORKSTATIONGROUP_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(assetdetail.company),
          branch: String(assetdetail.branch),
          unit: String(assetdetail.unit),
          floor: String(assetdetail.floor),
          location: String(assetdetail.location),
          area: String(assetdetail.area),

          subcomponents: todos
            ? todos.map((item) => item.subname + "-" + item.code)
            : [],
          assetmaterial: String(assetdetail.material),
          component: [
            assetdetail.material === "Please Select Material"
              ? ""
              : assetdetail.material +
              "-" +
              String(assetdetail.code + "#" + autovalid + newval),
          ],
          assetmaterialcheck: String(
            assetdetail.material === "Please Select Material"
              ? ""
              : assetdetail.material
          ),
          workstation: String(
            assetdetail.workcheck ? assetdetail.workstation : ""
          ),
          uniqueid: uniqueval,
          addedby: [
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        });
      }
      setloadingdeloverall(false);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();

      setAssetdetail({
        ...assetdetail,
        branchcode: "",
        companycode: "",
        countquantity: 1,
        brand: "Please Select Brand",
        workstation: "Please Select Workstation",
        workcheck: false,
        serial: "",
        rate: "",
        warrantycalculation: "",
        estimation: "",
        estimationtime: "Days",
        component: "Please Select Component",
        customercare: "",
        stockcode: stockCodeCount,
      });
      setTodos([]);
      await fetchAssetAll(assetdetail.material);
      await fetchMaintentance();
      await fetchMaintentanceIndividual();
      await fetchAsset(
        assetdetail.material,
        assetdetail.code,
        assetdetail.assettype,
        assetdetail.asset,
        assetdetail.countquantity
      );
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const handleSubmit = async (e) => {
    setPageName(!pageName)
    setloadingdeloverall(true);
    const isNameMatch = maintentance.some(
      (item) =>
        item.company === assetdetail.company &&
        item.branch === assetdetail.branch &&
        item.unit === assetdetail.unit &&
        item.floor === assetdetail.floor &&
        item.area === assetdetail.area &&
        item.location === assetdetail.location &&
        item.assetmaterialcheck === assetdetail.material &&
        item.workstation === assetdetail.workstation &&
        (objectsWithMissingName?.length > 0
          ? item.subcomponents.some((item) =>
            todos.map((item) => item.value).includes(item)
          )
          : true)
    );

    let res_project = await axios.post(SERVICE.STOCKPURCHASELIMITED_ASSET_DETAILS, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      assetmat: "Asset Material",
    });
    let single = res_project?.data?.stock;

    let res = await axios.get(SERVICE.ASSETDETAIL_STOCK_LIMITED, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
    });

    let assettotal = res?.data?.assetdetails;

    let getassettotal = assettotal.reduce((acc, current) => {
      const existingItemIndex = acc.findIndex(
        (item) =>
          item.company === current.company &&
          item.branch === current.branch &&
          item.unit === current.unit &&
          item.floor === current.floor &&
          item.area === current.area &&
          item.location === current.location &&
          item.material === current.material
      );

      if (existingItemIndex !== -1) {
        // Update existing item
        const existingItem = acc[existingItemIndex];

        existingItem.countquantity += Number(current.countquantity);
        existingItem._id = current._id;
      } else {
        // Add new item
        acc.push({
          company: current.company,
          _id: current._id,
          branch: current.branch,
          unit: current.unit,
          floor: current.floor,
          area: current.area,
          location: current.location,
          material: current.material,
          countquantity: Number(current.countquantity),
        });
      }
      return acc;
    }, []);
    let getfilter = single.reduce((acc, current) => {
      const existingItemIndex = acc.findIndex(
        (item) =>
          item.company === current.company &&
          item.branch === current.branch &&
          item.unit === current.unit &&
          item.floor === current.floor &&
          item.area === current.area &&
          item.location === current.location &&
          item.productname === current.productname
      );

      if (existingItemIndex !== -1) {
        // Update existing item
        const existingItem = acc[existingItemIndex];

        existingItem.purchasecount += Number(current.quantity);
        existingItem._id = current._id;
        existingItem.requestmode = current.requestmode;
      } else {
        // Add new item
        acc.push({
          company: current.company,
          _id: current._id,
          branch: current.branch,
          unit: current.unit,
          floor: current.floor,
          area: current.area,
          location: current.location,
          productname: current.productname,
          requestmode: current.requestmode,
          purchasecount: current.quantity,
        });
      }
      return acc;
    }, []);

    let merge = getfilter.map((item) => {
      let matchItems = getassettotal.find(
        (d) =>
          item.company === d.company &&
          item.branch === d.branch &&
          item.unit === d.unit &&
          item.floor === d.floor &&
          item.area === d.area &&
          item.location === d.location &&
          item.productname === d.material
      );
      if (matchItems) {
        return {
          ...item,
          usedcount: Number(matchItems.countquantity),
          balancedcount:
            Number(item.purchasecount) - Number(matchItems.countquantity),
        };
      } else {
        return {
          ...item,
          usedcount: 0,
          balancedcount: Number(item.purchasecount) - 0,
        };
      }
    });
    let checkbalance = merge.find(
      (d) =>
        d.company === assetdetail.company &&
        d.branch === assetdetail.branch &&
        d.unit === assetdetail.unit &&
        d.floor === assetdetail.floor &&
        d.area === assetdetail.area &&
        d.location === assetdetail.location &&
        d.productname === assetdetail.material
    );
    e.preventDefault();

    if (assetdetail.company === "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assetdetail.branch === "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assetdetail.unit === "Please Select Unit") {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assetdetail.floor === "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assetdetail.area === "Please Select Area") {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assetdetail.location === "Please Select Location") {
      setPopupContentMalert("Please Select Location!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assetdetail.ebusage === "Please Select EB Usage") {
      setPopupContentMalert("Please Select EB Usage!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendorGroup === "" ||
      vendorGroup === "Please Select Vendor Group"
    ) {
      setPopupContentMalert("Please Select Vendor Group!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendor === "" || vendor === "Please Select Vendor ") {
      setPopupContentMalert("Please Select Vendor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assetdetail.warranty == "Yes" && assetdetail.estimation === "") {
      setPopupContentMalert("Please Enter Warranty Time");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      assetdetail.material === "" ||
      assetdetail.material === "Please Select Material"
    ) {
      setPopupContentMalert("Please Select Asset Material!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      assetdetail.component === "" ||
      assetdetail.component === "Please Select Component"
    ) {
      setPopupContentMalert("Please Select Component!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (assetdetail.countquantity.length === 0) {
      setPopupContentMalert("Please Enter Count(Qty)!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (checkbalance && checkbalance.balancedcount === 0) {
      setPopupContentMalert("Not Enough Material!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest(isNameMatch);
    }
  };

  //fetching Groupname for Dropdowns
  const fetchAsset = async (value, materialcode, assettype, assethead, qty) => {
    try {
      let res = await axios.post(SERVICE.ASSETDETAILCOUNTFILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        material: String(value),
      });
      // const codeToMatch = assetdetail?.code;
      const filteredData = res.data.assetdetails.filter(
        (item) => item.material === value
      );

      if (filteredData.length > 0) {
        const lastMatchedCode =
          filteredData[filteredData.length - 1]?.materialcountcode;

        const codeSplitMatch = lastMatchedCode?.split("#");
        let codeSplitMatchfirst = codeSplitMatch[1];
        const codeSplitMatchdouble = codeSplitMatchfirst?.split("-");

        setLastCodeVal(parseInt(codeSplitMatchdouble[1]));

        if (codeSplitMatchdouble) {
          const codeSplit = parseInt(codeSplitMatchdouble[1]);

          setAssetdetail({
            ...assetdetail,
            material: value,
            code: materialcode,
            assettype: assettype,
            asset: assethead,
            component: "Please Select Component",
            materialcountcode: `${materialcode}#${codeSplit + 1}-${qty === ""
              ? ""
              : parseInt(codeSplitMatchdouble[1]) + parseInt(qty)
              }`,
          });
        } else {
          setAssetdetail({
            ...assetdetail,
            material: value,
            code: materialcode,
            assettype: assettype,
            asset: assethead,

            component: "Please Select Component",
            materialcountcode: `${materialcode}#${1}-${qty === "" ? "" : parseInt(qty)
              }`,
          });
        }
      } else {
        setAssetdetail({
          ...assetdetail,
          material: value,
          code: materialcode,
          assettype: assettype,
          asset: assethead,

          component: "Please Select Component",
          materialcountcode: `${materialcode}#${1}-${qty === "" ? "" : parseInt(qty)
            }`,
        });
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [mCode, setMCode] = useState([]);
  const [mCodeTodo, setMCodeTodo] = useState([]);

  //fetching Groupname for Dropdowns
  const fetchAsset1 = async (qty) => {
    try {
      let res = await axios.post(SERVICE.ASSETDETAILCOUNTFILTER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        material: String(assetdetail.material),
      });
      // const codeToMatch = assetdetail?.code;
      const filteredData = res.data.assetdetails.filter(
        (item) => item.material === assetdetail.material
      );

      if (filteredData.length > 0) {
        const lastMatchedCode =
          filteredData[filteredData.length - 1]?.materialcountcode;

        const codeSplitMatch = lastMatchedCode.split("#");
        let codeSplitMatchfirst = codeSplitMatch[1];
        const codeSplitMatchdouble = codeSplitMatchfirst.split("-");

        setLastCodeVal(parseInt(codeSplitMatchdouble[1]));

        if (codeSplitMatchdouble) {
          const codeSplit = parseInt(codeSplitMatchdouble[1]);
          setAssetdetail((prev) => ({
            ...prev,
            materialcountcode: `${prev?.code}#${codeSplit + 1}-${qty === "" ? "" : codeSplit + parseInt(qty)
              }`,
          }));
        } else {
          setAssetdetail((prev) => ({
            ...prev,
            materialcountcode: `${prev?.code}#${1}-${qty === "" ? "" : parseInt(prev.countquantity)
              }`,
          }));
        }
      } else {
        setAssetdetail((prev) => ({
          ...prev,
          materialcountcode: `${prev?.code}#${1}-${qty === "" ? "" : parseInt(prev.countquantity)
            }`,
        }));
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  const [autovalid, setAutovalid] = useState(1);
  let newval = "$00";
  let newvaltodo = assetdetail.code + "#" + autovalid + "$001";

  const fetchAssetAll = async (e) => {
    try {
      let res = await axios.get(SERVICE.ASSETDETAIL_LIMITED, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let subval = res.data.assetdetailslimited.filter(
        (item) => item.material == e
      );

      let findid = subval[subval.length - 1]?.code;

      if (findid) {
        const hashIndex = findid.indexOf("#");
        const dollarIndex = findid.indexOf("$");

        // Extract the substring between '#' and '$'
        const extractedValue = findid.substring(hashIndex + 1, dollarIndex);

        setAutovalid(Number(extractedValue) + 1);
      } else {
        setAutovalid(1);
      }
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const fetchAssetAllTodo = async () => {
    try {
      let res = await axios.get(SERVICE.ASSETDETAIL, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let sub = res.data.assetdetails
        .filter((item) => item.component === assetdetail.component)
        .flatMap((item) => item.subcomponent);
      setMCodeTodo(sub);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  useEffect(() => {
    fetchAssetAllTodo();
  }, [assetdetail.component]);

  const handleCountChange = async (e) => {
    const eventValue = e.target.value;
    setAssetdetail({
      ...assetdetail,
      countquantity: eventValue,
    });

    fetchAsset1(eventValue);
  };

  const [vendorgetid, setVendorgetid] = useState({});
  const [vendornameid, setVendornameid] = useState("");
  const vendorid = async (id) => {
    try {
      let res = await axios.get(`${SERVICE.SINGLE_VENDORDETAILS}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendorgetid(res?.data?.svendordetails);
      setVendornameid(id);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  const [refImage, setRefImage] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [refImageDrag, setRefImageDrag] = useState([]);
  const [valNum, setValNum] = useState(0);
  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [getImg, setGetImg] = useState(null);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);

  const handleRemarkChangeUpload = (value, index) => {
    setRefImage((prev) =>
      prev.map((file, i) =>
        i === index ? { ...file, remarks: value } : file
      )
    );
  };
  const handleRemarkChangeWebCam = (value, index) => {
    setCapturedImages((prev) =>
      prev.map((file, i) =>
        i === index ? { ...file, remarks: value } : file
      )
    );
  };
  const handleRemarkChangeDragDrop = (value, index) => {
    setRefImageDrag((prev) =>
      prev.map((file, i) =>
        i === index ? { ...file, remarks: value } : file
      )
    );
  };

  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
    setGetImg("");
  };
  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    webcamClose();
    setGetImg("");
  };
  const showWebcam = () => {
    webcamOpen();
  };
  // Upload Popup
  const [uploadPopupOpen, setUploadPopupOpen] = useState(false);
  const handleClickUploadPopupOpen = () => {
    setUploadPopupOpen(true);
  };
  const handleUploadPopupClose = () => {
    setUploadPopupOpen(false);
    setGetImg("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };
  const getFileIcon = (fileName) => {
    const extension1 = fileName?.split(".").pop();
    switch (extension1) {
      case "pdf":
        return pdfIcon;
      case "doc":
      case "docx":
        return wordIcon;
      case "xls":
      case "xlsx":
        return excelIcon;
      case "csv":
        return csvIcon;
      default:
        return fileIcon;
    }
  };

  //reference images
  const handleInputChange = (event) => {
    const files = event.target.files;
    let newSelectedFiles = [...refImage];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file is an image
      // if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        newSelectedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          preview: reader.result,
          base64: reader.result.split(",")[1],
        });
        setRefImage(newSelectedFiles);
      };
      reader.readAsDataURL(file);
      // } else {
      //   setPopupContentMalert("Only Accept Images!");
      //   setPopupSeverityMalert("info");
      //   handleClickOpenPopupMalert();
      // }
    }
  };
  const handleDeleteFile = (index) => {
    const newSelectedFiles = [...refImage];
    newSelectedFiles.splice(index, 1);
    setRefImage(newSelectedFiles);
  };
  const renderFilePreview = async (file) => {
    const response = await fetch(file.preview);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    window.open(link, "_blank");
  };
  const removeCapturedImage = (index) => {
    const newCapturedImages = [...capturedImages];
    newCapturedImages.splice(index, 1);
    setCapturedImages(newCapturedImages);
  };
  const resetImage = () => {
    setGetImg("");
    setRefImage([]);
    setPreviewURL(null);
    setRefImageDrag([]);
    setCapturedImages([]);
  };
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  const handleDrop = (event) => {
    event.preventDefault();
    previewFile(event.dataTransfer.files[0]);
    const files = event.dataTransfer.files;
    let newSelectedFilesDrag = [...refImageDrag];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        newSelectedFilesDrag.push({
          name: file.name,
          size: file.size,
          type: file.type,
          preview: reader.result,
          base64: reader.result.split(",")[1],
        });
        setRefImageDrag(newSelectedFilesDrag);
      };
      reader.readAsDataURL(file);
      // } else {
      //   setPopupContentMalert("Only Accept Images!");
      //   setPopupSeverityMalert("info");
      //   handleClickOpenPopupMalert();
      // }
    }
  };
  const handleUploadOverAll = () => {
    setUploadPopupOpen(false);
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewURL(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveFile = (index) => {
    const newSelectedFiles = [...refImageDrag];
    newSelectedFiles.splice(index, 1);
    setRefImageDrag(newSelectedFiles);
  };




  const [selectedPurchaseDate, setSelectedPurchaseDate] = useState("");
  const handleEstimationChange = (e) => {
    const { value } = e.target;
    setAssetdetail({ ...assetdetail, estimationtime: value });
  };

  const handlePurchaseDateChange = (e) => {
    const { value } = e.target;
    setAssetdetail({ ...assetdetail, purchasedate: value });
    setSelectedPurchaseDate(value);
  };

  const formatDateString = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const calculateExpiryDate = () => {
    if (assetdetail.estimationtime !== "" && assetdetail.purchasedate) {
      const currentDate = new Date(assetdetail.purchasedate);
      let expiryDate = new Date(currentDate);
      if (assetdetail.estimationtime === "Days") {
        expiryDate.setDate(
          currentDate.getDate() + parseInt(assetdetail.estimation)
        );
      } else if (assetdetail.estimationtime === "Month") {
        expiryDate.setMonth(
          currentDate.getMonth() + parseInt(assetdetail.estimation)
        );
      } else if (assetdetail.estimationtime === "Year") {
        expiryDate.setFullYear(
          currentDate.getFullYear() + parseInt(assetdetail.estimation)
        );
      }
      const formattedExpiryDate = formatDateString(expiryDate);
      let formattedempty = formattedExpiryDate.includes("NaN-NaN-NaN")
        ? ""
        : formattedExpiryDate;
      setAssetdetail({
        ...assetdetail,
        warrantycalculation: formattedempty, // Format date as needed
      });
    }
  };
  useEffect(() => {
    calculateExpiryDate();
  }, [
    assetdetail.estimationtime,
    assetdetail.estimation,
    assetdetail.purchasedate,
  ]);

  //Access Module

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Asset Master"),
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


  return (
    <Box>
      <Headtitle title={"ASSET DETAILS"} />
      {/* <Typography sx={userStyle.HeaderText}> Add Asset Detail</Typography> */}
      <PageHeading
        title="Asset Detail"
        modulename="Asset"
        submodulename="Asset Details"
        mainpagename="Asset Master"
        subpagename=""
        subsubpagename=""
      />


      {isUserRoleCompare?.includes("lassetmaster") && (
        <Box sx={userStyle.dialogbox}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                <b>Add Asset Details </b>
              </Typography>
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={2}>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Company<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={isAssignBranch ? isAssignBranch
                    ?.map((data) => ({
                      label: data.company,
                      value: data.company,
                    }))
                    .filter((item, index, self) => {
                      return (
                        self.findIndex(
                          (i) =>
                            i.label === item.label && i.value === item.value
                        ) === index
                      );
                    }) : []}
                  styles={colourStyles}
                  value={{
                    label: assetdetail.company,
                    value: assetdetail.company,
                  }}


                  onChange={(e) => {
                    setAssetdetail({
                      ...assetdetail,
                      company: e.value,
                      branch: "Please Select Branch",
                      unit: "Please Select Unit",
                      floor: "Please Select Floor",
                      area: "Please Select Area",
                      location: "Please Select Location",
                      workstation: "Please Select Workstation",
                      workstationlabel: "Please Select Workstation",
                    });
                    setLocations([{ label: "ALL", value: "ALL" }]);
                    setFloors([])
                    setAreas([])
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  {" "}
                  Branch<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={isAssignBranch ? isAssignBranch
                    ?.filter((comp) => assetdetail.company === comp.company)
                    ?.map((data) => ({
                      label: data.branch,
                      value: data.branch,
                    }))
                    .filter((item, index, self) => {
                      return (
                        self.findIndex(
                          (i) =>
                            i.label === item.label && i.value === item.value
                        ) === index
                      );
                    }) : []}
                  styles={colourStyles}
                  value={{
                    label: assetdetail.branch,
                    value: assetdetail.branch,
                  }}
                  onChange={(e) => {
                    setNewcheckBranch(e.value);
                    setAssetdetail({
                      ...assetdetail,
                      branch: e.value,
                      unit: "Please Select Unit",
                      floor: "Please Select Floor",
                      area: "Please Select Area",
                      location: "Please Select Location",
                      workstation: "Please Select Workstation",
                      workstationlabel: "Please Select Workstation",
                    });
                    setLocations([{ label: "ALL", value: "ALL" }]);

                    fetchFloor(e);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  {" "}
                  Unit<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={isAssignBranch ? isAssignBranch
                    ?.filter(
                      (comp) =>
                        assetdetail.company === comp.company &&
                        assetdetail.branch === comp.branch
                    )
                    ?.map((data) => ({
                      label: data.unit,
                      value: data.unit,
                    }))
                    .filter((item, index, self) => {
                      return (
                        self.findIndex(
                          (i) =>
                            i.label === item.label && i.value === item.value
                        ) === index
                      );
                    }) : []}
                  styles={colourStyles}
                  value={{ label: assetdetail.unit, value: assetdetail.unit }}
                  onChange={(e) => {
                    setAssetdetail({
                      ...assetdetail,
                      unit: e.value,
                      workstation: "Please Select Workstation",
                      workstationlabel: "Please Select Workstation",
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Floor<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={floors}
                  styles={colourStyles}
                  value={{ label: assetdetail.floor, value: assetdetail.floor }}
                  onChange={(e) => {
                    setAssetdetail({
                      ...assetdetail,
                      floor: e.value,
                      workstation: "",
                      area: "Please Select Area",
                      workstation: "Please Select Workstation",
                      workstationlabel: "Please Select Workstation",
                    });
                    setLocations([{ label: "ALL", value: "ALL" }]);
                    fetchArea(e.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Area<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={areas}
                  styles={colourStyles}
                  value={{ label: assetdetail.area, value: assetdetail.area }}
                  onChange={(e) => {
                    setAssetdetail({
                      ...assetdetail,
                      area: e.value,
                      workstation: "",
                      location: "Please Select Location",
                      workstation: "Please Select Workstation",
                      workstationlabel: "Please Select Workstation",
                    });
                    setLocations([{ label: "ALL", value: "ALL" }]);
                    fetchLocation(e.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Location<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={locations}
                  styles={colourStyles}
                  value={{
                    label: assetdetail.location,
                    value: assetdetail.location,
                  }}
                  onChange={(e) => {
                    setAssetdetail({
                      ...assetdetail,
                      location: e.value,
                      workstation: "Please Select Workstation",
                      workstationlabel: "Please Select Workstation",
                    });
                  }}
                />
              </FormControl>
              <Grid>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={assetdetail.workcheck} />}
                    onChange={(e) =>
                      setAssetdetail({
                        ...assetdetail,
                        workcheck: !assetdetail.workcheck,
                      })
                    }
                    label="Enable Workstation"
                  />
                </FormGroup>
              </Grid>
            </Grid>

            {assetdetail.workcheck && (
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Work Station</Typography>
                  <Selects
                    maxMenuHeight={250}
                    styles={colourStyles}
                    options={filteredWorkStation}
                    placeholder="Please Select Workstation"
                    // value={{
                    //   label:
                    //     assetdetail.workstation === "" ||
                    //       assetdetail.workstation === undefined
                    //       ? "Please Select Workstation"
                    //       : assetdetail.workstation,
                    //   value:
                    //     assetdetail.workstation === "" ||
                    //       assetdetail.workstation === undefined
                    //       ? "Please Select Workstation"
                    //       : assetdetail.workstation,
                    // }}
                    value={{
                      label:
                        assetdetail.workstationlabel === "" ||
                          assetdetail.workstationlabel === undefined
                          ? "Please Select Workstation"
                          : assetdetail.workstationlabel,
                      value:
                        assetdetail.workstation === "" ||
                          assetdetail.workstation === undefined
                          ? "Please Select Workstation"
                          : assetdetail.workstation,
                    }}
                    onChange={(e) => {
                      setAssetdetail({ ...assetdetail, workstation: e.value, workstationlabel: e.label, });
                    }}
                  />
                </FormControl>
              </Grid>
            )}

            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  EB Usage<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={EbUsage}
                  styles={colourStyles}
                  value={{
                    label: assetdetail.ebusage,
                    value: assetdetail.ebusage,
                  }}
                  onChange={(e) => {
                    setAssetdetail({
                      ...assetdetail,
                      ebusage: e.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>

            {/* <Grid container spacing={2}> */}

            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Count(Qty)<b style={{ color: "red" }}>*</b>{" "}
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  sx={userStyle.input}
                  type="number"
                  value={assetdetail.countquantity}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  {" "}
                  Vendor Group Name<b style={{ color: "red" }}>*</b>{" "}
                </Typography>
                <Selects
                  options={vendorGroupOpt}
                  styles={colourStyles}
                  value={{ label: vendorGroup, value: vendorGroup }}
                  onChange={(e) => {
                    handleChangeGroupName(e);
                    setVendorGroup(e.value);
                    setVendor("Please Select Vendor ");
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  {" "}
                  Vendor<b style={{ color: "red" }}>*</b>{" "}
                </Typography>
                <Selects
                  options={vendorOpt}
                  styles={colourStyles}

                  value={{ label: vendor, value: vendor }}
                  onChange={(e) => {
                    setVendor(e.value);
                    vendorid(e._id);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Address</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={vendorgetid?.address}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Phone Number</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={vendorgetid?.phonenumber}
                  readOnly
                />
              </FormControl>
            </Grid>

            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Serial </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Please Enter Serial"
                  value={assetdetail.serial}
                  onChange={(e) => {
                    setAssetdetail({ ...assetdetail, serial: e.target.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Rate </Typography>
                {assetdetail.overallrate ? (
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Please Enter Rate"
                    sx={userStyle.input}
                    value={assetdetail.rate}
                    onChange={(e) => {
                      setAssetdetail({
                        ...assetdetail,
                        rate:
                          Number(e.target.value) >= 0
                            ? Number(e.target.value)
                            : 0,
                      });
                    }}
                  />
                ) : (
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    placeholder="Please Enter Rate"
                    sx={userStyle.input}
                    value={assetdetail.rate}
                    readOnly
                  />
                )}
              </FormControl>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={assetdetail.overallrate} />}
                  onChange={(e) => {
                    setAssetdetail((prevAssetDetail) => ({
                      ...prevAssetDetail,
                      overallrate: !prevAssetDetail.overallrate,
                      rate: prevAssetDetail.overallrate
                        ? calculateTotalRate()
                        : "",
                    }));
                  }}
                  label="Overall Rate"
                />
              </FormGroup>
            </Grid>

            {/* </Grid> */}
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  {" "}
                  Warranty <b style={{ color: "red" }}>*</b>
                </Typography>
                <Select
                  fullWidth
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={assetdetail.warranty}
                  onChange={(e) => {
                    setAssetdetail({
                      ...assetdetail,
                      warranty: e.target.value,
                    });
                  }}
                >
                  <MenuItem value="" disabled>
                    {" "}
                    Please Select
                  </MenuItem>
                  <MenuItem value="Yes"> {"Yes"} </MenuItem>
                  <MenuItem value="No"> {"No"} </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {assetdetail.warranty === "Yes" && (
              <>
                <Grid item md={3} xs={12} sm={12}>
                  <Grid container>
                    <Grid item md={6} xs={6} sm={6}>
                      <Typography>
                        Warranty Time <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <FormControl fullWidth size="small">
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Enter Time"
                          value={assetdetail.estimation}
                          onChange={(e) => handleChangephonenumber(e)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={6} xs={6} sm={6}>
                      <Typography>
                        {" "}
                        Estimation <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Select
                        fullWidth
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={assetdetail.estimationtime}
                        onChange={handleEstimationChange}
                      >
                        <MenuItem value="" disabled>
                          {" "}
                          Please Select{" "}
                        </MenuItem>
                        <MenuItem value="Days"> {"Days"} </MenuItem>
                        <MenuItem value="Month"> {"Month"} </MenuItem>
                        <MenuItem value="Year"> {"Year"} </MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Purchase date </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="date"
                  value={selectedPurchaseDate}
                  onChange={handlePurchaseDateChange}
                />
              </FormControl>
            </Grid>
            {assetdetail.warranty === "Yes" && (
              <>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>Expiry Date </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={assetdetail.warrantycalculation}
                    />
                  </FormControl>
                </Grid>
              </>
            )}


            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  {" "}
                  Material<b style={{ color: "red" }}>*</b>
                </Typography>
                <Selects
                  options={materialOpt}
                  styles={colourStyles}
                  value={{
                    label: assetdetail.material,
                    value: assetdetail.material,
                  }}
                  onChange={(e) => {
                    fetchAsset(
                      e.value,
                      e.materialcode,
                      e.assettype,
                      e.assethead,
                      assetdetail.countquantity
                    );
                    setTodos([]);
                    fetchspecification(e);
                    fetchAssetAll(e.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Asset Type<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={assetdetail.assettype}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Asset Head<b style={{ color: "red" }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={assetdetail.asset}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Material Countcode</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={assetdetail.materialcountcode}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                {mCode &&
                  mCode.map(() => {
                    let strings = "$";
                    let refNo = mCode[mCode?.length - 1].code;
                    let digits = (mCode?.length + 1).toString();
                    const stringLength = refNo?.length;
                    let lastChar = refNo?.charAt(stringLength - 1);
                    let getlastBeforeChar = refNo?.charAt(stringLength - 2);
                    let getlastThreeChar = refNo?.charAt(stringLength - 3);
                    let lastBeforeChar = refNo?.slice(-2);
                    let lastThreeChar = refNo?.slice(-3);
                    let lastDigit = refNo?.slice(-4);
                    let refNOINC = parseInt(lastChar) + 1;
                    let refLstTwo = parseInt(lastBeforeChar) + 1;
                    let refLstThree = parseInt(lastThreeChar) + 1;
                    let refLstDigit = parseInt(lastDigit) + 1;
                    if (
                      digits?.length < 4 &&
                      getlastBeforeChar == 0 &&
                      getlastThreeChar == 0
                    ) {
                      refNOINC = ("00" + refNOINC)?.substr(-4);
                      newval = strings + refNOINC;
                    } else if (
                      digits?.length < 4 &&
                      getlastBeforeChar > 0 &&
                      getlastThreeChar == 0
                    ) {
                      refNOINC = ("00" + refLstTwo)?.substr(-4);
                      newval = strings + refNOINC;
                    } else if (digits?.length < 4 && getlastThreeChar > 0) {
                      refNOINC = ("0" + refLstThree)?.substr(-4);
                      newval = strings + refNOINC;
                    }
                  })}
                <Typography>Material Code </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  value={assetdetail.code + "#" + autovalid + "$00"}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Component<b style={{ color: "red" }}>*</b>
                </Typography>

                <Selects
                  options={Specification}
                  styles={colourStyles}
                  value={{
                    label: assetdetail.component,
                    value: assetdetail.component,
                  }}
                  onChange={(e) => {
                    handleAddInput(e.value);
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>{" "}
          <br />
          {todos &&
            todos.map((todo, index) => {
              return (
                <>
                  {todo.sub ? (
                    <Grid container key={index} spacing={1}>
                      <Grid item md={2} sm={2} xs={2} marginTop={2}>
                        {" "}
                        <Typography>{todo.sub}</Typography>{" "}
                      </Grid>
                      <Grid item md={10} sm={10} xs={10} marginTop={2}>
                        <Grid container key={index} spacing={1}>
                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Grid container spacing={2}>
                                <Grid item md={10} sm={10} xs={10}>
                                  <FormGroup>

                                    <FormControlLabel

                                      control={
                                        <Switch
                                          // color="success"
                                          sx={{
                                            "& .MuiSwitch-switchBase.Mui-checked": {
                                              color: "green", // Thumb color when checked
                                            },
                                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                              backgroundColor: "green", // Track color when checked
                                            },
                                            "& .MuiSwitch-switchBase": {
                                              color: "#ff0000a3", // Thumb color when not checked
                                            },
                                            "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                                              backgroundColor: "#ff0000a3", // Track color when not checked
                                            },
                                          }}
                                          checked={todo.subcomponentcheck}
                                          onChange={(e) => {
                                            handleChange(
                                              index,
                                              "subcomponentcheck",
                                              e.target.checked
                                            );
                                          }}
                                        />
                                      }
                                      label="Enable Subcomponent"
                                    />
                                  </FormGroup>
                                </Grid>
                              </Grid>
                            </Grid>

                          </>
                          {todo.subcomponentcheck === true && (

                            <>
                              {todo.type && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Type</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.type?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.type,
                                              value: todo.type,
                                            }}
                                            onChange={(e) => {
                                              handleChange(index, "type", e.value);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.model && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Model</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.model?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.model,
                                              value: todo.model,
                                            }}
                                            onChange={(e) => {
                                              handleChange(index, "model", e.value);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.size && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Size</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.size?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.size,
                                              value: todo.size,
                                            }}
                                            onChange={(e) => {
                                              handleChange(index, "size", e.value);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.variant && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Variants</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.variant?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.variant,
                                              value: todo.variant,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "variant",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.brand && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl size="small" fullWidth>
                                          <Typography>Brand</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.brand?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.brand,
                                              value: todo.brand,
                                            }}
                                            onChange={(e) => {
                                              handleChange(index, "brand", e.value);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.serial !== undefined && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container>
                                      <Grid item md={11.6} sm={10} xs={10}>
                                        <Typography>Serial</Typography>
                                        <OutlinedInput
                                          fullWidth
                                          type="text"
                                          size="small"
                                          placeholder="Please Enter Serial"
                                          value={todo.serial}
                                          isDisabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            handleChange(
                                              index,
                                              "serial",
                                              e.target.value
                                            );
                                          }}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.other !== undefined && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container>
                                      <Grid item md={11.6} sm={10} xs={10}>
                                        <Typography>Others</Typography>
                                        <OutlinedInput
                                          fullWidth
                                          type="text"
                                          size="small"
                                          placeholder="Please Enter Other"
                                          value={todo.other}
                                          isDisabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            handleChange(
                                              index,
                                              "other",
                                              e.target.value
                                            );
                                          }}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.capacity && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Capacity</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.capacity?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            value={{
                                              label: todo.capacity,
                                              value: todo.capacity,
                                            }}
                                            isDisabled={todo.subcomponentcheck === false}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "capacity",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.hdmiport !== undefined && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container>
                                      <Grid item md={11.6} sm={10} xs={10}>
                                        <Typography>HDMI Port</Typography>

                                        <OutlinedInput
                                          fullWidth
                                          type="number"
                                          size="small"
                                          placeholder="Please Enter HDMI Port"
                                          value={todo.hdmiport}
                                          disabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            const inputText = e.target.value;
                                            const validatedInput =
                                              inputText.match(/^\d*$/);

                                            const sanitizedInput =
                                              validatedInput !== null
                                                ? validatedInput[0]
                                                : "0";
                                            handleChange(
                                              index,
                                              "hdmiport",
                                              sanitizedInput
                                            );
                                          }}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.vgaport !== undefined && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container>
                                      <Grid item md={11.6} sm={10} xs={10}>
                                        <Typography>VGA Port</Typography>

                                        <OutlinedInput
                                          fullWidth
                                          type="number"
                                          disabled={todo.subcomponentcheck === false}
                                          size="small"
                                          placeholder="Please Enter VGA Port"
                                          value={todo.vgaport}
                                          onChange={(e) => {
                                            const inputText = e.target.value;
                                            const validatedInput =
                                              inputText.match(/^\d*$/);

                                            const sanitizedInput =
                                              validatedInput !== null
                                                ? validatedInput[0]
                                                : "0";
                                            handleChange(
                                              index,
                                              "vgaport",
                                              sanitizedInput
                                            );
                                          }}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.dpport !== undefined && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container>
                                      <Grid item md={11.6} sm={10} xs={10}>
                                        <Typography>DP Port</Typography>

                                        <OutlinedInput
                                          fullWidth
                                          type="number"
                                          disabled={todo.subcomponentcheck === false}
                                          size="small"
                                          placeholder="Please Enter DP Port"
                                          value={todo.dpport}
                                          onChange={(e) => {
                                            const inputText = e.target.value;
                                            const validatedInput =
                                              inputText.match(/^\d*$/);

                                            const sanitizedInput =
                                              validatedInput !== null
                                                ? validatedInput[0]
                                                : "0";
                                            handleChange(
                                              index,
                                              "dpport",
                                              sanitizedInput
                                            );
                                          }}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.usbport !== undefined && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container>
                                      <Grid item md={11.6} sm={10} xs={10}>
                                        <Typography>USB Port</Typography>

                                        <OutlinedInput
                                          fullWidth
                                          type="number"
                                          size="small"
                                          placeholder="Please Enter USB Port"
                                          value={todo.usbport}
                                          disabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            const inputText = e.target.value;
                                            const validatedInput =
                                              inputText.match(/^\d*$/);

                                            const sanitizedInput =
                                              validatedInput !== null
                                                ? validatedInput[0]
                                                : "0";
                                            handleChange(
                                              index,
                                              "usbport",
                                              sanitizedInput
                                            );
                                          }}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.paneltypescreen && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Panel Type</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.paneltype?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.paneltypescreen,
                                              value: todo.paneltypescreen,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "paneltypescreen",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.resolution && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Screen Resolution</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.screenresolution?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.resolution,
                                              value: todo.resolution,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "resolution",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.connectivity && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Connectivity</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.connectivity?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.connectivity,
                                              value: todo.connectivity,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "connectivity",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.daterate && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Data Rate</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.datarate?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.daterate,
                                              value: todo.daterate,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "daterate",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.compatibledevice && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Compatible Device</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.compatibledevices?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.compatibledevice,
                                              value: todo.compatibledevice,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "compatibledevice",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.outputpower && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Output Power</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.outputpower?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.outputpower,
                                              value: todo.outputpower,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "outputpower",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.collingfancount && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Cooling Fan Count</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.coolingfancount?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.collingfancount,
                                              value: todo.collingfancount,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "collingfancount",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.clockspeed && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Clock Speed</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              ?.find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.clockspeed?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.clockspeed,
                                              value: todo.clockspeed,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "clockspeed",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.core && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Core</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              ?.find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.core?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.core,
                                              value: todo.core,
                                            }}
                                            onChange={(e) => {
                                              handleChange(index, "core", e.value);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.speed && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Speed</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              ?.find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.speed?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.speed,
                                              value: todo.speed,
                                            }}
                                            onChange={(e) => {
                                              handleChange(index, "speed", e.value);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.frequency && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Frequency</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              ?.find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.frequency?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.frequency,
                                              value: todo.frequency,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "frequency",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.output && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Output</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              ?.find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.output?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.output,
                                              value: todo.output,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "output",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.ethernetports && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Ethernet Ports</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              ?.find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.ethernetports?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.ethernetports,
                                              value: todo.ethernetports,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "ethernetports",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.distance && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Distance</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              ?.find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.distance?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.distance,
                                              value: todo.distance,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "distance",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.lengthname && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Length</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              ?.find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.lengthname?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.lengthname,
                                              value: todo.lengthname,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "lengthname",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.slot && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Slot</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              ?.find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.slot?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.slot,
                                              value: todo.slot,
                                            }}
                                            onChange={(e) => {
                                              handleChange(index, "slot", e.value);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.noofchannels && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>No. Of Channels</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              ?.find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.noofchannels?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.noofchannels,
                                              value: todo.noofchannels,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "noofchannels",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.colours && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Colour</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              ?.find(
                                                (item) =>
                                                  item.subcomponent === todo.subname
                                              )
                                              ?.colours?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.colours,
                                              value: todo.colours,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "colours",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item md={10} sm={10} xs={10}>
                                      <Typography>Material Code</Typography>
                                      <FormControl fullWidth size="small">
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          value={todo.code}
                                          disabled={todo.subcomponentcheck === false}
                                        // onChange={(e) => {
                                        //   handleChange(
                                        //     index,
                                        //     "code",
                                        //     e.target.value
                                        //   );
                                        // }}
                                        />
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </>
                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item md={10} sm={10} xs={10}>
                                      <Typography>Count(Qty)</Typography>
                                      <FormControl fullWidth size="small">
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          value={todo.countquantity}
                                          disabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            handleChange(
                                              index,
                                              "countquantity",
                                              e.target.value
                                            );
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </>
                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item md={10} sm={10} xs={10}>
                                      <FormControl fullWidth size="small">
                                        <Typography>
                                          Vendor Group Name
                                          <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                          options={vendorGroupOpt}
                                          styles={colourStyles}
                                          isDisabled={todo.subcomponentcheck === false}
                                          value={{
                                            label: todo.vendorgroup,
                                            value: todo.vendorgroup,
                                          }}
                                          onChange={(e) => {
                                            handleChangeGroupNameIndexBased(
                                              e,
                                              index
                                            );
                                            handleChange(
                                              index,
                                              "vendorgroup",
                                              e.value
                                            );
                                            handleChange(
                                              index,
                                              "vendor",
                                              "Please Select Vendor "
                                            );
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item md={10} sm={10} xs={10}>
                                      <FormControl fullWidth size="small">
                                        <Typography>
                                          Vendor<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                          options={vendorOptInd[index]}
                                          styles={colourStyles}
                                          isDisabled={todo.subcomponentcheck === false}
                                          value={{
                                            label: todo.vendor,
                                            value: todo.vendor,
                                          }}
                                          onChange={(e) => {
                                            handleChange(
                                              index,
                                              "vendor",
                                              e.value,
                                              e._id
                                            );
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </>

                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item md={10} sm={10} xs={10}>
                                      <FormControl fullWidth size="small">
                                        <Typography>Address</Typography>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          value={todo?.address}
                                          disabled={todo.subcomponentcheck === false}
                                          readOnly
                                        />
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </>

                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item md={10} sm={10} xs={10}>
                                      <FormControl fullWidth size="small">
                                        <Typography>Phone Number</Typography>
                                        <OutlinedInput
                                          id="component-outlined"
                                          disabled={todo.subcomponentcheck === false}
                                          type="text"
                                          value={todo?.phonenumber}
                                          readOnly
                                        />
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </>
                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item md={10} sm={10} xs={10}>
                                      <Typography>Rate</Typography>
                                      <FormControl fullWidth size="small">
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          value={todo.rate}
                                          disabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            const inputValue = e.target.value;
                                            const regex = /^[0-9]*$/;
                                            if (regex.test(inputValue)) {
                                              handleChange(
                                                index,
                                                "rate",
                                                inputValue
                                              );
                                            }
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </>
                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item md={10} sm={10} xs={10}>
                                      <FormControl fullWidth size="small">
                                        <Typography>
                                          Warranty <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Select
                                          fullWidth
                                          labelId="demo-select-small"
                                          id="demo-select-small"
                                          value={todo.warranty}
                                          disabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            handleChange(
                                              index,
                                              "warranty",
                                              e.target.value
                                            );
                                          }}
                                        >
                                          <MenuItem value="" disabled>
                                            {" "}
                                            Please Select
                                          </MenuItem>
                                          <MenuItem value="Yes"> {"Yes"} </MenuItem>
                                          <MenuItem value="No"> {"No"} </MenuItem>
                                        </Select>
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </>

                              {todo.warranty === "Yes" && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container>
                                      <Grid item md={6} xs={6} sm={6}>
                                        <Typography>
                                          Warranty Time{" "}
                                          <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            placeholder="Enter Time"
                                            value={todo.estimation}
                                            disabled={todo.subcomponentcheck === false}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "estimation",
                                                e.target.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                      <Grid item md={6} xs={6} sm={6}>
                                        <Typography>
                                          Estimation{" "}
                                          <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Select
                                          fullWidth
                                          labelId="demo-select-small"
                                          id="demo-select-small"
                                          value={todo.estimationtime}
                                          disabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            handleChange(
                                              index,
                                              "estimationtime",
                                              e.target.value
                                            );
                                          }}
                                        >
                                          <MenuItem value="" disabled>
                                            {" "}
                                            Please Select
                                          </MenuItem>
                                          <MenuItem value="Days">
                                            {" "}
                                            {"Days"}{" "}
                                          </MenuItem>
                                          <MenuItem value="Month">
                                            {" "}
                                            {"Month"}{" "}
                                          </MenuItem>
                                          <MenuItem value="Year">
                                            {" "}
                                            {"Year"}{" "}
                                          </MenuItem>
                                        </Select>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}

                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item md={10} sm={10} xs={10}>
                                      <FormControl fullWidth size="small">
                                        <Typography>Purchase date </Typography>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="date"
                                          value={todo.purchasedate}
                                          disabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            handleChange(
                                              index,
                                              "purchasedate",
                                              e.target.value
                                            );
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </>
                              {todo.warranty === "Yes" && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Expiry Date </Typography>
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            disabled={todo.subcomponentcheck === false}
                                            placeholder=""
                                            value={todo.warrantycalculation}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}

                            </>
                          )}

                          {/* <Grid item md={1} sm={3} xs={3}>
                            {todos.length > 0 && (
                              <>
                                <Button
                                  sx={{
                                    padding: "14px 14px",
                                    marginTop: "16px",
                                    minWidth: "40px !important",
                                    borderRadius: "50% !important",
                                    ":hover": {
                                      backgroundColor: "#80808036",
                                    },
                                  }}
                                  onClick={() => handleDelete(index)}
                                >
                                  <FaTrash
                                    style={{
                                      fontSize: "large",
                                      color: "#a73131",
                                    }}
                                  />
                                </Button>
                              </>
                            )}
                          </Grid> */}
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid container key={index} spacing={1}>
                      <Grid item md={12} sm={12} xs={12} marginTop={2}>
                        <Grid container key={index} spacing={1}>
                          <>
                            <Grid item md={3} sm={6} xs={12}>
                              <Grid container spacing={2}>
                                <Grid item md={10} sm={10} xs={10}>


                                  <FormGroup>
                                    <FormControlLabel

                                      control={
                                        <Switch
                                          // color="success"
                                          sx={{
                                            "& .MuiSwitch-switchBase.Mui-checked": {
                                              color: "green", // Thumb color when checked
                                            },
                                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                              backgroundColor: "green", // Track color when checked
                                            },
                                            "& .MuiSwitch-switchBase": {
                                              color: "#ff0000a3", // Thumb color when not checked
                                            },
                                            "& .MuiSwitch-switchBase + .MuiSwitch-track": {
                                              backgroundColor: "#ff0000a3", // Track color when not checked
                                            },
                                          }}
                                          checked={todo.subcomponentcheck}
                                          onChange={(e) => {
                                            handleChange(
                                              index,
                                              "subcomponentcheck",
                                              e.target.checked
                                            );
                                          }}
                                        />
                                      }
                                      label="Enable Subcomponent"
                                    />
                                  </FormGroup>
                                </Grid>
                              </Grid>
                            </Grid>
                          </>
                          {todo.subcomponentcheck === true && (

                            <>

                              {todo.type && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Type</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.type?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.type,
                                              value: todo.type,
                                            }}
                                            onChange={(e) => {
                                              handleChange(index, "type", e.value);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.model && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Model</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.model?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.model,
                                              value: todo.model,
                                            }}
                                            onChange={(e) => {
                                              handleChange(index, "model", e.value);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}

                              {todo.size && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Size</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.size?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.size,
                                              value: todo.size,
                                            }}
                                            onChange={(e) => {
                                              handleChange(index, "size", e.value);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}

                              {todo.variant && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Variants</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.variant?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.variant,
                                              value: todo.variant,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "variant",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}

                              {todo.brand && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl size="small" fullWidth>
                                          <Typography>Brand</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.brand?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.brand,
                                              value: todo.brand,
                                            }}
                                            onChange={(e) => {
                                              handleChange(index, "brand", e.value);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}

                              {todo.serial !== undefined && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container>
                                      <Grid item md={11.6} sm={10} xs={10}>
                                        <Typography>Serial</Typography>

                                        <OutlinedInput
                                          fullWidth
                                          type="text"
                                          size="small"
                                          placeholder="Please Enter Serial"
                                          value={todo.serial}
                                          disabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            handleChange(
                                              index,
                                              "serial",
                                              e.target.value
                                            );
                                          }}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}

                              {todo.other !== undefined && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container>
                                      <Grid item md={11.6} sm={10} xs={10}>
                                        <Typography>Others</Typography>

                                        <OutlinedInput
                                          fullWidth
                                          type="text"
                                          size="small"
                                          placeholder="Please Enter Other"
                                          value={todo.other}
                                          disabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            handleChange(
                                              index,
                                              "other",
                                              e.target.value
                                            );
                                          }}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.capacity && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Capacity</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.capacity?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.capacity,
                                              value: todo.capacity,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "capacity",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.hdmiport !== undefined && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container>
                                      <Grid item md={11.6} sm={10} xs={10}>
                                        <Typography>HDMI Port</Typography>

                                        <OutlinedInput
                                          fullWidth
                                          type="number"
                                          size="small"
                                          placeholder="Please Enter HDMI Port"
                                          value={todo.hdmiport}
                                          disabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            const inputText = e.target.value;
                                            const validatedInput =
                                              inputText.match(/^\d*$/);

                                            const sanitizedInput =
                                              validatedInput !== null
                                                ? validatedInput[0]
                                                : "0";
                                            handleChange(
                                              index,
                                              "hdmiport",
                                              sanitizedInput
                                            );
                                          }}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.vgaport !== undefined && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container>
                                      <Grid item md={11.6} sm={10} xs={10}>
                                        <Typography>VGA Port</Typography>

                                        <OutlinedInput
                                          fullWidth
                                          type="text"
                                          size="small"
                                          placeholder="Please Enter VGA Port"
                                          value={todo.vgaport}
                                          disabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            const inputText = e.target.value;
                                            const validatedInput =
                                              inputText.match(/^\d*$/);

                                            const sanitizedInput =
                                              validatedInput !== null
                                                ? validatedInput[0]
                                                : "0";
                                            handleChange(
                                              index,
                                              "vgaport",
                                              sanitizedInput
                                            );
                                          }}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.dpport !== undefined && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container>
                                      <Grid item md={11.6} sm={10} xs={10}>
                                        <Typography>DP Port</Typography>

                                        <OutlinedInput
                                          fullWidth
                                          type="text"
                                          size="small"
                                          placeholder="Please Enter DP Port"
                                          value={todo.dpport}
                                          disabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            const inputText = e.target.value;
                                            const validatedInput =
                                              inputText.match(/^\d*$/);

                                            const sanitizedInput =
                                              validatedInput !== null
                                                ? validatedInput[0]
                                                : "0";
                                            handleChange(
                                              index,
                                              "dpport",
                                              sanitizedInput
                                            );
                                          }}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.usbport !== undefined && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container>
                                      <Grid item md={11.6} sm={10} xs={10}>
                                        <Typography>USB Port</Typography>

                                        <OutlinedInput
                                          fullWidth
                                          type="text"
                                          size="small"
                                          placeholder="Please Enter USB Port"
                                          value={todo.usbport}
                                          disabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            const inputText = e.target.value;
                                            const validatedInput =
                                              inputText.match(/^\d*$/);

                                            const sanitizedInput =
                                              validatedInput !== null
                                                ? validatedInput[0]
                                                : "0";
                                            handleChange(
                                              index,
                                              "usbport",
                                              sanitizedInput
                                            );
                                          }}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.paneltypescreen && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Panel Type</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.paneltype?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            disabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.paneltypescreen,
                                              value: todo.paneltypescreen,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "paneltypescreen",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.resolution && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Screen Resolution</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.screenresolution?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.resolution,
                                              value: todo.resolution,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "resolution",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.connectivity && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Connectivity</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.connectivity?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.connectivity,
                                              value: todo.connectivity,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "connectivity",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.daterate && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Data Rate</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.datarate?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.daterate,
                                              value: todo.daterate,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "daterate",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.compatibledevice && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Compatible Device</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.compatibledevices?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.compatibledevice,
                                              value: todo.compatibledevice,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "compatibledevice",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.outputpower && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Output Power</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.outputpower?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.outputpower,
                                              value: todo.outputpower,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "outputpower",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.collingfancount && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Cooling Fan Count</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.coolingfancount?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.collingfancount,
                                              value: todo.collingfancount,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "collingfancount",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.clockspeed && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Clock Speed</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.clockspeed?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.clockspeed,
                                              value: todo.clockspeed,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "clockspeed",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.core && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Core</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.core?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.core,
                                              value: todo.core,
                                            }}
                                            onChange={(e) => {
                                              handleChange(index, "core", e.value);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.speed && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Speed</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.speed?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.speed,
                                              value: todo.speed,
                                            }}
                                            onChange={(e) => {
                                              handleChange(index, "speed", e.value);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.frequency && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Frequency</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.frequency?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.frequency,
                                              value: todo.frequency,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "frequency",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.output && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Output</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.output?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.output,
                                              value: todo.output,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "output",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.ethernetports && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Ethernet Ports</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.ethernetports?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.ethernetports,
                                              value: todo.ethernetports,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "ethernetports",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.distance && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Distance</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.distance?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.distance,
                                              value: todo.distance,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "distance",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.lengthname && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Length</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.lengthname?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.lengthname,
                                              value: todo.lengthname,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "lengthname",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.slot && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Slot</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.slot?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.slot,
                                              value: todo.slot,
                                            }}
                                            onChange={(e) => {
                                              handleChange(index, "slot", e.value);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.noofchannels && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>No. Of Channels</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.noofchannels?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.noofchannels,
                                              value: todo.noofchannels,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "noofchannels",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              {todo.colours && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Colour</Typography>
                                          <Selects
                                            options={specificationGrouping
                                              .find(
                                                (item) =>
                                                  assetdetail.component ===
                                                  item.component &&
                                                  assetdetail.material ===
                                                  item.assetmaterial
                                              )
                                              ?.colours?.map((item) => ({
                                                ...item,
                                                label: item,
                                                value: item,
                                              }))}
                                            styles={colourStyles}
                                            isDisabled={todo.subcomponentcheck === false}
                                            value={{
                                              label: todo.colours,
                                              value: todo.colours,
                                            }}
                                            onChange={(e) => {
                                              handleChange(
                                                index,
                                                "colours",
                                                e.value
                                              );
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}
                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item md={10} sm={10} xs={10}>
                                      <Typography>Material Code</Typography>
                                      <FormControl fullWidth size="small">
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          disabled={todo.subcomponentcheck === false}
                                          value={todo.code}
                                        />
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </>
                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item md={10} sm={10} xs={10}>
                                      <Typography>Count(Qty)</Typography>
                                      <FormControl fullWidth size="small">
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          value={todo.countquantity}
                                          disabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            handleChange(
                                              index,
                                              "countquantity",
                                              e.target.value
                                            );
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </>
                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item md={10} sm={10} xs={10}>
                                      <Typography>Rate</Typography>
                                      <FormControl fullWidth size="small">
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="text"
                                          value={todo.rate}
                                          disabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            const inputValue = e.target.value;
                                            const regex = /^[0-9]*$/;
                                            if (regex.test(inputValue)) {
                                              handleChange(
                                                index,
                                                "rate",
                                                inputValue
                                              );
                                            }
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </>
                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item md={10} sm={10} xs={10}>
                                      <FormControl fullWidth size="small">
                                        <Typography>
                                          Warranty <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Select
                                          fullWidth
                                          labelId="demo-select-small"
                                          id="demo-select-small"
                                          value={todo.warranty}
                                          disabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            handleChange(
                                              index,
                                              "warranty",
                                              e.target.value
                                            );
                                          }}
                                        >
                                          <MenuItem value="" disabled>
                                            {" "}
                                            Please Select
                                          </MenuItem>
                                          <MenuItem value="Yes"> {"Yes"} </MenuItem>
                                          <MenuItem value="No"> {"No"} </MenuItem>
                                        </Select>
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </>

                              {todo.warranty === "Yes" && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container>
                                      <Grid item md={6} xs={6} sm={6}>
                                        <Typography>
                                          Warranty Time{" "}
                                          <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            disabled={todo.subcomponentcheck === false}
                                            placeholder="Enter Time"
                                            value={todo.estimation}
                                            onChange={(e) => {
                                              handleChange(index, "estimation");
                                              handleChangephonenumber(e);
                                            }}
                                          />
                                        </FormControl>
                                      </Grid>
                                      <Grid item md={6} xs={6} sm={6}>
                                        <Typography>
                                          Estimation{" "}
                                          <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Select
                                          fullWidth
                                          labelId="demo-select-small"
                                          id="demo-select-small"
                                          value={todo.estimationtime}
                                          disabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            handleChange(
                                              index,
                                              "estimationtime",
                                              e.target.value
                                            );
                                          }}
                                        >
                                          <MenuItem value="" disabled>
                                            {" "}
                                            Please Select
                                          </MenuItem>
                                          <MenuItem value="Days">
                                            {" "}
                                            {"Days"}{" "}
                                          </MenuItem>
                                          <MenuItem value="Month">
                                            {" "}
                                            {"Month"}{" "}
                                          </MenuItem>
                                          <MenuItem value="Year">
                                            {" "}
                                            {"Year"}{" "}
                                          </MenuItem>
                                        </Select>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}

                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item md={10} sm={10} xs={10}>
                                      <FormControl fullWidth size="small">
                                        <Typography>Purchase date </Typography>
                                        <OutlinedInput
                                          id="component-outlined"
                                          type="date"
                                          value={todo.purchasedate}
                                          disabled={todo.subcomponentcheck === false}
                                          onChange={(e) => {
                                            handleChange(
                                              index,
                                              "purchasedate",
                                              e.target.value
                                            );
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </>

                              {todos.warranty === "Yes" && (
                                <>
                                  <Grid item md={3} sm={6} xs={12}>
                                    <Grid container spacing={2}>
                                      <Grid item md={10} sm={10} xs={10}>
                                        <FormControl fullWidth size="small">
                                          <Typography>Expiry Date </Typography>
                                          <OutlinedInput
                                            id="component-outlined"
                                            type="text"
                                            disabled={todo.subcomponentcheck === false}
                                            placeholder=""
                                            value={todo.warrantycalculation}
                                          />
                                        </FormControl>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </>
                              )}

                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item md={10} sm={10} xs={10}>
                                      <FormControl fullWidth size="small">
                                        <Typography>
                                          Vendor Group Name
                                          <b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                          options={vendorGroupOpt}
                                          styles={colourStyles}
                                          isDisabled={todo.subcomponentcheck === false}
                                          value={{
                                            label: todo.vendorgroup,
                                            value: todo.vendorgroup,
                                          }}
                                          onChange={(e) => {
                                            handleChangeGroupNameIndexBased(
                                              e,
                                              index
                                            );
                                            handleChange(
                                              index,
                                              "vendorgroup",
                                              e.value
                                            );

                                            setTodos((prev) => {
                                              const updated = [...prev];
                                              updated[index].vendor =
                                                "Please Select Vendor ";
                                              return updated;
                                            });
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                                <Grid item md={3} sm={6} xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item md={10} sm={10} xs={10}>
                                      <FormControl fullWidth size="small">
                                        <Typography>
                                          Vendor<b style={{ color: "red" }}>*</b>
                                        </Typography>
                                        <Selects
                                          options={vendorOptInd[index]}
                                          styles={colourStyles}
                                          isDisabled={todo.subcomponentcheck === false}
                                          value={{
                                            label: todo.vendor,
                                            value: todo.vendor,
                                          }}
                                          onChange={(e) => {
                                            handleChange(
                                              index,
                                              "vendor",
                                              e.value,
                                              e._id
                                            );
                                          }}
                                        />
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </>

                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item md={10} sm={10} xs={10}>
                                      <FormControl fullWidth size="small">
                                        <Typography>Address</Typography>
                                        <OutlinedInput
                                          id="component-outlined"
                                          disabled={todo.subcomponentcheck === false}
                                          type="text"
                                          value={todo?.address}
                                          readOnly
                                        />
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </>

                              <>
                                <Grid item md={3} sm={6} xs={12}>
                                  <Grid container spacing={2}>
                                    <Grid item md={10} sm={10} xs={10}>
                                      <FormControl fullWidth size="small">
                                        <Typography>Phone Number</Typography>
                                        <OutlinedInput
                                          id="component-outlined"
                                          disabled={todo.subcomponentcheck === false}
                                          type="text"
                                          value={todo?.phonenumber}
                                          readOnly
                                        />
                                      </FormControl>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </>
                            </>
                          )}

                          {/* <Grid item md={1} sm={3} xs={3}>
                            <Button
                              sx={{
                                padding: "14px 14px",
                                marginTop: "16px",
                                minWidth: "40px !important",
                                borderRadius: "50% !important",
                                ":hover": {
                                  backgroundColor: "#80808036",
                                },
                              }}
                              onClick={() => handleDelete(index)}
                            >
                              <FaTrash
                                style={{ fontSize: "large", color: "#a73131" }}
                              />
                            </Button>
                          </Grid> */}
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                  <br />
                </>
              );
            })}
          <br />

          <Grid container spacing={1}>
            <Grid item md={3} xs={12} sm={12}>
              <Typography>Photos</Typography>
              <Box sx={{ display: "flex", justifyContent: "left" }}>
                <Button
                  variant="contained"
                  onClick={handleClickUploadPopupOpen}
                >
                  Upload
                </Button>
              </Box>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {isWebcamCapture == true && capturedImages?.length > 0 &&
                capturedImages?.map((file, index) => (
                  <Grid
                    container
                    key={index}
                    alignItems="center"
                    spacing={2}
                    sx={{
                      padding: "8px 0",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {/* File Icon */}
                    <Grid item md={1} sm={2} xs={2}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {file.type.includes("image/") ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            height={40}
                            style={{
                              maxWidth: "100%",
                            }}
                          />
                        ) : (
                          <img
                            className={classes.preview}
                            src={getFileIcon(file.name)}
                            height={40}
                            alt="file icon"
                          />
                        )}
                      </Box>
                    </Grid>

                    {/* File Name */}
                    <Grid item md={3} sm={3} xs={3}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {file.name}
                      </Typography>
                    </Grid>

                    {/* Remarks Input */}
                    <Grid item md={4} sm={4} xs={4}>
                      <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Enter remarks"
                        value={file?.remarks || ""}
                        onChange={(e) => handleRemarkChangeWebCam(e.target.value, index)}
                        fullWidth
                      />
                    </Grid>

                    {/* View and Delete Icons */}
                    <Grid
                      item
                      md={4}
                      sm={3}
                      xs={3}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                      }}
                    >
                      <Button
                        sx={{
                          padding: "6px",
                          minWidth: "36px",
                          borderRadius: "50%",
                          ":hover": {
                            backgroundColor: "#f0f0f0",
                          },
                        }}
                        onClick={() => renderFilePreview(file)}
                      >
                        <VisibilityOutlinedIcon
                          style={{ fontSize: "18px", color: "#357AE8" }}
                        />
                      </Button>
                      <Button
                        sx={{
                          padding: "6px",
                          minWidth: "36px",
                          borderRadius: "50%",
                          ":hover": {
                            backgroundColor: "#f0f0f0",
                          },
                        }}
                        onClick={() => removeCapturedImage(index)}
                      >
                        <FaTrash
                          style={{ fontSize: "18px", color: "#a73131" }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                ))}
              {refImage?.length > 0 && refImage?.map((file, index) => (
                <Grid
                  container
                  key={index}
                  alignItems="center"
                  spacing={2}
                  sx={{
                    padding: "8px 0",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {/* File Icon */}
                  <Grid item md={1} sm={2} xs={2}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {file.type.includes("image/") ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          height={40}
                          style={{
                            maxWidth: "100%",
                          }}
                        />
                      ) : (
                        <img
                          className={classes.preview}
                          src={getFileIcon(file.name)}
                          height={40}
                          alt="file icon"
                        />
                      )}
                    </Box>
                  </Grid>

                  {/* File Name */}
                  <Grid item md={3} sm={3} xs={3}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {file.name}
                    </Typography>
                  </Grid>

                  {/* Remarks Input */}
                  <Grid item md={4} sm={4} xs={4}>
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Enter remarks"
                      value={file?.remarks || ""}
                      onChange={(e) => handleRemarkChangeUpload(e.target.value, index)}
                      fullWidth
                    />
                  </Grid>

                  {/* View and Delete Icons */}
                  <Grid
                    item
                    md={4}
                    sm={3}
                    xs={3}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                    }}
                  >
                    <Button
                      sx={{
                        padding: "6px",
                        minWidth: "36px",
                        borderRadius: "50%",
                        ":hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
                      onClick={() => renderFilePreview(file)}
                    >
                      <VisibilityOutlinedIcon
                        style={{ fontSize: "18px", color: "#357AE8" }}
                      />
                    </Button>
                    <Button
                      sx={{
                        padding: "6px",
                        minWidth: "36px",
                        borderRadius: "50%",
                        ":hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
                      onClick={() => handleDeleteFile(index)}
                    >
                      <FaTrash
                        style={{ fontSize: "18px", color: "#a73131" }}
                      />
                    </Button>
                  </Grid>
                </Grid>
              ))}



              {refImageDrag?.length > 0 && refImageDrag?.map((file, index) => (
                <Grid
                  container
                  key={index}
                  alignItems="center"
                  spacing={2}
                  sx={{
                    padding: "8px 0",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {/* File Icon */}
                  <Grid item md={1} sm={2} xs={2}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {file.type.includes("image/") ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          height={40}
                          style={{
                            maxWidth: "100%",
                          }}
                        />
                      ) : (
                        <img
                          className={classes.preview}
                          src={getFileIcon(file.name)}
                          height={40}
                          alt="file icon"
                        />
                      )}
                    </Box>
                  </Grid>

                  {/* File Name */}
                  <Grid item md={3} sm={3} xs={3}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {file.name}
                    </Typography>
                  </Grid>

                  {/* Remarks Input */}
                  <Grid item md={4} sm={4} xs={4}>
                    <TextField
                      variant="outlined"
                      size="small"
                      placeholder="Enter remarks"
                      value={file?.remarks || ""}
                      onChange={(e) => handleRemarkChangeDragDrop(e.target.value, index)}
                      fullWidth
                    />
                  </Grid>

                  {/* View and Delete Icons */}
                  <Grid
                    item
                    md={4}
                    sm={3}
                    xs={3}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 1,
                    }}
                  >
                    <Button
                      sx={{
                        padding: "6px",
                        minWidth: "36px",
                        borderRadius: "50%",
                        ":hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
                      onClick={() => renderFilePreview(file)}
                    >
                      <VisibilityOutlinedIcon
                        style={{ fontSize: "18px", color: "#357AE8" }}
                      />
                    </Button>
                    <Button
                      sx={{
                        padding: "6px",
                        minWidth: "36px",
                        borderRadius: "50%",
                        ":hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
                      onClick={() => handleRemoveFile(index)}
                    >
                      <FaTrash
                        style={{ fontSize: "18px", color: "#a73131" }}
                      />
                    </Button>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12} sm={6} md={1} lg={2.5} marginTop={3}>
              <LoadingButton
                onClick={handleSubmit}
                loading={loadingdeloverall}
                sx={buttonStyles.buttonsubmit}
                loadingPosition="end"
                variant="contained"
              >
                Create
              </LoadingButton>
            </Grid>

            <Grid item xs={12} sm={6} md={1} lg={2.5} marginTop={3}>
              <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                Clear
              </Button>
            </Grid>
          </Grid>

        </Box>
      )}
      <br />

      {/* UPLOAD IMAGE DIALOG */}
      <Dialog
        open={uploadPopupOpen}

        onClose={handleUploadPopupClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        sx={{ marginTop: "95px" }}
      >
        <DialogTitle
          id="customized-dialog-title1"
          sx={{ backgroundColor: "#e0e0e0", color: "#000", display: "flex" }}
        >
          Upload Image
        </DialogTitle>
        <DialogContent sx={{ minWidth: "750px", height: "850px" }}>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Typography variant="body2" style={{ marginTop: "5px" }}>
                {/* Max File size: 5MB */}
              </Typography>
              <div onDragOver={handleDragOver} onDrop={handleDrop}>
                {previewURL && refImageDrag.length > 0 ? (
                  <>
                    {refImageDrag.map((file, index) => (
                      <>
                        <img
                          src={file.preview}
                          alt={file.name}
                          style={{
                            maxWidth: "70px",
                            maxHeight: "70px",
                            marginTop: "10px",
                          }}
                        />
                        <Button
                          onClick={() => handleRemoveFile(index)}
                          style={{ marginTop: "0px", color: "red" }}
                        >
                          X
                        </Button>
                      </>
                    ))}
                  </>
                ) : (
                  <div
                    style={{
                      marginTop: "10px",
                      marginLeft: "0px",
                      border: "1px dashed #ccc",
                      padding: "0px",
                      width: "100%",
                      height: "150px",
                      display: "flex",
                      alignContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ display: "flex", margin: "50px auto" }}>
                      <ContentCopyIcon /> Drag and drop
                    </div>
                  </div>
                )}
              </div>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <br />
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: "flex" }}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={userStyle.uploadbtn}
                  >
                    Upload
                    <input
                      type="file"
                      multiple
                      id="productimage"
                      // accept="image/*"
                      hidden
                      onChange={handleInputChange}
                    />
                  </Button>
                  &ensp;
                  <Button
                    variant="contained"
                    onClick={showWebcam}
                    sx={userStyle.uploadbtn}
                  >
                    Webcam
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {isWebcamCapture == true &&
                capturedImages.map((image, index) => (
                  <Grid container key={index}>
                    <Grid item md={2} sm={2} xs={12}>
                      <Box
                        style={{
                          isplay: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: "37px",
                        }}
                      >
                        <img
                          src={image.preview}
                          alt={image.name}
                          height={50}
                          style={{ maxWidth: "-webkit-fill-available" }}
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      md={7}
                      sm={7}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="subtitle2">
                        {" "}
                        {image.name}{" "}
                      </Typography>
                    </Grid>
                    <Grid item md={1} sm={1} xs={12}>
                      <Grid sx={{ display: "flex" }}>
                        <Button
                          sx={{
                            marginTop: "15px !important",
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036", // theme.palette.primary.main
                            },
                          }}
                          onClick={() => renderFilePreview(image)}
                        >
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: "12px",
                              color: "#357AE8",
                              marginTop: "35px !important",
                            }}
                          />
                        </Button>
                        <Button
                          sx={{
                            marginTop: "15px !important",
                            padding: "14px 14px",
                            minWidth: "40px !important",
                            borderRadius: "50% !important",
                            ":hover": {
                              backgroundColor: "#80808036",
                            },
                          }}
                          onClick={() => removeCapturedImage(index)}
                        >
                          <FaTrash
                            style={{
                              color: "#a73131",
                              fontSize: "12px",
                              marginTop: "35px !important",
                            }}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              {refImage.map((file, index) => (
                <Grid container key={index}>
                  <Grid item md={2} sm={2} xs={2}>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {file.type.includes("image/") ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          height={50}
                          style={{
                            maxWidth: "-webkit-fill-available",
                          }}
                        />
                      ) : (
                        <img
                          className={classes.preview}
                          src={getFileIcon(file.name)}
                          height="10"
                          alt="file icon"
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid
                    item
                    md={7}
                    sm={7}
                    xs={7}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle2"> {file.name} </Typography>
                  </Grid>
                  <Grid item md={1} sm={1} xs={1}>
                    <Grid sx={{ display: "flex" }}>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => renderFilePreview(file)}
                      >
                        <VisibilityOutlinedIcon
                          style={{ fontsize: "12px", color: "#357AE8" }}
                        />
                      </Button>
                      <Button
                        sx={{
                          padding: "14px 14px",
                          minWidth: "40px !important",
                          borderRadius: "50% !important",
                          ":hover": {
                            backgroundColor: "#80808036", // theme.palette.primary.main
                          },
                        }}
                        onClick={() => handleDeleteFile(index)}
                      >
                        <FaTrash
                          style={{ color: "#a73131", fontSize: "12px" }}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadOverAll} variant="contained">
            Ok
          </Button>
          <Button onClick={resetImage} sx={userStyle.btncancel}>
            Reset
          </Button>
          <Button onClick={handleUploadPopupClose} sx={userStyle.btncancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* webcam alert start */}
      <Dialog
        open={isWebcamOpen}
        onClose={webcamClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <Webcamimage
            name={name}
            getImg={getImg}
            setGetImg={setGetImg}
            valNum={valNum}
            setValNum={setValNum}
            capturedImages={capturedImages}
            setCapturedImages={setCapturedImages}
            setRefImage={setRefImage}
            setRefImageDrag={setRefImageDrag}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={webcamDataStore}>
            OK
          </Button>
          <Button variant="contained" color="error" onClick={webcamClose}>
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isimgviewbill}
        onClose={handlecloseImgcodeviewbill}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <Typography variant="h6">Images</Typography>
          {getimgbillcode.map((imagefilebill, index) => (
            <Grid container key={index}>
              <Grid item md={6} sm={10} xs={10}>
                <img
                  src={imagefilebill.preview}
                  style={{
                    maxWidth: "70px",
                    maxHeight: "70px",
                    marginTop: "10px",
                  }}
                />
              </Grid>

              <Grid
                item
                md={4}
                sm={10}
                xs={10}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography>{imagefilebill.name}</Typography>
              </Grid>
              <Grid item md={2} sm={2} xs={2}>
                <Button
                  sx={{
                    padding: "14px 14px",
                    minWidth: "40px !important",
                    borderRadius: "50% !important",
                    ":hover": {
                      backgroundColor: "#80808036", // theme.palette.primary.main
                    },
                  }}
                  onClick={() => renderFilePreview(imagefilebill)}
                >
                  <VisibilityOutlinedIcon
                    style={{
                      fontsize: "12px",
                      color: "#357AE8",
                      marginTop: "35px !important",
                    }}
                  />
                </Button>
              </Grid>
            </Grid>
          ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={handlecloseImgcodeviewbill} sx={userStyle.btncancel}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

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

      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default AssetDetails;