const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let validsRole = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} it is not a valid role'
};

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is requiered']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'The email is requiered']
    },
    password: {
        type: String,
        required: [true, 'The passwrod is requiered']
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validsRole
    },
    state: {
        type: Boolean,
        default: true
    }
});

userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

userSchema.plugin(uniqueValidator, {
    message: '{PATH} most be unique'
});

module.exports = mongoose.model('User', userSchema);