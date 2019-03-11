const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let taskSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is requiered']
    },
    description: {
        type: String,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Task', taskSchema);