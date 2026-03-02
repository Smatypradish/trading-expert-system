// Authentication Context - Manages user state across the app
import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);

    // Sign up with email/password
    async function signup(email, password, displayName) {
        const result = await createUserWithEmailAndPassword(auth, email, password);

        // Create user profile in Firestore
        await setDoc(doc(db, 'users', result.user.uid), {
            email,
            displayName,
            createdAt: new Date().toISOString(),
            watchlist: ['bitcoin', 'ethereum', 'binancecoin', 'solana'],
            riskLevel: 5
        });

        return result;
    }

    // Login with email/password
    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // Login with Google
    async function loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        // Check if user profile exists, if not create one
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', result.user.uid), {
                email: result.user.email,
                displayName: result.user.displayName,
                createdAt: new Date().toISOString(),
                watchlist: ['bitcoin', 'ethereum', 'binancecoin', 'solana'],
                riskLevel: 5
            });
        }

        return result;
    }

    // Logout
    function logout() {
        return signOut(auth);
    }

    // Get user profile from Firestore
    async function getUserProfile(uid) {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            return userDoc.data();
        }
        return null;
    }

    // Update user watchlist
    async function updateWatchlist(watchlist) {
        if (currentUser) {
            await setDoc(doc(db, 'users', currentUser.uid), { watchlist }, { merge: true });
            setUserProfile(prev => ({ ...prev, watchlist }));
        }
    }

    // Update risk level
    async function updateRiskLevel(riskLevel) {
        if (currentUser) {
            await setDoc(doc(db, 'users', currentUser.uid), { riskLevel }, { merge: true });
            setUserProfile(prev => ({ ...prev, riskLevel }));
        }
    }

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                const profile = await getUserProfile(user.uid);
                setUserProfile(profile);
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userProfile,
        signup,
        login,
        loginWithGoogle,
        logout,
        updateWatchlist,
        updateRiskLevel
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
