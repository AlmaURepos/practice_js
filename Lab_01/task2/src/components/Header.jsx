import React from 'react';
import { useUser } from '../context/UserContext';
import UserMenu from './UserMenu';

export default function Header() {
	const {user, theme, toggleDarkMode} = useUser();

	return(
		<div>
			<h3>Header</h3>
			<p>User: {user.name} ({user.role})</p>
			<button onClick={toggleDarkMode}>
				Switch to {theme.darkMode ? 'Light' : 'Dark'} Mode
			</button>

			<UserMenu/>
		</div>
	)
}
