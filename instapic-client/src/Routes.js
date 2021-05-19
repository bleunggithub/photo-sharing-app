import React, { Suspense, lazy } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

//components/pages
import PrivateRoute from './Components/PrivateRoute'
import Loading from './Components/Loading'
const Discover = lazy(()=>import ('./Pages/Discover')) 
const Share = lazy(()=>import ('./Pages/Share')) 
const Search = lazy(()=>import ('./Pages/Search')) 
const Login = lazy(()=>import ('./Pages/Login')) 

function Routes() {
  return (
    <Router>
      <Suspense fallback={<div className="full-w-h-container"><Loading /></div>}>
        <Switch>
          <PrivateRoute path="/discover" exact component={Discover} />
          <PrivateRoute path="/share" exact component={Share} />
          <PrivateRoute path="/search" exact component={Search} />
          <Route path="/" exact component={Login} />
        </Switch>
      </Suspense>
    </Router>
  );
}

export default Routes;
