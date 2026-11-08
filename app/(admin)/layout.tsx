"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SampleDataNotice } from "@/components/layout/SampleDataNotice";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { StaffHeader } from "@/components/navigation/StaffHeader";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <RequireAuth allow={["admin"]}>
      <StaffHeader area="admin" />
      {pathname !== "/users" ? <SampleDataNotice /> : null}
      {children}
    </RequireAuth>
  );
}
