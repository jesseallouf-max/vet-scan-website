import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="section pt-6 md:pt-10 pb-6 md:pb-10" aria-labelledby="hero-heading">
      <div className="md:grid md:grid-cols-2 md:items-center md:gap-10">
        {/* Image — now on the left, visible on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.22, delay: 0.05 }}
          className="relative hidden md:block order-1"
        >
          <div className="relative w-full h-[420px] rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 bg-white">
            <Image
              src="/images/headshot.jpg"
              alt="Dr. Amelia Khan with a canine patient in a Manhattan clinic exam room."
              fill
              priority
              sizes="(min-width: 768px) 520px, 100vw"
              className="object-cover object-center"
            />
          </div>
        </motion.div>

        {/* Copy column — now on the right */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2 }}
          className="order-2"
        >
          <h1
            id="hero-heading"
            className="max-w-2xl text-4xl sm:text-5xl md:text-6xl leading-none tracking-tight text-left"
          >
            <strong 
              className="text-teal-700" 
              style={{ 
                backgroundColor: 'rgba(244,238,226, 0.4)',
                fontWeight: 900,
                WebkitFontSmoothing: 'antialiased',
                padding: '8px 8px 12px 8px',
                borderRadius: '6px',
                boxDecorationBreak: 'clone',
                WebkitBoxDecorationBreak: 'clone',
                marginBottom: '8px',
                display: 'inline-block'
              }}
            >
              Expert Ultrasound
            </strong>
            <br />
            <span className="text-gray-900" style={{ fontWeight: 400 }}>at Your Hospital</span>
          </h1>

          <p className="mt-4 md:mt-6 text-xl md:text-2xl font-semibold text-teal-700 leading-tight text-left" style={{ marginLeft: '8px' }}>
            Clear Images, Clearer Answers
          </p>
         
          {/* Primary CTA — Single responsive button */}
          <div className="mt-8 md:mt-10 flex justify-center md:justify-start" style={{ marginLeft: '8px' }}>
            <a
              href="#contact"
              aria-label="Request a scan"
              data-event="hero_request_scan"
              className="btn-hero-responsive"
            >
              BOOK NOW
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}