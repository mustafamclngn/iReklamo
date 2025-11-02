import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    // Initialize auth from localStorage on mount (only if persist is true)
    const [auth, setAuth] = useState(() => {
        const persistValue = localStorage.getItem("persist");
        const shouldPersist = persistValue ? JSON.parse(persistValue) : false;
        
        if (shouldPersist) {
            try {
                const storedAuth = localStorage.getItem("auth");
                if (storedAuth) {
                    const parsedAuth = JSON.parse(storedAuth);
                    console.log("Auth loaded from localStorage:", parsedAuth);
                    return parsedAuth;
                }
            } catch (error) {
                console.error("Error parsing stored auth:", error);
            }
        }
        return {};
    });

    const [persist, setPersist] = useState(() => {
        try {
            const stored = localStorage.getItem("persist");
            return stored ? JSON.parse(stored) : false;
        } catch (error) {
            console.error("Error parsing persist value:", error);
            return false;
        }
    });

    // Save auth to localStorage whenever it changes (only if persist is true)
    useEffect(() => {
        if (persist) {
            if (auth && Object.keys(auth).length > 0) {
                localStorage.setItem("auth", JSON.stringify(auth));
                console.log("Auth saved to localStorage:", auth);
            }
        } else {
            // If persist is false, remove auth from localStorage
            localStorage.removeItem("auth");
        }
    }, [auth, persist]);

    // Save persist preference to localStorage
    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist));
    }, [persist]);

    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;