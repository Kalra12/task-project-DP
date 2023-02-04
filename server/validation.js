const Safen = require('Safen');
const joi = require('joi')
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);

const registration = joi.object({
    name: joi.string().required(),
    email: joi.string().email({ tlds: { allow: false } }).required(),
    mobile: joi.string().length(10).pattern(/^[0-9]+$/).required(),
    designation: joi.string().required(),
    password: joiPassword.string()
        .minOfUppercase(1)
        .minOfLowercase(1)
        .minOfNumeric(1),
    tasks: joi.array(),
    team: joi.string()
});

const login = joi.object({
    email: joi.string().email({ tlds: { allow: false } }).required(),
    password: joiPassword.string()
        .minOfUppercase(1)
        .minOfLowercase(1)
        .minOfNumeric(1)
});

const teamChecker = joi.object({
    team_id: joi.string()
        .pattern(/^\s*\w+(?:[^\w,]+\w+)*[^,\w]*$/)
        .min(3)
        .max(30)
        .required(),
    name: joi.string(),
    members: joi.array()
});

const changeUser = joi.object({
    name: joi.string(),
    email: joi.string().email({ tlds: { allow: false } }),
    mobile: joi.string().length(10).pattern(/^[0-9]+$/),
    designation: joi.string(),
    password: joiPassword.string()
        .minOfUppercase(1)
        .minOfLowercase(1)
        .minOfNumeric(1),
    tasks: joi.array(),
    team: joi.string()
});

const objectIdChecker = joi.object({
    id: joi.string().required()
});

const taskChecker = joi.object({
    title: joi.string(),
    description: joi.string(),
    assignee: joi.string(),
    status: joi.string(),
    priority: joi.string(),
    due_date: joi.string()
});

module.exports = {
    login,
    registration,
    taskChecker,
    login,
    changeUser,
    objectIdChecker,
    teamChecker,
}