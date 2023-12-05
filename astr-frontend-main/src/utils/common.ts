import numbro from "numbro";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

BigNumber.config({
  // DECIMAL_PLACES: 100,
  // POW_PRECISION: 100,
  EXPONENTIAL_AT: 99,
});

/**
 * portal 错误信息翻译功能
 * @param e 错误信息
 * @param market 市场，用于拿去其中提示的市场
 * @returns 提示文字
 */
export const portalErrorTranslation = (e: any) => {
  console.log(e);
  const reason = e?.reason ? "execution reverted:" + e?.reason : "";
  const errMessage =
    reason || e?.message || e?.error?.message || e || "Unknown error";
  return errMessage;
};

// format address
export const formatAddress = (address?: string) => {
  return address
    ? address.replace(address?.slice(5, address.length - 3), "...")
    : "--";
};

// toWei
export const toWei = (value?: string | number) => {
  return new BigNumber(value || "").times(new BigNumber(10).pow(18));
};
// fromWei
export const fromWei = (value?: string | number) => {
  return new BigNumber(value || "").div(new BigNumber(10).pow(18));
};

// from token's address and decimals
export const toTokenDecimals = (value: string | number, decimals: number) => {
  return new BigNumber(value || "").times(new BigNumber(10).pow(decimals));
};
// to token's address and decimals
export const fromTokenDecimals = (value: string | number, decimals: number) => {
  return new BigNumber(value || "").div(new BigNumber(10).pow(decimals));
};

export const formatTokenNumber = (value?: string) => {
  return numbro(value || 0).format({
    average: true,
    trimMantissa: true,
    mantissa: 4,
    roundingFunction(num: number) {
      return Math.floor(num);
    },
  });
};

export const getTimeDiff = (startTime: number, endTime: number) => {
  // 计算时间差（以毫秒为单位）
  const timeDiff = endTime - startTime;

  // 将毫秒转换为天、小时、分钟和秒
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // 计算剩余的小时、分钟和秒
  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  // 返回结果
  return {
    days: days,
    hours: remainingHours,
    minutes: remainingMinutes,
    seconds: remainingSeconds,
    isInTime: timeDiff > 0,
  };
};

export const getTimeDiffString = ({
  days,
  hours,
  minutes,
  seconds,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""}  ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}  ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""}  ago`;
  }
  return `${seconds} second${seconds > 1 ? "s" : ""}  ago`;
};

export const getDiscountPercent = (oldValue: string, value: string) => {
  const result = new BigNumber(value)
    ?.div(oldValue)
    ?.multipliedBy(100)
    ?.toString();

  return result;
};

export const formatClgTable = (label: string, value: any) => {
  return {
    label,
    value: typeof value === "string" ? value : JSON.stringify(value),
  };
};

// 千分位
export const getThousandsValue = (value: number | string) => {
  const val = Number(value);
  return val.toLocaleString("en-us");
};

/**
 * portal 倒计时
 * @param targetTime 目标时间的时间戳，13位字符串或数字
 * @returns 天、小时、分钟、秒钟的数组
 */
export const getCountdown = (targetTime: number) => {
  try {
    const len = String(targetTime);
    dayjs.extend(duration);
    const now =
      len.length === 10 ? dayjs(targetTime * 1000) : dayjs(targetTime);
    // 手动计算两个时间的差值
    const diffInMs = dayjs(targetTime * 1000).diff(dayjs()); // 毫秒数
    const diff = dayjs.duration(diffInMs); // duration对象
    if (now.diff(dayjs(), "second", true) <= 0) return;
    const day = diff.days();
    const hour = diff.hours() < 10 ? `0${diff.hours()}` : diff.hours();
    const min = diff.minutes() < 10 ? `0${diff.minutes()}` : diff.minutes();
    const sen = diff.seconds() < 10 ? `0${diff.seconds()}` : diff.seconds();
    return [day, hour, min, sen];
  } catch (err) {
    console.log(err);
  }
};

export function cutZero(old: string) {
  const regexp = /(?:\.0*|(\.\d+?)0+)$/;
  return old.replace(regexp, "$1");
}

export const formatValue = (
  value?: string | BigNumber,
  isFromWei = false,
  decimalPlaces = 4
) => {
  if (value instanceof BigNumber) {
    value = isNaN(value.toNumber()) ? "" : value;
  }
  return value
    ? new BigNumber(value).gt(0)
      ? new BigNumber(value).gt(0.0001)
        ? cutZero(
            new BigNumber(value)
              .div(isFromWei ? 10 ** 18 : 1)
              .toFormat(decimalPlaces)
          )
        : "<0.0001"
      : "0"
    : "--";
};

/**
 *
 * @param text 需要检查的值
 * @param decimals 需要保留的最大精度
 * @returns
 */
export const checkText = (text: string | number, decimals = 18) => {
  text = text.toString();
  const numArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
  const lastLen = text.charAt(text.length - 1);
  if (numArr.indexOf(lastLen) === -1) {
    return text.slice(0, text.length - 1);
  }
  if (text.length > 1 && Number(text[0]) === 0 && text[1] !== ".") {
    return Number(text);
  }
  // 小数位长度不能超过精度
  const dotLength = text.split(".")[1]?.length;
  return isNaN(Number(text))
    ? NumberCheck(text, decimals)
    : dotLength > decimals
    ? cutZero(new BigNumber(text).toFixed(decimals, 1).toString())
    : text;
};

/**
 * 检测替换为符合标准的数字
 * @param num
 * @param length 保留的最长小数位
 * @returns
 */
export const NumberCheck = (num: any, length = 6) => {
  if (typeof num === "undefined" || num === "") {
    return "";
  }
  let str: string = typeof num === "string" ? num : num.toString();
  const len1 = str.substr(0, 1);
  const len2 = str.substr(1, 1);
  //如果第一位是0，第二位不是点，就用数字把点替换掉
  if (str.length > 1 && len1 === "0" && len2 !== ".") {
    str = str.substr(1, 1);
  }
  //第一位不能是.
  if (len1 === ".") {
    str = "";
  }
  //限制只能输入一个小数点
  if (str.indexOf(".") !== -1) {
    const str_ = str.substr(str.indexOf(".") + 1);
    if (str_.indexOf(".") !== -1) {
      str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
    }
  }
  //正则替换，保留数字和小数点
  str = str.replace(/[^\d^.]+/g, "");
  //如果需要保留小数点后6位
  str = str.replace(/\.\d\d$/, "");
  const dotNum = str.split(".").length > 1 ? str.split(".")[1].length : 0;
  if (dotNum > length) {
    str = new BigNumber(str).toFixed(length, 1).toString();
  }
  return str.toString();
};

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
