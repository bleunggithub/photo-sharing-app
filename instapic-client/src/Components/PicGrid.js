import React from 'react'

import { Image, Placeholder } from 'cloudinary-react'

const PicGrid = ({ posts, status }) => {
    
    return (
        <div data-testid="pic-grid-div">
            {status === "NO RESULTS" ? (
                <h4 className="uppercase tracking-widest p-3 md:p-6">No posts to show. :(</h4>
            ) : (
                    <div className="flex flex-wrap">
                    {posts && posts.length > 0 && posts.map(post => (
                        <div key={post.posts_id} className="relative w-full md:w-1/2">
                                <Image
                                    cloudName={process.env.REACT_APP_CLOUDINARY_ACC_NAME}
                                    public_id={post.img_url}
                                    width="1000"
                                    height="1000"
                                    gravity="faces"
                                    crop="fill"
                                    loading="lazy"
                                    data-testid="grid-img"
                                    className="photo-grid"
                                    alt={post.posts_id}
                                    >
                                    <Placeholder type="blur" />
                            </Image>
                            <div className="img-overlay">
                                <h6 className="tracking-widest uppercase pb-2">{post.username}</h6>
                                <p className="md:text-xs lg:text-base">{post.content}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            )}
        </div>
    )
}

export default PicGrid