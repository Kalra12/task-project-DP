import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Task.css';

//material-ui components
import { makeStyles } from "@material-ui/core/styles";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from "@material-ui/core/IconButton";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import DeleteIcon from '@mui/icons-material/DeleteOutline';

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  },
  selectTableCell: {
    width: 60
  },
  tableCell: {
    width: 130,
    height: 40
  },
  input: {
    width: 130,
    height: 40
  }
}));


const CustomTableCell = ({ row, name, onChange, team }) => {
  const [selectedValue, setSelectedValue] = useState(`${row[name] || ''}`);
  const classes = useStyles();
  const { isEditMode } = row;
  let menuItems = [];
  switch(name) {
    case 'status': 
      menuItems = [
        {
          item: 'to-do',
          value: 'to-do'
        },
        {
          item: 'in-progress',
          value: 'in-progress'
        },
        {
          item: 'completed',
          value: 'completed'
        }
      ]
      break;
    case 'priority':
      menuItems = [
        {
          item: 'high',
          value: 'high'
        },
        {
          item: 'medium',
          value: 'medium'
        },
        {
          item: 'low',
          value: 'low'
        }
      ]
      break;
    case 'assignee':
      menuItems = team?.members?.map(member => {
        return {
          item: member.name,
          value: member.id
        }
      });
  }
  return (
    <TableCell align="left" className={classes.tableCell}>
      {isEditMode ? (
      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <Select
        id="menu-card"
        value={selectedValue}
        name={name}
        onChange={e => { 
          setSelectedValue(e.target.value);
          onChange(e, row);
        }}
        >
          {
            menuItems.length > 0 && menuItems.map(itemObj => <MenuItem value={itemObj.value}>{itemObj.item}</MenuItem>)
          }
        </Select>
      </FormControl>
      ) : (
        row[name] ? row[name] : '-'
      )}
    </TableCell>
  );
};

function Task() {
  const token = localStorage.getItem("accessToken");
  const { designation, teamId } = JSON.parse(localStorage.getItem("user"));
  const [displaySpinner, setDisplaySpinner] = useState(true);
  const [rows, setRows] = useState([]);
  const [previous, setPrevious] = React.useState({});
  const [updatedKeys, setUpdatedkeys] = React.useState({});
  const [team, setTeam] = React.useState({});
  const classes = useStyles();

  useEffect(() => {
    const fetchAllTasks = async () => {
      const { data } = await axios.get('http://localhost:4000/task', {
          headers: { Authorization: `Bearer ${token}` }
      });
      setRows(data.message);
      setDisplaySpinner(false);
    }
    const fetchAllTeamMembers = async () => {
      const { data } = await axios.get(`http://localhost:4000/team/${teamId}`, {
        headers: { Authorization: `Bearer ${token}`}
      });
      setTeam(data.message);
    }
    Promise.all([fetchAllTasks(), fetchAllTeamMembers()]);
  }, []);

  const onToggleEditMode = id => {
    setRows(state => {
      return rows.map(row => {
        if (row._id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };

  const updateTask = async (taskId) => {
    const { data } = await axios.put(`http://localhost:4000/task/${taskId}`, updatedKeys, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  const onEditComplete = id => {
    setRows(state => {
      return rows.map(row => {
        if (row._id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
    updateTask(id);
  }

  const onChange = (e, row) => {
    if (!previous[row._id]) {
      setPrevious(state => ({ ...state, [row._id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { _id: id } = row;
    const newRows = rows.map(row => {
      if (row._id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
    setUpdatedkeys({...updatedKeys, [name]: value });
  };

  const onRevert = id => {
    const newRows = rows.map(row => {
      if (row._id === id) {
        return previous[id] ? previous[id] : row;
      }
      return row;
    });
    setRows(newRows);
    setPrevious(state => {
      delete state[id];
      return state;
    });
    onToggleEditMode(id);
  };

  const deleteTask = async (id) => {
    console.log(id);
    setDisplaySpinner(true);
    await axios.delete(`http://localhost:4000/task/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const newRows = rows.filter(row => row._id !== id);
    setRows(newRows);
    setDisplaySpinner(false);
  }

  const getFormatedDueDate = (date) => {
    const dateObj = new Date(date);
    return `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;
  }

  return (
    <div className='Task'>
      <h1>All Tasks</h1>
      {
        displaySpinner && 
        <CircularProgress />
      }
      {
        !displaySpinner &&
        <TableContainer component={Paper} className={classes.root}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell sx={{fontWeight: 'bold'}}>Title</TableCell>
                <TableCell sx={{fontWeight: 'bold'}} align="left">Description</TableCell>
                <TableCell sx={{fontWeight: 'bold'}} align="left">Due Date</TableCell>
                <TableCell sx={{fontWeight: 'bold'}} align="left">Status</TableCell>
                <TableCell sx={{fontWeight: 'bold'}} align="left">Priority</TableCell>
                {
                  designation === "manager" && <TableCell sx={{fontWeight: 'bold'}} align="left">Assignee</TableCell>
                }
                <TableCell sx={{fontWeight: 'bold'}} align="left">Edit</TableCell>
                <TableCell sx={{fontWeight: 'bold'}} align="left">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row._id}>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.due_date ? getFormatedDueDate(row.due_date): ''}</TableCell>
                  <CustomTableCell {...{ row, name: "status", onChange }} />
                  <CustomTableCell {...{ row, name: "priority", onChange }} />
                  {
                    designation === "manager" && <CustomTableCell {...{ row, name: "assignee", onChange, team }} />
                  }
                  <TableCell className={classes.selectTableCell}>
                    {row.isEditMode ? (
                      <>
                        <IconButton
                          aria-label="done"
                          onClick={() => onEditComplete(row._id)}
                        >
                          <DoneIcon />
                        </IconButton>
                        <IconButton
                          aria-label="revert"
                          onClick={() => onRevert(row._id)}
                        >
                          <RevertIcon />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        aria-label="delete"
                        onClick={() => onToggleEditMode(row._id)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell className={classes.selectTableCell}>
                    <IconButton
                          aria-label="delete"
                          onClick={() => deleteTask(row._id)}
                        >
                          <DeleteIcon />
                      </IconButton>
                  </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      }
    </div>
  )
}

export default Task