import { ReactNode } from "react";
import { SampleDataNotice } from "@/components/layout/SampleDataNotice";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SampleDataNotice />
      {children}
    </>
  );
}
