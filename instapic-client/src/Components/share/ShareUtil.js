import { useState, useContext } from "react"
import axios from 'axios'

import { UserContext } from '../../context/UserContext';

export const UploadAPI = () => {
    const { user, setUser } = useContext(UserContext)
    const [message, setMessage] = useState("")
    const [status, setStatus] = useState("INITIAL") //"INITIAL","LOADING","SUCCESS","ERROR"
    let redirect

    const handleSubmit = e => {
        e.preventDefault()
        setStatus("LOADING")

        const uploadImgFormData = new FormData()
        
        if (e.target[0].files.length > 0) {
            uploadImgFormData.append("file", e.target[0].files[0])
            uploadImgFormData.append("message", message)
        } else {
            return
        }

        axios.post(`${process.env.REACT_APP_API_SERVER}/api/upload`,
            uploadImgFormData,
            {
                headers: {
                    Authorization: `Bearer ${user.accessToken}`
                },
                withCredentials: true
            }).then(res => {
                if (res.data.accessToken) setUser(res.data)
                setStatus("SUCCESS")
                redirect = setTimeout(()=>setStatus("REDIRECT"),1500)
        }).catch(err => {
            console.log(err)
            setStatus("ERROR")
            if (err.response.status === 401) {
                //user has been logged out
                redirect = setTimeout(()=>window.location.reload(),1500)
            }
        })
    }

    const handleInputChange = e => setMessage(e.target.value)


    return {
        status,
        redirect,
        handleSubmit,
        message,
        handleInputChange
    }
    
}
