import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ImageIcon from '@mui/icons-material/Image';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AUTH, BASE_URL } from '../../services/Authservice';
import ExistingProfileVisitor from '../interactors/visitors/ExistingProfileVisitor';
import * as faceapi from 'face-api.js';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import {
  Backdrop,
  Box,
  Button,
  Tooltip,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  FormGroup,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Paper,
  Popover,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextareaAutosize,
  TextField,
  Typography,
} from '@mui/material';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
// import axios from 'axios';
import axios from '../../axiosInstance';
import { City, Country, State } from 'country-state-city';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import 'jspdf-autotable';
import moment from 'moment-timezone';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Cropper from 'react-cropper';
import { AiOutlineClose } from 'react-icons/ai';
import { FaFileCsv, FaFileExcel, FaFilePdf, FaPlus, FaPrint } from 'react-icons/fa';
import { ThreeDots } from 'react-loader-spinner';
import { useParams } from 'react-router-dom';
import Selects from 'react-select';
import { useReactToPrint } from 'react-to-print';
import AggregatedSearchBar from '../../components/AggregatedSearchBar';
import AggridTable from '../../components/AggridTable';
import AlertDialog from '../../components/Alert';
import { handleApiError } from '../../components/Errorhandling';
import ExportData from '../../components/ExportData';
import Headtitle from '../../components/Headtitle';
import FullAddressCard from '../../components/FullAddressCard.js';
import MessageAlert from '../../components/MessageAlert';
import PageHeading from '../../components/PageHeading';
import { StyledTableCell, StyledTableRow } from '../../components/Table';
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext';
import { userStyle } from '../../pageStyle';
import { SERVICE } from '../../services/Baseservice';

import PincodeButton from '../../components/PincodeButton.js';
import { getPincodeDetails } from '../../components/getPincodeDetails';
import { religionOptions, address_type, personal_prefix, landmark_and_positional_prefix } from '../../components/Componentkeyword';

