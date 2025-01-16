import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LandingPage from './components/landingPage';
import CreateStreamPage from './components/createStreamPage'
import ErrorPage from "./components/errorPage";
import StreamDetailsPage from "./components/streamDetailsPage";
import Dashboard from "./components/dashboard";

const App = () => {
    return (<Router>
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/error" element={<ErrorPage/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>

        </Routes>
    </Router>);
};


export default App;
