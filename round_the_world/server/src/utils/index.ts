import localStorage from './localStorage';
import { evaluate } from 'mathjs';
import moment from 'moment';
export const arrayFull = (value: any) => {
  return Array.isArray(value) && value.length;
};

export const getIntervalHour = (startDate: any, endDate: any) => {
  return moment(new Date(endDate)).diff(moment(new Date(startDate)), 'hours');
};

export const getIntervalMinute = (startDate: any, endDate: any) => {
  var ms = new Date(endDate).getTime() - new Date(startDate).getTime();
  if (ms < 0) return 0;
  return Math.floor(ms / 1000 / 60 / 60 / 60);
};

export const getTime = (time: number) => {
  const h = Math.floor(time / 60 / 60);
  const m = Math.floor((time - h * 60 * 60) / 60);

  return {
    text: `${h >= 10 ? h : '0' + h}小时${m >= 10 ? m : '0' + m}分`,
    m,
    h,
  };
};

export const getTimeView = (startDate: any, endDate: any) => {
  const time =
    new Date(`${endDate}`).getTime() - new Date(`${startDate}`).getTime();
  return getTime(time / 1000);
};

export const snakeShapedConnectionFlat = (
  twoDimensionalArray: Array<any[]>
) => {
  const aSet = new Set();
  twoDimensionalArray.forEach((item: any[]) => {
    arrayFull(item) &&
      item.forEach((_item: any) => {
        aSet.add(_item);
      });
  });
  return [...aSet];
};

export const getMH = (time: number) => {
  const H = time / 3600;
  const M = time % 60;
  return {
    H,
    M,
  };
};

export const calculateTimeProgress = (endTime: string, takeTime: number) => {
  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  if (now >= end) return 1;
  return Math.floor((end - now) / (takeTime * 1000)).toFixed(2);
};

export const getArrayKeysFlatMap = (key: string, array: any[]) => {
  const result: any[] = [];
  let current: any[] = [];
  if (key && arrayFull(array)) {
    array.forEach((item: any) => {
      current = item[key];
      arrayFull(current) &&
        current.forEach((_item: any) => {
          result.push({ ..._item, parentId: item.id });
        });
    });
  }
  return result;
};

export const selectKeysFromObjectAsArray = (
  array: string[],
  object: any = {}
) => {
  const result: any[] = [];
  if (!object) return result;
  arrayFull(array) &&
    array.forEach((key: string) => {
      result.push(object[key]);
    });
  return result;
};

export const getZhName = (val: string, cityList: any[]): string => {
  let name: string = '';
  if (arrayFull(cityList)) {
    name =
      cityList.find((item: any) => {
        return item?.cityname_en === val;
      })?.cityname_zh || '';
  }
  return name;
};

export const getPxToRem = (px: number) => {
  return evaluate(`${px || 0} / 144`);
};

export const addZero = (num: number) => {
  return num >= 10 ? num : '0' + num;
};

export const getAttr = (name: string) => {
  return (
    window.document.getElementById(`${name}`)?.getAttribute(`${name}`) || ''
  );
};

export const setAttr = (name: string, value: string) => {
  window.document.getElementById(`${name}`)?.setAttribute(`${name}`, value);
};

export const setCookie = (key: string, val: string, time: number) => {
  const date = new Date();
  date.setDate(date.getDate() + time);
  document.cookie = `${key}=${val};expires=${date}`;
};

export const getCookie = (key: string) => {
  const arr = document.cookie.split('; ');
  for (let i = 0; i < arr.length; i++) {
    let newArr = arr[i].split('=');
    if (newArr[0] == key) {
      return newArr[1];
    }
  }
};

export const removeCookie = (key: string) => {
  setCookie(key, '', -1);
};

export const clearCookie = () => {
  const arr = document.cookie.split('; ');
  for (let i = 0; i < arr.length; i++) {
    let newArr = arr[i].split('=');
    setCookie(newArr[0], '', -1);
  }
};

export { localStorage };
