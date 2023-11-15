const mongoose = require("mongoose");

const completedTaskSchema = new mongoose.Schema({
    userid:{type:String},
    task:{type:String},
    label:{type:String},
    dueDate:{type: Date}
},{
    collection: "completed"
})

module.exports = mongoose.model("completedTaskSchema", completedTaskSchema);