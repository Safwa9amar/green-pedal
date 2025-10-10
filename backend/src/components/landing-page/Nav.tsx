import React from "react";
import { fadeIn } from "./animation";
import { motion } from "framer-motion";

export default function Nav() {
  return (
    <motion.header
      initial="hidden"
      whileInView="visible"
      variants={fadeIn}
      viewport={{ once: true }}
      className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold">
          GP
        </div>
        <div className="font-semibold text-lg">Green Pedal</div>
      </div>
      <nav className="hidden md:flex gap-6 items-center text-sm text-gray-600">
        <a href="#how" className="hover:text-gray-900">
          How it works
        </a>
        <a href="#features" className="hover:text-gray-900">
          Features
        </a>
        <a href="#pricing" className="hover:text-gray-900">
          Pricing
        </a>
        <a href="#download" className="hover:text-gray-900">
          Download
        </a>
        <button className="ml-2 bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:opacity-95">
          Sign in
        </button>
      </nav>
      <div className="md:hidden">
        <button className="p-2 rounded-md bg-gray-100">☰</button>
      </div>
    </motion.header>
  );
}
