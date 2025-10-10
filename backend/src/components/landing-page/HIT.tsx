import React from "react";
import { motion } from "framer-motion";
import { fadeIn, fadeInLeft, fadeInRight, fadeInUp } from "./animation";

export default function HIT() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      variants={fadeInUp}
      viewport={{ once: true }}
      id="how"
      className="max-w-6xl mx-auto px-6 py-12"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Get Rolling in 3 Simple Steps</h2>
        <p className="text-gray-600 mt-2">
          Start your eco-friendly commute in less than two minutes.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInLeft}
          viewport={{ once: true }}
          className="p-6 bg-white rounded-xl shadow-sm text-center"
        >
          <div className="mx-auto w-50 h-50 rounded-lg bg-green-50 grid place-items-center text-green-600 text-2xl">
            <img src="/icon-download-signup.png" className="rounded-lg" />
          </div>
          <h3 className="mt-4 font-semibold">Download & Sign Up</h3>
          <p className="text-gray-500 mt-2">
            Create your account in under 2 minutes.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true }}
          className="p-6 bg-white rounded-xl shadow-sm text-center"
        >
          <div className="mx-auto w-50 h-50 rounded-lg bg-green-50 grid place-items-center text-green-600 text-2xl">
            <img src="/icon-find-unlock.png" className="rounded-lg" />
          </div>
          <h3 className="mt-4 font-semibold">Find & Unlock</h3>
          <p className="text-gray-500 mt-2">
            Locate nearby bikes and scan to unlock.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInRight}
          viewport={{ once: true }}
          className="p-6 bg-white rounded-xl shadow-sm text-center"
        >
          <div className="mx-auto w-50 h-50 rounded-lg bg-green-50 grid place-items-center text-green-600 text-2xl">
            <img src="/icon-ride-return.png" className="rounded-lg" />
          </div>
          <h3 className="mt-4 font-semibold">Ride & Return</h3>
          <p className="text-gray-500 mt-2">
            Enjoy your ride and drop off at any station.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
