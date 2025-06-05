// utils/serverTime.js
import axios from 'axios';
import { SERVICE } from '../services/Baseservice';

export const getCurrentServerTime = async () => {
    try {
        const response = await axios.get(SERVICE.GET_CURRENT_SERVER_TIME);
        return new Date(response.data.currentNewDate); // server time as Date object
    } catch (err) {
        console.warn('⚠️ Error fetching server time. Using local system time.');
        return new Date(); // fallback to local time
    }
};