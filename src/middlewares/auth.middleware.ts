import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IUser, JwtPayload } from "../interfaces/index";
import { GetUserParams } from "../interfaces/user.interface";


export const authenticateUser = async (
    req: Request<GetUserParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.headers.authorization?.startsWith("Bearer")) {
      res.status(401).json({
        status: 401,
        success: false,
        message: "Not authorized, no token",
      });
      return;
    }
  
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      
      const user = await User.findById(decoded.id).select("-password").lean();
      
      if (!user) {
        res.status(401).json({
          status: 401,
          success: false,
          message: "User not found",
        });
        return;
      }
  
      req.user = user as unknown as IUser;
      next();
    } catch (error) {
      console.error("Error authenticating user:", error);
      res.status(401).json({
        status: 401,
        success: false,
        message: "Not authorized, token failed",
      });
      return;
    }
};