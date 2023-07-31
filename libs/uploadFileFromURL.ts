import axios from 'axios';
import { uploadFile } from './s3';

// USAGE
// const result = await uploadFileFromURL(url, key);

export const uploadFileFromURL = async (url: string, key: string) => {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const result = uploadFile(key, '', response.data);

  return result;
};
