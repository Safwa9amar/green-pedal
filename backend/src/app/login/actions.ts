"use server";
import {FormState, LoginFormSchema} from "./definitaions"
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt"

export async function login(state : FormState ,formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    email : formData.get("email"),
    password : formData.get("password")
  })
  if(!validatedFields.success) return {
    errors : validatedFields.error.flatten().fieldErrors
  }
  // console.log(await bcrypt.hash("hamza", 10));
  console.log(state);
  
  
}
