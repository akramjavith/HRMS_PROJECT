import {useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import { Grid, Button } from '@mui/material';
import axios from "axios"
import hilifelogo from "./hilifelogo.png"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const EmailVerify = () =>{
    const [validUrl,setValidUrl] = useState(false);
    const param = useParams();
    const verifyEmailUrl = async () =>{
        try{
            const url = `http://anubhuthi.org/api/${param.id}/verify/${param.token}`;
            const res = await axios.get(url);
            setValidUrl(true);
        }catch(err){
            console.log(err.message);
        }
    };
  

    return(
        <>
        
        <>
        {
            !validUrl && 
            <>
              <Grid
      container
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
      }}
    >
      <Grid
        item
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',  // Adjusted to column layout
          padding: '20px',  // Added padding for better spacing
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={hilifelogo} alt="Logo" style={{ height: '50px', width: '50px', marginRight: '10px' }} />
          <h2>HIHRMS AUTHENTICATION</h2>
        </div>
        <br />
        <h3 style={{ color: 'black' }}>Verify Your Email</h3>
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={verifyEmailUrl}
          style={{ width: '100px' }}
        >
          Verify
        </Button>
      </Grid>
    </Grid></>}
                        {
            validUrl &&

                    <>
                    <Grid
                    container
                    style={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    }}
                    >
                    <Grid
                    item
                    style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',  // Adjusted to column layout
                    padding: '20px',  // Added padding for better spacing
                    }}
                    >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={hilifelogo} alt="Logo" style={{ height: '50px', width: '50px', marginRight: '10px' }} />
                    <h2>HIHRMS AUTHENTICATION</h2>
                    </div>
                    <br />
                    <CheckCircleOutlineIcon sx={{fontSize:"150px",color:"green"}}/><br/>
                    <h3 style={{ color: 'black' }}>Email Verified Successfully</h3>
                    <br />
                    <Link to="/signin" target="_blank"><Button
                    variant="contained"
                    color="primary"
                    style={{ width: '100px' }}
                    >
                    Login
                    </Button></Link>
                    </Grid>
                    </Grid></>
            
        }
                </>
        </>
    )
}

export default EmailVerify;