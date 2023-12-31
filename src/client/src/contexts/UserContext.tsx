import React, { createContext, useState } from 'react';
import jwt_decode from 'jwt-decode';

interface UserContextProps {
    children: React.ReactNode;
}

interface DecodedToken {
    username: string;
    exp: number;
}

interface UserContextValue {
    isAuthenticated: boolean;
    username?: string;
    login: () => void;
    logout: () => void;
}

export const UserContext = createContext<UserContextValue>({
    isAuthenticated: false,
    login: () => { },
    logout: () => { },
});

export function UserProvider({ children }: UserContextProps) {
    const [isAuthenticated, setUserLoggedIn] = useState<boolean>(isLoggedIn().loggedIn);
    const [username, setUsername] = useState<string | undefined>(isLoggedIn().username);

    function isLoggedIn() {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) {
            return { loggedIn: false, username: undefined }; // Token does not exist
        }

        const decodedToken = jwt_decode(token) as DecodedToken;
        const currentTime = Date.now() / 1000;
        const loggedIn = decodedToken.exp > currentTime;
        const username = decodedToken.username;

        return { loggedIn, username };
    }

    const login = () => {
        setUserLoggedIn(true);
        setUsername(isLoggedIn().username);
    };

    const logout = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setUserLoggedIn(false);
        setUsername(undefined);
    };


    return (
        <UserContext.Provider value={{ isAuthenticated, username, login, logout }}>
            {children}
        </UserContext.Provider>
    );
}
