import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LandingPage from './components/landingPage';
import CreateStreamPage from './components/createStreamPage'
import ErrorPage from "./components/errorPage";
import StreamDetailsPage from "./components/streamDetailsPage";

const App = () => {
    return (<Router>
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/create" element={<CreateStreamPage/>}/>
            <Route path="/error" element={<ErrorPage/>}/>
            <Route path="/modify" element={<StreamDetailsPage/>}/>

        </Routes>
    </Router>);
};


export default App;
