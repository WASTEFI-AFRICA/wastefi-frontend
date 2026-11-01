"use client";

import { ReactNode } from "react";
import { SampleDataNotice } from "@/components/layout/SampleDataNotice";
import { RequireAuth } from "@/components/auth/RequireAuth";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth allow={["collection_point", "admin"]}>
      <SampleDataNotice />
      {children}
    </RequireAuth>
  );
}
