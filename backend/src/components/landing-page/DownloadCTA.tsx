"use client";
import { motion } from "framer-motion";

export default function DownloadCTA() {
  return (
    <motion.section
      id="download"
      className="bg-gradient-to-r from-green-500 to-blue-700 text-white py-12 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold">
            Ready to Ride Green?
          </h2>
          <p className="text-white/90 mt-2 text-base md:text-lg">
            Join thousands of riders making their city cleaner, one pedal at a
            time.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Main CTA */}
          <motion.a
            href="#"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(255,255,255,0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-green-700 rounded-lg px-6 py-3 font-semibold shadow-lg relative overflow-hidden"
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-0"
              whileHover={{ opacity: 0.2 }}
              transition={{ duration: 0.3 }}
            />
            Get Started Now
          </motion.a>

          {/* Store Badges */}
          <motion.div
            className="hidden sm:flex gap-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            viewport={{ once: true }}
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="/assets/app-store-badge-dark.svg"
              alt="App Store"
              className="h-10"
            />
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="/assets/play-store-badge-dark.svg"
              alt="Google Play"
              className="h-10"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
