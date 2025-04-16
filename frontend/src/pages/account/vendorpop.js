import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  OutlinedInput,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import axios from "axios";
import { City, Country, State } from "country-state-city";
import "jspdf-autotable";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import Selects from "react-select";
import { handleApiError } from "../../components/Errorhandling";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";

import AlertDialog from "../../components/Alert";
import MessageAlert from "../../components/MessageAlert";

function VendorPopup({ setVendorAuto, handleCloseviewalertvendor }) {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
    setBtnSubmit(false);
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

  let newval = "VEN0001";
  const [vendor, setVendor] = useState({
    vendorname: "",
    emailid: "",
    phonenumber: "",
    phonenumberone: "",
    phonenumbertwo: "",
    phonenumberthree: "",
    phonenumberfour: "",
    whatsappnumber: "",
    contactperson: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    gstnumber: "",
    creditdays: "",
    bankname: "Please Select Bank Name",
    bankbranchname: "",
    accountholdername: "",
    accountnumber: "",
    ifsccode: "",
    phonecheck: false,
    modeofpayments: "Please Select Mode of Payments",
    upinumber: "",
    chequenumber: "",
    cardnumber: "",
    cardholdername: "",
    cardtransactionnumber: "",
    cardtype: "Please Select Card Type",
    cardmonth: "Month",
    cardyear: "Year",
    cardsecuritycode: "",
    paymentfrequency: "Please Select Payment Frequency",
  });
  const [cateCode, setCatCode] = useState([]);
  const [stdCode, setStdCode] = useState();
  const [lanNumber, setLanNumber] = useState();
  const [vendormaster, setVendormaster] = useState([]);
  const { isUserRoleAccess } = useContext(UserRoleAccessContext);
  const { auth } = useContext(AuthContext);
  const [monthsOption, setMonthsOption] = useState([]);
  const [yearsOption, setYearsOption] = useState([]);
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const [isEditOpen, setIsEditOpen] = useState(false);
  // Country city state datas
  const [selectedCountryp, setSelectedCountryp] = useState(
    Country.getAllCountries().find((country) => country.name === "India")
  );
  const [selectedStatep, setSelectedStatep] = useState(
    State.getStatesOfCountry(selectedCountryp?.isoCode).find(
      (state) => state.name === "Tamil Nadu"
    )
  );
  const [selectedCityp, setSelectedCityp] = useState(
    City.getCitiesOfState(
      selectedStatep?.countryCode,
      selectedStatep?.isoCode
    ).find((city) => city.name === "Tiruchirappalli")
  );
  //useEffect
  useEffect(() => {
    getPhoneNumber();
  }, [vendor.phonecheck, vendor.phonenumber]);

  useEffect(() => {
    fetchVendor();
    generateMonthsOptions();
    generateYearsOptions();
    fetchAutoId();
  }, []);
  useEffect(() => {
    fetchVendor();
  }, [isEditOpen]);
  useEffect(() => {
    const beforeUnloadHandler = (event) => handleBeforeUnload(event);
    window.addEventListener("beforeunload", beforeUnloadHandler);
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
    };
  }, []);

  const [btnSubmit, setBtnSubmit] = useState(false);

  const maxLength = 15; //gst number limit

  //function to generate hrs
  const generateMonthsOptions = () => {
    const mnthsOpt = [];
    for (let i = 1; i <= 12; i++) {
      if (i < 10) {
        i = "0" + i;
      }
      mnthsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setMonthsOption(mnthsOpt);
  };
  let today = new Date();
  var yyyy = today.getFullYear();
  //function to generate mins
  const generateYearsOptions = () => {
    const yearsOpt = [];
    for (let i = yyyy; i <= 2050; i++) {
      yearsOpt.push({ value: i.toString(), label: i.toString() });
    }
    setYearsOption(yearsOpt);
  };
  const handlechangecpincode = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 6);
    if (regex.test(inputValue) || inputValue === "") {
      setVendor({ ...vendor, pincode: inputValue });
    }
  };

  const handlechangestdcode = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 4);
    if (regex.test(inputValue) || inputValue === "") {
      setStdCode(inputValue);
    }
  };
  const handlechangephonenumber = (e) => {
    const regex = /^[0-9]+$/;
    const inputValue = e.target.value?.slice(0, 10);
    if (regex.test(inputValue) || inputValue === "") {
      return inputValue;
    }
  };

  const handleMobile = (e) => {
    if (e.length > 10) {
      setShowAlert("Mobile number can't more than 10 characters!");
      handleClickOpenerr();
      let num = e.slice(0, 10);
      setVendor({ ...vendor, phonenumber: num });
    }
  };
  const handlewhatsapp = (e) => {
    if (e.length > 10) {
      setShowAlert("Whats app number can't more than 10 characters!");
      handleClickOpenerr();
      let num = e.slice(0, 10);
      setVendor({ ...vendor, whatsappnumber: num });
    }
  };
  const getPhoneNumber = () => {
    if (vendor.phonecheck) {
      setVendor({ ...vendor, whatsappnumber: vendor.phonenumber });
    } else {
      setVendor({ ...vendor, whatsappnumber: "" });
    }
  };
  // Error Popup model
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnSubmit(false);
  };

  const paymentfrequency = [
    { value: "Daily", label: "Daily" },
    { value: "Monthly", label: "Monthly" },
    { value: "BillWise", label: "BillWise" },
  ];

  // page refersh reload code
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ""; // This is required for Chrome support
  };

  //bank name options
  const accounttypes = [
    { value: "ALLAHABAD BANK", label: "ALLAHABAD BANK" },
    { value: "ANDHRA BANK", label: "ANDHRA BANK" },
    { value: "AXIS BANK", label: "AXIS BANK" },
    { value: "STATE BANK OF INDIA", label: "STATE BANK OF INDIA" },
    { value: "BANK OF BARODA", label: "BANK OF BARODA" },
    { value: "CITY UNION BANK", label: "CITY UNION BANK" },
    { value: "UCO BANK", label: "UCO BANK" },
    { value: "UNION BANK OF INDIA", label: "UNION BANK OF INDIA" },
    { value: "TMB BANK", label: "TMB BANK" },
    { value: "BANK OF INDIA", label: "BANK OF INDIA" },
    { value: "BANDHAN BANK LIMITED", label: "BANDHAN BANK LIMITED" },
    { value: "CANARA BANK", label: "CANARA BANK" },
    { value: "GRAMIN VIKASH BANK", label: "GRAMIN VIKASH BANK" },
    { value: "CORPORATION BANK", label: "CORPORATION BANK" },
    { value: "INDIAN BANK", label: "INDIAN BANK" },
    { value: "INDIAN OVERSEAS BANK", label: "INDIAN OVERSEAS BANK" },
    { value: "ORIENTAL BANK OF COMMERCE", label: "ORIENTAL BANK OF COMMERCE" },
    { value: "PUNJAB AND SIND BANK", label: "PUNJAB AND SIND BANK" },
    { value: "PUNJAB NATIONAL BANK", label: "PUNJAB NATIONAL BANK" },
    { value: "RESERVE BANK OF INDIA", label: "RESERVE BANK OF INDIA" },
    { value: "SOUTH INDIAN BANK", label: "SOUTH INDIAN BANK" },
    { value: "UNITED BANK OF INDIA", label: "UNITED BANK OF INDIA" },
    { value: "CENTRAL BANK OF INDIA", label: "CENTRAL BANK OF INDIA" },
    { value: "VIJAYA BANK", label: "VIJAYA BANK" },
    { value: "DENA BANK", label: "DENA BANK" },
    {
      value: "BHARATIYA MAHILA BANK LIMITED",
      label: "BHARATIYA MAHILA BANK LIMITED",
    },
    { value: "FEDERAL BANK LTD", label: "FEDERAL BANK LTD" },
    { value: "HDFC BANK LTD", label: "HDFC BANK LTD" },
    { value: "ICICI BANK LTD", label: "ICICI BANK LTD" },
    { value: "IDBI BANK LTD", label: "IDBI BANK LTD" },
    { value: "PAYTM BANK", label: "PAYTM BANK" },
    { value: "FINO PAYMENT BANK", label: "FINO PAYMENT BANK" },
    { value: "INDUSIND BANK LTD", label: "INDUSIND BANK LTD" },
    { value: "KARNATAKA BANK LTD", label: "KARNATAKA BANK LTD" },
    { value: "KOTAK MAHINDRA BANK", label: "KOTAK MAHINDRA BANK" },
    { value: "YES BANK LTD", label: "YES BANK LTD" },
    { value: "SYNDICATE BANK", label: "SYNDICATE BANK" },
    { value: "BANK OF MAHARASHTRA", label: "BANK OF MAHARASHTRA" },
    { value: "DCB BANK", label: "DCB BANK" },
    { value: "IDFC BANK", label: "IDFC BANK" },
    {
      value: "JAMMU AND KASHMIR BANK BANK",
      label: "JAMMU AND KASHMIR BANK BANK",
    },
    { value: "KARUR VYSYA BANK", label: "KARUR VYSYA BANK" },
    { value: "RBL BANK", label: "RBL BANK" },
    { value: "DHANLAXMI BANK", label: "DHANLAXMI BANK" },
    { value: "CSB BANK", label: "CSB BANK" },
  ];
  const modeofpayments = [
    { value: "Cash", label: "Cash" },
    { value: "Bank Transfer", label: "Bank Transfer" },
    { value: "UPI", label: "UPI" },
    { value: "Card", label: "Card" },
    { value: "Cheque", label: "Cheque" },
  ];
  const cardtypes = [
    { value: "Credit Card", label: "Credit Card" },
    { value: "Debit Card", label: "Debit Card" },
    { value: "Visa Card", label: "Visa Card" },
    { value: "Master Card", label: "Master Card" },
  ];

  const [modeofpay, setmodeofpay] = useState([]);

  const deleteTodo = (index) => {
    setmodeofpay(
      modeofpay.filter((data) => {
        return data !== index;
      })
    );
    switch (index) {
      case "Bank Transfer":
        setVendor({
          ...vendor,
          bankname: "Please Select Bank Name",
          bankbranchname: "",
          accountholdername: "",
          accountnumber: "",
          ifsccode: "",
        });
        break;
      case "UPI":
        setVendor({ ...vendor, upinumber: "" });
        break;
      case "Cheque":
        setVendor({ ...vendor, chequenumber: "" });
        break;
      case "Card":
        setVendor({
          ...vendor,
          cardnumber: "",
          cardholdername: "",
          cardtransactionnumber: "",
          cardtype: "Please Select Card Type",
          cardmonth: "Month",
          cardyear: "Year",
          cardsecuritycode: "",
        });
        break;
    }
  };

  //submit option for saving
  const handlemodeofpay = () => {
    if (modeofpay.includes(vendor.modeofpayments)) {
      setPopupContentMalert(" To Do is Already Added!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      setmodeofpay([...modeofpay, vendor.modeofpayments]);
    }
  };

  const [autoId, setAutoId] = useState("");
  const fetchAutoId = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.VENDOR_AUTOID, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let refNo = res_vendor?.data?.autoid;

      setAutoId(refNo);

      return refNo;
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //add function
  const sendRequest = async () => {
    let filtered = Array.from(new Set(modeofpay));
    let autoIds = await fetchAutoId();
    try {
      let addVendorDetails = await axios.post(SERVICE.ADD_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        vendorid: String(autoIds),
        vendorname: String(vendor.vendorname),
        emailid: String(vendor.emailid),
        phonenumber: Number(vendor.phonenumber),
        phonenumberone: Number(vendor.phonenumberone),
        phonenumbertwo: Number(vendor.phonenumbertwo),
        phonenumberthree: Number(vendor.phonenumberthree),
        phonenumberfour: Number(vendor.phonenumberfour),
        whatsappnumber: Number(vendor.whatsappnumber),
        phonecheck: Boolean(vendor.phonecheck),
        contactperson: String(vendor.contactperson),
        address: String(vendor.address),
        country: String(
          selectedCountryp?.name == undefined ? "" : selectedCountryp?.name
        ),
        state: String(
          selectedStatep?.name == undefined ? "" : selectedStatep?.name
        ),
        city: String(
          selectedCityp?.name == undefined ? "" : selectedCityp?.name
        ),
        pincode: Number(vendor.pincode),
        gstnumber: String(vendor.gstnumber),
        landline: String(stdCode && lanNumber ? `${stdCode}${lanNumber}` : ""),
        creditdays: Number(vendor.creditdays),

        modeofpayments: [...filtered],

        paymentfrequency:
          vendor.paymentfrequency === "Please Select Payment Frequency"
            ? ""
            : String(vendor.paymentfrequency),

        bankname: filtered.includes("Bank Transfer")
          ? String(vendor.bankname)
          : "",
        bankbranchname: filtered.includes("Bank Transfer")
          ? String(vendor.bankbranchname)
          : "",
        accountholdername: filtered.includes("Bank Transfer")
          ? String(vendor.accountholdername)
          : "",
        accountnumber: filtered.includes("Bank Transfer")
          ? String(vendor.accountnumber)
          : "",
        ifsccode: filtered.includes("Bank Transfer")
          ? String(vendor.ifsccode)
          : "",

        upinumber: filtered.includes("UPI") ? String(vendor.upinumber) : "",

        cardnumber: filtered.includes("Card") ? String(vendor.cardnumber) : "",
        cardholdername: filtered.includes("Card")
          ? String(vendor.cardholdername)
          : "",
        cardtransactionnumber: filtered.includes("Card")
          ? String(vendor.cardtransactionnumber)
          : "",
        cardtype: filtered.includes("Card") ? String(vendor.cardtype) : "",
        cardmonth: filtered.includes("Card") ? String(vendor.cardmonth) : "",
        cardyear: filtered.includes("Card") ? String(vendor.cardyear) : "",
        cardsecuritycode: filtered.includes("Card")
          ? String(vendor.cardsecuritycode)
          : "",

        chequenumber: filtered.includes("Cheque")
          ? String(vendor.chequenumber)
          : "",

        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setVendorAuto("none");
      await fetchVendor();
      await fetchAutoId();
      setVendor({
        ...vendor,
        vendorname: "",
        emailid: "",
        phonenumber: "",
        phonenumberone: "",
        phonenumbertwo: "",
        phonenumberthree: "",
        phonenumberfour: "",
        whatsappnumber: "",
        contactperson: "",
        address: "",
        country: "",
        state: "",
        city: "",
        pincode: "",
        gstnumber: "",
        creditdays: "",
        bankbranchname: "",
        accountholdername: "",
        accountnumber: "",
        ifsccode: "",
        upinumber: "",
        cardnumber: "",
        cardholdername: "",
        cardtransactionnumber: "",
        cardsecuritycode: "",
        chequenumber: "",
        phonecheck: false,
      });
      setStdCode("");
      setLanNumber("");
      const country = Country.getAllCountries().find(
        (country) => country.name === "India"
      );
      const state = State.getStatesOfCountry(country?.isoCode).find(
        (state) => state.name === "Tamil Nadu"
      );
      const city = City.getCitiesOfState(
        state?.countryCode,
        state?.isoCode
      ).find((city) => city.name === "Tiruchirappalli");
      setSelectedCountryp(country);
      setSelectedStatep(state);
      setSelectedCityp(city);
      setBtnSubmit(false);
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      handleCloseviewalertvendor();
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };
  //valid email verification
  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };
  //submit option for saving
  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnSubmit(true);
    const isNameMatch = vendormaster.some(
      (item) =>
        item.vendorname.toLowerCase() === vendor.vendorname.toLowerCase() &&
        item.vendorname === vendor.vendorname
    );
    if (vendor.vendorname === "") {
      setPopupContentMalert("Please Enter Vendor Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendor.emailid === "") {
      setPopupContentMalert("Please Enter Email Id!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (!validateEmail(vendor.emailid) && vendor.emailid !== "") {
      setPopupContentMalert("Please Enter Valid Email Id!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendor.address === "") {
      setPopupContentMalert("Please Enter Address!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedCountryp?.isoCode !== selectedStatep?.countryCode) {
      setPopupContentMalert("Please Select The Correct State!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      selectedCountryp?.isoCode !== selectedCityp?.countryCode ||
      selectedStatep?.isoCode !== selectedCityp?.stateCode
    ) {
      setPopupContentMalert("Please Select The Correct City!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      vendor.paymentfrequency === "Please Select Payment Frequency" ||
      vendor.paymentfrequency === ""
    ) {
      setPopupContentMalert("Please Select Payment Frequency!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (vendor.modeofpayments === "Please Select Mode of Payments") {
      setPopupContentMalert("Please Select Mode of Payments!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Bank Transfer") &&
      vendor.bankname === "Please Select Bank Name"
    ) {
      setPopupContentMalert("Please Select Bank Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Bank Transfer") &&
      vendor.bankbranchname === ""
    ) {
      setPopupContentMalert("Please Enter Bank Branch Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Bank Transfer") &&
      vendor.accountholdername === ""
    ) {
      setPopupContentMalert("Please Enter Account Holder Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Bank Transfer") &&
      vendor.accountnumber === ""
    ) {
      setPopupContentMalert("Please Enter Account Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Bank Transfer") && vendor.ifsccode === "") {
      setPopupContentMalert("Please Enter IFSC Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("UPI") && vendor.upinumber === "") {
      setPopupContentMalert("Please Enter UPI Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardnumber === "") {
      setPopupContentMalert("Please Enter Card Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardholdername === "") {
      setPopupContentMalert("Please Enter Card Holder Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Card") &&
      vendor.cardtransactionnumber === ""
    ) {
      setPopupContentMalert("Please Enter Card Transaction Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (
      modeofpay.includes("Card") &&
      vendor.cardtype === "Please Select Card Type"
    ) {
      setPopupContentMalert("Please Select Card Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardmonth === "Month") {
      setPopupContentMalert("Please Select Expire Month!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardyear === "Year") {
      setPopupContentMalert("Please Select Expire Year!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Card") && vendor.cardsecuritycode === "") {
      setPopupContentMalert("Please Enter Card Security Code!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.includes("Cheque") && vendor.chequenumber === "") {
      setPopupContentMalert("Please Enter Cheque Number!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (modeofpay.length === 0) {
      setPopupContentMalert("Please Insert Mode of Payments!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Vendorame already exits!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };
  const handleClear = (e) => {
    e.preventDefault();
    setVendor({
      vendorname: "",
      emailid: "",
      phonenumber: "",
      phonenumberone: "",
      phonenumbertwo: "",
      phonenumberthree: "",
      phonenumberfour: "",
      whatsappnumber: "",
      contactperson: "",
      address: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      gstnumber: "",
      creditdays: "",
      bankname: "Please Select Bank Name",
      bankbranchname: "",
      accountholdername: "",
      accountnumber: "",
      ifsccode: "",
      phonecheck: false,
      modeofpayments: "Please Select Mode of Payments",
      upinumber: "",
      chequenumber: "",
      cardnumber: "",
      cardholdername: "",
      cardtransactionnumber: "",
      cardtype: "Please Select Card Type",
      cardmonth: "Month",
      cardyear: "Year",
      cardsecuritycode: "",
      paymentfrequency: "Please Select Payment Frequency",
    });
    const country = Country.getAllCountries().find(
      (country) => country.name === "India"
    );
    const state = State.getStatesOfCountry(country?.isoCode).find(
      (state) => state.name === "Tamil Nadu"
    );
    const city = City.getCitiesOfState(state?.countryCode, state?.isoCode).find(
      (city) => city.name === "Tiruchirappalli"
    );
    setSelectedCountryp(country);
    setSelectedStatep(state);
    setSelectedCityp(city);
    setStdCode("");
    setLanNumber("");
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  //editing the single data...
  //get all  vendordetails.
  const fetchVendor = async () => {
    try {
      let res_vendor = await axios.get(SERVICE.ALL_VENDORDETAILS, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setVendormaster(res_vendor?.data?.vendordetails);
      setCatCode(res_vendor?.data?.vendordetails);
    } catch (err) {
      handleApiError(err, setShowAlert, handleClickOpenerr);
    }
  };

  return (
    <Box>
      <>
        <Box sx={userStyle.dialogbox}>
          <>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                {" "}
                <Typography sx={{ fontWeight: "bold" }}>
                  Add Vendor
                </Typography>{" "}
              </Grid>
            </Grid>
            <br />
            <Grid container spacing={2}>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Vendor ID <b style={{ color: "red" }}>*</b>{" "}
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    placeholder="Please Enter Vendor Id"
                    value={autoId}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Vendor Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={vendor.vendorname}
                    placeholder="Please Enter Vendor Name"
                    onChange={(e) => {
                      setVendor({ ...vendor, vendorname: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Email ID<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="email"
                    value={vendor.emailid}
                    placeholder="Please Enter Email ID"
                    onChange={(e) => {
                      setVendor({ ...vendor, emailid: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Phone Number</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    sx={userStyle.input}
                    value={vendor.phonenumber}
                    placeholder="Please Enter Phone Number"
                    onChange={(e) => {
                      setVendor({ ...vendor, phonenumber: e.target.value });
                      handleMobile(e.target.value);
                    }}
                  />
                </FormControl>
                <Grid>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={vendor.phonecheck} />}
                      onChange={(e) =>
                        setVendor({ ...vendor, phonecheck: !vendor.phonecheck })
                      }
                      label="Same as Whats app number"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: "bold" }}>
                  Alternate Phone Number
                </Typography>
              </Grid>
              <br />
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Phone Number 1</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    sx={userStyle.input}
                    value={vendor.phonenumberone}
                    placeholder="Please Enter Phone Number 1"
                    onChange={(e) => {
                      const phoneone = handlechangephonenumber(e);
                      setVendor({ ...vendor, phonenumberone: phoneone });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Phone Number 2</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    sx={userStyle.input}
                    value={vendor.phonenumbertwo}
                    placeholder="Please Enter Phone Number 2"
                    onChange={(e) => {
                      const phonetwo = handlechangephonenumber(e);
                      setVendor({ ...vendor, phonenumbertwo: phonetwo });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Phone Number 3</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    sx={userStyle.input}
                    value={vendor.phonenumberthree}
                    placeholder="Please Enter Phone Number 3"
                    onChange={(e) => {
                      const phonethree = handlechangephonenumber(e);
                      setVendor({ ...vendor, phonenumberthree: phonethree });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>Phone Number 4</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    sx={userStyle.input}
                    value={vendor.phonenumberfour}
                    placeholder="Please Enter Phone Number 4"
                    onChange={(e) => {
                      const phonefour = handlechangephonenumber(e);
                      setVendor({ ...vendor, phonenumberfour: phonefour });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>WhatsApp Number</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    sx={userStyle.input}
                    value={vendor.whatsappnumber}
                    placeholder="Please Enter Whatsapp Number"
                    onChange={(e) => {
                      setVendor({ ...vendor, whatsappnumber: e.target.value });
                      handlewhatsapp(e.target.value);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={3} md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Address <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={5}
                    placeholder="Please Enter Address"
                    value={vendor.address}
                    onChange={(e) => {
                      setVendor({ ...vendor, address: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={3} md={4} xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <Typography>Country</Typography>
                  <Selects
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
                      setVendor((prevSupplier) => ({
                        ...prevSupplier,
                        country: item?.name || "",
                      }));
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={3} md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>State</Typography>
                  <Selects
                    options={State?.getStatesOfCountry(
                      selectedCountryp?.isoCode
                    )}
                    getOptionLabel={(options) => {
                      return options["name"];
                    }}
                    getOptionValue={(options) => {
                      return options["name"];
                    }}
                    value={selectedStatep}
                    onChange={(item) => {
                      setSelectedStatep(item);
                      setVendor((prevSupplier) => ({
                        ...prevSupplier,
                        state: item?.name || "",
                      }));
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={3} md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>City</Typography>
                  <Selects
                    options={City.getCitiesOfState(
                      selectedStatep?.countryCode,
                      selectedStatep?.isoCode
                    )}
                    getOptionLabel={(options) => {
                      return options["name"];
                    }}
                    getOptionValue={(options) => {
                      return options["name"];
                    }}
                    value={selectedCityp}
                    onChange={(item) => {
                      setSelectedCityp(item);
                      setVendor((prevSupplier) => ({
                        ...prevSupplier,
                        city: item?.name || "",
                      }));
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={3} md={4} xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <Typography>Pincode</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    placeholder="Please Enter Pincode"
                    value={vendor.pincode}
                    sx={userStyle.input}
                    onChange={(e) => {
                      handlechangecpincode(e);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>GST Number</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={vendor.gstnumber}
                    placeholder="Please Enter GST Number"
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (newValue.length <= maxLength) {
                        setVendor({ ...vendor, gstnumber: newValue });
                      }
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={3} md={4} xs={12} sm={6}>
                <Grid container>
                  <Grid item md={4} xs={6} sm={6}>
                    <FormControl size="small" fullWidth>
                      <Typography>Landline</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        value={stdCode}
                        placeholder="STD Code"
                        sx={userStyle.input}
                        onChange={(e) => {
                          handlechangestdcode(e);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={8} xs={6} sm={6}>
                    <FormControl size="small" fullWidth>
                      <Typography>&nbsp;</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        value={lanNumber}
                        placeholder="Number"
                        sx={userStyle.input}
                        onChange={(e) => {
                          setLanNumber(e.target.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={3} md={4} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>Contact Person Name</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    value={vendor.contactperson}
                    placeholder="Please Enter Contact Person Name"
                    onChange={(e) => {
                      setVendor({ ...vendor, contactperson: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={3} md={4} xs={12} sm={6}>
                <FormControl size="small" fullWidth>
                  <Typography>Credit Days</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="number"
                    value={vendor.creditdays}
                    placeholder="Please Enter Credit Days"
                    sx={userStyle.input}
                    onChange={(e) => {
                      setVendor({ ...vendor, creditdays: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Payment Frequency<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={250}
                    options={paymentfrequency}
                    placeholder="Please Choose Payment Frequency"
                    value={{
                      label: vendor.paymentfrequency,
                      value: vendor.paymentfrequency,
                    }}
                    onChange={(e) => {
                      setVendor({ ...vendor, paymentfrequency: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Mode of Payments<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    maxMenuHeight={250}
                    options={modeofpayments}
                    placeholder="Please Choose Mode Of Payments"
                    value={{
                      label: vendor.modeofpayments,
                      value: vendor.modeofpayments,
                    }}
                    onChange={(e) => {
                      setVendor({ ...vendor, modeofpayments: e.value });
                    }}
                  />
                </FormControl>
                &emsp;
                <Button
                  variant="contained"
                  color="success"
                  onClick={handlemodeofpay}
                  type="button"
                  sx={{
                    height: "30px",
                    minWidth: "30px",
                    marginTop: "28px",
                    padding: "6px 10px",
                  }}
                >
                  <FaPlus />
                </Button>
                &nbsp;
              </Grid>
            </Grid>
            {modeofpay.includes("Cash") && (
              <>
                <br />
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography sx={{ fontWeight: "bold" }}>
                        Cash <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        readOnly={true}
                        value={"Cash"}
                        onChange={(e) => {}}
                      />
                    </FormControl>
                    &nbsp; &emsp;
                    <Button
                      variant="contained"
                      color="error"
                      type="button"
                      onClick={(e) => deleteTodo("Cash")}
                      sx={{
                        height: "30px",
                        minWidth: "30px",
                        marginTop: "28px",
                        padding: "6px 10px",
                      }}
                    >
                      <AiOutlineClose />
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
            <br />
            <br />
            {modeofpay.includes("Bank Transfer") && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Bank Details
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Bank Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={accounttypes}
                        placeholder="Please Choose Bank Name"
                        value={{
                          label: vendor.bankname,
                          value: vendor.bankname,
                        }}
                        onChange={(e) => {
                          setVendor({ ...vendor, bankname: e.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Bank Branch Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendor.bankbranchname}
                        placeholder="Please Enter Bank Branch Name"
                        onChange={(e) => {
                          const inputvalue = e.target.value;
                          if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                            setVendor({
                              ...vendor,
                              bankbranchname: inputvalue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Account Holder Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendor.accountholdername}
                        placeholder="Please Enter Account Holder Name"
                        onChange={(e) => {
                          const inputvalue = e.target.value;
                          if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                            setVendor({
                              ...vendor,
                              accountholdername: inputvalue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Account Number<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        sx={userStyle.input}
                        value={vendor.accountnumber}
                        placeholder="Please Enter Account Number"
                        onChange={(e) => {
                          const inputvalue = e.target.value;
                          if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                            setVendor({ ...vendor, accountnumber: inputvalue });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        IFSC Code<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendor.ifsccode}
                        placeholder="Please Enter IFSC Code"
                        onChange={(e) => {
                          const inputvalue = e.target.value;
                          if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                            setVendor({ ...vendor, ifsccode: inputvalue });
                          }
                        }}
                      />
                    </FormControl>
                    &nbsp; &emsp;
                    <Button
                      variant="contained"
                      color="error"
                      type="button"
                      onClick={(e) => deleteTodo("Bank Transfer")}
                      sx={{
                        height: "30px",
                        minWidth: "30px",
                        marginTop: "28px",
                        padding: "6px 10px",
                      }}
                    >
                      <AiOutlineClose />
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
            <br /> <br />
            {modeofpay.includes("UPI") && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      UPI Details
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        UPI Number<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        sx={userStyle.input}
                        value={vendor.upinumber}
                        placeholder="Please Enter UPI Number"
                        onChange={(e) => {
                          const inputvalue = e.target.value;
                          if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                            setVendor({ ...vendor, upinumber: inputvalue });
                          }
                        }}
                      />
                    </FormControl>
                    &nbsp; &emsp;
                    <Button
                      variant="contained"
                      color="error"
                      type="button"
                      onClick={(e) => deleteTodo("UPI")}
                      sx={{
                        height: "30px",
                        minWidth: "30px",
                        marginTop: "28px",
                        padding: "6px 10px",
                      }}
                    >
                      <AiOutlineClose />
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
            <br /> <br />
            {modeofpay.includes("Card") && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Card Details
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Card Number<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        sx={userStyle.input}
                        value={vendor.cardnumber}
                        placeholder="Please Enter Card Number"
                        onChange={(e) => {
                          const inputvalue = e.target.value;
                          if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                            setVendor({ ...vendor, cardnumber: inputvalue });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Card Holder Name<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendor.cardholdername}
                        placeholder="Please Enter Card Holder Name"
                        onChange={(e) => {
                          const inputvalue = e.target.value;
                          if (/^$|^[a-zA-Z\s]*$/.test(inputvalue)) {
                            setVendor({
                              ...vendor,
                              cardholdername: inputvalue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Card Transaction Number<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={vendor.cardtransactionnumber}
                        placeholder="Please Enter Card Transaction Number"
                        onChange={(e) => {
                          const inputvalue = e.target.value;
                          if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                            setVendor({
                              ...vendor,
                              cardtransactionnumber: inputvalue,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Card Type<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={250}
                        options={cardtypes}
                        placeholder="Please Select Card Type"
                        value={{
                          label: vendor.cardtype,
                          value: vendor.cardtype,
                        }}
                        onChange={(e) => {
                          setVendor({ ...vendor, cardtype: e.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} xs={12} sm={6}>
                    <Typography>
                      Expire At<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item md={6} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Selects
                            maxMenuHeight={300}
                            options={monthsOption}
                            placeholder="Month"
                            id="select7"
                            value={{
                              label: vendor.cardmonth,
                              value: vendor.cardmonth,
                            }}
                            onChange={(e) => {
                              setVendor({ ...vendor, cardmonth: e.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <Selects
                            maxMenuHeight={300}
                            options={yearsOption}
                            placeholder="Year"
                            value={{
                              label: vendor.cardyear,
                              value: vendor.cardyear,
                            }}
                            id="select8"
                            onChange={(e) => {
                              setVendor({ ...vendor, cardyear: e.value });
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Security Code<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        value={vendor.cardsecuritycode}
                        sx={userStyle.input}
                        placeholder="Please Enter Security Code"
                        onChange={(e) => {
                          setVendor({
                            ...vendor,
                            cardsecuritycode: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                    &nbsp; &emsp;
                    <Button
                      variant="contained"
                      color="error"
                      type="button"
                      onClick={(e) => deleteTodo("Card")}
                      sx={{
                        height: "30px",
                        minWidth: "30px",
                        marginTop: "28px",
                        padding: "6px 10px",
                      }}
                    >
                      <AiOutlineClose />
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
            <br />
            <br />
            {modeofpay.includes("Cheque") && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography sx={{ fontWeight: "bold" }}>
                      Cheque Details
                    </Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={3} xs={12} sm={12} sx={{ display: "flex" }}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Cheque Number<b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        sx={userStyle.input}
                        value={vendor.chequenumber}
                        placeholder="Please Enter Cheque Number"
                        onChange={(e) => {
                          const inputvalue = e.target.value;
                          if (/^[a-zA-Z0-9]*$/.test(inputvalue)) {
                            setVendor({ ...vendor, chequenumber: inputvalue });
                          }
                        }}
                      />
                    </FormControl>
                    &nbsp; &emsp;
                    <Button
                      variant="contained"
                      color="error"
                      type="button"
                      onClick={(e) => deleteTodo("Cheque")}
                      sx={{
                        height: "30px",
                        minWidth: "30px",
                        marginTop: "28px",
                        padding: "6px 10px",
                      }}
                    >
                      <AiOutlineClose />
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
            <br /> <br />
            <Grid
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <LoadingButton
                  loading={btnSubmit}
                  variant="contained"
                  color="primary"
                  sx={userStyle.buttonadd}
                  onClick={handleSubmit}
                >
                  Submit
                </LoadingButton>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button sx={userStyle.btncancel} onClick={handleClear}>
                  Clear
                </Button>
              </Grid>
              <Grid item lg={1} md={2} sm={2} xs={12}>
                <Button
                  sx={userStyle.btncancel}
                  onClick={handleCloseviewalertvendor}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
        {/* // )} */}
      </>
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
    </Box>
  );
}
export default VendorPopup;