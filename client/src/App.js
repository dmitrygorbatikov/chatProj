import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { useRoutes } from './routes';
import { BrowserRouter as Router } from 'react-router-dom'
import {Loader} from "./components/Loader";
import {AuthContext} from "./context/AuthContext";
import {useAuth} from "./hooks/auth.hook";

function App() {
    const {token, login, logout, userId, ready} = useAuth()
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated)

    if(!ready){
        return <Loader />
    }

    return (
        <AuthContext.Provider  value={{
            token, login, logout, userId, isAuthenticated
        }}>
            <Router>
                {

                }
                <Container>
                    {routes}
                </Container>

            </Router>
        </AuthContext.Provider>
    );
}

export default App
