import "./bdaytemplatetwo2nos.css"
import axios from "axios";
import { SERVICE } from "../services/Baseservice";
import { useEffect, useState } from "react";
import html2canvas from 'html2canvas';
import DownloadIcon from '@mui/icons-material/Download';
import moment from "moment-timezone";

const BDayCardTwo2nos = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const status = urlParams.get('status')

    

    // Retrieve the 'wish', 'name', and 'id' parameters from the URL
    const name = urlParams.get('name');
    const id = urlParams.get('id');
    const wish = urlParams.get('wish');
    const footer = urlParams.get('footer');

    const [bdayCompanyLogo, setBdayCompanyLogo] = useState("")
    const [bdayfootertext, setBdayfootertext] = useState("")
    const [bdaywishes, setBdaywishes] = useState("")
    const [profileSrc, setProfileSrc] = useState("")
    const [employeeDob, setEmployeeDob] = useState("")
    const [employeeOneName, setEmployeetwoName] = useState("")
    const [employeeOneID, setEmployeeTwoID] = useState("")
    const [employeeTwoName, setEmployeeOneName] = useState("")
    const [employeeTwoID, setEmployeeOneID] = useState("")
    const [EmpIds, setEmpIds] = useState([]);
    const [employeeOneDob, setEmployeeOneDob] = useState("");
    const [employeeTwoDob, setEmployeeTwoDob] = useState("");

    // Get the 'combinedData' parameter from the URL
    const combinedData = urlParams.get('combinedData');

    useEffect(() => {
        if (combinedData) {
            // Split by underscore to separate the two employees
            const employeesData = combinedData.split('_');

            // For each employee, split by hyphen to separate the name and ID
            const employee1 = employeesData[0].split('-');
            const employee2 = employeesData[1] ? employeesData[1].split('-') : null;

            // Access the values and IDs
            const employee1Name = employee1[0];
            const employee1Id = employee1[1];

            setEmployeeOneName(employee1Name);
            setEmployeeOneID(employee1Id);

            // Create a Set to avoid duplicates
            const newEmpIdsSet = new Set();
            newEmpIdsSet.add(employee1Id);

            if (employee2) {
                const employee2Name = employee2[0];
                const employee2Id = employee2[1];

                setEmployeetwoName(employee2Name);
                setEmployeeTwoID(employee2Id);

                newEmpIdsSet.add(employee2Id);
            }

            // Convert Set to Array and update EmpIds state
            setEmpIds(Array.from(newEmpIdsSet));
        }
    }, [combinedData]);




    const fetchBdaySetting = async () => {
        try {
            let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`);

            setBdayCompanyLogo(
                res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
                    ?.bdaycompanylogo
            );
            setBdaywishes(
                res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
                    ?.bdaywishes
            );
            setBdayfootertext(
                res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
                    ?.bdayfootertext
            );
        } catch (err) {
            console.log(err, '12')
        }
    };
    const [profileSrcOne, setProfileSrcOne] = useState()
    const [profileSrcTwo, setProfileSrcTwo] = useState()


    const fetchProfileImage = async () => {
        try {
            // Array of IDs to fetch
            const ids = [employeeOneID, employeeTwoID];

            // Loop through each ID
            ids.forEach(async (id, index) => {
                if (id) {
                    try {
                        let resNew = await axios.post(`${SERVICE.GETDOCUMENTS}`, {
                            commonid: id
                        });
                        let availedData = Object.keys(resNew?.data)?.length;

                        if (availedData !== 0) {
                            let profile = resNew?.data?.semployeedocument?.profileimage;
                            if (index === 0) {
                                setProfileSrcOne(profile);
                            } else if (index === 1) {
                                setProfileSrcTwo(profile);
                            }
                        } else {
                            if (index === 0) {
                                setProfileSrcOne('');
                            } else if (index === 1) {
                                setProfileSrcTwo('');
                            }
                        }
                    } catch (err) {
                        console.log(err, 'Error fetching profile image');
                    }
                }
            });
        } catch (err) {
            console.log(err, 'Error in fetchProfileImage');
        }
    };

    const fetchEmployeeDob = async (id) => {
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${id}`);
            const availedData = res?.data?.suser;

            if (availedData?.length !== 0) {
                return availedData?.dob;
            } else {
                return '';
            }
        } catch (err) {
            console.log(err, 'Error fetching employee DOB');
            return '';
        }
    };

    const fetchDobs = async () => {
        try {
            const dobPromises = [];

            if (employeeOneID) {
                dobPromises.push(fetchEmployeeDob(employeeOneID));
            }

            if (employeeTwoID) {
                dobPromises.push(fetchEmployeeDob(employeeTwoID));
            }

            const [dobOne, dobTwo] = await Promise.all(dobPromises);

            if (employeeOneID) {
                setEmployeeOneDob(dobOne);
            }

            if (employeeTwoID) {
                setEmployeeTwoDob(dobTwo);
            }
        } catch (err) {
            console.log(err, 'Error fetching DOBs');
        }
    };


    useEffect(() => {
        fetchProfileImage();
        fetchDobs();
    }, [employeeOneID, employeeTwoID]);



    useEffect(() => {
        fetchBdaySetting();
      
    }, [])



    const downloadImage = () => {
        const element = document.getElementById('birthdaydivtwo2nos');
        html2canvas(element).then((canvas) => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `_birthday2noscard.png`;
            link.click();
        });
    };

    return (
        <div>
            {status ? (
                <div className="download-button-wrapper">
                    <button onClick={downloadImage}><DownloadIcon /></button>
                </div>
            ) :
                <></>
            }

            <div id="birthdaydivtwo2nos">
                <div id="birthday-cardtwo2nos">
                    <div className="companylogotwo2nos">
                        <img src={bdayCompanyLogo} alt="logo" height="150" width="165" /><br />
                    </div>
                    <div id="twoempprofile">
                        <div id="emponediv">
                            <div id="profileImgtwo2nos" >
                                <img src={profileSrcOne || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='} alt="" width="190" height="150" />
                                <span className="usernametwo2nos"
                                    style={{
                                        fontSize: employeeOneName?.length > 11 ? '11px' : 'initial',
                                    }}
                                    >{employeeOneName}</span>

                                <span className="bdaydobtwo2nos">{employeeOneDob === "" ? "" : moment(employeeOneDob)?.format("DD-MM-YYYY")}</span>
                            </div>

                        </div>
                        <div id="emptwodiv">
                            <div id="profileImgtwotwo2nos" >
                                <img src={profileSrcTwo || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='} alt="" width="190" height="150" />
                                <span id="usernametwotwo2nos" className="usernametwo2nos"
                                    style={{
                                        fontSize: employeeOneName?.length > 11 ? '11px' : 'initial',
                                    }}
                                    >{employeeTwoName}</span>
                                <span className="bdaydobtwotwo2nos">{employeeTwoDob === "" ? "" : moment(employeeTwoDob)?.format("DD-MM-YYYY")}</span>
                            </div>

                        </div>
                    </div>
                    <div className="bdaywishestwo2nos">
                        <span>{wish}</span>
                    </div>
                    <div className="bdayfootertexttwo2nos">
                        <span >{footer}</span>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default BDayCardTwo2nos;