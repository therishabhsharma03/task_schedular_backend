const mongoose = require("mongoose");

const completedTaskSchema = new mongoose.Schema({
    userid:{type:String},
    task:{type:String, required: true},
    label:{type:String, required: true},
    dueDate:{type: Date, required: true}
},{
    collection: "completed"
})

module.exports = mongoose.model("completedTaskSchema", completedTaskSchema);