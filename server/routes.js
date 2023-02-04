const express = require('express');
const router = express.Router();

const {
    registerationOfUser,
    loginUser,
    tokenRegenerate,
    teamCreation,
    teamMembersDetails,
    memberAddition,
    updateMember,
    deleteMember,
    allTask,
    newTask,
    updateTask,
    deleteTask
} = require('./controllers');

//Authentication Routes

router.post('/registerationOfUser', registerationOfUser);
router.post('/loginUser', loginUser);
router.get('/tokenRegenerate', tokenRegenerate);

// Team Routes

router.post('/team', teamCreation)
    .get('/team/:id', teamMembersDetails);

//Member Routes

router.post('/member', memberAddition)
    .put('/member/:id', updateMember)
    .delete('/member/:id', deleteMember);

//Task Routes

router.get('/task', allTask)
    .post('/task', newTask)
    .put('/task/:id', updateTask)
    .delete('/task/:id', deleteTask);

module.exports = router;