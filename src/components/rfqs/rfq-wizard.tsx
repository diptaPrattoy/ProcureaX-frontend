"use client";

import { ArrowLeft, ArrowRight, Check, LoaderCircle, PackagePlus, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";

import { createRfqAction } from "@/app/(workspace)/buyer/rfqs/new/actions";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/rfqs/contracts";
import type { RfqFormState } from "@/lib/rfqs/form-state";
import { cn } from "@/lib/utils";

const initialState: RfqFormState = { status: "idle" };
const input = "mt-2 h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-sm font-medium text-ink outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10";
type LineItem = { itemName: string; description: string; quantity: string; unit: string };
const blankItem = (): LineItem => ({ itemName: "", description: "", quantity: "1", unit: "pcs" });

export function RfqWizard({ categories }: { categories: Category[] }) {
  const [state, action, pending] = useActionState(createRfqAction, initialState);
  const [step, setStep] = useState(0);
  const [items, setItems] = useState<LineItem[]>([blankItem()]);
  const timezoneOffset = useMemo(() => new Date().getTimezoneOffset(), []);
  const steps = ["RFQ details", "Line items", "Timeline & delivery"];
  const updateItem = (index: number, field: keyof LineItem, value: string) => setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));

  return (
    <form action={action} className="space-y-6" noValidate>
      <input name="items" type="hidden" value={JSON.stringify(items)} /><input name="timezoneOffset" type="hidden" value={timezoneOffset} />
      <ol className="grid gap-2 sm:grid-cols-3">{steps.map((label, index) => <li className={cn("flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-bold", index === step ? "border-teal bg-teal text-white" : index < step ? "border-mint bg-mint/25 text-teal" : "border-ink/10 bg-white text-ink/35")} key={label}><span className="grid size-6 place-items-center rounded-full bg-current/10 text-xs">{index < step ? <Check className="size-3.5" /> : index + 1}</span>{label}</li>)}</ol>
      {state.message ? <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{state.message}</div> : null}

      <section className={cn("rounded-[1.75rem] border border-ink/10 bg-white p-6 sm:p-8", step !== 0 && "hidden")}>
        <p className="eyebrow">Step 1</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">Define the sourcing need.</h2>
        <div className="mt-7 grid gap-5 sm:grid-cols-2"><Field error={state.fieldErrors?.title?.[0]} label="RFQ title" name="title" placeholder="Office laptop supply" required /><Select categories={categories} error={state.fieldErrors?.categoryId?.[0]} /><div className="sm:col-span-2"><Field error={state.fieldErrors?.description?.[0]} label="Description" name="description" placeholder="Describe the business need, scope, and supplier expectations" required textarea /></div><Field label="Minimum budget" name="budgetMin" placeholder="0.00" type="number" /><Field error={state.fieldErrors?.budgetMax?.[0]} label="Maximum budget" name="budgetMax" placeholder="0.00" type="number" /><div><label className="text-sm font-bold text-ink" htmlFor="currency">Currency</label><select className={input} defaultValue="BDT" id="currency" name="currency">{["BDT", "USD", "EUR", "GBP"].map((currency) => <option key={currency}>{currency}</option>)}</select></div></div>
      </section>

      <section className={cn("rounded-[1.75rem] border border-ink/10 bg-white p-6 sm:p-8", step !== 1 && "hidden")}>
        <div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Step 2</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">Add requested items.</h2></div><Button onClick={() => setItems((current) => [...current, blankItem()])} type="button" variant="outline"><Plus /> Add item</Button></div>
        {state.fieldErrors?.items?.[0] ? <p className="mt-4 text-sm font-semibold text-red-700">{state.fieldErrors.items[0]}</p> : null}
        <div className="mt-6 space-y-4">{items.map((item, index) => <article className="rounded-2xl border border-ink/10 bg-cream/60 p-4" key={index}><div className="flex items-center justify-between"><p className="text-sm font-bold text-ink">Item {index + 1}</p><Button aria-label={`Remove item ${index + 1}`} disabled={items.length === 1} onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} size="icon" type="button" variant="ghost"><Trash2 /></Button></div><div className="mt-3 grid gap-4 sm:grid-cols-[1.4fr_0.5fr_0.5fr]"><ItemInput label="Item name" onChange={(value) => updateItem(index, "itemName", value)} value={item.itemName} /><ItemInput label="Quantity" onChange={(value) => updateItem(index, "quantity", value)} type="number" value={item.quantity} /><ItemInput label="Unit" onChange={(value) => updateItem(index, "unit", value)} value={item.unit} /></div><div className="mt-4"><ItemInput label="Item description (optional)" onChange={(value) => updateItem(index, "description", value)} value={item.description} /></div></article>)}</div>
      </section>

      <section className={cn("rounded-[1.75rem] border border-ink/10 bg-white p-6 sm:p-8", step !== 2 && "hidden")}>
        <p className="eyebrow">Step 3</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">Set the response window and destination.</h2>
        <div className="mt-7 grid gap-5 sm:grid-cols-2"><Field error={state.fieldErrors?.submissionDeadline?.[0]} label="Submission deadline" name="submissionDeadline" required type="datetime-local" /><Field label="Expected delivery date" name="expectedDeliveryDate" type="date" /><div className="sm:col-span-2"><Field label="Delivery address" name="deliveryAddressLine1" placeholder="Street and building" /></div><Field label="City" name="deliveryCity" placeholder="Dhaka" /><Field label="State / division" name="deliveryState" placeholder="Dhaka" /><Field label="Postal code" name="deliveryPostalCode" /><Field label="Country" name="deliveryCountry" placeholder="Bangladesh" /></div>
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-mint/25 p-4"><PackagePlus className="mt-0.5 size-5 shrink-0 text-teal" /><p className="text-sm leading-6 text-ink/60">This saves a private draft. You can review and publish it after creation.</p></div>
      </section>

      <div className="flex items-center justify-between gap-4"><Button asChild={step === 0} disabled={pending} onClick={step > 0 ? () => setStep((current) => current - 1) : undefined} type={step === 0 ? undefined : "button"} variant="ghost">{step === 0 ? <Link href="/buyer/rfqs"><ArrowLeft /> Cancel</Link> : <><ArrowLeft /> Back</>}</Button>{step < 2 ? <Button onClick={() => setStep((current) => current + 1)} type="button">Continue <ArrowRight /></Button> : <Button disabled={pending} type="submit">{pending ? <LoaderCircle className="animate-spin" /> : <Save />}{pending ? "Saving draft..." : "Save RFQ draft"}</Button>}</div>
    </form>
  );
}

function Field({ label, name, error, textarea, ...props }: { label: string; name: string; error?: string; textarea?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) { const classes = cn(input, error && "border-red-500"); return <div><label className="text-sm font-bold text-ink" htmlFor={name}>{label}</label>{textarea ? <textarea className={cn(classes, "h-32 py-3")} id={name} name={name} {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} /> : <input className={classes} id={name} name={name} {...props} />}{error ? <p className="mt-1.5 text-xs font-semibold text-red-700">{error}</p> : null}</div>; }
function Select({ categories, error }: { categories: Category[]; error?: string }) { return <div><label className="text-sm font-bold text-ink" htmlFor="categoryId">Category</label><select className={cn(input, error && "border-red-500")} defaultValue="" id="categoryId" name="categoryId" required><option disabled value="">Choose category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>{error ? <p className="mt-1.5 text-xs font-semibold text-red-700">{error}</p> : null}</div>; }
function ItemInput({ label, onChange, value, type = "text" }: { label: string; onChange: (value: string) => void; value: string; type?: string }) { return <label className="text-xs font-bold text-ink/60">{label}<input className={input} min={type === "number" ? "0.001" : undefined} onChange={(event) => onChange(event.target.value)} type={type} value={value} /></label>; }
