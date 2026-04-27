import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '₱'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
    const [userData, setUserData] = useState(false)
    const [firebaseUser, setFirebaseUser] = useState(null)

    // Getting Doctors using API
    const getDoctosData = async () => {
        setLoading(true)
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/list')
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }

    }

    // Getting User Profile using API
    const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    useEffect(() => {
        getDoctosData()
    }, [])  // Empty dependency array means it runs once on mount

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [token]) // Added dependency array to re-run when token changes

    // Listen to Firebase Auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setFirebaseUser(user)
            console.log('Firebase auth state changed:', user ? 'User logged in' : 'User logged out')
        })

        return () => unsubscribe()
    }, [])

    const value = {
        doctors, getDoctosData, loading,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData,
        firebaseUser
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider