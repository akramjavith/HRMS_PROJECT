import React from 'react';
import { Grid, Container, Box, Typography } from '@mui/material';
import { footerStyle } from './footerStyle';

function Footer() {
    let today = new Date();
    var yyyy = today.getFullYear();
    return (
        <Box sx={footerStyle.container}>
            <Container>
                <Grid>
                    <Typography variant="subtitle2" sx={[footerStyle.hearts, { '@media (max-width: 507px)': { fontSize: '10px !important' } }]}>
                        © {yyyy}, HILIFE.AI Pvt. Ltd. All Rights Reserved. Made with &ensp;❤️ &ensp; in TRICHY  &ensp; | &ensp; திருச்சியில் உருவாக்கப்பட்டது &ensp;❤️
                    </Typography>
                </Grid>
            </Container>
        </Box>
    );
}

export default Footer;