import "server-only";

import type { LoginInput, UserRole } from "@/lib/auth/contracts";

const defaultDemoCredentials: Record<UserRole, LoginInput> = {
  BUYER: {
    email: "buyer@example.com",
    password: "StrongPass123!",
  },
  SUPPLIER: {
    email: "supplier@example.com",
    password: "StrongPass123!",
  },
  ADMIN: {
    email: "admin@procurax.local",
    password: "AdminPass123!",
  },
};

const environmentKeys: Record<UserRole, { email: string; password: string }> = {
  BUYER: { email: "DEMO_BUYER_EMAIL", password: "DEMO_BUYER_PASSWORD" },
  SUPPLIER: { email: "DEMO_SUPPLIER_EMAIL", password: "DEMO_SUPPLIER_PASSWORD" },
  ADMIN: { email: "DEMO_ADMIN_EMAIL", password: "DEMO_ADMIN_PASSWORD" },
};

export function isDemoAccessEnabled() {
  return process.env.DEMO_ACCESS_ENABLED?.trim().toLowerCase() !== "false";
}

export function getDemoCredentials(role: UserRole): LoginInput | null {
  if (!isDemoAccessEnabled()) return null;

  const keys = environmentKeys[role];
  return {
    email: process.env[keys.email]?.trim() || defaultDemoCredentials[role].email,
    password: process.env[keys.password] || defaultDemoCredentials[role].password,
  };
}
