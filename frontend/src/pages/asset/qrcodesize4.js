import React, {useState,useEffect,useContext} from 'react';
import { Grid,Box,Typography } from '@mui/material';
import QRCode from 'qrcode';
import { SERVICE } from "../../services/Baseservice";
import { UserRoleAccessContext, AuthContext } from "../../context/Appcontext";
import axios from 'axios';
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";


function Qrcodegenerate({getProductData, productLabel}) { 
  
  const [imageUrl, setImageUrl] = useState('');

  useEffect(
    ()=> {
    generateQrCode();

  },[])

  
  const { auth } = useContext(AuthContext);
  const { isUserRoleCompare, isUserRoleAccess } = useContext(
      UserRoleAccessContext
  );
  const [showAlert, setShowAlert] = useState();
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const handleClickOpenerr = () => {
    setIsErrorOpen(true);
};
const handleCloseerr = () => {
    setIsErrorOpen(false);
};



  const [alldatacompany,setAllDatacompany] = useState([])
  const [alldatabranch,setAllDatabranch] = useState([])
  const [alldataunit,setAllDataunit] = useState([])
  const [alldatafloor,setAllDatafloor] = useState([])
  const [alldataarea,setAllDataarea] = useState([])
  const [alldatalocation,setAllDatalocation] = useState([])

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
      if (messages) {
          setShowAlert(
            <>
              <ErrorOutlineOutlinedIcon
                sx={{ fontSize: "100px", color: "orange" }}
              />
              <p style={{ fontSize: "20px", fontWeight: 900 }}>{messages}</p>{" "}
            </>
          );
          handleClickOpenerr();
        }
  }


  }



useEffect(() => {
  generateQrCode();
}, [Allcodedata])

useEffect(() =>{
  Fetchalldata()
},[getProductData])

