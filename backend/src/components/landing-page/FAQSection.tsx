"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I start a ride?",
      a: "Simply scan the QR code on a Green Pedal bike using the app and start riding instantly.",
    },
    {
      q: "Do I need an internet connection to ride?",
      a: "Yes, a stable internet connection is required to unlock and end rides properly.",
    },
    {
      q: "What happens if my phone battery dies during a ride?",
      a: "Your ride remains active. Once your phone restarts, open the app to end your ride and view your trip summary.",
    },
    {
      q: "Is there a student discount?",
      a: "Yes! Students can verify their ID in the app and enjoy discounted ride rates.",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      {/* Header Animation */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold">Questions? We’ve Got Answers</h2>
        <p className="text-gray-600 mt-2">Common questions from new riders.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* FAQ LIST */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {faqs.map((f, i) => (
            <motion.div
              key={i}
              className="border rounded-lg overflow-hidden mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <button
                className="w-full text-left px-4 py-3 flex items-center justify-between"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-medium">{f.q}</span>
                <motion.span
                  animate={{ rotate: openFaq === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-500 text-xl leading-none"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="px-4 pb-4 text-gray-600"
                  >
                    {f.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* QR & STORE BADGES */}
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-40 h-40 bg-gray-100 grid place-items-center rounded-lg shadow-inner"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-500 font-semibold text-lg"
            >
              QR
            </motion.span>
          </motion.div>

          <motion.div
            className="mt-4 text-center text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Scan to download the app or click the badges below.
          </motion.div>

          <motion.div
            className="mt-4 flex gap-3"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
          >
            <img
              src="/assets/app-store-badge.svg"
              alt="App Store"
              className="h-10 hover:scale-105 transition-transform"
            />
            <img
              src="/assets/play-store-badge.svg"
              alt="Google Play"
              className="h-10 hover:scale-105 transition-transform"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
