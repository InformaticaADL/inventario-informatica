"use client";
import { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

const AutoLogout = () => {
    const { logout, user } = useAuth();
    const timerRef = useRef(null);

    // 10 minutes in milliseconds
    const INACTIVITY_LIMIT = 10 * 60 * 1000;

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            console.log("Inactivity limit reached. Logging out...");
            logout();
        }, INACTIVITY_LIMIT);
    };

    useEffect(() => {
        // Events to listen for
        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

        // Only activate if we think there is a user (though useAuth might check cookies too)
        // We can just run it always if mounted in Dashboard, or check for user existence
        const handleActivity = () => {
            resetTimer();
        };

        // Initialize timer
        resetTimer();

        // Add event listeners
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Cleanup
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [logout]); // Removed 'user' dependency to avoid re-binding on every user state change unless necessary

    return null; // This component renders nothing
};

export default AutoLogout;
