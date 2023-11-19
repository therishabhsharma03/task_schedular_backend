const express = require("express");
const completedTaskSchema = require("../model/completedTaskSchema");
const mongoose = require("mongoose");

const completedTaskRoute = express.Router();

completedTaskRoute.post("/create-task",(req,res)=>{
    completedTaskSchema.create(req.body,(err,data)=>{
        if(err){
            return err;
        }
        else{
            console.log(data);
            res.json(data);
        }
    })
});


completedTaskRoute.get("/:userId/tasks", async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("this worked");
        // Fetch tasks from the database for the specified user ID
        const tasks = await completedTaskSchema.find({ userid: userId });

        // Respond with the tasks in JSON format
        res.status(200).json(tasks);
    } catch (error) {
        // Handle any errors during the database query
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

completedTaskRoute.route("/update-task/:id")
.get((req,res)=>{
    completedTaskSchema.find(mongoose.Types.ObjectId(req.params.id),(err,data)=>{
        if(err){
            return err;
        }
        else{
            res.json(data);
        }
    })
})
.put((req,res)=>{
    completedTaskSchema.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id),
    {$set: req.body},
    (err,data)=>{
        if(err) {
            return err;
        }
        else{
            res.json(data);
        }
    })
});


completedTaskRoute.delete("/delete-task/:id", (req,res)=>{
    
    completedTaskSchema.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id),(err,data)=>{
        if(err){
            return err;
        }
        else{
            console.log(data)
            res.json(data);
        }
    })
});

completedTaskRoute.delete("/delete-all-tasks", async (req, res) => {
    try {
        // Use the deleteMany function to delete all documents in the collection
        const result = await completedTaskSchema.deleteMany();

        // Check if any documents were deleted
        if (result.deletedCount > 0) {
            res.status(200).json({ message: "All tasks deleted successfully." });
        } else {
            res.status(404).json({ message: "No tasks found to delete." });
        }
    } catch (error) {
        // Handle errors, and send an appropriate response
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
module.exports = completedTaskRoute;