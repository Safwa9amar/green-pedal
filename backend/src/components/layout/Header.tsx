"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlaceHolderImages } from "@/lib/placeholder-images";

function getPageTitle(pathname: string): string {
  const normalizedPath = pathname.toLowerCase();
  if (normalizedPath === "/dashboard") return "Dashboard";
  if (normalizedPath.startsWith("/dashboard/stations")) return "Stations";
  if (normalizedPath.startsWith("/dashboard/bikes")) return "Bikes";
  if (normalizedPath.startsWith("/dashboard/rentals")) return "Rentals";
  return "Green Pedal";
}

export default function Header() {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
  const avatarImage = PlaceHolderImages.find((p) => p.id === "avatar");

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1">
        <h1 className="text-2xl font-bold font-headline text-foreground">
          {pageTitle}
        </h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-9 w-9">
              {avatarImage && (
                <AvatarImage
                  src={avatarImage.imageUrl}
                  alt="Admin"
                  data-ai-hint={avatarImage.imageHint}
                />
              )}
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="#">
              <User className="mr-2" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/login">
              <LogOut className="mr-2" />
              <span>Logout</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
