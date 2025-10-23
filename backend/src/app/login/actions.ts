"use server";

import { FormState, LoginFormSchema } from "./definitaions";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

export async function login(state: FormState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  // ✅ Fake admin credentials
  const ADMIN_EMAIL = "admin@greenpedal.net";
  const ADMIN_PASSWORD = "admin";

  // Just to keep your console behavior
  console.log(await bcrypt.hash("hamza", 10));

  // ✅ Check credentials
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Redirect to dashboard after fake login success
    redirect("/dashboard");
  }

  // ❌ Invalid credentials
  return {
    errors: {
      password: ["Invalid email or password"],
    },
  };
}
