import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  FormControl,
  Grid,
  Button,
} from "@mui/material";
import { userStyle } from "../../../pageStyle";
import { SERVICE } from "../../../services/Baseservice";
import { handleApiError } from "../../../components/Errorhandling";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import Selects from "react-select";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import Headtitle from "../../../components/Headtitle";
import AssiggnDocumentList from "./Assigndocumentlist";
import LoadingButton from "@mui/lab/LoadingButton";
import PageHeading from "../../../components/PageHeading";
import AlertDialog from "../../../components/Alert";
import MessageAlert from "../../../components/MessageAlert";


function AsiggnDocumentCreate() {
  const [btnLoad, setBtnLoad] = useState(false)
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setBtnLoad(false);
    setOpenPopupMalert(true);
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
  //company multiselect
  const [selectedOptionsCompany, setSelectedOptionsCompany] = useState([]);
  let [valueCompanyCat, setValueCompanyCat] = useState([]);
  const handleCompanyChange = (options) => {
    setValueCompanyCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCompany(options);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererCompany = (valueCompanyCat, _categoryname) => {
    return valueCompanyCat?.length
      ? valueCompanyCat.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedOptionsBranch, setSelectedOptionsBranch] = useState([]);
  let [valueBranchCat, setValueBranchCat] = useState([]);
  const handleBranchChange = (options) => {
    setValueBranchCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsBranch(options);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererBranch = (valueBranchCat, _categoryname) => {
    return valueBranchCat?.length
      ? valueBranchCat.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedOptionsUnit, setSelectedOptionsUnit] = useState([]);
  let [valueUnitCat, setValueUnitCat] = useState([]);
  const handleUnitChange = (options) => {
    setValueUnitCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsUnit(options);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererUnit = (valueUnitCat, _categoryname) => {
    return valueUnitCat?.length
      ? valueUnitCat.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //team multiselect
  const [selectedOptionsTeam, setSelectedOptionsTeam] = useState([]);
  let [valueTeamCat, setValueTeamCat] = useState([]);
  const handleTeamChange = (options) => {
    setValueTeamCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsTeam(options);
    setValueEmployeeCat([]);
    setSelectedOptionsEmployee([]);
  };

  const customValueRendererTeam = (valueTeamCat, _categoryname) => {
    return valueTeamCat?.length
      ? valueTeamCat.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //employee multiselect
  const [selectedOptionsEmployee, setSelectedOptionsEmployee] = useState([]);
  const [valueEmployeeCat, setValueEmployeeCat] = useState([]);
  const [employeeDbId, setEmployeeDbId] = useState([]);

  const handleEmployeeChange = (options) => {
    setValueEmployeeCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setEmployeeDbId(
      options.map((a, index) => {
        return a._id;
      })
    );
    setSelectedOptionsEmployee(options);
  };
  const customValueRendererEmployee = (valueEmployeeCate, _employeename) => {
    return valueEmployeeCate.length
      ? valueEmployeeCate.map(({ label }) => label).join(", ")
      : "Please Select Employee Name";
  };
  const [newDocuments, setNewDocuments] = useState({
    categoryname: {
      label: "Please Select Category  Name",
      value: "Please Select Category  Name",
    },
    subcategoryname: {
      label: "Please  Select SubCategory Name",
      value: "Please  Select SubCategory Name",
    },
    type: { label: "Please Select Type", value: "Please Select Type" },
    module: "Please Select Module",
    customer: {
      label: "Please Select Customer",
      value: "Please Select Customer",
    },
    queue: { label: "Please Select Queue", value: "Please Select Queue" },
    process: { label: "Please Select Process", value: "Please Select Process" },
    form: "",
  });
  const [vendorAuto, setVendorAuto] = useState("");
  const { auth } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState();
  const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, allTeam, allUsersData, pageName,
    setPageName,
    buttonStyles, } = useContext(UserRoleAccessContext);
  const accessbranch = isUserRoleAccess?.role?.includes("Manager")
    ? isAssignBranch?.map((data) => ({
      branch: data.branch,
      company: data.company,
      unit: data.unit,
    }))
    : isAssignBranch
      ?.filter((data) => {
        let fetfinalurl = [];

        if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.subpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.submodulenameurl;
        } else if (data?.modulenameurl?.length !== 0) {
          fetfinalurl = data.modulenameurl;
        } else {
          fetfinalurl = [];
        }

        const remove = [
          window.location.pathname?.substring(1),
          window.location.pathname,
        ];
        return fetfinalurl?.some((item) => remove?.includes(item));
      })
      ?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }));

  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
    setBtnLoad(false)
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setsSubCategoryOptions] = useState([]);
  const [OptionsType, setOptionsType] = useState([]);

  useEffect(
    () => {
      fetchTypemaster();
    }, []
  )
  //get all Sub vendormasters.
  const fetchTypemaster = async () => {
    setPageName(!pageName);
    try {
      let res_vendor = await axios.get(SERVICE.TYPEMASTERDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const resval = [{ value: "Quickclaim Document", label: "Quickclaim Document" },
      ...res_vendor?.data?.typemasterdouments.map((d) => (
        {
          ...d,
          label: d.name,
          value: d.name
        }
      ))]
      setOptionsType(resval);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const [moduleOptions, setModuleOptions] = useState([]);
  useEffect(() => {
    getapi();
  }, []);

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer ${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String("Documents/Add Assign Document"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),
      addedby: [
        {
          name: String(isUserRoleAccess?.companyname),
          date: String(new Date()),
        },
      ],
    });
  };
  const fetchAllDocuments = async (subcat) => {
    setPageName(!pageName);
    try {
      let res_queue = await axios.post(SERVICE.TYPEFILTERDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        type: newDocuments.type.value,
        categoryname: valueCat,
        subcategoryname: subcat,
      });
      setModuleOptions(res_queue?.data?.document);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  const fetchCategory = async () => {
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.CATEGORYEXCEL}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = response.data.categoryexcel.map((d) => d.name);
      let filter_opt = [...new Set(data_set)];

      setCategoryOptions(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const [typeSubCategory, setTypeSubCategory] = useState([]);

  const fetchSubCategory = async (e) => {
    let employ = e.map((item) => item.value);
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.SUBCATEGORYEXCEL}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = response?.data?.subcategoryexcel
        .filter((data) => {
          return employ.includes(data.categoryname);
        })
        .map((value) => value.name);

      const subcatall = [
        { label: "ALL", value: "ALL" },
        ...data_set.map((d) => ({
          ...d,
          label: d,
          value: d,
        })),
      ];
      const uniqueArray = subcatall.filter((item, index, self) => {
        return (
          self.findIndex(
            (i) => i.label === item.label && i.value === item.value
          ) === index
        );
      });

      setsSubCategoryOptions(uniqueArray);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const fetchSubCategoryType = async (e) => {
    let employ = e.map((item) => item.value);
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.CATEGORYDOCUMENT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = response?.data?.doccategory
        .filter((data) => {
          return data?.typemastername?.includes(newDocuments?.type?.label) && employ.includes(data.categoryname);
        })
        .map((value) => value.subcategoryname)
        .flat();

      const subcatall = [
        { label: "ALL", value: "ALL" },
        ...data_set.map((d) => ({
          ...d,
          label: d,
          value: d,
        })),
      ];
      const uniqueArray = subcatall.filter((item, index, self) => {
        return (
          self.findIndex(
            (i) => i.label === item.label && i.value === item.value
          ) === index
        );
      });

      setTypeSubCategory(uniqueArray);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const [typeCategory, setTypeCategory] = useState([]);

  const fetchTypeCategory = async (typevalue) => {
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.CATEGORYDOCUMENT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      const resfilter = response?.data?.doccategory?.filter((data, index) => {
        return data?.typemastername?.includes(typevalue)
      })
      let data_set = resfilter.map((d) => d.categoryname);
      let filter_opt = [...new Set(data_set)];

      setTypeCategory(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const handleClear = () => {
    setNewDocuments({
      ...newDocuments,
      categoryname: {
        label: "Please Select Category  Name",
        value: "Please Select Category  Name",
      },
      subcategoryname: {
        label: "Please Select SubCategory Name",
        value: "Please Select SubCategory Name",
      },
      type: { label: "Please Select Type", value: "Please Select Type" },
      module: "Please Select Module",
      customer: {
        label: "Please Select Customer",
        value: "Please Select Customer",
      },
      queue: { label: "Please Select Queue", value: "Please Select Queue" },
      process: {
        label: "Please Select Process",
        value: "Please Select Process",
      },
      form: "",
    });

    setValueCompanyCat([]);
    setSelectedOptionsCompany([]);
    setValueBranchCat([]);
    setSelectedOptionsBranch([]);
    setValueUnitCat([]);
    setSelectedOptionsUnit([]);
    setValueTeamCat([]);
    setSelectedOptionsTeam([]);
    setSelectedOptionsEmployee([]);
    setValueEmployeeCat([]);
    setEmployeeDbId([]);
    setTypeSubCategory([])
    setSelectedOptionsCat([]);
    setSelectedOptionsSubcat([]);
    setsSubCategoryOptions([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

  const [documentsList, setDocumentsList] = useState([]);

  //get all project.
  const fetchAllApproveds = async () => {
    setPageName(!pageName);
    try {
      let res_queue = await axios.get(SERVICE.ALL_ASSIGNDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setDocumentsList(res_queue?.data.assigndocument);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  useEffect(() => {
    fetchAllApproveds();
  }, []);

  const sendRequest = async () => {
    setBtnLoad(true)
    let empsub = selectedOptionsSubcat.map((item) => item.value);
    setVendorAuto("ABCD");
    setPageName(!pageName);
    try {
      await axios.post(`${SERVICE.ASSIGNDOCUMENT_CREATE}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        categoryname: [...valueCat],
        subcategoryname: [...valueSubcat],
        type: String(newDocuments.type.value),
        module: String(newDocuments.module),
        company: [...valueCompanyCat],
        branch: [...valueBranchCat],
        unit: [...valueUnitCat],
        team: [...valueTeamCat],
        employeename: [...valueEmployeeCat],
        employeedbid: employeeDbId,
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setVendorAuto("EFGH");
      setNewDocuments({
        ...newDocuments,
      });
      await fetchAllApproveds();
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setBtnLoad(false)
    } catch (err) { setBtnLoad(false); handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let catopt = selectedOptionsCat.map((item) => item.value);
    let subcatopt = selectedOptionsSubcat.map((item) => item.value);
    let compopt = selectedOptionsCompany.map((item) => item.value);
    let branchopt = selectedOptionsBranch.map((item) => item.value);
    let unitopt = selectedOptionsUnit.map((item) => item.value);
    let teamopt = selectedOptionsTeam.map((item) => item.value);
    let empopt = selectedOptionsEmployee.map((item) => item.value);
    const isNameMatch = documentsList.some(
      (item) =>
        item.type === newDocuments?.type?.value &&
        item.categoryname.some((data) => catopt.includes(data)) &&
        item.subcategoryname.some((data) => subcatopt.includes(data)) &&
        item.module === newDocuments?.module &&
        item.company.some((data) => compopt.includes(data)) &&
        item.branch.some((data) => branchopt.includes(data)) &&
        item.unit.some((data) => unitopt.includes(data)) &&
        item.team.some((data) => teamopt.includes(data)) &&
        item.employeename.some((data) => empopt.includes(data))
    );
    if (newDocuments?.type?.value === "Please Select Type") {
      setPopupContentMalert("Please Select Type!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCat.length == 0) {
      setPopupContentMalert("Please Select Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsSubcat?.length == 0) {
      setPopupContentMalert("Please Select  Sub Category!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (newDocuments.module === "Please Select Module") {
      setPopupContentMalert("Please Select Module!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueCompanyCat?.length == 0) {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueBranchCat?.length == 0) {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueUnitCat?.length == 0) {
      setPopupContentMalert("Please Select Unit!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueTeamCat?.length == 0) {
      setPopupContentMalert("Please Select Team!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (valueEmployeeCat?.length == 0) {
      setPopupContentMalert("Please Select Employee Name!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data Already Exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  // Categoryname multiselect
  const [selectedOptionsCat, setSelectedOptionsCat] = useState([]);
  let [valueCat, setValueCat] = useState([]);

  const handleCategoryChange = (options) => {
    setValueCat(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCat(options);
  };

  const customValueRendererCat = (valueCat, _categoryname) => {
    return valueCat.length
      ? valueCat.map(({ label }) => label).join(", ")
      : "Please Select Category Name";
  };

  // Subcatgeoryname multiselect
  const [selectedOptionsSubcat, setSelectedOptionsSubcat] = useState([]);
  let [valueSubcat, setValueSubcat] = useState(["ALL"]);

  const handleSubcategoryChange = (options) => {
    setValueSubcat(
      options.map((a, index) => {
        return a.value;
      })
    );
    const ans = options.map((a, index) => {
      return a.value;
    })
    setSelectedOptionsSubcat(options);
    fetchAllDocuments(ans);
    setNewDocuments({
      ...newDocuments,
      module: "Please Select Module",
    });
  };

  const customValueRendererSubcat = (valueSubcat, _subcategoryname) => {
    return valueSubcat.length
      ? valueSubcat.map(({ label }) => label).join(", ")
      : "Please  Select SubCategory Name";
  };

  return (
    <Box>
      <Headtitle title={"ASSIGN DOCUMENTS"} />
      <PageHeading
        title="Assign Document"
        modulename="Documents"
        submodulename="Assign Document"
        mainpagename=""
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("aassigndocument") && (
        <>
          <Box sx={userStyle.selectcontainer}>

            <Grid container spacing={2}>
              <Grid md={11} item xs={8}>
                <Typography sx={userStyle.HeaderText}>
                  Add Assign Document
                </Typography>
              </Grid>

              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Type<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    id="component-outlined"
                    type="text"
                    placeholder="Please Select Type"
                    options={OptionsType}
                    value={{
                      label: newDocuments?.type?.label,
                      value: newDocuments?.type?.value,
                    }}
                    onChange={(e) => {
                      fetchTypeCategory(e.value);
                      setNewDocuments({
                        ...newDocuments,
                        type: {
                          label: e.label,
                          value: e.value,
                        },
                        categoryname: {
                          label: "Please Select Category Name",
                          value: "Please Select Category Name",
                        },
                        module: "Please Select Module",
                      });
                      setSelectedOptionsSubcat([]);
                      setSelectedOptionsCat([]);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Category Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={
                      newDocuments.type.label !== "Quickclaim Document"
                        ? typeCategory
                        : categoryOptions
                    }
                    value={selectedOptionsCat}
                    onChange={(e) => {
                      handleCategoryChange(e);
                      newDocuments.type.label !== "Quickclaim Document" ? fetchSubCategoryType(e) : fetchSubCategory(e);
                      setSelectedOptionsSubcat([]);
                      setNewDocuments({
                        ...newDocuments,
                        module: "Please Select Module",
                      });
                    }}
                    valueRenderer={customValueRendererCat}
                    labelledBy="Please Select Category  Name"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Sub Category Name <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={
                      newDocuments.type.label !== "Quickclaim Document"
                        ? typeSubCategory
                        : subCategoryOptions
                    }
                    value={selectedOptionsSubcat}
                    onChange={handleSubcategoryChange}
                    valueRenderer={customValueRendererSubcat}
                    labelledBy="Please  Select SubCategory Name"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Module<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <Selects
                    id="component-outlined"
                    placeholder="Please Select Module"
                    options={moduleOptions
                      .filter(
                        (item) =>
                          item.type === newDocuments?.type?.value &&
                          valueCat?.some((word) =>
                            item.categoryname.includes(word)
                          ) &&
                          valueSubcat?.some((word) =>
                            item.subcategoryname.includes(word)
                          )
                      )
                      .flatMap((data) =>
                        data?.module.map((moduleItem) => ({
                          label: moduleItem,
                          value: moduleItem,
                        }))
                      ).filter((item, index, self) => {
                        return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                      })}
                    value={{
                      label: newDocuments?.module,
                      value: newDocuments?.module,
                    }}
                    onChange={(e) => {
                      setNewDocuments({
                        ...newDocuments,
                        module: e.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <br></br>
              <br></br>
              <Grid item md={12} sm={12} xs={12}>
                <Typography>
                  <b>Assign To</b>
                </Typography>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Company <b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={accessbranch?.map(data => ({
                      label: data.company,
                      value: data.company,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })}
                    value={selectedOptionsCompany}
                    onChange={(e) => {
                      handleCompanyChange(e);
                    }}
                    valueRenderer={customValueRendererCompany}
                    labelledBy="Please Select Company"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Branch<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={accessbranch?.filter(
                      (comp) =>
                        valueCompanyCat?.includes(comp.company)
                    )?.map(data => ({
                      label: data.branch,
                      value: data.branch,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })}
                    value={selectedOptionsBranch}
                    onChange={(e) => {
                      handleBranchChange(e);
                    }}
                    valueRenderer={customValueRendererBranch}
                    labelledBy="Please Select Branch"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Unit<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={accessbranch?.filter(
                      (comp) =>
                        valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch)
                    )?.map(data => ({
                      label: data.unit,
                      value: data.unit,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })}
                    value={selectedOptionsUnit}
                    onChange={(e) => {
                      handleUnitChange(e);
                    }}
                    valueRenderer={customValueRendererUnit}
                    labelledBy="Please Select Unit"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Team<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={allTeam?.filter(
                      (comp) =>
                        valueCompanyCat?.includes(comp.company) && valueBranchCat?.includes(comp.branch) && valueUnitCat?.includes(comp.unit)
                    )?.map(data => ({
                      label: data.teamname,
                      value: data.teamname,
                    })).filter((item, index, self) => {
                      return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                    })}
                    value={selectedOptionsTeam}
                    onChange={(e) => {
                      handleTeamChange(e);
                    }}
                    valueRenderer={customValueRendererTeam}
                    labelledBy="Please Select Team"
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Employee Name<b style={{ color: "red" }}>*</b>
                  </Typography>
                  <MultiSelect
                    options={allUsersData
                      ?.filter(
                        (u) =>
                          valueCompanyCat?.includes(u.company) &&
                          valueBranchCat?.includes(u.branch) &&
                          valueUnitCat?.includes(u.unit) &&
                          valueTeamCat?.includes(u.team)
                      )
                      .map((u) => ({
                        ...u,
                        label: u.companyname,
                        value: u.companyname,
                      }))}
                    value={selectedOptionsEmployee}
                    onChange={handleEmployeeChange}
                    valueRenderer={customValueRendererEmployee}
                    labelledBy="Please Select Employee Name"
                  />
                </FormControl>
              </Grid>
              <Grid item md={1} sm={2} xs={12}>
                <Typography>&nbsp;</Typography>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  sx={buttonStyles.buttonsubmit}
                  onClick={(e) => handleSubmit(e)}
                  loading={btnLoad}
                //   disabled={buttonLoad}
                >
                  Save
                </LoadingButton>
              </Grid>
              <Grid item md={1} sm={2} xs={12}>
                <Typography>&nbsp;</Typography>
                <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                  Clear
                </Button>
              </Grid>
              {/* Render the current textarea */}

            </Grid>

            <Box>
              <Dialog
                open={isErrorOpen}
                onClose={handleCloseerr}
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
                    sx={buttonStyles.buttonsubmit}
                  >
                    ok
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Box>
          <br />
          <br />
        </>
      )}

      <br />
      <AssiggnDocumentList vendorAuto={vendorAuto} />
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
    </Box>
  );
}
export default AsiggnDocumentCreate;