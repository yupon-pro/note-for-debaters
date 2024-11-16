import { z } from "zod";

const BaseScheme = z
  .object({
    name: z.string().min(3, {message: "Please input your name at least 3 letters."}),
    email: z.string().email(),
    password: z
      .string()
      .min(5, { message: "Please input your password at least 5 letters." })
      .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{5,}$/i,
      { message: "Invalid password characters." }
    ),
    confirmPassword: z.string().min(5, { message: "Please input your password at least 5 letters" }),
  });

export const SignUpScheme = BaseScheme
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword){
      ctx.addIssue({
        path: ["confirmPassword"],
        code: "custom",
        message: "The passwords did not match."
      })
    }
  });

export const SignInScheme = z.object({
  email: z.string().email(),
  password: z.string().min(5, { message: "Please input your password at least 5 letters" })
});

export const EmailScheme = SignInScheme.pick({ email: true });

export const ResetPwdScheme = BaseScheme
  .pick({ password: true, confirmPassword: true })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword){
      ctx.addIssue({
        path: ["confirmPassword"],
        code: "custom",
        message: "The passwords did not match."
      })
    }
  });;