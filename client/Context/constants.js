import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import axios from 'axios';

export const MEDICAL_ADDRESS = process.env.NEXT_PUBLIC_MEDICAL_CONTRACT;

export const Signer = async () => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();

  return signer;
}

export const uploadData = async (data) => {
  const response = await axios({
      method: "POST",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data: data,
      headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRECT_KEY,
          "Content-Type": "application/json",
      }
  });

  const url = `https://aquamarine-near-swallow-446.mypinata.cloud/ipfs/${response.data.IpfsHash}`;
  return url;
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
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRECT_KEY,
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
}

export const SHORTEN_ADDRESS = (address) => {
  return `${address?.slice(0, 8)}...${address?.slice(address.length - 4)}`;
}

export const errorParseMsg = (e) => {
  const json = JSON.parse(JSON.stringify(e));
  return json?.reason || json?.error?.message;
}