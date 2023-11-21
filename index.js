const mongoose = require("mongoose");
const express = require("express");
const cron = require('node-cron'); // Import the cron library
const moment = require("moment-timezone");
const homepage = require("./controller/homepage");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("./controller/userRoute");
const completedTaskRoute = require("./controller/completedTaskRoute");
const userSchema = require("./model/userSchema");
const todoSchema = require ("./model/todoSchema");
const app = express();

mongoose.set("strictQuery", true);
mongoose.connect("mongodb+srv://task:task12345@cluster0.m0tvowo.mongodb.net/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;

db.on("open", () => console.log("Connected to DB"));
db.on("error", () => console.log("Error occurred"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/auth", userRoute);
app.use("/homepage", homepage);
app.use("/completedTaskRoute", completedTaskRoute);

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
  
      // Use await here to get the user information
      const user = await userSchema.findOne({ _id: task.userid });
      const recipientEmail = user ? user.email : 'recipient@example.com';
      const mailOptions = {
        from: 'apicheck11@gmail.com',
        to: recipientEmail,
        subject: 'Task Reminder',
        text: `Reminder: ${task.task} is due on ${moment(task.dueDate).format('YYYY-MM-DD HH:mm')}`,
      };
  
      // Send email
      await transporter.sendMail(mailOptions);
      console.log('Reminder email sent successfully');
    } catch (error) {
      console.error('Error sending reminder email:', error);
    }
  };
  
  const scheduleReminders = () => {
    cron.schedule('* * * * *', async () => {
      try {
        // Fetch all users
        const allUsers = await userSchema.find();
  
        for (const user of allUsers) {
          // Fetch tasks due soon for the current user
          const tasksDueSoon = await todoSchema.find({
            userid: user._id,
            dueDate: {
              $gte: new Date(),
              $lt: moment().add(1, 'minutes').toDate(),
            },
          });
  
          tasksDueSoon.forEach((task) => {
            // Use await here to ensure the email is sent before moving to the next task
            sendReminderEmail(task);
          });
        }
  
        console.log("Scheduled reminders successfully.");
  
      } catch (error) {
        console.error('Error scheduling reminders:', error);
      }
    });
  };
  
  db.once("open", () => {
    scheduleReminders();
  });
  
  app.listen(4000, () => {
    console.log("Server connected at 4000");
  });
  