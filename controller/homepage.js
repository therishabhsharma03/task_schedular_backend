const express = require("express");
const homepage = express.Router();
const todoSchema = require("../model/todoSchema")
const userSchema = require("../model/userSchema")
const mongoose = require("mongoose")
homepage.post("/create-task",(req,res)=>{
    
    todoSchema.create(req.body,(err,data)=>{
        if(err)
            return err;
        else
            res.json(data);
    })
});

homepage.get("/:userId/tasks", async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("this worked");
        // Fetch tasks from the database for the specified user ID
        const tasks = await todoSchema.find({ userid: userId });

        // Respond with the tasks in JSON format
        res.status(200).json(tasks);
    } catch (error) {
        // Handle any errors during the database query
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

homepage.post("/userTasks",async(req,res)=>{
    try{
        const Tasks = await todoSchema.find({userid:req.body.userid,});
        res.status(200).json(Tasks);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
})


// add tasks

homepage.post('/add-tasks',async(req,res)=>{
    try{
        const newTask = new todoSchema(req.body);
        await newTask.save();
        res.status(201).send("Task Created")
    }catch(err){
        console.log(err);
    }
})

// get tasks
homepage.post('/get-tasks',async(req,res)=>{
    try {
        const task = await todoSchema.find({userid:req.body.userid});
        res.status(200).json(task);
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

homepage.delete("/delete-task/:id", (req,res)=>{
    todoSchema.findByIdAndRemove(mongoose.Types.ObjectId(req.params.id),(err,data)=>{
        if(err){
            return err;
        }
        else{
            res.json(data);
        }
    })
});
module.exports = homepage;