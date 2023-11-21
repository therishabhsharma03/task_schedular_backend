const express = require("express");
const homepage = express.Router();
const todoSchema = require("../model/todoSchema")
const userSchema = require("../model/userSchema")
const mongoose = require("mongoose")
const moment = require("moment-timezone")
const cron = require('node-cron');
const nodemailer = require('nodemailer');

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
        const tasks = await todoSchema.find({ userid: userId }).sort({dueDate:1});

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

homepage.post('/add-tasks', async (req, res) => {
  try {
    const { userid, task, label, dueDate } = req.body;
    const dueDateObj = moment(dueDate).toDate();
    const reminderDate = moment(dueDateObj).subtract(1, 'days').toDate();
    const newTask = new todoSchema({
      userid: userid,
      task: task,
      label: label,
      dueDate: dueDateObj,
      reminderDate: reminderDate,
    });

    await newTask.save();

    // Send immediate reminder email to the user
    sendReminderEmail(newTask);

    res.status(201).send("Task Created");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
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





//////////////////////
const sendReminderEmail = async (task) => {
  try {
    const transporter = nodemailer.createTransport({
      // Provide your email server details here (e.g., SMTP)
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'apicheck11@gmail.com',
        pass: 'xjex rlsk vjvj ybne'
      }
    });

    const user = await userSchema.findOne({ _id: task.userid });
    const recipientEmail = user ? user.email : 'recipient@example.com';
    const mailOptions = {
      from: 'apicheck11@gmail.com',
      to: recipientEmail,
      subject: 'Task Scheduled',
      text: `Dear ${user.name},\n\n Your task "${task.task}" has been scheduled and is due on ${moment(task.dueDate).format('YYYY-MM-DD HH:mm')}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Task scheduled email sent successfully');
  } catch (error) {
    console.error('Error sending task scheduled email:', error);
  }
};
  
  // Function to schedule reminders using cron
  const scheduleReminderstoOne = () => {
    cron.schedule('* * * * 8', async () => {
      // Run this task every day at 8:00 AM
      try {
        const today = moment().startOf('day');
        const tomorrow = moment(today).add(1, 'days');
        
        // Find tasks due tomorrow
        const tasksDueTomorrow = await todoSchema.find({
          dueDate: {
            $gte: today.toDate(),
            $lt: tomorrow.toDate(),
          },
        });
        console.log("scheduled");
        
        // Send reminders for tasks due tomorrow
        tasksDueTomorrow.forEach((task) => {
          sendReminderEmail(task);
        });
      } catch (error) {
        console.error('Error scheduling reminders:', error);
      }
    });
  };

  const scheduleReminders = () => {
    cron.schedule('* * * * *', async () => {
      // Run this task every day at 8:00 AM
      try {
        const today = moment().startOf('day');
        const tomorrow = moment(today).add(1, 'days');
        
        // Fetch all users
        const allUsers = await userSchema.find();
  
        // Iterate over each user
        for (const user of allUsers) {
          // Find tasks due tomorrow for the current user
          const tasksDueTomorrow = await todoSchema.find({
            userid: user._id,
            dueDate: {
              $gte: today.toDate(),
              $lt: tomorrow.toDate(),
            },
          });
          
          // Send reminders for tasks due tomorrow for the current user
          tasksDueTomorrow.forEach((task) => {
            sendReminderEmail(task);
          });
        }
        console.log("scheduled");
  
      } catch (error) {
        console.error('Error scheduling reminders:', error);
      }
    });
  };
module.exports = homepage;