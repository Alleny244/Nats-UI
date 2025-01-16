import {useNavigate} from 'react-router-dom';
import {Button, Box, Typography} from '@mui/material';

const LandingPage = () => {
    const navigate = useNavigate();


    return (<Box textAlign="center" p={5}>
        <Typography variant="h4" gutterBottom>Welcome to NATS Dashboard</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')}>
            Monitor Streams
        </Button>
    </Box>);
};

export default LandingPage;
