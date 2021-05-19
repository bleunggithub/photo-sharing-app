import React from 'react'

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
    const pageNumbers = []

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++){
        pageNumbers.push(i)
    }

    return (
        <div data-testid="pagination-container">
            <div className="flex flex-nowrap justify-center">
                {
                    pageNumbers.map(number => (
                        <button key={number}
                            className={number === currentPage ? 'pagination-page-numbers-current':'pagination-page-numbers'}
                            onClick={() => paginate(number)} >
                            {number}
                        </button>
                    ))
                }
            </div>
        </div>
    )
}

export default Pagination