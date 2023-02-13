import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './Member.css';

function Member({ handleMemberData, membersData, handleAllData }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    handleMemberData({ name, email, password, mobile, role: "employee" });
    if(name && email && password && mobile) {
      const filterEmail = membersData.filter(member => member?.email === email);
      if(filterEmail.length === 0) {
        handleAllData({name, email, password, mobile, role: "employee"});
      }
    }
  }, [name, email, password, mobile]);

  return (
    <Box
    component="form"
    className="Member"
    >
    <Stack spacing={2} direction="row" flexWrap="wrap">
        <TextField className='FieldStyle' id="memberName" label="Member Name" variant="outlined" value={name} onChange={(e) => { setName(e.target.value) }}/>
        <TextField className='FieldStyle' id="memberEmail" label="Member Email" variant="outlined" value={email} onChange={(e) => { setEmail(e.target.value) }}/>
        <TextField className='FieldStyle' id="memberPassword" label="Member Password" variant="outlined" value={password} onChange={(e) => { setPassword(e.target.value) }}/>
        <TextField className='FieldStyle' id="memberMobile" label="Member Mobile" variant="outlined" value={mobile} onChange={(e) => { setMobile(e.target.value) }}/>
    </Stack>
    </Box>
  )
}

export default Member
Foo