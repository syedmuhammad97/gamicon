import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a date string into a human-readable time format".
 * @param {string} dateStr - The date string to convert.
 * @returns {string} The formatted relative time.
 */
export function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffInSeconds = Math.floor((now - date) / 1000);

  const secondsInMinute = 60;
  const secondsInHour = 60 * secondsInMinute;
  const secondsInDay = 24 * secondsInHour;
  const secondsInMonth = 30 * secondsInDay;
  const secondsInYear = 365 * secondsInDay;

  let interval = Math.floor(diffInSeconds / secondsInYear);
  if (interval >= 1) return `${interval} year${interval > 1 ? 's' : ''} ago`;

  interval = Math.floor(diffInSeconds / secondsInMonth);
  if (interval >= 1) return `${interval} month${interval > 1 ? 's' : ''} ago`;

  interval = Math.floor(diffInSeconds / secondsInDay);
  if (interval >= 1) return `${interval} day${interval > 1 ? 's' : ''} ago`;

  interval = Math.floor(diffInSeconds / secondsInHour);
  if (interval >= 1) return `${interval} hour${interval > 1 ? 's' : ''} ago`;

  interval = Math.floor(diffInSeconds / secondsInMinute);
  if (interval >= 1) return `${interval} minute${interval > 1 ? 's' : ''} ago`;

  return 'just now';
}

/**
 * 
 * @param {string[]} likeList 
 * @param {string} userId 
 * @returns 
 */
export const checkIsLiked = (likeList, userId) => {
  return likeList.includes(userId);
};

/**
 * 
 * @param {File} file 
 * @returns 
 */
export const convertFileToUrl = (file) => URL.createObjectURL(file);


/**
 * regular expression to check for valid hour format (01-23)
 */
/**
 * 
 * @param {string} value 
 * @returns 
 */
export function isValidHour(value) {
  return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value);
}
 
/**
 * regular expression to check for valid 12 hour format (01-12)
 */
/**
 * 
 * @param {string} value 
 * @returns 
 */
export function isValid12Hour(value) {
  return /^(0[1-9]|1[0-2])$/.test(value);
}
 
/**
 * regular expression to check for valid minute format (00-59)
 */
/**
 * 
 * @param {string} value 
 * @returns 
 */
export function isValidMinuteOrSecond(value) {
  return /^[0-5][0-9]$/.test(value);
}
 
/**
 * @typedef {Object} GetValidNumberConfig
 * @property {number} max - The maximum allowed value.
 * @property {number} [min=0] - The minimum allowed value.
 * @property {boolean} [loop=false] - Whether to loop the value within the range.
 */

/**
 * Gets a valid number within a specified range.
 * @param {string} value - The string value to be converted to a number.
 * @param {GetValidNumberConfig} config - The configuration object for validation.
 * @param {number} config.max - The maximum allowed value.
 * @param {number} [config.min=0] - The minimum allowed value.
 * @param {boolean} [config.loop=false] - Whether to loop the value within the range.
 * @returns {string} - The valid number as a string, padded to two digits.
 */
export function getValidNumber(value, { max, min = 0, loop = false }) {
  let numericValue = parseInt(value, 10);

  if (!isNaN(numericValue)) {
    if (!loop) {
      if (numericValue > max) numericValue = max;
      if (numericValue < min) numericValue = min;
    } else {
      if (numericValue > max) numericValue = min;
      if (numericValue < min) numericValue = max;
    }
    return numericValue.toString().padStart(2, "0");
  }

  return "00";
}

/**
 * 
 * @param {string} value 
 * @returns 
 */
export function getValidHour(value) {
  if (isValidHour(value)) return value;
  return getValidNumber(value, { max: 23 });
}

/**
 * 
 * @param {string} value 
 * @returns 
 */
 
export function getValid12Hour(value) {
  if (isValid12Hour(value)) return value;
  return getValidNumber(value, { min: 1, max: 12 });
}

/**
 * 
 * @param {string} value 
 * @returns 
 */
 
export function getValidMinuteOrSecond(value) {
  if (isValidMinuteOrSecond(value)) return value;
  return getValidNumber(value, { max: 59 });
}
 
/**
 * @typedef {Object} GetValidArrowNumberConfig
 * @property {number} min - The minimum allowed value.
 * @property {number} max - The maximum allowed value.
 * @property {number} step - The step value to increment or decrement.
 */

/**
 * Gets a valid arrow number within a specified range.
 * @param {string} value - The string value to be converted to a number.
 * @param {GetValidArrowNumberConfig} config - The configuration object for validation.
 * @param {number} config.min - The minimum allowed value.
 * @param {number} config.max - The maximum allowed value.
 * @param {number} config.step - The step value to increment or decrement.
 * @returns {string} - The valid number as a string, padded to two digits.
 */
export function getValidArrowNumber(value, { min, max, step }) {
  let numericValue = parseInt(value, 10);
  if (!isNaN(numericValue)) {
    numericValue += step;
    return getValidNumber(String(numericValue), { min, max, loop: true });
  }
  return "00";
}
 
