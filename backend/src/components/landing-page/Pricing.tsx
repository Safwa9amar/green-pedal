import React from "react";
import { motion } from "framer-motion";

export default function Pricing() {
  return (
    <motion.section
      id="pricing"
      initial="hidden"
      whileInView="visible"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
      }}
      viewport={{ once: true }}
      className="bg-white py-12"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
        className="max-w-6xl mx-auto px-6 text-center"
      >
        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="text-2xl font-bold"
        >
          Simple, Transparent Pricing
        </motion.h2>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="text-gray-600 mt-2"
        >
          Pay-per-minute rates with student and commuter packages.
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
          }}
          className="mt-8 grid md:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Pay as you ride",
              price: "15 DZD/min",
              desc: "No subscription required. Perfect for occasional riders.",
              highlight: false,
            },
            {
              title: "Commuter Pack",
              price: "Monthly Plan",
              desc: "Best for daily riders and workers.",
              highlight: true,
            },
            {
              title: "Student Pack",
              price: "Discounted Rates",
              desc: "Proof of student status required to activate discounts.",
              highlight: false,
            },
          ].map((plan, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 },
              }}
              whileHover={{ scale: 1.05 }}
              className={`p-6 border rounded-xl transition-all duration-300 ${
                plan.highlight ? "shadow-2xl bg-green-50" : "shadow-sm bg-white"
              }`}
            >
              <div className="text-xl font-semibold">{plan.title}</div>
              <div className="mt-2 text-3xl font-extrabold text-green-600">
                {plan.price}
              </div>
              <p className="text-gray-500 mt-4">{plan.desc}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="mt-6 w-full bg-green-600 text-white py-2 rounded-md"
              >
                Choose
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
