import "./bdcsstemplatetwo.css"
import axios from "axios";
import { SERVICE } from "../services/Baseservice";
import { useEffect, useState } from "react";
import html2canvas from 'html2canvas';
import DownloadIcon from '@mui/icons-material/Download';
import moment from "moment-timezone";

const BDayCardTwo = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    // const name = "PRIYANKA.CHINNATHAMBIPRIYA"
    const status = urlParams.get('status')


    // Retrieve the 'wish', 'name', and 'id' parameters from the URL
    const name = urlParams.get('name');
    const id = urlParams.get('id');
    const wish = urlParams.get('wish');
    const footer = urlParams.get('footer');


    // Now you have the values from the URL
    const [bdayCompanyLogo, setBdayCompanyLogo] = useState("")
    const [bdayfootertext, setBdayfootertext] = useState("")
    const [bdaywishes, setBdaywishes] = useState("")
    const [profileSrc, setProfileSrc] = useState("")
    const [employeeDob, setEmployeeDob] = useState("")

    const fetchBdaySetting = async () => {
        try {
            let res = await axios.get(`${SERVICE.GET_OVERALL_SETTINGS}`);

            setBdayCompanyLogo(
                res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
                    ?.companylogo
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
    const fetchProfileImage = async () => {
        try {
            let resNew = await axios.post(`${SERVICE.GETDOCUMENTS}`, {
                commonid: id
            });
            let availedData = Object.keys(resNew?.data)?.length;

            if (availedData != 0) {
                let profile = resNew?.data?.semployeedocument?.profileimage;
                setProfileSrc(profile)
            } else {
                setProfileSrc('')
            }
        } catch (err) {
            console.log(err, '2222')
        }
    };

    const [wishesWithKey, setWishesWithKey] = useState("")

    const fetchEmployee = async () => {
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${id}`);

            const availedData = res?.data?.suser;

            if (availedData?.length !== 0) {
                setEmployeeDob(moment(availedData?.dob)?.format("DD-MM-YYYY"))

                let accountno = []
                let accountname = []
                let ifsccode = []

                availedData?.bankdetails?.forEach((item) => {
                    accountno.push(item.accountnumber);
                    accountname.push(item.accountholdername);
                    ifsccode.push(item.ifsccode);
                });


                let GenderHeShe = (availedData?.gender !== "" || availedData?.gender !== undefined)
                    ? availedData?.gender === "Male" ? "He" : availedData?.gender === "Female" ? "She" : "He/She" : "He/She";

                let GenderHeShesmall = (availedData?.gender !== "" || availedData?.gender !== undefined)
                    ? availedData?.gender === "Male" ? "he" : availedData?.gender === "Female" ? "she" : "he/she" : "he/she";

                let GenderHimHer = (availedData?.gender !== "" || availedData?.gender !== undefined)
                    ? availedData?.gender === "Male" ? "him" : availedData?.gender === "Female" ? "her" : "him/her" : "him/her";

                let paddress = `${!availedData?.pdoorno ? "" : availedData?.pdoorno + ","}
                    ${!availedData?.pstreet ? "" : availedData?.pstreet + ","}
                    ${!availedData?.parea ? "" : availedData?.parea + ","}
                    ${!availedData?.plandmark ? "" : availedData?.plandmark + ","}
                    ${!availedData?.ptaluk ? "" : availedData?.ptaluk + ","}
                    ${!availedData?.ppost ? "" : availedData?.ppost + ","}
                    ${!availedData?.pcity ? "" : availedData?.pcity + ","}
                    ${!availedData?.pstate ? "" : availedData?.pstate + ","}
                    ${!availedData?.pcountry ? "" : availedData?.pcountry + ","}
                    ${!availedData?.ppincode ? "" : "-" + availedData?.ppincode}`;

                let caddress = `${!availedData?.cdoorno ? "" : availedData?.cdoorno + ","}
                    ${!availedData?.cstreet ? "" : availedData?.cstreet + ","}
                ${!availedData?.carea ? "" : availedData?.carea + ","}
                    ${!availedData?.clandmark ? "" : availedData?.clandmark + ","}
                    ${!availedData?.ctaluk ? "" : availedData?.ctaluk + ","}
                    ${!availedData?.cpost ? "" : availedData?.cpost + ","}
                    ${!availedData?.ccity ? "" : availedData?.ccity + ","}
                    ${!availedData?.cstate ? "" : availedData?.cstate + ","}
                    ${!availedData?.ccountry ? "" : availedData?.ccountry + ","}
                    ${!availedData?.cpincode ? "" : "-" + availedData?.cpincode}`;

                let findMethod = wish
                    .replaceAll("$LEGALNAME$", availedData?.legalname ? availedData?.legalname : "")
                    .replaceAll("$LOGIN$", availedData?.username ? availedData?.username : "")
                    .replaceAll("$C:NAME$", availedData?.companyname ? availedData?.companyname : "")
                    .replaceAll("$BRANCH$", availedData?.branch ? availedData?.branch : "")
                    .replaceAll("$TEAM$", availedData?.team ? availedData?.team : "")

                    .replaceAll("$DOB$", availedData?.dob ? availedData?.dob : "")
                    .replaceAll("$P:ADDRESS$", paddress)
                    .replaceAll("$C:ADDRESS$", caddress)
                    .replaceAll("$EMAIL$", availedData?.email ? availedData?.email : "")
                    .replaceAll("$P:NUMBER$", availedData?.contactpersonal ? availedData?.contactpersonal : "")
                    .replaceAll("$DOJ$", availedData?.doj ? availedData?.doj : "")
                    .replaceAll("$EMPCODE$", availedData?.empcode ? availedData?.empcode : "")
                    .replaceAll("$F:NAME$", availedData?.firstname ? availedData?.firstname : "")
                    .replaceAll("$L:NAME$", availedData?.lastname ? availedData?.lastname : "")
                    .replaceAll("$DESIGNATION$", availedData?.designation ? availedData?.designation : "")
                    .replaceAll("$UNIT$", availedData?.unit ? availedData?.unit : "")
                    .replaceAll("$PROCESS$", availedData?.process ? availedData?.process : "")
                    .replaceAll("$DEPARTMENT$", availedData?.department ? availedData?.department : "")
                    .replaceAll("$LWD$", availedData?.reasondate ? availedData?.reasondate : "")
                    .replaceAll("$SHIFT$", availedData?.shifttiming ? availedData?.shifttiming : "")
                    .replaceAll("$AC:NAME$", availedData?.bankdetails?.length > 0 ? accountname : "")
                    .replaceAll("$AC:NUMBER$", availedData?.bankdetails?.length > 0 ? accountno : "")
                    .replaceAll("$IFSC$", availedData?.bankdetails?.length > 0 ? ifsccode : "")
                    .replaceAll("$WORKSTATION:NAME$", availedData?.workstation ? availedData?.workstation : "")
                    .replaceAll("$WORKSTATION:COUNT$", availedData?.workstation ? availedData?.workstation?.length : "")
                    .replaceAll("$SYSTEM:COUNT$", availedData?.employeecount ? availedData?.employeecount : "")
                    .replaceAll("$GENDERHE/SHE$", GenderHeShe)
                    .replaceAll("$GENDERHE/SHE/SMALL$", GenderHeShesmall)
                    .replaceAll("$GENDERHIM/HER$", GenderHimHer)
                    .replaceAll("$SALUTATION$", availedData?.prefix ? availedData?.prefix : "Mr/Ms")


                setWishesWithKey(findMethod)
            } else {
                setEmployeeDob('')
            }
        } catch (err) {
            console.log(err, '2222')
        }
    };

    useEffect(() => {
        fetchBdaySetting();
        fetchProfileImage();
        fetchEmployee();
    }, [id, wish])


    const downloadImage = () => {
        const element = document.getElementById('birthdaydivtwo');
        html2canvas(element).then((canvas) => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `_birthdaycard.png`;
            link.click();
        });
    };

    function updateYearInDob(employeeDob) {
        const currentYear = new Date().getFullYear(); // Get current year
        const updatedDob = employeeDob.replace(/\d{4}$/, currentYear); // Replace last 4 digits (year) with current year
        return updatedDob;
    }

    const updatedDob = updateYearInDob(employeeDob);


    return (
        <div>
            {status ? (
                <div className="download-button-wrapper">
                    <button onClick={downloadImage}><DownloadIcon /></button>
                </div>
            ) :
                <></>
            }

            <div id="birthdaydivtwo">
                <div id="birthday-cardtwo">
                    <div className="companylogotwo">
                        <img src={bdayCompanyLogo} alt="logo" height="150" width="165" /><br />
                    </div>
                    <div id="profileImgtwo">
                        <img src={profileSrc || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='} alt="" width="190" height="150" />
                        <span className="usernametwo"
                            style={{
                                fontSize: name?.length > 11 ? '14px' : 'initial',
                            }}
                        >{name}</span>
                    </div>
                    <div className="bdaydobtwo">
                        <span>{updatedDob === "" || updatedDob === undefined ? "" : updatedDob}</span>
                    </div>
                    <div className="bdaywishestwo">
                        <span
                            style={{
                                fontSize: wishesWithKey?.length > 50 ? '11px' : 'initial',
                            }}

                        >{wishesWithKey}</span>
                    </div>
                    <div className="bdayfootertexttwo">
                        <span >{footer === "" || footer === undefined || footer === "undefined" ? "" : footer}</span>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default BDayCardTwo;