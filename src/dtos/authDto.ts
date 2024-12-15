import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1, "Product name is required."),
  password: z.string().min(1, "Product name is required."),
});

export type LoginDto = z.infer<typeof LoginSchema>;
