const {Schema,model} = require('mongoose');

const users = new Schema({
    name: String,
    lname: String,

    email: {
        type: String,
        unique: true,
    },
    phone: {
        type: String,
        unique: true,
    },
    token: String,
    tokenExp: Date,
    avatar: String,
    img: String,
    address: String,
    city: String,
    index: String,
    loginDate: [Date],
    payment: {
        type: Number,
        default: 0,
    },
    delivery: {
        type: Number,
        default: 0,
    },
    login: {
        type: String,
    },
    password: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


module.exports = model('Users',users)