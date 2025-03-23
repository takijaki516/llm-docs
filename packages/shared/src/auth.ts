import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signUpUserSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });
