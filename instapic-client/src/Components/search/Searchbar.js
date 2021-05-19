import React, { useEffect } from 'react'

import { SearchAPI } from './SearchUtil'


export const Searchbar = ({setPosts, setStatus}) => {

    const {redirect, handleChange} = SearchAPI(setPosts, setStatus)

    useEffect(() => {
        return () => {
            clearTimeout(redirect)
        }
    })

    return (
        <>
            <div className="text-center px-2 my-4 w-full md:px-6">
                <input
                    type="search"
                    onChange={handleChange}
                    placeholder="Search user"
                    className="searchbar"
                />
            </div>
        </>
    )
}

export default Searchbar