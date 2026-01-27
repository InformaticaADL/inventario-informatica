import React from 'react';
import "../globals.css";
import AutoLogout from '../../components/AutoLogout';
import MainLayout from '../../components/MainLayout';

export default function DashboardLayout({ children }) {
    return (
        <MainLayout>
            <AutoLogout />
            {children}
        </MainLayout>
    );
}
