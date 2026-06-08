"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useT } from "@/lib/i18n/LanguageProvider";
import Avatar from "@/components/ui/Avatar";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const { t, href } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (status === "loading") {
    return <span className="hidden h-9 w-20 animate-pulse rounded-full bg-bg-muted/50 md:inline-block" />;
  }

  if (!session?.user) {
    return (
      <Link href={href("/login")} className="btn-ghost hidden md:inline-flex">
        {t("nav.login")}
      </Link>
    );
  }

  const isStaff = session.user.role === "DIRECTOR" || session.user.role === "STAFF";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-line bg-bg-elevated/95 px-1.5 py-1 text-sm shadow-card transition hover:border-accent"
      >
        <Avatar src={session.user.image} name={session.user.name} email={session.user.email} size="sm" />
        <span className="hidden max-w-[112px] truncate text-fg-soft lg:inline">
          {session.user.name ?? session.user.email}
        </span>
      </button>
      {open && (
        <div className="absolute end-0 z-50 mt-2 w-56 overflow-hidden rounded-lg border border-line bg-bg-elevated shadow-soft">
          <div className="border-b border-line px-4 py-3">
            <div className="truncate text-sm font-medium">{session.user.name ?? "—"}</div>
            <div className="truncate text-xs text-fg-mute">{session.user.email}</div>
            {isStaff && (
              <span className="mt-1.5 inline-block rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                {session.user.role}
              </span>
            )}
          </div>
          <MenuLink onClick={() => setOpen(false)} href={href("/account")}>{t("nav.account")}</MenuLink>
          {isStaff && (
            <MenuLink onClick={() => setOpen(false)} href={href("/admin")}>Admin</MenuLink>
          )}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: href("/") })}
            className="block w-full px-4 py-2.5 text-start text-sm text-fg-soft transition hover:bg-bg-muted hover:text-fg"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2.5 text-sm text-fg-soft transition hover:bg-bg-muted hover:text-fg"
    >
      {children}
    </Link>
  );
}
