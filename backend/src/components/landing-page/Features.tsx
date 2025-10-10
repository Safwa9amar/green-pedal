import React from "react";
import { fadeIn, fadeInLeft, fadeInRight } from "./animation";
import { motion } from "framer-motion";

export default function Features() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      variants={fadeIn}
      viewport={{ once: true }}
      id="features"
      className="bg-white py-12"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInLeft}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold">Why Choose Green Pedal?</h2>
          <p className="text-gray-600 mt-2">
            A smarter, cleaner way to move through your city.
          </p>

          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              [
                "Real-Time Availability",
                "See bike and station availability instantly",
              ],
              [
                "Find Stations Easily",
                "Interactive map shows all nearby locations",
              ],
              ["Quick QR Unlock", "Scan and go in seconds"],
              [
                "Flexible Payment",
                "Easy balance recharge and transparent pricing",
              ],
              [
                "Secure & Private",
                "Your data is protected with industry-standard encryption",
              ],
              [
                "Eco-Friendly Travel",
                "Reduce your carbon footprint with every ride",
              ],
            ].map(([title, desc], i) => (
              <li
                key={i}
                className="p-4 rounded-lg border border-gray-100 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-md bg-green-50 grid place-items-center text-green-600">
                    ✓
                  </div>
                  <div>
                    <div className="font-semibold">{title}</div>
                    <div className="text-gray-500 text-sm">{desc}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInRight}
          viewport={{ once: true }}
        >
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src="/features-grid.png"
              alt="Map"
              className="w-full h-96 object-cover"
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