const Loader = ({ loading, message }) => {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }} open={loading}>
      <div style={{ textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#edf1f7' }} />
        <Typography variant="h6" sx={{ mt: 2, color: '#edf1f7' }}>
          {message}
        </Typography>
      </div>
    </Backdrop>
  );
};
function MyVerification() {
  const [filteredRowData, setFilteredRowData] = useState([]);
  const [filteredChanges, setFilteredChanges] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Please Wait...!');
  const [employees, setEmployees] = useState([]);
  const { isUserRoleAccess,listPageAccessMode, isUserRoleCompare, isAssignBranch, pageName, setPageName, buttonStyles } = useContext(UserRoleAccessContext);
  const [isHandleChange, setIsHandleChange] = useState(false);

  const [openPopupMalert, setOpenPopupMalert] = useState(false);
  const [popupContentMalert, setPopupContentMalert] = useState('');
  const [popupSeverityMalert, setPopupSeverityMalert] = useState('');
  const handleClickOpenPopupMalert = () => {
    setOpenPopupMalert(true);
  };
  const handleClosePopupMalert = () => {
    setOpenPopupMalert(false);
  };
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [popupSeverity, setPopupSeverity] = useState('');
  const handleClickOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => {
    setOpenPopup(false);
  };

    let listpageaccessby =
      listPageAccessMode?.find(
        (data) =>
          data.modulename === "Setup" &&
          data.submodulename === "Team Dashboard" &&
          data.mainpagename === "" &&
          data.subpagename === "" &&
          data.subsubpagename === ""
      )?.listpageaccessmode || "Overall";

  const accessbranch = isUserRoleAccess?.role?.includes('Manager')
    ? isAssignBranch?.map((data) => ({
        branch: data.branch,
        company: data.company,
        unit: data.unit,
      }))
    : isAssignBranch
        ?.filter((data) => {
          let fetfinalurl = [];

          if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
            fetfinalurl = data.subsubpagenameurl;
          } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
            fetfinalurl = data.subpagenameurl;
          } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.mainpagenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
            fetfinalurl = data.mainpagenameurl;
          } else if (data?.modulenameurl?.length !== 0 && data?.submodulenameurl?.length !== 0 && data?.subsubpagenameurl?.includes(window.location.pathname)) {
            fetfinalurl = data.submodulenameurl;
          } else if (data?.modulenameurl?.length !== 0) {
            fetfinalurl = data.modulenameurl;
          } else {
            fetfinalurl = [];
          }

          const remove = ['/settings/templatelist', 'settings/templatelist'];
          return fetfinalurl?.some((item) => remove?.includes(item));
        })
        ?.map((data) => ({
          branch: data.branch,
          company: data.company,
          unit: data.unit,
        }));

  const gridRefTable = useRef(null);

  const [searchedString, setSearchedString] = useState('');

  const [allInformation, setAllInformation] = useState({});
  const [allInformationEdit, setAllInformationEdit] = useState({});
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [todo, setTodo] = useState([]);
  const [employeecodenew, setEmployeecodenew] = useState('');
  const [selectedCountryp, setSelectedCountryp] = useState(null);
  const [selectedStatep, setSelectedStatep] = useState(null);
  const [selectedCityp, setSelectedCityp] = useState(null);
  const [selectedCountryc, setSelectedCountryc] = useState(null);
  const [selectedStatec, setSelectedStatec] = useState(null);
  const [selectedCityc, setSelectedCityc] = useState(null);
  const [targetpts, setTargetpts] = useState('');
  const [errorsLog, setErrorsLog] = useState({});
  const [loginNotAllot, setLoginNotAllot] = useState({
    process: 'Please Select Process',
    processtype: 'Primary',
    processduration: 'Full',
    time: 'Hrs',
    timemins: 'Mins',
  });
  const [profileImg, setProfileImg] = useState('');
  const [overallgrosstotal, setoverallgrosstotal] = useState('');
  const [modeexperience, setModeexperience] = useState('');
  const [targetexperience, setTargetexperience] = useState('');
  const [primaryWorkStationInput, setPrimaryWorkStationInput] = useState('');
  const [croppedImage, setCroppedImage] = useState('');
  const [enableLoginName, setEnableLoginName] = useState(true);
  const [third, setThird] = useState('');
  const [primaryWorkStation, setPrimaryWorkStation] = useState('Please Select Primary Work Station');
  const [selectedOptionsWorkStation, setSelectedOptionsWorkStation] = useState([]);
  const [first, setFirst] = useState('');
  const [second, setSecond] = useState('');
  const [name, setUserNameEmail] = useState('');
  const [errmsg, setErrmsg] = useState('');
  const [files, setFiles] = useState([]);
  const [filesEdit, setFilesEdit] = useState([]);

  //webcam
  const [isWebcamOpen, setIsWebcamOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [getImg, setGetImg] = useState(null);
  const [refImage, setRefImage] = useState([]);
  const [previewURL, setPreviewURL] = useState(null);
  const [refImageDrag, setRefImageDrag] = useState([]);
  const [valNum, setValNum] = useState(0);
  const [isWebcamCapture, setIsWebcamCapture] = useState(false);

  useEffect(() => {
    setEmployee((prev) => ({ ...prev, profileimage: getImg }));
  }, [getImg]);
  const webcamOpen = () => {
    setIsWebcamOpen(true);
  };
  const webcamClose = () => {
    setIsWebcamOpen(false);
  };
  const closeWebCam = () => {
    setEmployee((prev) => ({ ...prev, profileimage: '', faceDescriptor: [] }));
    setGetImg(null);
  };
  const webcamDataStore = () => {
    setIsWebcamCapture(true);
    //popup close
    webcamClose();
  };

  //add webcamera popup
  const showWebcam = () => {
    webcamOpen();
  };
  // const renderFilePreview = async (file) => {
  //   const response = await fetch(file.preview);
  //   const blob = await response.blob();
  //   const url = window.URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   window.open(link, '_blank');
  // };

  const downloadFile = async (filename) => {
    try {
      const response = await axios.get(`${BASE_URL}/uploadsDocuments/${filename}`, {
        responseType: 'blob',
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([response.data]));
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the file', error);
    }
  };
  const renderFilePreview = async (file) => {
    if (file?.orginpath && file?.orginpath === 'Employee Documents') {
      const fileUrl = `${BASE_URL}/uploadsDocuments/${file.preview}`;
      window.open(fileUrl, '_blank');
    } else {
      const response = await fetch(file.preview);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      window.open(link, '_blank');
    }
  };
  let allInfo = ['Personal Information', 'Reference Details', 'Permanent Address', 'Current Address', 'Work History', 'Bank Details', 'Educational qualification', 'Additional qualification', 'Document List'];
  const handleFileUpload = (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const file = files[i];
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFilesEdit((prevFiles) => {
          // Ensure prevFiles is an array
          if (!Array.isArray(prevFiles)) {
            prevFiles = [];
          }
          return [
            ...prevFiles,
            {
              name: file.name,
              preview: reader.result,
              type: file.type, // Include the file type
              data: reader.result.split(',')[1],
              remark: fileNames === 'Please Select File Name' ? '' : fileNames,
            },
          ];
        });
      };
    }
    setfileNames('Please Select File Name');
  };
  const handleFileDelete = (index) => {
    setFilesEdit((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const handleRemarkChange = (index, remark) => {
    setFilesEdit((prevFiles) => prevFiles.map((file, i) => (i === index ? { ...file, remark } : file)));
  };
  let sno = 1;
  let snowv = 1;
  let snowe = 1;
  let snoe = 1;
  const [eduTodo, setEduTodo] = useState([]);
  const [eduTodoEdit, setEduTodoEdit] = useState([]);
  let eduno = 1;
  let edunoe = 1;
  const [addAddQuaTodo, setAddQuaTodo] = useState('');
  const [addAddQuaTodoEdit, setAddQuaTodoEdit] = useState('');
  let skno = 1;
  let sknoe = 1;
  const [workhistTodo, setWorkhistTodo] = useState('');
  const [workhistTodoEdit, setWorkhistTodoEdit] = useState('');
  useEffect(() => {
    ShowErrMess();
    setThird(first + second.slice(0, 1));
    setUserNameEmail(first + second.slice(0, 1));
  }, [first, second, name]);
  //ERROR MESSAGESE
  const ShowErrMess = () => {
    if (first.length == '' || second.length == 0) {
      setErrmsg('Unavailable');
    } else if (third.length >= 1) {
      setErrmsg('Available');
    }
  };

  const [switchValues, setSwicthValues] = useState({
    educationInstitution: false,
    additionalInstitution: false,
    workDesignation: false,
    workDuties: false,
    workReason: false,
  });
  useEffect(() => {
    fetchMasterFieldValues();
  }, []);
  const [masterFieldValues, setMasterFieldValues] = useState();
  const fetchMasterFieldValues = async () => {
    try {
      const aggregationPipeline = [
        {
          $project: {
            eduInstitutions: {
              $filter: {
                input: {
                  $map: {
                    input: { $ifNull: ['$eduTodo', []] },
                    as: 'edu',
                    in: '$$edu.institution',
                  },
                },
                as: 'item',
                cond: {
                  $and: [{ $ne: ['$$item', null] }, { $ne: ['$$item', ''] }],
                },
              },
            },
            addInstitutions: {
              $filter: {
                input: {
                  $map: {
                    input: { $ifNull: ['$addAddQuaTodo', []] },
                    as: 'add',
                    in: '$$add.addInst',
                  },
                },
                as: 'item',
                cond: {
                  $and: [{ $ne: ['$$item', null] }, { $ne: ['$$item', ''] }],
                },
              },
            },
            empNames: {
              $filter: {
                input: {
                  $map: {
                    input: { $ifNull: ['$workhistTodo', []] },
                    as: 'w',
                    in: '$$w.empNameTodo',
                  },
                },
                as: 'item',
                cond: {
                  $and: [{ $ne: ['$$item', null] }, { $ne: ['$$item', ''] }],
                },
              },
            },
            designations: {
              $filter: {
                input: {
                  $map: {
                    input: { $ifNull: ['$workhistTodo', []] },
                    as: 'w',
                    in: '$$w.desigTodo',
                  },
                },
                as: 'item',
                cond: {
                  $and: [{ $ne: ['$$item', null] }, { $ne: ['$$item', ''] }],
                },
              },
            },
            duties: {
              $filter: {
                input: {
                  $map: {
                    input: { $ifNull: ['$workhistTodo', []] },
                    as: 'w',
                    in: '$$w.dutiesTodo',
                  },
                },
                as: 'item',
                cond: {
                  $and: [{ $ne: ['$$item', null] }, { $ne: ['$$item', ''] }],
                },
              },
            },
            reasons: {
              $filter: {
                input: {
                  $map: {
                    input: { $ifNull: ['$workhistTodo', []] },
                    as: 'w',
                    in: '$$w.reasonTodo',
                  },
                },
                as: 'item',
                cond: {
                  $and: [{ $ne: ['$$item', null] }, { $ne: ['$$item', ''] }],
                },
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            eduInstitutions: { $addToSet: '$eduInstitutions' },
            addInstitutions: { $addToSet: '$addInstitutions' },
            empNames: { $addToSet: '$empNames' },
            designations: { $addToSet: '$designations' },
            duties: { $addToSet: '$duties' },
            reasons: { $addToSet: '$reasons' },
          },
        },
        {
          $project: {
            _id: 0,
            eduInstitutions: {
              $reduce: {
                input: '$eduInstitutions',
                initialValue: [],
                in: { $setUnion: ['$$value', '$$this'] },
              },
            },
            addInstitutions: {
              $reduce: {
                input: '$addInstitutions',
                initialValue: [],
                in: { $setUnion: ['$$value', '$$this'] },
              },
            },
            empNames: {
              $reduce: {
                input: '$empNames',
                initialValue: [],
                in: { $setUnion: ['$$value', '$$this'] },
              },
            },
            designations: {
              $reduce: {
                input: '$designations',
                initialValue: [],
                in: { $setUnion: ['$$value', '$$this'] },
              },
            },
            duties: {
              $reduce: {
                input: '$duties',
                initialValue: [],
                in: { $setUnion: ['$$value', '$$this'] },
              },
            },
            reasons: {
              $reduce: {
                input: '$reasons',
                initialValue: [],
                in: { $setUnion: ['$$value', '$$this'] },
              },
            },
          },
        },
      ];

      let req = await axios.post(
        SERVICE.DYNAMICUSER_CONTROLLER,
        {
          aggregationPipeline,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );
      let result = req.data.users;

      console.log(result, 'sdfsdfsd');
      setMasterFieldValues(result?.length > 0 ? result[0] : {});
    } catch (err) {
      console.log(err);
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //Edit Popups
  const currentYear = new Date().getFullYear();
  const cropperRef = useRef(null);
  const maxDate = `${currentYear - 16}-12-31`;
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [employee, setEmployee] = useState({
    profileimage: '',
    faceDescriptor: [],
    id: '',
  });
  // let final = croppedImage ? croppedImage : profileImg;
  let final = croppedImage ? croppedImage : employee.profileimage;

  const [file, setFile] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  let [valueCate, setValueCate] = useState('');
  const [roles, setRoles] = useState([]);
  const [referenceTodo, setReferenceTodo] = useState([]);
  const [referenceTodoEdit, setReferenceTodoEdit] = useState([]);
  const [referenceTodoError, setReferenceTodoError] = useState({});
  const [documentID, setDocumentID] = useState('');
  const [categorys, setCategorys] = useState([]);
  const [educationsOpt, setEducationsOpt] = useState([]);
  const [subcategorys, setSubcategorys] = useState([]);
  const [errorstodo, setErrorstodo] = useState({});
  const [addQual, setAddQual] = useState('');
  const [addInst, setAddInst] = useState('');
  const [duration, setDuration] = useState('');
  const [remarks, setRemarks] = useState('');
  const [skillSet, setSkillSet] = useState([]);
  const [empNameTodo, setEmpNameTodo] = useState('');
  const [desigTodo, setDesigTodo] = useState('');
  const [joindateTodo, setJoindateTodo] = useState('');
  const [leavedateTodo, setLeavedateTodo] = useState('');
  const [dutiesTodo, setDutiesTodo] = useState('');
  const [reasonTodo, setReasonTodo] = useState('');
  const id = useParams().id;
  // const { id: newId } = useParams();
  //SkillSet DropDowns
  const fetchSkillSet = async () => {
    setPageName(!pageName);
    try {
      let req = await axios.get(SERVICE.SKILLSET, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      setSkillSet(
        req.data.skillsets.length > 0 &&
          req.data.skillsets.map((d) => ({
            ...d,
            label: d.name,
            value: d.name,
          }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //Submit function for Work History
  const handleSubmitWorkSubmit = (e) => {
    e.preventDefault();
    const errorstodo = {};
    // Check if empNameTodo already exists in Edit
    const isDuplicate = workhistTodoEdit?.some(
      (entry) => entry.empNameTodo?.toLowerCase() === empNameTodo?.toLowerCase() && entry.desigTodo?.toLowerCase() === desigTodo?.toLowerCase() && entry.joindateTodo === joindateTodo && entry.leavedateTodo === leavedateTodo && entry.reasonTodo?.toLowerCase() === reasonTodo?.toLowerCase()
    );
    // Check if all fields are filled
    if (empNameTodo === '' || desigTodo === '' || joindateTodo === '' || leavedateTodo === '' || dutiesTodo === '' || reasonTodo === '') {
      errorstodo.empNameTodo = <Typography style={{ color: 'red' }}>Please Fill All Fields</Typography>;
    } else if (isDuplicate) {
      errorstodo.empNameTodo = <Typography style={{ color: 'red' }}>Already Added!</Typography>;
    }
    setErrorstodo(errorstodo);
    if (Object.keys(errorstodo)?.length === 0) {
      setWorkhistTodoEdit([
        ...workhistTodoEdit,
        {
          empNameTodo,
          desigTodo,
          joindateTodo,
          leavedateTodo,
          dutiesTodo,
          reasonTodo,
        },
      ]);
      setErrorstodo('');
      setEmpNameTodo('');
      setDesigTodo('');
      setJoindateTodo('');
      setLeavedateTodo('');
      setDutiesTodo('');
      setReasonTodo('');
    }
  };
  //Delete for Work History
  const handleWorkHisDelete = (index) => {
    const newWorkHisTodo = [...workhistTodoEdit];
    newWorkHisTodo.splice(index, 1);
    setWorkhistTodoEdit(newWorkHisTodo);
  };
  //ADDICTIONAL QUALIFICATION SECTION FUNCTIONALITY
  const [institution, setInstitution] = useState('');
  const [passedyear, setPassedyear] = useState('');
  const [cgpa, setCgpa] = useState('');
  const handlechangepassedyear = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e.target.value?.slice(0, 4);
    if (regex.test(inputValue) || inputValue === '') {
      setPassedyear(inputValue);
    }
  };
  //change form
  const handlechangecontactpersonal = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e.target.value?.slice(0, 10);
    if (regex.test(inputValue) || inputValue === '') {
      setAllInformationEdit({ ...allInformationEdit, contactpersonal: inputValue });
    }
  };
  const handlechangecontactfamily = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e.target.value?.slice(0, 10);
    if (regex.test(inputValue) || inputValue === '') {
      setAllInformationEdit({ ...allInformationEdit, contactfamily: inputValue });
    }
  };
  const handlechangeemergencyno = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e.target.value?.slice(0, 10);
    if (regex.test(inputValue) || inputValue === '') {
      setAllInformationEdit({ ...allInformationEdit, emergencyno: inputValue });
    }
  };
  const handlechangeaadhar = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e.target.value?.slice(0, 12);
    if (regex.test(inputValue) || inputValue === '') {
      setAllInformationEdit({ ...allInformationEdit, aadhar: inputValue });
    }
  };
  //Submit function for TODO Education
  const handleSubmittodo = (e) => {
    e.preventDefault();
    const errorstodo = {};
    const Nameismatch = eduTodoEdit?.some(
      (data, index) =>
        data.categoryedu?.toLowerCase() === allInformationEdit.categoryedu?.toLowerCase() &&
        data.subcategoryedu?.toLowerCase() === allInformationEdit.subcategoryedu?.toLowerCase() &&
        data.specialization?.toLowerCase() === allInformationEdit.specialization?.toLowerCase() &&
        data.institution?.toLowerCase() === institution?.toLowerCase() &&
        data.passedyear?.toLowerCase() === passedyear?.toLowerCase() &&
        data.cgpa?.toLowerCase() === cgpa?.toLowerCase()
    );

    if (allInformationEdit.categoryedu == 'Please Select Category' || allInformationEdit.subcategoryedu == 'Please Select Sub Category' || allInformationEdit.specialization == 'Please Select Specialization' || institution == '' || passedyear == '' || cgpa == '') {
      errorstodo.qualification = <Typography style={{ color: 'red' }}>Please Fill All Fields</Typography>;
      setErrorstodo(errorstodo);
    } else if (
      allInformationEdit.categoryedu !== 'Please Select Category' &&
      allInformationEdit.subcategoryedu !== 'Please Select Sub Category' &&
      allInformationEdit.specialization !== 'Please Select Specialization' &&
      institution !== '' &&
      passedyear !== '' &&
      passedyear?.length !== 4 &&
      cgpa !== ''
    ) {
      errorstodo.qualification = <Typography style={{ color: 'red' }}>Please Enter Valid Passed Year</Typography>;
      setErrorstodo(errorstodo);
    } else if (Nameismatch) {
      errorstodo.qualification = <Typography style={{ color: 'red' }}>Already Added!</Typography>;
      setErrorstodo(errorstodo);
    } else {
      setEduTodoEdit([
        ...eduTodoEdit,
        {
          categoryedu: allInformationEdit.categoryedu,
          subcategoryedu: allInformationEdit.subcategoryedu,
          specialization: allInformationEdit.specialization,
          institution,
          passedyear,
          cgpa,
        },
      ]);
      setErrorstodo('');
      setAllInformationEdit((prev) => ({
        ...prev,
        categoryedu: 'Please Select Category',
        subcategoryedu: 'Please Select Sub Category',
        specialization: 'Please Select Specialization',
      }));
      setInstitution('');
      setPassedyear('');
      setCgpa('');
      setSubcategorys([]);
      setEducationsOpt([]);
    }
  };
  //Delete for Education
  const handleDelete = (index) => {
    const newTodos = [...eduTodoEdit];
    newTodos.splice(index, 1);
    setEduTodoEdit(newTodos);
  };
  const handlechangecgpa = (e) => {
    const regex = /^\d*\.?\d*$/;
    const inputValue = e.target.value?.slice(0, 4);
    if (regex.test(inputValue) || inputValue === '') {
      setCgpa(inputValue);
    }
  };
  //Submit function for Additional Qualification
  const handleSubmitAddtodo = (e) => {
    e.preventDefault();

    const errorstodo = {};
    const Namematch = addAddQuaTodoEdit?.some((data, index) => data.addQual?.toLowerCase() === addQual?.toLowerCase() && data.addInst?.toLowerCase() == addInst?.toLowerCase() && data.duration?.toLowerCase() == duration?.toLowerCase() && data.remarks?.toLowerCase() == remarks?.toLowerCase());
    if (addQual == '' || addInst == '' || duration == '') {
      errorstodo.addQual = <Typography style={{ color: 'red' }}>Please Fill All Fields</Typography>;
      setErrorstodo(errorstodo);
    } else if (Namematch) {
      errorstodo.addQual = <Typography style={{ color: 'red' }}>Already Added!</Typography>;
      setErrorstodo(errorstodo);
    } else {
      setAddQuaTodoEdit([...addAddQuaTodoEdit, { addQual, addInst, duration, remarks }]);
      setErrorstodo('');
      setAddQual('');
      setAddInst('');
      setDuration('');
      setRemarks('');
    }
  };
  //Delete for Additional Qualification
  const handleAddDelete = (index) => {
    const newTodosed = [...addAddQuaTodoEdit];
    newTodosed.splice(index, 1);
    setAddQuaTodoEdit(newTodosed);
  };
  const fetchCategoryBased = async (e) => {
    setPageName(!pageName);
    try {
      let res_category = await axios.get(SERVICE.CATEGORYEDUCATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = res_category.data.educationcategory.filter((data) => {
        return data.categoryname === e.value;
      });
      let get =
        data_set?.length > 0
          ? data_set[0].subcategoryname.map((data) => ({
              label: data,
              value: data,
            }))
          : [];
      setSubcategorys(get);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const fetchCategoryEducation = async () => {
    setPageName(!pageName);
    try {
      let res_category = await axios.get(SERVICE.CATEGORYEDUCATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = res_category.data.educationcategory.map((d) => d.categoryname);
      let filter_opt = [...new Set(data_set)];
      setCategorys(
        filter_opt.map((data) => ({
          ...data,
          label: data,
          value: data,
        }))
      );
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const fetchEducation = async (e) => {
    setPageName(!pageName);
    try {
      let res = await axios.get(SERVICE.EDUCATIONSPECILIZATION, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = res.data.educationspecilizations.filter((data) => {
        return data.category.includes(allInformationEdit.categoryedu) && data.subcategory.includes(e.value);
      });
      let result =
        data_set?.length > 0
          ? data_set[0].specilizationgrp.map((data) => ({
              label: data.label,
              value: data.label,
            }))
          : [];
      setEducationsOpt(result);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const [getbranchname, setgetbranchname] = useState('');
  let branchname = getbranchname ? setgetbranchname : allInformation.company;
  let loginid = localStorage.LoginUserId;
  const handlechangecpincode = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e?.target?.value?.slice(0, 6);
    if (regex.test(inputValue) || inputValue === '') {
      setAllInformationEdit({ ...allInformationEdit, cpincode: inputValue });
    }
  };
  const handlechangeppincode = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e?.target?.value?.slice(0, 6);
    if (regex.test(inputValue) || inputValue === '') {
      setAllInformationEdit({ ...allInformationEdit, ppincode: inputValue });
    }
  };

  const [fromPinCodep, setFromPinCodep] = useState([]);
  const [fromPinCodec, setFromPinCodec] = useState([]);

  const handleLocationSuccessp = (postOffices) => {
    console.log('Success:', postOffices);

    // You can now use postOffices[0].name, .state, .country, etc.
    setFromPinCodep(postOffices);
    setSelectedStatep({
      name: postOffices?.length > 0 ? postOffices[0]?.State : '',
      countryCode: '',
      isoCode: '',
    });
    setSelectedCityp('');
    setAllInformationEdit((prevSupplier) => ({
      ...prevSupplier,
      pstate: postOffices?.length > 0 ? postOffices[0]?.State : '',
      pdistrict: postOffices?.length > 0 ? postOffices[0]?.District : '',
      pvillageorcity: '',
      pcity: '',
    }));
  };
  const handleLocationSuccessc = (postOffices) => {
    console.log('Success:', postOffices);

    // You can now use postOffices[0].name, .state, .country, etc.
    setFromPinCodec(postOffices);
    setSelectedStatec({
      name: postOffices?.length > 0 ? postOffices[0]?.State : '',
      countryCode: '',
      isoCode: '',
    });
    setSelectedCityc('');
    setAllInformationEdit((prevSupplier) => ({
      ...prevSupplier,
      cstate: postOffices?.length > 0 ? postOffices[0]?.State : '',
      cdistrict: postOffices?.length > 0 ? postOffices[0]?.District : '',
      cvillageorcity: '',
      ccity: '',
    }));
  };
  const [singleReferenceTodoEdit, setSingleReferenceTodoEdit] = useState({
    name: '',
    relationship: '',
    occupation: '',
    contact: '',
    details: '',
  });
  const [designationsFileNames, setDesignationsFileNames] = useState([]);
  const [fileNames, setfileNames] = useState('Please Select File Name');
  //get all Areas.
  const fetchCandidatedocumentdropdowns = async (name) => {
    setPageName(!pageName);
    try {
      let res_candidate = await axios.get(SERVICE.CANDIDATEDOCUMENT, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let data_set = res_candidate.data.candidatedocuments.filter((data) => data.designation === name);
      const desigall = [
        ...data_set.map((d) => ({
          ...d,
          label: d.candidatefilename,
          value: d.candidatefilename,
        })),
      ];
      setDesignationsFileNames(desigall);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // SELECT DROPDOWN STYLES
  const colourStyles = {
    menuList: (styles) => ({
      ...styles,
      background: 'white',
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      color: isFocused ? 'rgb(255 255 255, 0.5)' : isSelected ? 'white' : 'black',
      background: isFocused ? 'rgb(25 118 210, 0.7)' : isSelected ? 'rgb(25 118 210, 0.5)' : null,
      zIndex: 1,
    }),
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const getapi = async () => {
    let userchecks = axios.post(`${SERVICE.CREATE_USERCHECKS}`, {
      headers: {
        Authorization: `Bearer${auth.APIToken}`,
      },
      empcode: String(isUserRoleAccess?.empcode),
      companyname: String(isUserRoleAccess?.companyname),
      pagename: String('My Verification List'),
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
  useEffect(() => {
    getapi();
    fetchSkillSet();
    fetchCategoryEducation();
  }, []);
  const addReferenceTodoFunction = () => {
    const isNameMatch = referenceTodoEdit?.some((item) => item.name?.toLowerCase() === singleReferenceTodoEdit.name?.toLowerCase());

    const newErrorsLog = {};
    if (singleReferenceTodoEdit.name === '') {
      newErrorsLog.name = <Typography style={{ color: 'red' }}>Name must be required</Typography>;
    } else if (isNameMatch) {
      newErrorsLog.duplicate = <Typography style={{ color: 'red' }}>Reference Already Exist!</Typography>;
    }
    if (singleReferenceTodoEdit.contact !== '' && singleReferenceTodoEdit.contact?.length !== 10) {
      newErrorsLog.contactno = <Typography style={{ color: 'red' }}>Contact No must be 10 digits required</Typography>;
    }
    if (singleReferenceTodoEdit !== '' && Object.keys(newErrorsLog).length === 0) {
      setReferenceTodoEdit([...referenceTodoEdit, singleReferenceTodoEdit]);
      setSingleReferenceTodoEdit({
        name: '',
        relationship: '',
        occupation: '',
        contact: '',
        details: '',
      });
    }
    setReferenceTodoError(newErrorsLog);
  };
  const deleteReferenceTodo = (index) => {
    const newTasks = [...referenceTodoEdit];
    newTasks.splice(index, 1);
    setReferenceTodoEdit(newTasks);
  };
  const handlechangereferencecontactno = (e) => {
    const regex = /^[0-9]+$/; // Only allows positive integers
    const inputValue = e.target.value?.slice(0, 10);
    if (regex.test(inputValue) || inputValue === '') {
      setSingleReferenceTodoEdit({ ...singleReferenceTodoEdit, contact: inputValue });
    }
  };
  function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }
  useEffect(() => {
    const loadModels = async () => {
      const modelUrl = SERVICE.FACEDETECTLOGINMODEL;

      await Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl), faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl), faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl)]);
    };
    loadModels();
    console.log('FaceRecognitionNet loaded:', faceapi.nets.faceRecognitionNet.isLoaded);
  }, []);
  // Image Upload
  const [btnUpload, setBtnUpload] = useState(false);

  const [isErrorOpenpop, setIsErrorOpenpop] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [showDupProfileVIsitor, setShowDupProfileVIsitor] = useState([]);
  const handleClickOpenerrpop = () => {
    setIsErrorOpenpop(true);
  };
  const handleCloseerrpop = () => {
    setIsErrorOpenpop(false);
  };
  const UploadWithDuplicate = (e) => {
    setShowDupProfileVIsitor([]);
    handleCloseerrpop();
  };
  const UploadWithoutDuplicate = (e) => {
    setEmployee({
      ...employee,
      profileimage: '',
      faceDescriptor: [],
    });
    setShowDupProfileVIsitor([]);
    handleCloseerrpop();
  };
  function handleChangeImage(e) {
    setBtnUpload(true); // Enable loader when the process starts
    const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes

    // Get the selected file
    const file = e.target.files[0];

    if (file && file.size < maxFileSize) {
      const path = URL.createObjectURL(file);
      const image = new Image();
      image.src = path;

      image.onload = async () => {
        try {
          console.log(image.src, 'Inmage loaded');
          const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
          if (detections.length > 0) {
            const faceDescriptor = detections[0].descriptor;

            const response = await axios.post(`${SERVICE.DUPLICATECANDIDATEFACEDETECTVISITOR}`, {
              headers: {
                Authorization: `Bearer ${auth.APIToken}`,
              },
              id: employee?.id || null,
              faceDescriptor: Array.from(faceDescriptor),
            });

            if (response?.data?.matchfound) {
              // setPopupContentMalert('Image Already In Use.');
              // setPopupSeverityMalert("info");
              // handleClickOpenPopupMalert();
              toDataURL(path, function (dataUrl) {
                setEmployee({
                  ...employee,
                  profileimage: String(dataUrl),
                  faceDescriptor: Array.from(faceDescriptor),
                });
              });
              setShowDupProfileVIsitor(response?.data?.matchedData);
              handleClickOpenerrpop();
            } else {
              toDataURL(path, function (dataUrl) {
                setEmployee({
                  ...employee,
                  profileimage: String(dataUrl),
                  faceDescriptor: Array.from(faceDescriptor),
                });
              });
            }
            setImageUploaded(true);
          } else {
            setPopupContentMalert('No face detected.');
            setPopupSeverityMalert('info');
            handleClickOpenPopupMalert();
          }
        } catch (error) {
          setPopupContentMalert('Error in face detection.');
          setPopupSeverityMalert('info');
          handleClickOpenPopupMalert();
        } finally {
          setBtnUpload(false); // Disable loader when done
        }
      };

      image.onerror = (err) => {
        setPopupContentMalert('Error loading image.');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
        setBtnUpload(false); // Disable loader in case of error
      };

      setFile(URL.createObjectURL(file));
    } else {
      setPopupContentMalert('File size is greater than 1MB, please upload a file below 1MB.');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
      setBtnUpload(false); // Disable loader if file is too large
    }
  }
  // function handleChangeImage(e) {
  //   let profileimage = document.getElementById('profileimage');
  //   var path = (window.URL || window.webkitURL).createObjectURL(profileimage.files[0]);
  //   toDataURL(path, function (dataUrl) {
  //     profileimage.setAttribute('value', String(dataUrl));
  //     setProfileImg(String(dataUrl));
  //     return dataUrl;
  //   });
  //   setFile(URL.createObjectURL(e.target.files[0]));
  // }
  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/;
    let emailvalue = email ? email : allInformation.email;
    return regex.test(emailvalue);
  };
  //image cropping
  const handleCrop = () => {
    if (typeof cropperRef.current.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    setCroppedImage(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
    setSelectedFile(null);
  };
  const handleClearImage = () => {
    setFile(null);
    setSelectedFile(null);
    setCroppedImage(null);
    setProfileImg('');
    setFile(null);
    setSelectedFile(null);
    setCroppedImage(null);
    setEmployee({ ...employee, profileimage: '', faceDescriptor: [] });
    setGetImg(null);
    // setImage('');
  };
  const [verifyAll, setVerifyAll] = useState({});

  const handleClickEdited = async () => {
    setLoading(true);
    setLoadingMessage('Updating...');
    setPageName(!pageName);
    try {
      let updateObj = allInfo?.map((item) => ({
        name: item,
        edited: false,
        corrected: false,
      }));

      let editedVerify = verifyAll.verified?.map((item) => (item.name === verifyAll.information ? { ...item, edited: true } : item));
      var editedVerifyMyVerify = verifyAll.verified?.map((item) => (item.name === verifyAll.information ? { ...item, edited: true } : item))?.filter((item) => item.name === verifyAll.information);

      await axios.put(`${SERVICE.MYVERIFICATION_SINGLE}/${verifyAll?.templateId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        verifiedInfo: editedVerify,
      });
      let datas = await axios.get(SERVICE.MYFIELDVERIFICATION);
      let isAvailed = datas?.data?.myverification?.find((item) => item?.employeeid == isUserRoleAccess?._id);

      if (isAvailed) {
        await axios.put(`${SERVICE.MYFIELDVERIFICATION_SINGLE}/${isAvailed?._id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          // updatestatus: isAvailedStatus?.length > 0 ? isAvailedStatus : updateObj,
          ...(isPersonalInfoOpenEdit && {
            firstname: String(allInformationEdit?.firstname),
            prefix: String(allInformationEdit?.prefix),
            lastname: String(allInformationEdit?.lastname),
            legalname: String(allInformationEdit?.legalname),
            callingname: String(allInformationEdit?.callingname),
            fathername: String(allInformationEdit?.fathername),
            mothername: String(allInformationEdit?.mothername),
            gender: String(allInformationEdit?.gender),
            maritalstatus: String(allInformationEdit?.maritalstatus),
            dom: String(allInformationEdit?.dom),
            dob: String(allInformationEdit?.dob),
            religion: String(allInformationEdit?.religion || ''),
            location: String(allInformationEdit?.location),
            bloodgroup: String(allInformationEdit?.bloodgroup),
            email: String(allInformationEdit?.email),
            contactpersonal: String(allInformationEdit?.contactpersonal),
            contactfamily: String(allInformationEdit?.contactfamily),
            emergencyno: String(allInformationEdit?.emergencyno),
            panno: String(allInformationEdit?.panstatus === 'Have PAN' ? allInformationEdit?.panno : ''),
            aadhar: String(allInformationEdit?.aadhar),
            panstatus: String(allInformationEdit?.panstatus),
            panrefno: String(allInformationEdit?.panstatus === 'Applied' ? allInformationEdit?.panrefno : ''),
            userprofile: String(final),
            faceDescriptor: employee?.faceDescriptor?.length > 0 ? employee?.faceDescriptor : [],
            personalinfoproof: String(infoProof.personalinfoproof),
          }),

          //////reff
          ...(isReferenceOpenEdit && {
            referencetodo: referenceTodoEdit.length === 0 ? [] : [...referenceTodoEdit],
            referenceproof: String(infoProof.referenceproof),
          }),

          ///permanentadd
          ...(isPermanantAddressOpenEdit && {
            paddresstype: String(allInformationEdit?.paddresstype || ''),
            ppersonalprefix: String(allInformationEdit?.ppersonalprefix || ''),
            presourcename: String(allInformationEdit?.presourcename || ''),
            plandmarkandpositionalprefix: String(allInformationEdit?.plandmarkandpositionalprefix || ''),
            pgpscoordination: String(allInformationEdit?.pgpscoordination || ''),
            pgenerateviapincode: Boolean(allInformationEdit?.pgenerateviapincode || false),
            pvillageorcity: String(allInformationEdit?.pvillageorcity || ''),
            pdistrict: String(allInformationEdit?.pdistrict || ''),
            pdoorno: String(allInformationEdit.pdoorno),
            pstreet: String(allInformationEdit.pstreet),
            parea: String(allInformationEdit.parea),
            plandmark: String(allInformationEdit.plandmark),
            ptaluk: String(allInformationEdit.ptaluk),
            ppost: String(allInformationEdit.ppost),
            ppincode: String(allInformationEdit.ppincode),
            pcountry: String(allInformationEdit.pcountry),
            pstate: String(allInformationEdit.pstate),
            pcity: String(allInformationEdit.pcity),
            paddressproof: String(infoProof.paddressproof),
          }),
          ///currentadd
          ...(isCurrentAddressOpenEdit && {
            caddresstype: String(allInformationEdit?.caddresstype || ''),
            cpersonalprefix: String(allInformationEdit?.cpersonalprefix || ''),
            cresourcename: String(allInformationEdit?.cresourcename || ''),
            clandmarkandpositionalprefix: String(allInformationEdit?.clandmarkandpositionalprefix || ''),
            cgpscoordination: String(allInformationEdit?.cgpscoordination || ''),
            cgenerateviapincode: Boolean(allInformationEdit?.cgenerateviapincode || false),
            cvillageorcity: String(allInformationEdit?.cvillageorcity || ''),
            cdistrict: String(allInformationEdit?.cdistrict || ''),
            cdoorno: String(allInformationEdit.cdoorno),
            cstreet: String(allInformationEdit.cstreet),
            carea: String(allInformationEdit.carea),
            clandmark: String(allInformationEdit.clandmark),
            ctaluk: String(allInformationEdit.ctaluk),
            cpost: String(allInformationEdit.cpost),
            cpincode: String(allInformationEdit.cpincode),
            ccountry: String(allInformationEdit.ccountry),
            cstate: String(allInformationEdit.cstate),
            ccity: String(allInformationEdit.ccity),
            caddressproof: String(infoProof.caddressproof),
          }),

          ///document
          ...(isDocumentListOpenEdit && {
            files: filesEdit ?? [],
            documentproof: String(infoProof.documentproof),
          }),

          //educationqu
          ...(isEducationalQualifyOpenEdit && {
            eduTodo: [...eduTodoEdit],
            eduqualiproof: String(infoProof.eduqualiproof),
          }),

          //addictonqua
          ...(isAdditionalQualifyOpenEdit && {
            addAddQuaTodo: [...addAddQuaTodoEdit],
            addqualiproof: String(infoProof.addqualiproof),
          }),
          //workhist
          ...(isWorkHistoryOpenEdit && {
            workhistTodo: [...workhistTodoEdit],
            workhistproof: String(infoProof.workhistproof),
          }),

          //banckdet
          ...(isBankDetailsOpenEdit && {
            bankdetails: [...bankTodoEdit],
            bankdetailsproof: String(infoProof.bankdetailsproof),
          }),

          employeename: String(isUserRoleAccess?.companyname),
          employeeid: String(isUserRoleAccess?._id),
          empcode: String(allInformationEdit?.wordcheck === true ? employeecodenew : allInformationEdit?.empcode),
          verifiedInfo: [...isAvailed?.verifiedInfo, ...editedVerifyMyVerify],
          // verifiedInfo: isAvailed?.verifiedInfo?.length > 0 ? secontfilt : editedVerify,
          verificationstatus: String('Edited'),
          username: enableLoginName ? String(third) : allInformationEdit?.username,
          usernameautogenerate: Boolean(enableLoginName),

          updatestatus: [...isAvailed?.updatestatus, ...editedVerifyMyVerify],
          wordcheck: Boolean(allInformationEdit?.wordcheck),
          contactno: String(allInformationEdit?.contactno),
          details: String(allInformationEdit?.details),
          password: String(allInformationEdit?.password),

          explogproof: String(infoProof.explogproof),
          updatedby: [
            ...isUserRoleAccess.updatedby,
            {
              name: String(isUserRoleAccess?.username),
              date: String(new Date()),
            },
          ],
        });
      } else {
        // ?.filter((item)=> item.name ===  verifyAll.information );
        var editedVerifyMyVerify = verifyAll.verified?.map((item) => (item.name === verifyAll.information ? { ...item, edited: true } : item))?.filter((item) => item.name === verifyAll.information);

        await axios.post(`${SERVICE.MYFIELDVERIFICATION_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          updatestatus: [...editedVerifyMyVerify],
          verifiedInfo: [...editedVerifyMyVerify],
          verificationstatus: String('Edited'),
          userprofile: String(final),
          faceDescriptor: employee?.faceDescriptor?.length > 0 ? employee?.faceDescriptor : [],
          username: enableLoginName ? String(third) : allInformationEdit?.username,
          employeename: String(isUserRoleAccess?.companyname),
          usernameautogenerate: Boolean(enableLoginName),
          employeeid: String(isUserRoleAccess?._id),
          firstname: String(allInformationEdit?.firstname),
          lastname: String(allInformationEdit?.lastname),
          legalname: String(allInformationEdit?.legalname),
          callingname: String(allInformationEdit?.callingname),
          prefix: String(allInformationEdit?.prefix),
          fathername: String(allInformationEdit?.fathername),
          mothername: String(allInformationEdit?.mothername),
          gender: String(allInformationEdit?.gender),
          maritalstatus: String(allInformationEdit?.maritalstatus),
          dom: String(allInformationEdit?.dom),
          dob: String(allInformationEdit?.dob),
          religion: String(allInformationEdit?.religion || ''),
          // dot: String(allInformationEdit?.dot),
          // doj: String(allInformationEdit?.doj),
          bloodgroup: String(allInformationEdit?.bloodgroup),
          location: String(allInformationEdit?.location),
          email: String(allInformationEdit?.email),
          contactpersonal: String(allInformationEdit?.contactpersonal),
          contactfamily: String(allInformationEdit?.contactfamily),
          emergencyno: String(allInformationEdit?.emergencyno),
          wordcheck: Boolean(allInformationEdit?.wordcheck),
          aadhar: String(allInformationEdit?.aadhar),
          panno: String(allInformationEdit?.panstatus === 'Have PAN' ? allInformationEdit?.panno : ''),
          referencetodo: referenceTodoEdit.length === 0 ? [] : [...referenceTodoEdit],
          contactno: String(allInformationEdit?.contactno),
          details: String(allInformationEdit?.details),
          password: String(allInformationEdit?.password),
          paddresstype: String(allInformationEdit?.paddresstype || ''),
          ppersonalprefix: String(allInformationEdit?.ppersonalprefix || ''),
          presourcename: String(allInformationEdit?.presourcename || ''),
          plandmarkandpositionalprefix: String(allInformationEdit?.plandmarkandpositionalprefix || ''),
          pgpscoordination: String(allInformationEdit?.pgpscoordination || ''),
          pgenerateviapincode: Boolean(allInformationEdit?.pgenerateviapincode || false),
          pvillageorcity: String(allInformationEdit?.pvillageorcity || ''),
          pdistrict: String(allInformationEdit?.pdistrict || ''),
          pdoorno: String(allInformationEdit.pdoorno),
          pstreet: String(allInformationEdit.pstreet),
          parea: String(allInformationEdit.parea),
          plandmark: String(allInformationEdit.plandmark),
          ptaluk: String(allInformationEdit.ptaluk),
          ppost: String(allInformationEdit.ppost),
          ppincode: String(allInformationEdit.ppincode),
          pcountry: String(allInformationEdit.pcountry),
          pstate: String(allInformationEdit.pstate),
          pcity: String(allInformationEdit.pcity),
          date: String(new Date()),
          caddresstype: String(allInformationEdit?.caddresstype || ''),
          cpersonalprefix: String(allInformationEdit?.cpersonalprefix || ''),
          cresourcename: String(allInformationEdit?.cresourcename || ''),
          clandmarkandpositionalprefix: String(allInformationEdit?.clandmarkandpositionalprefix || ''),
          cgpscoordination: String(allInformationEdit?.cgpscoordination || ''),
          cgenerateviapincode: Boolean(allInformationEdit?.cgenerateviapincode || false),
          cvillageorcity: String(allInformationEdit?.cvillageorcity || ''),
          cdistrict: String(allInformationEdit?.cdistrict || ''),
          cdoorno: String(allInformationEdit.cdoorno),
          cstreet: String(allInformationEdit.cstreet),
          carea: String(allInformationEdit.carea),
          clandmark: String(allInformationEdit.clandmark),
          ctaluk: String(allInformationEdit.ctaluk),
          cpost: String(allInformationEdit.cpost),
          cpincode: String(allInformationEdit.cpincode),
          ccountry: String(allInformationEdit.ccountry),
          cstate: String(allInformationEdit.cstate),
          ccity: String(allInformationEdit.ccity),
          files: filesEdit ?? [],
          eduTodo: [...eduTodoEdit],
          addAddQuaTodo: [...addAddQuaTodoEdit],
          workhistTodo: [...workhistTodoEdit],
          bankdetails: [...bankTodoEdit],
          explogproof: String(infoProof.explogproof),
          bankdetailsproof: String(infoProof.bankdetailsproof),
          eduqualiproof: String(infoProof.eduqualiproof),
          addqualiproof: String(infoProof.addqualiproof),
          workhistproof: String(infoProof.workhistproof),
          documentproof: String(infoProof.documentproof),
          caddressproof: String(infoProof.caddressproof),
          paddressproof: String(infoProof.paddressproof),
          referenceproof: String(infoProof.referenceproof),
          personalinfoproof: String(infoProof.personalinfoproof),
          updatedby: [
            ...isUserRoleAccess.updatedby,
            {
              name: String(isUserRoleAccess?.username),
              date: String(new Date()),
            },
          ],
        });
      }
      await getCode();
      setLoading(false);
      setPopupContent('Updated Successfully');
      setPopupSeverity('success');
      handleClickOpenPopup();
      setIsPersonalInfoOpenEdit(false);
      setIsPersonalInfoOpen(false);
      setAddOpenalertPersonal(false);
      setIsReferenceOpenEdit(false);
      setIsReferenceOpen(false);
      setAddOpenalertReference(false);
      setIsPermanantAddressOpenEdit(false);
      setIsPermanantAddressOpen(false);
      setAddOpenalertPermanant(false);
      setIsCurrentAddressOpenEdit(false);
      setIsCurrentAddressOpen(false);
      setAddOpenalertCurrent(false);
      setIsDocumentListOpenEdit(false);
      setIsDocumentListOpen(false);
      setAddOpenalertDocument(false);
      setIsEducationalQualifyOpenEdit(false);
      setIsEducationalQualifyOpen(false);
      setAddOpenalertEducational(false);
      setIsAdditionalQualifyOpenEdit(false);
      setIsAdditionalQualifyOpen(false);
      setAddOpenalertAdditional(false);
      setIsWorkHistoryOpenEdit(false);
      setIsWorkHistoryOpen(false);
      setAddOpenalertWork(false);
      setIsBankDetailsOpenEdit(false);
      setIsBankDetailsOpen(false);
      setAddOpenalertBank(false);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };

  function AadharValidate(aadhar) {
    var adharcardTwelveDigit = /^\d{12}$/;
    var adharSixteenDigit = /^\d{16}$/;

    if (aadhar !== '') {
      if (aadhar.match(adharcardTwelveDigit) || aadhar.match(adharSixteenDigit)) {
        if (aadhar[0] !== '0' && aadhar[0] !== '1') {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  function PanValidate(pan) {
    let panregex = /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
    if (pan !== '') {
      if (pan.match(panregex)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  const requiredFieldCheckPersonal = async () => {
    setPageName(!pageName);
    try {
      const newErrors = {};
      if (!allInformationEdit.callingname) {
        newErrors.callingname = <Typography style={{ color: 'red' }}>Calling Name must be required</Typography>;
      }
      if (!allInformationEdit.email) {
        newErrors.email = <Typography style={{ color: 'red' }}>Email must be required</Typography>;
      } else if (!isValidEmail) {
        newErrors.email = <Typography style={{ color: 'red' }}>Please enter valid email</Typography>;
      }
      if (!final) {
        newErrors.profile = <Typography style={{ color: 'red' }}>Profile Image must be required</Typography>;
      }

      if (!allInformationEdit.emergencyno) {
        newErrors.emergencyno = <Typography style={{ color: 'red' }}>Emergency no must be required</Typography>;
      } else if (allInformationEdit.emergencyno.length !== 10) {
        newErrors.emergencyno = <Typography style={{ color: 'red' }}>Emergency no must be 10 digits required</Typography>;
      }
      if (allInformationEdit.maritalstatus === 'Married' && !allInformationEdit.dom) {
        newErrors.dom = <Typography style={{ color: 'red' }}>DOM must be required</Typography>;
      }
      if (allInformationEdit.contactfamily === '') {
        newErrors.contactfamily = <Typography style={{ color: 'red' }}>Contact(Family) no must be required</Typography>;
      }
      if (allInformationEdit.contactfamily !== '' && allInformationEdit.contactfamily.length !== 10) {
        newErrors.contactfamily = <Typography style={{ color: 'red' }}>Contact(Family) no must be 10 digits required</Typography>;
      }
      if (allInformationEdit.contactpersonal === '') {
        newErrors.contactpersonal = <Typography style={{ color: 'red' }}>Contact(personal) no must be required</Typography>;
      }
      if (allInformationEdit.contactpersonal !== '' && allInformationEdit.contactpersonal.length !== 10) {
        newErrors.contactpersonal = <Typography style={{ color: 'red' }}>Contact(personal) no must be 10 digits required</Typography>;
      }
      if (allInformationEdit?.panno !== '' && allInformationEdit?.panno?.length !== 10) {
        newErrors.panno = <Typography style={{ color: 'red' }}>Pan No must be 10 digits required</Typography>;
      }
      if (allInformationEdit?.panno === '' && allInformationEdit?.panstatus === 'Have PAN') {
        newErrors.panno = <Typography style={{ color: 'red' }}>Pan No must be required</Typography>;
      }
      if (allInformationEdit?.panrefno === '' && allInformationEdit?.panstatus === 'Applied') {
        newErrors.panrefno = <Typography style={{ color: 'red' }}>Application Reference No must be required</Typography>;
      }
      if (!allInformationEdit.dob) {
        newErrors.dob = <Typography style={{ color: 'red' }}>DOB must be required</Typography>;
      }
      if (!allInformationEdit.religion) {
        newErrors.religion = <Typography style={{ color: 'red' }}>Religion must be required</Typography>;
      }

      // if (!allInformationEdit.aadhar) {
      //   newErrors.aadhar = <Typography style={{ color: 'red' }}> Aadhar must be required </Typography>;
      // } else if (allInformationEdit.aadhar.length < 12) {
      //   newErrors.aadhar = <Typography style={{ color: 'red' }}> Please Enter valid Aadhar Number </Typography>;
      // }
      // if (!infoProof.personalinfoproof) {
      //   newErrors.personalinfoproof = <Typography style={{ color: 'red' }}> Proof must be required </Typography>;
      // }

      if (!allInformationEdit.aadhar) {
        newErrors.aadhar = <Typography style={{ color: 'red' }}> Aadhar must be required </Typography>;
      } else if (allInformationEdit.aadhar.length < 12) {
        newErrors.aadhar = <Typography style={{ color: 'red' }}> Please Enter valid Aadhar Number </Typography>;
      } else if (!AadharValidate(allInformationEdit.aadhar)) {
        newErrors.aadhar = <Typography style={{ color: 'red' }}> Please Enter valid Aadhar Number </Typography>;
      }

      if (allInformationEdit?.panno !== '' && allInformationEdit?.panno?.length !== 10) {
        newErrors.panno = <Typography style={{ color: 'red' }}>PAN No must be 10 digits required</Typography>;
      }
      if (allInformationEdit?.panno === '' && allInformationEdit?.panstatus === 'Have PAN') {
        newErrors.panno = <Typography style={{ color: 'red' }}>PAN No must be required</Typography>;
      } else if (!PanValidate(allInformationEdit?.panno) && allInformationEdit?.panstatus === 'Have PAN') {
        newErrors.panno = <Typography style={{ color: 'red' }}>Please Enter Valid PAN Number</Typography>;
      }

      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        handleClickEdited();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const requiredFieldCheckReference = async () => {
    setPageName(!pageName);
    try {
      const newErrors = {};
      if (referenceTodoEdit.length === 0) {
        newErrors.referencetable = <Typography style={{ color: 'red' }}> Name must be required </Typography>;
      }
      if (!infoProof.referenceproof) {
        newErrors.referenceproof = <Typography style={{ color: 'red' }}> Proof must be required </Typography>;
      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        handleClickEdited();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const requiredFieldCheckPermanent = async () => {
    setPageName(!pageName);
    try {
      const newErrors = {};
      if (
        !allInformationEdit?.paddresstype ||
        !allInformationEdit?.ppersonalprefix ||
        !allInformationEdit?.presourcename ||
        !allInformationEdit?.plandmarkandpositionalprefix ||
        // !allInformationEdit?.pgpscoordination ||
        !allInformationEdit?.pdoorno ||
        !allInformationEdit?.pstreet ||
        !allInformationEdit?.parea ||
        !allInformationEdit?.plandmark ||
        !allInformationEdit?.ppincode ||
        !selectedCountryp?.name ||
        !selectedStatep?.name ||
        (!allInformationEdit?.pgenerateviapincode && !selectedCityp?.name)
      ) {
        newErrors.paddressall = <Typography style={{ color: 'red', marginTop: '20px', marginLeft: '20px' }}> Please Fill All Field </Typography>;
      }
      if (!infoProof.paddressproof) {
        newErrors.paddressproof = <Typography style={{ color: 'red' }}> Proof must be required </Typography>;
      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        handleClickEdited();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const requiredFieldCheckCurrent = async () => {
    setPageName(!pageName);
    try {
      const newErrors = {};
      if (
        !allInformationEdit?.caddresstype ||
        !allInformationEdit?.cpersonalprefix ||
        !allInformationEdit?.cresourcename ||
        !allInformationEdit?.clandmarkandpositionalprefix ||
        // !allInformationEdit?.cgpscoordination ||
        !allInformationEdit?.cdoorno ||
        !allInformationEdit?.cstreet ||
        !allInformationEdit?.carea ||
        !allInformationEdit?.clandmark ||
        !allInformationEdit?.cpincode ||
        !selectedCountryc?.name ||
        !selectedStatec?.name ||
        (!allInformationEdit?.cgenerateviapincode && !selectedCityc?.name)
      ) {
        newErrors.caddressall = <Typography style={{ color: 'red', marginTop: '50px', marginLeft: '50px' }}> Please Fill All Field </Typography>;
      }
      if (!infoProof.caddressproof) {
        newErrors.caddressproof = <Typography style={{ color: 'red' }}> Proof must be required </Typography>;
      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        handleClickEdited();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const requiredFieldCheckDocument = async () => {
    setPageName(!pageName);
    try {
      const newErrors = {};
      if (filesEdit?.length === 0) {
        newErrors.filesedit = <Typography style={{ color: 'red' }}> Fill All The Fields </Typography>;
      }
      if (!infoProof.documentproof) {
        newErrors.documentproof = <Typography style={{ color: 'red' }}> Proof must be required </Typography>;
      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        handleClickEdited();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const requiredFieldCheckEducation = async () => {
    setPageName(!pageName);
    try {
      const newErrors = {};
      if (eduTodoEdit?.length === 0) {
        newErrors.edutodoedit = <Typography style={{ color: 'red' }}> Fill All The Fields </Typography>;
      }
      if (!infoProof.eduqualiproof) {
        newErrors.eduqualiproof = <Typography style={{ color: 'red' }}> Proof must be required </Typography>;
      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        handleClickEdited();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const requiredFieldCheckAdditioanl = async () => {
    setPageName(!pageName);
    try {
      const newErrors = {};
      if (addAddQuaTodoEdit?.length === 0) {
        newErrors.addtodoedit = <Typography style={{ color: 'red' }}> Fill All The Fields </Typography>;
      }
      if (!infoProof.addqualiproof) {
        newErrors.addqualiproof = <Typography style={{ color: 'red' }}> Proof must be required </Typography>;
      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        handleClickEdited();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const requiredFieldCheckWork = async () => {
    setPageName(!pageName);
    try {
      const newErrors = {};
      if (workhistTodoEdit?.length === 0) {
        newErrors.workhistedit = <Typography style={{ color: 'red' }}> Fill All The Fields </Typography>;
      }
      if (!infoProof.workhistproof) {
        newErrors.workhistproof = <Typography style={{ color: 'red' }}> Proof must be required </Typography>;
      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        handleClickEdited();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const requiredFieldCheckBank = async () => {
    setPageName(!pageName);
    try {
      const newErrors = {};
      if (bankTodoEdit?.length === 0) {
        newErrors.bankedit = <Typography style={{ color: 'red' }}> Fill All The Fields </Typography>;
      }
      if (!infoProof.bankdetailsproof) {
        newErrors.bankdetailsproof = <Typography style={{ color: 'red' }}> Proof must be required </Typography>;
      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        handleClickEdited();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  //Datatable
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  //Datatable Info
  const { auth } = useContext(AuthContext);
  const [isAddOpenalertPersonal, setAddOpenalertPersonal] = useState(false);
  const [isAddOpenalertReference, setAddOpenalertReference] = useState(false);
  const [isAddOpenalertPermanant, setAddOpenalertPermanant] = useState(false);
  const [isAddOpenalertCurrent, setAddOpenalertCurrent] = useState(false);
  const [isAddOpenalertDocument, setAddOpenalertDocument] = useState(false);
  const [isAddOpenalertEducational, setAddOpenalertEducational] = useState(false);
  const [isAddOpenalertAdditional, setAddOpenalertAdditional] = useState(false);
  const [isAddOpenalertWork, setAddOpenalertWork] = useState(false);
  const [isAddOpenalertBank, setAddOpenalertBank] = useState(false);
  const [isemployeedetail, setemployeedetail] = useState(false);
  let username = isUserRoleAccess.companyname;
  const gridRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQueryManage, setSearchQueryManage] = useState('');
  const [copiedData, setCopiedData] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPdfFilterOpen, setIsPdfFilterOpen] = useState(false);
  // page refersh reload
  const handleCloseFilterMod = () => {
    setIsFilterOpen(false);
  };
  const handleClosePdfFilterMod = () => {
    setIsPdfFilterOpen(false);
  };

  const gridRefTableImg = useRef(null);
  // image
  const handleCaptureImage = () => {
    if (gridRefTableImg.current) {
      domtoimage
        .toBlob(gridRefTableImg.current)
        .then((blob) => {
          saveAs(blob, 'MyVerification.png');
        })
        .catch((error) => {
          console.error('dom-to-image error: ', error);
        });
    }
  };
  const [fileFormat, setFormat] = useState('');

  let exportColumnNames = ['Company', 'Branch', 'Unit', 'Team', 'EmployeeName', 'Information'];
  let exportRowValues = ['company', 'branch', 'unit', 'team', 'employeename', 'information'];

  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.selectionModel);
  };
  //Delete model
  const [isDeleteOpenalert, setIsDeleteOpenalert] = useState(false);
  const handleCloseModalert = () => {
    setIsDeleteOpenalert(false);
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
    setSearchQueryManage('');
  };
  const getRowClassName = (params) => {
    if (selectedRows.includes(params.row.id)) {
      return 'custom-id-row'; // This is the custom class for rows with item.tat === 'ago'
    }
    return ''; // Return an empty string for other rows
  };
  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .MuiDataGrid-virtualScroller': {
      overflowY: 'hidden',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: ' bold !important ',
    },
    '& .custom-id-row': {
      backgroundColor: '#1976d22b !important',
    },
    '& .MuiDataGrid-row.Mui-selected': {
      '& .custom-ago-row, & .custom-in-row, & .custom-others-row': {
        backgroundColor: 'unset !important', // Clear the background color for selected rows
      },
    },
    '&:hover': {
      '& .custom-ago-row:hover': {
        backgroundColor: '#ff00004a !important',
      },
      '& .custom-in-row:hover': {
        backgroundColor: '#ffff0061 !important',
      },
      '& .custom-others-row:hover': {
        backgroundColor: '#0080005e !important',
      },
    },
  }));
  // Show All Columns & Manage Columns
  const initialColumnVisibility = {
    serialNumber: true,
    checkbox: true,
    company: true,
    branch: true,
    unit: true,
    team: true,
    employeename: true,
    filename: true,
    information: true,
    actions: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(initialColumnVisibility);
  const { v4: uuidv4 } = require('uuid');
  const getCode = async (e) => {
    setPageName(!pageName);
    console.time('getCode');
    try {
       
      let res_TemplateList = await axios.post(
        `${SERVICE.MY_VERIFICATION_TEAM_LIST}`,
        {
          hierarchyempnames: [isUserRoleAccess.companyname],
        },
        {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
        }
      );

      setEmployees(
        res_TemplateList?.data?.myverification?.map((item, index) => ({
          ...item,
          serialNumber: index + 1,
        }))
      );
      setemployeedetail(true);
      console.timeEnd('getCode');
    } catch (err) {
      setemployeedetail(true);

      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  // Error Popup model
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [showAlert, setShowAlert] = useState();
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
  };
  const handleCloseerr = () => {
    setIsErrorOpen(false);
  };
  // Verify Popup model For View
  const [isPersonalInfoOpen, setIsPersonalInfoOpen] = useState('');
  const [isReferenceOpen, setIsReferenceOpen] = useState('');
  const [isPermanantAddressOpen, setIsPermanantAddressOpen] = useState('');
  const [isCurrentAddressOpen, setIsCurrentAddressOpen] = useState('');
  const [isDocumentListOpen, setIsDocumentListOpen] = useState('');
  const [isEducationalQualifyOpen, setIsEducationalQualifyOpen] = useState('');
  const [isAdditionalQualifyOpen, setIsAdditionalQualifyOpen] = useState('');
  const [isWorkHistoryOpen, setIsWorkHistoryOpen] = useState('');
  const [isBankDetailsOpen, setIsBankDetailsOpen] = useState('');

  const handleClickOpenVerify = async (params, ver) => {
    setVerifyAll(ver);
    setLoading(true);
    setLoadingMessage('Please wait...');
    setPageName(!pageName);
    try {
      let response = await axios.get(`${SERVICE.USER_SINGLE}/${isUserRoleAccess?._id}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });
      let responsenew = await axios.post(`${SERVICE.EMPLOYEEDOCUMENT_SINGLEWITHALLBYCOMMONIDONE}`, {
        commonid: isUserRoleAccess?._id,
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
      });

      await fetchCandidatedocumentdropdowns(response?.data?.suser?.designation);
      setDocumentID(responsenew.data.semployeedocument?.length === 0 ? response?.data?.suser?._id : responsenew?.data?.semployeedocument?._id);
      let profileImg = responsenew.data.semployeedocument?.length === 0 ? response?.data?.suser?.profileimage : responsenew?.data?.semployeedocument?.profileimage;
      setProfileImg(profileImg);

      const savedEmployee = {
        ...response?.data?.suser,
        ...(responsenew?.data?.semployeedocument?.length > 0 && { ...responsenew?.data?.semployeedocument[0] }),
      };
      setEmployee({ faceDescriptor: savedEmployee?.faceDescriptor || [], profileimage: profileImg, id: response?.data?.suser?._id });

      setIsValidEmail(validateEmail(response?.data?.suser?.email));
      setAllInformation({
        ...response?.data?.suser,
        panstatus: savedEmployee?.panno ? 'Have PAN' : savedEmployee?.panrefno ? 'Applied' : 'Yet to Apply',
        age: calculateAge(savedEmployee?.dob),

        religion: savedEmployee?.religion || '',
        paddresstype: savedEmployee?.paddresstype ? savedEmployee?.paddresstype : '',
        ppersonalprefix: savedEmployee?.ppersonalprefix ? savedEmployee?.ppersonalprefix : '',
        presourcename: savedEmployee?.presourcename ? savedEmployee?.presourcename : '',
        plandmarkandpositionalprefix: savedEmployee?.plandmarkandpositionalprefix ? savedEmployee?.plandmarkandpositionalprefix : '',
        pgpscoordination: savedEmployee?.pgpscoordination ? savedEmployee?.pgpscoordination : '',
        caddresstype: savedEmployee?.caddresstype ? savedEmployee?.caddresstype : '',
        cpersonalprefix: savedEmployee?.cpersonalprefix ? savedEmployee?.cpersonalprefix : '',
        cresourcename: savedEmployee?.cresourcename ? savedEmployee?.cresourcename : '',
        clandmarkandpositionalprefix: savedEmployee?.clandmarkandpositionalprefix ? savedEmployee?.clandmarkandpositionalprefix : '',
        cgpscoordination: savedEmployee?.cgpscoordination ? savedEmployee?.cgpscoordination : '',

        pgenerateviapincode: Boolean(savedEmployee?.pgenerateviapincode) || false,
        pvillageorcity: savedEmployee?.pvillageorcity || '',
        pdistrict: savedEmployee?.pdistrict || '',
        cgenerateviapincode: Boolean(savedEmployee?.cgenerateviapincode) || false,
        cvillageorcity: savedEmployee?.cvillageorcity || '',
        cdistrict: savedEmployee?.cdistrict || '',
      });
      setAllInformationEdit({
        ...response?.data?.suser,
        panstatus: savedEmployee?.panno ? 'Have PAN' : savedEmployee?.panrefno ? 'Applied' : 'Yet to Apply',
        age: calculateAge(savedEmployee?.dob),
        religion: savedEmployee?.religion || '',
        paddresstype: savedEmployee?.paddresstype ? savedEmployee?.paddresstype : '',
        ppersonalprefix: savedEmployee?.ppersonalprefix ? savedEmployee?.ppersonalprefix : '',
        presourcename: savedEmployee?.presourcename ? savedEmployee?.presourcename : '',
        plandmarkandpositionalprefix: savedEmployee?.plandmarkandpositionalprefix ? savedEmployee?.plandmarkandpositionalprefix : '',
        pgpscoordination: savedEmployee?.pgpscoordination ? savedEmployee?.pgpscoordination : '',
        caddresstype: savedEmployee?.caddresstype ? savedEmployee?.caddresstype : '',
        cpersonalprefix: savedEmployee?.cpersonalprefix ? savedEmployee?.cpersonalprefix : '',
        cresourcename: savedEmployee?.cresourcename ? savedEmployee?.cresourcename : '',
        clandmarkandpositionalprefix: savedEmployee?.clandmarkandpositionalprefix ? savedEmployee?.clandmarkandpositionalprefix : '',
        cgpscoordination: savedEmployee?.cgpscoordination ? savedEmployee?.cgpscoordination : '',

        pgenerateviapincode: Boolean(savedEmployee?.pgenerateviapincode) || false,
        pvillageorcity: savedEmployee?.pvillageorcity || '',
        pdistrict: savedEmployee?.pdistrict || '',
        cgenerateviapincode: Boolean(savedEmployee?.cgenerateviapincode) || false,
        cvillageorcity: savedEmployee?.cvillageorcity || '',
        cdistrict: savedEmployee?.cdistrict || '',
      });
      // setAge(response?.data?.suser?.age)
      if (params === 'Personal Information') {
        setIsPersonalInfoOpen(true);
      } else if (params === 'Reference Details') {
        setIsReferenceOpen(true);
      } else if (params === 'Permanent Address') {
        setIsPermanantAddressOpen(true);
      } else if (params === 'Current Address') {
        setIsCurrentAddressOpen(true);
      } else if (params === 'Document List') {
        setIsDocumentListOpen(true);
      } else if (params === 'Educational qualification') {
        setIsEducationalQualifyOpen(true);
      } else if (params === 'Additional qualification') {
        setIsAdditionalQualifyOpen(true);
      } else if (params === 'Work History') {
        setIsWorkHistoryOpen(true);
      } else if (params === 'Bank Details') {
        setIsBankDetailsOpen(true);
      }

      //permananet addresss
      if (Boolean(savedEmployee?.pgenerateviapincode) && savedEmployee?.ppincode !== '') {
        const result = await getPincodeDetails(savedEmployee?.ppincode);
        if (result?.status === 'Success' && result?.data?.length > 0) {
          setFromPinCodep(result?.data);
        } else {
          setFromPinCodep([]);
        }
      }
      if (Boolean(savedEmployee?.cgenerateviapincode) && savedEmployee?.cpincode !== '') {
        const result = await getPincodeDetails(savedEmployee?.cpincode);
        if (result?.status === 'Success' && result?.data?.length > 0) {
          setFromPinCodec(result?.data);
        } else {
          setFromPinCodec([]);
        }
      }
      // Find the corresponding Country, State, and City objects
      const country = Country.getAllCountries().find((country) => country.name === savedEmployee.ccountry);
      const state = State.getStatesOfCountry(country?.isoCode).find((state) => state.name === savedEmployee.cstate);
      const city = City.getCitiesOfState(state?.countryCode, state?.isoCode).find((city) => city.name === savedEmployee.ccity);

      // Find the corresponding Country, State, and City objects
      const countryp = Country.getAllCountries().find((country) => country.name === savedEmployee.pcountry);
      const statep = State.getStatesOfCountry(countryp?.isoCode).find((state) => state.name === savedEmployee.pstate);
      const cityp = City.getCitiesOfState(statep?.countryCode, statep?.isoCode).find((city) => city.name === savedEmployee.pcity);

      setSelectedCityc(city);
      setSelectedCountryc(country);
      setSelectedStatec(state);
      setSelectedCountryp(countryp);
      setSelectedStatep(statep);
      setSelectedCityp(cityp);
      setBankTodo(response?.data?.suser?.bankdetails);
      setBankTodoEdit(response?.data?.suser?.bankdetails);
      setoverallgrosstotal(response?.data?.suser.grosssalary);
      setModeexperience(response?.data?.suser.modeexperience);
      setTargetexperience(response?.data?.suser.targetexperience);
      setPrimaryWorkStationInput(response?.data?.suser?.workstationinput);
      setLoginNotAllot(response?.data?.suser);

      setSelectedCompany(response?.data?.suser?.company);
      setSelectedBranch(response?.data?.suser?.branch);
      setSelectedUnit(response?.data?.suser?.unit);
      setTodo(response?.data?.suser?.boardingLog[0]?.todo);
      setEmployeecodenew(savedEmployee.wordcheck === true ? savedEmployee.empcode : '');
      setBankTodo(
        response?.data?.suser?.bankdetails?.length > 0
          ? response?.data?.suser?.bankdetails?.map((data) => ({
              ...data,
              accountstatus: data?.accountstatus ?? 'In-Active',
            }))
          : []
      );
      setBankTodoEdit(
        response?.data?.suser?.bankdetails?.length > 0
          ? response?.data?.suser?.bankdetails?.map((data) => ({
              ...data,
              accountstatus: data?.accountstatus ?? 'In-Active',
            }))
          : []
      );
      setRoles(response?.data?.suser?.role);
      setFiles(responsenew?.data?.semployeedocument?.files);
      setFilesEdit(responsenew?.data?.semployeedocument?.files);
      setSelectedCountryp(countryp);
      setSelectedStatep(statep);
      setTargetpts(response?.data?.suser.targetpts);
      setSelectedDesignation(response?.data?.suser?.designation);
      setSelectedTeam(response?.data?.suser?.team);
      setEduTodo(response?.data?.suser?.eduTodo);
      setEduTodoEdit(response?.data?.suser?.eduTodo);
      setEnableLoginName(response?.data?.suser?.usernameautogenerate);
      setPrimaryWorkStation(response?.data?.suser?.workstation[0]);
      setAddQuaTodo(response?.data?.suser?.addAddQuaTodo);
      setAddQuaTodoEdit(response?.data?.suser?.addAddQuaTodo);
      setReferenceTodo(response?.data?.suser?.referencetodo);
      setReferenceTodoEdit(response?.data?.suser?.referencetodo);
      setWorkhistTodo(response?.data?.suser?.workhistTodo);
      setWorkhistTodoEdit(response?.data?.suser?.workhistTodo);
      setValueCate(response?.data?.suser?.weekoff);
      setFirst(response?.data?.suser?.firstname?.toLowerCase().split(' ').join(''));
      setSecond(response?.data?.suser?.lastname?.toLowerCase().split(' ').join(''));
      setSelectedOptionsWorkStation(
        Array.isArray(response?.data?.suser?.workstation)
          ? response?.data?.suser?.workstation.slice(1).map((x) => ({
              ...x,
              label: x,
              value: x,
            }))
          : []
      );
      setSelectedOptionsWorkStation(
        Array.isArray(response?.data?.suser?.workstation)
          ? response?.data?.suser?.workstation.slice(1, response?.data?.suser?.workstation?.length)?.map((x) => ({
              ...x,
              label: x,
              value: x,
            }))
          : []
      );
      setLoading(false);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const handleCloseVerify = () => {
    setIsPersonalInfoOpen(false);
    setIsReferenceOpen(false);
    setIsPermanantAddressOpen(false);
    setIsCurrentAddressOpen(false);
    setIsDocumentListOpen(false);
    setIsEducationalQualifyOpen(false);
    setIsAdditionalQualifyOpen(false);
    setIsWorkHistoryOpen(false);
    setIsBankDetailsOpen(false);
  };
  // Verify Popup model For Edit
  const [isPersonalInfoOpenEdit, setIsPersonalInfoOpenEdit] = useState('');
  const [isReferenceOpenEdit, setIsReferenceOpenEdit] = useState('');
  const [isPermanantAddressOpenEdit, setIsPermanantAddressOpenEdit] = useState('');
  const [isCurrentAddressOpenEdit, setIsCurrentAddressOpenEdit] = useState('');
  const [isDocumentListOpenEdit, setIsDocumentListOpenEdit] = useState('');
  const [isEducationalQualifyOpenEdit, setIsEducationalQualifyOpenEdit] = useState('');
  const [isAdditionalQualifyOpenEdit, setIsAdditionalQualifyOpenEdit] = useState('');
  const [isWorkHistoryOpenEdit, setIsWorkHistoryOpenEdit] = useState('');
  const [isBankDetailsOpenEdit, setIsBankDetailsOpenEdit] = useState('');
  const [infoProof, setInfoProof] = useState({
    personalinfoproof: '',
    processallotproof: '',
    explogproof: '',
    bankdetailsproof: '',
    eduqualiproof: '',
    addqualiproof: '',
    workhistproof: '',
    documentproof: '',
    caddressproof: '',
    paddressproof: '',
    boardingproof: '',
    referenceproof: '',
    loginproof: '',
  });
  const handleClickCorrected = async (e) => {
    setLoading(true);
    setLoadingMessage('Updating...');
    e.preventDefault();
    setPageName(!pageName);
    try {
      let updateObj = allInfo?.map((item) => ({
        name: item,
        edited: false,
        corrected: false,
      }));

      let editedVerify = verifyAll.verified?.map((item) => (item.name === verifyAll.information ? { ...item, corrected: true } : item));
      var editedVerifyMyVerify = verifyAll.verified?.map((item) => (item.name === verifyAll.information ? { ...item, corrected: true } : item))?.filter((item) => item.name === verifyAll.information);

      await axios.put(`${SERVICE.MYVERIFICATION_SINGLE}/${verifyAll?.templateId}`, {
        headers: {
          Authorization: `Bearer ${auth.APIToken}`,
        },
        verifiedInfo: editedVerify,
      });
      let datas = await axios.get(SERVICE.MYFIELDVERIFICATION);
      let isAvailed = datas?.data?.myverification?.find((item) => item?.employeeid == isUserRoleAccess?._id);

      if (isAvailed) {
        await axios.put(`${SERVICE.MYFIELDVERIFICATION_SINGLE}/${isAvailed?._id}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          // updatestatus: isAvailedStatus?.length > 0 ? isAvailedStatus : updateObj,
          ...(isPersonalInfoOpen && {
            firstname: String(allInformation?.firstname),
            prefix: String(allInformation?.prefix),
            lastname: String(allInformation?.lastname),
            legalname: String(allInformation?.legalname),
            callingname: String(allInformation?.callingname),
            fathername: String(allInformation?.fathername),
            mothername: String(allInformation?.mothername),
            gender: String(allInformation?.gender),
            maritalstatus: String(allInformation?.maritalstatus),
            dom: String(allInformation?.dom),
            dob: String(allInformation?.dob),
            religion: String(allInformation?.religion || ''),
            location: String(allInformation?.location),
            bloodgroup: String(allInformation?.bloodgroup),
            email: String(allInformation?.email),
            contactpersonal: String(allInformation?.contactpersonal),
            contactfamily: String(allInformation?.contactfamily),
            emergencyno: String(allInformation?.emergencyno),
            panno: String(allInformation?.panstatus === 'Have PAN' ? allInformation?.panno : ''),
            aadhar: String(allInformation?.aadhar),
            panstatus: String(allInformation?.panstatus),
            panrefno: String(allInformation?.panstatus === 'Applied' ? allInformation?.panrefno : ''),
            userprofile: String(final),
            faceDescriptor: employee?.faceDescriptor?.length > 0 ? employee?.faceDescriptor : [],
            // personalinfoproof: String(infoProof.personalinfoproof),
          }),

          //////reff
          ...(isReferenceOpen && {
            referencetodo: referenceTodo.length === 0 ? [] : [...referenceTodo],
            // referenceproof: String(infoProof.referenceproof),
          }),

          ///permanentadd
          ...(isPermanantAddressOpen && {
            paddresstype: String(allInformationEdit?.paddresstype || ''),
            ppersonalprefix: String(allInformationEdit?.ppersonalprefix || ''),
            presourcename: String(allInformationEdit?.presourcename || ''),
            plandmarkandpositionalprefix: String(allInformationEdit?.plandmarkandpositionalprefix || ''),
            pgpscoordination: String(allInformationEdit?.pgpscoordination || ''),
            pgenerateviapincode: Boolean(allInformationEdit?.pgenerateviapincode || false),
            pvillageorcity: String(allInformationEdit?.pvillageorcity || ''),
            pdistrict: String(allInformationEdit?.pdistrict || ''),
            pdoorno: String(allInformationEdit.pdoorno),
            pstreet: String(allInformationEdit.pstreet),
            parea: String(allInformationEdit.parea),
            plandmark: String(allInformationEdit.plandmark),
            ptaluk: String(allInformationEdit.ptaluk),
            ppost: String(allInformationEdit.ppost),
            ppincode: String(allInformationEdit.ppincode),
            pcountry: String(allInformationEdit.pcountry),
            pstate: String(allInformationEdit.pstate),
            pcity: String(allInformationEdit.pcity),
          }),

          ///currentadd
          ...(isCurrentAddressOpen && {
            caddresstype: String(allInformationEdit?.caddresstype || ''),
            cpersonalprefix: String(allInformationEdit?.cpersonalprefix || ''),
            cresourcename: String(allInformationEdit?.cresourcename || ''),
            clandmarkandpositionalprefix: String(allInformationEdit?.clandmarkandpositionalprefix || ''),
            cgpscoordination: String(allInformationEdit?.cgpscoordination || ''),
            cgenerateviapincode: Boolean(allInformationEdit?.cgenerateviapincode || false),
            cvillageorcity: String(allInformationEdit?.cvillageorcity || ''),
            cdistrict: String(allInformationEdit?.cdistrict || ''),
            cdoorno: String(allInformationEdit.cdoorno),
            cstreet: String(allInformationEdit.cstreet),
            carea: String(allInformationEdit.carea),
            clandmark: String(allInformationEdit.clandmark),
            ctaluk: String(allInformationEdit.ctaluk),
            cpost: String(allInformationEdit.cpost),
            cpincode: String(allInformationEdit.cpincode),
            ccountry: String(allInformationEdit.ccountry),
            cstate: String(allInformationEdit.cstate),
            ccity: String(allInformationEdit.ccity),

            // samesprmnt: Boolean(allInformationEdit.samesprmnt),

            // caddresstype: !allInformationEdit.samesprmnt ? String(allInformationEdit?.caddresstype || '') : String(allInformationEdit?.paddresstype || ''),
            // cpersonalprefix: !allInformationEdit.samesprmnt ? String(allInformationEdit?.cpersonalprefix || '') : String(allInformationEdit?.ppersonalprefix || ''),
            // cresourcename: !allInformationEdit.samesprmnt ? String(allInformationEdit?.cresourcename || '') : String(allInformationEdit?.presourcename || ''),
            // clandmarkandpositionalprefix: !allInformationEdit.samesprmnt ? String(allInformationEdit?.clandmarkandpositionalprefix || '') : String(allInformationEdit?.plandmarkandpositionalprefix || ''),
            // cgpscoordination: !allInformationEdit.samesprmnt ? String(allInformationEdit?.cgpscoordination || '') : String(allInformationEdit?.pgpscoordination || ''),
            // cgenerateviapincode: !allInformationEdit.samesprmnt ? Boolean(allInformationEdit?.cgenerateviapincode || false) : Boolean(allInformationEdit?.pgenerateviapincode || false),
            // cvillageorcity: !allInformationEdit.samesprmnt ? String(allInformationEdit?.cvillageorcity || "") : String(allInformationEdit?.pvillageorcity || ""),
            // cdistrict: !allInformationEdit.samesprmnt ? String(allInformationEdit?.cdistrict || "") : String(allInformationEdit?.pdistrict || ""),
            // cdoorno: String(!allInformationEdit.samesprmnt ? allInformationEdit.cdoorno : allInformationEdit.pdoorno),
            // cstreet: String(!allInformationEdit.samesprmnt ? allInformationEdit.cstreet : allInformationEdit.pstreet),
            // carea: String(!allInformationEdit.samesprmnt ? allInformationEdit.carea : allInformationEdit.parea),
            // clandmark: String(!allInformationEdit.samesprmnt ? allInformationEdit.clandmark : allInformationEdit.plandmark),
            // ctaluk: String(!allInformationEdit.samesprmnt ? allInformationEdit.ctaluk : allInformationEdit.ptaluk),
            // cpost: String(!allInformationEdit.samesprmnt ? allInformationEdit.cpost : allInformationEdit.ppost),
            // cpincode: String(!allInformationEdit.samesprmnt ? allInformationEdit.cpincode : allInformationEdit.ppincode),
            // ccountry: String(!allInformationEdit.samesprmnt ? allInformationEdit.ccountry : allInformationEdit.pcountry),
            // cstate: String(!allInformationEdit.samesprmnt ? allInformationEdit.cstate : allInformationEdit.pstate),
            // ccity: String(!allInformationEdit.samesprmnt ? allInformationEdit.ccity : allInformationEdit.pcity),

            // samesprmnt: Boolean(allInformationEdit.samesprmnt),
          }),

          ///document
          ...(isDocumentListOpen && {
            files: files ?? [],
            // documentproof: String(infoProof.documentproof),
          }),

          //educationqu
          ...(isEducationalQualifyOpen && {
            eduTodo: [...eduTodo],
            // eduqualiproof: String(infoProof.eduqualiproof),
          }),

          //addictonqua
          ...(isAdditionalQualifyOpen && {
            addAddQuaTodo: [...addAddQuaTodo],
            // addqualiproof: String(infoProof.addqualiproof),
          }),

          //workhist
          ...(isWorkHistoryOpen && {
            workhistTodo: [...workhistTodo],
            // workhistproof: String(infoProof.workhistproof),
          }),

          //banckdet
          ...(isBankDetailsOpen && {
            bankdetails: [...bankTodo],
            // bankdetailsproof: String(infoProof.bankdetailsproof),
          }),

          employeename: String(isUserRoleAccess?.companyname),
          employeeid: String(isUserRoleAccess?._id),
          empcode: String(allInformation.wordcheck === true ? employeecodenew : allInformation.empcode),
          verifiedInfo: [...isAvailed?.verifiedInfo, ...editedVerifyMyVerify],
          verificationstatus: String('Corrected'),
          username: enableLoginName ? String(third) : allInformation.username,
          usernameautogenerate: Boolean(enableLoginName),
          wordcheck: Boolean(allInformation.wordcheck),
          contactno: String(allInformation.contactno),
          details: String(allInformation.details),
          password: String(allInformation.password),
          date: String(new Date()),
          updatedby: [
            ...isUserRoleAccess.updatedby,
            {
              name: String(isUserRoleAccess?.username),
              date: String(new Date()),
            },
          ],
        });
      } else {
        var editedVerifyMyVerify = verifyAll.verified?.map((item) => (item.name === verifyAll.information ? { ...item, corrected: true } : item))?.filter((item) => item.name === verifyAll.information);

        await axios.post(`${SERVICE.MYFIELDVERIFICATION_CREATE}`, {
          headers: {
            Authorization: `Bearer ${auth.APIToken}`,
          },
          ...(isPersonalInfoOpen && {
            firstname: String(allInformation?.firstname),
            prefix: String(allInformation?.prefix),
            lastname: String(allInformation?.lastname),
            legalname: String(allInformation?.legalname),
            callingname: String(allInformation?.callingname),
            fathername: String(allInformation?.fathername),
            mothername: String(allInformation?.mothername),
            gender: String(allInformation?.gender),
            maritalstatus: String(allInformation?.maritalstatus),
            dom: String(allInformation?.dom),
            dob: String(allInformation?.dob),
            religion: String(allInformation?.religion || ''),
            location: String(allInformation?.location),
            bloodgroup: String(allInformation?.bloodgroup),
            email: String(allInformation?.email),
            contactpersonal: String(allInformation?.contactpersonal),
            contactfamily: String(allInformation?.contactfamily),
            emergencyno: String(allInformation?.emergencyno),
            panno: String(allInformation?.panstatus === 'Have PAN' ? allInformation?.panno : ''),
            aadhar: String(allInformation?.aadhar),
            panstatus: String(allInformation?.panstatus),
            panrefno: String(allInformation?.panstatus === 'Applied' ? allInformation?.panrefno : ''),
            userprofile: String(final),
            faceDescriptor: employee?.faceDescriptor?.length > 0 ? employee?.faceDescriptor : [],
            // personalinfoproof: String(infoProof.personalinfoproof),
          }),

          //////reff
          ...(isReferenceOpen && {
            referencetodo: referenceTodo.length === 0 ? [] : [...referenceTodo],
            // referenceproof: String(infoProof.referenceproof),
          }),

          ///permanentadd
          ...(isPermanantAddressOpen && {
            paddresstype: String(allInformationEdit?.paddresstype || ''),
            ppersonalprefix: String(allInformationEdit?.ppersonalprefix || ''),
            presourcename: String(allInformationEdit?.presourcename || ''),
            plandmarkandpositionalprefix: String(allInformationEdit?.plandmarkandpositionalprefix || ''),
            pgpscoordination: String(allInformationEdit?.pgpscoordination || ''),
            pgenerateviapincode: Boolean(allInformationEdit?.pgenerateviapincode || false),
            pvillageorcity: String(allInformationEdit?.pvillageorcity || ''),
            pdistrict: String(allInformationEdit?.pdistrict || ''),
            pdoorno: String(allInformationEdit.pdoorno || ''),
            pstreet: String(allInformationEdit.pstreet || ''),
            parea: String(allInformationEdit.parea || ''),
            plandmark: String(allInformationEdit.plandmark || ''),
            ptaluk: String(allInformationEdit.ptaluk || ''),
            ppost: String(allInformationEdit.ppost || ''),
            ppincode: String(allInformationEdit.ppincode || ''),
            pcountry: String(allInformationEdit.pcountry || ''),
            pstate: String(allInformationEdit.pstate || ''),
            pcity: String(allInformationEdit.pcity || ''),
          }),

          ///currentadd
          ...(isCurrentAddressOpen && {
            caddresstype: String(allInformationEdit?.caddresstype || ''),
            cpersonalprefix: String(allInformationEdit?.cpersonalprefix || ''),
            cresourcename: String(allInformationEdit?.cresourcename || ''),
            clandmarkandpositionalprefix: String(allInformationEdit?.clandmarkandpositionalprefix || ''),
            cgpscoordination: String(allInformationEdit?.cgpscoordination || ''),
            cgenerateviapincode: Boolean(allInformationEdit?.cgenerateviapincode || false),
            cvillageorcity: String(allInformationEdit?.cvillageorcity || ''),
            cdistrict: String(allInformationEdit?.cdistrict || ''),
            cdoorno: String(allInformationEdit.cdoorno),
            cstreet: String(allInformationEdit.cstreet),
            carea: String(allInformationEdit.carea),
            clandmark: String(allInformationEdit.clandmark),
            ctaluk: String(allInformationEdit.ctaluk),
            cpost: String(allInformationEdit.cpost),
            cpincode: String(allInformationEdit.cpincode),
            ccountry: String(allInformationEdit.ccountry),
            cstate: String(allInformationEdit.cstate),
            ccity: String(allInformationEdit.ccity),
          }),

          ///document
          ...(isDocumentListOpen && {
            files: files ?? [],
            // documentproof: String(infoProof.documentproof),
          }),

          //educationqu
          ...(isEducationalQualifyOpen && {
            eduTodo: [...eduTodo],
            // eduqualiproof: String(infoProof.eduqualiproof),
          }),

          //addictonqua
          ...(isAdditionalQualifyOpen && {
            addAddQuaTodo: [...addAddQuaTodo],
            // addqualiproof: String(infoProof.addqualiproof),
          }),

          //workhist
          ...(isWorkHistoryOpen && {
            workhistTodo: [...workhistTodo],
            // workhistproof: String(infoProof.workhistproof),
          }),

          //banckdet
          ...(isBankDetailsOpen && {
            bankdetails: [...bankTodo],
            // bankdetailsproof: String(infoProof.bankdetailsproof),
          }),

          employeename: String(isUserRoleAccess?.companyname),
          employeeid: String(isUserRoleAccess?._id),
          empcode: String(allInformation.wordcheck === true ? employeecodenew : allInformation.empcode),
          verifiedInfo: [...editedVerifyMyVerify],
          updatestatus: [...editedVerifyMyVerify],

          verificationstatus: String('Corrected'),
          username: enableLoginName ? String(third) : allInformation.username,
          usernameautogenerate: Boolean(enableLoginName),
          // dot: String(allInformation.dot),
          // doj: String(allInformation.doj),
          wordcheck: Boolean(allInformation.wordcheck),
          contactno: String(allInformation.contactno),
          details: String(allInformation.details),
          password: String(allInformation.password),
          date: String(new Date()),

          updatedby: [
            ...isUserRoleAccess.updatedby,
            {
              name: String(isUserRoleAccess?.username),
              date: String(new Date()),
            },
          ],
        });
      }
      await getCode();

      setPopupContent('Thanks For Your Verification!');
      setPopupSeverity('success');
      handleClickOpenPopup();
      setIsPersonalInfoOpen(false);
      setIsReferenceOpen(false);
      setIsPermanantAddressOpen(false);
      setIsCurrentAddressOpen(false);
      setIsDocumentListOpen(false);
      setIsWorkHistoryOpen(false);
      setIsEducationalQualifyOpen(false);
      setIsAdditionalQualifyOpen(false);
      setIsBankDetailsOpen(false);
      setLoading(false);
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  //Boardingupadate updateby edit page...
  let updateby = username.updatedby;
  let addedby = username.addedby;
  // Excel
  const fileName = 'MyVerification';
  //print...
  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'MyVerification',
    pageStyle: 'print',
  });
  //table entries ..,.
  const [items, setItems] = useState([]);
  // const addSerialNumber = () => {
  //     const itemsWithSerialNumber = employees?.map((item, index) => ({ ...item, serialNumber: index + 1 }));
  //     setItems(itemsWithSerialNumber);
  // };
  // useEffect(() => {
  //     addSerialNumber();
  // }, [employees]);

  const addSerialNumber = (datas) => {
    setItems(datas);
  };

  useEffect(() => {
    addSerialNumber(employees);
  }, [employees]);

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
  const searchTerms = searchQuery.toLowerCase().split(' ');
  // Modify the filtering logic to check each term
  const filteredDatas = items?.filter((item) => {
    return searchTerms.every((term) => Object.values(item).join(' ').toLowerCase().includes(term));
  });
  const filteredData = filteredDatas?.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(employees?.length / pageSize);
  const visiblePages = Math.min(totalPages, 3);
  const firstVisiblePage = Math.max(1, page - 1);
  const lastVisiblePage = Math.min(firstVisiblePage + visiblePages - 1, totalPages);
  const pageNumbers = [];
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
      field: 'serialNumber',
      headerName: 'SNo',
      flex: 0,
      width: 75,
      hide: !columnVisibility.serialNumber,
      headerClassName: 'bold-header',
    },
    { field: 'company', headerName: 'Company', flex: 0, width: 140, hide: !columnVisibility.company, headerClassName: 'bold-header' },
    { field: 'branch', headerName: 'Branch', flex: 0, width: 160, hide: !columnVisibility.branch, headerClassName: 'bold-header' },
    { field: 'unit', headerName: 'Unit', flex: 0, width: 120, hide: !columnVisibility.unit, headerClassName: 'bold-header' },
    { field: 'team', headerName: 'Team', flex: 0, width: 120, hide: !columnVisibility.team, headerClassName: 'bold-header' },
    { field: 'employeename', headerName: 'Employee Name', flex: 0, width: 180, hide: !columnVisibility.employeename, headerClassName: 'bold-header' },
    { field: 'information', headerName: 'Information', flex: 0, width: 180, hide: !columnVisibility.information, headerClassName: 'bold-header' },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 0,
      width: 180,
      minHeight: '40px !important',
      sortable: false,
      hide: !columnVisibility.actions,
      headerClassName: 'bold-header',
      cellRenderer: (params) => (
        <Grid sx={{ display: 'flex', gap: '10px' }}>
          {isUserRoleCompare?.includes('emyverification') && (
            <Button
              variant="contained"
              onClick={() => {
                handleClickOpenVerify(params.data.information, params.data);
              }}
            >
              Please Verify
            </Button>
          )}
        </Grid>
      ),
    },
  ];
  const rowDataTable = filteredData?.map((item, index) => {
    return {
      id: index,
      templateId: item?.templateId,
      verified: item?.verified,
      corrected: item?.corrected,
      serialNumber: item?.serialNumber,
      company: item?.company,
      branch: item?.branch,
      unit: item?.unit,
      team: item?.team,
      employeename: item?.employeename,
      filename: item?.filename,
      information: item?.information,
    };
  });
  const rowsWithCheckboxes = rowDataTable?.map((row) => ({
    ...row,
    // Create a custom field for rendering the checkbox
    checkbox: selectedRows.includes(row?.id),
  }));
  // Show All Columns functionality
  const handleShowAllColumns = () => {
    const updatedVisibility = { ...columnVisibility };
    for (const columnKey in updatedVisibility) {
      updatedVisibility[columnKey] = true;
    }
    setColumnVisibility(updatedVisibility);
  };
  useEffect(() => {
    // Save column visibility to localStorage whenever it changes
    localStorage.setItem('columnVisibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  useEffect(() => {
    // Retrieve column visibility from localStorage (if available)
    const savedVisibility = localStorage.getItem('columnVisibility');
    if (savedVisibility) {
      setColumnVisibility(JSON.parse(savedVisibility));
    }
  }, []);

  // Function to filter columns based on search query
  const filteredColumns = columnDataTable.filter((column) => column.headerName.toLowerCase().includes(searchQueryManage.toLowerCase()));
  // Manage Columns functionality
  const toggleColumnVisibility = (field) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [field]: !prevVisibility[field],
    }));
  };
  // JSX for the "Manage Columns" popover content
  const manageColumnsContent = (
    <Box style={{ padding: '10px', minWidth: '325px', '& .MuiDialogContent-root': { padding: '10px 0' } }}>
      <Typography variant="h6">Manage Columns</Typography>
      <IconButton
        aria-label="close"
        onClick={handleCloseManageColumns}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ position: 'relative', margin: '10px' }}>
        <TextField label="Find column" variant="standard" fullWidth value={searchQueryManage} onChange={(e) => setSearchQueryManage(e.target.value)} sx={{ marginBottom: 5, position: 'absolute' }} />
      </Box>
      <br />
      <br />
      <DialogContent sx={{ minWidth: 'auto', height: '200px', position: 'relative' }}>
        <List sx={{ overflow: 'auto', height: '100%' }}>
          {filteredColumns?.map((column) => (
            <ListItem key={column.field}>
              <ListItemText sx={{ display: 'flex' }} primary={<Switch sx={{ marginTop: '-5px' }} size="small" checked={columnVisibility[column.field]} onChange={() => toggleColumnVisibility(column.field)} />} secondary={column.field === 'checkbox' ? 'Checkbox' : column.headerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Grid container>
          <Grid item md={4}>
            <Button variant="text" sx={{ textTransform: 'none' }} onClick={() => setColumnVisibility(initialColumnVisibility)}>
              Show All
            </Button>
          </Grid>
          <Grid item md={4}></Grid>
          <Grid item md={4}>
            <Button
              variant="text"
              sx={{ textTransform: 'none' }}
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
  useEffect(() => {
    getCode();
  }, []);
  const accounttypes = [
    { value: 'ALLAHABAD BANK - AB', label: 'ALLAHABAD BANK - AB' },
    { value: 'ANDHRA BANK - ADB', label: 'ANDHRA BANK - ADB' },
    { value: 'AXIS BANK - AXIS', label: 'AXIS BANK - AXIS' },
    { value: 'STATE BANK OF INDIA - SBI', label: 'STATE BANK OF INDIA - SBI' },
    { value: 'BANK OF BARODA - BOB', label: 'BANK OF BARODA - BOB' },
    { value: 'CITY UNION BANK - CUB', label: 'CITY UNION BANK - CUB' },
    { value: 'UCO BANK - UCO', label: 'UCO BANK - UCO' },
    { value: 'UNION BANK OF INDIA - UBI', label: 'UNION BANK OF INDIA - UBI' },
    { value: 'BANK OF INDIA - BOI', label: 'BANK OF INDIA - BOI' },
    {
      value: 'BANDHAN BANK LIMITED - BBL',
      label: 'BANDHAN BANK LIMITED - BBL',
    },
    { value: 'CANARA BANK - CB', label: 'CANARA BANK - CB' },
    { value: 'GRAMIN VIKASH BANK - GVB', label: 'GRAMIN VIKASH BANK - GVB' },
    { value: 'CORPORATION BANK - CORP', label: 'CORPORATION BANK - CORP' },
    { value: 'INDIAN BANK - IB', label: 'INDIAN BANK - IB' },
    {
      value: 'INDIAN OVERSEAS BANK - IOB',
      label: 'INDIAN OVERSEAS BANK - IOB',
    },
    {
      value: 'ORIENTAL BANK OF COMMERCE - OBC',
      label: 'ORIENTAL BANK OF COMMERCE - OBC',
    },
    {
      value: 'PUNJAB AND SIND BANK - PSB',
      label: 'PUNJAB AND SIND BANK - PSB',
    },
    {
      value: 'PUNJAB NATIONAL BANK - PNB',
      label: 'PUNJAB NATIONAL BANK - PNB',
    },
    {
      value: 'RESERVE BANK OF INDIA - RBI',
      label: 'RESERVE BANK OF INDIA - RBI',
    },
    { value: 'SOUTH INDIAN BANK - SIB', label: 'SOUTH INDIAN BANK - SIB' },
    {
      value: 'UNITED BANK OF INDIA - UBI',
      label: 'UNITED BANK OF INDIA - UBI',
    },
    {
      value: 'CENTRAL BANK OF INDIA - CBI',
      label: 'CENTRAL BANK OF INDIA - CBI',
    },
    { value: 'VIJAYA BANK - VB', label: 'VIJAYA BANK - VB' },
    { value: 'DENA BANK - DEN', label: 'DENA BANK - DEN' },
    {
      value: 'BHARATIYA MAHILA BANK LIMITED - BMB',
      label: 'BHARATIYA MAHILA BANK LIMITED - BMB',
    },
    { value: 'FEDERAL BANK - FB', label: 'FEDERAL BANK - FB' },
    { value: 'HDFC BANK - HDFC', label: 'HDFC BANK - HDFC' },
    { value: 'ICICI BANK - ICICI', label: 'ICICI BANK - ICICI' },
    { value: 'IDBI BANK - IDBI', label: 'IDBI BANK - IDBI' },
    { value: 'PAYTM BANK - PAYTM', label: 'PAYTM BANK - PAYTM' },
    { value: 'FINO PAYMENT BANK - FINO', label: 'FINO PAYMENT BANK - FINO' },
    { value: 'INDUSIND BANK - IIB', label: 'INDUSIND BANK - IIB' },
    { value: 'KARNATAKA BANK - KBL', label: 'KARNATAKA BANK - KBL' },
    {
      value: 'KOTAK MAHINDRA BANK - KOTAK',
      label: 'KOTAK MAHINDRA BANK - KOTAK',
    },
    { value: 'YES BANK - YES', label: 'YES BANK - YES' },
    { value: 'SYNDICATE BANK - SYN', label: 'SYNDICATE BANK - SYN' },
    { value: 'BANK OF MAHARASHTRA - BOM', label: 'BANK OF MAHARASHTRA - BOM' },
    { value: 'DCB BANK - DCB', label: 'DCB BANK - DCB' },
    { value: 'IDFC BANK - IDFC', label: 'IDFC BANK - IDFC' },
    {
      value: 'JAMMU AND KASHMIR BANK - J&K',
      label: 'JAMMU AND KASHMIR BANK - J&K',
    },
    { value: 'KARUR VYSYA BANK - KVB', label: 'KARUR VYSYA BANK - KVB' },
    { value: 'RBL BANK - RBL', label: 'RBL BANK - RBL' },
    { value: 'DHANLAXMI BANK - DLB', label: 'DHANLAXMI BANK - DLB' },
    { value: 'CSB BANK - CSB', label: 'CSB BANK - CSB' },
    {
      value: 'TAMILNAD MERCANTILE BANK - TMB',
      label: 'TAMILNAD MERCANTILE BANK - TMB',
    },
  ];
  // Image Upload
  const handleImageUploadproff = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      // The base64 string representation of the image
      const base64String = reader.result;
      setInfoProof({ ...infoProof, personalinfoproof: base64String });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleImageUploadref = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      // The base64 string representation of the image
      const base64String = reader.result;
      setInfoProof({ ...infoProof, referenceproof: base64String });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleImageUploadpadd = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      // The base64 string representation of the image
      const base64String = reader.result;
      setInfoProof({ ...infoProof, paddressproof: base64String });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleImageUploadcadd = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      // The base64 string representation of the image
      const base64String = reader.result;
      setInfoProof({ ...infoProof, caddressproof: base64String });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleImageUploaddoc = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      // The base64 string representation of the image
      const base64String = reader.result;
      setInfoProof({ ...infoProof, documentproof: base64String });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleImageUploadedu = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      // The base64 string representation of the image
      const base64String = reader.result;
      setInfoProof({ ...infoProof, eduqualiproof: base64String });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleImageUploadadd = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      // The base64 string representation of the image
      const base64String = reader.result;
      setInfoProof({ ...infoProof, addqualiproof: base64String });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleImageUploadwork = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      // The base64 string representation of the image
      const base64String = reader.result;
      setInfoProof({ ...infoProof, workhistproof: base64String });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleImageUploadbank = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      // The base64 string representation of the image
      const base64String = reader.result;
      setInfoProof({ ...infoProof, bankdetailsproof: base64String });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const [bankDetails, setBankDetails] = useState(null);
  const [ifscModalOpen, setIfscModalOpen] = useState(false);
  const handleModalClose = () => {
    setIfscModalOpen(false);
    setBankDetails(null); // Reset bank details
  };
  const handleModalOpen = () => {
    setIfscModalOpen(true);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const capitalizedValue = value.toUpperCase();
    const regex = /^[A-Z0-9]*$/;
    if (!regex.test(capitalizedValue)) {
      return;
    }
    if (name === 'ifscCode' && capitalizedValue.length > 11) {
      setAllInformationEdit({
        ...allInformationEdit,
        [name]: capitalizedValue.slice(0, 11),
      });
    } else {
      setAllInformationEdit({
        ...allInformationEdit,
        [name]: capitalizedValue,
      });
    }
  };
  const fetchBankDetails = async () => {
    setPageName(!pageName);
    try {
      const response = await axios.get(`https://ifsc.razorpay.com/${allInformationEdit.ifscCode}`);
      if (response.status === 200) {
        setBankDetails(response.data);
      } else {
        setPopupContentMalert('Bank Details Not Found!');
        setPopupSeverityMalert('info');
        handleClickOpenPopupMalert();
      }
    } catch (err) {
      handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
    }
  };
  const typeofaccount = [
    { label: 'Savings', value: 'Savings' },
    { label: 'Salary', value: 'Salary' },
  ];
  const [bankTodo, setBankTodo] = useState([]);
  const [bankTodoEdit, setBankTodoEdit] = useState([]);
  const handleBankTodoChange = (index, field, value) => {
    const updatedBankTodo = [...bankTodoEdit];
    updatedBankTodo[index] = { ...updatedBankTodo[index], [field]: value };
    setBankTodoEdit(updatedBankTodo);
  };
  const deleteTodoEdit = (index) => {
    setBankTodoEdit(bankTodoEdit.filter((_, i) => i !== index));
  };
  const [bankUpload, setBankUpload] = useState([]);
  const handleBankDetailsUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        setBankUpload([
          {
            name: file.name,
            preview: reader.result,
            data: base64String,
          },
        ]);
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
    } else {
      console.error('No file selected');
    }
  };
  const handleBankTodoChangeProof = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const updatedBankTodo = [...bankTodoEdit];
        const base64String = reader.result.split(',')[1];
        updatedBankTodo[index] = {
          ...updatedBankTodo[index],
          proof: [
            {
              name: file.name,
              preview: reader.result,
              data: base64String,
            },
          ],
        };
        setBankTodoEdit(updatedBankTodo);
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };
    } else {
      console.error('No file selected');
    }
  };
  const handleDeleteProof = (index) => {
    setBankTodoEdit((prevArray) => {
      const newArray = [...prevArray];
      newArray[index].proof = [];
      return newArray;
    });
  };
  const accountstatus = [
    { label: 'Active', value: 'Active' },
    { label: 'In-Active', value: 'In-Active' },
  ];
  const handleBankTodo = () => {
    let newObject = {
      bankname: allInformationEdit.bankname,
      bankbranchname: allInformationEdit.bankbranchname,
      accountholdername: allInformationEdit.accountholdername,
      accountnumber: allInformationEdit.accountnumber,
      ifsccode: allInformationEdit.ifsccode,
      accounttype: allInformationEdit.accounttype,
      accountstatus: allInformationEdit.accountstatus,
      proof: bankUpload,
    };
    const isValidObject = (obj) => {
      for (let key in obj) {
        if (obj[key] === '' || obj[key] === undefined || obj[key] === null || obj[key] === 'Please Select Account Type') {
          return false;
        }
      }
      return true;
    };
    const exists = bankTodoEdit.some((obj) => obj.accountnumber === newObject.accountnumber);
    const activeexists = bankTodoEdit.some((obj) => obj.accountstatus === 'Active');
    if (!isValidObject(newObject)) {
      setPopupContentMalert('Please fill all the Fields!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (exists) {
      setPopupContentMalert('Account Number Already Exist!');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else if (allInformationEdit.accountstatus === 'Active' && activeexists) {
      setPopupContentMalert('Only one active account is allowed at a time.');
      setPopupSeverityMalert('info');
      handleClickOpenPopupMalert();
    } else {
      setBankTodoEdit((prevState) => [...prevState, newObject]);
      setAllInformationEdit((prev) => ({
        ...prev,
        bankname: 'ICICI BANK - ICICI',
        bankbranchname: '',
        accountholdername: '',
        accountnumber: '',
        ifsccode: '',
        accounttype: 'Please Select Account Type',
        accountstatus: 'In-Active',
      }));
      setBankUpload([]);
    }
  };
  return (
    <Box>
      <Headtitle title={'My Verification'} />
      {/* ****** Header Content ****** */}
      <PageHeading title="My Verification" modulename="Settings" submodulename="My Verification" mainpagename="" subpagename="" subsubpagename="" />
      <br />
      {isUserRoleCompare?.includes('lmyverification') && (
        <>
          <Box sx={userStyle.container}>
            <Grid item xs={8}>
              <Typography sx={userStyle.importheadtext}>MY Verification List</Typography>
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
                    sx={{ width: '77px' }}
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
              <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box>
                  {isUserRoleCompare?.includes('excelmyverification') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          setFormat('xl');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileExcel />
                        &ensp;Export to Excel&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('csvmyverification') && (
                    <>
                      <Button
                        onClick={(e) => {
                          setIsFilterOpen(true);
                          setFormat('csv');
                        }}
                        sx={userStyle.buttongrp}
                      >
                        <FaFileCsv />
                        &ensp;Export to CSV&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('printmyverification') && (
                    <>
                      <Button sx={userStyle.buttongrp} onClick={handleprint}>
                        &ensp;
                        <FaPrint />
                        &ensp;Print&ensp;
                      </Button>
                    </>
                  )}
                  {isUserRoleCompare?.includes('pdfmyverification') && (
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
                  {isUserRoleCompare?.includes('imagemyverification') && (
                    <Button sx={userStyle.buttongrp} onClick={handleCaptureImage}>
                      {' '}
                      <ImageIcon sx={{ fontSize: '15px' }} /> &ensp;Image&ensp;{' '}
                    </Button>
                  )}
                </Box>
              </Grid>

              <Grid item md={2} xs={6} sm={6}>
                <AggregatedSearchBar
                  columnDataTable={columnDataTable}
                  setItems={setItems}
                  addSerialNumber={addSerialNumber}
                  setPage={setPage}
                  maindatas={employees}
                  setSearchedString={setSearchedString}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  paginated={false}
                  totalDatas={employees}
                />
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
            <br />
            <br />
            {!isemployeedetail ? (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <ThreeDots height="80" width="80" radius="9" color="#1976d2" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClassName="" visible={true} />
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
                  // totalDatas={totalProjects}
                  searchQuery={searchQuery}
                  handleShowAllColumns={handleShowAllColumns}
                  setFilteredRowData={setFilteredRowData}
                  filteredRowData={filteredRowData}
                  setFilteredChanges={setFilteredChanges}
                  filteredChanges={filteredChanges}
                  gridRefTableImg={gridRefTableImg}
                  itemsList={employees}
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
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {manageColumnsContent}
      </Popover>

      <Box>
        {/* ALERT DIALOG */}
        <Dialog open={isDeleteOpenalert} onClose={handleCloseModalert} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '70px', color: 'orange' }} />
            <Typography variant="h6" sx={{ color: 'black', textAlign: 'center' }}>
              Please Select any Row
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus variant="contained" color="error" onClick={handleCloseModalert}>
              {' '}
              OK{' '}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        <Dialog onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6"></Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error">
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Box>
        <Dialog open={isErrorOpen} onClose={handleCloseerr} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent sx={{ width: '350px', textAlign: 'center', alignItems: 'center' }}>
            <Typography variant="h6">{showAlert}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleCloseerr}>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      {/* Personal Information Popup For View*/}
      <Dialog open={isPersonalInfoOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth={true} maxWidth="lg" sx={{ marginTop: '80px' }}>
        <Box sx={userStyle.selectcontainer}>
          <Typography sx={userStyle.SubHeaderText}>Personal Information </Typography>
          <br />
          <br />
          <>
            <Grid container spacing={2}>
              <Grid item md={6} sm={12} xs={12}>
                <Typography>First Name</Typography>
                <Grid container sx={{ display: 'flex' }}>
                  <Grid item md={3} sm={3} xs={3}>
                    <FormControl size="small" fullWidth>
                      <OutlinedInput value={allInformation.prefix} readOnly={true} />
                    </FormControl>
                  </Grid>
                  <Grid item md={9} sm={9} xs={9}>
                    <FormControl size="small" fullWidth>
                      <OutlinedInput readOnly={true} value={allInformation.firstname} />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Last Name</Typography>
                  <OutlinedInput id="component-outlined" value={allInformation.lastname} readOnly />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Legal Name</Typography>
                  <OutlinedInput id="component-outlined" readOnly value={allInformation.legalname} />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Calling Name</Typography>
                  <OutlinedInput id="component-outlined" readOnly value={allInformation.callingname} />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Father Name</Typography>
                  <OutlinedInput id="component-outlined" readOnly value={allInformation.fathername} />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Mother Name</Typography>
                  <OutlinedInput id="component-outlined" value={allInformation.mothername} readOnly />
                </FormControl>
              </Grid>
              <Grid item md={9} sm={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Gender</Typography>
                      <OutlinedInput id="component-outlined" value={allInformation.gender} readOnly type="text" size="small" name="dom" />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Marital Status</Typography>
                      <OutlinedInput id="component-outlined" value={allInformation.maritalstatus} readOnly type="text" size="small" name="dom" />
                    </FormControl>
                  </Grid>
                  {allInformation.maritalstatus === 'Married' && (
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Date Of Marriage</Typography>
                        <OutlinedInput id="component-outlined" value={allInformation.dom !== '' ? moment(allInformation.dom)?.format('DD-MM-YYYY') : ''} readOnly type="text" size="small" name="dom" />
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Date Of Birth</Typography>
                      <OutlinedInput id="component-outlined" value={allInformation.dob ? moment(allInformation.dob)?.format('DD-MM-YYYY') : ''} readOnly type="text" size="small" name="dob" />
                    </FormControl>
                  </Grid>
                  <Grid item md={1.5} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Age</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        value={allInformation.dob === '' ? '' : allInformation?.age}
                        // value={age}
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Religion</Typography>
                      <OutlinedInput id="component-outlined" type="text" placeholder="religion" value={allInformation.religion} readOnly />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Blood Group</Typography>
                      <OutlinedInput id="component-outlined" type="text" placeholder="bloodgroup" value={allInformation?.bloodgroup} readOnly />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Email</Typography>
                      <TextField id="email" type="email" placeholder="Email" value={allInformation.email} readOnly />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Location</Typography>
                      <OutlinedInput id="component-outlined" type="text" placeholder="Location" value={allInformation.location} readOnly />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Contact No (personal)</Typography>
                      <OutlinedInput id="component-outlined" type="number" sx={userStyle.input} placeholder="Contact No (personal)" value={allInformation.contactpersonal} readOnly />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Contact No (Family)</Typography>
                      <OutlinedInput id="component-outlined" type="number" sx={userStyle.input} placeholder="Contact No (Family)" value={allInformation.contactfamily} readOnly />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Emergency No</Typography>
                      <OutlinedInput id="component-outlined" type="number" sx={userStyle.input} placeholder="Emergency No (Emergency)" value={allInformation.emergencyno} readOnly />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Aadhar No</Typography>
                      <OutlinedInput id="component-outlined" type="Number" sx={userStyle.input} placeholder="Aadhar No" value={allInformation.aadhar} readOnly />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>PAN Card Status</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        // type="Number"
                        sx={userStyle.input}
                        placeholder="PAN Status"
                        value={allInformation.panstatus}
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  {allInformation?.panno?.length > 0 && (
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Pan No</Typography>
                        <OutlinedInput id="component-outlined" type="text" placeholder="Pan No" value={allInformation.panno} readOnly />
                      </FormControl>
                    </Grid>
                  )}
                  {allInformation?.panrefno?.length > 0 && (
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Application Ref No</Typography>
                        <OutlinedInput id="component-outlined" type="text" placeholder="Pan No" value={allInformation.panrefno} readOnly />
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <InputLabel sx={{ m: 1 }}>Profile Image </InputLabel>
                <>
                  <img style={{ height: 120 }} src={profileImg} alt="" />
                </>
              </Grid>
              <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex' }}>
                <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCloseVerify}
                    type="button"
                    sx={{
                      ...buttonStyles.btncancel,
                      height: '30px',
                      minWidth: '30px',
                      marginTop: '28px',
                      padding: '6px 10px',
                    }}
                  >
                    Back
                  </Button>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12} sx={{ display: 'flex' }}>
                <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
                  <Button
                    variant="contained"
                    color="success"
                    type="button"
                    sx={{
                      height: '30px',
                      minWidth: '30px',
                      marginTop: '28px',
                      padding: '6px 10px',
                    }}
                    onClick={(e) => {
                      handleClickCorrected(e);
                    }}
                  >
                    Correct
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setAddOpenalertPersonal(true)}
                    type="button"
                    sx={{
                      height: '30px',
                      minWidth: '30px',
                      marginTop: '28px',
                      padding: '6px 10px',
                    }}
                  >
                    InCorrect
                  </Button>
                </FormControl>
              </Grid>
            </Grid>
          </>
          <br />
        </Box>
      </Dialog>
      {/* Reference Detail Popup For View*/}
      <Dialog open={isReferenceOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="lg" sx={{ marginTop: '80px' }}>
        <Box sx={userStyle.selectcontainer}>
          <Grid item xs={8}>
            <Typography sx={userStyle.SubHeaderText}>Reference Details </Typography>
            <br />
          </Grid>
          <Grid container spacing={2}>
            <Grid item md={12} sm={12} xs={12}>
              {' '}
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable">
                  <TableHead sx={{ fontWeight: '600' }}>
                    <StyledTableRow>
                      <StyledTableCell>SNo</StyledTableCell>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Relationship</StyledTableCell>
                      <StyledTableCell>Occupation</StyledTableCell>
                      <StyledTableCell>Contact</StyledTableCell>
                      <StyledTableCell>Details</StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody align="left">
                    {referenceTodo?.length > 0 ? (
                      referenceTodo?.map((row, index) => (
                        <StyledTableRow>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{row?.name}</StyledTableCell>
                          <StyledTableCell>{row.relationship}</StyledTableCell>
                          <StyledTableCell>{row.occupation}</StyledTableCell>
                          <StyledTableCell>{row.contact}</StyledTableCell>
                          <StyledTableCell>{row.details}</StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        {' '}
                        <StyledTableCell colSpan={8} align="center">
                          No Data Available
                        </StyledTableCell>{' '}
                      </StyledTableRow>
                    )}
                    <StyledTableRow></StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex' }}>
              <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseVerify}
                  type="button"
                  sx={{
                    ...buttonStyles.btncancel,
                    height: '30px',
                    minWidth: '30px',
                    marginTop: '28px',
                    padding: '6px 10px',
                  }}
                >
                  Back
                </Button>
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12} sx={{ display: 'flex' }}>
              <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
                <Button
                  variant="contained"
                  color="success"
                  type="button"
                  sx={{
                    height: '30px',
                    minWidth: '30px',
                    marginTop: '28px',
                    padding: '6px 10px',
                  }}
                  onClick={(e) => {
                    handleClickCorrected(e);
                  }}
                >
                  Correct
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setAddOpenalertReference(true)}
                  type="button"
                  sx={{
                    height: '30px',
                    minWidth: '30px',
                    marginTop: '28px',
                    padding: '6px 10px',
                  }}
                >
                  InCorrect
                </Button>
              </FormControl>
            </Grid>
          </Grid>{' '}
          <br />
        </Box>
      </Dialog>
      {/* Permanent Address Popup For View*/}
      <Dialog open={isPermanantAddressOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="lg" sx={{ marginTop: '80px' }}>
        <Box sx={userStyle.selectcontainer}>
          <Typography sx={userStyle.SubHeaderText}> Permanent Address</Typography>
          <br />
          <br />
          <>
            <Grid container spacing={2}>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Address Type</Typography>
                  <OutlinedInput id="component-outlined" type="text" value={allInformation?.paddresstype} readOnly />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Personal Prefix</Typography>
                  <OutlinedInput id="component-outlined" type="text" value={allInformation?.ppersonalprefix} readOnly />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Reference Name</Typography>
                  <OutlinedInput id="component-outlined" type="text" value={allInformation?.presourcename} readOnly />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl size="small" fullWidth>
                  <Typography>Country</Typography>
                  <OutlinedInput value={allInformation?.pcountry} readOnly={true} />
                </FormControl>
                {allInformation?.pcountry === 'India' && <FormControlLabel control={<Checkbox checked={Boolean(allInformation?.pgenerateviapincode)} readOnly isDisabled={true} />} label="Generate Via Pincode" />}
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl size="small" fullWidth>
                  <Typography>Pincode</Typography>
                  <OutlinedInput id="component-outlined" type="number" sx={userStyle.input} readOnly value={allInformation.ppincode} />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>State</Typography>
                  <OutlinedInput value={allInformation?.pstate} readOnly={true} />
                </FormControl>
              </Grid>

              {allInformation?.pcountry === 'India' && Boolean(allInformation?.pgenerateviapincode) ? (
                <>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>District</Typography>
                      <OutlinedInput value={allInformation?.pdistrict || ''} readOnly={true} />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Village/City</Typography>
                      <OutlinedInput value={allInformation?.pvillageorcity || ''} readOnly={true} />
                    </FormControl>
                  </Grid>
                </>
              ) : (
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>City</Typography>
                    <OutlinedInput value={allInformation?.pcity} readOnly={true} />
                  </FormControl>
                </Grid>
              )}

              <Grid item md={3} sm={12} xs={12}>
                <FormControl size="small" fullWidth>
                  <Typography>GPS Coordinations</Typography>
                  <OutlinedInput id="component-outlined" type="text" sx={userStyle.input} readOnly value={allInformation?.pgpscoordination} />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Landmark & Positional Prefix</Typography>
                  <OutlinedInput id="component-outlined" type="text" value={allInformation?.plandmarkandpositionalprefix} readOnly />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Landmark Name</Typography>
                  <OutlinedInput id="component-outlined" type="text" readOnly value={allInformation.plandmark} />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>House/Flat No</Typography>
                  <OutlinedInput id="component-outlined" type="text" value={allInformation.pdoorno} readOnly />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Street/Road Name</Typography>
                  <OutlinedInput id="component-outlined" type="text" readOnly value={allInformation.pstreet} />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Locality/Area Name</Typography>
                  <OutlinedInput id="component-outlined" type="text" readOnly value={allInformation.parea} />
                </FormControl>
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <FullAddressCard
                  employee={{
                    ...allInformation,
                    pcity: allInformation?.pcity,
                    pstate: allInformation?.pstate,
                    pcountry: allInformation?.pcountry,
                    pvillageorcity: allInformation?.pvillageorcity || '',
                    pdistrict: allInformation?.pdistrict || '',
                  }}
                />
              </Grid>
              <br />
              <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex' }}>
                <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCloseVerify}
                    type="button"
                    sx={{
                      ...buttonStyles.btncancel,
                      height: '30px',
                      minWidth: '30px',
                      marginTop: '28px',
                      padding: '6px 10px',
                    }}
                  >
                    Back
                  </Button>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12} sx={{ display: 'flex' }}>
                <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
                  <Button
                    variant="contained"
                    color="success"
                    // onClick={handleBankTodo}
                    type="button"
                    sx={{
                      height: '30px',
                      minWidth: '30px',
                      marginTop: '28px',
                      padding: '6px 10px',
                    }}
                    onClick={(e) => {
                      handleClickCorrected(e);
                    }}
                  >
                    Correct
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setAddOpenalertPermanant(true)}
                    type="button"
                    sx={{
                      height: '30px',
                      minWidth: '30px',
                      marginTop: '28px',
                      padding: '6px 10px',
                    }}
                  >
                    InCorrect
                  </Button>
                </FormControl>
              </Grid>
            </Grid>
          </>
          <br />
        </Box>
      </Dialog>
      {/* Current Address Popup For View*/}
      <Dialog open={isCurrentAddressOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="lg" sx={{ marginTop: '80px' }}>
        <Box sx={userStyle.dialogbox}>
          <Typography sx={userStyle.SubHeaderText}>Current Address</Typography>
          <br />
          <>
            <Grid container spacing={2}>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Address Type</Typography>
                  <OutlinedInput id="component-outlined" type="text" value={allInformation?.caddresstype} readOnly />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Personal Prefix</Typography>
                  <OutlinedInput id="component-outlined" type="text" value={allInformation?.cpersonalprefix} readOnly />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Reference Name</Typography>
                  <OutlinedInput id="component-outlined" type="text" value={allInformation?.cresourcename} readOnly />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl size="small" fullWidth>
                  <Typography>Country</Typography>
                  <OutlinedInput value={allInformation?.ccountry} readOnly={true} />
                </FormControl>
                {allInformation?.ccountry === 'India' && <FormControlLabel control={<Checkbox checked={Boolean(allInformation?.cgenerateviapincode)} readOnly isDisabled={true} />} label="Generate Via Pincode" />}
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl size="small" fullWidth>
                  <Typography>Pincode</Typography>
                  <OutlinedInput id="component-outlined" type="number" sx={userStyle.input} readOnly value={allInformation.cpincode} />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>State</Typography>
                  <OutlinedInput value={allInformation?.cstate} readOnly={true} />
                </FormControl>
              </Grid>

              {allInformation?.ccountry === 'India' && Boolean(allInformation?.cgenerateviapincode) ? (
                <>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>District</Typography>
                      <OutlinedInput value={allInformation?.cdistrict || ''} readOnly={true} />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Village/City</Typography>
                      <OutlinedInput value={allInformation?.cvillageorcity || ''} readOnly={true} />
                    </FormControl>
                  </Grid>
                </>
              ) : (
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>City</Typography>
                    <OutlinedInput value={allInformation?.ccity} readOnly={true} />
                  </FormControl>
                </Grid>
              )}

              <Grid item md={3} sm={12} xs={12}>
                <FormControl size="small" fullWidth>
                  <Typography>GPS Coordinations</Typography>
                  <OutlinedInput id="component-outlined" type="text" sx={userStyle.input} readOnly value={allInformation?.cgpscoordination} />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Landmark & Positional Prefix</Typography>
                  <OutlinedInput id="component-outlined" type="text" value={allInformation?.clandmarkandpositionalprefix} readOnly />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Landmark Name</Typography>
                  <OutlinedInput id="component-outlined" type="text" readOnly value={allInformation.clandmark} />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>House/Flat No</Typography>
                  <OutlinedInput id="component-outlined" type="text" value={allInformation.cdoorno} readOnly />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Street/Road Name</Typography>
                  <OutlinedInput id="component-outlined" type="text" readOnly value={allInformation.cstreet} />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Locality/Area Name</Typography>
                  <OutlinedInput id="component-outlined" type="text" readOnly value={allInformation.carea} />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container sx={{ display: 'flex', justifiContent: 'space-between' }}>
              <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex' }}>
                <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCloseVerify}
                    type="button"
                    sx={{
                      ...buttonStyles.btncancel,
                      height: '30px',
                      minWidth: '30px',
                      marginTop: '28px',
                      padding: '6px 10px',
                    }}
                  >
                    Back
                  </Button>
                </FormControl>
              </Grid>
              <Grid item md={4} xs={12} sm={12} sx={{ display: 'flex' }}>
                <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
                  <Button
                    variant="contained"
                    color="success"
                    type="button"
                    sx={{
                      height: '30px',
                      minWidth: '30px',
                      marginTop: '28px',
                      padding: '6px 10px',
                    }}
                    onClick={(e) => {
                      handleClickCorrected(e);
                    }}
                  >
                    Correct
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => setAddOpenalertCurrent(true)}
                    type="button"
                    sx={{
                      height: '30px',
                      minWidth: '30px',
                      marginTop: '28px',
                      padding: '6px 10px',
                    }}
                  >
                    InCorrect
                  </Button>
                </FormControl>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Document List Popup For View*/}
      <Dialog
        open={isDocumentListOpen}
        // onClose={handleCloseVerify}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
        sx={{ marginTop: '80px' }}
      >
        <Box sx={userStyle.selectcontainer}>
          <Typography sx={userStyle.SubHeaderText}> Document List </Typography>
          <br />
          <br />
          <br />
          {files?.length === 0 ? (
            <Typography sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>There is no Documents</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table aria-label="simple table" id="branch">
                <TableHead sx={{ fontWeight: '600' }}>
                  <StyledTableRow>
                    <StyledTableCell align="center">SI.NO</StyledTableCell>
                    <StyledTableCell align="center">Document</StyledTableCell>
                    <StyledTableCell align="center">Remarks</StyledTableCell>
                    <StyledTableCell align="center">View</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {files &&
                    files.map((file, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="center">{sno++}</StyledTableCell>
                        <StyledTableCell align="left">{file.name}</StyledTableCell>
                        <StyledTableCell align="center">
                          <FormControl>
                            <OutlinedInput
                              sx={{
                                height: '30px !important',
                                background: 'white',
                                border: '1px solid rgb(0 0 0 / 48%)',
                              }}
                              size="small"
                              type="text"
                              readOnly
                              value={file.remark}
                            />
                          </FormControl>
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row" align="center">
                          <a style={{ color: '#357ae8' }} href={`data:application/octet-stream;base64,${file.data}`} download={file.name}>
                            Download
                          </a>
                          <a
                            style={{ color: '#357ae8' }}
                            //   href={`data:application/octet-stream;base64,${file}`}
                            onClick={() => renderFilePreview(file)}
                          >
                            {/* <VisibilityOutlinedIcon style={{ fontsize: "large", color: "#357AE8", marginLeft: "105px", marginTop: "-20px", cursor: "pointer" }} onClick={() => renderFilePreview(file)} /> */}
                            View
                          </a>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <br /> <br />
          {/* // <button onClick={handleDownloadAll}>download All</button> */}
          <Grid container>
            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex' }}>
              <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseVerify}
                  type="button"
                  sx={{
                    ...buttonStyles.btncancel,
                    height: '30px',
                    minWidth: '30px',
                    marginTop: '28px',
                    padding: '6px 10px',
                  }}
                >
                  Back
                </Button>
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12} sx={{ display: 'flex' }}>
              <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={(e) => {
                    handleClickCorrected(e);
                  }}
                  type="button"
                  sx={{
                    height: '30px',
                    minWidth: '30px',
                    marginTop: '28px',
                    padding: '6px 10px',
                  }}
                >
                  Correct
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setAddOpenalertDocument(true)}
                  type="button"
                  sx={{
                    height: '30px',
                    minWidth: '30px',
                    marginTop: '28px',
                    padding: '6px 10px',
                  }}
                >
                  InCorrect
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
      {/* Educational Qualification Popup For View*/}
      <Dialog open={isEducationalQualifyOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="lg" sx={{ marginTop: '80px' }}>
        <Box sx={userStyle.selectcontainer}>
          <br /> <br />
          <Typography sx={userStyle.SubHeaderText}> Educational Details </Typography>
          <br />
          <br />
          <br />
          {/* ****** Table start ****** */}
          {eduTodo?.length === 0 ? (
            <Typography sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>There is no Educational Details</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table aria-label="simple table" id="branch">
                <TableHead sx={{ fontWeight: '600' }}>
                  <StyledTableRow>
                    <StyledTableCell align="center">SI.NO</StyledTableCell>
                    <StyledTableCell align="center">Category</StyledTableCell>
                    <StyledTableCell align="center">Sub Category</StyledTableCell>
                    <StyledTableCell align="center">Specialization</StyledTableCell>
                    <StyledTableCell align="center">Institution</StyledTableCell>
                    <StyledTableCell align="center">Passed Year</StyledTableCell>
                    <StyledTableCell align="center">% or cgpa</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {eduTodo &&
                    eduTodo.map((todo, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="center">{eduno++}</StyledTableCell>
                        <StyledTableCell align="left">{todo.categoryedu}</StyledTableCell>
                        <StyledTableCell align="left">{todo.subcategoryedu}</StyledTableCell>
                        <StyledTableCell align="left">{todo.specialization}</StyledTableCell>
                        <StyledTableCell align="center">{todo.institution}</StyledTableCell>
                        <StyledTableCell align="center">{todo.passedyear}</StyledTableCell>
                        <StyledTableCell align="center">{todo.cgpa}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  {/* } */}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Grid container>
            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex' }}>
              <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseVerify}
                  type="button"
                  sx={{
                    ...buttonStyles.btncancel,
                    height: '30px',
                    minWidth: '30px',
                    marginTop: '28px',
                    padding: '6px 10px',
                  }}
                >
                  Back
                </Button>
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12} sx={{ display: 'flex' }}>
              <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={(e) => {
                    handleClickCorrected(e);
                  }}
                  type="button"
                  sx={{
                    height: '30px',
                    minWidth: '30px',
                    marginTop: '28px',
                    padding: '6px 10px',
                  }}
                >
                  Correct
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setAddOpenalertEducational(true)}
                  type="button"
                  sx={{
                    height: '30px',
                    minWidth: '30px',
                    marginTop: '28px',
                    padding: '6px 10px',
                  }}
                >
                  InCorrect
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
      {/* Additional Qualification Popup For View*/}
      <Dialog open={isAdditionalQualifyOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="lg" sx={{ marginTop: '80px' }}>
        <Box sx={userStyle.selectcontainer}>
          <Typography sx={userStyle.SubHeaderText}>Additional Qualification </Typography>
          <br />
          <br />
          {/* ****** Table start ****** */}
          {addAddQuaTodo?.length === 0 ? (
            <Typography sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>There is no Additional Qualification Details</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table
                aria-label="simple table"
                id="branch"
                // ref={tableRef}
              >
                <TableHead sx={{ fontWeight: '600' }}>
                  <StyledTableRow>
                    <StyledTableCell align="center">SI.NO</StyledTableCell>
                    <StyledTableCell align="center">Addl. Qualification</StyledTableCell>
                    <StyledTableCell align="center">Institution</StyledTableCell>
                    <StyledTableCell align="center">Duration</StyledTableCell>
                    <StyledTableCell align="center">Remarks</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {addAddQuaTodo &&
                    addAddQuaTodo.map((addtodo, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="center">{skno++}</StyledTableCell>
                        <StyledTableCell align="center">{addtodo.addQual}</StyledTableCell>
                        <StyledTableCell align="center">{addtodo.addInst}</StyledTableCell>
                        <StyledTableCell align="center">{addtodo.duration}</StyledTableCell>
                        <StyledTableCell align="center">{addtodo.remarks}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Grid container>
            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex' }}>
              <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseVerify}
                  type="button"
                  sx={{
                    ...buttonStyles.btncancel,
                    height: '30px',
                    minWidth: '30px',
                    marginTop: '28px',
                    padding: '6px 10px',
                  }}
                >
                  Back
                </Button>
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12} sx={{ display: 'flex' }}>
              <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={(e) => {
                    handleClickCorrected(e);
                  }}
                  type="button"
                  sx={{
                    height: '30px',
                    minWidth: '30px',
                    marginTop: '28px',
                    padding: '6px 10px',
                  }}
                >
                  Correct
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setAddOpenalertAdditional(true)}
                  type="button"
                  sx={{
                    height: '30px',
                    minWidth: '30px',
                    marginTop: '28px',
                    padding: '6px 10px',
                  }}
                >
                  InCorrect
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
      {/* Work History Popup For View*/}
      <Dialog
        open={isWorkHistoryOpen}
        // onClose={handleCloseVerify}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
        sx={{ marginTop: '80px' }}
      >
        <Box sx={userStyle.selectcontainer}>
          <Typography sx={userStyle.SubHeaderText}> Work History Details </Typography>
          <br />
          <br />
          <br />
          {/* ****** Table start ****** */}
          {workhistTodo?.length === 0 ? (
            <Typography sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>There is no Work History Details</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table
                aria-label="simple table"
                id="branch"
                // ref={tableRef}
              >
                <TableHead sx={{ fontWeight: '600' }}>
                  <StyledTableRow>
                    <StyledTableCell align="center">SI.NO</StyledTableCell>
                    <StyledTableCell align="center">Employee Name</StyledTableCell>
                    <StyledTableCell align="center">Designation</StyledTableCell>
                    <StyledTableCell align="center">Joined On</StyledTableCell>
                    <StyledTableCell align="center">Leave On</StyledTableCell>
                    <StyledTableCell align="center">Duties</StyledTableCell>
                    <StyledTableCell align="center">Reason for Leaving</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {workhistTodo &&
                    workhistTodo.map((todo, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="center">{snowv++}</StyledTableCell>
                        <StyledTableCell align="left">{todo.empNameTodo}</StyledTableCell>
                        <StyledTableCell align="center">{todo.desigTodo}</StyledTableCell>
                        <StyledTableCell align="center">{todo.joindateTodo ? moment(todo.joindateTodo)?.format('DD-MM-YYYY') : ''}</StyledTableCell>
                        <StyledTableCell align="center">{todo.leavedateTodo ? moment(todo.leavedateTodo)?.format('DD-MM-YYYY') : ''}</StyledTableCell>
                        <StyledTableCell align="center">{todo.dutiesTodo}</StyledTableCell>
                        <StyledTableCell align="center">{todo.reasonTodo}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <Grid conatiner sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex' }}>
              <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseVerify}
                  type="button"
                  sx={{
                    ...buttonStyles.btncancel,
                    height: '30px',
                    minWidth: '30px',
                    marginTop: '28px',
                    padding: '6px 10px',
                  }}
                >
                  Back
                </Button>
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12} sx={{ display: 'flex' }}>
              <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={(e) => {
                    handleClickCorrected(e);
                  }}
                  type="button"
                  sx={{
                    height: '30px',
                    minWidth: '30px',
                    marginTop: '28px',
                    padding: '6px 10px',
                  }}
                >
                  Correct
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setAddOpenalertWork(true)}
                  type="button"
                  sx={{
                    height: '30px',
                    minWidth: '30px',
                    marginTop: '28px',
                    padding: '6px 10px',
                  }}
                >
                  InCorrect
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
      {/* Bank Details Popup For View*/}
      <Dialog
        open={isBankDetailsOpen}
        // onClose={handleCloseVerify}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
        sx={{ marginTop: '80px' }}
      >
        {/* {bankTodo?.length > 0 && ( */}
        <Box sx={userStyle.selectcontainer}>
          <Typography sx={userStyle.SubHeaderText}>Bank Details </Typography>
          <br />
          <br />
          {bankTodo?.length > 0 &&
            bankTodo?.map((data, index) => (
              <div key={index}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography sx={{ fontWeight: 'bold' }}>{`Row No : ${index + 1}`}</Typography>
                  </Grid>
                </Grid>
                <br />
                <Grid container spacing={2}>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Bank Name</Typography>
                      <OutlinedInput id="component-outlined" type="text" value={data.bankname} readOnly />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Bank Branch Name</Typography>
                      <OutlinedInput id="component-outlined" type="text" value={data.bankbranchname} placeholder="Please Enter Bank Branch Name" readOnly />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Account Holder Name</Typography>
                      <OutlinedInput id="component-outlined" type="text" value={data.accountholdername} placeholder="Please Enter Account Holder Name" readOnly />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Account Number</Typography>
                      <OutlinedInput id="component-outlined" type="text" value={data.accountnumber} placeholder="Please Enter Account Number" readOnly />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12} sx={{ display: 'flex' }}>
                    <FormControl fullWidth size="small">
                      <Typography>IFSC Code</Typography>
                      <OutlinedInput id="component-outlined" type="text" value={data.ifsccode} placeholder="Please Enter IFSC Code" readOnly />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12} sx={{ display: 'flex' }}>
                    <FormControl fullWidth size="small">
                      <Typography>Type of Account</Typography>
                      <OutlinedInput id="component-outlined" type="text" value={data.accounttype} placeholder="Please Enter IFSC Code" readOnly />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} xs={12} sm={12} sx={{ display: 'flex' }}>
                    <FormControl fullWidth size="small">
                      <Typography>Status</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        value={data.accountstatus}
                        // placeholder="Please Enter IFSC Code"
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  {data?.proof?.length > 0 && (
                    <Grid
                      item
                      md={5}
                      sm={8}
                      xs={8}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // marginTop: "10%",
                      }}
                    >
                      {data?.proof?.length > 0 &&
                        data?.proof.map((file) => (
                          <>
                            <Grid container spacing={2}>
                              <Grid item md={8} sm={8} xs={8}>
                                <Typography
                                  style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '100%',
                                  }}
                                  title={file.name}
                                >
                                  {file.name}
                                </Typography>
                              </Grid>
                              <Grid item md={1} sm={1} xs={1}>
                                <VisibilityOutlinedIcon
                                  style={{
                                    fontsize: 'large',
                                    color: '#357AE8',
                                    cursor: 'pointer',
                                    marginLeft: '-7px',
                                  }}
                                  onClick={() => renderFilePreview(file)}
                                />
                              </Grid>
                              <br />
                              <br />
                            </Grid>
                          </>
                        ))}
                    </Grid>
                  )}
                </Grid>
                <br />
              </div>
            ))}
          {bankTodo?.length === 0 && <Typography sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>There is no Bank Details</Typography>}
          <Grid container sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Grid item md={8} xs={12} sm={12} sx={{ display: 'flex' }}>
              <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCloseVerify}
                  type="button"
                  sx={{
                    ...buttonStyles.btncancel,
                    height: '30px',
                    minWidth: '30px',
                    marginTop: '28px',
                    padding: '6px 10px',
                  }}
                >
                  Back
                </Button>
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12} sx={{ display: 'flex' }}>
              <FormControl fullWidth size="small" sx={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={(e) => {
                    handleClickCorrected(e);
                  }}
                  type="button"
                  sx={{
                    height: '30px',
                    minWidth: '30px',
                    marginTop: '28px',
                    padding: '6px 10px',
                  }}
                >
                  Correct
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setAddOpenalertBank(true)}
                  type="button"
                  sx={{
                    height: '30px',
                    minWidth: '30px',
                    marginTop: '28px',
                    padding: '6px 10px',
                  }}
                >
                  InCorrect
                </Button>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        {/* )} */}
      </Dialog>
      {/******************************************************************************************************* */}
      {/* Popups For Edit */}
      {/* Personal Information Popup For Edit*/}
      <Dialog open={isPersonalInfoOpenEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth={true} maxWidth="lg" sx={{ marginTop: '80px' }}>
        <Box sx={userStyle.selectcontainer}>
          <>
            <Grid container spacing={2}>
              <Grid item md={6} sm={12} xs={12}>
                <Typography>
                  First Name<b style={{ color: 'red' }}>*</b>
                </Typography>
                <Grid container sx={{ display: 'flex' }}>
                  <Grid item md={3} sm={3} xs={3}>
                    <FormControl size="small" fullWidth>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        placeholder="Mr."
                        value={allInformationEdit.prefix}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              maxHeight: 200,
                              width: 80,
                            },
                          },
                        }}
                        // onChange={(e) => {
                        //     setAllInformation({ ...allInformationEdit, prefix: e.target.value });
                        // }}
                      >
                        <MenuItem value="Mr">Mr</MenuItem>
                        <MenuItem value="Ms">Ms</MenuItem>
                        <MenuItem value="Mrs">Mrs</MenuItem>
                      </Select>
                    </FormControl>
                    {errors.prefix && <div>{errors.prefix}</div>}
                  </Grid>
                  <Grid item md={9} sm={9} xs={9}>
                    <FormControl size="small" fullWidth>
                      <OutlinedInput id="component-outlined" type="text" placeholder="First Name" value={allInformationEdit.firstname} />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={6} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Last Name<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <OutlinedInput id="component-outlined" type="text" placeholder="Last Name" value={allInformationEdit.lastname} />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Legal Name<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <OutlinedInput id="component-outlined" type="text" placeholder="Legal Name" value={allInformationEdit.legalname} />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>
                    Calling Name<b style={{ color: 'red' }}>*</b>
                  </Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Calling Name"
                    value={allInformationEdit.callingname}
                    onChange={(e) => {
                      setAllInformationEdit({
                        ...allInformationEdit,
                        callingname: e.target.value,
                      });
                    }}
                  />
                </FormControl>
                {errors.callingname && <div>{errors.callingname}</div>}
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Father Name</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Father Name"
                    value={allInformationEdit.fathername}
                    onChange={(e) => {
                      setAllInformationEdit({ ...allInformationEdit, fathername: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Mother Name</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Mother Name"
                    value={allInformationEdit.mothername}
                    onChange={(e) => {
                      setAllInformationEdit({ ...allInformationEdit, mothername: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              {/* <Grid container spacing={2}> */}
              <Grid item md={9} sm={12} xs={12}>
                <Grid container spacing={2}>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Gender</Typography>
                      <Selects
                        maxMenuHeight={300}
                        options={[
                          { label: 'Others', value: 'Others' },
                          { label: 'Female', value: 'Female' },
                          { label: 'Male', value: 'Male' },
                        ]}
                        value={{
                          label: allInformationEdit.gender === '' || allInformationEdit.gender == undefined ? 'Select Gender' : allInformationEdit.gender,
                          value: allInformationEdit.gender === '' || allInformationEdit.gender == undefined ? 'Select Gender' : allInformationEdit.gender,
                        }}
                        onChange={(e) => {
                          setAllInformationEdit({ ...allInformationEdit, gender: e.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Marital Status</Typography>
                      <Selects
                        maxMenuHeight={300}
                        options={[
                          { label: 'Single', value: 'Single' },
                          { label: 'Married', value: 'Married' },
                          { label: 'Divorced', value: 'Divorced' },
                        ]}
                        value={{
                          label: allInformationEdit.maritalstatus === '' || allInformationEdit.maritalstatus == undefined ? 'Select Marital Status' : allInformationEdit.maritalstatus,
                          value: allInformationEdit.maritalstatus === '' || allInformationEdit.maritalstatus == undefined ? 'Select Marital Status' : allInformationEdit.maritalstatus,
                        }}
                        onChange={(e) => {
                          setAllInformationEdit({
                            ...allInformationEdit,
                            maritalstatus: e.value,
                            dom: '',
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {allInformationEdit.maritalstatus === 'Married' && (
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Date Of Marriage<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          value={allInformationEdit.dom}
                          onChange={(e) => {
                            setAllInformationEdit({ ...allInformationEdit, dom: e.target.value });
                          }}
                          type="date"
                          size="small"
                          name="dom"
                        />
                      </FormControl>
                      {errors.dom && <div>{errors.dom}</div>}
                    </Grid>
                  )}
                  <Grid item md={2.5} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Date Of Birth<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        value={allInformationEdit.dob}
                        onChange={(e) => {
                          let age = calculateAge(e.target.value);
                          setAllInformationEdit({
                            ...allInformationEdit,
                            dob: e.target.value,
                            age,
                          });
                        }}
                        type="date"
                        size="small"
                        name="dob"
                        inputProps={{ max: maxDate }}
                        onKeyDown={(e) => e.preventDefault()}
                      />
                    </FormControl>
                    {errors.dob && <div>{errors.dob}</div>}
                  </Grid>
                  <Grid item md={1.5} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Age</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        value={allInformationEdit.dob === '' ? '' : allInformationEdit?.age}
                        // value={age}
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Religion <b style={{ color: 'red' }}>*</b>
                      </Typography>

                      <Selects
                        maxMenuHeight={300}
                        options={religionOptions}
                        value={{
                          label: allInformationEdit.religion === '' || allInformationEdit.religion == undefined ? 'Select Religion' : allInformationEdit.religion,
                          value: allInformationEdit.religion === '' || allInformationEdit.religion == undefined ? 'Select Religion' : allInformationEdit.religion,
                        }}
                        onChange={(e) => {
                          setAllInformationEdit({ ...allInformationEdit, religion: e.value });
                        }}
                      />
                    </FormControl>
                    {errors.religion && <div>{errors.religion}</div>}
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Blood Group</Typography>
                      <Selects
                        maxMenuHeight={300}
                        options={[
                          { label: 'A-ve-', value: 'A-ve-' },
                          { label: 'A+ve-', value: 'A+ve-' },
                          { label: 'B+ve', value: 'B+ve' },
                          { label: 'B-ve', value: 'B-ve' },
                          { label: 'O+ve', value: 'O+ve' },
                          { label: 'O-ve', value: 'O-ve' },
                          { label: 'AB+ve', value: 'AB+ve' },
                          { label: 'AB-ve', value: 'AB-ve' },
                          { label: 'A1+ve', value: 'A1+ve' },
                          { label: 'A1-ve', value: 'A1-ve' },
                          { label: 'A2+ve', value: 'A2+ve' },
                          { label: 'A2-ve', value: 'A2-ve' },
                          { label: 'A1B+ve', value: 'A1B+ve' },
                          { label: 'A1B-ve', value: 'A1B-ve' },
                          { label: 'A2B+ve', value: 'A2B+ve' },
                          { label: 'A2B-ve', value: 'A2B-ve' },
                        ]}
                        value={{
                          label: allInformationEdit.bloodgroup === '' || allInformationEdit.bloodgroup == undefined ? 'Select Blood Group' : allInformationEdit.bloodgroup,
                          value: allInformationEdit.bloodgroup === '' || allInformationEdit.bloodgroup == undefined ? 'Select Blood Group' : allInformationEdit.bloodgroup,
                        }}
                        onChange={(e) => {
                          setAllInformationEdit({ ...allInformationEdit, bloodgroup: e.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Email<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <TextField
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={allInformationEdit.email}
                        onChange={(e) => {
                          setAllInformationEdit({ ...allInformationEdit, email: e.target.value });
                          setIsValidEmail(validateEmail(e.target.value));
                        }}
                        InputProps={{
                          inputProps: {
                            pattern: /^\S+@\S+\.\S+$/,
                          },
                        }}
                      />
                    </FormControl>
                    {errors.email && <div>{errors.email}</div>}
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Location</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Location"
                        value={allInformationEdit.location}
                        onChange={(e) => {
                          setAllInformationEdit({
                            ...allInformationEdit,
                            location: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Contact No (personal) <b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        placeholder="Contact No (personal)"
                        value={allInformationEdit.contactpersonal}
                        onChange={(e) => {
                          handlechangecontactpersonal(e);
                        }}
                      />
                    </FormControl>
                    {errors.contactpersonal && <div>{errors.contactpersonal}</div>}
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Contact No (Family) <b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        placeholder="Contact No (Family)"
                        value={allInformationEdit.contactfamily}
                        onChange={(e) => {
                          handlechangecontactfamily(e);
                        }}
                      />
                    </FormControl>
                    {errors.contactfamily && <div>{errors.contactfamily}</div>}
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Emergency No<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="number"
                        sx={userStyle.input}
                        placeholder="Emergency No (Emergency)"
                        value={allInformationEdit.emergencyno}
                        onChange={(e) => {
                          handlechangeemergencyno(e);
                        }}
                      />
                    </FormControl>
                    {errors.emergencyno && <div>{errors.emergencyno}</div>}
                  </Grid>
                  <Grid item md={4} sm={6} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        Aadhar No<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="Number"
                        sx={userStyle.input}
                        placeholder="Aadhar No"
                        value={allInformationEdit.aadhar}
                        onChange={(e) => {
                          handlechangeaadhar(e);
                        }}
                      />
                    </FormControl>
                    {errors.aadhar && <div>{errors.aadhar}</div>}
                  </Grid>
                  <Grid item md={4} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>
                        PAN Card Status<b style={{ color: 'red' }}>*</b>
                      </Typography>
                      <Selects
                        maxMenuHeight={300}
                        options={[
                          { label: 'Have PAN', value: 'Have PAN' },
                          { label: 'Applied', value: 'Applied' },
                          { label: 'Yet to Apply', value: 'Yet to Apply' },
                        ]}
                        value={{
                          label: allInformationEdit.panstatus === '' || allInformationEdit.panstatus == undefined ? 'Select PAN Status' : allInformationEdit.panstatus,
                          value: allInformationEdit.panstatus === '' || allInformationEdit.panstatus == undefined ? 'Select PAN Status' : allInformationEdit.panstatus,
                        }}
                        onChange={(e) => {
                          setAllInformationEdit({
                            ...allInformationEdit,
                            panstatus: e.value,
                            panno: '',
                            panrefno: '',
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {allInformationEdit?.panstatus === 'Have PAN' && (
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Pan No<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Pan No"
                          value={allInformationEdit.panno}
                          onChange={(e) => {
                            if (e.target.value.length < 11) {
                              setAllInformationEdit({
                                ...allInformationEdit,
                                panno: e.target.value,
                              });
                            }
                          }}
                        />
                      </FormControl>
                      {errors.panno && <div>{errors.panno}</div>}
                    </Grid>
                  )}
                  {allInformationEdit?.panstatus === 'Applied' && (
                    <Grid item md={4} sm={6} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Application Ref No<b style={{ color: 'red' }}>*</b>
                        </Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Application Ref No"
                          value={allInformationEdit.panrefno}
                          onChange={(e) => {
                            if (e.target.value.length < 16) {
                              setAllInformationEdit({
                                ...allInformationEdit,
                                panrefno: e.target.value,
                              });
                            }
                          }}
                        />
                      </FormControl>
                      {errors.panrefno && <div>{errors.panrefno}</div>}
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item lg={3} md={3} sm={12} xs={12}>
                <InputLabel sx={{ m: 1 }}>
                  Profile Image<b style={{ color: 'red' }}>*</b>
                </InputLabel>
                {errors.profile && <div>{errors.profile}</div>}
                {croppedImage && (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        style={{
                          height: 120,
                          borderRadius: '8px', // Rounded corners for the image
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for the image
                          objectFit: 'cover', // Ensure the image covers the area without distortion
                        }}
                        src={croppedImage}
                        alt="Cropped"
                      />
                    </div>
                  </>
                )}
                <div>
                  {employee.profileimage && !croppedImage ? (
                    <>
                      <Cropper style={{ height: 120, width: '100%' }} aspectRatio={1 / 1} src={employee.profileimage} ref={cropperRef} />
                      <Box
                        sx={{
                          display: 'flex',
                          marginTop: '10px',
                          gap: '10px',
                        }}
                      >
                        <Box>
                          <Typography sx={userStyle.uploadbtn} onClick={handleCrop}>
                            Crop Image
                          </Typography>
                        </Box>
                        <Box>
                          <Button variant="outlined" sx={userStyle.btncancel} onClick={handleClearImage}>
                            Clear
                          </Button>
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <>
                      {!employee.profileimage && (
                        <Grid container sx={{ display: 'flex' }}>
                          <Grid item md={6} sm={6}>
                            <section>
                              <LoadingButton component="label" variant="contained" loading={btnUpload} sx={buttonStyles.buttonsubmit}>
                                Upload
                                <input type="file" id="profileimage" name="file" accept="image/*" hidden onChange={handleChangeImage} />
                                <br />
                              </LoadingButton>
                            </section>
                          </Grid>
                          <Grid item md={6} sm={6}>
                            <Button onClick={showWebcam} variant="contained" sx={userStyle.uploadbtn}>
                              <CameraAltIcon />
                            </Button>
                          </Grid>
                        </Grid>
                      )}
                      {employee.profileimage && (
                        <>
                          <Grid item md={4} sm={4}>
                            <Button variant="outlined" sx={userStyle.btncancel} onClick={handleClearImage}>
                              Clear
                            </Button>
                          </Grid>
                        </>
                      )}
                    </>
                  )}
                </div>
              </Grid>
              <Grid item md={12} sm={12} xs={12}>
                <Typography>
                  Proof&nbsp;<b style={{ color: 'red' }}>*</b>
                </Typography>
                {infoProof.personalinfoproof && (
                  <>
                    <Grid sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <img src={infoProof.personalinfoproof} style={{ height: 120, width: 170 }} alt="PersonalInfoProof" />
                    </Grid>
                  </>
                )}
                <br />
                <Grid sx={{ display: 'flex' }}>
                  <FormControl size="small" fullWidth>
                    <Grid sx={{ display: 'flex' }}>
                      <Button component="label" sx={buttonStyles.buttonsubmit}>
                        Upload
                        <input type="file" id="personalproof" accept="image/*" name="file" hidden onChange={handleImageUploadproff} />
                      </Button>
                      <Button
                        onClick={(e) => {
                          setFile('');
                          setInfoProof({ ...infoProof, personalinfoproof: '' });
                        }}
                        sx={buttonStyles.btncancel}
                      >
                        Clear
                      </Button>
                    </Grid>
                  </FormControl>
                </Grid>
                {errors.personalinfoproof && <div>{errors.personalinfoproof}</div>}
              </Grid>
              <Grid item md={12} sm={12} xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  sx={buttonStyles.btncancel}
                  onClick={() => {
                    setIsPersonalInfoOpenEdit(false);
                    setAddOpenalertPersonal(false);
                  }}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    // checkAllField();
                    requiredFieldCheckPersonal();
                  }}
                  type="button"
                  sx={{ ...buttonStyles.buttonsubmit, height: '38px' }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Reference Detail Popup For Edit*/}
      <Dialog open={isReferenceOpenEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="lg" sx={{ marginTop: '80px' }}>
        <Box sx={userStyle.selectcontainer}>
          <Typography sx={userStyle.SubHeaderText}>Reference Details</Typography>
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item md={2.3} sm={6} xs={12}>
              <FormControl size="small" fullWidth>
                <Typography>
                  Name<b style={{ color: 'red' }}>*</b>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Reference Name"
                  value={singleReferenceTodoEdit.name}
                  onChange={(e) => {
                    setSingleReferenceTodoEdit({
                      ...singleReferenceTodoEdit,
                      name: e.target.value,
                    });
                  }}
                />
              </FormControl>
              {referenceTodoError.name && <div>{referenceTodoError.name}</div>}
              {/* {errors.referencetable && <div>{errors.referencetable}</div>} */}
              {referenceTodoError.duplicate && <div>{referenceTodoError.duplicate}</div>}
            </Grid>
            <Grid item md={2.3} sm={6} xs={12}>
              <FormControl size="small" fullWidth>
                <Typography>Relationship</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Relationship"
                  value={singleReferenceTodoEdit.relationship}
                  onChange={(e) => {
                    setSingleReferenceTodoEdit({
                      ...singleReferenceTodoEdit,
                      relationship: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={2.3} sm={6} xs={12}>
              <FormControl size="small" fullWidth>
                <Typography>Occupation</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Occupation"
                  value={singleReferenceTodoEdit.occupation}
                  onChange={(e) => {
                    setSingleReferenceTodoEdit({
                      ...singleReferenceTodoEdit,
                      occupation: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={2.3} sm={6} xs={12}>
              <FormControl size="small" fullWidth>
                <Typography>Contact No</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="number"
                  sx={userStyle.input}
                  placeholder="Contact No"
                  value={singleReferenceTodoEdit.contact}
                  onChange={(e) => {
                    handlechangereferencecontactno(e);
                  }}
                />
              </FormControl>
              {referenceTodoError.contactno && <div>{referenceTodoError.contactno}</div>}
            </Grid>
            <Grid item md={2.3} sm={12} xs={12}>
              <FormControl fullWidth>
                <Typography>Details</Typography>
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={5}
                  value={singleReferenceTodoEdit.details}
                  onChange={(e) => {
                    setSingleReferenceTodoEdit({
                      ...singleReferenceTodoEdit,
                      details: e.target.value,
                    });
                  }}
                  placeholder="Reference Details"
                />
              </FormControl>
            </Grid>
            <Grid item md={0.5} sm={6} xs={12}>
              <Button
                variant="contained"
                color="primary"
                style={{
                  height: '30px',
                  minWidth: '20px',
                  padding: '19px 13px',
                  marginTop: '25px',
                }}
                onClick={addReferenceTodoFunction}
              >
                <FaPlus />
              </Button>
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              {' '}
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table" id="usertable">
                  <TableHead sx={{ fontWeight: '600' }}>
                    <StyledTableRow>
                      <StyledTableCell>SNo</StyledTableCell>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Relationship</StyledTableCell>
                      <StyledTableCell>Occupation</StyledTableCell>
                      <StyledTableCell>Contact</StyledTableCell>
                      <StyledTableCell>Details</StyledTableCell>
                      <StyledTableCell></StyledTableCell>
                    </StyledTableRow>
                  </TableHead>
                  <TableBody align="left">
                    {referenceTodoEdit?.length > 0 ? (
                      referenceTodoEdit?.map((row, index) => (
                        <StyledTableRow>
                          <StyledTableCell>{index + 1}</StyledTableCell>
                          <StyledTableCell>{row.name}</StyledTableCell>
                          <StyledTableCell>{row.relationship}</StyledTableCell>
                          <StyledTableCell>{row.occupation}</StyledTableCell>
                          <StyledTableCell>{row.contact}</StyledTableCell>
                          <StyledTableCell>{row.details}</StyledTableCell>
                          <StyledTableCell>
                            <CloseIcon
                              sx={{ color: 'red', cursor: 'pointer' }}
                              onClick={() => {
                                deleteReferenceTodo(index);
                              }}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    ) : (
                      <StyledTableRow>
                        {' '}
                        <StyledTableCell colSpan={8} align="center">
                          No Data Available
                        </StyledTableCell>{' '}
                      </StyledTableRow>
                    )}
                    <StyledTableRow></StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              {errors.referencetable && <div>{errors.referencetable}</div>}
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Typography>
                Proof&nbsp;<b style={{ color: 'red' }}>*</b>
              </Typography>
              {infoProof.referenceproof && (
                <>
                  <Grid sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <img src={infoProof.referenceproof} style={{ height: 120, width: 170 }} alt="PersonalInfoProof" />
                  </Grid>
                </>
              )}
              <br />
              <Grid sx={{ display: 'flex' }}>
                <FormControl size="small" fullWidth>
                  <Grid sx={{ display: 'flex' }}>
                    <Button component="label" sx={buttonStyles.buttonsubmit}>
                      Upload
                      <input type="file" id="referenceproof" accept="image/*" name="file" hidden onChange={handleImageUploadref} />
                    </Button>
                    <Button
                      onClick={(e) => {
                        setFile('');
                        setInfoProof({ ...infoProof, referenceproof: '' });
                      }}
                      sx={buttonStyles.btncancel}
                    >
                      Clear
                    </Button>
                  </Grid>
                </FormControl>
              </Grid>
              {errors.referenceproof && <div>{errors.referenceproof}</div>}
            </Grid>
            <Grid item md={12} sm={12} xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                sx={buttonStyles.btncancel}
                onClick={() => {
                  setIsReferenceOpenEdit(false);
                  setAddOpenalertReference(false);
                }}
                type="button"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => {
                  requiredFieldCheckReference();
                }}
                type="button"
                sx={{ ...buttonStyles.buttonsubmit, height: '38px' }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>{' '}
        </Box>
      </Dialog>
      {/* Permanent Address Popup For Edit*/}
      <Dialog open={isPermanantAddressOpenEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="lg" sx={{ marginTop: '80px' }}>
        <Box sx={userStyle.selectcontainer}>
          <Typography sx={userStyle.SubHeaderText}>Permanent Address </Typography>
          <br />
          <br />
          <>
            <Grid container spacing={2}>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Address Type</Typography>
                  <Selects
                    options={address_type}
                    styles={colourStyles}
                    value={{
                      label: allInformationEdit?.paddresstype === '' ? 'Please Select Address Type' : allInformationEdit?.paddresstype,
                      value: allInformationEdit?.paddresstype === '' ? 'Please Select Address Type' : allInformationEdit?.paddresstype,
                    }}
                    onChange={(e) => {
                      setAllInformationEdit({ ...allInformationEdit, paddresstype: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Personal Prefix</Typography>
                  <Selects
                    options={personal_prefix}
                    styles={colourStyles}
                    value={{
                      label: allInformationEdit?.ppersonalprefix === '' ? 'Please Select Personal Prefix' : allInformationEdit?.ppersonalprefix,
                      value: allInformationEdit?.ppersonalprefix === '' ? 'Please Select Personal Prefix' : allInformationEdit?.ppersonalprefix,
                    }}
                    onChange={(e) => {
                      setAllInformationEdit({ ...allInformationEdit, ppersonalprefix: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Reference Name</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Reference Name"
                    value={allInformationEdit?.presourcename}
                    onChange={(e) => {
                      setAllInformationEdit({ ...allInformationEdit, presourcename: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl size="small" fullWidth>
                  <Typography>Country</Typography>
                  <Selects
                    options={Country.getAllCountries()}
                    getOptionLabel={(options) => {
                      return options['name'];
                    }}
                    getOptionValue={(options) => {
                      return options['name'];
                    }}
                    styles={colourStyles}
                    value={selectedCountryp}
                    onChange={(item) => {
                      setSelectedCountryp(item);
                      setSelectedStatep('');
                      setSelectedCityp('');
                      setAllInformationEdit((prevSupplier) => ({
                        ...prevSupplier,
                        pcountry: item?.name || '',
                        pstate: '',
                        pcity: '',
                        pdistrict: '',
                        pvillageorcity: '',
                        pgenerateviapincode: false,
                      }));
                    }}
                  />
                </FormControl>
                {selectedCountryp?.name === 'India' && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Boolean(allInformationEdit?.pgenerateviapincode)}
                        onChange={(e) => {
                          setAllInformationEdit((prevSupplier) => ({
                            ...prevSupplier,
                            pgenerateviapincode: e.target.checked,
                            pvillageorcity: '',
                            pdistrict: '',
                            pstate: '',
                            pcity: '',
                          }));
                          setSelectedStatep('');
                          setSelectedCityp('');
                        }}
                      />
                    }
                    label="Generate Via Pincode"
                  />
                )}
              </Grid>

              {selectedCountryp?.name === 'India' && allInformationEdit?.pgenerateviapincode && (
                <>
                  <Grid item md={3} sm={4} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Pincode</Typography>

                      <Box display="flex" alignItems="center" gap={1}>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          value={allInformationEdit.ppincode}
                          onChange={(e) => {
                            handlechangeppincode(e);
                          }}
                          sx={userStyle.input}
                        />
                        <PincodeButton pincode={allInformationEdit?.ppincode || ''} onSuccess={handleLocationSuccessp} />
                      </Box>
                    </FormControl>
                  </Grid>
                </>
              )}
              {!allInformationEdit?.pgenerateviapincode && (
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl size="small" fullWidth>
                    <Typography>Pincode</Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="number"
                      sx={userStyle.input}
                      placeholder="Pincode"
                      value={allInformationEdit.ppincode}
                      onChange={(e) => {
                        handlechangeppincode(e);
                      }}
                    />
                  </FormControl>
                </Grid>
              )}
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>State</Typography>
                  <Selects
                    options={State?.getStatesOfCountry(selectedCountryp?.isoCode)}
                    getOptionLabel={(options) => {
                      return options['name'];
                    }}
                    getOptionValue={(options) => {
                      return options['name'];
                    }}
                    value={selectedStatep}
                    styles={colourStyles}
                    onChange={(item) => {
                      setSelectedStatep(item);
                      setSelectedCityp('');
                      setAllInformationEdit((prevSupplier) => ({
                        ...prevSupplier,
                        pstate: item?.name || '',
                      }));
                    }}
                    isDisabled={selectedCountryp?.name === 'India' && allInformationEdit?.pgenerateviapincode}
                  />
                </FormControl>
              </Grid>
              {selectedCountryp?.name === 'India' && allInformationEdit?.pgenerateviapincode ? (
                <>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>District</Typography>
                      <OutlinedInput id="component-outlined" type="text" value={allInformationEdit?.pdistrict || ''} readOnly sx={userStyle.input} />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Village/City</Typography>
                      <Selects
                        options={fromPinCodep?.length > 0 ? fromPinCodep : []}
                        getOptionLabel={(options) => {
                          return options['name'];
                        }}
                        getOptionValue={(options) => {
                          return options['name'];
                        }}
                        value={allInformationEdit?.pvillageorcity !== '' ? { name: allInformationEdit?.pvillageorcity } : ''}
                        // styles={colourStyles}
                        onChange={(item) => {
                          setAllInformationEdit((prevSupplier) => ({
                            ...prevSupplier,
                            pvillageorcity: item?.name || '',
                          }));
                        }}
                      />
                    </FormControl>
                  </Grid>
                </>
              ) : (
                <Grid item md={3} sm={12} xs={12}>
                  <FormControl fullWidth size="small">
                    <Typography>City</Typography>
                    <Selects
                      options={City.getCitiesOfState(selectedStatep?.countryCode, selectedStatep?.isoCode)}
                      getOptionLabel={(options) => {
                        return options['name'];
                      }}
                      getOptionValue={(options) => {
                        return options['name'];
                      }}
                      value={selectedCityp}
                      styles={colourStyles}
                      onChange={(item) => {
                        setSelectedCityp(item);
                        setAllInformationEdit((prevSupplier) => ({
                          ...prevSupplier,
                          pcity: item?.name || '',
                        }));
                      }}
                    />
                  </FormControl>
                </Grid>
              )}

              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>GPS Coordination</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="GPS Coordination"
                    value={allInformationEdit?.pgpscoordination}
                    onChange={(e) => {
                      setAllInformationEdit({
                        ...allInformationEdit,
                        pgpscoordination: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Landmark & Positional Prefix</Typography>
                  <Selects
                    options={landmark_and_positional_prefix}
                    styles={colourStyles}
                    value={{
                      label: allInformationEdit?.plandmarkandpositionalprefix === '' ? 'Please Select Landmark and Positional  Prefix' : allInformationEdit?.plandmarkandpositionalprefix,
                      value: allInformationEdit?.plandmarkandpositionalprefix === '' ? 'Please Select Landmark and Positional  Prefix' : allInformationEdit?.plandmarkandpositionalprefix,
                    }}
                    onChange={(e) => {
                      setAllInformationEdit({ ...allInformationEdit, plandmarkandpositionalprefix: e.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Landmark Name</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Landmark  Name"
                    value={allInformationEdit.plandmark}
                    onChange={(e) => {
                      setAllInformationEdit({
                        ...allInformationEdit,
                        plandmark: e.target.value,
                      });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>House/Flat No</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="House/Flat No"
                    value={allInformationEdit.pdoorno}
                    onChange={(e) => {
                      setAllInformationEdit({ ...allInformationEdit, pdoorno: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Street/Road Name</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Street/Road Name"
                    value={allInformationEdit.pstreet}
                    onChange={(e) => {
                      setAllInformationEdit({ ...allInformationEdit, pstreet: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item md={3} sm={12} xs={12}>
                <FormControl fullWidth size="small">
                  <Typography>Locality/Area Name</Typography>
                  <OutlinedInput
                    id="component-outlined"
                    type="text"
                    placeholder="Locality/Area Name"
                    value={allInformationEdit.parea}
                    onChange={(e) => {
                      setAllInformationEdit({ ...allInformationEdit, parea: e.target.value });
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item md={12} sm={12} xs={12}>
                <FullAddressCard
                  employee={{
                    ...allInformationEdit,
                    pcity: allInformationEdit?.pcity,
                    pstate: allInformationEdit?.pstate,
                    pcountry: allInformationEdit?.pcountry,
                    pvillageorcity: allInformationEdit?.pvillageorcity || '',
                    pdistrict: allInformationEdit?.pdistrict || '',
                  }}
                />
              </Grid>
              {errors.paddressall && <div>{errors.paddressall}</div>}
              <Grid item md={12} sm={12} xs={12}>
                <Typography>
                  Proof&nbsp;<b style={{ color: 'red' }}>*</b>
                </Typography>
                {infoProof.paddressproof && (
                  <>
                    <Grid sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <img src={infoProof.paddressproof} style={{ height: 120, width: 170 }} alt="paddressproof" />
                    </Grid>
                  </>
                )}
                <br />
                <Grid sx={{ display: 'flex' }}>
                  <FormControl size="small" fullWidth>
                    <Grid sx={{ display: 'flex' }}>
                      <Button component="label" sx={buttonStyles.buttonsubmit}>
                        Upload
                        <input type="file" id="paddressproof" accept="image/*" name="file" hidden onChange={handleImageUploadpadd} />
                      </Button>
                      <Button
                        onClick={(e) => {
                          setFile('');
                          setInfoProof({ ...infoProof, paddressproof: '' });
                        }}
                        sx={buttonStyles.btncancel}
                      >
                        Clear
                      </Button>
                    </Grid>
                  </FormControl>
                </Grid>
                {errors.paddressproof && <div>{errors.paddressproof}</div>}
              </Grid>
              <Grid item md={12} sm={12} xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  sx={buttonStyles.btncancel}
                  onClick={() => {
                    setIsPermanantAddressOpenEdit(false);
                    setAddOpenalertPermanant(false);
                  }}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    requiredFieldCheckPermanent();
                  }}
                  type="button"
                  sx={{ ...buttonStyles.buttonsubmit, height: '38px' }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Current Address Popup For Edit*/}
      <Dialog open={isCurrentAddressOpenEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="lg" sx={{ marginTop: '80px' }}>
        <Box sx={userStyle.selectcontainer}>
          <Typography sx={userStyle.SubHeaderText}>Current Address </Typography> <br />
          <br />
          <>
            <Grid container spacing={2}>
              {/* <Grid container spacing={2}>
               
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={allInformationEdit.samesprmnt}
                        onChange={(e) =>
                          setAllInformationEdit({
                            ...allInformationEdit,
                            samesprmnt: !allInformationEdit.samesprmnt,
                          })
                        }
                      />
                    }
                    label="Same as permanent Address"
                  />
                </Grid>
              </Grid>
              <br />
              <br /> */}
              {/* {!allInformationEdit.samesprmnt ? (
                <>
                  <Grid container spacing={2}>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Address Type
                        </Typography>
                        <Selects
                          options={address_type}
                          styles={colourStyles}
                          value={{
                            label: allInformationEdit?.caddresstype === '' ? 'Please Select Address Type' : allInformationEdit?.caddresstype,
                            value: allInformationEdit?.caddresstype === '' ? 'Please Select Address Type' : allInformationEdit?.caddresstype,
                          }}
                          onChange={(e) => {
                            setAllInformationEdit({ ...allInformationEdit, caddresstype: e.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Personal Prefix
                        </Typography>
                        <Selects
                          options={personal_prefix}
                          styles={colourStyles}
                          value={{
                            label: allInformationEdit?.cpersonalprefix === '' ? 'Please Select Personal Prefix' : allInformationEdit?.cpersonalprefix,
                            value: allInformationEdit?.cpersonalprefix === '' ? 'Please Select Personal Prefix' : allInformationEdit?.cpersonalprefix,
                          }}
                          onChange={(e) => {
                            setAllInformationEdit({ ...allInformationEdit, cpersonalprefix: e.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Reference Name</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Reference Name"
                          value={allInformationEdit?.cresourcename}
                          onChange={(e) => {
                            setAllInformationEdit({ ...allInformationEdit, cresourcename: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Country</Typography>
                        <Selects
                          options={Country.getAllCountries()}
                          getOptionLabel={(options) => {
                            return options['name'];
                          }}
                          getOptionValue={(options) => {
                            return options['name'];
                          }}
                          value={selectedCountryc}
                          styles={colourStyles}
                          onChange={(item) => {
                            setSelectedCountryc(item);
                            setSelectedStatec('');
                            setSelectedCityc('');
                            setAllInformationEdit((prevSupplier) => ({
                              ...prevSupplier,
                              ccountry: item?.name || '',
                              cstate: '',
                              ccity: '',
                              cdistrict: '',
                              cvillageorcity: '',
                              cgenerateviapincode: false,
                            }));
                          }}
                        />
                      </FormControl>
                      {selectedCountryc?.name === "India" && (
                        <FormControlLabel
                          control={
                            <Checkbox checked={Boolean(allInformationEdit?.cgenerateviapincode)} onChange={(e) => {
                              setAllInformationEdit((prevSupplier) => ({
                                ...prevSupplier,
                                cgenerateviapincode: e.target.checked,
                                cvillageorcity: '',
                                cdistrict: '',
                                cstate: '',
                                ccity: '',
                              }));
                              setSelectedStatec('');
                              setSelectedCityc('');
                            }} />
                          }
                          label="Generate Via Pincode"
                        />
                      )}
                    </Grid>
                    {selectedCountryc?.name === "India" && allInformationEdit?.cgenerateviapincode &&
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl size="small" fullWidth>
                          <Typography>Pincode</Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <OutlinedInput
                              id="component-outlined"
                              type="number"
                              value={allInformationEdit.cpincode}
                              onChange={(e) => {
                                handlechangecpincode(e);
                              }}
                              sx={userStyle.input}
                            />
                            <PincodeButton pincode={allInformationEdit?.cpincode || ""} onSuccess={handleLocationSuccessc} />
                          </Box>
                        </FormControl>
                      </Grid>}
                    {!allInformationEdit?.cgenerateviapincode &&
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl size="small" fullWidth>
                          <Typography>Pincode</Typography>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            sx={userStyle.input}
                            placeholder="Pincode"
                            value={allInformationEdit.cpincode}
                            onChange={(e) => {
                              handlechangecpincode(e);
                            }}
                          />
                        </FormControl>
                      </Grid>}
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>State</Typography>
                        <Selects
                          options={State?.getStatesOfCountry(selectedCountryc?.isoCode)}
                          getOptionLabel={(options) => {
                            return options['name'];
                          }}
                          getOptionValue={(options) => {
                            return options['name'];
                          }}
                          value={selectedStatec}
                          styles={colourStyles}
                          onChange={(item) => {
                            setSelectedStatec(item);
                            setSelectedCityc('');
                            setAllInformationEdit((prevSupplier) => ({
                              ...prevSupplier,
                              cstate: item?.name || '',
                            }));
                          }}
                          isDisabled={selectedCountryc?.name === "India" && allInformationEdit?.cgenerateviapincode}
                        />
                      </FormControl>
                    </Grid>
                    {selectedCountryc?.name === "India" && allInformationEdit?.cgenerateviapincode ?
                      <>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>District</Typography>
                            <OutlinedInput
                              id="component-outlined"
                              type="text"
                              value={allInformationEdit?.cdistrict || ""}
                              readOnly
                              sx={userStyle.input}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item md={3} sm={12} xs={12}>
                          <FormControl fullWidth size="small">
                            <Typography>Village/City</Typography>
                            <Selects
                              options={fromPinCodec?.length > 0 ? fromPinCodec : []}
                              getOptionLabel={(options) => {
                                return options['name'];
                              }}
                              getOptionValue={(options) => {
                                return options['name'];
                              }}
                              value={allInformationEdit?.cvillageorcity !== "" ? { name: allInformationEdit?.cvillageorcity } : ''}
                              // styles={colourStyles}
                              onChange={(item) => {
                                setAllInformationEdit((prevSupplier) => ({
                                  ...prevSupplier,
                                  cvillageorcity: item?.name || '',
                                }));
                              }}
                            />
                          </FormControl>
                        </Grid>
                      </> :
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>City</Typography>
                          <Selects
                            options={City.getCitiesOfState(selectedStatec?.countryCode, selectedStatec?.isoCode)}
                            getOptionLabel={(options) => {
                              return options['name'];
                            }}
                            getOptionValue={(options) => {
                              return options['name'];
                            }}
                            value={selectedCityc}
                            styles={colourStyles}
                            onChange={(item) => {
                              setSelectedCityc(item);
                              setAllInformationEdit((prevSupplier) => ({
                                ...prevSupplier,
                                ccity: item?.name || '',
                              }));
                            }}
                          />
                        </FormControl>
                      </Grid>}
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>GPS Coordination</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Landmark  Name"
                          value={allInformationEdit.cgpscoordination}
                          onChange={(e) => {
                            setAllInformationEdit({
                              ...allInformationEdit,
                              cgpscoordination: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>
                          Landmark & Positional Prefix
                        </Typography>
                        <Selects
                          options={landmark_and_positional_prefix}
                          styles={colourStyles}
                          value={{
                            label: allInformationEdit?.clandmarkandpositionalprefix === '' ? 'Please Select Landmark and Positional  Prefix' : allInformationEdit?.clandmarkandpositionalprefix,
                            value: allInformationEdit?.clandmarkandpositionalprefix === '' ? 'Please Select Landmark and Positional  Prefix' : allInformationEdit?.clandmarkandpositionalprefix,
                          }}
                          onChange={(e) => {
                            setAllInformationEdit({ ...allInformationEdit, clandmarkandpositionalprefix: e.value });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Landmark  Name</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Landmark  Name"
                          value={allInformationEdit.clandmark}
                          onChange={(e) => {
                            setAllInformationEdit({
                              ...allInformationEdit,
                              clandmark: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>House/Flat No</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="House/Flat No"
                          value={allInformationEdit.cdoorno}
                          onChange={(e) => {
                            setAllInformationEdit({
                              ...allInformationEdit,
                              cdoorno: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Street/Road Name</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Street/Road Name"
                          value={allInformationEdit.cstreet}
                          onChange={(e) => {
                            setAllInformationEdit({
                              ...allInformationEdit,
                              cstreet: e.target.value,
                            });
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Locality/Area Name</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="text"
                          placeholder="Locality/Area Name"
                          value={allInformationEdit.carea}
                          onChange={(e) => {
                            setAllInformationEdit({ ...allInformationEdit, carea: e.target.value });
                          }}
                        />
                      </FormControl>
                    </Grid>









                  </Grid>
                </>
              ) : (
                // else condition starts here
                <>
                  <Grid container spacing={2}>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Address Type</Typography>
                        <OutlinedInput id="component-outlined" type="text" placeholder="Address Type" value={allInformationEdit?.paddresstype} readOnly />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Personal Prefix</Typography>
                        <OutlinedInput id="component-outlined" type="text" placeholder="Personal Prefix" value={allInformationEdit?.ppersonalprefix} readOnly />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Reference Name</Typography>
                        <OutlinedInput id="component-outlined" type="text" placeholder="Reference Name" value={allInformationEdit?.presourcename} readOnly />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Country</Typography>
                        <Selects
                          options={Country.getAllCountries()}
                          getOptionLabel={(options) => {
                            return options['name'];
                          }}
                          getOptionValue={(options) => {
                            return options['name'];
                          }}
                          value={selectedCountryp}
                          styles={colourStyles}
                          onChange={(item) => {
                            setSelectedCountryp(item);
                          }}
                          isDisabled={true}
                        />
                      </FormControl>
                      {selectedCountryp?.name === "India" && (
                        <FormControlLabel
                          control={
                            <Checkbox checked={Boolean(allInformationEdit?.pgenerateviapincode)} readOnly
                              isDisabled={true}
                            />
                          }
                          label="Generate Via Pincode"
                        />
                      )}
                    </Grid>

                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Pincode</Typography>
                        <OutlinedInput id="component-outlined" type="text" placeholder="Pincode" value={allInformationEdit.ppincode} readOnly />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>State</Typography>
                        <Selects
                          options={State?.getStatesOfCountry(selectedCountryp?.isoCode)}
                          getOptionLabel={(options) => {
                            return options['name'];
                          }}
                          getOptionValue={(options) => {
                            return options['name'];
                          }}
                          value={selectedStatep}
                          styles={colourStyles}
                          // onChange={(item) => {
                          //   setSelectedStatep(item);
                          // }}
                          isDisabled={true}
                        />
                      </FormControl>
                    </Grid>
                    {selectedCountryp?.name === "India" && allInformationEdit?.pgenerateviapincode ? <>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl size="small" fullWidth>
                          <Typography>District</Typography>
                          <OutlinedInput id="component-outlined" type="text" placeholder="District" value={allInformationEdit.pdistrict || ""} readOnly />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl size="small" fullWidth>
                          <Typography>Village/City</Typography>
                          <OutlinedInput id="component-outlined" type="text" placeholder="Village/City" value={allInformationEdit.pvillageorcity || ""} readOnly />
                        </FormControl>
                      </Grid>
                    </> :
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>City</Typography>
                          <Selects
                            options={City.getCitiesOfState(selectedStatep?.countryCode, selectedStatep?.isoCode)}
                            getOptionLabel={(options) => {
                              return options['name'];
                            }}
                            getOptionValue={(options) => {
                              return options['name'];
                            }}
                            value={selectedCityp}
                            styles={colourStyles}
                            // onChange={(item) => {
                            //   setSelectedCityp(item);
                            // }}
                            isDisabled={true}
                          />
                        </FormControl>
                      </Grid>}

                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>GPS Coordination</Typography>
                        <OutlinedInput id="component-outlined" type="text" placeholder="GPS Coordination" value={allInformationEdit?.pgpscoordination} readOnly />
                      </FormControl>
                    </Grid>


                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography> Landmark & Positional Prefix </Typography>
                        <OutlinedInput id="component-outlined" type="text" placeholder="Landmark & Positional Prefix" value={allInformationEdit?.plandmarkandpositionalprefix} readOnly />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Landmark  Name</Typography>
                        <OutlinedInput id="component-outlined" type="text" placeholder="Landmark  Name" value={allInformationEdit.plandmark} readOnly />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>House/Flat No</Typography>
                        <OutlinedInput id="component-outlined" type="text" placeholder="House/Flat No" value={allInformationEdit.pdoorno} readOnly />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Street/Road Name</Typography>
                        <OutlinedInput id="component-outlined" type="text" placeholder="Street/Road Name" value={allInformationEdit.pstreet} readOnly />
                      </FormControl>
                    </Grid>
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>Locality/Area Name</Typography>
                        <OutlinedInput id="component-outlined" type="text" placeholder="Locality/Area Name" value={allInformationEdit.parea} readOnly />
                      </FormControl>
                    </Grid>

                   





                  </Grid>
                </>
              )} */}
              <>
                <Grid container spacing={2}>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Address Type</Typography>
                      <Selects
                        options={address_type}
                        styles={colourStyles}
                        value={{
                          label: allInformationEdit?.caddresstype === '' ? 'Please Select Address Type' : allInformationEdit?.caddresstype,
                          value: allInformationEdit?.caddresstype === '' ? 'Please Select Address Type' : allInformationEdit?.caddresstype,
                        }}
                        onChange={(e) => {
                          setAllInformationEdit({ ...allInformationEdit, caddresstype: e.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Personal Prefix</Typography>
                      <Selects
                        options={personal_prefix}
                        styles={colourStyles}
                        value={{
                          label: allInformationEdit?.cpersonalprefix === '' ? 'Please Select Personal Prefix' : allInformationEdit?.cpersonalprefix,
                          value: allInformationEdit?.cpersonalprefix === '' ? 'Please Select Personal Prefix' : allInformationEdit?.cpersonalprefix,
                        }}
                        onChange={(e) => {
                          setAllInformationEdit({ ...allInformationEdit, cpersonalprefix: e.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Reference Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Reference Name"
                        value={allInformationEdit?.cresourcename}
                        onChange={(e) => {
                          setAllInformationEdit({ ...allInformationEdit, cresourcename: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Country</Typography>
                      <Selects
                        options={Country.getAllCountries()}
                        getOptionLabel={(options) => {
                          return options['name'];
                        }}
                        getOptionValue={(options) => {
                          return options['name'];
                        }}
                        value={selectedCountryc}
                        styles={colourStyles}
                        onChange={(item) => {
                          setSelectedCountryc(item);
                          setSelectedStatec('');
                          setSelectedCityc('');
                          setAllInformationEdit((prevSupplier) => ({
                            ...prevSupplier,
                            ccountry: item?.name || '',
                            cstate: '',
                            ccity: '',
                            cdistrict: '',
                            cvillageorcity: '',
                            cgenerateviapincode: false,
                          }));
                        }}
                      />
                    </FormControl>
                    {selectedCountryc?.name === 'India' && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={Boolean(allInformationEdit?.cgenerateviapincode)}
                            onChange={(e) => {
                              setAllInformationEdit((prevSupplier) => ({
                                ...prevSupplier,
                                cgenerateviapincode: e.target.checked,
                                cvillageorcity: '',
                                cdistrict: '',
                                cstate: '',
                                ccity: '',
                              }));
                              setSelectedStatec('');
                              setSelectedCityc('');
                            }}
                          />
                        }
                        label="Generate Via Pincode"
                      />
                    )}
                  </Grid>
                  {selectedCountryc?.name === 'India' && allInformationEdit?.cgenerateviapincode && (
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Pincode</Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <OutlinedInput
                            id="component-outlined"
                            type="number"
                            value={allInformationEdit.cpincode}
                            onChange={(e) => {
                              handlechangecpincode(e);
                            }}
                            sx={userStyle.input}
                          />
                          <PincodeButton pincode={allInformationEdit?.cpincode || ''} onSuccess={handleLocationSuccessc} />
                        </Box>
                      </FormControl>
                    </Grid>
                  )}
                  {!allInformationEdit?.cgenerateviapincode && (
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl size="small" fullWidth>
                        <Typography>Pincode</Typography>
                        <OutlinedInput
                          id="component-outlined"
                          type="number"
                          sx={userStyle.input}
                          placeholder="Pincode"
                          value={allInformationEdit.cpincode}
                          onChange={(e) => {
                            handlechangecpincode(e);
                          }}
                        />
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>State</Typography>
                      <Selects
                        options={State?.getStatesOfCountry(selectedCountryc?.isoCode)}
                        getOptionLabel={(options) => {
                          return options['name'];
                        }}
                        getOptionValue={(options) => {
                          return options['name'];
                        }}
                        value={selectedStatec}
                        styles={colourStyles}
                        onChange={(item) => {
                          setSelectedStatec(item);
                          setSelectedCityc('');
                          setAllInformationEdit((prevSupplier) => ({
                            ...prevSupplier,
                            cstate: item?.name || '',
                          }));
                        }}
                        isDisabled={selectedCountryc?.name === 'India' && allInformationEdit?.cgenerateviapincode}
                      />
                    </FormControl>
                  </Grid>
                  {selectedCountryc?.name === 'India' && allInformationEdit?.cgenerateviapincode ? (
                    <>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>District</Typography>
                          <OutlinedInput id="component-outlined" type="text" value={allInformationEdit?.cdistrict || ''} readOnly sx={userStyle.input} />
                        </FormControl>
                      </Grid>
                      <Grid item md={3} sm={12} xs={12}>
                        <FormControl fullWidth size="small">
                          <Typography>Village/City</Typography>
                          <Selects
                            options={fromPinCodec?.length > 0 ? fromPinCodec : []}
                            getOptionLabel={(options) => {
                              return options['name'];
                            }}
                            getOptionValue={(options) => {
                              return options['name'];
                            }}
                            value={allInformationEdit?.cvillageorcity !== '' ? { name: allInformationEdit?.cvillageorcity } : ''}
                            // styles={colourStyles}
                            onChange={(item) => {
                              setAllInformationEdit((prevSupplier) => ({
                                ...prevSupplier,
                                cvillageorcity: item?.name || '',
                              }));
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  ) : (
                    <Grid item md={3} sm={12} xs={12}>
                      <FormControl fullWidth size="small">
                        <Typography>City</Typography>
                        <Selects
                          options={City.getCitiesOfState(selectedStatec?.countryCode, selectedStatec?.isoCode)}
                          getOptionLabel={(options) => {
                            return options['name'];
                          }}
                          getOptionValue={(options) => {
                            return options['name'];
                          }}
                          value={selectedCityc}
                          styles={colourStyles}
                          onChange={(item) => {
                            setSelectedCityc(item);
                            setAllInformationEdit((prevSupplier) => ({
                              ...prevSupplier,
                              ccity: item?.name || '',
                            }));
                          }}
                        />
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>GPS Coordination</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Landmark  Name"
                        value={allInformationEdit.cgpscoordination}
                        onChange={(e) => {
                          setAllInformationEdit({
                            ...allInformationEdit,
                            cgpscoordination: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Landmark & Positional Prefix</Typography>
                      <Selects
                        options={landmark_and_positional_prefix}
                        styles={colourStyles}
                        value={{
                          label: allInformationEdit?.clandmarkandpositionalprefix === '' ? 'Please Select Landmark and Positional  Prefix' : allInformationEdit?.clandmarkandpositionalprefix,
                          value: allInformationEdit?.clandmarkandpositionalprefix === '' ? 'Please Select Landmark and Positional  Prefix' : allInformationEdit?.clandmarkandpositionalprefix,
                        }}
                        onChange={(e) => {
                          setAllInformationEdit({ ...allInformationEdit, clandmarkandpositionalprefix: e.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Landmark Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Landmark  Name"
                        value={allInformationEdit.clandmark}
                        onChange={(e) => {
                          setAllInformationEdit({
                            ...allInformationEdit,
                            clandmark: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>House/Flat No</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="House/Flat No"
                        value={allInformationEdit.cdoorno}
                        onChange={(e) => {
                          setAllInformationEdit({
                            ...allInformationEdit,
                            cdoorno: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Street/Road Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Street/Road Name"
                        value={allInformationEdit.cstreet}
                        onChange={(e) => {
                          setAllInformationEdit({
                            ...allInformationEdit,
                            cstreet: e.target.value,
                          });
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} xs={12}>
                    <FormControl fullWidth size="small">
                      <Typography>Locality/Area Name</Typography>
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Locality/Area Name"
                        value={allInformationEdit.carea}
                        onChange={(e) => {
                          setAllInformationEdit({ ...allInformationEdit, carea: e.target.value });
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </>
              {errors.caddressall && <div>{errors.caddressall}</div>}
              <Grid item md={12} sm={12} xs={12}>
                <Typography>
                  Proof&nbsp;<b style={{ color: 'red' }}>*</b>
                </Typography>
                {infoProof.caddressproof && (
                  <>
                    <Grid sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <img src={infoProof.caddressproof} style={{ height: 120, width: 170 }} alt="caddressproof" />
                    </Grid>
                  </>
                )}
                <br />
                <Grid sx={{ display: 'flex' }}>
                  <FormControl size="small" fullWidth>
                    <Grid sx={{ display: 'flex' }}>
                      <Button component="label" sx={buttonStyles.buttonsubmit}>
                        Upload
                        <input type="file" id="caddressproof" accept="image/*" name="file" hidden onChange={handleImageUploadcadd} />
                      </Button>
                      <Button
                        onClick={(e) => {
                          setFile('');
                          setInfoProof({ ...infoProof, caddressproof: '' });
                        }}
                        sx={buttonStyles.btncancel}
                      >
                        Clear
                      </Button>
                    </Grid>
                  </FormControl>
                </Grid>
                {errors.caddressproof && <div>{errors.caddressproof}</div>}
              </Grid>
              <Grid item md={12} sm={12} xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  sx={buttonStyles.btncancel}
                  onClick={() => {
                    setIsCurrentAddressOpenEdit(false);
                    setAddOpenalertCurrent(false);
                  }}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    requiredFieldCheckCurrent();
                  }}
                  type="button"
                  sx={{ ...buttonStyles.buttonsubmit, height: '38px' }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>
      {/* Document List Popup For Edit*/}
      <Dialog
        open={isDocumentListOpenEdit}
        // onClose={handleCloseVerify}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
        sx={{ marginTop: '80px' }}
      >
        <Box sx={userStyle.selectcontainer}>
          <Grid item xs={8}>
            <Typography sx={userStyle.SubHeaderText}>Document</Typography>
          </Grid>
          <>
            <Grid container sx={{ justifyContent: 'center' }} spacing={1}>
              <Selects
                options={designationsFileNames}
                styles={colourStyles}
                value={{
                  label: fileNames,
                  value: fileNames,
                }}
                onChange={(e) => {
                  setfileNames(e.value);
                }}
              />
              &nbsp;
              <Button variant="outlined" component="label">
                <CloudUploadIcon sx={{ fontSize: '21px' }} /> &ensp;Upload Documents
                <input hidden type="file" multiple onChange={handleFileUpload} />
              </Button>
            </Grid>
            <br />
            <br />
          </>
          <Typography sx={userStyle.SubHeaderText}> Document List </Typography>
          <br />
          <br />
          <br />
          <TableContainer component={Paper}>
            <Table aria-label="simple table" id="branch">
              <TableHead sx={{ fontWeight: '600' }}>
                <StyledTableRow>
                  <StyledTableCell align="center">SI.NO</StyledTableCell>
                  <StyledTableCell align="center">Document</StyledTableCell>
                  <StyledTableCell align="center">Remarks</StyledTableCell>
                  <StyledTableCell align="center">View</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {filesEdit &&
                  filesEdit.map((file, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="center">{snoe++}</StyledTableCell>
                      <StyledTableCell align="left">{file.name}</StyledTableCell>
                      <StyledTableCell align="center">
                        <FormControl>
                          <OutlinedInput
                            sx={{
                              height: '30px !important',
                              background: 'white',
                              border: '1px solid rgb(0 0 0 / 48%)',
                            }}
                            size="small"
                            type="text"
                            value={file.remark}
                            onChange={(event) => handleRemarkChange(index, event.target.value)}
                          />
                        </FormControl>
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row" align="center">
                        {file?.orginpath === 'Employee Documents' ? (
                          <a
                            style={{
                              color: '#357ae8',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                            }}
                            onClick={(e) => {
                              e.preventDefault(); // Prevent default anchor behavior
                              downloadFile(file.preview);
                            }}
                          >
                            Download
                          </a>
                        ) : (
                          <a style={{ color: '#357ae8' }} href={`data:application/octet-stream;base64,${file.data}`} download={file.name}>
                            Download
                          </a>
                        )}
                        <a
                          style={{
                            color: '#357ae8',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                          onClick={() => renderFilePreview(file)}
                        >
                          View
                        </a>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          onClick={() => handleFileDelete(index)}
                          variant="contained"
                          size="small"
                          sx={{
                            textTransform: 'capitalize',
                            minWidth: '0px',
                          }}
                        >
                          <DeleteIcon style={{ fontSize: '20px' }} />
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {errors.filesedit && <div>{errors.filesedit}</div>}
          <br />
          <Grid item md={12} sm={12} xs={12}>
            <Typography>
              Proof&nbsp;<b style={{ color: 'red' }}>*</b>
            </Typography>
            {infoProof.documentproof && (
              <>
                <Grid sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <img src={infoProof.documentproof} style={{ height: 120, width: 170 }} alt="DocumentProof" />
                </Grid>
              </>
            )}
            <br />
            <Grid sx={{ display: 'flex' }}>
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: 'flex' }}>
                  <Button component="label" sx={buttonStyles.buttonsubmit}>
                    Upload
                    <input type="file" id="documentproof" accept="image/*" name="file" hidden onChange={handleImageUploaddoc} />
                  </Button>
                  <Button
                    onClick={(e) => {
                      setFile('');
                      setInfoProof({ ...infoProof, documentproof: '' });
                    }}
                    sx={buttonStyles.btncancel}
                  >
                    Clear
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            {errors.documentproof && <div>{errors.documentproof}</div>}
          </Grid>
          <br />
          <br />
          <Grid item md={12} sm={12} xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              sx={buttonStyles.btncancel}
              onClick={() => {
                setIsDocumentListOpenEdit(false);
                setAddOpenalertDocument(false);
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                requiredFieldCheckDocument();
              }}
              type="button"
              sx={{ ...buttonStyles.buttonsubmit, height: '38px' }}
            >
              Submit
            </Button>
          </Grid>
        </Box>
      </Dialog>
      {/* Educational Qualification Popup For Edit*/}
      <Dialog
        open={isEducationalQualifyOpenEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
        sx={{
          overflow: 'auto',
          '& .MuiPaper-root': {
            overflow: 'auto',
          },
          marginTop: '80px',
        }}
      >
        <Box sx={userStyle.selectcontainer}>
          <Typography sx={userStyle.SubHeaderText}>Educational qualification</Typography>
          <br />
          <br />
          <Grid container spacing={1}>
            <Grid item md={3} sm={12} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Category</Typography>
                <Selects
                  options={categorys}
                  value={{
                    label: allInformationEdit.categoryedu === '' || allInformationEdit.categoryedu == undefined ? 'Please Select Category' : allInformationEdit.categoryedu,
                    value: allInformationEdit.categoryedu === '' || allInformationEdit.categoryedu == undefined ? 'Please Select Category' : allInformationEdit.categoryedu,
                  }}
                  onChange={(e) => {
                    setAllInformationEdit((prev) => ({
                      ...prev,
                      categoryedu: e.value,
                      subcategoryedu: 'Please Select Sub Category',
                      specialization: 'Please Select Specialization',
                    }));
                    fetchCategoryBased(e);
                    setSubcategorys([]);
                    setEducationsOpt([]);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={12} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Sub Category</Typography>
                <Selects
                  options={subcategorys}
                  value={{
                    label: allInformationEdit.subcategoryedu === '' || allInformationEdit.subcategoryedu == undefined ? 'Please Select Sub Category' : allInformationEdit.subcategoryedu,
                    value: allInformationEdit.subcategoryedu === '' || allInformationEdit.subcategoryedu == undefined ? 'Please Select Sub Category' : allInformationEdit.subcategoryedu,
                  }}
                  onChange={(e) => {
                    setAllInformationEdit((prev) => ({
                      ...prev,
                      subcategoryedu: e.value,
                      specialization: 'Please Select Specialization',
                    }));
                    fetchEducation(e);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} xs={12} sm={12}>
              <Typography> Specialization</Typography>
              <FormControl fullWidth size="small">
                <Selects
                  options={educationsOpt}
                  value={{
                    label: allInformationEdit.specialization === '' || allInformationEdit.specialization == undefined ? 'Please Select Specialization' : allInformationEdit.specialization,
                    value: allInformationEdit.specialization === '' || allInformationEdit.specialization == undefined ? 'Please Select Specialization' : allInformationEdit.specialization,
                  }}
                  onChange={(e) => {
                    setAllInformationEdit((prev) => ({
                      ...prev,
                      specialization: e.value,
                    }));
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography> Institution </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    {switchValues?.educationInstitution ? (
                      <OutlinedInput id="component-outlined" type="text" value={institution} placeholder="Institution" onChange={(e) => setInstitution(e.target.value)} />
                    ) : (
                      <Selects
                        options={
                          masterFieldValues?.eduInstitutions?.length > 0
                            ? masterFieldValues?.eduInstitutions?.map((data) => ({
                                label: data,
                                value: data,
                              }))
                            : []
                        }
                        placeholder="Please Select"
                        value={{ label: institution === '' ? 'Please Select Institution' : institution, value: institution === '' ? 'Please Select Institution' : institution }}
                        onChange={(e) => {
                          setInstitution(e.value);
                        }}
                      />
                    )}
                  </Box>

                  <FormGroup>
                    <Button
                      variant={switchValues?.educationInstitution ? 'contained' : 'outlined'}
                      onClick={() => {
                        setSwicthValues((prev) => ({
                          ...prev,
                          educationInstitution: !switchValues?.educationInstitution,
                        }));
                        setInstitution('');
                      }}
                      size="small"
                    >
                      {switchValues?.educationInstitution ? 'Exist' : 'New'}
                    </Button>
                  </FormGroup>
                </Box>
              </FormControl>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography> Passed Year </Typography>
                <OutlinedInput id="component-outlined" type="number" placeholder="Passed Year" sx={userStyle.input} value={passedyear} onChange={(e) => handlechangepassedyear(e)} />
              </FormControl>
            </Grid>
            <Grid item md={2} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography> CGPA</Typography>
                <OutlinedInput id="component-outlined" type="number" placeholder="CGPA" sx={userStyle.input} value={cgpa} onChange={(e) => handlechangecgpa(e)} />
              </FormControl>
            </Grid>
            <Grid item md={1} sm={12} xs={12}>
              <FormControl size="small">
                <Button variant="contained" color="success" type="button" onClick={handleSubmittodo} sx={userStyle.Todoadd}>
                  <FaPlus />
                </Button>
                &nbsp;
              </FormControl>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <br />
              <br />
              {errorstodo.qualification && <div>{errorstodo.qualification}</div>}
            </Grid>
          </Grid>
          <br /> <br />
          <Typography sx={userStyle.SubHeaderText}> Educational Details </Typography>
          <br />
          <br />
          <br />
          {/* ****** Table start ****** */}
          <TableContainer component={Paper}>
            <Table aria-label="simple table" id="branch">
              <TableHead sx={{ fontWeight: '600' }}>
                <StyledTableRow>
                  <StyledTableCell align="center">SI.NO</StyledTableCell>
                  <StyledTableCell align="center">Category</StyledTableCell>
                  <StyledTableCell align="center">Sub Category</StyledTableCell>
                  <StyledTableCell align="center">Specialization</StyledTableCell>
                  <StyledTableCell align="center">Institution</StyledTableCell>
                  <StyledTableCell align="center">Passed Year</StyledTableCell>
                  <StyledTableCell align="center">% or cgpa</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {eduTodoEdit &&
                  eduTodoEdit?.map((todo, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="center">{edunoe++}</StyledTableCell>
                      <StyledTableCell align="left">{todo.categoryedu}</StyledTableCell>
                      <StyledTableCell align="left">{todo.subcategoryedu}</StyledTableCell>
                      <StyledTableCell align="left">{todo.specialization}</StyledTableCell>
                      <StyledTableCell align="center">{todo.institution}</StyledTableCell>
                      <StyledTableCell align="center">{todo.passedyear}</StyledTableCell>
                      <StyledTableCell align="center">{todo.cgpa}</StyledTableCell>
                      <StyledTableCell align="center">
                        {
                          <Button variant="contained" color="error" type="button" onClick={() => handleDelete(index)} sx={userStyle.Todoadd}>
                            <AiOutlineClose />
                          </Button>
                        }
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {errors.edutodoedit && <div>{errors.edutodoedit}</div>}
          <br />
          <Grid item md={12} sm={12} xs={12}>
            <Typography>
              Proof&nbsp;<b style={{ color: 'red' }}>*</b>
            </Typography>
            {infoProof.eduqualiproof && (
              <>
                <Grid sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <img src={infoProof.eduqualiproof} style={{ height: 120, width: 170 }} alt="EduqualiProof" />
                </Grid>
              </>
            )}
            <br />
            <Grid sx={{ display: 'flex' }}>
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: 'flex' }}>
                  <Button component="label" sx={buttonStyles.buttonsubmit}>
                    Upload
                    <input type="file" id="eduqualiproof" accept="image/*" name="file" hidden onChange={handleImageUploadedu} />
                  </Button>
                  <Button
                    onClick={(e) => {
                      setFile('');
                      setInfoProof({ ...infoProof, eduqualiproof: '' });
                    }}
                    sx={buttonStyles.btncancel}
                  >
                    Clear
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            {errors.eduqualiproof && <div>{errors.eduqualiproof}</div>}
          </Grid>
          <br />
          <br />
          <Grid item md={12} sm={12} xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              sx={buttonStyles.btncancel}
              onClick={() => {
                setIsEducationalQualifyOpenEdit(false);
                setAddOpenalertEducational(false);
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                requiredFieldCheckEducation();
              }}
              type="button"
              sx={{ ...buttonStyles.buttonsubmit, height: '38px' }}
            >
              Submit
            </Button>
          </Grid>
        </Box>
        <br />
      </Dialog>
      {/* Additional Qualification Popup For Edit*/}
      <Dialog open={isAdditionalQualifyOpenEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="lg" sx={{ marginTop: '80px' }}>
        <Box sx={userStyle.selectcontainer}>
          <Typography sx={userStyle.SubHeaderText}>Additional qualification </Typography>
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item md={3} sm={12} xs={12}>
              <FormControl fullWidth size="small">
                <Typography> Addtl. Qualification </Typography>
                <Selects
                  options={skillSet?.map((data) => ({
                    label: data?.name,
                    value: data?.name,
                  }))}
                  styles={colourStyles}
                  value={{
                    label: addQual === '' || addQual == undefined ? 'Please Select Additional Qualification' : addQual,
                    value: addQual === '' || addQual == undefined ? 'Please Select Additional Qualification' : addQual,
                  }}
                  onChange={(e) => {
                    setAddQual(e.value);
                  }}
                />
              </FormControl>
              {errorstodo.addQual && <div>{errorstodo.addQual}</div>}
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography> Institution </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    {switchValues?.additionalInstitution ? (
                      <OutlinedInput id="component-outlined" type="text" placeholder="Institution" value={addInst} onChange={(e) => setAddInst(e.target.value)} />
                    ) : (
                      <Selects
                        options={
                          masterFieldValues?.addInstitutions?.length > 0
                            ? masterFieldValues?.addInstitutions?.map((data) => ({
                                label: data,
                                value: data,
                              }))
                            : []
                        }
                        placeholder="Please Select"
                        value={{ label: addInst === '' ? 'Please Select Institution' : addInst, value: addInst === '' ? 'Please Select Institution' : addInst }}
                        onChange={(e) => {
                          setAddInst(e.value);
                        }}
                      />
                    )}
                  </Box>

                  <FormGroup>
                    <Button
                      variant={switchValues?.additionalInstitution ? 'contained' : 'outlined'}
                      onClick={() => {
                        setSwicthValues((prev) => ({
                          ...prev,
                          additionalInstitution: !switchValues?.additionalInstitution,
                        }));
                        setAddInst('');
                      }}
                      size="small"
                    >
                      {switchValues?.additionalInstitution ? 'Exist' : 'New'}
                    </Button>
                  </FormGroup>
                </Box>
              </FormControl>
            </Grid>
            <Grid item md={3} sm={12} xs={12}>
              <FormControl fullWidth size="small">
                <Typography>Durartion</Typography>
                <OutlinedInput id="component-outlined" type="text" placeholder="Durartion" value={duration} onChange={(e) => setDuration(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid item md={2} sm={12} xs={12}>
              <FormControl fullWidth size="small">
                <Typography> Remarks</Typography>
                <OutlinedInput id="component-outlined" type="text" placeholder="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid item md={1} sm={12} xs={12}>
              <FormControl size="small">
                <Button variant="contained" color="success" type="button" onClick={handleSubmitAddtodo} sx={userStyle.Todoadd}>
                  <FaPlus />
                </Button>
                &nbsp;
              </FormControl>
            </Grid>
            <br />
          </Grid>
          <br />
          <br />
          <Typography sx={userStyle.SubHeaderText}> Additional Qualification Details </Typography>
          {/* ****** Table start ****** */}
          <TableContainer component={Paper}>
            <Table
              aria-label="simple table"
              id="branch"
              // ref={tableRef}
            >
              <TableHead sx={{ fontWeight: '600' }}>
                <StyledTableRow>
                  <StyledTableCell align="center">SI.NO</StyledTableCell>
                  <StyledTableCell align="center">Addl. Qualification</StyledTableCell>
                  <StyledTableCell align="center">Institution</StyledTableCell>
                  <StyledTableCell align="center">Duration</StyledTableCell>
                  <StyledTableCell align="center">Remarks</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {addAddQuaTodoEdit &&
                  addAddQuaTodoEdit.map((addtodo, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="center">{sknoe++}</StyledTableCell>
                      <StyledTableCell align="center">{addtodo.addQual}</StyledTableCell>
                      <StyledTableCell align="center">{addtodo.addInst}</StyledTableCell>
                      <StyledTableCell align="center">{addtodo.duration}</StyledTableCell>
                      <StyledTableCell align="center">{addtodo.remarks}</StyledTableCell>
                      <StyledTableCell align="center">
                        {
                          <Button variant="contained" color="error" type="button" onClick={() => handleAddDelete(index)} sx={userStyle.Todoadd}>
                            <AiOutlineClose />
                          </Button>
                        }
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {errors.addtodoedit && <div>{errors.addtodoedit}</div>}
          <br />
          <Grid item md={12} sm={12} xs={12}>
            <Typography>
              Proof&nbsp;<b style={{ color: 'red' }}>*</b>
            </Typography>
            {infoProof.addqualiproof && (
              <>
                <Grid sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <img src={infoProof.addqualiproof} style={{ height: 120, width: 170 }} alt="AddqualiProof" />
                </Grid>
              </>
            )}
            <br />
            <Grid sx={{ display: 'flex' }}>
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: 'flex' }}>
                  <Button component="label" sx={buttonStyles.buttonsubmit}>
                    Upload
                    <input type="file" id="addqualiproof" accept="image/*" name="file" hidden onChange={handleImageUploadadd} />
                  </Button>
                  <Button
                    onClick={(e) => {
                      setFile('');
                      setInfoProof({ ...infoProof, addqualiproof: '' });
                    }}
                    sx={buttonStyles.btncancel}
                  >
                    Clear
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            {errors.addqualiproof && <div>{errors.addqualiproof}</div>}
          </Grid>
          <br />
          <br />
          <Grid item md={12} sm={12} xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              sx={buttonStyles.btncancel}
              onClick={() => {
                setIsAdditionalQualifyOpenEdit(false);
                setAddOpenalertAdditional(false);
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                requiredFieldCheckAdditioanl();
              }}
              type="button"
              sx={{ ...buttonStyles.buttonsubmit, height: '38px' }}
            >
              Submit
            </Button>
          </Grid>
        </Box>
      </Dialog>
      {/* Work History Popup For Edit*/}
      <Dialog
        open={isWorkHistoryOpenEdit}
        // onClose={handleCloseVerify}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
        sx={{ marginTop: '80px' }}
      >
        <Box sx={userStyle.selectcontainer}>
          <Typography sx={userStyle.SubHeaderText}>Work History</Typography>
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item md={4} sm={12} xs={12}>
              <FormControl fullWidth size="small">
                <Typography> Employee Name</Typography>
                <OutlinedInput id="component-outlined" type="text" placeholder="Employee Name" value={empNameTodo} onChange={(e) => setEmpNameTodo(e.target.value)} />
              </FormControl>
              {errorstodo.empNameTodo && <div>{errorstodo.empNameTodo}</div>}
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography> Designation </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    {switchValues?.workDesignation ? (
                      <OutlinedInput
                        id="component-outlined"
                        type="text"
                        placeholder="Designation"
                        value={desigTodo}
                        onChange={(e) => {
                          setDesigTodo(e.target.value);
                        }}
                      />
                    ) : (
                      <Selects
                        options={
                          masterFieldValues?.designations?.length > 0
                            ? masterFieldValues?.designations?.map((data) => ({
                                label: data,
                                value: data,
                              }))
                            : []
                        }
                        placeholder="Please Select"
                        value={{ label: desigTodo === '' ? 'Please Select Designation' : desigTodo, value: desigTodo === '' ? 'Please Select Designation' : desigTodo }}
                        onChange={(e) => {
                          setDesigTodo(e.value);
                        }}
                      />
                    )}
                  </Box>

                  <FormGroup>
                    <Button
                      variant={switchValues?.workDesignation ? 'contained' : 'outlined'}
                      onClick={() => {
                        setSwicthValues((prev) => ({
                          ...prev,
                          workDesignation: !switchValues?.workDesignation,
                        }));
                        setDesigTodo('');
                      }}
                      size="small"
                    >
                      {switchValues?.workDesignation ? 'Exist' : 'New'}
                    </Button>
                  </FormGroup>
                </Box>
              </FormControl>
            </Grid>
            <Grid item md={2} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography> Joined On </Typography>
                <OutlinedInput
                  id="from-date"
                  type="date"
                  value={joindateTodo}
                  onChange={(e) => {
                    setJoindateTodo(e.target.value);
                    setLeavedateTodo('');
                    document.getElementById('to-date').min = e.target.value;
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={2} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography> Leave On</Typography>
                <OutlinedInput id="to-date" type="date" value={leavedateTodo} min={joindateTodo} onChange={(e) => setLeavedateTodo(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid item md={4} sm={6} xs={12}>
              <FormControl fullWidth size="small">
                <Typography> Duties</Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    {switchValues?.workDuties ? (
                      <OutlinedInput id="component-outlined" type="text" placeholder="Duties" value={dutiesTodo} onChange={(e) => setDutiesTodo(e.target.value)} />
                    ) : (
                      <Selects
                        options={
                          masterFieldValues?.duties?.length > 0
                            ? masterFieldValues?.duties?.map((data) => ({
                                label: data,
                                value: data,
                              }))
                            : []
                        }
                        placeholder="Please Select"
                        value={{ label: dutiesTodo === '' ? 'Please Select Duties' : dutiesTodo, value: dutiesTodo === '' ? 'Please Select Duties' : dutiesTodo }}
                        onChange={(e) => {
                          setDutiesTodo(e.value);
                        }}
                      />
                    )}
                  </Box>

                  <FormGroup>
                    <Button
                      variant={switchValues?.workDuties ? 'contained' : 'outlined'}
                      onClick={() => {
                        setSwicthValues((prev) => ({
                          ...prev,
                          workDuties: !switchValues?.workDuties,
                        }));
                        setDutiesTodo('');
                      }}
                      size="small"
                    >
                      {switchValues?.workDuties ? 'Exist' : 'New'}
                    </Button>
                  </FormGroup>
                </Box>
              </FormControl>
            </Grid>
            <Grid item md={4} sm={5} xs={12}>
              <FormControl fullWidth size="small">
                <Typography> Reason for Leaving</Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    {switchValues?.workReason ? (
                      <OutlinedInput id="component-outlined" type="text" placeholder="Reason for Leaving" value={reasonTodo} onChange={(e) => setReasonTodo(e.target.value)} />
                    ) : (
                      <Selects
                        options={
                          masterFieldValues?.reasons?.length > 0
                            ? masterFieldValues?.reasons?.map((data) => ({
                                label: data,
                                value: data,
                              }))
                            : []
                        }
                        placeholder="Please Select"
                        value={{ label: reasonTodo === '' ? 'Please Select Reasons' : reasonTodo, value: reasonTodo === '' ? 'Please Select Reasons' : reasonTodo }}
                        onChange={(e) => {
                          setReasonTodo(e.value);
                        }}
                      />
                    )}
                  </Box>

                  <FormGroup>
                    <Button
                      variant={switchValues?.workReason ? 'contained' : 'outlined'}
                      onClick={() => {
                        setSwicthValues((prev) => ({
                          ...prev,
                          workReason: !switchValues?.workReason,
                        }));
                        setReasonTodo('');
                      }}
                      size="small"
                    >
                      {switchValues?.workReason ? 'Exist' : 'New'}
                    </Button>
                  </FormGroup>
                </Box>
              </FormControl>
            </Grid>
            <Grid item md={1} sm={12} xs={12}>
              <FormControl size="small">
                <Button variant="contained" color="success" type="button" onClick={handleSubmitWorkSubmit} sx={userStyle.Todoadd}>
                  <FaPlus />
                </Button>
                &nbsp;
              </FormControl>
            </Grid>
            <br />
          </Grid>
          <Typography sx={userStyle.SubHeaderText}> Work History Details </Typography>
          <br />
          <br />
          <br />
          {/* ****** Table start ****** */}
          <TableContainer component={Paper}>
            <Table
              aria-label="simple table"
              id="branch"
              // ref={tableRef}
            >
              <TableHead sx={{ fontWeight: '600' }}>
                <StyledTableRow>
                  <StyledTableCell align="center">SI.NO</StyledTableCell>
                  <StyledTableCell align="center">Employee Name</StyledTableCell>
                  <StyledTableCell align="center">Designation</StyledTableCell>
                  <StyledTableCell align="center">Joined On</StyledTableCell>
                  <StyledTableCell align="center">Leave On</StyledTableCell>
                  <StyledTableCell align="center">Duties</StyledTableCell>
                  <StyledTableCell align="center">Reason for Leaving</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {workhistTodoEdit &&
                  workhistTodoEdit.map((todo, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="center">{snowe++}</StyledTableCell>
                      <StyledTableCell align="left">{todo.empNameTodo}</StyledTableCell>
                      <StyledTableCell align="center">{todo.desigTodo}</StyledTableCell>
                      <StyledTableCell align="center">{todo.joindateTodo ? moment(todo.joindateTodo)?.format('DD-MM-YYYY') : ''}</StyledTableCell>
                      <StyledTableCell align="center">{todo.leavedateTodo ? moment(todo.leavedateTodo)?.format('DD-MM-YYYY') : ''}</StyledTableCell>
                      <StyledTableCell align="center">{todo.dutiesTodo}</StyledTableCell>
                      <StyledTableCell align="center">{todo.reasonTodo}</StyledTableCell>
                      <StyledTableCell align="center">
                        {
                          <Button variant="contained" color="error" type="button" onClick={() => handleWorkHisDelete(index)} sx={userStyle.Todoadd}>
                            <AiOutlineClose />
                          </Button>
                        }
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {errors.workhistedit && <div>{errors.workhistedit}</div>}
          <Grid item md={12} sm={12} xs={12}>
            <Typography>
              Proof&nbsp;<b style={{ color: 'red' }}>*</b>
            </Typography>
            {infoProof.workhistproof && (
              <>
                <Grid sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <img src={infoProof.workhistproof} style={{ height: 120, width: 170 }} alt="WorkhistProof" />
                </Grid>
              </>
            )}
            <br />
            <Grid sx={{ display: 'flex' }}>
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: 'flex' }}>
                  <Button component="label" sx={buttonStyles.buttonsubmit}>
                    Upload
                    <input type="file" id="workhistproof" accept="image/*" name="file" hidden onChange={handleImageUploadwork} />
                  </Button>
                  <Button
                    onClick={(e) => {
                      setFile('');
                      setInfoProof({ ...infoProof, workhistproof: '' });
                    }}
                    sx={buttonStyles.btncancel}
                  >
                    Clear
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            {errors.workhistproof && <div>{errors.workhistproof}</div>}
          </Grid>
          <br />
          <br />
          <Grid item md={12} sm={12} xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              sx={buttonStyles.btncancel}
              onClick={() => {
                setIsWorkHistoryOpenEdit(false);
                setAddOpenalertWork(false);
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={(e) => {
                requiredFieldCheckWork();
              }}
              type="button"
              sx={{ ...buttonStyles.buttonsubmit, height: '38px' }}
            >
              Submit
            </Button>
          </Grid>
        </Box>
        <br />
      </Dialog>
      {/* Bank Details Popup For Edit*/}
      <Dialog open={isBankDetailsOpenEdit} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="lg" sx={{ marginTop: '80px' }}>
        <Box sx={userStyle.selectcontainer}>
          <Typography sx={userStyle.SubHeaderText}>Bank Details </Typography>
          <br />
          <br />
          <Grid container spacing={2}>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Bank Name</Typography>
                <Selects
                  maxMenuHeight={250}
                  options={accounttypes}
                  placeholder="Please Choose Bank Name"
                  value={{
                    label: allInformationEdit.bankname === '' || allInformationEdit.bankname == undefined ? 'ICICI BANK - ICICI' : allInformationEdit.bankname,
                    value: allInformationEdit.bankname === '' || allInformationEdit.bankname == undefined ? 'ICICI BANK - ICICI' : allInformationEdit.bankname,
                  }}
                  onChange={(e) => {
                    setAllInformationEdit({
                      ...allInformationEdit,
                      bankname: e.value,
                      bankbranchname: '',
                      accountholdername: '',
                      accountnumber: '',
                      ifsccode: '',
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>
                  Bank Branch Name
                  <span
                    style={{
                      display: 'inline',
                      fontSize: '0.8rem',
                      color: 'blue',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      marginLeft: '5px',
                    }}
                    onClick={handleModalOpen}
                  >
                    {'(Get By IFSC Code)'}
                  </span>
                </Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Please Enter Bank Branch Name"
                  name="bankbranchname"
                  value={allInformationEdit.bankbranchname}
                  onChange={(e) => {
                    setAllInformationEdit({
                      ...allInformationEdit,
                      bankbranchname: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Account Holder Name</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Please Enter Account Name"
                  value={allInformationEdit.accountholdername}
                  onChange={(e) => {
                    setAllInformationEdit({
                      ...allInformationEdit,
                      accountholdername: e.target.value,
                    });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>Account Number</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="number"
                  sx={userStyle.input}
                  placeholder="Please Enter Account Number"
                  value={allInformationEdit.accountnumber}
                  onChange={(e) => {
                    setAllInformationEdit({ ...allInformationEdit, accountnumber: e.target.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <Typography>IFSC Code</Typography>
                <OutlinedInput
                  id="component-outlined"
                  type="text"
                  placeholder="Please Enter IFSC Code"
                  value={allInformationEdit.ifsccode}
                  onChange={(e) => {
                    setAllInformationEdit({ ...allInformationEdit, ifsccode: e.target.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12} sm={12} sx={{ display: 'flex' }}>
              <FormControl fullWidth size="small">
                <Typography>Type of Account</Typography>
                <Selects
                  maxMenuHeight={250}
                  options={typeofaccount}
                  placeholder="Please Choose Account Type"
                  value={{
                    label: allInformationEdit.accounttype === '' || allInformationEdit.accounttype == undefined ? 'Please Select Account Type' : allInformationEdit.accounttype,
                    value: allInformationEdit.accounttype === '' || allInformationEdit.accounttype == undefined ? 'Please Select Account Type' : allInformationEdit.accounttype,
                  }}
                  onChange={(e) => {
                    setAllInformationEdit({ ...allInformationEdit, accounttype: e.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={4} sm={8} xs={8}>
              <FormControl fullWidth size="small">
                <Typography>Status</Typography>
                <Selects
                  maxMenuHeight={250}
                  options={accountstatus}
                  placeholder="Please Select Status"
                  value={{
                    label: allInformationEdit.accountstatus,
                    value: allInformationEdit.accountstatus,
                  }}
                  onChange={(e) => {
                    setAllInformationEdit({ ...allInformationEdit, accountstatus: e.value });
                  }}
                />
              </FormControl>
            </Grid>
            <Grid
              item
              md={2}
              sm={8}
              xs={8}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // marginTop: "10%",
              }}
            >
              <Button
                variant="contained"
                component="label"
                size="small"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '10%',
                  height: '25px',
                }}
              >
                Upload
                <input
                  accept="image/*,application/pdf"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    handleBankDetailsUpload(e);
                  }}
                />
              </Button>
            </Grid>
            {bankUpload?.length > 0 && (
              <Grid
                item
                md={5}
                sm={8}
                xs={8}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // marginTop: "10%",
                }}
              >
                {bankUpload?.length > 0 &&
                  bankUpload.map((file) => (
                    <>
                      <Grid container spacing={2}>
                        <Grid item md={8} sm={8} xs={8}>
                          <Typography
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '100%',
                            }}
                            title={file.name}
                          >
                            {file.name}
                          </Typography>
                        </Grid>
                        <Grid item md={2} sm={1} xs={1}>
                          <VisibilityOutlinedIcon
                            style={{
                              fontsize: 'large',
                              color: '#357AE8',
                              cursor: 'pointer',
                            }}
                            onClick={() => renderFilePreview(file)}
                          />
                        </Grid>
                        <br />
                        <br />
                        <Grid item md={2} sm={1} xs={1}>
                          <Button
                            style={{
                              fontsize: 'large',
                              color: '#357AE8',
                              cursor: 'pointer',
                              marginTop: '-5px',
                              marginRight: '10px',
                            }}
                            onClick={() => setBankUpload([])}
                          >
                            <DeleteIcon />
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  ))}
              </Grid>
            )}
            &emsp;
            <Button
              variant="contained"
              color="success"
              onClick={handleBankTodo}
              type="button"
              sx={{
                height: '30px',
                minWidth: '30px',
                marginTop: '38px',
                padding: '6px 10px',
              }}
            >
              <FaPlus />
            </Button>
            &nbsp;
          </Grid>
          {errors.bankedit && <div>{errors.bankedit}</div>}
          <br />
          {bankTodoEdit.map((data, index) => (
            <div key={index}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography sx={{ fontWeight: 'bold' }}>{`Row No : ${index + 1}`}</Typography>
                </Grid>
              </Grid>
              <br />
              <Grid container spacing={2}>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Bank Name<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={accounttypes}
                      placeholder="Please Select Bank Name"
                      value={{ label: data.bankname, value: data.bankname }}
                      onChange={(e) => {
                        handleBankTodoChange(index, 'bankname', e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Bank Branch Name<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={data.bankbranchname}
                      placeholder="Please Enter Bank Branch Name"
                      onChange={(e) => {
                        handleBankTodoChange(index, 'bankbranchname', e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Account Holder Name<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={data.accountholdername}
                      placeholder="Please Enter Account Holder Name"
                      onChange={(e) => {
                        handleBankTodoChange(index, 'accountholdername', e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      Account Number<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={data.accountnumber}
                      placeholder="Please Enter Account Number"
                      onChange={(e) => {
                        handleBankTodoChange(index, 'accountnumber', e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12} sx={{ display: 'flex' }}>
                  <FormControl fullWidth size="small">
                    <Typography>
                      IFSC Code<b style={{ color: 'red' }}>*</b>
                    </Typography>
                    <OutlinedInput
                      id="component-outlined"
                      type="text"
                      value={data.ifsccode}
                      placeholder="Please Enter IFSC Code"
                      onChange={(e) => {
                        handleBankTodoChange(index, 'ifsccode', e.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={4} xs={12} sm={12} sx={{ display: 'flex' }}>
                  <FormControl fullWidth size="small">
                    <Typography>Type of Account</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={typeofaccount}
                      placeholder="Please Choose Account Type"
                      value={{
                        label: data.accounttype,
                        value: data.accounttype,
                      }}
                      onChange={(e) => {
                        handleBankTodoChange(index, 'accounttype', e.value);
                      }}
                    />
                  </FormControl>
                  &nbsp; &emsp;
                </Grid>
                <Grid item md={4} xs={12} sm={12} sx={{ display: 'flex' }}>
                  <FormControl fullWidth size="small">
                    <Typography>Status</Typography>
                    <Selects
                      maxMenuHeight={250}
                      options={accountstatus}
                      placeholder="Please Choose Status"
                      value={{
                        label: data.accountstatus,
                        value: data.accountstatus,
                      }}
                      onChange={(e) => {
                        handleBankTodoChange(index, 'accountstatus', e.value);
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} xs={12} sm={12} sx={{ display: 'flex' }}>
                  <Grid container spacing={2}>
                    <Grid
                      item
                      md={2}
                      sm={8}
                      xs={8}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // marginTop: "10%",
                      }}
                    >
                      <Button variant="contained" component="label" size="small" sx={buttonStyles.buttonsubmit}>
                        Upload
                        <input
                          accept="image/*,application/pdf"
                          type="file"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            handleBankTodoChangeProof(e, index);
                          }}
                        />
                      </Button>
                    </Grid>
                    {data?.proof?.length > 0 && (
                      <Grid
                        item
                        md={5}
                        sm={8}
                        xs={8}
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          // marginTop: "10%",
                        }}
                      >
                        {data?.proof?.length > 0 &&
                          data?.proof.map((file) => (
                            <>
                              <Grid container spacing={2}>
                                <Grid item md={8} sm={8} xs={8}>
                                  <Typography
                                    style={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      maxWidth: '100%',
                                    }}
                                    title={file.name}
                                  >
                                    {file.name}
                                  </Typography>
                                </Grid>
                                <Grid item md={1} sm={1} xs={1}>
                                  <VisibilityOutlinedIcon
                                    style={{
                                      fontsize: 'large',
                                      color: '#357AE8',
                                      cursor: 'pointer',
                                      marginLeft: '-7px',
                                    }}
                                    onClick={() => renderFilePreview(file)}
                                  />
                                </Grid>
                                <br />
                                <br />
                                <Grid item md={3} sm={1} xs={1}>
                                  <Button
                                    style={{
                                      fontsize: 'large',
                                      color: '#357AE8',
                                      cursor: 'pointer',
                                      marginTop: '-5px',
                                    }}
                                    onClick={() => handleDeleteProof(index)}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                </Grid>
                              </Grid>
                            </>
                          ))}
                      </Grid>
                    )}
                    <Grid item md={1} sm={8} xs={8}>
                      <Button
                        variant="contained"
                        color="error"
                        type="button"
                        onClick={() => deleteTodoEdit(index)}
                        sx={{
                          height: '30px',
                          minWidth: '30px',
                          marginTop: '28px',
                          padding: '6px 10px',
                        }}
                      >
                        <AiOutlineClose />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <br />
            </div>
          ))}{' '}
          <br />
          <Grid item md={12} sm={12} xs={12}>
            <Typography>
              Proof&nbsp;<b style={{ color: 'red' }}>*</b>
            </Typography>
            {infoProof.bankdetailsproof && (
              <>
                <Grid sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <img src={infoProof.bankdetailsproof} style={{ height: 120, width: 170 }} alt="BankdetailsProof" />
                </Grid>
              </>
            )}
            <br />
            <Grid sx={{ display: 'flex' }}>
              <FormControl size="small" fullWidth>
                <Grid sx={{ display: 'flex' }}>
                  <Button component="label" sx={buttonStyles.buttonsubmit}>
                    Upload
                    <input type="file" id="bankdetailsproof" accept="image/*" name="file" hidden onChange={handleImageUploadbank} />
                  </Button>
                  <Button
                    onClick={(e) => {
                      setFile('');
                      setInfoProof({ ...infoProof, bankdetailsproof: '' });
                    }}
                    sx={buttonStyles.btncancel}
                  >
                    Clear
                  </Button>
                </Grid>
              </FormControl>
            </Grid>
            {errors.bankdetailsproof && <div>{errors.bankdetailsproof}</div>}
          </Grid>
          <br />
          <br />
          <Grid item md={12} sm={12} xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              sx={buttonStyles.btncancel}
              onClick={() => {
                setIsBankDetailsOpenEdit(false);
                setAddOpenalertBank(false);
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={(e) => {
                requiredFieldCheckBank();
              }}
              type="button"
              sx={{ ...buttonStyles.buttonsubmit, height: '38px' }}
            >
              Submit
            </Button>
          </Grid>
        </Box>
      </Dialog>
      {/* **************************************************************************************************************** */}
      {/* You can edit now */}
      {/* Are You Sure For Personal Information */}
      <Dialog open={isAddOpenalertPersonal} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent
          sx={{
            padding: '37px 23px',
            width: '350px',
            textAlign: 'center',
            alignItems: 'center',
          }}
        >
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
            <Typography variant="h6">
              <b>Are you sure? Do you want to edit the details?</b>
            </Typography>
          </>
          <br />
          <br />
          <Grid sx={{ display: 'flex', justifyContent: 'center', gap: '150px' }}>
            <Grid>
              <Button
                variant="outlined"
                onClick={() => {
                  setAddOpenalertPersonal(false);
                }}
                type="button"
                sx={buttonStyles.btncancel}
              >
                Cancel
              </Button>
            </Grid>{' '}
            <Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={(params) => {
                  setIsPersonalInfoOpenEdit(true);
                }}
                sx={{
                  height: '40px',
                  width: '60px',
                  padding: '6px 10px',
                  ...buttonStyles.buttonsubmit,
                }}
              >
                Edit
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {/* Are you sure? Do you want to edit the details? For Reference Details */}
      <Dialog open={isAddOpenalertReference} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent
          sx={{
            padding: '37px 23px',
            width: '350px',
            textAlign: 'center',
            alignItems: 'center',
          }}
        >
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
            <Typography variant="h6">
              <b>Are you sure? Do you want to edit the details?</b>
            </Typography>
          </>{' '}
          <br />
          <br />
          <Grid sx={{ display: 'flex', justifyContent: 'center', gap: '150px' }}>
            <Grid>
              <Button
                variant="contained"
                // color="primary"
                onClick={() => {
                  setAddOpenalertReference(false);
                }}
                type="button"
                sx={buttonStyles.btncancel}
              >
                Cancel
              </Button>
            </Grid>{' '}
            <Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsReferenceOpenEdit(true)}
                type="button"
                sx={{
                  height: '40px',
                  width: '60px',
                  padding: '6px 10px',
                  ...buttonStyles.buttonsubmit,
                }}
              >
                Edit
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {/* Are you sure For Permanent Address */}
      <Dialog open={isAddOpenalertPermanant} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent
          sx={{
            padding: '37px 23px',
            width: '350px',
            textAlign: 'center',
            alignItems: 'center',
          }}
        >
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
            <Typography variant="h6">
              <b>Are you sure? Do you want to edit the details?</b>
            </Typography>
          </>
          <br />
          <br />
          <Grid sx={{ display: 'flex', justifyContent: 'center', gap: '150px' }}>
            <Grid>
              <Button
                variant="contained"
                // color="primary"
                onClick={() => {
                  setAddOpenalertPermanant(false);
                }}
                type="button"
                sx={buttonStyles.btncancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsPermanantAddressOpenEdit(true)}
                type="button"
                sx={{
                  height: '40px',
                  width: '60px',
                  padding: '6px 10px',
                  ...buttonStyles.buttonsubmit,
                }}
              >
                Edit
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {/* Are You Sure For Current Address */}
      <Dialog open={isAddOpenalertCurrent} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent
          sx={{
            padding: '37px 23px',
            width: '350px',
            textAlign: 'center',
            alignItems: 'center',
          }}
        >
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
            <Typography variant="h6">
              <b>Are you sure? Do you want to edit the details?</b>
            </Typography>
          </>
          <br />
          <br />
          <Grid sx={{ display: 'flex', justifyContent: 'center', gap: '150px' }}>
            <Grid>
              <Button
                variant="contained"
                // color="primary"
                onClick={() => {
                  setAddOpenalertCurrent(false);
                }}
                type="button"
                sx={buttonStyles.btncancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsCurrentAddressOpenEdit(true)}
                type="button"
                sx={{
                  height: '40px',
                  width: '60px',
                  padding: '6px 10px',
                  ...buttonStyles.buttonsubmit,
                }}
              >
                Edit
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {/* Are you sure? Do you want to edit the details? For Document List*/}
      <Dialog open={isAddOpenalertDocument} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent
          sx={{
            padding: '37px 23px',
            width: '350px',
            textAlign: 'center',
            alignItems: 'center',
          }}
        >
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
            <Typography variant="h6">
              <b>Are you sure? Do you want to edit the details?</b>
            </Typography>
          </>
          <br />
          <br />
          <Grid sx={{ display: 'flex', justifyContent: 'center', gap: '150px' }}>
            <Grid>
              <Button
                variant="contained"
                // color="primary"
                onClick={() => {
                  setAddOpenalertDocument(false);
                }}
                type="button"
                sx={buttonStyles.btncancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsDocumentListOpenEdit(true)}
                type="button"
                sx={{
                  height: '40px',
                  width: '60px',
                  padding: '6px 10px',
                  ...buttonStyles.buttonsubmit,
                }}
              >
                Edit
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {/* Are you sure? Do you want to edit the details? For Educational Qualification */}
      <Dialog open={isAddOpenalertEducational} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent
          sx={{
            padding: '37px 23px',
            width: '350px',
            textAlign: 'center',
            alignItems: 'center',
          }}
        >
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
            <Typography variant="h6">
              <b>Are you sure? Do you want to edit the details?</b>
            </Typography>
          </>
          <br />
          <br />
          <Grid sx={{ display: 'flex', justifyContent: 'center', gap: '150px' }}>
            <Grid>
              <Button
                variant="contained"
                // color="primary"
                onClick={() => {
                  setAddOpenalertEducational(false);
                }}
                type="button"
                sx={buttonStyles.btncancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEducationalQualifyOpenEdit(true)}
                type="button"
                sx={{
                  height: '40px',
                  width: '60px',
                  padding: '6px 10px',
                  ...buttonStyles.buttonsubmit,
                }}
              >
                Edit
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {/* Are you sure? Do you want to edit the details? For Additional Qualification */}
      <Dialog open={isAddOpenalertAdditional} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent
          sx={{
            padding: '37px 23px',
            width: '350px',
            textAlign: 'center',
            alignItems: 'center',
          }}
        >
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
            <Typography variant="h6">
              <b>Are you sure? Do you want to edit the details?</b>
            </Typography>
          </>
          <br />
          <br />
          <Grid sx={{ display: 'flex', justifyContent: 'center', gap: '150px' }}>
            <Grid>
              <Button
                variant="contained"
                // color="primary"
                onClick={() => {
                  setAddOpenalertAdditional(false);
                }}
                type="button"
                sx={buttonStyles.btncancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsAdditionalQualifyOpenEdit(true)}
                type="button"
                sx={{
                  height: '40px',
                  width: '60px',
                  padding: '6px 10px',
                  ...buttonStyles.buttonsubmit,
                }}
              >
                Edit
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {/* Are You Sure For Work History */}
      <Dialog open={isAddOpenalertWork} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent
          sx={{
            padding: '37px 23px',
            width: '350px',
            textAlign: 'center',
            alignItems: 'center',
          }}
        >
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
            <Typography variant="h6">
              <b>Are you sure? Do you want to edit the details?</b>
            </Typography>
          </>
          <br />
          <br />
          <Grid sx={{ display: 'flex', justifyContent: 'center', gap: '150px' }}>
            <Grid>
              <Button
                variant="contained"
                // color="primary"
                onClick={() => {
                  setAddOpenalertWork(false);
                }}
                type="button"
                sx={buttonStyles.btncancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsWorkHistoryOpenEdit(true)}
                type="button"
                sx={{
                  height: '40px',
                  width: '60px',
                  padding: '6px 10px',
                  ...buttonStyles.buttonsubmit,
                }}
              >
                Edit
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      {/* Are You Sure For Bank Details*/}
      <Dialog open={isAddOpenalertBank} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent
          sx={{
            padding: '37px 23px',
            width: '350px',
            textAlign: 'center',
            alignItems: 'center',
          }}
        >
          <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: '100px', color: 'orange' }} />
            <Typography variant="h6">
              <b>Are you sure? Do you want to edit the details?</b>
            </Typography>
          </>
          <br />
          <br />
          <Grid sx={{ display: 'flex', justifyContent: 'center', gap: '150px' }}>
            <Grid>
              <Button
                variant="contained"
                // color="primary"
                onClick={() => {
                  setAddOpenalertBank(false);
                }}
                type="button"
                sx={buttonStyles.btncancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsBankDetailsOpenEdit(true)}
                type="button"
                sx={{
                  height: '40px',
                  width: '60px',
                  padding: '6px 10px',
                  ...buttonStyles.buttonsubmit,
                }}
              >
                Edit
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <>
        <div>
          <Modal open={ifscModalOpen} onClose={handleModalClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
            <div
              style={{
                margin: 'auto',
                backgroundColor: 'white',
                padding: '20px',
                maxWidth: '500px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h6">Enter IFSC Code</Typography>
                <IconButton onClick={handleModalClose}>
                  <CloseIcon />
                </IconButton>
              </div>
              <OutlinedInput type="text" placeholder="Enter IFSC Code" name="ifscCode" style={{ height: '30px', margin: '10px' }} value={allInformationEdit.ifscCode} onChange={handleInputChange} />
              <LoadingButton
                variant="contained"
                // loading={loading}
                color="primary"
                sx={{ borderRadius: '20px', marginLeft: '5px' }}
                onClick={fetchBankDetails}
              >
                Get Branch
              </LoadingButton>
              <br />
              {bankDetails && (
                <div>
                  <Typography variant="subtitle1">Bank Name: {bankDetails.BANK}</Typography>
                  <Typography variant="subtitle1">Branch Name: {bankDetails.BRANCH}</Typography>
                  <Button
                    variant="contained"
                    sx={{ borderRadius: '20px', padding: '0 10px' }}
                    onClick={(e) => {
                      const matchedBank = accounttypes.find((bank) => {
                        const labelBeforeHyphen = bank.label.split(' - ')[0];
                        return labelBeforeHyphen.toLowerCase()?.trim() === bankDetails.BANK.toLowerCase()?.trim();
                      });
                      setAllInformationEdit({
                        ...allInformationEdit,
                        bankbranchname: String(bankDetails.BRANCH),
                        ifsccode: allInformationEdit.ifscCode,
                        bankname: matchedBank?.value,
                      });
                      handleModalClose();
                    }}
                  >
                    Submit
                  </Button>
                </div>
              )}
            </div>
          </Modal>
        </div>
      </>
      <ExportData
        isFilterOpen={isFilterOpen}
        handleCloseFilterMod={handleCloseFilterMod}
        fileFormat={fileFormat}
        setIsFilterOpen={setIsFilterOpen}
        isPdfFilterOpen={isPdfFilterOpen}
        setIsPdfFilterOpen={setIsPdfFilterOpen}
        handleClosePdfFilterMod={handleClosePdfFilterMod}
        filteredDataTwo={(filteredChanges !== null ? filteredRowData : rowDataTable) ?? []}
        itemsTwo={employees ?? []}
        filename={'My Verification List '}
        exportColumnNames={exportColumnNames}
        exportRowValues={exportRowValues}
        componentRef={componentRef}
      />

      <MessageAlert openPopup={openPopupMalert} handleClosePopup={handleClosePopupMalert} popupContent={popupContentMalert} popupSeverity={popupSeverityMalert} />
      {/* SUCCESS */}
      <AlertDialog openPopup={openPopup} handleClosePopup={handleClosePopup} popupContent={popupContent} popupSeverity={popupSeverity} />
      <Loader loading={loading} message={loadingMessage} />

      <Dialog
        open={isErrorOpenpop}
        onClose={(event, reason) => {
          if (reason === 'backdropClick') {
            // Ignore backdrop clicks
            return;
          }
          handleCloseerrpop(); // Handle other close actions
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth={true}
        sx={{ marginTop: '80px' }}
      >
        <Box sx={userStyle.dialogbox}>
          <>
            <Typography sx={userStyle.HeaderText}>
              {' '}
              <b>Existing Profile List</b>
            </Typography>
            <Grid item md={6} sm={12} xs={12}>
              {showDupProfileVIsitor && showDupProfileVIsitor.length > 0 ? (
                <ExistingProfileVisitor ExistingProfileVisitors={showDupProfileVIsitor} />
              ) : (
                <Typography
                  sx={{
                    ...userStyle.HeaderText,
                    marginLeft: '28px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  There is No Profile
                </Typography>
              )}
            </Grid>
            <br />
            <Grid item md={12} sm={12} xs={12}>
              <Grid
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '15px',
                }}
              >
                <Tooltip title={showDupProfileVIsitor?.some((data) => data?.modelName === 'Employee') ? 'Cannot upload duplicate images for Employee.' : ''} placement="top" arrow>
                  <span>
                    <Button
                      style={{
                        padding: '7px 13px',
                        color: 'white',
                        background: 'rgb(25, 118, 210)',
                        ...buttonStyles?.buttonsubmit,
                      }}
                      disabled={showDupProfileVIsitor?.some((data) => data?.modelName === 'Employee')}
                      onClick={() => {
                        UploadWithDuplicate();
                      }}
                    >
                      Upload With Duplicate
                    </Button>
                  </span>
                </Tooltip>
                <Button sx={buttonStyles.btncancel} onClick={UploadWithoutDuplicate}>
                  Upload Without Duplicate
                </Button>
              </Grid>
            </Grid>
          </>
        </Box>
      </Dialog>
    </Box>
  );
}
export default MyVerification;
