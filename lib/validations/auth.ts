import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z
    .string()
    .min(8, "הסיסמה חייבת להכיל לפחות 8 תווים")
    .regex(/[a-zA-Z]/, "הסיסמה חייבת להכיל לפחות אות אחת")
    .regex(/[0-9]/, "הסיסמה חייבת להכיל לפחות ספרה אחת"),
});

export const signInSchema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(1, "יש להזין סיסמה"),
});
