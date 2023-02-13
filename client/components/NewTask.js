import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewTask.css';

//material-ui components
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';


function NewTask() {
  const navigate = useNavigate();
  const [displaySpinner, setDisplaySpinner] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status,setStatus] = useState("to-do");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");

  const createTask = async () => {
    setDisplaySpinner(true);
    const token = localStorage.getItem("accessToken");
    await axios.post('http://localhost:4000/task', {
      title,
      description,
      status,
      priority,
      due_date: dueDate
    },{
      headers: { Authorization: `Bearer ${token}` }
    });
    setDisplaySpinner(false);
    navigate('/');
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2rem' }}>
        {
          !displaySpinner && 
          <div className='NewTaskWrapper'>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1, marginBottom: '1rem' }}>
              Create Task
            </Typography>
            <Stack spacing={2} direction="column">
              <TextField className='FieldStyle1' id="title" label="Title" variant="outlined" value={title} onChange={(e) => {
                setTitle(e.target.value);
              }}/>
              <TextField className='FieldStyle1'id="desc" label="Description" variant="outlined" value={description} onChange={(e) => {
                setDescription(e.target.value);
              }}/>
              <TextField className='FieldStyle1' id="status" label="Status" variant="outlined" value={status} onChange={(e) => {
                setStatus(e.target.value);
              }}/>
              <TextField className='FieldStyle1' id="priority" label="Priority" variant="outlined" value={priority} onChange={(e) => {
                setPriority(e.target.value);
              }}/>
              <TextField className='FieldStyle1' id="dueDate" label="Due Date" variant="outlined" placeholder="01-28-2023" value={dueDate} onChange={(e) => {
                setDueDate(e.target.value);
              }}/>
              <Button variant="contained"  onClick={createTask}>Create</Button>
            </Stack>
          </div>
        }
        {
          displaySpinner && 
          <CircularProgress />
        }
    </Box>
  )
}

export default NewTask