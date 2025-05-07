import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import ImageIcon from "@mui/icons-material/Image";
import LastPageIcon from "@mui/icons-material/LastPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/system";
import axios from "axios";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import "jspdf-autotable";
import React, { useContext, useEffect, useRef, useState } from "react";
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { ThreeDots } from "react-loader-spinner";
import { MultiSelect } from "react-multi-select-component";
import Resizable from "react-resizable";
import Selects from "react-select";
import { useReactToPrint } from "react-to-print";
import AlertDialog from "../../components/Alert";
import {
  DeleteConfirmation,
  PleaseSelectRow,
} from "../../components/DeleteConfirmation.js";
import { handleApiError } from "../../components/Errorhandling";
import ExportData from "../../components/ExportData";
import Headtitle from "../../components/Headtitle";
import MessageAlert from "../../components/MessageAlert";
import PageHeading from "../../components/PageHeading";
import { StyledTableCell } from "../../components/Table";
import StyledDataGrid from "../../components/TableStyle";
import { AuthContext, UserRoleAccessContext } from "../../context/Appcontext";
import { userStyle } from "../../pageStyle";
import { SERVICE } from "../../services/Baseservice";
function Manpower() {
  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState("");
  const [popupSeverityMalert, setPopupSeverityMalert] = useState("");
  const handleClickOpenPopupMalert = () => {
    setIsBtn(false);
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

  let exportColumnNames = ["Company", "Branch", "Floor", "Area", "No.of.Seats"];
  let exportRowValues = ["company", "branch", "floor", "area", "seatcount"];

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

  const [allManpower, setAllManpower] = useState([]);
  const [addManpower, setAddManpower] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    floor: "Please Select Floor",
    seatcount: "",
    area: "",
  });
  const {
    isUserRoleAccess,
    isUserRoleCompare,
    isAssignBranch,
    pageName,
    setPageName,
    buttonStyles,
  } = useContext(UserRoleAccessContext);
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
          data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
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
          data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
        ) {
          fetfinalurl = data.mainpagenameurl;
        } else if (
          data?.modulenameurl?.length !== 0 &&
          data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)
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
      pagename: String("Man Power"),
      commonid: String(isUserRoleAccess?._id),
      date: String(new Date()),

      addedby: [
        {
          name: String(isUserRoleAccess?.username),
          date: String(new Date()),
        },
      ],
    });
  };
  const username = isUserRoleAccess.username;
  const [floorOptions, setFloorOptions] = useState([]);
  const [singleManpower, setSingleManpower] = useState({
    company: "Please Select Company",
    branch: "Please Select Branch",
    floor: "Please Select Floor",
    seatcount: "",
    area: "",
  });
  const [EditPopUp, setEditPopUp] = useState(false);
  const [matchId, setMatchId] = useState([]);
  const [areas, setAreas] = useState([]);
  const [areasEdit, setAreasEdit] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState("");
  const [copiedData, setCopiedData] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newcheckbranch, setNewcheckBranch] = useState("Please Select Branch");

  const gridRef = useRef(null);
  const [isBtn, setIsBtn] = useState(false);

  //image
  const handleCaptureImage = () => {
    if (gridRef.current) {
      html2canvas(gridRef.current).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, "Man Power.png");
        });
      });
    }
  };

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };

  const [selectedOptionsCate, setSelectedOptionsCate] = useState([]);
  let [valueCate, setValueCate] = useState("");

  const handleCategoryChange = (options) => {
    setValueCate(
      options.map((a, index) => {
        return a.value;
      })
    );
    setSelectedOptionsCate(options);
  };

  const customValueRendererCate = (valueCate, _area) => {
    return valueCate.length
      ? valueCate.map(({ label }) => label).join(", ")
      : "Please Select Area";
  };

  // Edit functionlity
  const [selectedOptionsCateEdit, setSelectedOptionsCateEdit] = useState([]);

  const handleCategoryChangeEdit = (options) => {
    setSelectedOptionsCateEdit(options);
  };

  const customValueRendererCateEdit = (valueCateEdit, _area) => {
    return valueCateEdit.length
      ? valueCateEdit.map(({ label }) => label)?.join(", ")
      : "Please Select Area";
  };

  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { auth } = useContext(AuthContext);
  const [isCompany, setIsCompany] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const deleteOpenPop = () => {
    setDeleteOpen(true);
  };

  const deleteOpenClose = () => {
    setDeleteOpen(false);
  };

  // Delete model
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleClickOpen = () => {
    setIsDeleteOpen(true);
  };

  const handleCloseMod = () => {
    setIsDeleteOpen(false);
  };

  const handleEditOpen = () => {
    setEditPopUp(true);
  };

  const handleEditClose = () => {
    setEditPopUp(false);
  };

  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);

  const handleClickOpenalert = () => {
    if (selectedRows.length === 0) {
      setIsDeleteOpenalert(true);
    } else {
      setIsDeleteOpencheckbox(true);
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

  // Styles for the resizable column
  const ResizableColumn = styled(Resizable)`
    .react-resizable-handle {
      width: 10px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      cursor: col-resize;
    }
  `;

  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return "custom-id-row"; // This is the custom class for rows with item.tat === 'ago'
    }
    return ""; // Return an empty string for other rows
  };

  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    floor: true,
    area: true,
    seatcount: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    initialColumnVisibility
  );

  // get Manpower
  const fetchManpower = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.MANPOWER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let ans = res.data.manpowers?.filter((item) =>
        accessbranch.some(
          (branch) =>
            branch.company === item.company &&
            branch.branch === item.branch
        )
      );
      setAllManpower(ans);

      setIsCompany(true);
    } catch (err) {
      setIsCompany(true);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchManpowerName = async () => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.MANPOWER, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setMatchId(
        res?.data?.manpowers?.filter((item) => item._id !== singleManpower._id)
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  useEffect(() => {
    fetchManpower();
  }, []);

  useEffect(() => {
    fetchManpowerName();
  }, [EditPopUp, singleManpower]);

  let updateby = singleManpower?.updatedby;

  const sendEditRequest = async () => {
    let employ = selectedOptionsCateEdit.map((item) => item.value);
    setPageName(!pageName);
    try {
      let res = await axios.put(
        `${SERVICE.MANPOWER_SINGLE}/${singleManpower?._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          company: String(singleManpower.company),
          branch: String(singleManpower.branch),
          floor: String(singleManpower.floor),
          area: [...employ],
          seatcount: Number(singleManpower.seatcount),
          updatedby: [
            ...updateby,
            {
              name: String(isUserRoleAccess.companyname),
              date: String(new Date()),
            },
          ],
        }
      );
      setSingleManpower({});
      await fetchManpower();
      await fetchManpowerName();
      setEditPopUp(false);
      setPopupContent("Updated Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchFloor = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.FLOOR, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let floorData = [];
      let response = res.data.floors?.filter((data) => {
        if (e.value == data.branch) {
          floorData.push(data.name);
        }
      });
      setFloorOptions(
        floorData.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchArea = async (e) => {
    setPageName(!pageName);
    try {
      let res_type = await axios.get(SERVICE.AREAGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res_type.data.areagroupings
        .filter(
          (d) =>
            d.branch === newcheckbranch && d.floor === e && d.boardingareastatus
        )
        .map((data) => data.area);
      let ji = [].concat(...result);
      let jiii = ji.map((data) => data);

      const all = ji.map((d) => ({
        ...d,
        label: d,
        value: d,
      }));

      setAreas(all);
      // setAreasEdit(all);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const fetchAreaEdit = async (branch, floor) => {
    setPageName(!pageName);
    try {
      let res_type = await axios.get(SERVICE.AREAGROUPING, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let result = res_type.data.areagroupings
        .filter(
          (d) =>
            d.branch === branch && d.floor === floor && d.boardingareastatus
        )
        .map((data) => data.area);
      let ji = [].concat(...result);
      let jiii = ji.map((data) => data);

      const all = ji.map((d) => ({
        ...d,
        label: d,
        value: d,
      }));

      setAreasEdit(all);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  // Excel
  const fileName = "Man Power";

  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };

  //set function to get particular row
  const rowData = async (id, btnaction) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(`${SERVICE.MANPOWER_SINGLE}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      setSingleManpower(res.data.smanpower);
      fetchAreaEdit(res?.data?.smanpower.branch, res.data.smanpower.floor);
      setNewcheckBranch(res?.data?.smanpower?.branch);
      setSelectedOptionsCateEdit(
        res?.data?.smanpower.area.map((item) => ({
          ...item,
          label: item,
          value: item,
        }))
      );
      let resfloor = await axios.get(SERVICE.FLOOR, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      let floorData = [];
      let response = resfloor.data.floors?.map((data) => {
        if (res.data.smanpower.branch == data.branch) {
          floorData.push(data.name);
        }
      });
      setFloorOptions(
        floorData.map((d) => ({
          ...d,
          label: d,
          value: d,
        }))
      );

      if (btnaction === "edit") {
        handleEditOpen();
      } else {
        deleteOpenPop();
      }

    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const delManpower = async () => {
    setPageName(!pageName);
    try {
      await axios.delete(`${SERVICE.MANPOWER_SINGLE}/${singleManpower._id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      await fetchManpower();
      handleCloseMod();
      setSelectedRows([]);
      setPage(1);
      deleteOpenClose();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const delManpowercheckbox = async () => {
    setPageName(!pageName);
    try {
      const deletePromises = selectedRows?.map((item) => {
        return axios.delete(`${SERVICE.MANPOWER_SINGLE}/${item}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        });
      });

      // Wait for all delete requests to complete
      await Promise.all(deletePromises);

      handleCloseModcheckbox();
      setSelectedRows([]);
      setSelectAllChecked(false);
      setPage(1);

      await fetchManpower();
      setPopupContent("Deleted Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  //print...
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Man Power",
    pageStyle: "print",
  });

  const sendRequest = async () => {
    setIsBtn(true);
    setPageName(!pageName);
    try {
      let response = await axios.post(SERVICE.MANPOWER_CREATE, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        company: String(addManpower.company),
        branch: String(addManpower.branch),
        floor: String(addManpower.floor),
        area: [...valueCate],
        seatcount: Number(addManpower.seatcount),
        addedby: [
          {
            name: String(isUserRoleAccess.companyname),
            date: String(new Date()),
          },
        ],
      });
      setAddManpower({ ...addManpower, seatcount: "" });
      await fetchManpower();
      setPopupContent("Added Successfully");
      setPopupSeverity("success");
      handleClickOpenPopup();
      setIsBtn(false);
    } catch (err) {
      setIsBtn(false);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  const handleSubmit = (e) => {
    let areas = selectedOptionsCate.map((item) => item.value);
    const isNameMatch = allManpower.some(
      (item) =>
        item.company === addManpower.company &&
        item.branch === addManpower.branch &&
        item.floor === addManpower.floor &&
        item.area.some((data) => areas.includes(data))
    );
    e.preventDefault();
    fetchManpower();

    if (addManpower.company == "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (addManpower.branch == "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (addManpower.floor == "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCate.length == 0) {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (addManpower.seatcount == "") {
      setPopupContentMalert("Please Enter No.of Seats!");
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

  const handleSubmitEdit = () => {
    fetchManpowerName();
    let areasEditt = selectedOptionsCateEdit.map((item) => item.value);
    const isNameMatch = matchId.some(
      (item) =>
        item.company === singleManpower.company &&
        item.branch === singleManpower.branch &&
        item.floor === singleManpower.floor &&
        item.area.some((data) => areasEditt.includes(data))
    );

    if (singleManpower.company == "Please Select Company") {
      setPopupContentMalert("Please Select Company!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleManpower.branch == "Please Select Branch") {
      setPopupContentMalert("Please Select Branch!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleManpower.floor == "Please Select Floor") {
      setPopupContentMalert("Please Select Floor!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (selectedOptionsCateEdit.length == 0) {
      setPopupContentMalert("Please Select Area!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (singleManpower.seatcount == "") {
      setPopupContentMalert("Please Enter No.of Seats!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else if (isNameMatch) {
      setPopupContentMalert("Data already exist!");
      setPopupSeverityMalert("info");
      handleClickOpenPopupMalert();
    } else {
      sendEditRequest();
    }
  };

  const [items, setItems] = useState([]);

  const addSerialNumber = (datas) => {
    const itemsWithSerialNumber = datas?.map((item, index) => ({
      ...item,
      serialNumber: index + 1,
      area: item?.area?.join(",")?.toString(),
    }));
    setItems(itemsWithSerialNumber);
  };

  useEffect(() => {
    addSerialNumber(allManpower);
  }, [allManpower]);

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
      renderHeader: (params) => (
        <CheckboxHeader
          selectAllChecked={selectAllChecked}
          onSelectAll={() => {
            if (rowDataTable.length === 0) {
              // Do not allow checking when there are no rows
              return;
            }
            if (selectAllChecked) {
              setSelectedRows([]);
            } else {
              const allRowIds = rowDataTable.map((row) => row.id);
              setSelectedRows(allRowIds);
            }
            setSelectAllChecked(!selectAllChecked);
          }}
        />
      ),

      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={() => {
            let updatedSelectedRows;
            if (selectedRows.includes(params.row.id)) {
              updatedSelectedRows = selectedRows.filter(
                (selectedId) => selectedId !== params.row.id
              );
            } else {
              updatedSelectedRows = [...selectedRows, params.row.id];
            }

            setSelectedRows(updatedSelectedRows);

            // Update the "Select All" checkbox based on whether all rows are selected
            setSelectAllChecked(
              updatedSelectedRows.length === filteredData.length
            );
          }}
        />
      ),
      sortable: false, // Optionally, you can make this column not sortable
      width: 90,

      hide: !columnVisibility.checkbox,
      headerClassName: "bold-header",
    },
    {
      field: "serialNumber",
      headerName: "SNo",
      flex: 0,
      width: 90,
      hide: !columnVisibility.serialNumber,
      headerClassName: "bold-header",
    },
    {
      field: "company",
      headerName: "Company",
      flex: 0,
      width: 150,
      hide: !columnVisibility.company,
      headerClassName: "bold-header",
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0,
      width: 150,
      hide: !columnVisibility.branch,
      headerClassName: "bold-header",
    },
    {
      field: "floor",
      headerName: "Floor",
      flex: 0,
      width: 150,
      hide: !columnVisibility.floor,
      headerClassName: "bold-header",
    },
    {
      field: "area",
      headerName: "Area",
      flex: 0,
      width: 250,
      hide: !columnVisibility.area,
      headerClassName: "bold-header",
    },
    {
      field: "seatcount",
      headerName: "No.of.Seats",
      flex: 0,
      width: 100,
      hide: !columnVisibility.seatcount,
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
      renderCell: (params) => (
        <Grid sx={{ display: "flex" }}>
          {isUserRoleCompare?.includes("emanpower") && (
            <Button
              sx={userStyle.buttonedit}
              onClick={() => {
                rowData(params.row.id, "edit");
              }}
            >
              <EditOutlinedIcon sx={buttonStyles.buttonedit} />
            </Button>
          )}
          {isUserRoleCompare?.includes("dmanpower") && (
            <Button
              sx={userStyle.buttondelete}
              onClick={(e) => {
                rowData(params.row.id, "delete", params.row.name);
              }}
            >
              <DeleteOutlineOutlinedIcon sx={buttonStyles.buttondelete} />
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
      company: item.company,
      branch: item.branch,
      floor: item.floor,
      area: item.area,
      seatcount: item.seatcount,
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

  const handleClear = () => {
    setAddManpower({
      company: "Please Select Company",
      branch: "Please Select Branch",
      floor: "Please Select Floor",
      seatcount: "",
      area: "",
    });
    setFloorOptions([]);
    setAreas([]);
    setSelectedOptionsCate([]);
    setPopupContent("Cleared Successfully");
    setPopupSeverity("success");
    handleClickOpenPopup();
  };

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

  return (
    <Box>
      <Headtitle title={"MANPOWER"} />
      {/* ****** Header Content ****** */}
      <PageHeading
        title="Man Power"
        modulename="Human Resources"
        submodulename="Facility"
        mainpagename="Man Power"
        subpagename=""
        subsubpagename=""
      />
      {isUserRoleCompare?.includes("amanpower") && (
        <>

          <Box sx={userStyle.dialogbox}>
            <Typography sx={userStyle.HeaderText}>
              Add Manpower
            </Typography>
            <Typography sx={userStyle.SubHeaderText}>
              Update the total seats for all floor here{" "}
            </Typography>
            <br />
            <br />
            <form>
              <Grid container spacing={3}>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Company <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={accessbranch
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
                        })}
                      onChange={(e) => {
                        setAddManpower({
                          ...addManpower,
                          company: e.value,
                          branch: "Please Select Branch",
                          floor: "Please Select Floor",
                        });
                        setFloorOptions([]);
                        setAreas([]);
                        setSelectedOptionsCate([]);
                      }}
                      value={{
                        label: addManpower.company,
                        value: addManpower.company,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Branch <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={accessbranch
                        ?.filter((comp) => addManpower.company === comp.company)
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
                        })}
                      onChange={(e) => {
                        setAddManpower({
                          ...addManpower,
                          branch: e.value,
                          floor: "Please Select Floor",
                        });
                        setNewcheckBranch(e.value);
                        fetchFloor(e);
                        setSelectedOptionsCate([]);
                        setAreas([]);
                      }}
                      value={{
                        label: addManpower.branch,
                        value: addManpower.branch,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Floor <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                      options={floorOptions}
                      value={{
                        label: addManpower.floor,
                        value: addManpower.floor,
                      }}
                      onChange={(e) => {
                        setAddManpower({ ...addManpower, floor: e.value });
                        setSelectedOptionsCate([]);
                        fetchArea(e.value);
                        setSelectedOptionsCate([]);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Area<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <MultiSelect
                      options={areas}
                      value={selectedOptionsCate}
                      onChange={handleCategoryChange}
                      valueRenderer={customValueRendererCate}
                      labelledBy="Please Select Area"
                    // className="scrollable-multiselect"
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      No.of Seats <b style={{ color: "red" }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlinedname"
                      type="text"
                      sx={userStyle.input}
                      value={addManpower.seatcount}
                      onChange={(e) => {
                        const input = e.target.value;
                        // Only allow digits (0-9) and optionally a decimal point followed by more digits
                        if (input === "" || /^\d+$/.test(input)) {
                          setAddManpower({ ...addManpower, seatcount: input });
                        }
                      }}
                      placeholder="Please Enter No.of Seats"
                    />
                  </FormControl>
                </Grid>
              </Grid>{" "}
              <br /> <br />
              <Grid container spacing={2}>
                <Grid item md={2.5} xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isBtn}
                    sx={buttonStyles.buttonsubmit}
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item md={2.5} xs={12} sm={6}>
                  <Button sx={buttonStyles.btncancel} onClick={handleClear}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
              <br />
            </form>
          </Box>

          <br />
        </>
      )}
      {isUserRoleCompare?.includes("lmanpower") && (
        <>
          <Box sx={userStyle.container}>
            {/* ******************************************************EXPORT Buttons****************************************************** */}
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>
                Manpower Details List
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
                  {isUserRoleCompare?.includes("excelmanpower") && (
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
                  {isUserRoleCompare?.includes("csvmanpower") && (
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
                  {isUserRoleCompare?.includes("printmanpower") && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handlePrint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes("pdfmanpower") && (
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
                  {isUserRoleCompare?.includes("imagemanpower") && (
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
                  <FormControl fullWidth size="small">
                    <Typography>Search</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </FormControl>
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
            {isUserRoleCompare?.includes("bdmanpower") && (
              <Button
                variant="contained"
                color="error"
                onClick={handleClickOpenalert}
                sx={buttonStyles.buttonbulkdelete}
              >
                Bulk Delete
              </Button>
            )}
            <br />
            <br />
            {!isCompany ? (
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
                <Box
                  style={{
                    width: "100%",
                    overflowY: "hidden", // Hide the y-axis scrollbar
                  }}
                >
                  <StyledDataGrid
                    onClipboardCopy={(copiedString) =>
                      setCopiedData(copiedString)
                    }
                    rows={rowsWithCheckboxes}
                    columns={columnDataTable.filter(
                      (column) => columnVisibility[column.field]
                    )}
                    onSelectionModelChange={handleSelectionChange}
                    selectionModel={selectedRows}
                    autoHeight={true}
                    ref={gridRef}
                    density="compact"
                    hideFooter
                    getRowClassName={getRowClassName}
                    disableRowSelectionOnClick
                  />
                </Box>
                <Box style={userStyle.dataTablestyle}>
                  <Box>
                    Showing{" "}
                    {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(page * pageSize, filteredDatas.length)} of{" "}
                    {filteredDatas.length} entries
                  </Box>
                  <Box>
                    <Button
                      onClick={() => setPage(1)}
                      disabled={page === 1}
                      sx={userStyle.paginationbtn}
                    >
                      <FirstPageIcon />
                    </Button>
                    <Button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      sx={userStyle.paginationbtn}
                    >
                      <NavigateBeforeIcon />
                    </Button>
                    {pageNumbers?.map((pageNumber) => (
                      <Button
                        key={pageNumber}
                        sx={userStyle.paginationbtn}
                        onClick={() => handlePageChange(pageNumber)}
                        className={page === pageNumber ? "active" : ""}
                        disabled={page === pageNumber}
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    {lastVisiblePage < totalPages && <span>...</span>}
                    <Button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      sx={userStyle.paginationbtn}
                    >
                      <NavigateNextIcon />
                    </Button>
                    <Button
                      onClick={() => setPage(totalPages)}
                      disabled={page === totalPages}
                      sx={userStyle.paginationbtn}
                    >
                      <LastPageIcon />
                    </Button>
                  </Box>
                </Box>
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

      {/* Print Layout */}

      {/* Delete Modal */}
      <Box>
        <Box>
          {/* Edit DIALOG */}
          <Dialog
            open={EditPopUp}
            onClose={handleCloseMod}
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
            <Box sx={{ padding: "20px", width: "850px" }}>
              <>
                {/* <DialogContent sx={{ width: '550px', padding: '20px' }}> */}
                <Grid container spacing={2}>
                  <Grid item md={12} xs={12} sm={12}>
                    <Typography sx={userStyle.HeaderText}>
                      Edit Manpower
                    </Typography>{" "}
                    <br />
                    <Typography sx={userStyle.SubHeaderText}>
                      Update the total seats for all floor here{" "}
                    </Typography>
                    <br />
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Company <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={accessbranch
                          ?.map((data) => ({
                            label: data.company,
                            value: data.company,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        onChange={(e) => {
                          setSingleManpower({
                            ...singleManpower,
                            company: e.value,
                            branch: "Please Select Branch",
                            floor: "Please Select Floor",
                          });
                          setFloorOptions([]);
                          setAreasEdit([]);
                          setSelectedOptionsCateEdit([]);
                        }}
                        value={{
                          label: singleManpower.company,
                          value: singleManpower.company,
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Branch <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={accessbranch
                          ?.filter(
                            (comp) => singleManpower.company === comp.company
                          )
                          ?.map((data) => ({
                            label: data.branch,
                            value: data.branch,
                          }))
                          .filter((item, index, self) => {
                            return (
                              self.findIndex(
                                (i) =>
                                  i.label === item.label &&
                                  i.value === item.value
                              ) === index
                            );
                          })}
                        onChange={(e) => {
                          setSingleManpower({
                            ...singleManpower,
                            branch: e.value,
                            floor: "Please Select Floor",
                          });
                          setNewcheckBranch(e.value);
                          fetchFloor(e);
                          setSelectedOptionsCateEdit([]);
                          setAreasEdit([]);
                        }}
                        value={{
                          label: singleManpower.branch,
                          value: singleManpower.branch,
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Floor <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <Selects
                        options={floorOptions}
                        value={{
                          label: singleManpower.floor,
                          value: singleManpower.floor,
                        }}
                        onChange={(e) => {
                          setSingleManpower({
                            ...singleManpower,
                            floor: e.value,
                          });
                          fetchAreaEdit(singleManpower.branch, e.value);
                          setSelectedOptionsCateEdit([]);
                          setAreasEdit([]);
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Area <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <MultiSelect
                        className="custom-multi-select"
                        id="component-outlined"
                        options={areasEdit}
                        value={selectedOptionsCateEdit}
                        onChange={handleCategoryChangeEdit}
                        valueRenderer={customValueRendererCateEdit}
                        labelledBy="Please Select Area"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        No.of seats <b style={{ color: "red" }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlinedname"
                        type="text"
                        placeholder="Please Enter No.of Seats"
                        sx={userStyle.input}
                        value={singleManpower.seatcount}
                        onChange={(e) => {
                          const input = e.target.value;
                          // Only allow digits (0-9) and optionally a decimal point followed by more digits
                          if (input === "" || /^\d+$/.test(input)) {
                            setSingleManpower({
                              ...singleManpower,
                              seatcount: e.target.value,
                            });
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <br />
                <br />

                <br />

                <Grid container spacing={2}>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      variant="contained"
                      onClick={handleSubmitEdit}
                      sx={buttonStyles.buttonsubmit}
                    >
                      Update
                    </Button>
                  </Grid>
                  <Grid item md={6} xs={6} sm={6}>
                    <Button
                      onClick={handleEditClose}
                      sx={buttonStyles.btncancel}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
                {/* </DialogContent> */}
              </>
            </Box>
          </Dialog>
        </Box>
      </Box>

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
        filteredDataTwo={rowDataTable ?? []}
        itemsTwo={items ?? []}
        filename={fileName}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      {/*SINGLE DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={deleteOpen}
        onClose={deleteOpenClose}
        onConfirm={delManpower}
        title="Are you sure?"
        confirmButtonText="Yes"
        cancelButtonText="Cancel"
      />
      {/*BULK DELETE ALERT DIALOG ARE YOU SURE? */}
      <DeleteConfirmation
        open={isDeleteOpencheckbox}
        onClose={handleCloseModcheckbox}
        onConfirm={delManpowercheckbox}
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
      {/* EXTERNAL COMPONENTS -------------- END */}
    </Box>
  );
}

export default Manpower;
