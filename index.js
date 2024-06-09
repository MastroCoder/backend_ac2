require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require('cors');
const auth = require("./middlewares/auth");

const app = express();
app.use(express.json());
app.use(cors())

// Credenciais do banco de dados
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

const usersRoute = require("./controllers/UserController");
const loginRoute = require("./controllers/login");
const tasksRoute = require("./controllers/TaskController");

app.use("/users", usersRoute);
app.use("/login", loginRoute);
app.use("/tasks", auth, tasksRoute);

// Conexão com o MongoDB
mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPass}@cluster0.psbecnn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    app.listen(5555);
    console.log("Conectou ao banco");
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Bem-vindo à API!" });
});
