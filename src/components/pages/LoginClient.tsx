"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useT } from "@/lib/i18n/LanguageProvider";

const DEMO_ACCOUNTS = [
  { label: "Admin", email: "admin@lors.local", password: "Admin123!", hint: "full panel" },
  { label: "Staff", email: "staff@lors.local", password: "Staff123!", hint: "orders/catalog" },
  { label: "User", email: "user@lors.local", password: "User123!", hint: "account/orders" },
] as const;

export default function LoginClient() {
  const { t, href } = useT();
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") ?? href("/account");
  const showDemoAccounts = process.env.NODE_ENV !== "production";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "register") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error === "email_taken" ? "Email already registered" : "Registration failed");
        }
      }
      const result = await signIn("credentials", { email, password, redirect: false, callbackUrl });
      if (result?.error) throw new Error("Invalid credentials");
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const googleSignIn = () => signIn("google", { callbackUrl });
  const fillDemoAccount = (account: (typeof DEMO_ACCOUNTS)[number]) => {
    setMode("login");
    setName("");
    setEmail(account.email);
    setPassword(account.password);
    setError(null);
  };

  return (
    <div className="container-app py-14 md:py-20">
      <div className="mx-auto max-w-md">
        <div className="card p-8">
          <h1 className="font-display text-2xl font-bold">
            {mode === "login" ? t("nav.login") : t("nav.register")}
          </h1>
          <p className="mt-1 text-sm text-fg-soft">LORS</p>

          {showDemoAccounts && (
            <div className="mt-6 rounded-lg border border-line bg-bg-subtle p-3">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-mute">
                Test accounts
              </div>
              <div className="mt-3 grid gap-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => fillDemoAccount(account)}
                    className="flex items-center justify-between gap-3 rounded-lg border border-line bg-bg-elevated px-3 py-2 text-start transition hover:border-line-strong hover:bg-bg"
                  >
                    <span>
                      <span className="block text-sm font-semibold">{account.label}</span>
                      <span className="block text-xs text-fg-mute">{account.email}</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-accent/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                      {account.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={googleSignIn}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-line bg-bg-elevated py-3 text-sm font-medium transition hover:border-line-strong"
          >
            <GoogleIcon />
            <span>{t("auth.continueGoogle")}</span>
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-fg-mute">
            <span className="h-px flex-1 bg-line" />
            <span>{t("auth.or")}</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <Field label={t("checkout.firstName")} value={name} onChange={setName} required />
            )}
            <Field label={t("checkout.email")} type="email" value={email} onChange={setEmail} required />
            <Field label={t("auth.password")} type="password" value={password} onChange={setPassword} required minLength={6} />
            {error && <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-60">
              {loading ? "..." : mode === "login" ? t("nav.login") : t("nav.register")}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-fg-soft">
            {mode === "login" ? (
              <>
                <span>{t("auth.noAccount")} </span>
                <button onClick={() => setMode("register")} className="font-medium text-fg underline">
                  {t("nav.register")}
                </button>
              </>
            ) : (
              <>
                <span>{t("auth.haveAccount")} </span>
                <button onClick={() => setMode("login")} className="font-medium text-fg underline">
                  {t("nav.login")}
                </button>
              </>
            )}
          </div>
        </div>

        <Link href={href("/")} className="mt-6 block text-center text-xs text-fg-mute hover:text-fg">
          ← {t("nav.home")}
        </Link>
      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  required,
  minLength,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-fg-soft">{label}{required && " *"}</span>
      <input
        type={type}
        required={required}
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
        autoComplete={type === "password" ? "current-password" : type === "email" ? "email" : undefined}
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  );
}
