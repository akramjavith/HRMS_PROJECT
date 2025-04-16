import React, { useState, useEffect, useContext } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import QRCode from 'qrcode';
import { SERVICE } from "../../services/Baseservice";
import { AuthContext } from "../../context/Appcontext";
import axios from 'axios';

function Qrcodegenerate({ getProductData, productLabel, width, height }) {

  const widthPx = Number(width) * 3.7795275591; // Convert mm to pixels
  const heightPx = Number(height) * 3.7795275591; // Convert mm to pixels
  const baseSize = productLabel?.labelformat === "Asset Code" ? 100 :  productLabel?.labelformat === "Qr Code" ?  120 :  150; // Increase base size for larger scaling
  const scaleFactor = Math.min(widthPx, heightPx) / baseSize;
  // console.log(baseSize , scaleFactor , 'scaleFactor')
  const [imageUrl, setImageUrl] = useState('');
  const { auth } = useContext(AuthContext);

  const [alldatacompany, setAllDatacompany] = useState([])
  const [alldatabranch, setAllDatabranch] = useState([])
  const [alldataunit, setAllDataunit] = useState([])
  const [alldatafloor, setAllDatafloor] = useState([])
  const [alldataarea, setAllDataarea] = useState([])
  const [alldatalocation, setAllDatalocation] = useState([])

  const Fetchalldata = async (e) => {

    try {
      const resalldata = await axios.post(SERVICE.ALLDATATO_ADDTOPRINTQUEUE, {
        headers: {
          'Authorization': `Bearer ${auth.APIToken}`
        },
        company: String(getProductData.company),
        branch: String(getProductData.branch),
        unit: String(getProductData.unit),
        floor: String(getProductData.floor),
        area: String(getProductData.area),
        location: String(getProductData.location),


      });
      setAllDatacompany(resalldata.data.companycode)
      setAllDatabranch(resalldata.data.branchcode)
      setAllDataunit(resalldata.data.unitcode)
      setAllDatafloor(resalldata.data.floorcode)
      setAllDataarea(resalldata.data.areacode)
      setAllDatalocation(resalldata.data.locationcode)

    } catch (err) {
      const messages = err?.response?.data?.message;
    }
  }

  let Allcodedata = `${alldatacompany}/${alldatabranch}/
${alldataunit}/${alldatafloor}/
${alldataarea}/${alldatalocation}`

  const generateQrCode = async () => {
    try {
      const response = await QRCode.toDataURL(` ${Allcodedata}`);
      setImageUrl(response);
    } catch (err) { }
  }

  useEffect(() => {
    generateQrCode();
  }, [Allcodedata])

  useEffect(() => {
    Fetchalldata()
  }, [getProductData])

  let limitedcode = getProductData?.code?.slice(0, 20);
  let limitedsubcode = getProductData.subcomponent;


  let limitedcompany = getProductData.company?.slice(0, 4);
  let limitedbranch = getProductData.branch?.slice(0, 4);
  let limitedunit = getProductData.unit?.slice(0, 4);
  let limitedfloor = getProductData.floor?.slice(0, 4);
  let limitedarea = getProductData.area?.slice(0, 4);
  let limitedlocation = getProductData.location?.slice(0, 4);


  const getFontSizeAll = (codeLength) => {

    switch (codeLength) {
      case 13: return 18;
      case 14: return 17;
      case 15: return 16;
      case 16: return 15;
      case 17: return 14;
      case 18: return 13;
      case 19: return 12;
      case 20: return 11;
      default: return 15;
    }
  };
  const getFontSizeQRCode = (codeLength) => {
  
    switch (codeLength) {
      case 13: return 20;
      case 14: return 18;
      case 15: return 16;
      case 16: return 16;
      case 17: return 14;
      case 18: return 14;
      case 19: return 12;
      case 20: return 12;
      default: return 12;
    }
  };
  const fontSize = getFontSizeQRCode(limitedcode?.length) * scaleFactor;

  return (
    <>
      {/* label size 35mm*22mm */}
      <Box sx={{ margin: 0, position: "relative", padding: 0, overflow: 'hidden' }}>
        {productLabel.labelformat === "Asset Code" &&
          <>
             <div style={{ width: `${widthPx}px`, height: `${heightPx}px`, position: 'relative' }}>
             <p style={{  fontSize: `${fontSize}px`, color: "black", textAlign: 'center' }}><b>{limitedcode}</b></p>
             </div>
       
          </>
        }
        {productLabel.labelformat === "Qr Code" &&
          <>
            <div style={{ width: `${widthPx}px`, height: `${heightPx}px`, position: 'relative' }}>
              <div style={{ width: '100%' }}>
                <p className="BusinessLocation" style={{
                  fontSize: `${fontSize}px`,
                  color: "black",
                  fontWeight: 1250 * scaleFactor,
                }}>
                  <b>{limitedcode}</b>
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                  {imageUrl ? (
                    <a href={imageUrl} download>
                      <img src={imageUrl} alt="img" width={60 * scaleFactor} height={60 * scaleFactor} style={{ marginTop: `${-10 * scaleFactor}px` }} />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        }
        {productLabel.labelformat === "All Label" &&
          <>

            <div style={{ width: `${widthPx}px`, height: `${heightPx}px`, position: 'relative' }}>
              <div style={{ width: '100%' , marginTop: '0px'}}>
                <p className="BusinessLocation" style={{
                  color: "black",
                  fontSize: `${getFontSizeAll((`${limitedcompany?.toUpperCase()}/${limitedbranch?.toUpperCase()}/${limitedunit?.toUpperCase()}`)?.length) * scaleFactor}px`,
                  lineHeight: `${1.5 * scaleFactor}`,
                }}>
                  <b>{`${limitedcompany?.toUpperCase()}/${limitedbranch?.toUpperCase()}/${limitedunit?.toUpperCase()}`}</b>
                </p>

                <p style={{
                  color: 'black',
                  fontSize: `${getFontSizeAll((`${limitedfloor?.toUpperCase()}/${limitedarea?.toUpperCase()}/${limitedlocation?.toUpperCase()}`)?.length) * scaleFactor}px`,
                  lineHeight: `${1.5 * scaleFactor}`,
                }}>
               
               <b>{`${limitedfloor?.toUpperCase()}/${limitedarea?.toUpperCase()}/${limitedlocation?.toUpperCase()}`}</b>
                  
                </p>

                <p className="Alpharate" style={{
                  fontSize: `${getFontSizeAll((`${limitedcode?.toUpperCase()}/${limitedsubcode}`)?.length) * scaleFactor}px`,
                  lineHeight: `${1.5 * scaleFactor}`,
                  color: 'black'
                }}>
               <b> {`${limitedcode?.toUpperCase()}/${limitedsubcode}`}</b>
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                  <div style={{ marginLeft: `${10 * scaleFactor}px` }}>
                    {imageUrl ? (
                      <a href={imageUrl} download>
                        <img src={imageUrl} alt="img" 
                        width={60 * scaleFactor}
                         height={60 * scaleFactor}
                          style={{ marginTop: `${-10 * scaleFactor}px` }} />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      </Box>
    </>

  );
}


export default Qrcodegenerate;