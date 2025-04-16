import React from 'react';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

export const handleApiError = (err, setShowAlert, handleClickOpenerr) => {
    console.log(err);
    let message = "Something went wrong!";

    if (err.response) {
        if (err.response.data && err.response.data.message) {
            if (err.response.data.message.includes('The value of "offset" is out of range')) {
                message = "Memory is Full!. Please delete anyone of the previous data in the log list.";
            } else {
                message = err.response.data.message;
            }

        } else if (err.response.status) {
            switch (err.response.status) {
                case 400:
                    message = "Bad request. Please check your input.";
                    break;
                case 401:
                    message = "Unauthorized. Please log in again.";
                    break;
                case 403:
                    message = "Forbidden. You do not have permission.";
                    break;
                case 404:
                    message = "Resource not found. Contact Administrator";
                    break;
                case 500:
                    message = "Please try again later. Contact Administrator";
                    break;
                default:
                    message = `Unexpected error occurred. Contact Administrator`;
            }
        }
    } else if (err.request) {
        message = "No response. Check Your Internet Connection!";
    }

    else {
        if (err.message.includes('Network Error') || err.message.includes('ERR_CONNECTION_REFUSED')) {
            message = "Reconnect...Check Your Internet Connection!";
        } else {
            message = err.message;
        }
    }

    setShowAlert(
        <>
            <ErrorOutlineOutlinedIcon sx={{ fontSize: "100px", color: "orange" }} />
            <p style={{ fontSize: "20px", fontWeight: 900 }}>{message}</p>
        </>
    );
    handleClickOpenerr();
};