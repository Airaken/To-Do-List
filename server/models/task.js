const mongoose = require('mongoose');
let Schema = mongoose.Schema;
// creat a status value for valitate it
let taskStatus = {
    values: ['OPEN', 'IN-PROGRESS', 'COMPLETED', 'ARCHIVED'],
    message: '{VALUE} it is not a valid status'
};
// creates a new schema of task
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
    },
    users: {
        type: Array,
        required: false
    }
});
// export the model
module.exports = mongoose.model('Task', taskSchema);