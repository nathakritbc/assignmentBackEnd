import "dotenv/config";
import dotenv from "dotenv";
import { Sequelize } from "sequelize-typescript";
import { User } from "../models/userModel";
import { Product } from "../models/productModel";

dotenv.config(); // โหลด environment variables จาก .env

const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "12345678";
const DB_NAME = process.env.DB_NAME || "JenosizeAssignmentBackEnd";
const DB_PORT: any = process.env.DB_PORT || 3306;

export const sequelize = new Sequelize({
  database: DB_NAME,
  dialect: "mysql",
  username: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: Number(DB_PORT),
  models: [User, Product],
  logging: true,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
    evict: 30000,
    maxUses: 10,
  },
  ssl: true,
});

const sysDB = async () => {
  try {
    // Auto migrate all models
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully");
  } catch (error) {
    console.error("Unable to sync database:", error);
  }
};

export { sysDB };
