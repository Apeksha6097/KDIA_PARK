import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import {
    authenticateDemoUser,
    findDemoUserByRole,
    getDashboardPath,
    ROLES,
} from '../config/rbac';

const AuthContext = createContext();

const STORAGE_KEYS = {
    token: 'token',
    user: 'user',
    role: 'kdia_user_role',
    demoAuth: 'kdia_auth',
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem(STORAGE_KEYS.token));
    const [loading, setLoading] = useState(true);

    const persistSession = useCallback((userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem(STORAGE_KEYS.token, userToken);
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));
        localStorage.setItem(STORAGE_KEYS.role, userData.role);
        localStorage.removeItem(STORAGE_KEYS.demoAuth);
    }, []);

    const restoreSession = useCallback(() => {
        const demoAuth = localStorage.getItem(STORAGE_KEYS.demoAuth);
        if (demoAuth) {
            try {
                const parsed = JSON.parse(demoAuth);
                if (parsed.authenticated && parsed.user) {
                    setUser(parsed.user);
                    setToken(parsed.token || 'demo-token');
                    setLoading(false);
                    return;
                }
            } catch (e) {
                console.error('Failed to parse demo auth', e);
            }
        }

        const storedToken = localStorage.getItem(STORAGE_KEYS.token);
        const storedUser = localStorage.getItem(STORAGE_KEYS.user);
        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setToken(storedToken);
            } catch (e) {
                console.error('Failed to parse stored user', e);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    const login = (userData, userToken) => {
        persistSession(userData, userToken);
    };

    const loginWithCredentials = (loginId, password) => {
        const result = authenticateDemoUser(loginId, password);
        if (!result.success) {
            return result;
        }
        login(result.user, result.token);
        return result;
    };

    const loginDemo = (role) => {
        const demoUser = findDemoUserByRole(role);
        if (!demoUser) {
            throw new Error(`No demo user for role: ${role}`);
        }
        const { password: _pw, ...userData } = demoUser;
        const userToken = `demo-jwt-${role}-${Date.now()}`;
        const sessionUser = {
            ...userData,
            approvalStatus: userData.approvalStatus || 'APPROVED',
            approval_status: userData.approval_status || 'APPROVED',
            isActive: 1,
        };

        localStorage.setItem(
            STORAGE_KEYS.demoAuth,
            JSON.stringify({ authenticated: true, role, user: sessionUser, token: userToken, mode: 'demo' })
        );
        persistSession(sessionUser, userToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(STORAGE_KEYS.token);
        localStorage.removeItem(STORAGE_KEYS.user);
        localStorage.removeItem(STORAGE_KEYS.role);
        localStorage.removeItem(STORAGE_KEYS.demoAuth);
    };

    const value = {
        user,
        token,
        role: user?.role || localStorage.getItem(STORAGE_KEYS.role),
        login,
        loginWithCredentials,
        loginDemo,
        logout,
        loading,
        getDashboardPath: () => getDashboardPath(user?.role),
        isSuperAdmin: user?.role === ROLES.SUPER_ADMIN,
        isAdmin: user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
