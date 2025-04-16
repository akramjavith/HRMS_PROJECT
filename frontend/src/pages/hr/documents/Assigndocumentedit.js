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

function AssiggnDocumentEdit() {

  useEffect(() => {
    fetchAllDocuments();
  }, []);

  const [moduleOptions, setModuleOptions] = useState([]);
  const fetchAllDocuments = async () => {
    try {
      let res_queue = await axios.get(SERVICE.ALL_DOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setModuleOptions(res_queue?.data.document);
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  //get all project.
  const fetchAllApproveds = async () => {
    try {
      let res_queue = await axios.get(SERVICE.ALL_ASSIGNDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
     
      return  res_queue?.data?.assigndocument?.filter((item) => item._id !== ids)
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
  const { isUserRoleAccess, isAssignBranch, allTeam, allUsersData } = useContext(UserRoleAccessContext);
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);

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

      await fetchSubCategoryType(subCategoryTypeData);fetchSubCategory(subCategoryData);

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
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };
  useEffect(() => {
    getCode();
  }, [ids]);
  //Project updateby edit page...
  let updateby = singleDocument?.updatedby;

  const [typeSubCategory, setTypeSubCategory] = useState([]);

  const fetchSubCategoryType = async (e) => {
    let employ = e.map((item) => item.value);
    try {
      let response = await axios.get(`${SERVICE.CATEGORYDOCUMENT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = response?.data?.doccategory
        .filter((data) => {
          return employ.includes(data.categoryname);
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
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const fetchTypeCategory = async () => {
    try {
      let response = await axios.get(`${SERVICE.CATEGORYDOCUMENT}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let data_set = response?.data?.doccategory.map((d) => d.categoryname);
      let filter_opt = [...new Set(data_set)];

      setTypeCategory(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchTypeCategory();
  }, []);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setsSubCategoryOptions] = useState([]);
  const OptionsType = [
    { value: "Training Document", label: "Training Document" },
    { value: "Policy Document", label: "Policy Document" },
  ];

  const fetchCategory = async () => {
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
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchSubCategory = async (e) => {
    let hel = e?.map((item) => item.value);
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
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
  };

  const sendRequest = async () => {
    let empcat = selectedOptionsCatEdit.map((item) => item.value);
    let empsub = selectedOptionsSubcatEdit.map((item) => item.value);

    let result = empsub?.length == 0 ? ["ALL"] : empsub;
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
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Updated Successfully"}
          </p>
        </>
      );
      handleClickOpenerr();
    } catch (err) {handleApiError(err, setShowAlert, handleClickOpenerr);}
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
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Type"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsCatEdit.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (selectedOptionsSubcatEdit?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select  Sub Category"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (singleDocument.module === "Please Select Module") {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Module"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (companyValueCateEdit?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Company"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (branchValueCateEdit?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Branch"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (unitValueCateEdit?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Unit"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (teamValueCateEdit?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Team"}
          </p>
        </>
      );
      handleClickOpenerr();
    } else if (employeeValueCateEdit?.length == 0) {
      setShowAlert(
        <>
          <ErrorOutlineOutlinedIcon
            sx={{ fontSize: "100px", color: "orange" }}
          />
          <p style={{ fontSize: "20px", fontWeight: 900 }}>
            {"Please Select Employee Name"}
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
            {"Data Already Exist"}
          </p>
        </>
      );
      handleClickOpenerr();
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
    setSelectedOptionsSubcatEdit(options);
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
      <Box sx={userStyle.selectcontainer}>
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
                  singleType === "Policy Document"
                    ? typeCategory
                    : categoryOptions
                }
                value={selectedOptionsCatEdit}
                onChange={(e) => {
                  handleCategoryChangeEdit(e);
                  fetchSubCategoryType(e);
                  fetchSubCategory(e);
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
                  singleDocument.type === "Policy Document"
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
          <Grid item md={4} xs={12} sm={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Company<b style={{ color: "red" }}>*</b>
              </Typography>
              <MultiSelect
                options={isAssignBranch?.map(data => ({
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
          <Grid item md={4} xs={12} sm={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Branch<b style={{ color: "red" }}>*</b>
              </Typography>
              <MultiSelect
                options={isAssignBranch?.filter(
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
          <Grid item md={4} xs={12} sm={12}>
            <FormControl fullWidth size="small">
              <Typography>
                Unit<b style={{ color: "red" }}>*</b>
              </Typography>
              <MultiSelect
                options={isAssignBranch?.filter(
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
          <Grid item md={4} xs={12} sm={12}>
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
          <Grid item md={4} xs={12} sm={12}>
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
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <br />
            <br />
            <Grid
              sx={{ display: "flex", justifyContent: "center", gap: "15px" }}
            >
              <Button variant="contained" onClick={(e) => handleSubmit(e)}>
                {" "}
                Update
              </Button>
              <Button
                sx={userStyle.btncancel}
                onClick={() => {
                  backPage("/assigndocument");
                }}
              >
                Cancel
              </Button>
            </Grid>
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
                onClick={handleCloseerr}
              >
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
}
export default AssiggnDocumentEdit;