import React from 'react';
import { useUser} from  '../context/UserContext';
import Header from './Header'

export default function Dashboard() {
    const {user} = useUser();

    return(
        <div>
            <h2>Dashboard</h2>
            <p>Welcome, {user.name}!</p>

            <Header/>
        </div>
    )
}
