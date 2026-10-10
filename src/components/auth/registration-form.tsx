"use client";

import { Building2, Eye, EyeOff, LoaderCircle, UserPlus } from "lucide-react";
import { useActionState, useState } from "react";

import { registerAction } from "@/app/(auth)/register/actions";
import { Button } from "@/components/ui/button";
import type { RegistrationActionState } from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

const initialState: RegistrationActionState = { status: "idle" };
const inputClass = "mt-2 h-12 w-full rounded-xl border border-ink/15 bg-white px-4 text-sm font-medium text-ink outline-none transition placeholder:text-ink/30 focus:border-teal focus:ring-4 focus:ring-teal/10 aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500/10";

type FieldProps = {
  label: string;
  name: keyof NonNullable<RegistrationActionState["values"]>;
  error?: string;
  defaultValue?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
};

function Field({ label, name, error, ...props }: FieldProps) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label className="text-sm font-bold text-ink" htmlFor={name}>{label}</label>
      <input
        {...props}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        className={inputClass}
        id={name}
        name={name}
      />
      {error ? <p className="mt-1.5 text-xs font-semibold text-red-700" id={errorId}>{error}</p> : null}
    </div>
  );
}

export function RegistrationForm({ role }: { role: "BUYER" | "SUPPLIER" }) {
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const errors = state.fieldErrors;
  const value = (field: keyof NonNullable<RegistrationActionState["values"]>) => state.values?.[field];

  return (
    <form action={formAction} className="mt-7 space-y-5" noValidate>
      <input name="role" type="hidden" value={role} />
      {state.message ? (
        <div className="rounded-xl border border-red-600/15 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800" role="alert">{state.message}</div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field autoComplete="given-name" defaultValue={value("firstName")} error={errors?.firstName?.[0]} label="First name" maxLength={60} name="firstName" placeholder="Ayesha" required />
        <Field autoComplete="family-name" defaultValue={value("lastName")} error={errors?.lastName?.[0]} label="Last name" maxLength={60} name="lastName" placeholder="Rahman" required />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field autoComplete="email" defaultValue={value("email")} error={errors?.email?.[0]} label="Work email" maxLength={254} name="email" placeholder="you@company.com" required type="email" />
        <Field autoComplete="tel" defaultValue={value("phone")} error={errors?.phone?.[0]} label="Phone (optional)" maxLength={30} name="phone" placeholder="+880 1..." type="tel" />
      </div>
      <Field autoComplete="organization" defaultValue={value("companyName")} error={errors?.companyName?.[0]} label="Company name" maxLength={160} name="companyName" placeholder="Your company" required />
      <Field defaultValue={value("legalName")} error={errors?.legalName?.[0]} label="Legal name (optional)" maxLength={180} name="legalName" placeholder="Registered business name" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field autoComplete="address-level2" defaultValue={value("city")} error={errors?.city?.[0]} label="City (optional)" maxLength={100} name="city" placeholder="Dhaka" />
        <Field autoComplete="country-name" defaultValue={value("country") ?? "Bangladesh"} error={errors?.country?.[0]} label="Country (optional)" maxLength={100} name="country" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {(["password", "confirmPassword"] as const).map((name) => {
          const error = errors?.[name]?.[0];
          return (
            <div key={name}>
              <label className="text-sm font-bold text-ink" htmlFor={name}>{name === "password" ? "Password" : "Confirm password"}</label>
              <div className="relative">
                <input aria-describedby={error ? `${name}-error` : undefined} aria-invalid={Boolean(error)} autoComplete="new-password" className={cn(inputClass, "pr-12")} id={name} maxLength={72} minLength={8} name={name} placeholder={name === "password" ? "8+ strong characters" : "Repeat password"} required type={showPassword ? "text" : "password"} />
                {name === "password" ? (
                  <button aria-label={showPassword ? "Hide passwords" : "Show passwords"} className="absolute right-2 top-[calc(50%+0.25rem)] flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-ink/40 hover:bg-ink/5" onClick={() => setShowPassword((current) => !current)} type="button">
                    {showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
                  </button>
                ) : null}
              </div>
              {error ? <p className="mt-1.5 text-xs font-semibold text-red-700" id={`${name}-error`}>{error}</p> : null}
            </div>
          );
        })}
      </div>

      <p className="text-xs leading-5 text-ink/45">Use 8-72 characters with uppercase, lowercase, a number, and a special character.</p>
      <Button className="h-13 w-full" disabled={pending} size="lg" type="submit">
        {pending ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : role === "BUYER" ? <UserPlus aria-hidden="true" /> : <Building2 aria-hidden="true" />}
        {pending ? "Creating account..." : `Create ${role.toLowerCase()} account`}
      </Button>
      <p className="text-center text-xs leading-5 text-ink/45">By continuing, you agree to use ProcuraX responsibly and keep your organization details accurate.</p>
    </form>
  );
}
