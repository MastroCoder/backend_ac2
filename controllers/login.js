const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const UserModel = require('./../models/User');

const loginRouter = express.Router();

loginRouter.post('/', async (req, res) => {
    const {email, password} = req.body;
    const user = await UserModel.findOne({email: email});
    if(!user){
        return res.status(402).json({msg: "User not found."});
    }
    if(await bcrypt.compare(password, user.password)){
        const token = jwt.sign({id: user.id, name: user.name, email: user.email}, process.env.JWT_SECRET, {expiresIn: "2d"});
        return res.status(200).json({
            msg: `Login succesful. Welcome, ${user.name}.`,
            token: token
        })
    }
    else{
        return res.status(401).json({msg: "Invalid email or password."});
    }
})

module.exports = loginRouter