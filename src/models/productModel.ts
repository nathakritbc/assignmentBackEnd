import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from "sequelize-typescript";
import { v4 as uuidv4 } from "uuid";

@Table({
  tableName: "products",
  timestamps: true, // ใช้ timestamps สำหรับ createdAt และ updatedAt
  createdAt: "created_at",
  updatedAt: "updated_at",
})
export class Product extends Model<Product> {
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
  name!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  stock_quantity!: number;
}
