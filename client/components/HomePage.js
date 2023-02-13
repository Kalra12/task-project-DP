import React from 'react';
import { Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const user = localStorage.getItem('user');
  const team = localStorage.getItem('team');
  let name, designation, teamId;
  if (user) {
    const parsedUser = JSON.parse(user); 
    name = parsedUser.name;
    designation = parsedUser.designation;
    teamId = parsedUser.teamId;
  };
  const navigate = useNavigate();
  return (
    <div className='Home'>
      <p className='Title'>Task <span className='TitlePart2'>Manager</span></p>
      {
        user && 
        <div>
          <p className='Description'>Hi {name}</p>
          <Stack direction='column' spacing={2}>
            {
              (role === 'manager' || team)  && !teamId && <Button variant="contained" onClick={() => { navigate('/create-team') }}>Create Team</Button>
            }
            {
              role === 'manager' && <Button variant="contained" onClick={() => { navigate('/add-members') }}>Add New Member</Button>
            }
            {
              role === 'manager' && <Button variant="contained" onClick={() => { navigate('/create-task') }}>Create New Task</Button>
            }
            <Button variant="contained" onClick={() => { navigate('/view-task') }}>See Pending Tasks</Button>
          </Stack>
        </div>
      }
      {
        !user && 
        <Stack direction='row' spacing={2} sx={{ marginTop: '2rem' }}>
          <Button variant="contained" onClick={() => { navigate('/login') }}>Login</Button>
          <Button variant="contained" onClick={() => { navigate('/signup') }}>Signup</Button>
        </Stack>
      }
    </div>
  )
}

export default HomePage