import React from "react";
import { motion } from "framer-motion";
import { fadeIn, fadeInLeft, fadeInRight } from "./animation";

export default function Benefits() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      variants={fadeIn}
      viewport={{ once: true }}
      className="max-w-6xl mx-auto px-6 py-12"
    >
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInLeft}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold">More Than Just a Bike</h2>
          <p className="text-gray-600 mt-2">
            Green Pedal helps you save money, time and the planet.
          </p>

          <ul className="mt-6 space-y-4">
            <li className="flex items-start gap-4">
              <div className="rounded-full p-3 bg-green-50 text-green-600">
                💰
              </div>
              <div>
                <div className="font-semibold">Save Money</div>
                <div className="text-gray-500 text-sm">
                  Affordable per-minute pricing with no hidden fees.
                </div>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="rounded-full p-3 bg-green-50 text-green-600">
                ⏱️
              </div>
              <div>
                <div className="font-semibold">Save Time</div>
                <div className="text-gray-500 text-sm">
                  Skip traffic and parking hassles.
                </div>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="rounded-full p-3 bg-green-50 text-green-600">
                💪
              </div>
              <div>
                <div className="font-semibold">Stay Healthy</div>
                <div className="text-gray-500 text-sm">
                  Integrate exercise into your daily commute.
                </div>
              </div>
            </li>

            <li className="flex items-start gap-4">
              <div className="rounded-full p-3 bg-green-50 text-green-600">
                🌍
              </div>
              <div>
                <div className="font-semibold">Help the Planet</div>
                <div className="text-gray-500 text-sm">
                  Every ride reduces CO2 emissions.
                </div>
              </div>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInRight}
          viewport={{ once: true }}
          className="rounded-xl overflow-hidden"
        >
          <img
            src="/benefits-rider-happy.jpg"
            alt="Benefits"
            className="w-full h-80 object-cover rounded-xl shadow"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
