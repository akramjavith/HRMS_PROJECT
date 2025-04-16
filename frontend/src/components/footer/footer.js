import React from 'react';
import { Grid, Container, Box, Typography } from '@mui/material';
import { FaHeart } from 'react-icons/fa';
import { footerStyle } from './footerStyle';


function Footer() {
    let today = new Date();
    var yyyy = today.getFullYear();
    return (
        <Box>
            <Container sx={footerStyle.container}>
                <Grid>
                    <Typography variant="subtitle2" sx={{ '@media (max-width: 507px)': { fontSize: '10px', } }}>© {yyyy}, HILIFE.AI Pvt. Ltd. All Rights Reserved.</Typography>
                </Grid>
                <Grid sx={{ '@media (max-width: 507px)': { fontSize: '10px !important', } }}>
                    <Typography sx={[footerStyle.hearts, { '@media (max-width: 507px)': { fontSize: '10px !important', } }]}>Made with &ensp;❤️ &ensp; in TRICHY  &ensp;
                        | &ensp; திருச்சியில் உருவாக்கப்பட்டது &ensp;❤️ </Typography>
                </Grid>
            </Container>
        </Box>
    );
}

export default Footer;