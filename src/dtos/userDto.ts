import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  full_name: z.string().min(1, "Product name is required."),
  username: z.string().min(1, "Product name is required."),
  password: z.string().min(1, "Product name is required."),
  failed_login_attempts: z.number().int().nonnegative("non-negative integer."),
});

export type UserDto = z.infer<typeof UserSchema>;
