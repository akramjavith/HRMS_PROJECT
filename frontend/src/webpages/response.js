import { React } from 'react';
import { Box, Typography, Button, } from '@mui/material';
import Headtitle from '../components/Headtitle';
import './Response.css'
import Handshake from '../images/handshake1.png'
import { Link } from 'react-router-dom';

function Responselist() {

    return (
        <Box className='container'>
            <Headtitle title="Response" />
            <div >
                <div className="wrapper-1">
                    <div className="wrapper-2">
                        <img src={Handshake} alt="Icon" className="icon" />
                        <Typography variant='h1'>Thank you !</Typography>
                        <Typography>Thanks a bunch for filling that out. It means a lot to us, just like you do! We really appreciate you giving us a moment of your time today. Thanks for being you.!!</Typography>
                        <Link to={'/career'} style={{ color: "#000001 ", textDecoration: "none" }}>
                            <Button className="go-home">
                                go back
                            </Button>
                        </Link>
                    </div>
                    <div className="footer-like">
                        <Typography>Further details check your Email!!</Typography>
                    </div>
                </div>
            </div>
        </Box >
    );
}

function Response() {
    return (
        <Box >
            <Box sx={{ width: '100%', overflowX: 'hidden' }}>
                <Box sx={{ maxWidth: '1600px', margin: '0 auto', padding: '3rem 0px 0px 0px' }}>
                    <br /><br />
                    <Responselist /><br /><br />
                </Box>
            </Box>
        </Box>
    );
}
export default Response;