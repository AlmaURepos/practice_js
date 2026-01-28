import React from 'react';
import { useUser } from '../context/UserContext';

export default function userMenu() {
	const {user, permissions} = useUser();

	return (
		<div>
			<h4>User Menu</h4>
			<p>Name: {user.name}</p>

			<ul>
				{permissions.canView && <li>View Content</li>}
				{permissions.canEdit && <li>Edit Content</li>}
				{permissions.canDelete && <li>Delete Content</li>}
			</ul>
		</div>
	)
}
