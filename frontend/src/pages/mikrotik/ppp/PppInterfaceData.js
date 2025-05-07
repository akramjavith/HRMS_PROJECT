import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { SERVICE } from "../../../services/Baseservice.js";
import { AuthContext } from "../../../context/Appcontext.js";
const PppInterfaceData = (url, username, password, interval = 1000, filterApplied) => { // Default interval set to 5 seconds
    const [dataInterface, setDataInterface] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorOccurred, setErrorOccurred] = useState(false);
    const { auth } = useContext(AuthContext);
    const fetchData = async () => {
        try {
            let response = await axios.post(SERVICE.GETALL_MIKROTIK_INTERFACES, {
                url, username, password
            }, {
                headers: {
                    Authorization: `Bearer ${auth.APIToken}`,
                },
            });

            let datas =
                response?.data?.allmikrotikinterface?.filter(data => data.type === 'pppoe-out' || data.type === "l2tp-in")
            setDataInterface(datas); // Adjust according to your response structure
            setLoading(false);
        } catch (err) {
            console.log(err);
            setDataInterface([]);
            setError(err);
            setLoading(false);
            setErrorOccurred(true);
        }
    };

    useEffect(() => {
        if (filterApplied && url && username && password && !errorOccurred) { // Only fetch if the filter is applied
            fetchData(); // Initial fetch after the filter is applied
            const intervalId = setInterval(fetchData, interval); // Set up polling

            return () => clearInterval(intervalId); // Cleanup on unmount or filter change
        } else {
            setDataInterface([]);
            setLoading(false);
        }
    }, [url, username, password, interval, filterApplied, errorOccurred]);

    return { dataInterface, loading, error };
};

export default PppInterfaceData;
