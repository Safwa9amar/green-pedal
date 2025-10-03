"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bike,
  LayoutDashboard,
  List,
  MapPin,
  Settings,
} from "lucide-react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "./Logo";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/stations", icon: MapPin, label: "Stations" },
  { href: "/dashboard/bikes", icon: Bike, label: "Bikes" },
  { href: "/dashboard/rentals", icon: List, label: "Rentals" },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex h-16 items-center gap-3 px-3">
          <Logo className="h-8 w-8 shrink-0 text-primary" />
          <div className="overflow-hidden">
            <h1 className="truncate font-headline text-lg font-semibold text-sidebar-foreground">
              Green Pedal
            </h1>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, side: "right" }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span className="truncate">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard/settings"}
              tooltip={{ children: "Settings", side: "right" }}
            >
              <Link href="#">
                <Settings />
                <span className="truncate">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
