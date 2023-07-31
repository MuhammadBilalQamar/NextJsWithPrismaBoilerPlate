import moment from 'moment';

/**
 * @param  {string} str capitalize first letter of the given paramter
 */

export const capitalizeFirstLetter = (str: string) => {
  if (!str) return '';
  return str[0].toUpperCase() + str.slice(1);
};

/**
 * @param  {string} email value of email
 */
// helper function which will validate email address
export const validateEmail = (email: string) => {
  // eslint-disable-next-line no-useless-escape
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
};

/**
 * @param  {string} value value of anyfield
 */
// helper function which will validate if string is empty or not
export const isEmpty = (str: string) => {
  return !str || str?.trim()?.length === 0;
};

export const truncateString = (str: string, num: number) => {
  if (str?.length > num) {
    return str.slice(0, num) + '...';
  } else {
    return str;
  }
};

// helper function which will return random 4 digits string
export const generateRandomKey = () => Math.random().toString(36).slice(2, 6);

// helper function which will return true if device is mobile
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  if (
    window?.innerWidth > 768 &&
    !window.navigator.userAgent.includes('Mobile')
  ) {
    return false;
  }
  return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
};

// helper function which will auto scroll to top of the page
export const scrollToTop = () => {
  if (typeof window !== `undefined`) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
};

// helper function which will return divide array into chunks
export const chunkArray = (myArray: any[], chunk_size: number) => {
  try {
    let results = [];
    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }
    return results;
  } catch (error) {
    return [];
  }
};

// helper function which will return params chunks
export const getParamsChunks = (chunks: any) => {
  try {
    const params: any = {};
    chunks.forEach((item: any) => {
      params[decodeURI(item[0])] = decodeURI(item[1]);
    });
    return params;
  } catch (error) {
    return {};
  }
};

// helper function which will return aws signed url of the file
export const fetchSignedURL = async (file: any) => {
  try {
    const data = { path: file.path };
    const signedUrlResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/s3`,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (signedUrlResponse.ok) {
      const signedResponse = await signedUrlResponse.json();
      return signedResponse.url;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

// helper function which will return formated time (e.g: 1w, 2d, 3h, 4m)
// Example usage:
// const timestamp = 1672900434; // Replace this with your actual timestamp
// const formattedTime = formatPreviousMoment(timestamp);
// console.log(formattedTime); // Output: "1w" (for example, if the comment was made about a week ago)
export const formatPreviousTimestamp = (timestamp: number) => {
  const now = moment();
  const commentTime = moment(timestamp);
  const diffInMinutes = now.diff(commentTime, 'minutes');

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  } else if (diffInMinutes < 24 * 60) {
    const diffInHours = now.diff(commentTime, 'hours');
    return `${diffInHours}h`;
  } else if (diffInMinutes < 7 * 24 * 60) {
    const diffInDays = now.diff(commentTime, 'days');
    return `${diffInDays}d`;
  } else if (diffInMinutes < 365 * 24 * 60) {
    const diffInWeeks = now.diff(commentTime, 'weeks');
    return `${diffInWeeks}w`;
  } else {
    const diffInYears = now.diff(commentTime, 'years');
    return `${diffInYears}y`;
  }
};

// helper function which will return formated time (e.g: 1w, 2d, 3h, 4m)
export const getPreviousDateDiiference = (date: any) => {
  const timestamp = Date.parse(date);
  return formatPreviousTimestamp(timestamp);
};

// helper function which will check if string is url
export const isUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch (error) {
    return false;
  }
};
