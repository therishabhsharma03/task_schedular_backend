const express = require("express");
const userRoute= express.Router();
const userSchema = require('../model/userSchema');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
//POST for Login

userRoute.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userSchema.findOne({ email, password });

        if (!user) {
            return res.status(404).send('User Not Found');
        }

        res.status(200).json({
            success: true,
            user: {
                userId: user._id, // Fix: use user._id instead of newUser._id
                username: user.username, // Fix: use user.username instead of newUser.username
                // Add other fields as needed
            }
        });
        
        console.log(user);
    } catch (error) {
        res.status(400).json({
            success: false,
            error,
        });
    }
});

//POST || Register

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
  
  const expectedOtps = {};

  const getExpectedOtp = (email) => {
    return expectedOtps[email];
  };
  
  const setExpectedOtp = (email, otp) => {
    expectedOtps[email] = otp;
  };


  userRoute.post('/register', async (req, res) => {
    try {
      const newUser = new userSchema(req.body);
      newUser.save();
  
      // Generate and store the expected OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setExpectedOtp(req.body.email, otp);
  
      // Send the OTP via nodemailer
      await sendOtpEmail(req.body.email, otp);
  
      res.status(201).json({
        success: true,
        newUser,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error,
      });
    }
  });
  
  userRoute.post('/send-otp', async (req, res) => {
    try {
      const { email } = req.body;
  
      // Generate and send OTP
      const otp = randomstring.generate({ length: 6, charset: 'numeric' });
  
      await sendOtpEmail(email, otp);
  
      res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Error sending OTP',
      });
    }
  });
  
  userRoute.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
  
    // Trim spaces from the received OTP
    const trimmedOtp = otp.trim();
  
    // Check if the received OTP matches the expected OTP
    const expectedOtp = getExpectedOtp(email);
  
    if (trimmedOtp === expectedOtp) {
      res.status(200).json({
        success: true,
        message: 'OTP verification successful',
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid OTP',
      });
    }
  });
  
  async function sendOtpEmail(email, otp) {
    const mailOptions = {
      from: 'apicheck11@gmail.com',// replace with your Gmail email address
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP for registration is ${otp}.`,
    };
  
    await transporter.sendMail(mailOptions);
  }
userRoute.get("/users",(req,res)=>{
    userSchema.find((err,data)=>{
        if(err)
            return err;
        else
            res.json(data);
    })
})

// exports 

module.exports = userRoute ;