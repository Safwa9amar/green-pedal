"use client";
import TestimonialsSection from "@/components/landing-page/TestimonialsSection";
import FAQSection from "@/components/landing-page/FAQSection";
import DownloadCTA from "@/components/landing-page/DownloadCTA";
import Footer from "@/components/landing-page/Footer";
import Screenshoot from "@/components/landing-page/Screenshoot";
import Pricing from "@/components/landing-page/Pricing";
import Benefits from "@/components/landing-page/Benefits";
import Features from "@/components/landing-page/Features";
import HIT from "@/components/landing-page/HIT";
import Hero from "@/components/landing-page/Hero";
import Nav from "@/components/landing-page/Nav";

import { redirect } from "next/navigation";

export default function GreenPedalLandingPage() {
  // return redirect("./  ");
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800">
      {/* NAV */}
      <Nav />
      {/* HERO */}
      <Hero />

      {/* HOW IT WORKS */}
      <HIT />
      {/* FEATURES */}
      <Features />

      {/* BENEFITS */}
      <Benefits />

      {/* PRICING */}
      <Pricing />
      {/* APP SCREENSHOTS */}
      <Screenshoot />

      {/* SOCIAL PROOF */}
      <TestimonialsSection />
      {/* FAQ */}
      <FAQSection />
      {/* DOWNLOAD CTA */}
      <DownloadCTA />

      <Footer />
    </div>
  );
}
