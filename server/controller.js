const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const objectID = require('mongoose').Types.ObjectId;
const User = require('./models/users');
const Tasks = require('./models/tasks');
const Teams = require('./models/teams');

const {
    login,
    registration,
    taskChecker,
    changeUser,
    objectIdChecker,
    teamChecker,
} = require('./validation');

const registerUser = ({ name, email, mobile, designation, team, password }) => {
    const tasks = [];
    return User.create({
        name,
        email,
        mobile,
        designation,
        password,
        team,
        tasks
    });
}

const emailFinder = (email) => {
    return User.findOne({ email }).populate('tasks');
}

const teamRegistration = ({ team_id, name, members, manager }) => {
    members = members.map(member => member._id);
    return Teams.create({
        team_id,
        name,
        members,
        manager
    });
}

const teamMembersChange = ({ id, userId }) => {
    return Teams.findByIdAndUpdate(id, { $push: { members: userId } });
}

const userDataChange = ({ id, data}) => {
    return User.findByIdAndUpdate(id, data);
}

const deleteUser = (id) => {
    return User.deleteOne({ _id: id })
}

const findUserById = (id) => {
    return User.findById(id);
}

const employeeTaskUpdation= (id) => {
    return Tasks.updateMany({ assignee: id}, { $unset: { assignee: "" }}, { multi: true });
}

const employeeTeamRemoval = async (teamId, memberId) => {
    const { members } = await Teams.findById(teamId);
    const updatedMembers = members.filter(member => member.toString() !== memberId.toString());
    return Teams.findByIdAndUpdate(teamId, { members: updatedMembers });
}

const taskCreation = (taskDetails) => {
    return Tasks.create(taskDetails);
}

const updateTaskDetails = (taskId, newTaskDetails) => {
    return Tasks.findByIdAndUpdate(taskId, newTaskDetails);
}

const updateUserTasks = ({id, taskId}) => {
    return User.findByIdAndUpdate(id, { $push: { tasks: taskId } })
}

const userTaskRemoval = async (userId, taskId) => {
    const { tasks } = await User.findById(userId);
    const updatedtasks = tasks.filter(task => task.toString() !== taskId.toString());
    return User.findByIdAndUpdate(userId, { tasks: updatedtasks });
}

const removeTaskFromAssignee = async (taskId) => {
    const { assignee } = await Tasks.findById(taskId, { assignee: 1 });
    return assignee ? removeTaskFromUser(assignee, taskId) : '';
}

const taskDeletion= (taskId) => {
    return Tasks.deleteOne({ _id: taskId });
}

const getTeamDetails = (teamId) => {
    return Teams.findById(teamId).populate([{path: 'manager', select: 'name email mobile'}, {path: 'members', select: 'name email mobile'}]);
}

const registerationService = async ({ name, email, mobile, role, password, team }) => {
    try {
        const salt = bcrypt.genSaltSync(saltrounds);
        const encryptedPassword = bcrypt.hashSync(password, salt);
        return registerUser({ name, email, mobile, role, password: encryptedPassword, team });
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}

const registerationOfUser = async (req, res) => {
    try {
        const { name, email, mobile, role, password } = await registration.validateAsync(req.body);
        const user = await registerationService({ name, email, mobile, role, password });
        return res.status(200).json({ message: "User Registered", user })
    } catch (e) {
        console.error(e);
        return res.status(400).json({ message: e.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password: enteredPassword } = await login.validateAsync(req.body);

        const { name, mobile, role, password, tasks, team } = await emailFinder(email);
        if (!password) throw customError(400, `User doesn't exist`);

        const isPasswordCorrect = bcrypt.compareSync(enteredPassword, password);
        if (isPasswordCorrect) {
            const accessToken = jwt.sign({ email }, process.env.TOKEN_SECRET, { expiresIn: '2d' });
            const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET);
            return res.status(200).json({
                name,
                email,
                mobile,
                role,
                tasks,
                team,
                token: { accessToken, refreshToken }
            });
        } else {
            throw new Error('Password Incorrect');
        }
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}


const tokenRegenerate = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.sendStatus(401);

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            const accessToken = jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '2d' });
            return res.json({ accessToken });
        })
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}

