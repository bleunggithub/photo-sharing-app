import React, { useContext } from 'react'
import axios from 'axios'

//components
import { UserContext } from '../context/UserContext'

import { BiSearchAlt2 } from 'react-icons/bi' 
import { BsFillGrid3X3GapFill } from 'react-icons/bs' 
import { HiUpload } from 'react-icons/hi' 
import { BiLogOut } from 'react-icons/bi' 
import { Link } from 'react-router-dom'


const Layout = ({ children }) => {
    const { setUser } = useContext(UserContext)

    const handleLogOut = () => {
        axios.get(`${process.env.REACT_APP_API_SERVER}/users/logout`, {
            withCredentials: true,
            credentials: 'include'
        })
        .then(res => {
            console.log(res.data.message)
            setUser(null)
        })
        .catch(err =>console.log(err))
    }

    return (
        <>
            <nav className="navbar" data-testid="navbar">
                <ul className="nav-ul">
                    <Link to="/search" data-testid="search-btn">
                        <li><BiSearchAlt2 className="menu-icons" /></li>
                    </Link>
                    <Link to="/discover" data-testid="discover-btn">
                        <li><BsFillGrid3X3GapFill className="menu-icons" /></li>
                    </Link>
                    <Link to="/share" data-testid="share-btn">
                        <li><HiUpload className="menu-icons" /></li>
                    </Link>
                    <li role="button" onClick={handleLogOut} data-testid="logout-btn">
                        <BiLogOut className="menu-icons" />
                    </li>
                </ul>
            </nav>
            <main>
                {children}
            </main>
        </>
    )
}

export default Layout