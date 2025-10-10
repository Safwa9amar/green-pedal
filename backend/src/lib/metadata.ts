// app/metadata.ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Green Pedal – Eco-friendly Bike Sharing for a Cleaner City",
  description:
    "Join Green Pedal to ride electric bikes, reduce your carbon footprint, and make your city greener. Track your rides, balance, and impact in real-time with our smart app.",
  keywords: [
    "Green Pedal",
    "bike sharing",
    "eco mobility",
    "electric bikes",
    "sustainable transport",
    "green city",
    "environment",
    "clean transport",
    "cycling app",
    "ride tracking",
  ],
  authors: [{ name: "Green Pedal Team" }],
  creator: "Green Pedal",
  publisher: "Green Pedal",
  metadataBase: new URL("https://greenpedal.ataa-platform.com"),
  openGraph: {
    title: "Green Pedal – Ride for a Greener City",
    description:
      "Discover eco-friendly mobility with Green Pedal. Unlock a bike near you, enjoy sustainable rides, and contribute to a cleaner future.",
    url: "https://greenpedal.ataa-platform.com",
    siteName: "Green Pedal",
    images: [
      {
        url: "/assets/og-greenpedal.jpg",
        width: 1200,
        height: 630,
        alt: "Green Pedal App – Ride for a Cleaner City",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Green Pedal – Eco Bike Sharing App",
    description:
      "Eco-friendly bike sharing for everyone. Ride green, save energy, and make your city cleaner with Green Pedal.",
    creator: "@greenpedal",
    images: ["/assets/og-greenpedal.jpg"],
  },
 robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
},

};