const teamCreation = async (req, res) => {
    try {
        const { team_id, name, members } = await teamChecker.validateAsync(req.body);
        const { _id: manager } = await emailFinder(req.user.email);
        const pendingValidation = members.map(async (member) => registration.validateAsync(member));
        const validatedMembers = await Promise.all(pendingValidation);

        const pendingMemberCreation = validatedMembers.map(async (member) => registerationService(member));
        const registeredMembers = await Promise.all(pendingMemberCreation);
        const registeredTeam = await teamRegistration({ team_id, name, members: registeredMembers, manager });

        await userDataChange({ id: manager, data: { team: registeredTeam._id } });
        const pendingUpdateTeamInMember = registeredMembers.map(member => userDataChange({ id: member._id, data: { team: registeredTeam._id } }));
        await Promise.all(pendingUpdateTeamInMember)
        return res.json(registeredTeam);
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}

const teamMembersDetails = async (req, res) => {
    try {
        const { id } = await objectIdChecker.validateAsync(req.params);
        if (!objectID.isValid(id)) throw new Error (400, 'Enter proper data');

        const teamDetails = await getTeamDetails(id);
        return res.json(teamDetails);
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}

const memberAddition = async (req, res) => {
    try {
        const { role } = await emailFinder(req.user.email);
        if (role !== 'manager') throw new Error (401, 'You are not authorized to create');

        const userDetails = await registration.validateAsync(req.body);
        const user = await registerationService(userDetails);

        await teamMembersChange({ id: userDetails.team, userId: user._id });

        return res.json(user);
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}

const updateMember = async (req, res) => {
    try {
        const { role } = await emailFinder(req.user.email);
        if (role !== 'manager') throw new Error ('You are not authorized to update');

        const { id } = await objectIdChecker.validateAsync(req.params);
        if (!objectID.isValid(id)) throw new Error( 'Enter proper data');

        const data = await changeUser.validateAsync(req.body);
        const updated = await userDataChange({ id, data });
        return res.json(updated);
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}

const deleteMember = async (req, res) => {
    try {
        const { role } = await emailFinder(req.user.email);
        if (role !== 'manager') throw new Error ('You are not authorize to make changes');

        const { id } = await objectIdChecker.validateAsync(req.params);
        if (!objectID.isValid(id)) throw new Error( 'Enter proper data');

        const { team } = await findUserById(id);
        await employeeTaskUpdation(id);
        await employeeTeamRemoval(team, id);

        const deleted = await deleteUser(id);
        return res.json(deleted);
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}

const allTask = async (req, res) => {
    try {
        const { tasks } = await emailFinder(req.user.email);
        return res.json(tasks);
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}

const newTask = async (req, res) => {
    try {
        const { _id: managerId, role } = await emailFinder(req.user.email);
        if (role !== 'manager') throw new Error( 'You are not authorized to make changes');

        const taskDetails = await taskChecker.validateAsync(req.body);
        if (taskDetails.assignee && !objectID.isValid(taskDetails.assignee)) throw new Error( 'Enter a valid assignee id');

        const due_date = new Date(taskDetails.due_date);
        const task = await taskCreation({ ...taskDetails, due_date, created_by: managerId });
        await updateUserTasks({ id: managerId, taskId: task._id });
        if (taskDetails.assignee) await updateUserTasks({ id: taskDetails.assignee, taskId: task._id });

        return res.json( task);
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}

const updateTask = async (req, res) => {
    try {
        const { _id: managerId, role } = await emailFinder(req.user.email);
        if (role !== 'manager') throw new Error('You are not authorized');

        const { id } = await objectIdChecker.validateAsync(req.params);
        if (!objectID.isValid(id)) throw customError(400, 'Enter proper data');

        const newTaskDetails = await taskChecker.validateAsync(req.body);
        if (newTaskDetails.assignee) {
            if (!objectID.isValid(newTaskDetails.assignee)) throw new Error('Enter proper data');
            await removeTaskFromAssignee(id);
        }

        const task = await updateTaskDetails(id, {
            ...newTaskDetails,
            ...newTaskDetails.due_date && { due_date: new Date(newTaskDetails.due_date) }
        });
        if (newTaskDetails.assignee) await updateUserTasks({ id: newTaskDetails.assignee, taskId: task._id });

        return res.json( task);
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}

const deleteTask = async (req, res) => {
    try {
        const { _id: managerId, role } = await emailFinder(req.user.email);
        if (role !== 'manager') throw new Error ('You are not authorized to make changes');

        const { id: taskId } = await objectIdChecker.validateAsync(req.params);
        if (!objectID.isValid(taskId)) throw new Error( 'Enter proper data');

        await removeTaskFromAssignee(taskId);
        await userTaskRemoval(managerId, taskId);

        const deleted = await taskDeletion(taskId);
        return sendOK(res, deleted);
    } catch (e) {
        return res.status(400).json({ message: e.message })
    }
}


module.exports = {
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
}