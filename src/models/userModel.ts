import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Unique,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";

@Table({
  tableName: "users",
  timestamps: true, // ใช้ timestamps สำหรับ createdAt และ updatedAt
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export class User extends Model<User> {
  @PrimaryKey
  @Default(uuidv4) // ใช้ UUID เป็น Primary Key
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  id!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  full_name!: string;

  @Unique
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  username!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  status!: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  failed_login_attempts!: number;
}
