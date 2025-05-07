import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const getFormattedAddress = (employee) => {
    const parts = [
        employee?.ppersonalprefix,
        employee?.presourcename,
        employee?.plandmarkandpositionalprefix,
        employee?.plandmark,
        employee?.pdoorno && `House/Flat No: ${employee.pdoorno}`,
        employee?.pstreet,
        employee?.parea,
        employee?.pcity,
        employee?.pstate,
        employee?.pcountry,
        employee?.ppincode && `Pincode: ${employee.ppincode}`,
        employee?.pgpscoordination && `GPS: ${employee.pgpscoordination}`,
    ];

    // Filter out undefined, null, empty strings, trim extra spaces
    const filteredParts = parts.filter(
        (part) => part !== undefined && part !== null && String(part).trim() !== ''
    );

    return filteredParts.join(', ');
};

const FullAddressCard = ({ employee }) => {
    const fullAddress = getFormattedAddress(employee);

    return (
        <Card sx={{ mt: 3, p: 2, borderRadius: 3, boxShadow: 4 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Full Address
                </Typography>
                <Box>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                        {fullAddress || 'No address information available.'}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default FullAddressCard;