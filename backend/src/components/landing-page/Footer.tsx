"use client";
import { motion } from "framer-motion";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <motion.footer
      className="relative bg-gray-900 text-gray-300 py-8 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      {/* Animated gradient line at the top */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-yellow-400 to-blue-600"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="w-10 h-10 rounded-lg bg-green-500 grid place-items-center text-white font-bold shadow-lg"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              GP
            </motion.div>
            <div className="font-semibold text-white">Green Pedal</div>
          </motion.div>

          <p className="mt-4 text-sm text-gray-400">
            Green Pedal © {year} — Bringing eco-friendly mobility to your city.
          </p>
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="font-semibold text-white">Links</div>
          <ul className="mt-3 space-y-2 text-sm text-gray-400">
            {["About Us", "Privacy Policy", "Terms of Service", "Support"].map(
              (link, i) => (
                <motion.li key={i} whileHover={{ x: 5 }}>
                  <a href="#" className="hover:text-white transition-colors">
                    {link}
                  </a>
                </motion.li>
              )
            )}
          </ul>
        </motion.div>

        {/* Social & Contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="font-semibold text-white">Follow</div>
          <div className="mt-3 flex gap-3">
            {["Facebook", "Twitter", "Instagram"].map((platform, i) => (
              <motion.a
                key={i}
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ y: -3, scale: 1.1 }}
              >
                {platform}
              </motion.a>
            ))}
          </div>

          <div className="mt-6 text-sm text-gray-500">
            Contact:{" "}
            <a
              href="mailto:hello@greenpedal.example"
              className="hover:underline text-gray-300"
            >
              hello@greenpedal.example
            </a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
