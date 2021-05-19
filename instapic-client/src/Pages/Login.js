import React, { useState, useContext } from 'react'
import { Redirect } from 'react-router-dom';

import { FiUploadCloud } from 'react-icons/fi'

//components
import AuthForm from '../Components/login/AuthForm'
import { UserContext } from '../context/UserContext';

const Login = () => {
    const { user } = useContext(UserContext)
    
    const [loginForm, setLoginForm] = useState(true)

    const handleSwitchForm = () => {
        setLoginForm(!loginForm)
    }
   
    if (user && user.accessToken) {
        return <Redirect to="/discover" />
    }

    return (
        <div className="screen-w-h-container" data-testid="login-container">
            <div className="register-container">
                <FiUploadCloud className="large-icon" />
                <h1>InstaPic</h1>

                {loginForm ?
                    <AuthForm
                        handleSwitchForm={handleSwitchForm}
                        apiRoute="login"
                        subTitleText="Log In to Continue"
                        btnText="Log In"
                        smallTextQuestion="Don't have an account yet? &nbsp;"
                        smallTextLink="Register here"
                    />:
                    <AuthForm
                        handleSwitchForm={handleSwitchForm}
                        apiRoute="register"
                        subTitleText="Register & start sharing"
                        btnText="Register"
                        smallTextQuestion="Already have an account? &nbsp;"
                        smallTextLink="Sign in here"
                    />
                }
                

            </div>
        </div>
    )
}

export default Login

