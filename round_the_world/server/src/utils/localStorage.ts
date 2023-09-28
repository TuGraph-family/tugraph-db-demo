export class Storage {
  constructor() {}

  /**
   * 获取
   * @param {String} key
   * @returns
   */
  getStorage(key: string) {
    if (!key) {
      console.error(new Error('function getStorage params is undefined'));
      return;
    }

    const value: unknown = window.localStorage.getItem(key);
    try {
      const object = JSON.parse(`${value}`);
      return object;
    } catch (error) {
      return value;
    }
  }

  /**
   * 设置
   * @param {String} key
   * @param {any} value
   * @returns {any}
   */
  setStorage(key: string, value: unknown) {
    if (!key && !value) {
      console.error(new Error('function setStorage params is undefined'));
      return;
    }

    if (typeof value === 'object') {
      const jsonString = JSON.stringify(value);
      window.localStorage.setItem(key, jsonString);
    } else {
      window.localStorage.setItem(key, `${value}`);
    }
  }

  /**
   * 移除
   * @param {String} key
   * @returns
   */
  removeStorage(key: string) {
    if (!key) {
      console.error(new Error('function removeStorage params is undefined'));
      return;
    }
    window.localStorage.removeItem(key);
  }

  /**
   * 清除
   */
  clearStorage() {
    window.localStorage.clear();
  }
}

const storage = new Storage();

export default storage;
