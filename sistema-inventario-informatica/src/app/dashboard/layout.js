
import React from 'react';
import "../globals.css";
import AutoLogout from '../../components/AutoLogout';

export default function DashboardLayout({ children }) {
    return (
        <>
            <AutoLogout />
            {children}
        </>
    );
}
