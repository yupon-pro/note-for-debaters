import { z } from "zod";

export const AccountScheme = z
  .object({
    name: z.string().min(3, {message: "Please input your name at least 3 letters."}).optional(),
    password: z
      .string()
      .min(5, { message: "Please input your password at least 5 letters." })
      .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{5,}$/i,
      { message: "Invalid password characters." }
    ).optional(),
    confirmPassword: z.string().min(5, { message: "Please input your password at least 5 letters" }).optional(),
  }).superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword){
      ctx.addIssue({
        path: ["confirmPassword"],
        code: "custom",
        message: "The passwords did not match."
      })
    }
  });