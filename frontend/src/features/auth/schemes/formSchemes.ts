import { z } from "zod";

export const SignUpScheme = z
  .object({
    username: z.string(),
    email: z.string().email(),
    password: z
      .string()
      .min(5, { message: "Please input your password at least 5 letters" })
      .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{5,}$/i,
      { message: "Invalid password characters." }
    ),
    confirmPassword: z.string().min(5, { message: "Please input your password at least 5 letters" }),
  })
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
