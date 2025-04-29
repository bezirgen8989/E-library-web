import { RcFile } from "antd/es/upload";
import { message } from "antd";
import dayjs from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";
import { AxiosResponse } from "axios";
import * as RelativeTime from "dayjs/plugin/relativeTime";

// import { defaultDataFormat } from '@constants';
// import { FileType } from '@types';

// import { newPoints } from './axios';
import { defaultDataFormat } from "../constants";

export const addAlpha = (color: string, opacity: number) => {
  // coerce values so it is between 0 and 1.
  const _opacity = Math.round(Math.min(Math.max(opacity ?? 1, 0), 1) * 255);

  return color + _opacity.toString(16).toUpperCase();
};
export const randomColor = () => [
  "#FF5733",
  "#FFA133",
  "#FFD133",
  "#33FF6E",
  "#33E5FF",
  "#336BFF",
  "#8A33FF",
  "#FF33C2",
  "#A66133",
  "#808080",
  "#000000",
  "#C0C0C0",
];

export const patternOnlyLettersAndNumbers = /[^a-zA-Z0-9 ]/g;

export const beforePhotoUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }

  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }

  return isJpgOrPng && isLt2M;
};

export const formatDate = (value: Date | string | undefined) => {
  if (!value) {
    return "";
  }

  return dayjs(value).format(defaultDataFormat);
};

type DateColors = "success" | "processing" | "error" | "default" | "warning";

export const getDateColor = (args: {
  date: string;
  defaultColor?: DateColors;
}): DateColors => {
  const date = dayjs(args.date);
  const today = dayjs();

  if (date.isBefore(today)) {
    return "error";
  }

  if (date.isBefore(today.add(3, "day"))) {
    return "warning";
  }

  return args.defaultColor ?? "default";
};

export const disabledFutureDate: RangePickerProps["disabledDate"] = (current) =>
  current && current > dayjs().endOf("day");

export const arraysEqual = (arr1?: any[] | null, arr2?: any[] | null) => {
  if (arr1 === arr2) {
    return true;
  }

  if (arr1 == null || arr2 == null) {
    return false;
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
};

export const formatMoneySum = (sum: string | number) => {
  if (typeof sum === "string") {
    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
    }).format(Number(sum));
  }

  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
  }).format(sum);
};

export const isAdmin = <TUser extends { role: { name: string } }>(
  user?: TUser
): boolean => user?.role.name === "superuser";

export const makeColorDull = (hexColor: string, opacity: number = 0.15) => {
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5), 16);

  // Convert back to HEX format with added transparency effect
  return `rgba(${r},${g},${b},${opacity})`;
};

export const mergeUniqueById = (
  arr1: any[] = [],
  arr2: any[] = [],
  uniqKey: string
) => {
  const combinedArray = [...arr1, ...arr2];

  // Create an object to store unique objects based on ID
  const uniqueObjects: any = {};

  // Iterate over each object in the combined array
  combinedArray.forEach((obj) => {
    // Check if an object with the same ID already exists in the uniqueObjects
    if (!uniqueObjects[obj[uniqKey]]) {
      // If not, add the object to the uniqueObjects using its ID as the key
      uniqueObjects[obj[uniqKey]] = obj;
    }
  });

  // Convert the uniqueObjects back into an array
  return Object.values(uniqueObjects);
};

