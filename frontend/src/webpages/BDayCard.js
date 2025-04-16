import "./bdcard.css"
import axios from "axios";
import { SERVICE } from "../services/Baseservice";
import { useEffect, useState } from "react";
import html2canvas from 'html2canvas';
import DownloadIcon from '@mui/icons-material/Download';

const BDCard = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);


    // Retrieve the 'wish', 'name', and 'id' parameters from the URL
    const name = urlParams.get('name');
    const id = urlParams.get('id');
    const wish = urlParams.get('wish');

    // Now you have the values from the URL
    // const name = "PRIYANKA.CHINNATHAMBIPRIYA"
    const status = urlParams.get('status')
    const [bdayCompanyLogo, setBdayCompanyLogo] = useState("")
    const [bdayfootertext, setBdayfootertext] = useState("")
    const [bdaywishes, setBdaywishes] = useState("")
    const [profileSrc, setProfileSrc] = useState("")

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
            console.log(err,'12')
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
            console.log(err,'2222')
        }
    };
    useEffect(() => {
        fetchBdaySetting();
        fetchProfileImage();
    }, [id])


    const downloadImage = () => {
        const element = document.getElementById('birthdaydiv');
        html2canvas(element).then((canvas) => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `${name}_birthdaycard.png`;
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

            <div id="birthdaydiv">
                <div id="birthday-card">
                    <div className="companylogo">
                        <img src={bdayCompanyLogo} alt="logo" height="150" width="165" /><br />
                    </div>
                    <div id="profileImg">
                        <img src={profileSrc || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='} alt="" width="217" height="210" />
                        <span className="username"
                            style={{
                                fontSize: name?.length > 19 ? '14px' : 'initial',
                            }}>{name}</span>
                    </div>
                    <div className="bdaywishes">
                        <span>{wish}</span>
                    </div>
                    <div className="bdayfootertext">
                        <span >{bdayfootertext}</span>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default BDCard;