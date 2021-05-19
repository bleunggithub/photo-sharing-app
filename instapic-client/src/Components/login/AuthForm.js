import React from 'react'

//components
import { LoginAPI } from './AuthFormUtil'


const AuthForm = ({ handleSwitchForm, apiRoute, subTitleText, btnText, smallTextQuestion, smallTextLink }) => {

    const {handleSubmit, formInput, handleInputChange, errorMessage} = LoginAPI(apiRoute)
    
    return (
        <>
            <p className="landing-subtitle">
                <span className="highlightText" data-testid="form-title">{subTitleText}</span>
            </p>
            <form onSubmit={handleSubmit} className="form-container">
                <label className="form-input-label">username.</label>
                <input
                    type="text"
                    name="username"
                    placeholder="username"
                    value={formInput.username}
                    className="form-input"
                    onChange={handleInputChange}
                    autoComplete="off"
                    minLength="4"
                    maxLength="15"
                    required
                />
                
                <label className="form-input-label">password.</label>
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    value={formInput.password}
                    className="form-input"
                    onChange={handleInputChange}
                    autoComplete="off"
                    minLength="4"
                    maxLength="15"
                    required
                />
                <button data-testid="login-btn" type="submit" className="submit-btn-accent bg-accent-100 hover:bg-accent-60">
                    {btnText}
                </button>
            </form>
            {errorMessage && errorMessage.length > 0 ? (
                <ul className="text-red">
                    {errorMessage.map((err, i) => (
                        <li key={i}><small>{err.message}</small></li>
                    ))}
                </ul>
            ) :
                null}
            <div className="text-center">
                <p>{smallTextQuestion}<br/>
                    <span className="underline" role="button" onClick={handleSwitchForm}>
                        {smallTextLink}
                    </span>.
                </p>
            </div>
        </>
    )
}

export default AuthForm