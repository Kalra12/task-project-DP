import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Member from '../member/Member';
import CircularProgress from '@mui/material/CircularProgress';
import './MemberAddition.css';

function MemberAddition() {
    const navigate = useNavigate();
    const [isDisable, setisDisabled] = useState(true);
    const [displaySpinner, setDisplaySpinner] = useState(false);
    const [member, setMember] = useState([1]);

    const handleMemberData = (MemberAdditionData) => {
        if (MemberAdditionData?.name) {
            setisDisabled(false);
        }
        setMember(MemberAdditionData);
    }

    const addMember = async () => {
    setDisplaySpinner(true);
    const token = localStorage.getItem("accessToken");
    await axios.post('http://localhost:4000/member', member,
    {
        headers: { Authorization: `Bearer ${token}` }
    });
    setDisplaySpinner(false);
    navigate('/');
    }
  
  return (
    <div className='MemberAdditionWrapper'>
    {
      !displaySpinner && 
      <Box
      className="MemberAdditions"
      >
        <Typography variant="h4" component="div" sx={{ flexGrow: 1, marginBottom: '1rem' }}>
            Add New Member
        </Typography>
        <Stack spacing={2} direction="column" alignItems="center">
            <Member key={member} handleMemberData={handleMemberData} />
            <Button disabled={isDisable} variant="contained" onClick={addMember}>Done</Button>
        </Stack>
      </Box>
    }
    {
      displaySpinner && 
      <CircularProgress />
    }
  </div>
  )
}

export default MemberAddition