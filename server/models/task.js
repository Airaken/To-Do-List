const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let taskStatus = {
    values: ['OPEN', 'IN-PROGRESS', 'COMPLETED', 'ARCHIVED'],
    message: '{VALUE} it is not a valid status'
};

let taskSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is requiered']
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: String,
        default: 'OPEN',
        enum: taskStatus
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Task', taskSchema);