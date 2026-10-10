"use client";

import { Eye, EyeOff, LoaderCircle, LockKeyhole, LogIn, Mail } from "lucide-react";
import { useActionState, useState } from "react";

import { loginAction } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import type { LoginActionState } from "@/lib/auth/form-state";
import { cn } from "@/lib/utils";

const initialState: LoginActionState = { status: "idle" };

const inputClassName =
  "h-13 w-full rounded-xl border border-ink/15 bg-white pl-12 pr-4 text-[0.95rem] font-medium text-ink outline-none transition placeholder:text-ink/30 focus:border-teal focus:ring-4 focus:ring-teal/10 aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-red-500/10";

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const emailError = state.fieldErrors?.email?.[0];
  const passwordError = state.fieldErrors?.password?.[0];

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      {nextPath ? <input name="next" type="hidden" value={nextPath} /> : null}
      {state.message ? (
        <div className="rounded-xl border border-red-600/15 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800" role="alert">
          {state.message}
        </div>
      ) : null}

      <div>
        <label className="text-sm font-bold text-ink" htmlFor="email">
          Work email
        </label>
        <div className="relative mt-2">
          <Mail aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink/35" />
          <input
            aria-describedby={emailError ? "email-error" : undefined}
            aria-invalid={Boolean(emailError)}
            autoComplete="email"
            className={inputClassName}
            defaultValue={state.values?.email}
            id="email"
            maxLength={254}
            name="email"
            placeholder="you@company.com"
            required
            type="email"
          />
        </div>
        {emailError ? <p className="mt-2 text-xs font-semibold text-red-700" id="email-error">{emailError}</p> : null}
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm font-bold text-ink" htmlFor="password">
            Password
          </label>
          <span className="text-xs font-semibold text-ink/40">8–72 characters</span>
        </div>
        <div className="relative mt-2">
          <LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink/35" />
          <input
            aria-describedby={passwordError ? "password-error" : undefined}
            aria-invalid={Boolean(passwordError)}
            autoComplete="current-password"
            className={cn(inputClassName, "pr-12")}
            id="password"
            maxLength={72}
            minLength={1}
            name="password"
            placeholder="Enter your password"
            required
            type={showPassword ? "text" : "password"}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-ink/40 transition hover:bg-ink/5 hover:text-ink"
            onClick={() => setShowPassword((visible) => !visible)}
            type="button"
          >
            {showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
          </button>
        </div>
        {passwordError ? <p className="mt-2 text-xs font-semibold text-red-700" id="password-error">{passwordError}</p> : null}
      </div>

      <Button className="h-13 w-full" disabled={pending} size="lg" type="submit">
        {pending ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <LogIn aria-hidden="true" />}
        {pending ? "Signing in…" : "Sign in securely"}
      </Button>
    </form>
  );
}
