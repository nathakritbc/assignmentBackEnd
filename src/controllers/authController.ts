import AuthService from "../services/authService";
import { LoginSchema, LoginDto } from "../dtos/authDto";
import { UserSchema, UserDto } from "../dtos/userDto";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { ApiResponse } from "../types/ApiResponse";
const login = async (req: Request, res: Response) => {
  try {
    const id = uuid();
    const payload: LoginDto = {
      id,
      ...req.body,
    };
    const userData: LoginDto = LoginSchema.parse(payload);
    const item: any = await AuthService.login(userData);

    const response: ApiResponse<LoginDto> = {
      status: StatusCodes.OK,
      result: item,
      message: "SUCCESS",
      error: false,
    };

    res.status(StatusCodes.OK).json(response);
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

const register = async (req: Request, res: Response) => {
  try {
    const id = uuid();
    const payload: UserDto = {
      id,
      ...req.body,
      failed_login_attempts: 0,
    };
    const userData: UserDto = UserSchema.parse(payload);
    const item: UserDto | null = await AuthService.register(userData);
    if (item?.password) item.password = "";

    const response: ApiResponse<UserDto | null> = {
      status: StatusCodes.CREATED,
      result: item,
      message: "SUCCESS",
      error: false,
    };

    res.status(StatusCodes.CREATED).json(response);
  } catch (error: any) {
    const response: ApiResponse<any> = {
      status: error.statusCode || StatusCodes.BAD_REQUEST,
      result: error.message || "register user not found",
      message: "ERROR",
      error: true,
    };

    res.status(StatusCodes.BAD_REQUEST).json(response);
  }
};

export { login, register };
