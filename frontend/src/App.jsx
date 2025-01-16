import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LandingPage from './components/landingPage';
import ErrorPage from "./components/errorPage";
import Dashboard from "./components/dashboard";



function App() {


    return (<Router>
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/error" element={<ErrorPage/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>

        </Routes>
    </Router>);
}

export default App
