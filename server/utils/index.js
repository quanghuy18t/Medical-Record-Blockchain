import Medical from '../../hardhat/artifacts/contracts/Medical.sol/Medical.json' assert { type: 'json' };
import { ethers } from 'ethers';
import axios from 'axios';

export const MedicalContract = () => {
  const provider = new ethers.JsonRpcProvider(process.env.MEDICAL_CHAIN_RPC);

  const contract = new ethers.Contract(
    process.env.MEDICAL_CONTRACT_ADDRESS,
    Medical.abi,
    provider
  )

  return contract;
}

export const uploadData = async (data) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data: data,
      headers: {
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRECT_KEY,
          "Content-Type": "application/json",
      }
    });

    const url = `https://aquamarine-near-swallow-446.mypinata.cloud/ipfs/${response.data.IpfsHash}`;
    return url;
  } catch (error) {
    console.log(error);
  }
}

export const uploadImage = async (file) => {
  if (file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRECT_KEY,
        "Content-Type": "multipart/form-data",
      },
    });

    const imgHash = `https://aquamarine-near-swallow-446.mypinata.cloud/ipfs/${response.data.IpfsHash}`;
    return imgHash;
  }
};

export const convertTimestamp = (timeStamp) => {
  const date = new Date(timeStamp * 1000);

  const readableTime = date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return readableTime;
};

export const timeToMinutes = (timeStr) => {
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  return period === 'PM' && hours !== 12 
    ? hours * 60 + minutes + 720 
    : hours * 60 + minutes;
};

export const generateSlots = (day, start, end) => {
  const slots = [];

  const startTime = new Date(day);
  const endTime = new Date(day);

  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);

  startTime.setUTCHours(startHour, startMinute, 0, 0);
  endTime.setUTCHours(endHour, endMinute, 0, 0);

  let currentTime = new Date(startTime);

  while (currentTime < endTime) {
    slots.push({
      time: new Date(currentTime),
      booked: 0
    });

    currentTime.setMinutes(currentTime.getMinutes() + 30);
  }

  return slots;
}

export const getAccessToken = async () => {
  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENTID}:${process.env.PAYPAL_SECRET}`
    ).toString('base64')

    const response = await axios.post(
      `${process.env.PAYPAL_BASEURL}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.log(error);
  }
}