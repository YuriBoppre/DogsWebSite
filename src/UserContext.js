import React from 'react';
import { TOKEN_POST, TOKEN_VALIDATE_POST, USER_GET } from './api';
import { useNavigate } from 'react-router-dom';
import StorageService from './services/StorageService';
import { ROUTES, ERROR_MESSAGES } from './constants';

export const UserContext = React.createContext();

export const UserStorage = ({ children }) => {
  const [data, setData] = React.useState(null),
    [login, setLogin] = React.useState(null),
    [loading, setLoading] = React.useState(false),
    [error, setError] = React.useState(null),
    navigate = useNavigate();

  const userLogout = React.useCallback(
    async function () {
      setData(null);
      setError(null);
      setLoading(false);
      setLogin(false);
      StorageService.removeToken();
      navigate(ROUTES.LOGIN);
    },
    [navigate],
  );

  async function getUser(token) {
    try {
      const { url, options } = USER_GET(token),
        response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
      }

      const json = await response.json();

      setData(json);
      setLogin(true);
    } catch (err) {
      setError(err.message || ERROR_MESSAGES.NETWORK_ERROR);
      setLogin(false);
      throw err;
    }
  }

  async function userLogin(username, password) {
    try {
      setError(null);
      setLoading(true);

      const { url, options } = TOKEN_POST({ username, password }),
        tokenRes = await fetch(url, options);

      if (!tokenRes.ok) {
        throw new Error(`Error: ${tokenRes.statusText}`);
      }

      const { token } = await tokenRes.json();

      StorageService.setToken(token);

      await getUser(token);
      navigate(ROUTES.ACCOUNT);
    } catch (err) {
      setError(err.message);
      setLogin(false);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    async function autoLogin() {
      const token = StorageService.getToken();

      if (token) {
        try {
          setError(null);
          setLoading(true);
          const { url, options } = TOKEN_VALIDATE_POST(token);
          const response = await fetch(url, options);

          if (!response.ok) {
            throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
          }

          await getUser(token);
        } catch (err) {
          userLogout();
        } finally {
          setLoading(false);
        }
      } else {
        setLogin(false);
      }
    }
    autoLogin();
  }, [userLogout]);

  return (
    <UserContext.Provider
      value={{ userLogin, userLogout, data, error, loading, login }}
    >
      {children}
    </UserContext.Provider>
  );
};
