const express = require("express");
const userRoute= express.Router();
const userSchema = require('../model/userSchema');

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

userRoute.post('/register',(req,res)=>{
   try{
    const newUser = new userSchema(req.body)
    newUser.save()
    res.status(201).json({
        success:true,
        newUser 
    })
   }
   catch(error){
    res.status(400).json({
        success:false,
        error
    })
   }

})
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