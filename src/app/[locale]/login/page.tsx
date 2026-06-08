import { Suspense } from "react";
import LoginClient from "@/components/pages/LoginClient";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginClient />
    </Suspense>
  );
}
