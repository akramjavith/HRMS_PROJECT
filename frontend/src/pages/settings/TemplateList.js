import { Box, Button, FormControl, Grid, OutlinedInput, Typography } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import axios from 'axios'
import * as FileSaver from 'file-saver'
import moment from 'moment'
import React, { useContext, useEffect, useState } from 'react'
import { FaFileExcel } from 'react-icons/fa'
import { MultiSelect } from 'react-multi-select-component'
import * as XLSX from 'xlsx'
import AlertDialog from "../../components/Alert"
import Headtitle from '../../components/Headtitle'
import MessageAlert from "../../components/MessageAlert"
import { AuthContext, UserRoleAccessContext } from '../../context/Appcontext'
import { userStyle } from '../../pageStyle'
import { SERVICE } from '../../services/Baseservice'
import PageHeading from "../../components/PageHeading";

const Loader = ({ loading, message }) => {
    return (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <div style={{ textAlign: 'center' }}>
                <CircularProgress sx={{ color: '#edf1f7' }} />
                <Typography variant="h6" sx={{ mt: 2, color: '#edf1f7' }}>
                    {message}
                </Typography>
            </div>
        </Backdrop>
    );
};
function TemplateList() {
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
    }
    const [isClearOpenalert, setIsClearOpenalert] = useState(false)
    setTimeout(
        () => {
            setIsClearOpenalert(false)
        }, 2500
    )
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Please Wait...!');
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const exportToCSV = (csvData, fileName) => {
        if (!csvData || !Array.isArray(csvData)) {
            console.error('Invalid csvData provided');
            return;
        }
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
        setLoading(false);
    };
    const { isUserRoleCompare, isUserRoleAccess, isAssignBranch, pageName, setPageName } = useContext(UserRoleAccessContext);
    const username = isUserRoleAccess.username;
    const [allMyVerification, setAllMyVerification] = useState([]);
    const { auth } = useContext(AuthContext);
    const [fileName, setFileName] = useState('');
    //information Multiselect
    const [informationOption, setInformationOption] = useState([
        { label: "Personal Information", value: "Personal Information" },
        { label: "Login & Boarding Details", value: "Login & Boarding Details" },
        { label: "Address", value: "Address" },
        { label: "Document", value: "Document" },
        { label: "Work History", value: "Work History" },
        { label: "Bank Details", value: "Bank Details" }
    ]);
    const [informationValue, setInformationValue] = useState([])
    const [informationValueAdd, setInformationValueAdd] = useState("")
    const handleInformationChangeAdd = (options) => {
        setInformationValueAdd(
            options.map(item => { return item.value })
        )
        setInformationValue(options);
        subInfoClear();
    }
    const customRendererInformationAdd = (valueInformationAdd, _informations) => {
        return valueInformationAdd.length ? valueInformationAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Information</span>
    }
    //Login and Boarding Multiselect
    const [loginOptions] = useState([
        { label: "Reference Details", value: "Reference Details" },
        { label: "Login Details", value: "Login Details" },
        { label: "Boarding Information", value: "Boarding Information" }
    ])
    const [loginValue, setLoginValue] = useState([]);
    const [loginValueAdd, setLoginValueAdd] = useState("");
    const handleLoginChange = (options) => {
        setLoginValueAdd(
            options.map((item) => { return item.value })
        )
        setLoginValue(options)
    }
    const customeRendererLoginAdd = (valueLoginAdd, _login) => {
        return valueLoginAdd.length ? valueLoginAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Login & Boarding Details Sub-Information</span>
    }
    //Address Multiselect
    const [addressOptions] = useState([
        { label: "Permanent Address", value: "Permanent Address" },
        { label: "Current Address", value: "Current Address" },
    ])
    const [addressValue, setAddressValue] = useState([]);
    const [addressValueAdd, setAddressValueAdd] = useState("");
    const handleAddressChange = (options) => {
        setAddressValueAdd(
            options.map((item) => { return item.value })
        )
        setAddressValue(options)
    }
    const customeRendererAddressAdd = (valueAddressAdd, _login) => {
        return valueAddressAdd.length ? valueAddressAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Address Sub-Information</span>
    }
    //Document Multiselect
    const [documentOptions] = useState([
        { label: "Document List", value: "Document List" },
        { label: "Educational qualification", value: "Educational qualification" },
    ])
    const [documentValue, setDocumentValue] = useState([]);
    const [documentValueAdd, setDocumentValueAdd] = useState("");
    const handleDocumentChange = (options) => {
        setDocumentValueAdd(
            options.map((item) => { return item.value })
        )
        setDocumentValue(options)
    }
    const customeRendererDocumentAdd = (valueDocumentAdd, _login) => {
        return valueDocumentAdd.length ? valueDocumentAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Document Sub-Information</span>
    }
    //Work History Multiselect
    const [workHistoryOptions] = useState([
        { label: "Additional qualification", value: "Additional qualification" },
        { label: "Work History", value: "Work History" },
    ])
    const [workHistoryValue, setWorkHistoryValue] = useState([]);
    const [workHistoryValueAdd, setWorkHistoryValueAdd] = useState("");
    const handleWorkHistoryChange = (options) => {
        setWorkHistoryValueAdd(
            options.map((item) => { return item.value })
        )
        setWorkHistoryValue(options)
    }
    const customeRendererWorkHistoryAdd = (valueWorkHistoryAdd, _login) => {
        return valueWorkHistoryAdd.length ? valueWorkHistoryAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Work History Sub-Information</span>
    }
    //Bank Details Multiselect
    const [bankDetailsOptions] = useState([
        { label: "Bank Details", value: "Bank Details" },
        { label: "Exp Log Details", value: "Exp Log Details" },
        { label: "Process Allot", value: "Process Allot" }
    ])
    const [bankDetailsValue, setBankDetailsValue] = useState([]);
    const [bankDetailsaddressValueAdd, setBankDetailsValueAdd] = useState("");
    const handleBankDetailsChange = (options) => {
        setBankDetailsValueAdd(
            options.map((item) => { return item.value })
        )
        setBankDetailsValue(options)
    }
    const customeRendererBankDetailsAdd = (valueBankDetailsAdd, _login) => {
        return valueBankDetailsAdd.length ? valueBankDetailsAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Bank Details Sub-Information</span>
    }
    //Add Popup Model
    const [companyOption, setCompanyOption] = useState([]);
    const [companyValueAdd, setCompanyValueAdd] = useState([]);
    let [valueCompanyAdd, setValueCompanyAdd] = useState("");
    const customValueRendererCompanyAdd = (valueCompanyAdd, _companies) => {
        return valueCompanyAdd.length ? valueCompanyAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Company</span>
    }
    // Company MultiSelect
    const handleCompanyChangeAdd = (options) => {
        setValueCompanyAdd(
            options.map(a => {
                return a.value;
            })
        )
        setCompanyValueAdd(options);
        fetchBranch(options);
        setBranchOption([]);
        setBranchValueAdd([]);
        setUnitOption([]);
        setUnitValueAdd([]);
        setTeamOption([]);
        setEmployeeOption([]);
        setTeamValueAdd([]);
        setEmployeeValueAdd([]);
        setInformationValue([]);
    }
    // Fetching Companies
    const fetchCompanies = async () => {
        setPageName(!pageName)
        try {
            let result = await axios.get(SERVICE.COMPANY, {
                headers: {
                    Autorization: `Bearer ${auth.APIToken}`,
                },
            });
            //Remove Duplicates From Companies
            let uniqueCompanies = Array.from(new Set(result?.data?.companies.map((t) => t.name)));
            setCompanyOption(
                uniqueCompanies.map((t) => ({
                    label: t,
                    value: t
                }))
            )
        }
        catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            } else {
                setPopupContentMalert("something went wrong!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            }
        }
    }
    useEffect(() => {
        getVerification();
        fetchCompanies();
    }, [])
    const [branchOption, setBranchOption] = useState([]);
    const [branchValueAdd, setBranchValueAdd] = useState([]);
    let [valueBranchAdd, setValueBranchAdd] = useState("");
    const customValueRendererBranchAdd = (valueBranchAdd, _branches) => {
        return valueBranchAdd.length ? valueBranchAdd.map(({ label }) => label)?.join(",") :
            <span style={{ color: "hsl(0, 0%, 20%)" }}>Please Select Branch</span>
    }
    // Branch Multi-Select
    const handleBranchChangeAdd = (options) => {
        setValueBranchAdd(
            options.map((a) => {
                return a.value;
            })
        );
        setBranchValueAdd(options);
        fetchUnits(options);
        setUnitOption([]);
        setUnitValueAdd([]);
        setTeamOption([]);
        setTeamValueAdd([]);
        setEmployeeOption([]);
        setEmployeeValueAdd([]);
    };
    //Fetching Branches
    const fetchBranch = async (company) => {
        setPageName(!pageName)
        try {
            let res_branch = await axios.get(SERVICE.BRANCH, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = [];
            res_branch?.data?.branch.map((t) => {
                company.forEach((d) => {
                    if (d.value == t.company) {
                        arr.push(t.name);
                    }
                });
            });
            setBranchOption(
                arr.map((t) => ({
                    label: t,
                    value: t,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            } else {
                setPopupContentMalert("something went wrong!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            }
        }
    };
    const [unitOption, setUnitOption] = useState([]);
    const [unitValueAdd, setUnitValueAdd] = useState([]);
    let [valueUnitAdd, setValueUnitAdd] = useState("");
    const customValueRendererUnitAdd = (valueUnitAdd, _units) => {
        return valueUnitAdd.length ? valueUnitAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Unit</span>
    }
    //Unit MultiSelect
    const handleUnitChangeAdd = (options) => {
        setValueUnitAdd(
            options.map((a) => {
                return a.value;
            })
        );
        setUnitValueAdd(options);
        fetchTeams(options);
    }
    //Fetching Units
    const fetchUnits = async (branch) => {
        setPageName(!pageName)
        try {
            let res_branchunit = await axios.get(SERVICE.UNIT, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = [];
            res_branchunit?.data?.units.map((t) => {
                branch.forEach((d) => {
                    if (d.value == t.branch) {
                        arr.push(t.name);
                    }
                });
            });
            setUnitOption(
                arr.map((t) => ({
                    label: t,
                    value: t,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            } else {
                setPopupContentMalert("something went wrong!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            }
        }
    }
    const [teamOption, setTeamOption] = useState([]);
    const [teamValueAdd, setTeamValueAdd] = useState([]);
    let [valueTeamAdd, setValueTeamAdd] = useState("");
    const customValueRendererTeamAdd = (valueTeamAdd, _teams) => {
        return valueTeamAdd.length ? valueTeamAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Team</span>
    }
    //Team MultiSelect
    const handleTeamChangeAdd = (options) => {
        setValueTeamAdd(
            options.map((a) => {
                return a.value;
            })
        );
        setTeamValueAdd(options);
        fetchEmployee(options)
    }
    //Fetching Teams
    const fetchTeams = async (unit) => {
        setPageName(!pageName)
        try {
            let res_team = await axios.get(SERVICE.TEAMS, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = [];
            res_team?.data?.teamsdetails?.map((t) => {
                unit.forEach((d) => {
                    if (d.value == t.unit) {
                        arr.push(t.teamname);
                    }
                });
            });
            setTeamOption(
                arr.map((t) => ({
                    label: t,
                    value: t,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            } else {
                setPopupContentMalert("something went wrong!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            }
        }
    }
    // const [empcodeValueAdd, setEmpcodeValueAdd] = useState([]);
    const [employeeOption, setEmployeeOption] = useState([]);
    const [employeeValueAdd, setEmployeeValueAdd] = useState([]);
    let [valueEmployeeAdd, setValueEmployeeAdd] = useState("");
    const customValueRendererEmployeeAdd = (valueEmployeeAdd, _employees) => {
        return valueEmployeeAdd.length ? valueEmployeeAdd.map(({ label }) => label).join(",") :
            <span style={{ color: "hsl(0, 0%, 20%" }}>Please Select Employee</span>
    }
    //Employee MultiSelect
    const handleEmployeeChangeAdd = (options) => {
        setValueEmployeeAdd(
            options.map((a) => {
                return a.value;
            })
        );
        setEmployeeValueAdd(options);
    }
    //Fetching Employee
    const fetchEmployee = async (team) => {
        let teamsnew = team.map((item) => item.value);
        setPageName(!pageName)
        try {
            let res_employee = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });
            let arr = res_employee?.data?.users.filter((t) => {
                return teamsnew.includes(t.team)
            });
            setEmployeeOption(
                arr.map((t) => ({
                    label: t.companyname,
                    value: t.companyname,
                }))
            );
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            } else {
                setPopupContentMalert("something went wrong!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            }
        }
    }
    const fieldCheck = async (btn) => {
        if (companyValueAdd.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        } else if (informationValue.length === 0) {
            setPopupContentMalert("Please Select Information!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (fileName.length === 0) {
            setPopupContentMalert("Please Enter File Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (informationValue.some(data => data.value == "Login & Boarding Details") && loginValue.length === 0) {
            setPopupContentMalert("Please Select Login & Boarding Details Sub-Information!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (informationValue.some(data => data.value == "Address") && addressValue.length === 0) {
            setPopupContentMalert("Please Select Address Details Sub-Information!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (informationValue.some(data => data.value == "Document") && documentValue.length === 0) {
            setPopupContentMalert("Please Select  Documentry Sub-Information!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (informationValue.some(data => data.value == "Work History") && workHistoryValue.length === 0) {
            setPopupContentMalert("Please Select Work History Sub-Information!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (informationValue.some(data => data.value == "Bank Details") && bankDetailsValue.length === 0) {
            setPopupContentMalert("Please Select Bank Details Sub-Information!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        } else {
            if (btn === "verify") {
                handleExcelVerifyDatas()
            } else {
                handleExcelDatas();
            }
        }
    }
    const getVerification = async (e) => {
        setPageName(!pageName)
        try {
            let res_TemplateList = await axios.get(`${SERVICE.MYVERIFICATION}`, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            })
            let templateList = res_TemplateList?.data?.templateList;
            setAllMyVerification(templateList);
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            } else {
                setPopupContentMalert("something went wrong!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert()
            }
        }
    };
    const fieldCheckForVerify = async (btn) => {
        let compdatas = companyValueAdd?.map((item) => item.value);
        let branchdatas = branchValueAdd?.map((item) => item.value);
        let unitdatas = unitValueAdd?.map((item) => item.value);
        let teamdatas = teamValueAdd?.map((item) => item.value);
        let employeedatas = employeeValueAdd?.map((item) => item.value);
        let informationdatas = informationValue?.map((item) => item.value);
        let logindatas = loginValue?.map((item) => item.value);
        let addressdatas = addressValue?.map((item) => item.value);
        let documentdatas = documentValue?.map((item) => item.value);
        let workhistorydatas = workHistoryValue?.map((item) => item.value);
        let bankdetailsdatas = bankDetailsValue?.map((item) => item.value);
        const isNameMatch = allMyVerification.some(item => (
            item.company.some(data => compdatas.includes(data)) &&
            item.branch.some(data => branchdatas.includes(data)) &&
            item.unit.some(data => unitdatas.includes(data)) &&
            item.team.some(data => teamdatas.includes(data)) &&
            item.employeename.some(data => employeedatas.includes(data)) &&
            (
                (informationdatas.includes("Personal Information") && item.informationstring.includes("Personal Information")) ||
                (informationdatas.includes("Login & Boarding Details") && (
                    item.informationstring.includes("Reference Details") ||
                    item.informationstring.includes("Login Details") ||
                    item.informationstring.includes("Boarding Information")
                )) ||
                (informationdatas.includes("Address") && (
                    item.informationstring.includes("Permanent Address") ||
                    item.informationstring.includes("Current Address")
                )) ||
                (informationdatas.includes("Document") && (
                    item.informationstring.includes("Document List") ||
                    item.informationstring.includes("Educational Qualification")
                )) ||
                (informationdatas.includes("Work History") && (
                    item.informationstring.includes("Additional qualification") ||
                    item.informationstring.includes("Work History")
                )) ||
                (informationdatas.includes("Bank Details") && (
                    item.informationstring.includes("Exp Log Details") ||
                    item.informationstring.includes("Process Allot") ||
                    item.informationstring.includes("Bank Details")
                ))
                    (informationdatas.includes("Reference Details") && (
                        item.informationstring.includes("Reference Details")
                    ))
            )
        ));
        if (isNameMatch) {
            setPopupContentMalert("Data Already Exist");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
            setInformationValue([])
            setLoginValue([])
            setAddressValue([])
            setDocumentValue([])
            setWorkHistoryValue([])
            setBankDetailsValue([])
            getVerification()
        }
        else if (companyValueAdd.length === 0) {
            setPopupContentMalert("Please Select Company!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (branchValueAdd.length === 0) {
            setPopupContentMalert("Please Select Branch!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (unitValueAdd.length === 0) {
            setPopupContentMalert("Please Select Unit!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (teamdatas.length === 0) {
            setPopupContentMalert("Please Select Team!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (employeeValueAdd.length === 0) {
            setPopupContentMalert("Please Select Employee!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (informationValue.length === 0) {
            setPopupContentMalert("Please Select Information!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (fileName.length === 0) {
            setPopupContentMalert("Please Enter File Name!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (informationValue.some(data => data.value == "Login & Boarding Details") && loginValue.length === 0) {
            setPopupContentMalert("Please Select Login & Boarding Details Sub-Information!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (informationValue.some(data => data.value == "Login & Boarding Details") && loginValue.some((item) => item.value == "Login Details")) {
            setPopupContentMalert("Login Details is not allowed for My Verification");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (informationValue.some(data => data.value == "Login & Boarding Details") && loginValue.some((item) => item.value == "Boarding Information")) {
            setPopupContentMalert("Boarding Information is not allowed for My Verification");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (
            informationValue.some(data => data.value == "Login & Boarding Details")
            && loginValue.some(item => item.value == "Login Details")
            && loginValue.some(item => item.value == "Boarding Information")
        ) {
            setPopupContentMalert("Login Details and Boarding Information are not allowed for My Verification");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (informationValue.some(data => data.value == "Address") && addressValue.length === 0) {
            setPopupContentMalert("Please Select Address Details Sub-Information!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (informationValue.some(data => data.value == "Document") && documentValue.length === 0) {
            setPopupContentMalert("Please Select  Documentry Sub-Information!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (informationValue.some(data => data.value == "Work History") && workHistoryValue.length === 0) {
            setPopupContentMalert("Please Select Work History Sub-Information!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (informationValue.some(data => data.value == "Bank Details") && bankDetailsValue.length === 0) {
            setPopupContentMalert("Please Select Bank Details Sub-Information!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (informationValue.some(data => data.value == "Bank Details") && bankDetailsValue.some((item) => item.value == "Exp Log Details")) {
            setPopupContentMalert("Exp Log Details is not allowed for My Verification");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert()
        }
        else if (informationValue.some(data => data.value == "Bank Details") && bankDetailsValue.some((item) => item.value == "Process Allot")) {
            setPopupContentMalert("Process Allot is not allowed for My Verification");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else if (
            informationValue.some(data => data.value == "Bank Details")
            && (
                bankDetailsValue.some(item => item.value == "Exp Log Details")
                && bankDetailsValue.some(item => item.value == "Process Allot")
            )
        ) {
            setPopupContentMalert("Exp Log Details and Process Allot are not allowed for My Verification");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        }
        else {
            sendRequest();
        }
    }
    // Function to export selected heading only
    const handleExcelDatas = async () => {
        setLoading(true);
        setLoadingMessage('Exporting data...');
        setPageName(!pageName)
        try {
            let compdatas = companyValueAdd?.map((item) => item.value);
            let branchdatas = branchValueAdd?.map((item) => item.value);
            let unitdatas = unitValueAdd?.map((item) => item.value);
            let teamdatas = teamValueAdd?.map((item) => item.value);
            let employeedatas = employeeValueAdd?.map((item) => item.value);
            let informationdatas = informationValue?.map((item) => item.value);
            let result = await axios.get(SERVICE.USER, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            })
            let users = result.data.users;
            let filterUser = users.filter((item) => {
                // Case 1: compdatas have values
                if (compdatas.length > 0 && branchdatas.length === 0 && unitdatas.length === 0 && teamdatas.length === 0 && employeedatas.length === 0) {
                    return compdatas.includes(item.company);
                }
                // Case 2: compdatas and branchdatas have values
                else if (compdatas.length > 0 && branchdatas.length > 0 && unitdatas.length === 0 && teamdatas.length === 0 && employeedatas.length === 0) {
                    return compdatas.includes(item.company) && branchdatas.includes(item.branch);
                }
                // Case 3: compdatas, branchdatas, and unitdatas have values
                else if (compdatas.length > 0 && branchdatas.length > 0 && unitdatas.length > 0 && teamdatas.length === 0 && employeedatas.length === 0) {
                    return compdatas.includes(item.company) && branchdatas.includes(item.branch) && unitdatas.includes(item.unit);
                }
                // Case 4: compdatas, branchdatas, unitdatas, and teamdatas have values
                else if (compdatas.length > 0 && branchdatas.length > 0 && unitdatas.length > 0 && teamdatas.length > 0 && employeedatas.length === 0) {
                    return compdatas.includes(item.company) && branchdatas.includes(item.branch) && unitdatas.includes(item.unit) && teamdatas.includes(item.team);
                }
                // Case 5: All arrays have values
                else if (compdatas.length > 0 && branchdatas.length > 0 && unitdatas.length > 0 && teamdatas.length > 0 && employeedatas.length > 0) {
                    return compdatas.includes(item.company) && branchdatas.includes(item.branch) && unitdatas.includes(item.unit) && teamdatas.includes(item.team) && employeedatas.includes(item.companyname);
                }
                // Default: No match
                else {
                    return false;
                }
            })
            let sanitizedData = [];
            // Initialize dataToExport with common fields for all users
            filterUser.forEach((item, index) => {
                let dataToExport = {
                    "S.no": index + 1,
                    Company: item.company,
                    Branch: item.branch,
                    Unit: item.unit,
                    Team: item.team,
                    Employee: item.companyname,
                    EmpCode: item.empcode,
                };
                // Condition to show Personal Information Heading
                if (informationdatas.some(e => e === 'Personal Information') && fileName.length > 0) {
                    dataToExport = {
                        ...dataToExport,
                        "First Name": "",
                        "Last Name": "",
                        "Legal Name": "",
                        "Father Name": "",
                        "Gender": "",
                        "Marital Status": "",
                        "DOM": "",
                        "DOB": "",
                        "Blood Group": "",
                        "Email": "",
                        "Location": "",
                        "Contact (Personal)": "",
                        "Contact (Family)": "",
                        "Emergency Number": "",
                        "DOT": "",
                        "DOJ": "",
                        "Aadhar No": "",
                        "PAN No": ""
                    };
                }
                // Condition to show Login & Boarding Details
                if (informationValue.some(item => item.value === "Login & Boarding Details") && loginValue.some(data => ["Reference Details", "Login Details", "Boarding Information"].includes(data.value)) && fileName.length > 0) {
                    if (loginValue.some(data => data.value === "Reference Details")) {
                        dataToExport = {
                            ...dataToExport,
                            "Name": "",
                            "RelationShip": "",
                            "Occupation": "",
                            "Contact": "",
                            "Details": ""
                        };
                    }
                    if (loginValue.some(data => data.value === "Login Details")) {
                        dataToExport = {
                            ...dataToExport,
                            "Login Name": "",
                            "Password": "",
                            "Company Name": ""
                        };
                    }
                    if (loginValue.some(data => data.value === "Boarding Information")) {
                        dataToExport = {
                            ...dataToExport,
                            "Status": "",
                            "Floor": "",
                            "Area": "",
                            "Department": "",
                            "Work Mode": "",
                            "Designation": "",
                            "Shift Grouping": "",
                            "Shift Timing": "",
                            "Week Off": "",
                            "Reporting To": "",
                            "WorkStation(Primary)": "",
                            "WorkStation(Secondary)": ""
                        };
                    }
                }
                // Condition to show Address
                if (informationValue?.some(item => item.value === "Address") && addressValue?.some(data => ["Current Address", "Permanent Address"]?.includes(data.value)) && fileName.length > 0) {
                    if (addressValue?.some(data => data.value === "Current Address")) {
                        dataToExport = {
                            ...dataToExport,
                            "Current Door/Flat No": "",
                            "Current Street/Block": "",
                            "Current Area/Village": "",
                            "Current Landmark": "",
                            "Current Taluk": "",
                            "Current Post": "",
                            "Current Pincode": "",
                            "Current Country": "",
                            "Current State": "",
                            "Current City": ""
                        };
                    }
                    if (addressValue?.some(data => data.value === "Permanent Address")) {
                        dataToExport = {
                            ...dataToExport,
                            "Permanent Door/Flat No": "",
                            "Permanent Street/Block": "",
                            "Permanent Area/Village": "",
                            "Permanent Landmark": "",
                            "Permanent Taluk": "",
                            "Permanent Post": "",
                            "Permanent Pincode": "",
                            "Permanent Country": "",
                            "Permanent State": "",
                            "Permanent City": ""
                        };
                    }
                }
                // Condition to show Document
                if (informationValue.some(item => item.value === "Document") && documentValue.some(data => ["Document List", "Educational qualification"].includes(data.value)) && fileName.length > 0) {
                    // Check for "Document List" subcategory
                    if (documentValue.some(data => data.value === "Document List")) {
                        dataToExport = {
                            ...dataToExport,
                            "Document": "",
                            "Remarks": ""
                        };
                    }
                    // Check for "Educational qualification" subcategory
                    if (documentValue.some(data => data.value === "Educational qualification")) {
                        dataToExport = {
                            ...dataToExport,
                            "Category": "",
                            "Sub Category": "",
                            "Specialization": "",
                            "Institution": "",
                            "Passed Year": "",
                            "CGPA": ""
                        };
                    }
                }
                // Condition to show Work History
                if (informationValue.some(item => item.value === "Work History") && workHistoryValue.some(data => ["Additional qualification", "Work History"].includes(data.value)) && fileName.length > 0) {
                    // Check for "Additional qualification" subcategory
                    if (workHistoryValue.some(data => data.value === "Additional qualification")) {
                        dataToExport = {
                            ...dataToExport,
                            "Additional Qualification": "",
                            "Institution": "",
                            "Duration": "",
                            "Remarks": ""
                        };
                    }
                    // Check for "Work History" subcategory
                    if (workHistoryValue.some(data => data.value === "Work History")) {
                        dataToExport = {
                            ...dataToExport,
                            "Employee Name": "",
                            "Designation": "",
                            "Joined On": "",
                            "Leave On": "",
                            "Duties": "",
                            "Reason For Leaving": ""
                        };
                    }
                }
                // Condition to show Bank Details
                if (informationValue.some(item => item.value === "Bank Details") && bankDetailsValue.some(data => ["Bank Details", "Exp Log Details", "Process Allot"].includes(data.value)) && fileName.length > 0) {
                    // Check for "Bank Details" subcategory
                    if (bankDetailsValue.some(data => data.value === "Bank Details")) {
                        dataToExport = {
                            ...dataToExport,
                            "Bank Name": "",
                            "Bank Branch Name": "",
                            "Account Holder Name": "",
                            "Account Number": "",
                            "IFSC Code": ""
                        };
                    }
                    // Check for "Exp Log Details" subcategory
                    if (bankDetailsValue.some(data => data.value === "Exp Log Details")) {
                        dataToExport = {
                            ...dataToExport,
                            "Mode Value": "",
                            "Value (In Months)": "",
                            "Date": "",
                            "Mode Exp": "",
                            "End Exp": "",
                            "End Exp Date": "",
                            "Mode Target": "",
                            "End Target": "",
                            "End Target Date": ""
                        };
                    }
                    // Check for "Process Allot" subcategory
                    if (bankDetailsValue.some(data => data.value === "Process Allot")) {
                        dataToExport = {
                            ...dataToExport,
                            "Process": "",
                            "Process Type": "",
                            "Process Duration (Full, Half)": "",
                            "Duration (Hrs:Mins)": "",
                            "Gross Salary": "",
                            "Mode Experience": "",
                            "Target Experience": "",
                            "Target Points": ""
                        };
                    }
                }
                sanitizedData.push(dataToExport);
            }
            );
            function sanitizeData(data) {
                return data.map(item => {
                    let newItem = {};
                    for (let key in item) {
                        if (item.hasOwnProperty(key)) {
                            if (item[key] === undefined || item[key] === "undefined" || item[key] === "Invalid date") {
                                newItem[key] = "";
                            } else {
                                newItem[key] = item[key];
                            }
                        }
                    }
                    return newItem;
                });
            }
            let sanitizedDatasall = sanitizeData(sanitizedData);
            function sanitizeDataall(data) {
                return data.map(item => {
                    let newItem = {};
                    for (let key in item) {
                        if (item.hasOwnProperty(key)) {
                            let value = item[key];
                            if ((typeof value === 'string' && value.includes("undefined"))) {
                                newItem[key] = "";
                            } else {
                                newItem[key] = value;
                            }
                        }
                    }
                    return newItem;
                });
            }
            let toExportData = sanitizeDataall(sanitizedDatasall);
            // Export to CSV at the end
            if ((toExportData.length > 0) &&
                (
                    (informationValue.some(data => data.value == "Personal Information")) ||
                    (informationValue.some(data => data.value == "Login & Boarding Details") && loginValue.length !== 0) ||
                    (informationValue.some(data => data.value == "Address") && addressValue.length !== 0) || (informationValue.some(data => data.value == "Document") && documentValue.length !== 0) || (informationValue.some(data => data.value == "Work History") && workHistoryValue.length !== 0) || (informationValue.some(data => data.value == "Bank Details") && bankDetailsValue.length !== 0)
                )
            ) {
                exportToCSV(toExportData, `${fileName} Without Values`);
            }
        }
        catch (err) {
            setLoading(false);
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                setPopupContentMalert("something went wrong! Ex");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    }
    // Function to export selected heading and values
    const handleExcelVerifyDatas = async () => {
        setLoading(true);
        setLoadingMessage('Exporting data...');
        let compdatas = companyValueAdd?.map((item) => item.value);
        let branchdatas = branchValueAdd?.map((item) => item.value);
        let unitdatas = unitValueAdd?.map((item) => item.value);
        let teamdatas = teamValueAdd?.map((item) => item.value);
        let employeedatas = employeeValueAdd?.map((item) => item.value);
        let informationdatas = informationValue?.map((item) => item.value);
        setPageName(!pageName)
        try {
            let result = await axios.get(SERVICE.TEMPLATEUSERSALL, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            })
            let users = result.data?.users;
            let filterUser = users?.filter((item) => {
                // Case 1: compdatas have values
                if (compdatas.length > 0 && branchdatas.length === 0 && unitdatas.length === 0 && teamdatas.length === 0 && employeedatas.length === 0) {
                    return compdatas.includes(item.company);
                }
                // Case 2: compdatas and branchdatas have values
                else if (compdatas.length > 0 && branchdatas.length > 0 && unitdatas.length === 0 && teamdatas.length === 0 && employeedatas.length === 0) {
                    return compdatas.includes(item.company) && branchdatas.includes(item.branch);
                }
                // Case 3: compdatas, branchdatas, and unitdatas have values
                else if (compdatas.length > 0 && branchdatas.length > 0 && unitdatas.length > 0 && teamdatas.length === 0 && employeedatas.length === 0) {
                    return compdatas.includes(item.company) && branchdatas.includes(item.branch) && unitdatas.includes(item.unit);
                }
                // Case 4: compdatas, branchdatas, unitdatas, and teamdatas have values
                else if (compdatas.length > 0 && branchdatas.length > 0 && unitdatas.length > 0 && teamdatas.length > 0 && employeedatas.length === 0) {
                    return compdatas.includes(item.company) && branchdatas.includes(item.branch) && unitdatas.includes(item.unit) && teamdatas.includes(item.team);
                }
                // Case 5: All arrays have values
                else if (compdatas.length > 0 && branchdatas.length > 0 && unitdatas.length > 0 && teamdatas.length > 0 && employeedatas.length > 0) {
                    return (compdatas.includes(item.company) && branchdatas.includes(item.branch) && unitdatas.includes(item.unit) && teamdatas.includes(item.team) && employeedatas.includes(item.companyname));
                }
                // Default: No match
                else {
                    return false;
                }
            })
            let sanitizedData = [];
            // Initialize dataToExport with common fields for all users
            filterUser.forEach((item, index) => {
                let dataToExport = {
                    "S.no": index + 1,
                    Company: item.company,
                    Branch: item.branch,
                    Unit: item.unit,
                    Team: item.team,
                    Employee: item.companyname,
                    EmpCode: item.empcode,
                };
                // Condition to show Personal Information Heading
                if (informationdatas.some(e => e === 'Personal Information') && fileName.length > 0) {
                    if (item.maritalstatus === "Single") {
                        dataToExport = {
                            ...dataToExport,
                            "First Name": item.firstname,
                            "Last Name": item.lastname,
                            "Legal Name": item.legalname,
                            "Father Name": item.fathername,
                            "Mother Name": item.mothername,
                            "Gender": item.gender,
                            "Marital Status": item.maritalstatus,
                            "DOB": item.dob !== "undefined" ? moment(item.dob).format("DD-MM-YYYY") : "",
                            "Blood Group": item.bloodgroup,
                            "Email": item.email,
                            "Location": item.location,
                            "Contact (Personal)": item.contactpersonal,
                            "Contact (Family)": item.contactfamily,
                            "Emergency Number": item.emergencyno,
                            "DOT": item.dot ? moment(item.dot).format("DD-MM-YYYY") : "",
                            "DOJ": item.doj ? moment(item.doj).format("DD-MM-YYYY") : "",
                            "Aadhar No": item.aadhar,
                            "PAN No": item.panno
                        };
                    }
                    else {
                        dataToExport = {
                            ...dataToExport,
                            "First Name": item.firstname,
                            "Last Name": item.lastname,
                            "Legal Name": item.legalname,
                            "Father Name": item.fathername,
                            "Mother Name": item.mothername,
                            "Gender": item.gender,
                            "Marital Status": item.maritalstatus,
                            "DOM": item.dom || item.dom !== "undefined" ? moment(item.dom).format("DD-MM-YYYY") : "",
                            "DOB": item.dob !== "undefined" ? moment(item.dob).format("DD-MM-YYYY") : "",
                            "Blood Group": item.bloodgroup,
                            "Email": item.email,
                            "Location": item.location,
                            "Contact (Personal)": item.contactpersonal,
                            "Contact (Family)": item.contactfamily,
                            "Emergency Number": item.emergencyno,
                            "DOT": item.dot ? moment(item.dot).format("DD-MM-YYYY") : "",
                            "DOJ": item.doj ? moment(item.doj).format("DD-MM-YYYY") : "",
                            "Aadhar No": item.aadhar,
                            "PAN No": item.panno
                        };
                    }
                }
                // Condition to show Login & Boarding Details
                if (informationValue.some(item => item.value === "Login & Boarding Details") && loginValue.some(data => ["Reference Details", "Login Details", "Boarding Information"].includes(data.value)) && fileName.length > 0) {
                    if (loginValue.some(data => data.value === "Reference Details")) {
                        dataToExport = {
                            ...dataToExport,
                            "Name": item.referencetodo?.map(item => item.name)?.join(","),
                            "RelationShip": item.referencetodo?.map(item => item.relationship)?.join(","),
                            "Occupation": item.referencetodo?.map(item => item.occupation)?.join(","),
                            "Contact": item.referencetodo?.map(item => item.contact)?.join(","),
                            "Details": item.referencetodo?.map(item => item.details)?.join(","),
                        };
                    }
                    if (loginValue.some(data => data.value === "Login Details")) {
                        dataToExport = {
                            ...dataToExport,
                            "Login Name": item.username,
                            "Password": item.originalpassword,
                            "Company Name": item.company
                        };
                    }
                    if (loginValue.some(data => data.value === "Boarding Information")) {
                        dataToExport = {
                            ...dataToExport,
                            "Status": item.status,
                            "Floor": item.floor,
                            "Area": item.area,
                            "Department": item.department,
                            "Work Mode": item.workmode,
                            "Team": item.team,
                            "Designation": item.designation,
                            "Shift Grouping": item.shiftgrouping,
                            "Shift Timing": item.shifttiming,
                            "Week Off": Array.isArray(item?.weekoff) ? item?.weekoff.join(",") : "",
                            "Reporting To": item.reportingto,
                            "WorkStation(Primary)": Array.isArray(item?.workstation) ? item?.workstation?.slice(0, 1)?.join("") : "",
                            "WorkStation(Secondary)": Array.isArray(item?.workstation) ? item?.workstation?.slice(1)?.join(",") : "",
                        };
                    }
                }
                // Condition to show Address
                if (informationValue?.some(item => item.value === "Address") && addressValue?.some(data => ["Current Address", "Permanent Address"]?.includes(data.value)) && fileName.length > 0) {
                    if (addressValue?.some(data => data.value === "Current Address")) {
                        dataToExport = {
                            ...dataToExport,
                            "Current Door/Flat No": item.cdoorno,
                            "Current Street/Block": item.cstreet,
                            "Current Area/Village": item.carea,
                            "Current Landmark": item.clandmark,
                            "Current Taluk": item.ctaluk,
                            "Current Post": item.cpost,
                            "Current Pincode": item.cpincode,
                            "Current Country": item.ccountry,
                            "Current State": item.cstate,
                            "Current City": item.ccity
                        };
                    }
                    if (addressValue?.some(data => data.value === "Permanent Address")) {
                        dataToExport = {
                            ...dataToExport,
                            "Permanent Door/Flat No": item.pdoorno,
                            "Permanent Street/Block": item.pstreet,
                            "Permanent Area/Village": item.parea,
                            "Permanent Landmark": item.plandmark,
                            "Permanent Taluk": item.ptaluk,
                            "Permanent Post": item.ppost,
                            "Permanent Pincode": item.ppincode,
                            "Permanent Country": item.pcountry,
                            "Permanent State": item.pstate,
                            "Permanent City": item.pcity
                        };
                    }
                }
                // Condition to show Document
                if (informationValue.some(item => item.value === "Document") && documentValue.some(data => ["Document List", "Educational qualification"].includes(data.value)) && fileName.length > 0) {
                    // Check for "Document List" subcategory
                    if (documentValue.some(data => data.value === "Document List")) {
                        dataToExport = {
                            ...dataToExport,
                            "Document": item.employeedocumentfiles?.map(data => data.name).join(","),
                            "Remarks": item.employeedocumentfiles?.map(data => data.remark).join(",")
                        };
                    }
                    // Check for "Educational qualification" subcategory
                    if (documentValue.some(data => data.value === "Educational qualification")) {
                        dataToExport = {
                            ...dataToExport,
                            "Category": item.eduTodo?.map(item => item.categoryedu).join(","),
                            "Sub Category": item.eduTodo?.map(item => item.subcategoryedu).join(","),
                            "Specialization": item.eduTodo?.map(item => item.specialization).join(","),
                            "Institution": item.eduTodo?.map(item => item.institution).join(","),
                            "Passed Year": item.eduTodo?.map(item => item.passedyear).join(","),
                            "CGPA": item.eduTodo?.map(item => item.cgpa).join(","),
                        };
                    }
                }
                // Condition to show Work History
                if (informationValue.some(item => item.value === "Work History") && workHistoryValue.some(data => ["Additional qualification", "Work History"].includes(data.value)) && fileName.length > 0) {
                    // Check for "Additional qualification" subcategory
                    if (workHistoryValue.some(data => data.value === "Additional qualification")) {
                        dataToExport = {
                            ...dataToExport,
                            "Additional Qualification": item.addAddQuaTodo?.map(item => item.addQual).join(","),
                            "Institution": item.addAddQuaTodo?.map(item => item.addInst).join(","),
                            "Duration": item.addAddQuaTodo?.map(item => item.duration).join(","),
                            "Remarks": item.addAddQuaTodo?.map(item => item.remarks).join(","),
                        };
                    }
                    // Check for "Work History" subcategory
                    if (workHistoryValue.some(data => data.value === "Work History")) {
                        dataToExport = {
                            ...dataToExport,
                            "Employee Name": item.workhistTodo?.map(item => item.empNameTodo).join(","),
                            "Designation": item.workhistTodo?.map(item => item.desigTodo).join(","),
                            "Joined On": item.workhistTodo?.map(item => item.joindateTodo).join(","),
                            "Leave On": item.workhistTodo?.map(item => item.leavedateTodo).join(","),
                            "Duties": item.workhistTodo?.map(item => item.dutiesTodo).join(","),
                            "Reason For Leaving": item.workhistTodo?.map(item => item.reasonTodo).join(","),
                        };
                    }
                }
                // Condition to show Bank Details
                if (informationValue.some(item => item.value === "Bank Details") && bankDetailsValue.some(data => ["Bank Details", "Exp Log Details", "Process Allot"].includes(data.value)) && fileName.length > 0) {
                    // Check for "Bank Details" subcategory
                    if (bankDetailsValue.some(data => data.value === "Bank Details")) {
                        dataToExport = {
                            ...dataToExport,
                            "Bank Name": item.bankdetails?.map(item => item.bankname)?.join(","),
                            "Bank Branch Name": item.bankdetails?.map(item => item.bankbranchname)?.join(","),
                            "Account Holder Name": item.bankdetails?.map(item => item.accountholdername)?.join(","),
                            "Account Number": item.bankdetails?.map(item => item.accountnumber)?.join(","),
                            "IFSC Code": item.bankdetails?.map(item => item.ifsccode)?.join(","),
                            "Account Type": item.bankdetails?.map(item => item.accounttype)?.join(","),
                        };
                    }
                    // Check for "Exp Log Details" subcategory
                    if (bankDetailsValue.some(data => data.value === "Exp Log Details")) {
                        dataToExport = {
                            ...dataToExport,
                            "Mode Value": item.assignExpLog?.map(item => item.expval)?.join(","),
                            "Value (In Months)": item.assignExpLog?.map(item => item.expval)?.join(","),
                            "Date": item.assignExpLog?.map(item => item.date)?.join(","),
                            "Mode Exp": item.assignExpLog?.map(item => item.expmode)?.join(","),
                            "End Exp": item.assignExpLog?.map(item => item.endexp)?.join(","),
                            "End Exp Date": item.assignExpLog?.map(item => item.endexpdate)?.join(","),
                            "Mode Target": item.assignExpLog?.map(item => item.expval)?.join(","),
                            "End Target": item.assignExpLog?.map(item => item.endtar)?.join(","),
                            "End Target Date": item.assignExpLog?.map(item => item.endtardate)?.join(","),
                        };
                    }
                    // Check for "Process Allot" subcategory
                    if (bankDetailsValue.some(data => data.value === "Process Allot")) {
                        dataToExport = {
                            ...dataToExport,
                            "Process": item.processlog?.map(item => item.process)?.join(","),
                            "Process Type": item.processlog?.map(item => item.processtype)?.join(","),
                            "Process Duration (Full, Half)": item.processlog?.map(item => item.processduration)?.join(","),
                            "Duration (Hrs:Mins)": item.processlog?.map(item => item.duration)?.join(","),
                            "Gross Salary": item.grosssalary,
                            "Mode Experience": item.modeexperience,
                            "Target Experience": item.targetexperience,
                            "Target Points": item.targetpts,
                        };
                    }
                }
                sanitizedData.push(dataToExport);
            }
            );
            function sanitizeData(data) {
                return data.map(item => {
                    let newItem = {};
                    for (let key in item) {
                        if (item.hasOwnProperty(key)) {
                            newItem[key] = item[key] === "undefined" || undefined ? "" : item[key];
                        }
                    }
                    return newItem;
                });
            }
            let sanitizedDatasall = sanitizeData(sanitizedData);
            function sanitizeDataall(data) {
                return data.map(item => {
                    let newItem = {};
                    for (let key in item) {
                        if (item.hasOwnProperty(key)) {
                            newItem[key] = item[key] === "Invalid date" ? "" : item[key];
                        }
                    }
                    return newItem;
                });
            }
            let toExportData = sanitizeDataall(sanitizedDatasall);
            // Export to CSV at the end
            if ((toExportData.length > 0) &&
                (
                    (informationValue.some(data => data.value == "Personal Information")) ||
                    (informationValue.some(data => data.value == "Login & Boarding Details") && loginValue.length !== 0) ||
                    (informationValue.some(data => data.value == "Address") && addressValue.length !== 0) || (informationValue.some(data => data.value == "Document") && documentValue.length !== 0) || (informationValue.some(data => data.value == "Work History") && workHistoryValue.length !== 0) || (informationValue.some(data => data.value == "Bank Details") && bankDetailsValue.length !== 0)
                )
            ) {
                setLoading(true);
                setLoadingMessage('Ready to Export...');
                exportToCSV(toExportData, `${fileName} With Values`);
            }
        }
        catch (err) {
            setLoading(false);
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                setPopupContentMalert("something went wrong!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    }
    const subInfoClear = () => {
        if (informationValue.length === 0) {
            setLoginValue([]);
            setAddressValue([]);
            setDocumentValue([]);
            setWorkHistoryValue([]);
            setBankDetailsValue([]);
        }
        else {
            return false;
        }
    }
    const [btnDisable, setBtnDisable] = useState(false);
    const handleClear = (e) => {
        e.preventDefault();
        setCompanyValueAdd([]);
        setBranchValueAdd([]);
        setUnitValueAdd([]);
        setTeamValueAdd([]);
        setEmployeeValueAdd([]);
        setBranchOption([]);
        setUnitOption([]);
        setTeamOption([]);
        setEmployeeOption([]);
        setInformationValue([]);
        setFileName("");
        setLoginValue([]);
        setAddressValue([]);
        setDocumentValue([]);
        setWorkHistoryValue([]);
        setBankDetailsValue([]);
        setPopupContent("Cleared Successfully");
        setPopupSeverity("success");
        handleClickOpenPopup();
    }
    const sendRequest = async () => {
        setBtnDisable(true)
        let compdatas = companyValueAdd?.map((item) => item.value);
        let branchdatas = branchValueAdd?.map((item) => item.value);
        let unitdatas = unitValueAdd?.map((item) => item.value);
        let teamdatas = teamValueAdd?.map((item) => item.value);
        let employeedatas = employeeValueAdd?.map((item) => item.value);
        let informationdatas = informationValue?.map((item) => item.value)
        let logindatas = loginValue?.map((item) => item.value);
        let addressdatas = addressValue?.map((item) => item.value);
        let documentdatas = documentValue?.map((item) => item.value);
        let workhistorydatas = workHistoryValue?.map((item) => item.value);
        let bankdetailsdatas = bankDetailsValue?.map((item) => item.value);
        let personalInformation = informationdatas.filter(item => item === "Personal Information");
        // Concatenate all the arrays together
        let informationstring = [
            ...personalInformation,
            ...logindatas,
            ...addressdatas,
            ...documentdatas,
            ...workhistorydatas,
            ...bankdetailsdatas
        ];
        let verified = informationstring?.map(item => ({
            name: item,
            edited: false,
            corrected: false
        }))
        setPageName(!pageName)
        try {
            await axios.post(SERVICE.MYVERIFICATION_CREATE, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
                company: compdatas,
                branch: branchdatas,
                unit: unitdatas,
                team: teamdatas,
                employeename: employeedatas,
                filename: fileName,
                information: informationdatas,
                loginvalues: logindatas,
                addressvalues: addressdatas,
                documentvalues: documentdatas,
                workhistoryvalues: workhistorydatas,
                bankdetailsvalues: bankdetailsdatas,
                informationstring: informationstring,
                verifiedInfo: verified,
                addedby: [
                    {
                        name: String(username),
                        date: String(new Date()),
                    },
                ],
            });
            await getVerification();
            setTimeout(() => {
                setBtnDisable(false);
            }, 1000);
            setPopupContent("Added Successfully");
            setPopupSeverity("success");
            handleClickOpenPopup();
        } catch (err) {
            const messages = err?.response?.data?.message;
            if (messages) {
                setPopupContentMalert(messages);
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            } else {
                setPopupContentMalert("something went wrong!");
                setPopupSeverityMalert("info");
                handleClickOpenPopupMalert();
            }
        }
    };
    console.log(companyValueAdd)
    return (
        <Box>
            <Headtitle title={"TEMPLATE LIST"} />
            {/* ****** Header Content ****** */}
            <PageHeading
                title="Template List"
                modulename="Settings"
                submodulename="Template List"
                mainpagename=""
                subpagename=""
                subsubpagename=""
            />

            {
                isUserRoleCompare?.includes('atemplatelist') && (
                    <>
                        <Box sx={userStyle.dialogbox}>
                            <>
                                <Grid container spacing={2} >
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Typography sx={{ fontWeight: "750" }}></Typography>
                                    </Grid>
                                    <Grid item lg={3} md={3} sm={3} xs={3}>
                                        <FormControl fullWidth size="small">
                                            <Typography sx={{ fontWeight: "500" }}>
                                                Company <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect size="small"
                                                options={isAssignBranch
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
                                                value={companyValueAdd}
                                                valueRenderer={customValueRendererCompanyAdd}
                                                onChange={handleCompanyChangeAdd}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={3} md={3} sm={3} xs={3}>
                                        <FormControl fullWidth size="small">
                                            <Typography sx={{ fontWeight: "500" }}>
                                                Branch <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect size="small"
                                             options={isAssignBranch
                                                ?.filter((comp) => companyValueAdd?.some((item)=> item?.value === comp.company) )
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
                                                // options={branchOption}
                                                value={branchValueAdd}
                                                valueRenderer={customValueRendererBranchAdd}
                                                onChange={handleBranchChangeAdd}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={3} md={3} sm={3} xs={3}>
                                        <FormControl fullWidth size="small">
                                            <Typography sx={{ fontWeight: "500" }}>
                                                Unit <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect size="small"
                                             options={isAssignBranch
                                                ?.filter((comp) => branchValueAdd?.some((item)=> item?.value === comp.branch) )
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
                                                })}
                                                // options={unitOption}
                                                value={unitValueAdd}
                                                valueRenderer={customValueRendererUnitAdd}
                                                onChange={handleUnitChangeAdd}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={3} md={3} sm={3} xs={3}>
                                        <FormControl fullWidth size="small">
                                            <Typography sx={{ fontWeight: "500" }}>
                                                Team <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect size="small"
                                                options={teamOption}
                                                value={teamValueAdd}
                                                valueRenderer={customValueRendererTeamAdd}
                                                onChange={handleTeamChangeAdd}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={3} md={3} sm={3} xs={3}>
                                        <FormControl fullWidth size="small">
                                            <Typography sx={{ fontWeight: "500" }}>
                                                Employee Name <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect size="small"
                                                options={employeeOption}
                                                value={employeeValueAdd}
                                                valueRenderer={customValueRendererEmployeeAdd}
                                                onChange={handleEmployeeChangeAdd}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item lg={3} md={3} sm={3} xs={3}>
                                        <FormControl fullWidth size="small">
                                            <Typography sx={{ fontWeight: "500" }}>
                                                Information <b style={{ color: "red" }}>*</b>
                                            </Typography>
                                            <MultiSelect
                                                options={informationOption}
                                                value={informationValue}
                                                onChange={handleInformationChangeAdd}
                                                valueRenderer={customRendererInformationAdd}
                                            />
                                        </FormControl>
                                    </Grid>
                                    {informationValue.some(e => e.value == "Login & Boarding Details") && (
                                        <Grid item lg={3} md={3} sm={3} xs={3}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ fontWeight: "500" }}>
                                                    Login & Boarding Details Sub-Information <b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={loginOptions}
                                                    value={loginValue}
                                                    onChange={handleLoginChange}
                                                    valueRenderer={customeRendererLoginAdd}
                                                />
                                            </FormControl>
                                        </Grid>)}
                                    {informationValue.some(e => e.value == "Address") && (
                                        <Grid item lg={3} md={3} sm={3} xs={3}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ fontWeight: "500" }}>
                                                    Address Sub-Information<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={addressOptions}
                                                    value={addressValue}
                                                    onChange={handleAddressChange}
                                                    valueRenderer={customeRendererAddressAdd}
                                                />
                                            </FormControl>
                                        </Grid>)}
                                    {informationValue.some(e => e.value == "Document") && (
                                        <Grid item lg={3} md={3} sm={3} xs={3}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ fontWeight: "500" }}>
                                                    Document Sub-Information<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={documentOptions}
                                                    value={documentValue}
                                                    onChange={handleDocumentChange}
                                                    valueRenderer={customeRendererDocumentAdd}
                                                />
                                            </FormControl>
                                        </Grid>)}
                                    {informationValue.some(e => e.value == "Work History") && (
                                        <Grid item lg={3} md={3} sm={3} xs={3}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ fontWeight: "500" }}>
                                                    Work History Sub-Information<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={workHistoryOptions}
                                                    value={workHistoryValue}
                                                    onChange={handleWorkHistoryChange}
                                                    valueRenderer={customeRendererWorkHistoryAdd}
                                                />
                                            </FormControl>
                                        </Grid>)}
                                    {informationValue.some(e => e.value == "Bank Details") && (
                                        <Grid item lg={3} md={3} sm={3} xs={3}>
                                            <FormControl fullWidth size="small">
                                                <Typography sx={{ fontWeight: "500" }}>
                                                    Bank Details Sub-Information<b style={{ color: "red" }}>*</b>
                                                </Typography>
                                                <MultiSelect
                                                    options={bankDetailsOptions}
                                                    value={bankDetailsValue}
                                                    onChange={handleBankDetailsChange}
                                                    valueRenderer={customeRendererBankDetailsAdd}
                                                />
                                            </FormControl>
                                        </Grid>)}
                                    <Grid item lg={3} md={3} sm={3} xs={3}>
                                        <FormControl fullWidth size='small'>
                                            <Typography sx={{ fontWeight: "500" }}>Filename<b style={{ color: "red" }}>*</b></Typography>
                                            <OutlinedInput
                                                placeholder='Enter File Name'
                                                value={fileName}
                                                onChange={(e) => { setFileName(e.target.value) }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={1} xs={6} sm={12} sx={{ marginTop: "20px" }}>
                                        <Button
                                            sx={userStyle.btncancel}
                                            onClick={(e) => {
                                                handleClear(e)
                                            }
                                            }
                                        >
                                            Clear
                                        </Button>
                                    </Grid>
                                    <Grid item lg={3} md={3} sm={3} xs={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: '20px' }}>
                                        <Box>
                                            {isUserRoleCompare?.includes("exceltemplatelist") && (
                                                <>
                                                    <Button onClick={(e) => fieldCheck("excel")} sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel Without Values&ensp;</Button>
                                                </>
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid item lg={3} md={3} sm={3} xs={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: '20px' }}>
                                        <Box>
                                            {isUserRoleCompare?.includes("exceltemplatelist") && (
                                                <>
                                                    <Button
                                                        onClick={(e) => fieldCheck("verify")}
                                                        sx={userStyle.buttongrp}><FaFileExcel />&ensp;Export to Excel With Value
                                                        &ensp;</Button>
                                                </>
                                            )}
                                        </Box>
                                    </Grid>
                                    <Grid item lg={3} md={3} sm={3} xs={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: '20px' }}>
                                        <Box>
                                            {isUserRoleCompare?.includes("exceltemplatelist") && (
                                                <>
                                                    <Button
                                                        onClick={(e) => {
                                                            fieldCheckForVerify();
                                                        }
                                                        }
                                                        disabled={btnDisable}
                                                        sx={userStyle.buttongrp}>&ensp;My Verification&ensp;
                                                    </Button>
                                                </>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </>
                        </Box>
                    </>
                )
            }
            <Loader loading={loading} message={loadingMessage} />
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
    )
}
export default TemplateList