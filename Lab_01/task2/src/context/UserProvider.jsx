import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { UserContext } from './UserContext';

export function UserProvider({children}) {
	const [user, setUser] = useState(
		{name: 'aidos',
		email: 'amangeldiaidos660@gmail.com',
		role: 'admin'
		}
	);

	const [permissions, setPermissions] = useState(
		{
			canEdit: true,
			canDelete: true,
			canView: true
		}
	);

	const [theme, setTheme] = useState({
		darkMode: false,
		fontSize: 'medium'
	})

	const toggleDarkMode = () => {
		setTheme((prevTheme) => ({
			...prevTheme,
			darkMode: !prevTheme.darkMode
		}));
	}

	const value={
		user,permissions,theme,toggleDarkMode
	}

	return(
		<UserContext.Provider value={value}>
			{children}
		</UserContext.Provider>
	)
}