export const downloadFile = (
  responseResult: AxiosResponse<any, any>,
  name?: string
) => {
  const fileName =
    responseResult.headers["x-suggested-filename"] ||
    name ||
    "default_filename";
  const fileType = responseResult.headers["content-type"];
  const blob = new Blob([responseResult.data], { type: fileType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);

  link.click();

  URL.revokeObjectURL(url);
};

dayjs.extend(RelativeTime.default);
export const getDateFromNow = (date: dayjs.Dayjs, withoutSuffix?: boolean) =>
  date.fromNow(withoutSuffix);

// export const resampleTo16kHZ = (audioData: any, origSampleRate = 44100) => {
//   // Convert the audio data to a Float32Array
//   const data = new Float32Array(audioData);

//   // Calculate the desired length of the resampled data
//   const targetLength = Math.round(data.length * (16000 / origSampleRate));

//   // Create a new Float32Array for the resampled data
//   const resampledData = new Float32Array(targetLength);

//   // Calculate the spring factor and initialize the first and last values
//   const springFactor = (data.length - 1) / (targetLength - 1);
//   resampledData[0] = data[0];
//   resampledData[targetLength - 1] = data[data.length - 1];

//   // Resample the audio data
//   for (let i = 1; i < targetLength - 1; i++) {
//     const index = i * springFactor;
//     const leftIndex = Math.floor(index).toFixed();
//     const rightIndex = Math.ceil(index).toFixed();
//     const fraction = index - Number(leftIndex);
//     resampledData[i] = data[Number(leftIndex)] + (data[Number(rightIndex)] - data[Number(leftIndex)]) * fraction;
//   }

//   // Return the resampled data
//   return resampledData;
// };

export const stickAddress = (
  country: string,
  region: string,
  city: string,
  street: string,
  app: string
) => {
  const array = [country, region, city, street, app];
  const resultArray = array.filter((el) => el !== undefined && el !== "");

  return resultArray.join(", ");
};

export const unstickAddress = (location: string) => {
  if (!location) {
    return {
      country: "",
      region: "",
      city: "",
      street: "",
      app: "",
    };
  }

  const [country, region, city, street, app] = location.split(", ");

  return {
    country,
    region,
    city,
    street,
    app,
  };
};

export const resampleTo16kHZ = (audioData: any, origSampleRate = 44100) => {
  const data = new Float32Array(audioData);
  const targetLength = Math.round(data.length * (16000 / origSampleRate));
  const resampledData = new Float32Array(targetLength);
  const springFactor = (data.length - 1) / (targetLength - 1);
  resampledData[0] = data[0];
  resampledData[targetLength - 1] = data[data.length - 1];

  for (let i = 1; i < targetLength - 1; i++) {
    const index = i * springFactor;
    const leftIndex = Math.floor(index);
    const rightIndex = Math.ceil(index);
    const fraction = index - leftIndex;
    resampledData[i] =
      data[leftIndex] + (data[rightIndex] - data[leftIndex]) * fraction;
  }

  return resampledData;
};

export const float32ArrayToBase64 = (float32Array: Float32Array): string => {
  const uint8Array = new Uint8Array(float32Array.buffer);

  let binaryString = "";

  for (let i = 0; i < uint8Array.length; i++) {
    binaryString += String.fromCharCode(uint8Array[i]);
  }

  return btoa(binaryString);
};

export const renderLangCodes = (lang: string) => {
  switch (lang) {
    case "English":
      return "en";
    case "Hindi":
      return "hi";
    case "Arabic":
      return "ar";
    case "German":
      return "de";
    case "French":
      return "fr";
    case "Swahili":
      return "sw";
    default:
      return "en";
  }
};

// export const downloadRecordingFile = async (type: any, id = '', title = '', open: any) => {
//   try {
//     const res = await newPoints.getRecordingFile(type, id);
//     const blob = res.data;
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `${title}.${type}`;
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//
//     window.URL.revokeObjectURL(url);
//   } catch (e: any) {
//     open && open({
//       message: e?.status === 404 ? 'Record has no audio file' : 'Something went wrong',
//       type: 'error',
//       description: 'Error',
//     });
//   }
// };

export const getNameInitials = (name: string, count = 2) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  const filtered = initials.replace(/[^a-zA-Z]/g, "");

  return filtered.slice(0, count).toUpperCase();
};

export const formatFileSize = (bytesStr: string): string => {
  const bytesNum = Number(bytesStr);
  if (isNaN(bytesNum) || bytesNum <= 0) {
    return "Введите корректное число";
  }

  const sizes = ["bytes", "KB", "MB"];
  let value = bytesNum;
  let index = 0;

  while (value >= 1024 && index < sizes.length - 1) {
    value /= 1024;
    index++;
  }

  return `${value.toFixed(2)} ${sizes[index]}`;
};
