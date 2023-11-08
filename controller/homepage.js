const express = require("express");
const homepage = express.Router();
const todoSchema = require("../model/todoSchema")

homepage.post("/create-task",(req,res)=>{
    todoSchema.create(req.body,(err,data)=>{
        if(err)
            return err;
        else
            res.json(data);
    })
});

homepage.get("/",(req,res)=>{
    todoSchema.find((err,data)=>{
        if(err)
            return err;
        else
            res.json(data);
    })
})

module.exports = homepage;