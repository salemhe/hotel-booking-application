import * as z from "zod"

export const authSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one symbol")
    .refine((value) => !/password/i.test(value), "Password cannot contain the word 'password'"),
})

export type AuthSchema = z.infer<typeof authSchema>

export type PasswordRequirement = {
  text: string
  met: boolean
}

export function checkPasswordStrength(password: string, email: string): PasswordRequirement[] {
  return [
    {
      text: "Password Strength",
      met: password.length >= 8
    },
    {
      text: "Cannot contain your name or email address",
      met: !email || !password.toLowerCase().includes(email.split('@')[0].toLowerCase())
    },
    {
      text: "At least 8 characters",
      met: password.length >= 8
    },
    {
      text: "Contains a number or symbol",
      met: /[0-9]/.test(password) || /[^a-zA-Z0-9]/.test(password)
    }
  ]
}

