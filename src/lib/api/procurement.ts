import { cacheLife } from "next/cache";
import { z } from "zod";

import { getApiBaseUrl } from "@/lib/api/config";

const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
});

const supplierCategorySchema = categorySchema.pick({ id: true, name: true, slug: true });

const supplierSchema = z.object({
  id: z.string().uuid(),
  companyName: z.string(),
  legalName: z.string().nullable(),
  website: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  verificationStatus: z.literal("VERIFIED"),
  verifiedAt: z.string().nullable(),
  createdAt: z.string(),
  categories: z.array(supplierCategorySchema),
  user: z.object({
    firstName: z.string(),
    lastName: z.string(),
    avatarUrl: z.string().nullable(),
  }),
});

const paginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

const categoryListResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    items: z.array(categorySchema),
    pagination: paginationSchema,
  }),
});

const supplierListResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    items: z.array(supplierSchema),
    pagination: paginationSchema,
  }),
});

const supplierResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: supplierSchema,
});

export type ProcurementCategory = z.infer<typeof categorySchema>;
export type VerifiedSupplier = z.infer<typeof supplierSchema>;

export type SupplierDirectoryFilters = {
  search?: string;
  category?: string;
  city?: string;
  country?: string;
  page: number;
  limit: number;
};

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

function readApiMessage(payload: unknown) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  return null;
}

async function requestJson<TSchema extends z.ZodType>(path: string, schema: TSchema) {
  const url = new URL(path, getApiBaseUrl());
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiRequestError(
      readApiMessage(payload) ?? `ProcuraX API request failed with status ${response.status}.`,
      response.status,
    );
  }

  const parsedPayload = schema.safeParse(payload);

  if (!parsedPayload.success) {
    throw new ApiRequestError("The ProcuraX API returned an unexpected response.", 502);
  }

  return parsedPayload.data;
}

export async function getProcurementCategories() {
  "use cache";
  cacheLife("hours");

  const response = await requestJson("categories?limit=50", categoryListResponseSchema);
  return response.data.items;
}

export async function getVerifiedSuppliers(filters: SupplierDirectoryFilters) {
  "use cache";
  cacheLife("minutes");

  const query = new URLSearchParams({
    page: String(filters.page),
    limit: String(filters.limit),
  });

  if (filters.search) query.set("search", filters.search);
  if (filters.category) query.set("category", filters.category);
  if (filters.city) query.set("city", filters.city);
  if (filters.country) query.set("country", filters.country);

  const response = await requestJson(`suppliers?${query.toString()}`, supplierListResponseSchema);
  return response.data;
}

export async function getVerifiedSupplier(supplierId: string) {
  "use cache";
  cacheLife("minutes");

  const response = await requestJson(
    `suppliers/${encodeURIComponent(supplierId)}`,
    supplierResponseSchema,
  );
  return response.data;
}
