import React, { createContext, useEffect, useState} from "react";
import {auth} from './configureFirebase'

interface ContextProps {
    user: any;
}

export const AuthContext = createContext<ContextProps>({ user: undefined });

export function AuthProvider({ children }: {children: any} ){
    const [user, setUser] = useState<any>();

    useEffect(() => {
        auth.onAuthStateChanged(user => setUser(user));
    }, []);

    return (<AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>)
};
