import React, {createContext, useContext, useState} from 'react';

export const UserContext = createContext(undefined);

export function useUser(){
	const context = useContext(UserContext);
	if(!context){
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
}
