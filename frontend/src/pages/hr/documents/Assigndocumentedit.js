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
import axios from "axios";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import {
  UserRoleAccessContext,
  AuthContext,
} from "../../../context/Appcontext";
import { MultiSelect } from "react-multi-select-component";
import Selects from "react-select";
import "jspdf-autotable";
import { useNavigate, useParams } from "react-router-dom";
import AlertDialog from "../../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../../components/DeleteConfirmation.js";
import ExportData from "../../../components/ExportData";
import InfoPopup from "../../../components/InfoPopup.js";
import MessageAlert from "../../../components/MessageAlert";

function AssiggnDocumentEdit() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
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


  const [moduleOptions, setModuleOptions] = useState([]);
  const fetchAllDocuments = async (cat,type,subcat) => {
    setPageName(!pageName);
    try {
      let res_queue = await axios.post(SERVICE.TYPEFILTERDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        type:type,
        categoryname:cat,
        subcategoryname:subcat,
      });
      setModuleOptions(res_queue?.data?.document);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //get all project.
  const fetchAllApproveds = async () => {
    setPageName(!pageName);
    try {
      let res_queue = await axios.get(SERVICE.ALL_ASSIGNDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      return res_queue?.data?.assigndocument?.filter((item) => item._id !== ids)
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  //company multiselect
  const [selectedCompanyOptionsCateEdit, setSelectedCompanyOptionsCateEdit] =
    useState([]);
  const [companyValueCateEdit, setCompanyValueCateEdit] = useState("");

  const handleCompanyChangeEdit = (options) => {
    setCompanyValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedCompanyOptionsCateEdit(options);
    setBranchValueCateEdit([]);
    setSelectedBranchOptionsCateEdit([]);
    setUnitValueCateEdit([]);
    setSelectedUnitOptionsCateEdit([]);
    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);
    setEmployeeValueCateEdit([]);
    setSelectedEmployeeOptionsCateEdit([]);
  };
  const customValueRendererCompanyEdit = (
    companyValueCateEdit,
    _employeename
  ) => {
    return companyValueCateEdit?.length
      ? companyValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Company";
  };

  //branch multiselect
  const [selectedBranchOptionsCateEdit, setSelectedBranchOptionsCateEdit] =
    useState([]);
  const [branchValueCateEdit, setBranchValueCateEdit] = useState("");

  const handleBranchChangeEdit = (options) => {
    setBranchValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedBranchOptionsCateEdit(options);
    setUnitValueCateEdit([]);
    setSelectedUnitOptionsCateEdit([]);
    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);
    setEmployeeValueCateEdit([]);
    setSelectedEmployeeOptionsCateEdit([]);
  };
  const customValueRendererBranchEdit = (
    branchValueCateEdit,
    _employeename
  ) => {
    return branchValueCateEdit?.length
      ? branchValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Branch";
  };

  //unit multiselect
  const [selectedUnitOptionsCateEdit, setSelectedUnitOptionsCateEdit] =
    useState([]);
  const [unitValueCateEdit, setUnitValueCateEdit] = useState([]);

  const handleUnitChangeEdit = (options) => {
    setUnitValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedUnitOptionsCateEdit(options);
    setTeamValueCateEdit([]);
    setSelectedTeamOptionsCateEdit([]);
    setEmployeeValueCateEdit([]);
    setSelectedEmployeeOptionsCateEdit([]);
  };
  const customValueRendererUnitEdit = (unitValueCateEdit, _employeename) => {
    return unitValueCateEdit?.length
      ? unitValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Unit";
  };

  //team multiselect
  const [selectedTeamOptionsCateEdit, setSelectedTeamOptionsCateEdit] =
    useState([]);
  const [teamValueCateEdit, setTeamValueCateEdit] = useState("");

  const handleTeamChangeEdit = (options) => {
    setTeamValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedTeamOptionsCateEdit(options);
    setEmployeeValueCateEdit([]);
    setSelectedEmployeeOptionsCateEdit([]);
  };
  const customValueRendererTeamEdit = (teamValueCateEdit, _employeename) => {
    return teamValueCateEdit?.length
      ? teamValueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Team";
  };

  //employee multiselect
  const [selectedEmployeeOptionsCateEdit, setSelectedEmployeeOptionsCateEdit] =
    useState([]);
  const [employeeValueCateEdit, setEmployeeValueCateEdit] = useState([]);
  const [employeeDbIdEdit, setEmployeeDbIdEdit] = useState([]);

  const handleEmployeeChangeEdit = (options) => {
    setEmployeeValueCateEdit(
      options.map((a, index) => {
        return a.value;
      })
    );
    setEmployeeDbIdEdit(
      options.map((a, index) => {
        return a._id;
      })
    );
    setSelectedEmployeeOptionsCateEdit(options);
  };
  const customValueRendererEmployeeEdit = (
    employeevalueCateEdit,
    _employeename
  ) => {
    return employeevalueCateEdit.length
      ? employeevalueCateEdit.map(({ label }) => label).join(", ")
      : "Please Select Employee Name";
  };
  const [newDocuments, setNewDocuments] = useState({
    categoryname: {
      label: "Please Select Category  Name",
      value: "Please Select Category  Name",
    },
    subcategoryname: {
      label: "Please  Enter SubCategory Name",
      value: "Please  Select SubCategory Name",
    },
    type: { label: "Please  Enter Type", value: "Please  Select Type" },
    module: "Please Select Module",
    customer: {
      label: "Please Select Customer",
      value: "Please Select Customer",
    },
    queue: { label: "Please Select Queue", value: "Please Select Queue" },
    process: "",
    form: "",
  });
  const backPage = useNavigate();
  const { auth } = useContext(AuthContext);
  const { isUserRoleAccess, isAssignBranch, allTeam, allUsersData, pageName,
    setPageName,
    buttonStyles, } = useContext(UserRoleAccessContext);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
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
          data?.subsubpagenameurl?.length !== 0
        ) {
          fetfinalurl = data.subsubpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 &&
          data?.mainpagenameurl?.length !== 0 &&
          data?.subpagenameurl?.length !== 0
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
          data?.submodulenameurl?.length !== 0
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




  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  const [typeCategory, setTypeCategory] = useState([]);
  const [singleDocument, setSingleDocument] = useState({});
  const [singleType, setSingleType] = useState();

  let ids = useParams().id;

  const getCode = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.ASSIGNDOCUMENT_SINGLE}/${ids}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      // Fetch SubCategoryType
      const subCategoryTypeData = res?.data?.sassigndocument?.categoryname.map(
        (item) => ({
          label: item,
          value: item,
        })
      );

      // Fetch SubCategory
      const subCategoryData = res?.data?.sassigndocument?.categoryname.map(
        (item) => ({
          label: item,
          value: item,
        })
      );
      
      await fetchSubCategoryType(subCategoryTypeData,res?.data?.sassigndocument?.type);
       fetchSubCategory(subCategoryData);fetchTypeCategory(res?.data?.sassigndocument?.type);fetchAllDocuments(res?.data?.sassigndocument?.categoryname,res?.data?.sassigndocument?.type,res?.data?.sassigndocument?.subcategoryname)
      setSingleDocument(res?.data.sassigndocument);
      setSingleType(res?.data?.sassigndocument?.type);
      setEmployeeDbIdEdit(res?.data?.sassigndocument?.employeedbid);
      setSelectedOptionsCatEdit(
        res?.data?.sassigndocument?.categoryname.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      setSelectedOptionsSubcatEdit(
        res?.data?.sassigndocument?.subcategoryname.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );

      setCompanyValueCateEdit(res?.data?.sassigndocument?.company);
      setSelectedCompanyOptionsCateEdit([
        ...res?.data?.sassigndocument?.company.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setBranchValueCateEdit(res?.data?.sassigndocument?.branch);
      setSelectedBranchOptionsCateEdit([
        ...res?.data?.sassigndocument?.branch.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setUnitValueCateEdit(res?.data?.sassigndocument?.unit);
      setSelectedUnitOptionsCateEdit([
        ...res?.data?.sassigndocument?.unit.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
      setTeamValueCateEdit(res?.data?.sassigndocument?.team);
      setSelectedTeamOptionsCateEdit([
        ...res?.data?.sassigndocument?.team.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);

      setEmployeeValueCateEdit(res?.data?.sassigndocument.employeename);
      setSelectedEmployeeOptionsCateEdit([
        ...res?.data?.sassigndocument?.employeename.map((t) => ({
          ...t,
          label: t,
          value: t,
        })),
      ]);
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };
  useEffect(() => {
    getCode();
  }, [ids]);
  //Project updateby edit page...
  let updateby = singleDocument?.updatedby;

  const [typeSubCategory, setTypeSubCategory] = useState([]);

  const fetchSubCategoryType = async (e,type) => {
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
        return data?.typemastername?.includes(type) && employ.includes(data.categoryname);
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

  const fetchTypeCategory = async (typevalue) => {
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.CATEGORYDOCUMENT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      const resfilter = response?.data?.doccategory?.filter((data,index)=>{
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

 

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setsSubCategoryOptions] = useState([]);
 
  const [OptionsType, setOptionsType] = useState([]);

  useEffect(
    ()=>{
      fetchTypemaster();
    },[]
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

  const fetchCategory = async () => {
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.CATEGORYEXCEL}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = response?.data?.categoryexcel.map((d) => d.name);
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

  const fetchSubCategory = async (e) => {
    let hel = e?.map((item) => item.value);
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.SUBCATEGORYEXCEL}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = response?.data?.subcategoryexcel
        .filter((data) => {
          return hel?.includes(data.categoryname);
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

  const sendRequest = async () => {
    let empcat = selectedOptionsCatEdit.map((item) => item.value);
    let empsub = selectedOptionsSubcatEdit.map((item) => item.value);

    let result = empsub?.length == 0 ? ["ALL"] : empsub;
    setPageName(!pageName);
    try {
      let response = await axios.put(
        `${SERVICE.ASSIGNDOCUMENT_SINGLE}/${ids}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          categoryname: [...empcat],
          subcategoryname: [...result],
          type: String(singleDocument.type),
          module: String(singleDocument.module),

          company: [...companyValueCateEdit],
          branch: [...branchValueCateEdit],
          unit: [...unitValueCateEdit],
          team: [...teamValueCateEdit],
          employeename: [...employeeValueCateEdit],
          employeedbid: employeeDbIdEdit,
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      setNewDocuments({
        ...newDocuments,
        categoryname: {
          label: "Please Select Category  Name",
          value: "Please Select Category  Name",
        },
        subcategoryname: {
          label: "Please  Enter SubCategory Name",
          value: "Please  Select SubCategory Name",
        },
        type: { label: "Please  Enter Type", value: "Please  Select Type" },
        module: "Please Select Module",
        customer: {
          label: "Please Select Customer",
          value: "Please Select Customer",
        },
        queue: { label: "Please Select Queue", value: "Please Select Queue" },
        process: "",
        form: "",
      });
      backPage("/assigndocument");
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      // handleClickOpenerr();
    } catch (err) { handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let resdata = await fetchAllApproveds();
    let catopt = selectedOptionsCatEdit.map((item) => item.value);
    let subcatopt = selectedOptionsSubcatEdit.map((item) => item.value);

    let compopt = selectedCompanyOptionsCateEdit.map((item) => item.value);
    let branchopt = selectedBranchOptionsCateEdit.map((item) => item.value);
    let unitopt = selectedUnitOptionsCateEdit.map((item) => item.value);
    let teamopt = selectedTeamOptionsCateEdit.map((item) => item.value);
    let empopt = selectedEmployeeOptionsCateEdit.map((item) => item.value);
    const isNameMatch = resdata.some(
      (item) =>
        item.type === singleDocument?.type &&
        item.categoryname.some((data) => catopt.includes(data)) &&
        item.subcategoryname.some((data) => subcatopt.includes(data)) &&
        item.module === singleDocument?.module &&
        item.company.some((data) => compopt.includes(data)) &&
        item.branch.some((data) => branchopt.includes(data)) &&
        item.unit.some((data) => unitopt.includes(data)) &&
        item.team.some((data) => teamopt.includes(data)) &&
        item.employeename.some((data) => empopt.includes(data))
    );
    if (singleDocument?.type === "Please Select Type") {
      setPopupContentMalert('Please Select Type');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCatEdit.length == 0) {
      setPopupContentMalert('Please Select Category');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsSubcatEdit?.length == 0) {
      setPopupContentMalert('Please Select Sub Category');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleDocument.module === "Please Select Module") {
      setPopupContentMalert('Please Select Module');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (companyValueCateEdit?.length == 0) {
      setPopupContentMalert('Please Select Company');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (branchValueCateEdit?.length == 0) {
      setPopupContentMalert('Please Select Branch');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (unitValueCateEdit?.length == 0) {
      setPopupContentMalert('Please Select Unit');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (teamValueCateEdit?.length == 0) {
      setPopupContentMalert('Please Select Team');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (employeeValueCateEdit?.length == 0) {
      setPopupContentMalert('Please Select Employee Name');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert('Data Already Exist');
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendRequest();
    }
  };

  // Edit functionlity
  // Categoryname multiselect
  const [selectedOptionsCatEdit, setSelectedOptionsCatEdit] = useState([]);

  const handleCategoryChangeEdit = (options) => {
    setSelectedOptionsCatEdit(options);
  };

  const customValueRendererCatEdit = (valueCatEdit, _categoryname) => {
    return valueCatEdit.length
      ? valueCatEdit.map(({ label }) => label).join(", ")
      : "Please Select Category  Name";
  };

  // Subcatgeoryname multiselect
  const [selectedOptionsSubcatEdit, setSelectedOptionsSubcatEdit] = useState([
    { label: "ALL", value: "ALL" },
  ]);

  const handleSubcategoryChangeEdit = (options) => {
    const ans= options.map((a, index) => {
      return a.value;
    })
    const cat = selectedOptionsCatEdit.map((item) => item.value)
    setSelectedOptionsSubcatEdit(options);
    fetchAllDocuments(cat,singleDocument.type,ans);
    setSingleDocument({
      ...singleDocument,
      module: "Please Select Module",
    });
  };

  const customValueRendererSubcatEdit = (valueSubcatEdit, _subcategoryname) => {
    return valueSubcatEdit.length
      ? valueSubcatEdit.map(({ label }) => label).join(", ")
      : "Please  Select SubCategory Name";
  };

  return (
    <Box>
      <Box sx={userStyle.dialogbox}>
        <Grid container spacing={2}>
          <Grid item md={12} sm={12} xs={12}>
            <Typography sx={userStyle.HeaderText}>
              Edit Assign Document
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
                placeholder={singleDocument?.type}
                value={{
                  label: singleDocument?.type,
                  value: singleDocument?.type,
                }}
                options={OptionsType}
                onChange={(e) => {
                 
                 fetchTypeCategory(e.value)
                 setSingleType(e.value); 
                 setSingleDocument(
                    {
                      ...singleDocument,
                      type: e.value,
                      module: "Please Select Module",
                    },
                    setSelectedOptionsCatEdit([]),
                    setSelectedOptionsSubcatEdit([]),
                  );
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
                  singleType !== "Quickclaim Document"
                    ? typeCategory
                    : categoryOptions
                }
                value={selectedOptionsCatEdit}
                onChange={(e) => {
                  singleType !== "Quickclaim Document"
                  ? fetchSubCategoryType(e,singleType)
                  :  fetchSubCategory(e);

                  handleCategoryChangeEdit(e);
                  setSelectedOptionsSubcatEdit([]);
                  setSingleDocument({
                    ...singleDocument,
                    module: "Please Select Module",
                  });
                }}
                valueRenderer={customValueRendererCatEdit}
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
                  singleDocument?.type &&
                    singleDocument.type !== "Quickclaim Document"
                    ? typeSubCategory
                    : subCategoryOptions
                }
                value={selectedOptionsSubcatEdit}
                onChange={handleSubcategoryChangeEdit}
                valueRenderer={customValueRendererSubcatEdit}
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
                      item.type === singleDocument?.type &&
                      selectedOptionsCatEdit
                        .map((item) => item.value)
                        .some((word) => item.categoryname.includes(word)) &&
                      selectedOptionsSubcatEdit
                        .map((item) => item.value)
                        .some((word) => item.subcategoryname.includes(word))
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
                  label: singleDocument?.module,
                  value: singleDocument?.module,
                }}
                onChange={(e) => {
                  setSingleDocument({
                    ...singleDocument,
                    module: e.value,
                  });
                }}
              />
            </FormControl>
          </Grid>

          <Grid item md={12} xs={12} sm={12}>
            {" "}
            <Typography>
              <b>Assign To</b>
            </Typography>
          </Grid>
          <Grid item md={3} xs={12} sm={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Company<b style={{ color: "red" }}>*</b>
              </Typography>
              <MultiSelect
                options={accessbranch?.map(data => ({
                  label: data.company,
                  value: data.company,
                })).filter((item, index, self) => {
                  return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                })}
                value={selectedCompanyOptionsCateEdit}
                onChange={handleCompanyChangeEdit}
                valueRenderer={customValueRendererCompanyEdit}
                labelledBy="Please Select Company"
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12} sm={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Branch<b style={{ color: "red" }}>*</b>
              </Typography>
              <MultiSelect
                options={accessbranch?.filter(
                  (comp) =>
                    companyValueCateEdit?.includes(comp.company)
                )?.map(data => ({
                  label: data.branch,
                  value: data.branch,
                })).filter((item, index, self) => {
                  return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                })}
                value={selectedBranchOptionsCateEdit}
                onChange={handleBranchChangeEdit}
                valueRenderer={customValueRendererBranchEdit}
                labelledBy="Please Select Branch"
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12} sm={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Unit<b style={{ color: "red" }}>*</b>
              </Typography>
              <MultiSelect
                options={accessbranch?.filter(
                  (comp) =>
                    companyValueCateEdit?.includes(comp.company) && branchValueCateEdit?.includes(comp.branch)
                )?.map(data => ({
                  label: data.unit,
                  value: data.unit,
                })).filter((item, index, self) => {
                  return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                })}
                value={selectedUnitOptionsCateEdit}
                onChange={handleUnitChangeEdit}
                valueRenderer={customValueRendererUnitEdit}
                labelledBy="Please Select Unit"
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12} sm={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Team<b style={{ color: "red" }}>*</b>
              </Typography>
              <MultiSelect
                options={allTeam?.filter(
                  (comp) =>
                    companyValueCateEdit?.includes(comp.company) && branchValueCateEdit?.includes(comp.branch) && unitValueCateEdit?.includes(comp.unit)
                )?.map(data => ({
                  label: data.teamname,
                  value: data.teamname,
                })).filter((item, index, self) => {
                  return self.findIndex((i) => i.label === item.label && i.value === item.value) === index;
                })}
                value={selectedTeamOptionsCateEdit}
                onChange={handleTeamChangeEdit}
                valueRenderer={customValueRendererTeamEdit}
                labelledBy="Please Select Team"
              />
            </FormControl>
          </Grid>
          <Grid item md={3} xs={12} sm={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Employee Name<b style={{ color: "red" }}>*</b>
              </Typography>
              <MultiSelect
                options={allUsersData
                  ?.filter(
                    (u) =>
                      companyValueCateEdit?.includes(u.company) &&
                      branchValueCateEdit?.includes(u.branch) &&
                      unitValueCateEdit?.includes(u.unit) &&
                      teamValueCateEdit?.includes(u.team)
                  ).map((u) => ({
                    ...u,
                    label: u.companyname,
                    value: u.companyname,
                  }))}
                value={selectedEmployeeOptionsCateEdit}
                onChange={handleEmployeeChangeEdit}
                valueRenderer={customValueRendererEmployeeEdit}
                labelledBy="Please Select Employee Name"
              />
            </FormControl>
            <br />
            <br />
          </Grid>
          <Grid item md={1} sm={2} xs={12}>
            <Typography>&nbsp;</Typography>
            <Button sx={buttonStyles.buttonsubmit} variant="contained" onClick={(e) => handleSubmit(e)}>
              {" "}
              Update
            </Button>
          </Grid>
          <Grid item md={1} sm={2} xs={12}>
            <Typography>&nbsp;</Typography>
            <Button
              sx={buttonStyles.btncancel}
              onClick={() => {
                backPage("/assigndocument");
              }}
            >
              Cancel
            </Button>
          </Grid>

        </Grid>
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
                sx={buttonStyles.buttonsubmit}
                onClick={handleCloseerr}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
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
export default AssiggnDocumentEdit;