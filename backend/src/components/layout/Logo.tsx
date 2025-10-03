import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return <Image alt="logo" src="/logo.png" width={50} height={50} />;
}
