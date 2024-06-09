const bcrypt = require("bcrypt");
const { randomUUID } = require("crypto");
const express = require("express");
const TaskModel = require("./../models/Task");
const jwt = require("jsonwebtoken");


const tasksRouter = express.Router();

tasksRouter.get("/", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ msg: "JWT not found in HTTP header." });
  }
  const [, token] = authHeader.split(" ");

  try {
    let payload = jwt.verify(token, process.env.JWT_SECRET);
    const tasksByOwner = await TaskModel.find({ owner: payload.id });
    res.status(200).json(tasksByOwner);
  } catch (error) {
    res.status(501).json({ error: error });
  }
});

// Nova tarefa para usuário logado
tasksRouter.post("/new", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ msg: "JWT not found in HTTP header." });
  }
  const [, token] = authHeader.split(" ");
  try {
    let payload = jwt.verify(token, process.env.JWT_SECRET);
    const { description, isDone } = req.body;
    const task = {
      id: randomUUID(),
      owner: payload.id,
      description,
      isDone,
    };
    await TaskModel.create(task);
    res.status(201).json(task);
  } catch (error) {
    res.status(501).json({ error: error });
  }
});

tasksRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { description, isDone } = req.body;
  try {
    const task = await TaskModel.findOneAndUpdate(
      { id: id },
      { description: description, isDone: isDone }
    );
    res.status(201).json(task);
  } catch (error) {
    res.status(501).json({ error: error });
  }
});

tasksRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try{
    const task = await TaskModel.findOneAndDelete({id: id});
    res.status(201).json(task);
  } catch (error) {
    res.status(501).json({ error: error });
  }
})

module.exports = tasksRouter;
