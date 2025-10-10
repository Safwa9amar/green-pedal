"use client";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <section className="bg-green-50 py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Animated title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl font-bold"
        >
          Loved by Riders Everywhere
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-gray-600 mt-2"
        >
          Real stories from real riders.
        </motion.p>

        {/* Testimonial cards */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Amira B.",
              location: "Algiers",
              text: "“Green Pedal changed my commute — faster, cheaper, and greener!”",
            },
            {
              name: "Yacine K.",
              location: "Student",
              text: "“I use it daily to get to university. Love the student discounts!”",
            },
            {
              name: "Karim R.",
              location: "Commuter",
              text: "“Reliable and easy to use. The map view is a lifesaver.”",
            },
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants as any}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.2 }}
                  viewport={{ once: true }}
                  className="w-12 h-12 rounded-full bg-gray-200"
                />
                <div className="text-left">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">
                    {testimonial.location}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-gray-600">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
