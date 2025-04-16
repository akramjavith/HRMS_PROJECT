import "./weddingcardtemplate.css"
import axios from "axios";
import { SERVICE } from "../services/Baseservice";
import { useEffect, useState } from "react";
import html2canvas from 'html2canvas';
import DownloadIcon from '@mui/icons-material/Download';
import moment from "moment-timezone";

const WeddingCard = () => {

    const urlParams = new URLSearchParams(window.location.search);

    // Retrieve the 'wish', 'name', and 'id' parameters from the URL
    const name = urlParams.get('name');
    const id = urlParams.get('id');
    const wish = urlParams.get('wish');

    const footer = urlParams.get('footer');

    const status = urlParams.get('status')
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
    const fetchEmployee = async () => {
        try {
            let res = await axios.get(`${SERVICE.USER_SINGLE}/${id}`);

            const availedData = res?.data?.suser;

            if (availedData?.length !== 0) {
                setEmployeeDob(availedData?.dom === "" || availedData?.dom === undefined ? "" : availedData?.dom  )
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
    }, [id])


    const downloadImage = () => {
        const element = document.getElementById('weddingdivtwo');
        html2canvas(element).then((canvas) => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `_weddingcard.png`;
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

            <div id="weddingdivtwo">
                <div id="wedding-card">
                    <div className="companylogowedding">
                        <img src={bdayCompanyLogo} alt="logo" height="150" width="165" /><br />
                    </div>
                    <div id="profileImgwedding">
                        <img src={profileSrc || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='} alt="" width="190" height="150" />
                        <span className="usernamewedding"
                        style={{
                            fontSize: name?.length > 11 ? '14px' : 'initial',
                        }}
                        >{name}</span>
                    </div>
                    <div className="bdaydobwedding">
                        <span>{employeeDob === "" ? "" : moment(employeeDob)?.format("DD-MM-YYYY")}</span>
                    </div>
                    <div className="bdaywisheswedding">
                        <span>{wish}</span>
                    </div>
                    <div className="bdayfootertextwedding">
                        <span >{footer}</span>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default WeddingCard;