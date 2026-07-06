"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <div className="font-body">{children}</div>;
  }

  return (
    <div className="flex font-body">
      <AdminSidebar />
      <div className="flex-1 min-h-screen bg-[#f4f3ef] text-ink p-8 md:p-10">{children}</div>
    </div>
  );
}
