import React from 'react';
import { UserProvider } from './context/UserProvider';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
    return (
        <UserProvider>
            <Dashboard/>
        </UserProvider>)}

