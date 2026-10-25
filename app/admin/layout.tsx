
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LestariProject Admin",
  manifest: "/admin.webmanifest",
  themeColor: "#070d19",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
