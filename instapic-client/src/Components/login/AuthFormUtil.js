import { useState, useContext } from "react"
import axios from 'axios'

import { UserContext } from '../../context/UserContext';

export const LoginAPI = (apiRoute) => {
    const {setUser} = useContext(UserContext)
    
    const [formInput, setFormInput] = useState({
        username: "",
        password: "",
    })

    const [errorMessage, setErrorMessage] = useState(null)

    const handleInputChange = e => {
        const {name,value} = e.currentTarget
        setFormInput(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = e => {
        e.preventDefault()

        const {username, password} = formInput

        axios.post(`${process.env.REACT_APP_API_SERVER}/users/${apiRoute}`, {
            username, password
        },{withCredentials:true}).then(res => {

            if (!res.data) {
                setErrorMessage(["An Error has occurred, please try again."])
                setUser(null)
            } else if (!res.data.accessToken) {
                setErrorMessage(res.data.message || ["An Error has occurred, please try again."])
                setUser(null)
            } else {
                setUser(res.data)
            }
        }).catch(err => {
            console.log(err.response)
            setErrorMessage((err.response && err.response.data.message) || ["An Error has occurred, please try again."])
        })
        
        setFormInput({
            username: "",
            password: ""
        })
    }

    return {
        handleSubmit,
        formInput,
        handleInputChange,
        errorMessage
    }
}
