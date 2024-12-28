import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Box, Typography} from '@mui/material';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleCreateClick = () => {
        navigate("/create");
    };

    return (<Box textAlign="center" p={5}>
            <Typography variant="h4" gutterBottom>Welcome to NATS Dashboard</Typography>
            <Typography variant="subtitle1" gutterBottom>
                What would you like to do?
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/monitor')}>
                Monitor Streams
            </Button>
            <Button variant="contained" color="secondary" style={{marginLeft: '10px'}} onClick={handleCreateClick}>
                Create New Stream
            </Button>
        </Box>);
};

export default LandingPage;
