import { z } from "zod";

const optionalText = (max: number) => z.string().trim().min(1).max(max).optional();
const money = z.union([z.string(), z.number()]).transform(Number).pipe(z.number().finite().nonnegative().max(999_999_999_999.99));

export const rfqStatusSchema = z.enum(["DRAFT", "OPEN", "EVALUATING", "AWARDED", "CLOSED", "CANCELLED", "EXPIRED"]);
export const categorySchema = z.object({ id: z.uuid(), name: z.string(), slug: z.string(), description: z.string().nullable() });
export const paginationSchema = z.object({ page: z.number(), limit: z.number(), total: z.number(), totalPages: z.number() });

export const rfqListItemSchema = z.object({
  id: z.uuid(), title: z.string(), currency: z.string(), budgetMin: z.union([z.string(), z.number()]).nullable(), budgetMax: z.union([z.string(), z.number()]).nullable(),
  submissionDeadline: z.string(), expectedDeliveryDate: z.string().nullable(), deliveryCity: z.string().nullable(), deliveryCountry: z.string().nullable(), status: rfqStatusSchema,
  publishedAt: z.string().nullable(), createdAt: z.string(), category: categorySchema.pick({ id: true, name: true, slug: true }),
  buyer: z.object({ buyerProfile: z.object({ companyName: z.string() }).nullable() }),
  _count: z.object({ items: z.number(), quotations: z.number() }),
});

export const rfqDetailSchema = rfqListItemSchema.extend({
  description: z.string(),
  deliveryAddressLine1: z.string().nullable(), deliveryAddressLine2: z.string().nullable(), deliveryState: z.string().nullable(), deliveryPostalCode: z.string().nullable(),
  awardedAt: z.string().nullable(), closedAt: z.string().nullable(), cancelledAt: z.string().nullable(), updatedAt: z.string(),
  buyer: z.object({ id: z.uuid(), firstName: z.string(), lastName: z.string(), buyerProfile: z.object({ companyName: z.string(), city: z.string().nullable(), country: z.string().nullable() }).nullable() }),
  items: z.array(z.object({ id: z.uuid(), itemName: z.string(), description: z.string().nullable(), specifications: z.unknown(), quantity: z.union([z.string(), z.number()]), unit: z.string(), createdAt: z.string(), updatedAt: z.string() })),
});

export const createRfqInputSchema = z.object({
  categoryId: z.uuid("Choose a procurement category."),
  title: z.string().trim().min(5, "Use at least 5 characters.").max(180),
  description: z.string().trim().min(10, "Use at least 10 characters.").max(5000),
  currency: z.string().trim().length(3).transform((value) => value.toUpperCase()),
  budgetMin: money.optional(), budgetMax: money.optional(),
  submissionDeadline: z.iso.datetime({ offset: true }), expectedDeliveryDate: z.iso.date().optional(),
  deliveryAddressLine1: optionalText(180), deliveryAddressLine2: optionalText(180), deliveryCity: optionalText(100), deliveryState: optionalText(100), deliveryPostalCode: optionalText(30), deliveryCountry: optionalText(100),
  items: z.array(z.object({ itemName: z.string().trim().min(2).max(180), description: optionalText(2000), quantity: z.coerce.number().positive().max(999_999_999.999), unit: z.string().trim().min(1).max(40) })).min(1).max(50),
}).superRefine((value, context) => {
  if (value.budgetMin !== undefined && value.budgetMax !== undefined && value.budgetMin > value.budgetMax) context.addIssue({ code: "custom", path: ["budgetMax"], message: "Maximum budget must be at least the minimum budget." });
  if (new Date(value.submissionDeadline) <= new Date()) context.addIssue({ code: "custom", path: ["submissionDeadline"], message: "Choose a future deadline." });
});

export type CreateRfqInput = z.infer<typeof createRfqInputSchema>;
export type RfqListItem = z.infer<typeof rfqListItemSchema>;
export type RfqDetail = z.infer<typeof rfqDetailSchema>;
export type Category = z.infer<typeof categorySchema>;
