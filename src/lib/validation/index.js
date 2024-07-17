import { z } from "zod"

export const SignUpValidation = z.object({
    name: z.string().min(2, {message: "Name is too short"}),
    username: z.string().min(2, {message: "username must be at least 3 characters"}),
    email: z.string().email(),
    password: z.string().min(8, {message: "password must be at least 8 characters"}),
  })

export const SignInValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, {message: "password must be at least 8 characters"}),
})

const fileValidation = z.custom((val) => Array.isArray(val) && val.every(file => file instanceof File), {
  message: "Invalid file array",
});

export const PostValidation = z.object({
  content: z.string().min(5).max(2000),
  file: fileValidation,
  location: z.string().min(2).max(100),
  tags: z.string()
})

export const ProfileValidation = z.object({
  file: fileValidation,
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
  roleType: z.string(),
})


export const bookingSchema = z.object({
  dateAndTime: z.date(),
  userLimit: z.number().min(1, "User limit must be at least 1"),
});