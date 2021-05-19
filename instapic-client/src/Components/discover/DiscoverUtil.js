import { useState, useContext } from "react"
import axios from 'axios'

import { UserContext } from '../../context/UserContext';

export const FetchAPI = () => {
    const { user, setUser } = useContext(UserContext)
    const [posts, setPosts] = useState([])
    const [status, setStatus] = useState("LOADING") //LOADING,FETCHED,LAST,ERROR
    const [pageNum, setPageNum] = useState(1)
    const [sort,setSort] = useState("desc")

    let redirect

    const fetchMorePosts = (page, sort="desc") => {
        setStatus("LOADING")

        if (page === 1) {
            setPosts([])
        }
        
        axios.get(`${process.env.REACT_APP_API_SERVER}/api/posts?page=${page}&sort=${sort}`,
            {
                headers: {Authorization: `Bearer ${user.accessToken}`},
                withCredentials: true
            })
            .then(res => {
                if (res.data.accessToken) {
                    const { accessToken, authenticated } = res.data
                    setUser({authenticated, accessToken})
                }
                
                if (res.data.message) {
                    setStatus("LAST")
                    setPageNum(1)
                } else {
                    setPageNum(pageNum+1)
                    setStatus("FETCHED")
                }

                if (page !== 1) {
                        setPosts([...posts,...res.data.posts])
                } else {
                    setPosts(res.data.posts)
                    }
                }
            )
            .catch(err => {
            console.log(err)
            setStatus("ERROR")
            if (err.response.status === 401) {
                //user has been logged out
                redirect = setTimeout(()=>window.location.reload(),1500)
            }
        })
    }

    return {
        posts,
        status,
        pageNum,
        sort,
        setSort,
        setPageNum,
        redirect,
        fetchMorePosts
    }
    
}