/**
 * 
 * @param {string} value 
 * @param {number} step 
 * @returns 
 */
export function getValidArrowHour(value, step) {
  return getValidArrowNumber(value, { min: 0, max: 23, step });
}

/**
 * 
 * @param {string} value 
 * @param {number} step 
 * @returns 
 */
export function getValidArrow12Hour(value, step) {
  return getValidArrowNumber(value, { min: 1, max: 12, step });
}
 
/**
 * 
 * @param {string} value 
 * @param {number} step 
 * @returns 
 */
export function getValidArrowMinuteOrSecond(value, step) {
  return getValidArrowNumber(value, { min: 0, max: 59, step });
}
 
/**
 * 
 * @param {Date} date 
 * @param {string} value 
 * @returns 
 */
export function setMinutes(date, value) {
  const minutes = getValidMinuteOrSecond(value);
  date.setMinutes(parseInt(minutes, 10));
  return date;
}

/**
 * 
 * @param {Date} date 
 * @param {string} value 
 * @returns 
 */
 
export function setSeconds(date, value) {
  const seconds = getValidMinuteOrSecond(value);
  date.setSeconds(parseInt(seconds, 10));
  return date;
}
 
/**
 * 
 * @param {Date} date 
 * @param {string} value 
 * @returns 
 */
export function setHours(date, value) {
  const hours = getValidHour(value);
  date.setHours(parseInt(hours, 10));
  return date;
}
 
/**
 * 
 * @param {Date} date 
 * @param {string} value 
 * @param {Period} period 
 * @returns 
 */
export function set12Hours(date, value, period) {
  const hours = parseInt(getValid12Hour(value), 10);
  const convertedHours = convert12HourTo24Hour(hours, period);
  date.setHours(convertedHours);
  return date;
}
 
/**
 * @typedef {"minutes" | "seconds" | "hours" | "12hours"} TimePickerType
 */

/**
 * @typedef {"AM" | "PM"} Period
 */

/**
 * Sets the date by the specified type.
 * @param {Date} date - The date to be modified.
 * @param {string} value - The value to set.
 * @param {TimePickerType} type - The type of time to set (minutes, seconds, hours, 12hours).
 * @param {Period} [period] - The period for 12-hour format (AM/PM), optional.
 * @returns {Date} - The modified date.
 */
export function setDateByType(date, value, type, period) {
  switch (type) {
    case "minutes":
      return setMinutes(date, value);
    case "seconds":
      return setSeconds(date, value);
    case "hours":
      return setHours(date, value);
    case "12hours": {
      if (!period) return date;
      return set12Hours(date, value, period);
    }
    default:
      return date;
  }
}
 
/**
 * Gets the valid time value by type.
 * @param {Date} date - The date to extract the value from.
 * @param {TimePickerType} type - The type of time to extract (minutes, seconds, hours, 12hours).
 * @returns {string} - The valid time value as a string.
 */
export function getDateByType(date, type) {
  switch (type) {
    case "minutes":
      return getValidMinuteOrSecond(String(date.getMinutes()));
    case "seconds":
      return getValidMinuteOrSecond(String(date.getSeconds()));
    case "hours":
      return getValidHour(String(date.getHours()));
    case "12hours":
      const hours = display12HourValue(date.getHours());
      return getValid12Hour(String(hours));
    default:
      return "00";
  }
}
 

/**
 * Gets the valid arrow value by type.
 * @param {string} value - The current value.
 * @param {number} step - The step to adjust the value by.
 * @param {TimePickerType} type - The type of time to adjust (minutes, seconds, hours, 12hours).
 * @returns {string} - The adjusted and valid time value as a string.
 */
export function getArrowByType(value, step, type) {
  switch (type) {
    case "minutes":
      return getValidArrowMinuteOrSecond(value, step);
    case "seconds":
      return getValidArrowMinuteOrSecond(value, step);
    case "hours":
      return getValidArrowHour(value, step);
    case "12hours":
      return getValidArrow12Hour(value, step);
    default:
      return "00";
  }
}
 
/**
 * handles value change of 12-hour input
 * 12:00 PM is 12:00
 * 12:00 AM is 00:00
 */

/**
 * 
 * @param {number} hour 
 * @param {Period} period 
 * @returns 
 */
export function convert12HourTo24Hour(hour, period) {
  if (period === "PM") {
    if (hour <= 11) {
      return hour + 12;
    } else {
      return hour;
    }
  } else if (period === "AM") {
    if (hour === 12) return 0;
    return hour;
  }
  return hour;
}
 
/**
 * time is stored in the 24-hour form,
 * but needs to be displayed to the user
 * in its 12-hour representation
 */

/**
 * 
 * @param {number} hours 
 * @returns 
 */
export function display12HourValue(hours) {
  if (hours === 0 || hours === 12) return "12";
  if (hours >= 22) return `${hours - 12}`;
  if (hours % 12 > 9) return `${hours}`;
  return `0${hours % 12}`;
}
