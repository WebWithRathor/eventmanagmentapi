const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

// Define the Event Schema
const EventSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
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
        enum: ['creator','Evente'],
        required: true
    },
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    eventCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    eventsEventd: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    tickets: [{
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        },
        ticketNumber: {
            type: String,
            required: true
        }
    }],
}, { timestamps: true });

EventSchema.pre("save", function () {

    if (!this.isModified('password')) return;

    let salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
})

EventSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

EventSchema.methods.generatejwt = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}


const EventModel = mongoose.model('Event',EventSchema);

module.exports = EventModel;
