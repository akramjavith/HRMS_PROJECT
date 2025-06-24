// utils/getPincodeDetails.js
import axios from '../axiosInstance';
import { SERVICE } from '../services/Baseservice.js';
export const getPincodeDetails = async (pincode) => {
  if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
    return { status: 'Invalid', message: 'Please enter a valid 6-digit pincode.', data: [] };
  }

  try {
    const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
    const { Status, Message, PostOffice } = response.data[0];

    if (Status === 'Error' || !PostOffice) {
      return { status: 'Error', message: Message || 'No records found.', data: [] };
    } else {
      // 1. Get local areas from your own backend
      const localAreaRes = await axios.get(`${SERVICE.GET_AREAS_BY_PINCODE}/?pincode=${pincode}`);
      const localAreaNames = localAreaRes.data?.areas || [];

      // 2. Map PostOffice API results
      const modifiedPostOffices = PostOffice.map(({ Name, ...rest }) => ({
        name: Name,
        ...rest,
      }));

      // 3. Append local areas from your DB as objects
      const localAreaObjects = localAreaNames.map(area => ({
        name: area,
        source: 'internal'  // Optional: mark source if needed
      }));

      const combined = [...modifiedPostOffices, ...localAreaObjects];

      // 4. Remove duplicates by `name` (case-insensitive)
      const uniqueMap = new Map();
      combined.forEach(item => {
        const key = item.name?.trim().toLowerCase();
        if (key && !uniqueMap.has(key)) {
          uniqueMap.set(key, item);
        }
      });

      const uniqueFinalList = Array.from(uniqueMap.values());

      // 5. Pass to parent

      return { status: 'Success', message: Message, data: uniqueFinalList };
    }
  } catch (error) {
    return {
      status: 'NetworkError',
      message: 'Unable to reach the pincode server. Please try again.',
      data: [],
    };
  }
};
