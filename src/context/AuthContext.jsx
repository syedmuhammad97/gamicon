// @ts-check
/// <reference path="../types/index.d.ts" />


import { getCurrentUser } from '../lib/appwrite/api';
import React from 'react';
import {createContext, useContext, useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';

export const INITIAL_USER = {
    id: '',
    name: '',
    username: '',
    email: '',
    imageURL: '',
    bio: '',
    points: 0,
    stars: 0,
    roleType: ''
};

/**
 * @typedef {Object} InitialState
 * @typedef {import('../types').IContextType} IContextType
 * @property {Object} user - The user object.
 * @property {boolean} isAuthenticated - Authentication status.
 * @property {Function} setUser - Function to set the user.
 * @property {Function} setIsAuthenticated - Function to set authentication status.
 * @property {() => Promise<boolean>} checkAuthUser - Function to check authentication status.
 */

/** 
 * Initial state for the auth context.
 * @type {IContextType} 
 */
const INITIAL_STATE = {
    user: INITIAL_USER,
    isAuthenticated: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    
    /**
     * Check if the user is authenticated.
     * @returns {Promise<boolean>} A promise that resolves to false.
     */
    checkAuthUser: async () => false,
  }

  
/**
 * Auth context for the application.
 * @type {React.Context<IContextType>}
 */

const AuthContext = createContext(INITIAL_STATE);

/**
 * @typedef {import('../types').IUser} IUser
 * @typedef {import('react').ReactNode} ReactNode
 */

/**
 * AuthProvider component to provide authentication context.
 * @param {{children: ReactNode}} props - The component props.
 * @returns {JSX.Element} The AuthProvider component.
 */

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(INITIAL_USER);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /**
   * Check if the user is authenticated.
   * @returns {Promise<boolean>} A promise that resolves to true if authenticated, else false.
   */
    
    const checkAuthUser = async () => {
        try {
            const currentAccount = await getCurrentUser();

            if(currentAccount){
                setUser({
                   id: currentAccount.$id,
                   name: currentAccount.name, 
                   username: currentAccount.username,
                   email: currentAccount.email,
                   imageURL: currentAccount.imageURL,
                   bio: currentAccount.bio,
                   points: currentAccount.points,
                   stars: currentAccount.stars,
                   roleType: currentAccount.roleType
                })

                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        if(
            localStorage.getItem('cookieFallback') === '[]' || 
            localStorage.getItem('cookieFallback') === null
        ) navigate('/sign-in');

        checkAuthUser();
    }, []);

    const value = {
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        checkAuthUser
    }
    
    return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);