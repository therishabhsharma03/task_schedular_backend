const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    "task":{type:String},
    "label":{type:String},
    "dueDate":{type:Date},
    
},{
    collection:"tasks"
});

module.exports = mongoose.model("todoSchema",todoSchema);