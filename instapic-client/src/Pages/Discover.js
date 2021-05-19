import React, { useEffect } from 'react'

//components
import { FetchAPI } from '../Components/discover/DiscoverUtil';
import { GrAscend } from 'react-icons/gr' //asc icon
import { GrDescend } from 'react-icons/gr' //desc icon
import  PicGrid from '../Components/PicGrid';

const Discover = () => {

    const { posts, status, pageNum, sort, setSort, setPageNum, redirect, fetchMorePosts } = FetchAPI()
    
    const handleSort = (e) => {
        if (e.target.value !== sort) {
            setPageNum(1)
            setSort(e.target.value)
            fetchMorePosts(1, e.target.value)
        }
        window.scrollTo(0,0)
    }

    useEffect(() => {
        fetchMorePosts(pageNum,sort)
    }, [])

    useEffect(() => {
        return () => {
            clearTimeout(redirect)
        }
    })

    
    return (
        <div className="w-screen max-w-full flex flex-wrap pt-20 md:pt-0 md:pl-20 lg:pl-28" data-testid="discover-container">
            <div className="fixed z-20 m-2 ">
                <button className="mx-1 bg-white-80 rounded-sm" value="asc" onClick={handleSort}>
                    <GrAscend className="menu-icons-small" />    
                </button>
                <button className="mx-1 bg-white-80 rounded-sm" value="desc" onClick={handleSort}>
                    <GrDescend className="menu-icons-small"/>
                </button>
            </div>
            <div className="flex flex-wrap justify-between w-full content-start lg:min-h-screen">
                <PicGrid posts={posts} status={status}/>
            </div>
            <div className="flex justify-center w-screen">
                {
                    status !== "LAST" ? (
                        <button className="uppercase tracking-widest m-3 p-2" onClick={() => fetchMorePosts(pageNum, sort)}>
                            Load More
                        </button>
                    ) : (
                        <>
                        {
                            status === "ERROR" ? (
                                <h6 className="text-accent m-3">
                                ...An Error has occurred, please refresh the page.
                                </h6>
                            ) : (
                                <h5 className="uppercase tracking-widest m-4">... No more posts</h5>
                            )
                        }
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default Discover
