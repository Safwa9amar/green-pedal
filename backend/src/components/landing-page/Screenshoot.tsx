import React from "react";
import { motion } from "framer-motion";
export default function Screenshoot() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, staggerChildren: 0.2 },
        },
      }}
      viewport={{ once: true }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
        className="text-center mb-8"
      >
        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="text-2xl font-bold"
        >
          Experience Green Pedal
        </motion.h2>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          className="text-gray-600 mt-2"
        >
          A preview of the app — from map view to ride history.
        </motion.p>
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
        }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center justify-center"
      >
        {[
          { src: "/app-screenshot/map.jpeg", alt: "Map" },
          { src: "/app-screenshot/qr.jpeg", alt: "QR" },
          { src: "/app-screenshot/ride.jpeg", alt: "Ride" },
          { src: "/app-screenshot/balance.jpeg", alt: "Balance" },
          { src: "/app-screenshot/profile.jpeg", alt: "Profile" },
        ].map((item, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 },
            }}
            whileHover={{ scale: 1.05, y: -8 }}
            transition={{ type: "spring", stiffness: 120 }}
            className={`col-span-2 md:col-span-1 p-2 ${
              i === 4 ? "hidden md:block" : ""
            }`}
          >
            <motion.img
              src={item.src}
              alt={item.alt}
              className="rounded-2xl shadow w-full h-96 object-fill"
              whileHover={{ rotate: [0, -1, 1, 0] }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
