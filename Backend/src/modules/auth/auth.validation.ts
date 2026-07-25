import type { LoginInput, RegisterInput } from "./auth.types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegisterInput = (input: RegisterInput): string[] => {
  const errors: string[] = [];
  const phone = input.phone.trim();

  if (!input.name.trim()) {
    errors.push("Name is required");
  }

  if (!emailPattern.test(input.email.trim())) {
    errors.push("Email format is invalid");
  }

  if (!phone) {
    errors.push("Phone number is required");
  } else if (phone.length < 10 || phone.length > 15) {
    errors.push("Phone number must be between 10 and 15 characters");
  }

  if (input.password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (input.password !== input.confirmPassword) {
    errors.push("Password confirmation does not match");
  }

  return errors;
};

export const validateLoginInput = (input: LoginInput): string[] => {
  const errors: string[] = [];

  if (!emailPattern.test(input.email.trim())) {
    errors.push("Email format is invalid");
  }

  if (!input.password.trim()) {
    errors.push("Password is required");
  }

  return errors;
};
