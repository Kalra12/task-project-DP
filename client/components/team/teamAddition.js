import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Member from '../member/Member';
import CircularProgress from '@mui/material/CircularProgress';
import './CreateTeam.css';

function CreateTeam() {
    const navigate = useNavigate();
    const [displaySpinner, setDisplaySpinner] = useState(false);
    const [teamId, setTeamId] = useState("");
    const [teamName, setTeamName] = useState("");
    const [members, setMembers] = useState([1]);
    const [membersData, setMembersData] = useState([]);

    const addTeamMember = () => {
      setMembers([...members, members.length + 1]);
    }

    const handleMemberData = (changedMemberData) => {
      const oldData = [...membersData];
      if(membersData.length > 0) {
        const findMember = oldData.filter(member => member.email === changedMemberData.email);
        if(findMember.length > 0) {
          const filterChangedMember = oldData.filter(member => member.email !== changedMemberData.email);
          setMembersData([...filterChangedMember, changedMemberData]);
        }
      }
    }
    
    const handleAllData = (member) => {
      setMembersData([...membersData, member]);
    }

    const createTeam = async () => {
      setDisplaySpinner(true);
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.post('http://localhost:4000/team/:id', {
        team_id: teamId,
        name: teamName,
        members: membersData
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDisplaySpinner(false);
      localStorage.setItem("team", JSON.stringify(data.message));
      navigate('/');
    }

  return (
    <div className='createTeamWrapper'>
      {
        !displaySpinner && 
        <Box
        className="CreateTeam"
        >
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, marginBottom: '1rem' }}>
            Create Team
          </Typography>
          <Stack spacing={2} direction="column" alignItems="center">
              <Stack spacing={2} direction="row">
                  <TextField id="teamId" label="Team ID" variant="outlined" value={teamId} onChange={e => setTeamId(e.target.value)}/>
                  <TextField id="teamName" label="Team Name" variant="outlined" value={teamName} onChange={e => setTeamName(e.target.value)}/>
              </Stack>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1, marginTop: '5rem !important', marginBottom: '1rem' }}>
                Add Team Members
              </Typography>            {
                members.map(member => <Member key={member} handleMemberData={handleMemberData} handleAllData={handleAllData} membersData={membersData}/>)
              }
              <Button className='ButtonStyle' variant="contained" onClick={addTeamMember}>Add More Members</Button>
              <Button variant="contained" onClick={createTeam}>Done</Button>
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

export default CreateTeam