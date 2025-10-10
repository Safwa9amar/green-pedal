import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Script from "next/script";
export const metadata: Metadata = {
  title: "Green Pedal Admin",
  description: "Admin Dashboard for Green Pedal bike sharing system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MobileApplication",
              name: "Green Pedal",
              operatingSystem: "Android, iOS",
              applicationCategory: "TravelApplication",
              description:
                "Green Pedal is a smart eco-friendly bike sharing app that promotes sustainable mobility and clean cities.",
              url: "https://greenpedal.ataa-platform.com",
              image:
                "https://greenpedal.ataa-platform.com/assets/og-greenpedal.jpg",
              author: {
                "@type": "Organization",
                name: "Green Pedal",
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased dark">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
