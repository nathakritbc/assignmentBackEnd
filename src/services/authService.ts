import { User } from "../models/userModel";
import { LoginDto } from "../dtos/authDto";
import { UserDto } from "../dtos/userDto";
import * as crypto from "crypto-js";
import jwt from "jsonwebtoken";
import { hashSecret } from "../config/hash";
import validator from "validator";

const hashPassword = (password: string): string => {
  return crypto.SHA256(password).toString();
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

const isStrongPassword = (password: string): boolean => {
  return validator.isStrongPassword(password, {
    minLength: 8, // ต้องมีความยาวอย่างน้อย 8 ตัว
    minLowercase: 1, // ต้องมีตัวอักษรภาษาอังกฤษพิมพ์เล็กอย่างน้อย 1 ตัว
    minUppercase: 1, // ต้องมีตัวอักษรภาษาอังกฤษพิมพ์ใหญ่อย่างน้อย 1 ตัว
    minNumbers: 1, // ต้องมีตัวเลขอย่างน้อย 1 ตัว
    minSymbols: 1, // ต้องมีสัญลักษณ์พิเศษอย่างน้อย 1 ตัว
  });
};

const incrementFailedLoginAttempts = async (
  username: string,
  oldFailedLoginAttempts: number
) => {
  try {
    return await User.update(
      { failed_login_attempts: oldFailedLoginAttempts + 1 },
      { where: { username } }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const disableUserAccount = async (username: string) => {
  try {
    return await User.update({ status: false }, { where: { username } });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const resetFailedLoginAttempts = async (username: string) => {
  try {
    return await User.update(
      { failed_login_attempts: 0 },
      { where: { username } }
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const login = async (dto: LoginDto) => {
  try {
    const user: User | null = await User.findOne({
      where: {
        username: dto.username,
      },
    });

    // เช็กว่ามี username นี้ในระบบหรือไม่
    if (!user) throw new Error("invalid username");

    // เช็ก สถานะของ user
    if (!user?.status) throw new Error("account locked");

    // user ถูกล็อก เนื่องจากกรอกรหัสผ่านผิดเกิน 5 ครั้ง
    if (user && user.failed_login_attempts >= 5) {
      await disableUserAccount(user.username);
      throw new Error("account locked");
    }

    // เช็คว่ารหัสผ่านถูกต้อง
    if (!verifyPassword(dto.password, user.password)) {
      await incrementFailedLoginAttempts(
        dto.username,
        Number(user.failed_login_attempts)
      );
      throw new Error("invalid password");
    }

    // สร้าง token
    const token = jwt.sign(
      {
        ...user.dataValues,
        password: "",
      },
      hashSecret,
      {
        expiresIn: "1d", // 1 day
      }
    );

    const result = {
      ...user.dataValues,
      password: "",
      failed_login_attempts: 0,
      token,
    };

    // reset failed login attempts  เมื่อ login สําเร็จ
    resetFailedLoginAttempts(dto.username);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const register = async (dto: UserDto) => {
  try {
    const foundUser: UserDto | null = await User.findOne({
      where: {
        username: dto.username,
      },
    });

    // เช็กว่ามีการใช้ username นี้สมัครสมาชิกแล้วหรือไม่
    if (foundUser) throw new Error("user already exists");

    if (!isStrongPassword(dto.password)) {
      throw new Error("password is not strong enough");
    }

    const hashedPassword = hashPassword(dto.password);
    const payload: any = {
      ...dto,
      password: hashedPassword,
    };

    // สมัครสมาชิก
    await User.create(payload);

    // return user ที่สมัคร
    const user: UserDto | null = await User.findOne({
      where: {
        username: dto.username,
      },
    });

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const AuthService = {
  login,
  register,
};
export default AuthService;
