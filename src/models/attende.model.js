const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define the attende Schema
const attendeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    organizationName: {
        type: String,
    },
    organizationLogo: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          'Please enter a valid email address'
        ]
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['creator', 'attendee'],
        required: true
    },
    isComplete: {
        type: Boolean,
        default: false
    },
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    eventCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    eventsAttended: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    tickets: [{
        event:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        },
        ticketNumber: {
            type: String,
            required: true
        }
    }],
}, { timestamps: true });

// Pre-save hook to hash the password before saving
attendeSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare entered password with hashed password
attendeSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
attendeSchema.methods.generateJWT = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const attendeModel = mongoose.model('attende', attendeSchema);

module.exports = attendeModel;
