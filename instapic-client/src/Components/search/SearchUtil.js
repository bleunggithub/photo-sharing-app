import { useContext } from "react"
import axios from 'axios'

import { UserContext } from '../../context/UserContext';

export const SearchAPI = (setPosts, setStatus) => {
    const { user, setUser } = useContext(UserContext)
    let redirect

    const handleSearch = (input) => {
        setStatus("LOADING")

        if (input === "") {
            return
        }

        axios.get(`${process.env.REACT_APP_API_SERVER}/api/search?username=${input}`, {
            headers: {Authorization: `Bearer ${user.accessToken}`},
            withCredentials: true,
            credentials: 'include'
            }).then(res => {
                if (res.data.accessToken) {
                    const { accessToken, authenticated } = res.data
                    setUser({authenticated, accessToken})
                }
                if (res.data.message) {
                    setStatus("NO RESULTS")
                    setPosts([])
                } else {
                    setPosts(res.data.result)
                    setStatus("DONE")
                }

        }).catch(err => {
            console.log(err)
            setStatus("ERROR")
            if (err.response.status === 401) {
                //user has been logged out
                redirect = setTimeout(()=>window.location.reload(),1500)
            }
        })
    }

    const handleChange = e => {
        setTimeout(()=>handleSearch(e.target.value),10) 
    }

    return {
        redirect,
        handleChange
    }
}