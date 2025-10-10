import React from "react";
import { fadeInUp } from "./animation";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      variants={fadeInUp}
      viewport={{ once: true }}
      className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center py-12"
    >
      <div className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
          Ride Green, Live Clean
          <span className="block text-green-600">
            Your City's Smart Bike Sharing Solution
          </span>
        </h1>
        <p className="text-gray-600">
          Unlock a bike in seconds. Ride anywhere. Return at any station.
        </p>

        <div className="flex gap-4 items-center">
          <a
            href="#download"
            className="inline-flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-lg shadow hover:shadow-lg hover:scale-[1.01] transition"
          >
            {/* Download Icon */}
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3v12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 11l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download App
          </a>
          <a
            href="#how"
            className="inline-flex items-center gap-2 text-green-700 px-4 py-2 rounded-lg border border-green-100 hover:bg-green-50"
          >
            Learn More
          </a>
        </div>

        {/* App store badges - placeholders */}
        {/* <div className="flex items-center gap-4">
            <a href="#" className="inline-block">
              <img
                src="/assets/app-store-badge.svg"
                alt="App Store"
                className="h-10"
              />
            </a>
            <a href="#" className="inline-block">
              <img
                src="/assets/play-store-badge.svg"
                alt="Google Play"
                className="h-10"
              />
            </a>
          </div> */}

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-700 font-semibold">
              ★
            </div>
            <div>
              <div className="text-sm font-medium">4.8/5</div>
              <div className="text-xs">Based on rider reviews</div>
            </div>
          </div>

          <div className="h-8 border-l" />

          <div className="text-sm">25,000+ active riders</div>
        </div>
      </div>

      <div className="relative">
        {/* Hero image placeholder */}
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img
            src="/hero-bike.png"
            alt="Riding Green Pedal"
            className="w-full h-80 object-cover"
          />
        </div>

        {/* QR / phone mockup */}
        <div className="absolute -bottom-6 left-6 w-44 bg-white rounded-xl p-3 shadow-lg hidden md:block">
          <div className="text-xs text-gray-500">Scan to download</div>
          <div className="mt-2 bg-gray-100 p-2 rounded-md flex items-center justify-center">
            <div className="w-24 h-24 bg-white grid place-items-center">QR</div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
