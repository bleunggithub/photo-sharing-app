import React, {useEffect, useContext, useState} from 'react';
import { UserContext } from './context/UserContext';

import Loading from './Components/Loading'
import Routes from './Routes'
import axios from 'axios';

function App() {
  const { user, setUser } = useContext(UserContext)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_SERVER}/users/refresh_token`, {
      withCredentials: true
    }).then(res => {
      if (res.data.authenticated) {
        setUser(res.data)
      }
      setLoading(false)
    }).catch((err)=>{
      console.log(err)
      setLoading(false)
    })
    }, [])

  if (loading) {
    return (
      <div className="screen-w-h-container">
        <Loading />
      </div>
    )
  }

  return <Routes user={user}/>
}

export default App;
