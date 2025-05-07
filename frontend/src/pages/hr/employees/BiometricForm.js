import React, { useState } from "react";
import axios from "axios";
import { Grid, FormControl, Typography, OutlinedInput, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Selects from "react-select"; // Ensure you have react-select installed

const BiometricForm = ({ employee, setEmployee, auth, SERVICE, handleApiError, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert, enableLoginName, third, BiometricPostDevice, setBiometricPostDevice, BioPostCheckDevice, setBioPostCheckDevice }) => {

    const [loadingBiometric, setLoadingBiometric] = useState(false);
    const [BiometricId, setBiometricId] = useState(0);
    const [BioIndivUserCheck, setBioIndivUserCheck] = useState(false);

    const fetchBioInfoStatus = async (biometricdevicename) => {
        try {
            await axios.post(SERVICE.BIOMETRIC_GET_SEND_COMMAND, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
                deviceCommandN: "2",
                CloudIDC: biometricdevicename,

            });
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };


    const handleBiometricActionClick = () => {
        if (!employee?.biometricdevicename || employee?.biometricdevicename === "Please Select Device") {
            setPopupContentMalert("Please Select Device Name.!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            setLoadingBiometric(true);
            setTimeout(() => {
                setLoadingBiometric(false);
                fetchUsersAvailability(employee?.biometricdevicename);
            }, 25000);
        }
    };

    const fetchUsersAvailability = async (biometricdevicename) => {
        try {
            const [res, response] = await Promise.all([
                axios.post(SERVICE.BIOMETRIC_GET_DEVICE_INFO_STATUS, { cloudIDC: biometricdevicename }, { headers: { Authorization: `Bearer ${auth.APIToken}` } }),
                axios.post(SERVICE.BIOMETRIC_USER_DUPLICATE_CHECK, {
                    cloudIDC: biometricdevicename,
                    staffNameC: enableLoginName ? String(third) : employee.username
                }, { headers: { Authorization: `Bearer ${auth.APIToken}` } })
            ]);

            let duplicateCheck = response?.data?.individualuser;
            setBioIndivUserCheck(duplicateCheck);

            if (res?.data?.alldeviceinfo) {
                setBiometricId(Number(res?.data?.alldeviceinfo) + 1);
            }
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    const handleSubmitBioCheck = (e) => {
        e.preventDefault();

        if (!employee.biometricdevicename || employee.biometricdevicename === "Please Select Device") {
            setPopupContentMalert("Please Select Device Name.!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (!BiometricId || BiometricId <= 0) {
            setPopupContentMalert("Check Availability Status to get UserID!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (!employee?.biometricrole || employee?.biometricrole === "Please Select Role") {
            setPopupContentMalert("Please Select Biometric User Role!");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else if (BioIndivUserCheck) {
            setPopupContentMalert("User Already Added");
            setPopupSeverityMalert("info");
            handleClickOpenPopupMalert();
        } else {
            addUserInBioMetric();
        }
    };

    const addUserInBioMetric = async () => {
        try {
            let res = await axios.post(SERVICE.BIOMETRIC_USER_SINGLE_ADD, {
                headers: { Authorization: `Bearer ${auth.APIToken}` },
                biometricUserIDC: BiometricId,
                cloudIDC: employee.biometricdevicename,
                dataupload: "new",
                downloadedFaceTemplateN: 0,
                downloadedFingerTemplateN: 0,
                fingerCountN: 0,
                isEnabledC: "Yes",
                isFaceEnrolledC: "No",
                privilegeC: employee.biometricrole,
                pwdc: "",
                staffNameC: enableLoginName ? String(third) : employee.username,
            });

            setPopupContentMalert("Biometric Data Added");
            setPopupSeverityMalert("success");
            handleClickOpenPopupMalert();
            setBiometricPostDevice({
                biometricUserIDC: BiometricId,
                cloudIDC: employee.biometricdevicename,
            });

            setEmployee((prev) => ({
                ...prev,
                biometricdevicename: "Please Select Device",
                biometricrole: "Please Select Role",
            }));

            setBiometricId(0);
            setBioPostCheckDevice(true);
        } catch (err) {
            handleApiError(err, setPopupContentMalert, setPopupSeverityMalert, handleClickOpenPopupMalert);
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item md={2.8} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography>
                        Device Name<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                        options={[{ label: "BT17EVP20001125", value: "BT17EVP20001125" }]}
                        value={{ label: employee.biometricdevicename, value: employee.biometricdevicename }}
                        // isDisabled={BioOldUserCheck ? true : false}
                        onChange={(e) => {
                            setEmployee({ ...employee, biometricdevicename: e.value });
                            fetchBioInfoStatus(e.value);
                            setBiometricId(0);
                        }}
                    />
                </FormControl>
            </Grid>

            {
                    BiometricId > 0 ? (
                    <Grid item md={2} xs={12} sm={12} mt={3}>
                        <CheckCircle sx={{ color: "green", fontSize: 24, verticalAlign: "middle" }} />
                        <span style={{ marginLeft: 8 }}>Available</span>
                    </Grid>
                ) : (
                    <Grid item md={3} xs={12} sm={12} mt={3}>
                        <LoadingButton variant="contained" size="small" onClick={handleBiometricActionClick} loading={loadingBiometric} sx={{ minWidth: 140 }}>
                            {"Check Availability"}
                        </LoadingButton>
                    </Grid>
                )
            }

            <Grid item md={2.8} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography>Biometric User Id</Typography>
                    <OutlinedInput type="text" value={BiometricId} readOnly />
                </FormControl>
            </Grid>
            <Grid item md={2.8} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography>
                        Biometric Username
                    </Typography>
                    <OutlinedInput
                        value={enableLoginName ? third : employee.username}
                        readOnly
                    />
                </FormControl>
            </Grid>
            <Grid item md={2.8} xs={12} sm={12}>
                <FormControl fullWidth size="small">
                    <Typography>
                        Biometric Role<b style={{ color: "red" }}>*</b>
                    </Typography>
                    <Selects
                        options={[{ label: "User", value: "User" }, { label: "Manager", value: "Manager" }, { label: "Administrator", value: "Administrator" }]}
                        value={{
                            label: employee.biometricrole,
                            value: employee.biometricrole,
                        }}
                        onChange={(e) => {
                            setEmployee({
                                ...employee,
                                biometricrole: e.value,
                            });
                            // fetchBioInfoStatus(e.value)
                        }}
                    />

                </FormControl>

            </Grid>
          <Grid item md={2.8} xs={12} sm={12} mt={3}>
                <Button variant="contained" disabled={BioPostCheckDevice ? true : false} onClick={handleSubmitBioCheck}>Add to Biometric</Button>
            </Grid>
        </Grid>
    );
};

export default BiometricForm;
