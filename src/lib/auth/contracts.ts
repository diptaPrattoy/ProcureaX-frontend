import { z } from "zod";

export const userRoleSchema = z.enum(["BUYER", "SUPPLIER", "ADMIN"]);
export const accountStatusSchema = z.enum(["ACTIVE", "SUSPENDED", "DEACTIVATED"]);
export const supplierVerificationStatusSchema = z.enum(["PENDING", "VERIFIED", "REJECTED"]);

const nullableText = z.string().nullable();

const buyerProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  companyName: z.string(),
  legalName: nullableText,
  city: nullableText,
  state: nullableText,
  country: nullableText,
});

const supplierProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  companyName: z.string(),
  legalName: nullableText,
  city: nullableText,
  state: nullableText,
  country: nullableText,
  verificationStatus: supplierVerificationStatusSchema,
  verificationNote: nullableText,
  verifiedAt: nullableText,
});

export const publicUserSchema = z.object({
  id: z.string().uuid(),
  email: z.email(),
  role: userRoleSchema,
  status: accountStatusSchema,
  firstName: z.string(),
  lastName: z.string(),
  phone: nullableText,
  avatarUrl: nullableText,
  emailVerifiedAt: nullableText,
  lastLoginAt: nullableText,
  createdAt: z.string(),
  buyerProfile: buyerProfileSchema.nullable(),
  supplierProfile: supplierProfileSchema.nullable(),
});

export const authTokensSchema = z.object({
  tokenType: z.literal("Bearer"),
  accessToken: z.string().min(1),
  refreshToken: z.string().min(32),
});

export const authSessionSchema = z.object({
  user: publicUserSchema,
  tokens: authTokensSchema,
});

const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address."));

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(72, "Password must be at most 72 characters.")
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[a-z]/, "Password must include a lowercase letter.")
  .regex(/[0-9]/, "Password must include a number.")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character.");

export const loginInputSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});

const commonRegistrationFields = {
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(2).max(60),
  email: emailSchema,
  password: passwordSchema,
  phone: z.string().trim().min(7).max(30).optional(),
  companyName: z.string().trim().min(2).max(160),
  legalName: z.string().trim().min(2).max(180).optional(),
  city: z.string().trim().min(2).max(100).optional(),
  country: z.string().trim().min(2).max(100).optional(),
};

export const buyerRegistrationInputSchema = z.object(commonRegistrationFields);
export const supplierRegistrationInputSchema = z.object(commonRegistrationFields);

export const googleAuthInputSchema = z.object({
  credential: z.string().trim().min(20),
  role: z.enum(["BUYER", "SUPPLIER"]).optional(),
  companyName: z.string().trim().min(2).max(160).optional(),
  legalName: z.string().trim().min(2).max(180).optional(),
  city: z.string().trim().min(2).max(100).optional(),
  country: z.string().trim().min(2).max(100).optional(),
});

export const emailInputSchema = z.object({ email: emailSchema });
export const verifyEmailInputSchema = z.object({ token: z.string().trim().min(32) });
export const resetPasswordInputSchema = z.object({
  token: z.string().trim().min(32),
  newPassword: passwordSchema,
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>;
export type AuthSession = z.infer<typeof authSessionSchema>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type BuyerRegistrationInput = z.infer<typeof buyerRegistrationInputSchema>;
export type SupplierRegistrationInput = z.infer<typeof supplierRegistrationInputSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthInputSchema>;
export type EmailInput = z.infer<typeof emailInputSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailInputSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;

export type SessionSnapshot =
  | { authenticated: true; user: PublicUser }
  | { authenticated: false; user: null };
