import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Product name is required."),
  price: z.number().positive("Price must be a positive number."),
  stock_quantity: z
    .number()
    .int()
    .nonnegative("Quantity must be a non-negative integer."),
});
 

export type ProductDto = z.infer<typeof ProductSchema>;
