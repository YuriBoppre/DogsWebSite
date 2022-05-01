import React from 'react';
import { TOKEN_POST, USER_GET } from './api';

export const UserContext = React.createContext();

export const UserStorage = ({ children }) => {
    const [data, setData] = React.useState(null),
        [login, setLogin] = React.useState(null),
        [loading, setLoading] = React.useState(false),
        [error, setError] = React.useState(null);

    async function getUser(token) {
        const {url, options} = USER_GET(token),
            response = await fetch(url, options),
            json = await response.json();
            
        setData(json);
        setLogin(true);
    }

    async function userLogin(username, password) {
        const {url, options} = TOKEN_POST({username, password}),
            tokenRes = await fetch(url, options),
            {token} = await tokenRes.json();

        window.localStorage.setItem('token', token);
        getUser(token);
    }
    return <UserContext.Provider value={{ userLogin, data }}>
            {children}
        </UserContext.Provider>
}