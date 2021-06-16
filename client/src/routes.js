import React from 'react'
import {Switch, Route, Redirect} from "react-router-dom"
import {Home} from "./pages/Home"
import {Register} from "./pages/Register"
import {Sign} from "./pages/Sign"
import {Settings} from "./pages/Settings";

export const useRoutes = (isAuthenticated) => {
    if(isAuthenticated){
        return(
            <Switch>
                <Route path="/" exact>
                    <Home/>
                </Route>
                <Route path="/settings" exact>
                    <Settings/>
                </Route>
                <Redirect to="/"/>
            </Switch>
        )
    }

    return(
        <Switch>
            <Route path="/register" exact>
                <Register/>
            </Route>
            <Route path="/sign" exact>
                <Sign/>
            </Route>
            <Redirect to="/sign"/>
        </Switch>
    )
}