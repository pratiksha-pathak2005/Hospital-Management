import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IDoctor } from "../models/Doctor";
import { SECRET_KEY } from "./jsonWebToken-Config";

const signupController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    
    const { firstName, lastName, email, mobNumber, NIC, DOB, gender, specialty, experience, password   } = req.body;
    
    
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    
    const newUser: IDoctor = new User({ firstName,lastName, email, mobNumber, NIC, DOB, gender, experience, specialty, password: hashedPassword });
    await newUser.save();
    console.log(newUser)
    
    // Generate a JWT token
    const token = jwt.sign({ email }, SECRET_KEY);
    
    res.status(201).json({ token });
  } catch (error) {
    next(error); 
  }
};

export default signupController;
