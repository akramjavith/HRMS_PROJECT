import DownloadIcon from '@mui/icons-material/Download';
import axios from "axios";
import html2canvas from 'html2canvas';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SERVICE } from "../services/Baseservice";
import styles from "./bdcssmanualtemplate.module.css";


const BDayCardmanualtemplate = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    // const name = "PRIYANKA.CHINNATHAMBIPRIYA"
    const status = urlParams.get('status')
    const dataId = useParams()?.id

    console.log(dataId, "id")

    // Retrieve the 'wish', 'name', and 'id' parameters from the URL
    const name = urlParams.get('name');
    const date = urlParams.get('date');
    const wish = urlParams.get('wish');
    const footer = urlParams.get('footer');


    const [profileImage, setProfileImage] = useState(null);
    console.log(profileImage, "img")

    // Retrieve the image from localStorage when the component mounts
    useEffect(() => {
        const storedImage = localStorage.getItem('profileImage');
        if (storedImage) {
            setProfileImage(storedImage);
        }
    }, []);

    // Now you have the values from the URL
    const [bdayCompanyLogo, setBdayCompanyLogo] = useState("")
    const [bdayfootertext, setBdayfootertext] = useState("")
    const [bdaywishes, setBdaywishes] = useState("")
    const [profileSrc, setProfileSrc] = useState("")
    const [employeeDob, setEmployeeDob] = useState("")

    const fetchBdaySetting = async () => {
        try {
            let res = await axios.get(`${SERVICE.POSTERGENERATE_SINGLE}/${dataId}`, {

            });

            console.log(res.data?.spostergenerate?.imagebase64)
            setBdayCompanyLogo(res.data?.spostergenerate?.imagebase64)

            // setBdayCompanyLogo(
            //     res?.data?.overallsettings[res?.data?.overallsettings.length - 1]
            //         ?.companylogo
            // );

        } catch (err) {
            console.log(err, '12')
        }
    };

    useEffect(() => {
        fetchBdaySetting();
    }, [dataId])


    const downloadImage = () => {
        const element = document.getElementById('imagedownload');
        html2canvas(element).then((canvas) => {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `_birthdaycard.png`;
            link.click();
        });
    };


    return (
        <div>
            {/* {status ? ( */}
            <div className={styles.downloadbuttonwrapper}>
                <button onClick={downloadImage}><DownloadIcon /></button>
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%"
                }}
            >
                <div
                    id="imagedownload"

                >
                    <div >
                        {/* <div className={styles.companylogotwo}> */}
                        <img src={bdayCompanyLogo} style={{
                            width: "520px",
                            height: "500px"
                        }} alt="logo" /><br />
                    </div>
                </div>
            </div>

        </div >

    );
};

export default BDayCardmanualtemplate;