import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // STRICT DEMO AUTH CHECK
        const demoAuth = localStorage.getItem('kdia_auth');
        if (demoAuth) {
            try {
                const parsed = JSON.parse(demoAuth);
                if (parsed.authenticated) {
                    // Restore session from demo auth
                    // We need to map role to the user object expected by the app
                    // or just trust the components handle it.
                    // Let's create a mock user object based on the role to satisfy the app's expectations
                    const mockUser = {
                        role: parsed.role,
                        fullName: 'Demo User',
                        email: 'demo@kdia.com',
                        approvalStatus: 'APPROVED',
                        isActive: 1,
                        // Add other required fields if any
                    };
                    setUser(mockUser);
                    setToken('demo-token');
                    setLoading(false);
                    return;
                }
            } catch (e) {
                console.error('Failed to parse demo auth', e);
            }
        }

        if (token) {
            // Standard Token Check (Legacy/Real Auth)
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            }
        }
        setLoading(false);
    }, [token]);

    const login = (userData, userToken) => {
        localStorage.removeItem('kdia_auth'); // Clear any conflicting demo session
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const loginDemo = (role) => {
        // STRICT DEMO LOGIN BYPASS
        const demoAuth = {
            authenticated: true,
            role: role,
            mode: 'demo'
        };
        localStorage.setItem('kdia_auth', JSON.stringify(demoAuth));

        // Update state immediately
        const mockUser = {
            role: role,
            fullName: 'Demo User',
            email: 'demo@kdia.com',
            approvalStatus: 'APPROVED'
        };
        setUser(mockUser);
        setToken('demo-token');
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('kdia_auth'); // Clear demo auth
    };

    return (
        <AuthContext.Provider value={{ user, token, login, loginDemo, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
