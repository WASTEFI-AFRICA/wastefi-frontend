"use client";

import { ReactNode } from "react";
import { SampleDataNotice } from "@/components/layout/SampleDataNotice";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { StaffHeader } from "@/components/navigation/StaffHeader";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth allow={["admin"]}>
      <StaffHeader area="admin" />
      <SampleDataNotice />
      {children}
    </RequireAuth>
  );
}
