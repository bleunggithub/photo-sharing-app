import React, {useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'

//components
import Dropzone from '../Components/share/Dropzone'
import Loading from '../Components/Loading'
import { UploadAPI } from '../Components/share/ShareUtil'

import {BiCheckCircle} from 'react-icons/bi'
import {BiErrorCircle} from 'react-icons/bi'

const Share = () => {

    const {status, redirect, handleSubmit, message, handleInputChange} = UploadAPI()
    
    const [button, setButton] = useState((<button type="submit" className="upload-submit-btn">Submit</button>))
    
    useEffect(() => {
        if (status === "LOADING") {
            setButton(<Loading className="right-5 bottom-0 absolute h-24 w-24"/>)
        } else if (status === "SUCCESS") {
            setButton(
                <p className="absolute right-5 bottom-5 text-accent">
                    <BiCheckCircle className="inline mr-2  text-4xl"/>
                    Uploaded
                </p>
            )
        } else if (status === "ERROR") {
            setButton(
                <p className="absolute right-5 bottom-5 text-accent">
                <BiErrorCircle className="inline mr-2  text-4xl"/>
                An Error has occurred, please refresh.
            </p>
            )
        } else {
            setButton((<button type="submit" className="upload-submit-btn">Submit</button>))
        }
    }, [status])

    useEffect(() => {
        return () => {
            clearTimeout(redirect)
        }
    })

    //redirect to /discover 1.5s after upload 
    if (status === "REDIRECT") {
        return <Redirect to="/discover" />
    }
    
    return (
        <form onSubmit={handleSubmit} className="upload-container" data-testid="upload-container">
            <div className="dropzone-container">
                <Dropzone />
            </div>
            <div className="upload-textarea-container" data-testid="upload-textarea-container">
                <textarea
                    name="message"
                    value={message}
                    className="form-textarea"
                    maxLength="300"
                    placeholder="write something (300 characters) "
                    onChange={handleInputChange}
                />
                {button}
            </div>
        </form>
    )
}

export default Share