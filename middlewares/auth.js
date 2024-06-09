const express = require('express')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({msg: "JWT not found in HTTP header."});
    }

    // Pegar somente o token do header Authorization: Bearer {{JWT}}
    const [, token] = authHeader.split(" ");
    try{
        const secret = process.env.JWT_SECRET;
        await jwt.verify(token, secret);
        next()
    }
    catch(error){
        return res.status(401).json({msg: "Invalid JWT. Might be expired or wrongly generated."});
    }
}

module.exports = auth