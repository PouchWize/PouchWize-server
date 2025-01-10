import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import {
  CreateUserRequestBody,
  LoginUserRequestBody,
  GetUserParams,
} from "../interfaces/user.interface";
import jwt from "jsonwebtoken";

export const createUser = async (req: CreateUserRequestBody, res: Response) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ message: "Passwords do not match" });
    return;
  }

  if (password.length < 8) {
    res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
    return;
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" },
    );

    const user = newUser.toObject() as Partial<typeof newUser>;
    user.password = undefined;

    res
      .status(201)
      .json({ message: "User created successfully", data: { user, token } });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const loginUser = async (req: LoginUserRequestBody, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email/password" });
      return;
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET as string, {
      expiresIn: "30d",
    });

    const user = existingUser.toObject() as Partial<typeof existingUser>;
    user.password = undefined;

    res
      .status(200)
      .json({ message: "Login successful", data: { user, token } });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getUser = async (req: Request<GetUserParams>, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: "User ID is required" });
  }

  try {
    const existingUser = await User.findById(id);

    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const user = existingUser.toObject() as Partial<typeof existingUser>;
    user.password = undefined;

    res.status(200).json({ message: "User found", data: user });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
