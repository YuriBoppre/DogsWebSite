import { STORAGE_KEYS } from '../constants';

class StorageService {
  static getToken() {
    try {
      return window.localStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      return null;
    }
  }

  static setToken(token) {
    try {
      if (!token) {
        throw new Error('Token não pode ser vazio');
      }
      window.localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      throw error;
    }
  }

  static removeToken() {
    try {
      window.localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      throw error;
    }
  }

  static hasToken() {
    return !!this.getToken();
  }
}

export default StorageService;

