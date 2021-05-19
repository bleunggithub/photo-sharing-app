import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import Layout from './Layout'

const PrivateRoute = ({ component: Component, ...otherProps }) => {
    const { user } = useContext(UserContext)

    if (Component) {
        return (
            <Route
                {...otherProps}
                render = {props => (
                    user ? (
                        <Layout>
                            <Component {...props} />
                        </Layout>
                    ) : (
                            <Redirect to={otherProps.redirectTo ? (
                                otherProps.redirectTo
                            ) :
                                '/'
                            } />
                        )
                    )
                }
        />
        )
    }
    return null
}

export default PrivateRoute