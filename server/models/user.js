const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true]
        }, 
        email: {
            type: String,
            required: [true],
            unique: true
        },
        mobile: {
            type: String,
            required: [true],
            unique: true
        },
        designation: {
            type: String,
            required: [true]
        },
        password: {
            type: String,
            required: [true],
            unique: true
        },
        team: {
            type: mongoose.Schema.ObjectId,
            ref: 'teams'
        },
        tasks: [{
            type: mongoose.Schema.ObjectId,
            ref: 'tasks'
        }]
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('users', userSchema);
Footer