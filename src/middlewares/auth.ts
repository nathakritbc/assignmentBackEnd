import "dotenv/config";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../types/ApiResponse";
import { hashSecret } from "../config/hash";
import { User } from "../models/userModel";
import { UUID } from "crypto";

export default async (req: Request, res: Response, next: () => void) => {
  try {
    if (!req.headers.authorization) {
      const response: ApiResponse<any> = {
        status: StatusCodes.UNAUTHORIZED,
        result: "Unauthorized",
        message: "ERROR",
        error: true,
      };
      return res.status(StatusCodes.UNAUTHORIZED).json(response);
    }

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, hashSecret);
    const id: UUID = decodedToken.id;
    const foundUser: User | null = await User.findByPk(id);

    if (!foundUser || !foundUser?.status) throw "Invalid token";

    next();
  } catch (error: any) {
    const response: ApiResponse<any> = {
      status: error.statusCode || StatusCodes.UNAUTHORIZED,
      result: error.message || "Unauthorized",
      message: "ERROR",
      error: true,
    };

    res.status(StatusCodes.UNAUTHORIZED).json(response);
  }
};
