import React, { useState,useEffect } from 'react'

//components
import Searchbar from '../Components/search/Searchbar';
import PicGrid from '../Components/PicGrid';
import Pagination from '../Components/search/Pagination'

const Search = () => {
    const [posts, setPosts] = useState([])
    const [status, setStatus] = useState("INITIAL") 
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(6)

    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [posts])

    
    return (
        <div className="w-screen max-w-full h-auto flex flex-wrap pt-20 md:pt-0 md:pl-20 lg:pl-28" data-testid="search-container">
            <div className="flex flex-wrap justify-center w-full content-start md:justify-between md:pt-2">
                <Searchbar setPosts={setPosts} setStatus={setStatus}/>
            </div>
            <div className="flex flex-wrap justify-between w-full content-start">
                <PicGrid posts={currentPosts} status={status}/>
            </div>
            <div className="flex justify-center w-full p-3">
                {posts.length <= 6 ? null : (
                    <Pagination
                        postsPerPage={postsPerPage}
                        totalPosts={posts.length}
                        paginate={paginate}
                        currentPage={currentPage}
                    />
                )}
            </div>
        </div>
    )
}

export default Search