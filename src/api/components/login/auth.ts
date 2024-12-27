import { Router } from "express";
import { User } from "../../../models/User";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const loginRoutes = Router();

loginRoutes.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    const exisitingUser = await User.findOne({
      email,
    });
    if (exisitingUser) {
      return res.status(400).send({
        message: "User already exists",
      });
    }

    console.log("Registering user", req.body);

    if (!email || !password || !firstName || !lastName) {
      throw new Error("Missing required fields");
    }
    const hashedPassword = await bcrypt.hash(password, 14);

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || "player",
    });
    await newUser.save();
    res.status(201).send({ message: "User registered successfully!" });
  } catch (err) {
    console.log("Error registering user", err);
    res.status(500).send({
      message: "Oh no! An error has occured... Please try again later",
    });
  }
});

loginRoutes.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      username,
    });

    if (!user) {
      return res.status(401).send({
        message: "Authentiction failed, please check username",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send({
        message: "Authentiction failed, please check password",
      });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.log("Error with the JWT Secret");
      return res.status(500).send({
        message: "Oh no! An error has occured... Please try again later",
      });
    }
    const token = jwt.sign({ userId: user._id }, secret, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // SEND RESPONSE:
    res.status(200).send({
      token,
      user: {
        email: user.email,
        id: user._id,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Oh no! An error has occured... Please try again later",
    });
  }
});

loginRoutes.post("/verify", async (req, res, next) => {
  //   console.log(req);
  console.log(req.headers);
  const token = req.header("authorization");
  if (!token) {
    return res.status(401).send({ message: "Unauthorized User" });
  }
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.log("Error with the JWT Secret");
      return res.status(500).send({
        message: "Oh no! An error has occured... Please try again later",
      });
    }
    const decoded = jwt.verify(token, secret);
    return res.status(200).send(decoded);
  } catch (err) {
    res.status(400).send({ message: "Invalid Token" });
  }
});

export { loginRoutes };
