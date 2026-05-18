import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
// ─── DEFINE WHAT AUTH CONTEXT CONTAINS ───────────────────────
interface AuthContextType {
    user: User | null;          // Currently logged-in user (or null)
    token: string | null;       // JWT token (or null if not logged in)
    login: (token: string, user: User) => void;  // Call this on login
    logout: () => void;         // Call this on logout
    isLoggedIn: boolean;        // true if user is logged in
}

// ─── CREATE CONTEXT ───────────────────────────────────────────
// This is like creating an empty box
// We'll fill it with data in AuthProvider below
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── AUTH PROVIDER ────────────────────────────────────────────
// This wraps your ENTIRE app
// Any component inside can access auth data
export const AuthProvider = ({ children }: { children: ReactNode }) => {

    // State: current user and token
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // ── CHECK IF ALREADY LOGGED IN ──────────────────────────────
    // When app loads, check localStorage for saved login
    // This keeps user logged in after page refresh
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser)); // Convert string back to object
        }
    }, []); // [] = run only once when app first loads

    // ── LOGIN FUNCTION ──────────────────────────────────────────
    // Called after successful signup or login
    const login = (newToken: string, newUser: User) => {
        // Save to React state (for current session)
        setToken(newToken);
        setUser(newUser);

        // Save to localStorage (persists after page refresh)
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        // JSON.stringify converts object to string for storage
    };

    // ── LOGOUT FUNCTION ─────────────────────────────────────────
    // Called when user clicks Logout
    const logout = () => {
        // Clear React state
        setToken(null);
        setUser(null);

        // Clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isLoggedIn: !!token, // !! converts string to boolean
            // !!null = false, !!"abc" = true
        }}>
            {children} {/* Renders everything inside <AuthProvider> */}
        </AuthContext.Provider>
    );
};

// ─── CUSTOM HOOK ──────────────────────────────────────────────
// Use this in ANY component to access auth data
// Instead of: const context = useContext(AuthContext)
// Just write: const { user, login, logout } = useAuth()
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside <AuthProvider>');
    }
    return context;
};