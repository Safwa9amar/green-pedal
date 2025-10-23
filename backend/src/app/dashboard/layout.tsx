import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import Header from "@/components/layout/Header";
import SidebarNav from "@/components/layout/SidebarNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Always open sidebar on desktop by default, let user collapse it.
  const isServer = typeof window === "undefined";
  const defaultOpen = isServer ? true : window?.innerWidth > 768;

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex h-screen flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
