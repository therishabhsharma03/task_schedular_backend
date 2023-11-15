const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    "userid":{type:String},
    "task":{type:String},
    "label":{type:String},
    "dueDate":{type:Date},
    "reminderDate": { type: Date }
},{
    collection:"tasks"
});

module.exports = mongoose.model("todoSchema",todoSchema);
