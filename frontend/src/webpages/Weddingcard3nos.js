import "./weddingcard3nos.css"
import axios from "axios";
import { SERVICE } from "../services/Baseservice";
import { useEffect, useState } from "react";
import html2canvas from 'html2canvas';
import DownloadIcon from '@mui/icons-material/Download';
import moment from "moment-timezone";

const Weddingcard3nos = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const status = urlParams.get('status')
    const [bdayCompanyLogo, setBdayCompanyLogo] = useState("")
    const [bdayfootertext, setBdayfootertext] = useState("")
    const [bdaywishes, setBdaywishes] = useState("")
    const [employeeTwoID, setEmployeeTwoID] = useState("")
    const [employeeThreeID, setEmployeeThreeID] = useState("")
    const [employeeOneID, setEmployeeOneID] = useState("")
    const [EmpIds, setEmpIds] = useState([]);

    const name = urlParams.get('name');
    const id = urlParams.get('id');
    const wish = urlParams.get('wish');
    const footer = urlParams.get('footer');

    //employeename
    const [employeeOneName, setEmployeetwoName] = useState("")
    const [employeeTwoName, setEmployeeOneName] = useState("")
    const [employeeThreeName, setEmployeeThreeName] = useState("")
    //dateof birth
    const [employeeOneDob, setEmployeeOneDob] = useState("");
    const [employeeTwoDob, setEmployeeTwoDob] = useState("");
    const [employeeThreeDob, setEmployeeThreeDob] = useState("");


    const combinedData = urlParams.get('combinedData');

    useEffect(() => {
        if (combinedData) {

            const employeesData = combinedData.split('_');


            const newEmpIdsSet = new Set();

            const employee1 = employeesData[0].split('-');
            const employee1Name = employee1[0];
            const employee1Id = employee1[1];

            setEmployeeOneName(employee1Name);
            setEmployeeOneID(employee1Id);
            newEmpIdsSet.add(employee1Id);

            if (employeesData[1]) {
                const employee2 = employeesData[1].split('-');
                const employee2Name = employee2[0];
                const employee2Id = employee2[1];

                setEmployeetwoName(employee2Name);
                setEmployeeTwoID(employee2Id);
                newEmpIdsSet.add(employee2Id);
            }

            if (employeesData[2]) {
                const employee3 = employeesData[2].split('-');
                const employee3Name = employee3[0];
                const employee3Id = employee3[1];

                setEmployeeThreeName(employee3Name);
                setEmployeeThreeID(employee3Id);
                newEmpIdsSet.add(employee3Id);
            }

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
    //profile image
    const [profileSrcOne, setProfileSrcOne] = useState()
    const [profileSrcTwo, setProfileSrcTwo] = useState()
    const [profileSrcThree, setProfileSrcThree] = useState()

    const fetchProfileImage = async () => {
        try {
            const ids = [employeeOneID, employeeTwoID, employeeThreeID];

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
                            } else if (index === 2) {
                                setProfileSrcThree(profile);
                            }
                        } else {
                            if (index === 0) {
                                setProfileSrcOne('');
                            } else if (index === 1) {
                                setProfileSrcTwo('');
                            } else if (index === 2) {
                                setProfileSrcThree('');
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
                return availedData?.dom === "" || availedData?.dom === undefined || availedData?.dom === "undefined" ? "" : availedData?.dom ;
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

            if (employeeThreeID) {
                dobPromises.push(fetchEmployeeDob(employeeThreeID));
            }

            const [dobOne, dobTwo, dobThree] = await Promise.all(dobPromises);

            if (employeeOneID) {
                setEmployeeOneDob(dobOne);
            }

            if (employeeTwoID) {
                setEmployeeTwoDob(dobTwo);
            }

            if (employeeThreeID) {
                setEmployeeThreeDob(dobThree);
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
        const element = document.getElementById('birthdaydivtwo3nos');
        html2canvas(element).then((canvas) => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `_wedding3noscard.png`;
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

            <div id="birthdaydivtwo3nos">
                <div id="wedding-cardtwo3nos">
                    <div className="companylogotwo3nos">
                        <img src={bdayCompanyLogo} alt="logo" height="150" width="165" /><br />
                    </div>
                    <div id="emponediv">
                        <div id="profileImgtwo3nos" >
                            <img src={profileSrcTwo || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='} alt="" width="190" height="150" />
                            <span className="usernametwo3nos"
                            style={{
                                fontSize: employeeOneName?.length > 11 ? '11px' : 'initial',
                            }}
                            >{employeeOneName}</span>

                            <span className="bdaydobtwo3nos">{employeeOneDob === "" ? "" : moment(employeeOneDob)?.format("DD-MM-YYYY")}</span>
                        </div>

                    </div>
                    <div id="emptwodiv">
                        <div id="profileImgtwotwo3nos" >
                            <img src={ profileSrcOne|| 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='} alt="" width="190" height="150" />
                            <span id="usernametwotwo3nos" className="usernametwo3nos"
                            style={{
                                fontSize: employeeOneName?.length > 11 ? '11px' : 'initial',
                            }}
                            >{employeeTwoName}</span>
                            <span className="bdaydobtwotwo3nos">{employeeTwoDob === "" ? "" : moment(employeeTwoDob)?.format("DD-MM-YYYY")}</span>
                        </div>

                    </div>
                    <div id="emptwodiv">
                        <div id="profileImgtwothree3nos" >
                            <img src={profileSrcThree || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='} alt="" width="190" height="150" />
                            <span id="usernametwothree3nos" className="usernametwo3nos"
                            style={{
                                fontSize: employeeOneName?.length > 11 ? '11px' : 'initial',
                            }}
                            >{employeeThreeName}</span>
                            <span className="bdaydobtwothree3nos">{employeeThreeDob === "" ? "" :moment(employeeThreeDob)?.format("DD-MM-YYYY")}</span>
                        </div>

                    </div>
                    <div className="bdaywishestwo3nos">
                        <span>{wish}</span>
                    </div>
                    <div className="bdayfootertexttwo3nos">
                        <span >{footer}</span>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Weddingcard3nos;