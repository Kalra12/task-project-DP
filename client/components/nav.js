import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './nav.css';
import { ColorButton } from './helper';

//material-ui components
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';

function Nav({ userLoggedIn }) {
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}
    >
        <AppBar position="static">
            <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 1 }}
                  onClick={() => navigate('/')}
                >
                  <PlaylistAddCheckOutlinedIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => navigate('/')}>
                Task Manager 
                </Typography>
                <Link className='LinkStyle' to="/">
                  <Typography variant="h6" component="div"  sx={{ flexGrow: 1}}>
                  Home
                  </Typography>
                </Link>
                <ColorButton className='ButtonStyle1'>
                  <Link className='LinkStyle2' to="/login">
                    Login
                  </Link>
                </ColorButton>
                <ColorButton>
                  <Link className='LinkStyle2' to="/signup">
                    Signup
                  </Link>
                </ColorButton>
            </Toolbar>
        </AppBar>
    </Box>
  )
}

export default Nav