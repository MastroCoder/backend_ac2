const bcrypt = require("bcrypt");
const { randomUUID } = require("crypto");
const express = require("express");
const UserModel = require("./../models/User");
const auth = require("./../middlewares/auth");

const usersRouter = express.Router();

// Get all users
usersRouter.get("/", auth, async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

usersRouter.get("/count", auth, async (req, res) => {
  try {
    const users_count = await UserModel.countDocuments();
    res.status(200).json({count: users_count});
  } catch (error) {
    res.status(500).json({error: error})
  }
});

usersRouter.get("/count-occupations", auth, async (req, res) => {
  try {
    const frontend = await UserModel.countDocuments({
      occupation: "Engenheiro de FE",
    });
    const backend = await UserModel.countDocuments({
      occupation: "Engenheiro de BE",
    });
    const dataAnalysts = await UserModel.countDocuments({
      occupation: "Analista de dados",
    });
    const techLeads = await UserModel.countDocuments({
      occupation: "Líder técnico",
    });
    const count = {
      count_frontend_engineers: frontend,
      count_backend_engineers: backend,
      count_data_analysts: dataAnalysts,
      count_tech_leads: techLeads,
    };
    res.status(200).json(count);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

usersRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: randomUUID(),
    name,
    email,
    password: hashedPassword,
  };
  try {
    await UserModel.create(user);
    res.status(201).json(user);
  } catch (error) {
    res.status(501).json({ error: error });
  }
});

// Momentaneamente sem autenticação
usersRouter.post("/new", auth, async (req, res) => {
  const { name, email, occupation, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: randomUUID(),
    name,
    email,
    occupation,
    password: hashedPassword,
  };
  try {
    await UserModel.create(user);
    res.status(201).json(user);
  } catch (error) {
    res.status(501).json({ error: error });
  }
});

// Get user by id
usersRouter.get("/:id", auth, async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.find({ id: id });
    res.status(201).json(user);
  } catch (error) {
    res.status(501).json({ error: error });
  }
});

// Edit user
usersRouter.put("/:id", auth, async (req, res) => {
  const id = req.params.id;
  const { name, email, occupation, password } = req.body;
  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserModel.findOneAndUpdate(
        { id: id },
        {
          name: name,
          email: email,
          occupation: occupation,
          password: hashedPassword,
        }
      );
      res.status(201).json(user);
    } else {
      const user = await UserModel.findOneAndUpdate(
        { id: id },
        {
          name: name,
          email: email,
          occupation: occupation,
        }
      );
      res.status(201).json(user);
    }
  } catch (error) {
    res.status(501).json({ error: error });
  }
});

// Delete user
usersRouter.delete("/:id", auth, async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findOneAndDelete({ id: id });
    res.status(201).json(user);
  } catch (error) {
    res.status(501).json({ error: error });
  }
});

module.exports = usersRouter;