let Allcodedata = `${alldatacompany}/${alldatabranch}/
${alldataunit}/${alldatafloor}/
${alldataarea}/${alldatalocation}`

  const generateQrCode = async () => {
    try {
          const response = await QRCode.toDataURL(`${Allcodedata}`);
          setImageUrl(response);
    }catch (error) {
      console.log(error);
    }
  }

  let limitedcode = getProductData.code;
  let limitedsubcode = getProductData.subcomponent;
  let limitedcompany = getProductData.company?.slice(0, 4);
  let limitedbranch = getProductData.branch?.slice(0, 4);
  let limitedunit = getProductData.unit?.slice(0, 4);
  let limitedfloor = getProductData.floor?.slice(0, 4);
  let limitedarea = getProductData.area?.slice(0, 4);
  let limitedlocation = getProductData.location?.slice(0, 4);


  return (
    <>
      <Box sx={{ margin:0,position : "relative", padding:0, overflow:'hidden'}}>
            {productLabel.labelformat === "Asset Code" &&
    <>
    <Grid xs={12} md={12} lg={12} sx={12}>
          {productLabel.labelformat === "Asset Code" 
          ?
           <p  style={{ fontSize: '18px', color: "black",
           paddingBottom:'2px', fontWeight: 1250, textAlign: 'center' }}><b>{limitedcode}</b></p>
            :
            <p style={{ fontSize: '18px', color: "black", fontWeight: 1250, textAlign: 'center', visibility: 'hidden' }}>
              <b>{limitedcode?.toUpperCase()}</b></p>}
        </Grid>
           </>
        }

{productLabel.labelformat === "Qr Code" &&
 <>
   <Grid xs={12} md={12} lg={12} sx={12}>
   {productLabel.labelformat === "Qr Code" ? 
              <p  style={{ fontSize: '18px', color: "black",
              paddingBottom:'2px', fontWeight: 1250, textAlign: 'center' }}><b>{limitedcode}</b></p>
               :
               <p style={{ fontSize: '18px', color: "black", fontWeight: 1250, textAlign: 'center', visibility: 'hidden' }}>
                 <b>{limitedcode?.toUpperCase()}</b></p>}
        </Grid>
        <Grid container>
            
            <Grid xs={4} md={4} lg={4} sm={4} >
              <Box sx={{marginLeft:'4px'}}>
                {imageUrl ? (
                  <a href={imageUrl} download >
                      <img src={imageUrl} alt="img" width={60} height={60} style={{marginTop:'-8px'}} />
                  </a>) : null  
                }
                </Box>
              </Grid>
            </Grid>
        </>
}
{productLabel.labelformat === "All Label" &&
 <>
   <Grid xs={12} md={12} lg={12} sx={12}>
          {productLabel.labelformat === "All Label" ? 
         <p style={{ fontSize: '14px', marginLeft:'-3px', fontWeight: 1200, color: 'black', textAlign: 'center', paddingBottom:'4px' }}>
          <b style={{ textTransform: 'uppercase' }}>
           { `${limitedcompany?.toUpperCase()}/${limitedbranch?.toUpperCase()}/${limitedunit?.toUpperCase()}
           ${limitedarea?.toUpperCase()}/${limitedlocation?.toUpperCase()}/${limitedcode?.toUpperCase()}
           /${limitedsubcode}
           `
 } </b></p>
             :
         
            <p style={{ fontSize: '18px', color: "black", fontWeight: 1250, textAlign: 'center', visibility: 'hidden' }}></p>}

        </Grid>
        <Grid container>
            
            <Grid xs={4} md={4} lg={4} sm={4} >
              <Box sx={{marginLeft:'4px'}}>
                {imageUrl ? (
                  <a href={imageUrl} download >
                      <img src={imageUrl} alt="img" width={60} height={60} style={{marginTop:'-8px'}} />
                  </a>) : null  
                }
                </Box>
              </Grid>
            </Grid>
        </>
}




        <Grid container>
              <Grid xs={2} md={2} lg={2} sm={2} sx={{textAlign:'center'}}>
            {/* {productLabel.isProductNumberAlpha ? <p style = {{marginTop:'18px',fontSize:resnodata == 2 ? '17px': resnodata == 3 ? '16px' : resnodata == 4 ? '15px' : resnodata == 5 ? '14px' : '18px',left:'-10px',fontWeight:1200,transform:'rotate(-90deg)',color:'black',position:'absolute',textAlign:'center',textTransform:'uppercase'}}><b>{getProductData.snno + "#" + getProductData.alpharate}</b></p> : <p style = {{marginTop:'18px',fontSize:resnodata == 2 ? '17px': resnodata == 3 ? '16px' : resnodata == 4 ? '15px' : resnodata == 5 ? '14px' : '18px',left:'-10px',fontWeight:1200,transform:'rotate(-90deg)',color:'black',position:'absolute',textAlign:'center',textTransform:'uppercase', visibility:'hidden'}}><b>{getProductData.snno + "#" + getProductData.alpharate}</b></p>}  */}

              </Grid>
              <Grid xs={1} md={1} lg={1} sm={1} sx={{textAlign:'center'}}>
              {/* <Typography>{productLabel.isProductCode ? <p style = {{fontSize:'14px',marginTop:'45px',marginLeft:'0', transform:'rotate(-90deg)',fontWeight:'bolder',textAlign:'center',color:'black',textTransform:'uppercase'}}><b>{rackslice+ '/' + skuid }</b></p> : <p style = {{fontSize:'14px',marginTop:'45px',marginLeft:'0', transform:'rotate(-90deg)',fontWeight:'bolder',textAlign:'center',color:'black',textTransform:'uppercase', visibility:'hidden'}}><b>{rackslice+ '/' + skuid }</b></p>}</Typography> */}

              </Grid>
                <Grid xs={8} md={8} lg={8} sm={8} sx={{textAlign:'center'}}>
                  {/* <Typography>{productLabel.isProductCategorySubcategory ? <p style={{fontSize:'13px',fontWeight:1200,color:'black', marginTop:'-6px'}}><b style={{textTransform:'uppercase'}}>{rescat}</b></p> :<p style={{fontSize:'13px',fontWeight:1200,color:'black', marginTop:'-6px'}}><b style={{textTransform:'uppercase'}}>{rescatsubsup}</b></p> }</Typography>
                <Typography> {productLabel.isProductSizeBrand ? <p className="Alpharate" style={{fontSize:'15px',left:'2px', marginTop:'-6px',position:'relative', textAlign:'center',fontWeight:1200, color:'black'}}><b>{ressize}</b></p> : <p className="Alpharate" style={{fontSize:'15px',left:'2px', marginTop:'-6px',position:'relative', textAlign:'center',fontWeight:1200, color:'black'}}><b>{ressizebrandsub}</b></p>}</Typography> */}
                <Grid container>
                <Grid xs={7} md={7} lg={7} sm={7} sx={{textAlign:'center'}}>
                {/* <Typography> {productLabel.isProductSellingPrice ? <p className="productSellingPrice" style={{fontSize:respricedata == 4 ? '31px': respricedata == 5 ? '30px': respricedata == 6 ? '29px': respricedata == 7 ? '28px' : respricedata == 8 ? '27px' : '32px',color:'black', fontWeight:1200,textAlign:'center', transformOrigin:'top', transform: respricedata == 3 ? 'scaleY(1.4)' : respricedata == 4 ? 'scaleY(1.4)' : respricedata == 5 ? 'scaleY(1.4)' : respricedata == 6 ? 'scaleY(1.4)' : respricedata == 7 ? 'scaleY(1.4)' : 'none', marginTop: respricedata == 3 ? '-9px' : respricedata == 4 ? '-9px' : respricedata == 5 ? '-9px' : respricedata == 6 ? '-9px' : respricedata == 7 ? '-9px' : '0'}}><b>{'₹' + respricedatastring}<sub style={{fontSize:'10px', transform:'none', transformOrigin:'top'}}>{respricesuffix}</sub></b></p> : <p className="productSellingPrice" style={{fontSize:respricedata == 4 ? '31px': respricedata == 5 ? '30px': respricedata == 6 ? '29px': respricedata == 7 ? '28px' : respricedata == 8 ? '27px' : '32px',color:'black', fontWeight:1200,textAlign:'center', visibility:'hidden'}}><b>{'₹' + respricedatastring}<sub style={{fontSize:'10px', transform:'none', transformOrigin:'top'}}>{respricesuffix}</sub></b></p>} </Typography> */}
                {/* <Typography>  {productLabel.isProductDiscPrice && <p className="ProductDiscoutPrice" style={{fontSize:'17px', color:'black',fontWeight:'bolder', textAlign:'center'}}><b>{'₹ ' + getProductData.}  </Typography> */}
                </Grid>
                {/* <Grid xs={4} md={4} lg={4} sm={4} >
                  <Box sx={{marginLeft:'11px'}}>
                    {imageUrl ? (
                      <a href={imageUrl} download >
                          <img src={imageUrl} alt="img" width={50} height={50} style={{marginTop:'-8px'}} />
                      </a>) : null  
                    }
                    </Box>
                  </Grid> */}
                </Grid>
              </Grid>
        </Grid>
      </Box>
    </>
    
  );
}


export default Qrcodegenerate;