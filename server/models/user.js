const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// declares the schema and the valids role
let Schema = mongoose.Schema;
let validsRole = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} it is not a valid role'
};
// creates a new schema of user
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
// this code changes method toJSON to remove the password
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
};
// validates that the email be unique
userSchema.plugin(uniqueValidator, {
    message: '{PATH} most be unique'
});
// export the model
module.exports = mongoose.model('User', userSchema);