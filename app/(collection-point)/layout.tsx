"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SampleDataNotice } from "@/components/layout/SampleDataNotice";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { StaffHeader } from "@/components/navigation/StaffHeader";

// Screens in this group that read real data from the API. The rest still show
// sample figures and keep the notice until they are moved over.
const LIVE_SCREENS = ["/verify", "/cp-dashboard"];

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <RequireAuth allow={["collection_point", "admin"]}>
      <StaffHeader area="collection_point" />
      {!LIVE_SCREENS.includes(pathname) && <SampleDataNotice />}
      {children}
    </RequireAuth>
  );
}
