import styles from "./weddingmanualtemplate.module.css"
import axios from "axios";
import { SERVICE } from "../services/Baseservice";
import { useEffect, useState } from "react";
import html2canvas from 'html2canvas';
import DownloadIcon from '@mui/icons-material/Download';
import moment from "moment-timezone";

const WeddingCardmanualtemplate = () => {

    const urlParams = new URLSearchParams(window.location.search);

    // Retrieve the 'wish', 'name', and 'id' parameters from the URL
    const name = urlParams.get('name');
    const date = urlParams.get('date');
    const wish = urlParams.get('wish');
    const footer = urlParams.get('footer');


    const [profileImage, setProfileImage] = useState(null);

    // Retrieve the image from localStorage when the component mounts
    useEffect(() => {
        const storedImage = localStorage.getItem('profileImage');
        if (storedImage) {
            setProfileImage(storedImage);
        }
    }, []);

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
                    ?.companylogo
            );

        } catch (err) {
            console.log(err, '12')
        }
    };


    useEffect(() => {
        fetchBdaySetting();
        // fetchProfileImage();
        // fetchEmployee();
    }, [wish])


    const downloadImage = () => {
        const element = document.getElementById('imagedownload');
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
                <div className={styles.downloadbuttonwrapper}>
                    <button onClick={downloadImage}><DownloadIcon /></button>
                </div>
            ) :
                <></>
            }

            <div className={styles.weddingdivtwo} id="imagedownload">
                <div id={styles.weddingcard}>
                    <div className={styles.companylogowedding}>
                        <img src={bdayCompanyLogo} alt="logo" height="150" width="165" /><br />
                    </div>
                    <div id={styles.profileImgwedding}>
                        <img src={profileImage || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='} alt="" width="190" height="150" />
                        <span className={styles.usernamewedding}
                            style={{
                                fontSize: name?.length > 11 ? '14px' : 'initial',
                            }}
                        >{name}</span>
                    </div>
                    <div className={styles.bdaydobwedding}>
                        <span>{date === "" || date === "undefined" ? "" : moment(date)?.format("DD-MM-YYYY")}</span>
                    </div>
                    <div className={styles.bdaywisheswedding}>
                        <span
                            style={{
                                fontSize: wish?.length > 50 ? '11px' : 'initial',
                            }}
                        >{wish}</span>
                    </div>
                    <div className={styles.bdayfootertextwedding}>
                        <span >{footer === "" || footer === undefined || footer === "undefined" ? "" : footer}</span>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default WeddingCardmanualtemplate;